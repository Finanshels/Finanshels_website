import { createHash } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import {
  checkAndIncrementRateLimit,
  getLead,
  updateLeadSyncState,
  writeLead,
} from '@/lib/landing-pages/repository'
import { verifyTurnstile } from '@/lib/landing-pages/turnstile'
import { leadToZohoPayload, pushLeadToZoho } from '@/lib/landing-pages/zohoClient'
import { getWebinarRegistrationTarget } from '@/lib/cms/webinarsRepository'
import { getSiteUrl } from '@/lib/cms/config'
import { sendEmail } from '@/lib/email/resend'
import { buildWebinarConfirmationEmail } from '@/lib/email/templates/webinarConfirmation'

/**
 * Native webinar registration for `/webinars/[slug]`.
 *
 * Reuses the landing-page lead pipeline (Firestore lead store + Cloudflare
 * Turnstile + rate-limit + Zoho CRM push), namespacing the lead as
 * `webinar:<slug>` (same convention as `ebook:<slug>`). Unlike the ebook gate,
 * it ALSO emails the registrant a confirmation + (generic) join link.
 *
 * Phone is optional here (lower friction than the gated-download form).
 */

export const runtime = 'nodejs'

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 15

const attributionSchema = z.object({
  gclid: z.string().max(512).optional(),
  gbraid: z.string().max(512).optional(),
  wbraid: z.string().max(512).optional(),
  utm_source: z.string().max(256).optional(),
  utm_medium: z.string().max(256).optional(),
  utm_campaign: z.string().max(256).optional(),
  utm_term: z.string().max(256).optional(),
  utm_content: z.string().max(256).optional(),
  referrer: z.string().max(1024).optional(),
  landing_url: z.string().max(2048).default(''),
})

const registerSchema = z.object({
  webinar_slug: z.string().min(1).max(256),
  name: z.string().min(2, 'Name is too short').max(120).refine((v) => v.trim().length >= 2, 'Name is too short'),
  email: z.string().email().max(180),
  phone: z
    .string()
    .max(40)
    .refine((v) => {
      const digits = v.replace(/[^0-9]/g, '')
      return digits.length >= 7 && digits.length <= 15
    }, 'Phone must have 7–15 digits')
    .optional(),
  company_name: z.string().max(180).optional(),
  attribution: attributionSchema,
  turnstile_token: z.string().optional(),
})

function ipFromRequest(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for') ?? ''
  const first = fwd.split(',')[0]?.trim()
  if (first) return first
  return req.headers.get('x-real-ip') ?? '0.0.0.0'
}

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? 'finanshels-landing'
  return createHash('sha256').update(`${salt}::${ip}`).digest('hex')
}

function notificationRecipients(): string[] {
  const raw = process.env.WEBINAR_LEAD_NOTIFICATION_EMAILS ?? process.env.RESOURCE_LEAD_NOTIFICATION_EMAILS ?? ''
  return raw.split(',').map((s) => s.trim()).filter(Boolean)
}

// Escape user-supplied values before interpolating into the HTML email body.
// Without this, a registrant's name like `<img src=x onerror=...>` executes in
// the team member's email client. (Mirrors the helper in /api/contact.)
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

