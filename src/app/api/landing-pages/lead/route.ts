import { createHash } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { getLandingPageById } from '@/lib/landing-pages/repository'
import {
  checkAndIncrementRateLimit,
  updateLeadSyncState,
  writeLead,
} from '@/lib/landing-pages/repository'
import { verifyTurnstile } from '@/lib/landing-pages/turnstile'
import { leadToZohoPayload, pushLeadToZoho } from '@/lib/landing-pages/zohoClient'
import { sendLeadNotification } from '@/lib/landing-pages/leadNotification'
import { getLead } from '@/lib/landing-pages/repository'
import { enforceBodyLimit } from '@/lib/http/bodyLimit'

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
  landing_page_id: z.string().min(1).max(128),
  landing_page_slug: z.string().min(1).max(256),
  service_interest: z.string().min(1).max(64),
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
  extra: z.record(z.string(), z.string()).optional(),
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

export async function POST(req: NextRequest) {
  const tooLarge = enforceBodyLimit(req, 64_000)
  if (tooLarge) return tooLarge

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

  // Confirm the landing page exists and capture canonical service_interest
  const page = await getLandingPageById(input.landing_page_id)
  if (!page) {
    return NextResponse.json({ error: 'unknown_landing_page' }, { status: 404 })
  }

  const userAgent = req.headers.get('user-agent')?.slice(0, 512) ?? ''

  // 1) Source of truth: persist to Firestore
  let leadId: string
  try {
    leadId = await writeLead({
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email.trim().toLowerCase(),
      company_name: input.company_name?.trim() || undefined,
      landing_page_id: page.id,
      landing_page_slug: page.slug,
      service_interest: page.service_interest || input.service_interest,
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
  let zohoLeadId: string | undefined
  try {
    const lead = await getLead(leadId)
    if (lead) {
      const result = await pushLeadToZoho(leadToZohoPayload(lead))
      if (result.ok) {
        zohoLeadId = result.zoho_lead_id
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

  // 3) Internal email notification (non-blocking failure)
  try {
    const lead = await getLead(leadId)
    if (lead) {
      const notify = await sendLeadNotification(lead, page)
      if (notify.ok) {
        await updateLeadSyncState(leadId, { resend_email_sent_at: new Date(), resend_email_error: null })
      } else {
        await updateLeadSyncState(leadId, { resend_email_error: notify.error })
      }
    }
  } catch (err) {
    await updateLeadSyncState(leadId, {
      resend_email_error: err instanceof Error ? err.message : 'unknown_resend_error',
    })
  }

  return NextResponse.json({
    ok: true,
    lead_id: leadId,
    zoho_lead_id: zohoLeadId ?? null,
  })
}

export async function GET() {
  return NextResponse.json({ error: 'method_not_allowed' }, { status: 405 })
}
