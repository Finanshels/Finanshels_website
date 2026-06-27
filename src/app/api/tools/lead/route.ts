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
import { getToolBySlug } from '@/lib/cms/toolsRepository'

export const runtime = 'nodejs'

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 10

const leadSchema = z.object({
  tool_slug: z.string().min(1).max(256),
  service_interest: z.string().min(1).max(64),
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  phone: z
    .string()
    .min(5)
    .max(40)
    .refine((v) => {
      const d = v.replace(/[^0-9]/g, '')
      return d.length >= 7 && d.length <= 15
    }, 'Phone must have 7–15 digits'),
  result_snapshot: z.record(z.string(), z.unknown()).optional(),
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

  const tool = await getToolBySlug(input.tool_slug)
  if (!tool) {
    return NextResponse.json({ error: 'unknown_tool' }, { status: 404 })
  }

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

  const userAgent = req.headers.get('user-agent')?.slice(0, 512) ?? ''

  let leadId: string
  try {
    leadId = await writeLead({
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email.trim().toLowerCase(),
      landing_page_id: `tool:${tool.slug}`,
      landing_page_slug: tool.slug,
      service_interest: tool.serviceInterest || input.service_interest,
      attribution: { landing_url: `/tools/${tool.slug}` },
      user_agent: userAgent,
      ip_hash: ipHash,
      source: `tool:${tool.slug}`,
      extra: input.result_snapshot ?? undefined,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'persist_failed', message: err instanceof Error ? err.message : 'unknown' },
      { status: 500 }
    )
  }

  try {
    const lead = await getLead(leadId)
    if (lead) {
      const result = await pushLeadToZoho(leadToZohoPayload(lead))
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

  return NextResponse.json({ ok: true, lead_id: leadId })
}

export async function GET() {
  return NextResponse.json({ error: 'method_not_allowed' }, { status: 405 })
}
