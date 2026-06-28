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
import { getEbookDownload } from '@/lib/cms/ebooksRepository'
import { sendEmail } from '@/lib/email/resend'

/**
 * Gated ebook lead capture for `/guides/[slug]`.
 *
 * Reuses the landing-page lead pipeline (Firestore lead store + Cloudflare
 * Turnstile + rate-limit + Zoho CRM push). On a valid submit it returns the
 * actual `file_url` so the browser can start the download — that URL is NEVER
 * rendered into the public page for gated ebooks (FIX-048).
 */

export const runtime = 'nodejs'

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 10

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

const leadSchema = z.object({
  ebook_slug: z.string().min(1).max(256),
  name: z
    .string()
    .min(2, 'Name is too short')
    .max(120)
    .refine((v) => v.trim().length >= 2, 'Name is too short'),
  phone: z
    .string()
    .min(5)
    .max(40)
    .refine((v) => {
      const digits = v.replace(/[^0-9]/g, '')
      return digits.length >= 7 && digits.length <= 15
    }, 'Phone must have 7–15 digits'),
  email: z.string().email().max(180),
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

// Escape user-supplied values before interpolating into the HTML email body.
// Without this, a lead's name like `<img src=x onerror=...>` executes in the
// team member's email client. (Mirrors the helper in /api/contact.)
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

async function notifyEbookLead(params: {
  name: string
  email: string
  phone: string
  company_name?: string
  ebookTitle: string
  slug: string
}): Promise<void> {
  const recipients = (process.env.RESOURCE_LEAD_NOTIFICATION_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (recipients.length === 0) return

  const subject = `New ebook download · ${params.ebookTitle}`
  const lines = [
    `Ebook: ${params.ebookTitle}`,
    `Name: ${params.name}`,
    `Phone: ${params.phone}`,
    `Email: ${params.email}`,
    params.company_name ? `Company: ${params.company_name}` : '',
  ].filter(Boolean)
  const text = [`New gated ebook download from /guides/${params.slug}`, '', ...lines].join('\n')
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#0f172a;">
    <h2 style="margin:0 0 12px;font-size:18px;">New ebook download</h2>
    <p style="margin:0 0 12px;color:#64748b;font-size:13px;">/guides/${escapeHtml(params.slug)}</p>
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

  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_payload', details: parsed.error.flatten() },
      { status: 400 }
    )
  }
  const input = parsed.data

  const ip = ipFromRequest(req)
  const ipHash = hashIp(ip)

  const rate = await checkAndIncrementRateLimit(ipHash, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX)
  if (!rate.allowed) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  // Turnstile (bypassed silently when not configured — see turnstile.ts)
  const turnstile = await verifyTurnstile(input.turnstile_token, ip)
  if (!turnstile.ok) {
    return NextResponse.json({ error: 'turnstile_failed', reason: turnstile.reason }, { status: 400 })
  }

  // Resolve the published ebook + its download URL (server-side only).
  const ebook = await getEbookDownload(input.ebook_slug)
  if (!ebook) {
    return NextResponse.json({ error: 'unknown_ebook' }, { status: 404 })
  }
  if (!ebook.fileUrl) {
    return NextResponse.json({ error: 'download_unavailable' }, { status: 409 })
  }

  const userAgent = req.headers.get('user-agent')?.slice(0, 512) ?? ''
  const serviceInterest = `Ebook — ${ebook.title}`

  // 1) Source of truth: persist to Firestore (namespaced via `ebook:<slug>`).
  let leadId: string
  try {
    leadId = await writeLead({
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email.trim().toLowerCase(),
      company_name: input.company_name?.trim() || undefined,
      landing_page_id: `ebook:${ebook.slug}`,
      landing_page_slug: ebook.slug,
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

  // 2) Zoho push (non-blocking failure — admin can retry)
  try {
    const lead = await getLead(leadId)
    if (lead) {
      const result = await pushLeadToZoho({
        ...leadToZohoPayload(lead),
        Lead_Source: 'Ebook Download',
        Description: `Downloaded "${ebook.title}" via /guides/${ebook.slug}`,
      })
      if (result.ok) {
        await updateLeadSyncState(leadId, {
          zoho_lead_id: result.zoho_lead_id,
          zoho_synced_at: new Date(),
          zoho_sync_error: null,
        })
      } else {
        await updateLeadSyncState(leadId, {
          zoho_sync_error: result.error,
          increment_zoho_retry: true,
        })
      }
    }
  } catch (err) {
    await updateLeadSyncState(leadId, {
      zoho_sync_error: err instanceof Error ? err.message : 'unknown_zoho_error',
      increment_zoho_retry: true,
    })
  }

  // 3) Internal email notification (best-effort; only when recipients configured)
  try {
    await notifyEbookLead({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      company_name: input.company_name?.trim() || undefined,
      ebookTitle: ebook.title,
      slug: ebook.slug,
    })
    await updateLeadSyncState(leadId, { resend_email_sent_at: new Date(), resend_email_error: null })
  } catch (err) {
    await updateLeadSyncState(leadId, {
      resend_email_error: err instanceof Error ? err.message : 'unknown_resend_error',
    })
  }

  // The download URL is returned ONLY through this captured flow.
  return NextResponse.json({ ok: true, lead_id: leadId, file_url: ebook.fileUrl })
}

export async function GET() {
  return NextResponse.json({ error: 'method_not_allowed' }, { status: 405 })
}