async function notifyTeam(params: {
  name: string
  email: string
  phone?: string
  company_name?: string
  webinarTitle: string
  slug: string
}): Promise<void> {
  const recipients = notificationRecipients()
  if (recipients.length === 0) return

  const subject = `New webinar registration · ${params.webinarTitle}`
  const lines = [
    `Webinar: ${params.webinarTitle}`,
    `Name: ${params.name}`,
    `Email: ${params.email}`,
    params.phone ? `Phone: ${params.phone}` : '',
    params.company_name ? `Company: ${params.company_name}` : '',
  ].filter(Boolean)
  const text = [`New webinar registration from /webinars/${params.slug}`, '', ...lines].join('\n')
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#0f172a;">
    <h2 style="margin:0 0 12px;font-size:18px;">New webinar registration</h2>
    <p style="margin:0 0 12px;color:#64748b;font-size:13px;">/webinars/${escapeHtml(params.slug)}</p>
    ${lines.map((l) => `<div style="font-size:14px;margin:2px 0;">${escapeHtml(l)}</div>`).join('')}
  </div>`

  for (const to of recipients) {
    await sendEmail({ to, subject, text, html, replyTo: params.email || undefined })
  }
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_payload', details: parsed.error.flatten() }, { status: 400 })
  }
  const input = parsed.data

  const ip = ipFromRequest(req)
  const ipHash = hashIp(ip)

  const rate = await checkAndIncrementRateLimit(ipHash, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX)
  if (!rate.allowed) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  const turnstile = await verifyTurnstile(input.turnstile_token, ip)
  if (!turnstile.ok) {
    return NextResponse.json({ error: 'turnstile_failed', reason: turnstile.reason }, { status: 400 })
  }

  const webinar = await getWebinarRegistrationTarget(input.webinar_slug)
  if (!webinar) {
    return NextResponse.json({ error: 'unknown_webinar' }, { status: 404 })
  }

  const userAgent = req.headers.get('user-agent')?.slice(0, 512) ?? ''
  const serviceInterest = webinar.serviceInterest || `Webinar — ${webinar.title}`
  const name = input.name.trim()
  const email = input.email.trim().toLowerCase()
  const phone = input.phone?.trim() || ''
  const company = input.company_name?.trim() || undefined

  // 1) Source of truth: persist to Firestore (namespaced via `webinar:<slug>`).
  let leadId: string
  try {
    leadId = await writeLead({
      name,
      phone,
      email,
      company_name: company,
      landing_page_id: `webinar:${webinar.slug}`,
      landing_page_slug: webinar.slug,
      service_interest: serviceInterest,
      attribution: input.attribution,
      user_agent: userAgent,
      ip_hash: ipHash,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'persist_failed', message: err instanceof Error ? err.message : 'unknown' },
      { status: 500 }
    )
  }

  // 2) Zoho push (non-blocking failure — admin can retry).
  try {
    const lead = await getLead(leadId)
    if (lead) {
      const result = await pushLeadToZoho({
        ...leadToZohoPayload(lead),
        Lead_Source: `Webinar: ${webinar.title}`,
        Description: `Registered for "${webinar.title}" via /webinars/${webinar.slug}`,
      })
      if (result.ok) {
        await updateLeadSyncState(leadId, {
          zoho_lead_id: result.zoho_lead_id,
          zoho_synced_at: new Date(),
          zoho_sync_error: null,
        })
      } else {
        await updateLeadSyncState(leadId, { zoho_sync_error: result.error, increment_zoho_retry: true })
      }
    }
  } catch (err) {
    await updateLeadSyncState(leadId, {
      zoho_sync_error: err instanceof Error ? err.message : 'unknown_zoho_error',
      increment_zoho_retry: true,
    })
  }

  // 3) Registrant confirmation email + internal notification (best-effort).
  try {
    const { subject, html, text } = buildWebinarConfirmationEmail({
      recipientName: name,
      webinarTitle: webinar.title,
      webinarUrl: `${getSiteUrl()}/webinars/${webinar.slug}`,
      startIso: webinar.startDatetime,
      endIso: null,
      timezone: webinar.timezone,
      joinUrl: webinar.joinUrl,
    })
    await sendEmail({ to: email, subject, html, text })
    await notifyTeam({
      name,
      email,
      phone: phone || undefined,
      company_name: company,
      webinarTitle: webinar.title,
      slug: webinar.slug,
    })
    await updateLeadSyncState(leadId, { resend_email_sent_at: new Date(), resend_email_error: null })
  } catch (err) {
    await updateLeadSyncState(leadId, {
      resend_email_error: err instanceof Error ? err.message : 'unknown_resend_error',
    })
  }

  return NextResponse.json({ ok: true, lead_id: leadId, join_url: webinar.joinUrl })
}

export async function GET() {
  return NextResponse.json({ error: 'method_not_allowed' }, { status: 405 })
}
