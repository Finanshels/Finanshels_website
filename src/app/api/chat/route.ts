import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  tool,
  convertToModelMessages,
  type UIMessage,
} from 'ai'
import { z } from 'zod'

import {
  appendMessages,
  ensureSession,
  getConversation,
  setIntent,
  updateLeadAndSync,
} from '@/lib/chat/leadRepository'
import { searchSiteContent } from '@/lib/chat/siteSearch'
import {
  checkRateLimit,
  classifyIntent,
  detectHighIntent,
  enforcePricingGuard,
  extractClientIp,
  hashIp,
  isValidEmail,
  isValidPhone,
} from '@/lib/chat/guards'
import { SYSTEM_PROMPT } from '@/lib/chat/prompt'
import { matchQuickReply } from '@/lib/chat/quickReplies'
import { buildSiteAnswer } from '@/lib/chat/siteAnswer'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

const SESSION_COOKIE_NAME = 'finanshels_chat_session'
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

const MODEL_ID = process.env.CHAT_MODEL_ID ?? 'anthropic/claude-haiku-4-5'
const MAX_MESSAGE_LEN = 2_000
const MAX_HISTORY_TURNS = 24

function generateSessionId(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

function messageId(): string {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

function synthesizeAssistantReply(text: string, sessionId: string): Response {
  const assistantMessageId = messageId()
  const textPartId = messageId()
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({ type: 'start', messageId: assistantMessageId })
      writer.write({ type: 'start-step' })
      writer.write({ type: 'text-start', id: textPartId })
      writer.write({ type: 'text-delta', id: textPartId, delta: text })
      writer.write({ type: 'text-end', id: textPartId })
      writer.write({ type: 'finish-step' })
      writer.write({ type: 'finish' })
    },
  })
  // fire-and-forget persistence so the response returns immediately
  void appendMessages(sessionId, [
    { id: assistantMessageId, role: 'assistant', content: text },
  ]).catch((err) => {
    console.warn(
      '[chat] failed to persist synthetic assistant message:',
      err instanceof Error ? err.message : err,
    )
  })
  return createUIMessageStreamResponse({
    stream,
    headers: { 'x-finanshels-session': sessionId },
  })
}

function uiMessageText(message: UIMessage): string {
  if (!message.parts) return ''
  return message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((p) => p.text)
    .join(' ')
    .slice(0, MAX_MESSAGE_LEN)
}

