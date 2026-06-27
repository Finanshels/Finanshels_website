import 'server-only'
import { createAnthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'
import { NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/cms/adminAuth'
import { buildPrompt } from '@/lib/cms/ai/prompts'
import { isAiGenerateField } from '@/lib/cms/ai/fieldMap'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const MODEL_IDS = {
  haiku: 'claude-haiku-4-5-20251001',
  sonnet: 'claude-sonnet-4-6',
} as const

const MAX_OUTPUT_TOKENS = {
  haiku: 700,
  sonnet: 2400,
} as const

export async function POST(request: Request) {
  // Auth — admin session required, mirrors every other /api/admin route.
  try {
    await requireAdminAuth()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim()
  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI generation is not configured. Set ANTHROPIC_API_KEY.' },
      { status: 503 },
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const field = String(body.field ?? '')
  if (!isAiGenerateField(field)) {
    return NextResponse.json({ error: 'Unknown field type' }, { status: 400 })
  }

  const tier = body.model === 'sonnet' ? 'sonnet' : 'haiku'
  const prompt = buildPrompt(field, {
    title: String(body.title ?? '').slice(0, 600),
    body: String(body.body ?? '').slice(0, 6000),
    fieldLabel: String(body.fieldLabel ?? '').slice(0, 120),
    collection: String(body.collection ?? '').slice(0, 80),
  })

  try {
    const anthropic = createAnthropic({ apiKey })
    const result = streamText({
      model: anthropic(MODEL_IDS[tier]),
      prompt,
      temperature: 0.6,
      maxOutputTokens: MAX_OUTPUT_TOKENS[tier],
    })
    return result.toTextStreamResponse()
  } catch (err) {
    console.error('[ai/generate] stream error', err)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}
