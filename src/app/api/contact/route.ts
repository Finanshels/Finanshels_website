import { NextResponse } from 'next/server'
import { z } from 'zod'

import {
  extractClientIp,
  hashIp,
  isValidEmail,
} from '@/lib/chat/guards'
import { checkAndIncrementRateLimit } from '@/lib/landing-pages/repository'
import {
  writeContactSubmission,
  updateContactSyncState,
  type ContactReason,
} from '@/lib/contact/contactRepository'
import { upsertZohoLead } from '@/lib/chat/zoho'
import { sendEmail } from '@/lib/email/resend'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const REASON_LABELS: Record<ContactReason, string> = {
  sales: 'Pricing & plans',
  support: 'Existing client support',
  partnership: 'Partnership / referral',
  careers: 'Careers & talent',
}

const DEFAULT_INBOX = 'contact@finanshels.com'

// FIX-061: durable per-IP rate limit (Firestore-backed), matching the lead
// routes. The previous in-memory limiter was per-serverless-instance and
// bypassable across concurrent Vercel instances.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 10

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().min(5).max(200),
  company: z.string().trim().max(200).optional(),
  phone: z.string().trim().max(40).optional(),
  companySize: z.string().trim().max(40).optional(),
  message: z.string().trim().min(10).max(5000),
  reason: z.enum(['sales', 'support', 'partnership', 'careers']),
  pageUrl: z.string().trim().max(2000).optional(),
})

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function row(label: string, value?: string | null): string {
  if (!value) return ''
  return `<tr><td style="padding:6px 12px;color:#64748b;font-size:13px;width:140px;">${escapeHtml(
    label
  )}</td><td style="padding:6px 12px;color:#0f172a;font-size:14px;">${escapeHtml(value)}</td></tr>`
}

function splitName(name: string): { firstName?: string; lastName: string } {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return { lastName: parts[0] }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

export async function POST(request: Request) {
  const ip = extractClientIp(request.headers)
  const ipHash = hashIp(ip)

  const limit = await checkAndIncrementRateLimit(ipHash, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX)
  if (!limit.allowed) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid_input', issues: parsed.error.issues },
      { status: 400 }
    )
  }
  const data = parsed.data

  if (!isValidEmail(data.email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 })
  }

  const userAgent = request.headers.get('user-agent')?.slice(0, 512) ?? undefined

  // 1) Source of truth: persist to Firestore.
  const submission = await writeContactSubmission({
    name: data.name,
    email: data.email.toLowerCase(),
    company: data.company || undefined,
    phone: data.phone || undefined,
    companySize: data.companySize || undefined,
    message: data.message,
    reason: data.reason,
    pageUrl: data.pageUrl,
    userAgent,
    ipHash,
  })

  if (!submission) {
    return NextResponse.json(
      { ok: false, error: 'persist_failed', message: 'Firestore is not configured' },
      { status: 500 }
    )
  }

  // 2) Zoho push (non-blocking failure — admin can replay).
  try {
    const { firstName, lastName } = splitName(data.name)
    const result = await upsertZohoLead({
      sessionId: submission.id,
      firstName,
      lastName,
      email: data.email.toLowerCase(),
      phone: data.phone,
      companyName: data.company,
      companySize: data.companySize,
      intent: REASON_LABELS[data.reason],
      conversationSummary: data.message,
      pageUrl: data.pageUrl,
    })
    if (result.ok) {
      await updateContactSyncState(submission.id, {
        zohoLeadId: result.leadId,
        zohoStatus: 'synced',
        zohoLastError: null,
      })
    } else if (result.reason === 'unconfigured') {
      await updateContactSyncState(submission.id, {
        zohoStatus: 'queued',
        zohoLastError: 'Zoho not configured — queued for replay',
      })
    } else {
      await updateContactSyncState(submission.id, {
        zohoStatus: 'failed',
        zohoLastError: result.detail ?? result.reason,
      })
    }
  } catch (err) {
    await updateContactSyncState(submission.id, {
      zohoStatus: 'failed',
      zohoLastError: err instanceof Error ? err.message : 'unknown_zoho_error',
    })
  }

  // 3) Internal email notification (non-blocking failure).
  try {
    const inbox = (process.env.CONTACT_INBOX || DEFAULT_INBOX).trim()
    const reasonLabel = REASON_LABELS[data.reason]
    const subject = `New contact enquiry · ${reasonLabel} · ${data.name}`
    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;padding:20px;max-width:600px;margin:0 auto;color:#0f172a;">
        <h2 style="margin:0 0 16px 0;font-size:20px;">New contact form enquiry</h2>
        <table style="border-collapse:collapse;background:#f8fafc;border-radius:8px;width:100%;">
          ${row('Name', data.name)}
          ${row('Email', data.email)}
          ${row('Phone', data.phone)}
          ${row('Company', data.company)}
          ${row('Team size', data.companySize)}
          ${row('Reason', reasonLabel)}
          ${row('Page', data.pageUrl)}
        </table>
        <h3 style="margin:20px 0 8px 0;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Message</h3>
        <p style="white-space:pre-wrap;font-size:14px;line-height:1.6;background:#f8fafc;border-radius:8px;padding:12px;">${escapeHtml(
          data.message
        )}</p>
        <p style="margin:24px 0 0 0;font-size:12px;color:#94a3b8;">Submission id: ${escapeHtml(
          submission.id
        )}</p>
      </div>`
    const text = [
      `New contact enquiry — ${reasonLabel}`,
      '',
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.phone ? `Phone: ${data.phone}` : '',
      data.company ? `Company: ${data.company}` : '',
      data.companySize ? `Team size: ${data.companySize}` : '',
      data.pageUrl ? `Page: ${data.pageUrl}` : '',
      '',
      'Message:',
      data.message,
    ]
      .filter(Boolean)
      .join('\n')

    const result = await sendEmail({ to: inbox, subject, html, text, replyTo: data.email })
    if (result.ok) {
      await updateContactSyncState(submission.id, { emailSentAt: new Date(), emailError: null })
    } else {
      await updateContactSyncState(submission.id, { emailError: result.message })
    }
  } catch (err) {
    await updateContactSyncState(submission.id, {
      emailError: err instanceof Error ? err.message : 'unknown_email_error',
    })
  }

  return NextResponse.json({ ok: true, id: submission.id })
}

export async function GET() {
  return NextResponse.json({ ok: false, error: 'method_not_allowed' }, { status: 405 })
}