export async function POST(request: Request) {
  if (!process.env.AI_GATEWAY_API_KEY && !process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'chat_unconfigured', message: 'AI_GATEWAY_API_KEY (or provider key) is not set' },
      { status: 503 }
    )
  }

  const ip = extractClientIp(request.headers)
  const ipHash = hashIp(ip)
  const limit = checkRateLimit(ipHash)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfter: limit.retryAfterSeconds },
      { status: 429 }
    )
  }

  let body: { messages?: UIMessage[]; pageUrl?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-MAX_HISTORY_TURNS) : []
  if (messages.length === 0) {
    return NextResponse.json({ error: 'no_messages' }, { status: 400 })
  }

  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')
  if (!lastUserMessage) {
    return NextResponse.json({ error: 'no_user_message' }, { status: 400 })
  }
  const lastUserText = uiMessageText(lastUserMessage)

  const cookieStore = await cookies()
  let sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!sessionId) {
    sessionId = generateSessionId()
    cookieStore.set({
      name: SESSION_COOKIE_NAME,
      value: sessionId,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SESSION_COOKIE_MAX_AGE,
    })
  }
  const persistedSessionId: string = sessionId

  await ensureSession({
    sessionId: persistedSessionId,
    ipHash,
    userAgent: request.headers.get('user-agent') ?? undefined,
    pageUrl: body.pageUrl,
  })

  const intent = classifyIntent(lastUserText)
  if (intent.confidence === 'high') {
    await setIntent(persistedSessionId, intent.intent)
  }

  await appendMessages(persistedSessionId, [
    {
      id: lastUserMessage.id ?? messageId(),
      role: 'user',
      content: lastUserText,
    },
  ])

  const highIntent = detectHighIntent(lastUserText)
  const systemSuffix = highIntent
    ? '\n\nThe user just sent a high-intent message. Your next reply should warmly offer to capture their details via the captureLead tool.'
    : ''

  // ─── Tier 1: canned options (no AI, no network) ───────────────────────────
  const quick = matchQuickReply(lastUserText)
  if (quick) {
    return synthesizeAssistantReply(quick.text, persistedSessionId)
  }

  // ─── Tier 2: website RAG only (no AI) ─────────────────────────────────────
  try {
    const siteAnswer = await buildSiteAnswer(lastUserText)
    if (siteAnswer) {
      return synthesizeAssistantReply(siteAnswer.text, persistedSessionId)
    }
  } catch (err) {
    console.warn('[chat] site answer failed, falling through to AI:', err instanceof Error ? err.message : err)
  }

  // ─── Tier 3: AI fallback (gateway) ────────────────────────────────────────
  let lastSearchCorpus = ''

  const tools = {
    searchSiteContent: tool({
      description:
        'Search Finanshels.com for pages that match the visitor question. Returns title, URL, and a short excerpt. Always call before stating facts about Finanshels.',
      inputSchema: z.object({
        query: z.string().min(2).max(200).describe('Short keyword query'),
      }),
      execute: async ({ query }) => {
        const hits = await searchSiteContent(query, 3)
        lastSearchCorpus += '\n' + hits.map((h) => h.snippet).join('\n')
        return hits.map((h) => ({
          title: h.title,
          url: h.url,
          excerpt: h.snippet.slice(0, 1200),
        }))
      },
    }),
    captureLead: tool({
      description:
        'Save the visitor contact details to the CRM. Call as soon as the visitor shares name + email or phone. Each call merges with existing fields.',
      inputSchema: z.object({
        firstName: z.string().min(1).max(100).optional(),
        lastName: z.string().min(1).max(100).optional(),
        email: z.string().email().max(200).optional(),
        phone: z.string().max(40).optional(),
        companyName: z.string().max(200).optional(),
        companySize: z.string().max(60).optional(),
        intent: z.string().max(200).optional(),
      }),
      execute: async (input) => {
        if (input.email && !isValidEmail(input.email)) {
          return { ok: false, error: 'invalid_email' }
        }
        if (input.phone && !isValidPhone(input.phone)) {
          return { ok: false, error: 'invalid_phone' }
        }
        const summary = messages
          .map((m) => `${m.role}: ${uiMessageText(m)}`)
          .join('\n')
          .slice(0, 20_000)
        const result = await updateLeadAndSync(persistedSessionId, {
          ...input,
          pageUrl: body.pageUrl,
          conversationSummary: summary,
        })
        const status = result.conversation?.zohoStatus ?? 'pending'
        return {
          ok: true,
          status,
          message:
            status === 'synced'
              ? 'Saved — our team will reach out shortly.'
              : status === 'queued'
              ? 'Saved on our side; will be synced once integration is configured.'
              : 'Saved locally; sync pending.',
        }
      },
    }),
  }

  const result = streamText({
    model: MODEL_ID,
    system: SYSTEM_PROMPT + systemSuffix,
    messages: convertToModelMessages(messages),
    tools,
    stopWhen: ({ steps }) => steps.length >= 5,
    temperature: 0.4,
    onFinish: async ({ text }) => {
      try {
        const guardedText = enforcePricingGuard(text ?? '', lastSearchCorpus)
        await appendMessages(persistedSessionId, [
          {
            id: messageId(),
            role: 'assistant',
            content: guardedText,
          },
        ])
      } catch (err) {
        console.warn('[chat] failed to persist assistant message:', err instanceof Error ? err.message : err)
      }
    },
  })

  return result.toUIMessageStreamResponse({
    headers: {
      'x-finanshels-session': persistedSessionId,
    },
  })
}

export async function GET() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!sessionId) return NextResponse.json({ sessionId: null, messages: [] })
  const conv = await getConversation(sessionId)
  if (!conv) return NextResponse.json({ sessionId, messages: [] })
  return NextResponse.json({
    sessionId,
    messages: conv.messages,
    lead: conv.lead,
    zohoStatus: conv.zohoStatus,
  })
}
