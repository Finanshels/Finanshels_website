import { NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'

import { ensureSession, updateLeadAndSync } from '@/lib/chat/leadRepository'
import {
  checkRateLimit,
  extractClientIp,
  hashIp,
  isValidEmail,
  isValidPhone,
} from '@/lib/chat/guards'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const SESSION_COOKIE_NAME = 'finanshels_chat_session'
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

const leadSchema = z
  .object({
    sessionId: z.string().min(8).max(80).optional(),
    firstName: z.string().trim().max(100).optional(),
    lastName: z.string().trim().max(100).optional(),
    email: z.string().trim().max(200).optional(),
    phone: z.string().trim().max(40).optional(),
    companyName: z.string().trim().max(200).optional(),
    companySize: z.string().trim().max(60).optional(),
    intent: z.string().trim().max(200).optional(),
    pageUrl: z.string().url().max(2000).optional(),
    conversationSummary: z.string().max(20_000).optional(),
    consent: z.boolean().optional(),
  })
  .refine(
    (data) => Boolean(data.email || data.phone || data.firstName),
    { message: 'At least one of email, phone, or firstName is required' }
  )

function generateSessionId(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(request: Request) {
  const ip = extractClientIp(request.headers)
  const ipHash = hashIp(ip)

  const limit = checkRateLimit(ipHash)
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited', retryAfter: limit.retryAfterSeconds },
      { status: 429 }
    )
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const parsed = leadSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid_input', issues: parsed.error.issues },
      { status: 400 }
    )
  }
  const data = parsed.data

  if (data.email && !isValidEmail(data.email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 })
  }
  if (data.phone && !isValidPhone(data.phone)) {
    return NextResponse.json({ ok: false, error: 'invalid_phone' }, { status: 400 })
  }

  const cookieStore = await cookies()
  const existingSessionId =
    data.sessionId || cookieStore.get(SESSION_COOKIE_NAME)?.value || generateSessionId()

  const userAgent = request.headers.get('user-agent') ?? undefined
  await ensureSession({
    sessionId: existingSessionId,
    ipHash,
    userAgent,
    pageUrl: data.pageUrl,
  })

  if (!cookieStore.get(SESSION_COOKIE_NAME)) {
    cookieStore.set({
      name: SESSION_COOKIE_NAME,
      value: existingSessionId,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SESSION_COOKIE_MAX_AGE,
    })
  }

  const result = await updateLeadAndSync(existingSessionId, {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    companyName: data.companyName,
    companySize: data.companySize,
    intent: data.intent,
    pageUrl: data.pageUrl,
    conversationSummary: data.conversationSummary,
    consentAt: data.consent ? new Date().toISOString() : undefined,
  })

  return NextResponse.json({
    ok: true,
    sessionId: existingSessionId,
    zohoStatus: result.conversation?.zohoStatus ?? 'pending',
    zohoLeadId: result.conversation?.zohoLeadId ?? null,
  })
}
