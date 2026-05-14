/**
 * Zoho CRM client — push lead → Zoho Leads module via OAuth refresh-token flow.
 *
 * Env (required):
 *   ZOHO_CLIENT_ID
 *   ZOHO_CLIENT_SECRET
 *   ZOHO_REFRESH_TOKEN
 *   ZOHO_API_DOMAIN          e.g. "https://www.zohoapis.com" (or .eu / .in / .com.au)
 *   ZOHO_ACCOUNTS_DOMAIN     e.g. "https://accounts.zoho.com" (or regional)
 *
 * Token is cached in-memory and refreshed when it expires. Suitable for
 * Vercel Functions which reuse function instances on Fluid Compute.
 */

import type { LandingPageLead } from './types'

type AccessTokenCache = {
  token: string
  expiresAt: number
}

let tokenCache: AccessTokenCache | null = null

function getEnv(name: string): string {
  return (process.env[name] ?? '').trim()
}

export function isZohoConfigured(): boolean {
  return Boolean(
    getEnv('ZOHO_CLIENT_ID') &&
      getEnv('ZOHO_CLIENT_SECRET') &&
      getEnv('ZOHO_REFRESH_TOKEN') &&
      getEnv('ZOHO_API_DOMAIN')
  )
}

async function getAccessToken(): Promise<string> {
  const now = Date.now()
  if (tokenCache && tokenCache.expiresAt > now + 30_000) return tokenCache.token

  const accountsDomain = getEnv('ZOHO_ACCOUNTS_DOMAIN') || 'https://accounts.zoho.com'
  const url = `${accountsDomain.replace(/\/$/, '')}/oauth/v2/token`
  const params = new URLSearchParams({
    refresh_token: getEnv('ZOHO_REFRESH_TOKEN'),
    client_id: getEnv('ZOHO_CLIENT_ID'),
    client_secret: getEnv('ZOHO_CLIENT_SECRET'),
    grant_type: 'refresh_token',
  })

  const res = await fetch(url, {
    method: 'POST',
    body: params,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    cache: 'no-store',
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Zoho token refresh failed (${res.status}): ${body}`)
  }
  const json = (await res.json()) as { access_token?: string; expires_in?: number; error?: string }
  if (json.error) throw new Error(`Zoho token error: ${json.error}`)
  if (!json.access_token) throw new Error('Zoho token refresh returned no access_token')

  const expiresIn = (json.expires_in ?? 3500) * 1000
  tokenCache = { token: json.access_token, expiresAt: now + expiresIn }
  return json.access_token
}

export type ZohoLeadPayload = {
  Last_Name: string
  First_Name?: string
  Email?: string
  Phone?: string
  Mobile?: string
  Company?: string
  Lead_Source?: string
  Lead_Status?: string
  Description?: string
  // Custom fields (typical Zoho — adjust names in Zoho to match)
  Service_Interest?: string
  GCLID?: string
  GBRAID?: string
  WBRAID?: string
  UTM_Source?: string
  UTM_Medium?: string
  UTM_Campaign?: string
  UTM_Term?: string
  UTM_Content?: string
  Landing_Page_URL?: string
  Referrer?: string
}

function splitName(fullName: string): { first?: string; last: string } {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return { last: parts[0] }
  return { first: parts.slice(0, -1).join(' '), last: parts[parts.length - 1] }
}

/** Map a stored lead to the Zoho payload shape. */
export function leadToZohoPayload(
  lead: Pick<
    LandingPageLead,
    | 'name'
    | 'phone'
    | 'email'
    | 'company_name'
    | 'service_interest'
    | 'landing_page_slug'
    | 'gclid'
    | 'gbraid'
    | 'wbraid'
    | 'utm_source'
    | 'utm_medium'
    | 'utm_campaign'
    | 'utm_term'
    | 'utm_content'
    | 'landing_url'
    | 'referrer'
  >
): ZohoLeadPayload {
  const { first, last } = splitName(lead.name)
  return {
    Last_Name: last || 'Unknown',
    First_Name: first,
    Email: lead.email || undefined,
    Phone: lead.phone || undefined,
    Mobile: lead.phone || undefined,
    Company: lead.company_name || 'Self / Sole proprietor',
    Lead_Source: 'Google Ads — Landing Page',
    Lead_Status: 'New',
    Description: `Submitted from /landing-pages/${lead.landing_page_slug}`,
    Service_Interest: lead.service_interest || undefined,
    GCLID: lead.gclid || undefined,
    GBRAID: lead.gbraid || undefined,
    WBRAID: lead.wbraid || undefined,
    UTM_Source: lead.utm_source || undefined,
    UTM_Medium: lead.utm_medium || undefined,
    UTM_Campaign: lead.utm_campaign || undefined,
    UTM_Term: lead.utm_term || undefined,
    UTM_Content: lead.utm_content || undefined,
    Landing_Page_URL: lead.landing_url || undefined,
    Referrer: lead.referrer || undefined,
  }
}

export type ZohoPushResult =
  | { ok: true; zoho_lead_id: string }
  | { ok: false; error: string }

/** Create a single lead in Zoho. Idempotent via `duplicate_check_fields` is not enabled here — Zoho dedupes by email/phone via its own config. */
export async function pushLeadToZoho(payload: ZohoLeadPayload): Promise<ZohoPushResult> {
  if (!isZohoConfigured()) return { ok: false, error: 'zoho_not_configured' }

  try {
    const token = await getAccessToken()
    const apiDomain = getEnv('ZOHO_API_DOMAIN').replace(/\/$/, '')
    const url = `${apiDomain}/crm/v2/Leads`

    const body = JSON.stringify({
      data: [payload],
      trigger: ['approval', 'workflow', 'blueprint'],
    })

    let res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        'content-type': 'application/json',
      },
      body,
      cache: 'no-store',
    })

    // Token may have been revoked / expired — retry once with a fresh token
    if (res.status === 401) {
      tokenCache = null
      const fresh = await getAccessToken()
      res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Zoho-oauthtoken ${fresh}`,
          'content-type': 'application/json',
        },
        body,
        cache: 'no-store',
      })
    }

    const text = await res.text()
    let parsed: unknown = null
    try {
      parsed = JSON.parse(text)
    } catch {
      /* keep parsed as null */
    }

    if (!res.ok) {
      return { ok: false, error: `Zoho HTTP ${res.status}: ${text.slice(0, 500)}` }
    }

    const data = (parsed as { data?: Array<{ code?: string; details?: { id?: string }; message?: string; status?: string }> })?.data
    const first = Array.isArray(data) ? data[0] : null
    if (!first) return { ok: false, error: 'Zoho returned no result' }
    if (first.status && first.status !== 'success') {
      return { ok: false, error: `Zoho: ${first.code ?? 'ERROR'} — ${first.message ?? 'unknown'}` }
    }
    const id = first.details?.id
    if (!id) return { ok: false, error: 'Zoho response missing lead id' }
    return { ok: true, zoho_lead_id: id }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown Zoho error' }
  }
}
