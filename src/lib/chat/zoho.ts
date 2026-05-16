import 'server-only'

/**
 * Zoho CRM Leads adapter (region: .com).
 *
 * Auth: OAuth self-client refresh-token flow.
 *   1. Create a Self Client at https://api-console.zoho.com (Region: US / .com).
 *   2. Generate a grant token with scope:
 *      ZohoCRM.modules.leads.CREATE,ZohoCRM.modules.leads.UPDATE
 *   3. Exchange for a refresh token (one-time) using /oauth/v2/token.
 *   4. Set ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN in env.
 *
 * If creds are missing, upsertZohoLead returns { ok: false, reason: 'unconfigured' }
 * and the lead is queued in Firestore for later replay.
 */

const ACCOUNTS_URL = 'https://accounts.zoho.com'
const API_DOMAIN = 'https://www.zohoapis.com'

export interface ZohoLeadInput {
  sessionId: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  companyName?: string
  companySize?: string
  intent?: string
  conversationSummary?: string
  pageUrl?: string
}

export type ZohoUpsertResult =
  | { ok: true; leadId: string; created: boolean }
  | { ok: false; reason: 'unconfigured' | 'auth_failed' | 'api_error'; detail?: string }

interface ZohoTokenCache {
  accessToken: string
  expiresAt: number
}

let tokenCache: ZohoTokenCache | null = null

function isConfigured(): boolean {
  return Boolean(
    process.env.ZOHO_CLIENT_ID && process.env.ZOHO_CLIENT_SECRET && process.env.ZOHO_REFRESH_TOKEN
  )
}

async function getAccessToken(): Promise<string | null> {
  if (!isConfigured()) return null

  if (tokenCache && tokenCache.expiresAt > Date.now() + 30_000) {
    return tokenCache.accessToken
  }

  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    grant_type: 'refresh_token',
  })

  const res = await fetch(`${ACCOUNTS_URL}/oauth/v2/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
    cache: 'no-store',
  })

  if (!res.ok) {
    console.warn('[zoho] refresh token request failed:', res.status, await res.text().catch(() => ''))
    return null
  }

  const json = (await res.json()) as { access_token?: string; expires_in?: number }
  if (!json.access_token) return null

  tokenCache = {
    accessToken: json.access_token,
    expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000,
  }
  return tokenCache.accessToken
}

function buildLeadRecord(input: ZohoLeadInput): Record<string, unknown> {
  const fullName = [input.firstName, input.lastName].filter(Boolean).join(' ').trim()
  const lastName = input.lastName || fullName || input.firstName || 'Website Visitor'
  const record: Record<string, unknown> = {
    Last_Name: lastName,
    Company: input.companyName || 'Unknown',
    Lead_Source: 'Website Chatbot',
  }
  if (input.firstName) record.First_Name = input.firstName
  if (input.email) record.Email = input.email
  if (input.phone) record.Phone = input.phone
  if (input.conversationSummary) record.Description = input.conversationSummary
  if (input.intent) record.Industry = input.intent
  if (input.companySize) record.No_of_Employees = input.companySize
  return record
}

export async function upsertZohoLead(
  input: ZohoLeadInput,
  existingZohoLeadId?: string
): Promise<ZohoUpsertResult> {
  const token = await getAccessToken()
  if (!token) {
    return isConfigured()
      ? { ok: false, reason: 'auth_failed' }
      : { ok: false, reason: 'unconfigured' }
  }

  const record = buildLeadRecord(input)

  if (existingZohoLeadId) {
    const res = await fetch(`${API_DOMAIN}/crm/v6/Leads/${existingZohoLeadId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ data: [record] }),
      cache: 'no-store',
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      return { ok: false, reason: 'api_error', detail }
    }
    return { ok: true, leadId: existingZohoLeadId, created: false }
  }

  const endpoint = input.email
    ? `${API_DOMAIN}/crm/v6/Leads/upsert`
    : `${API_DOMAIN}/crm/v6/Leads`
  const body = input.email
    ? { data: [record], duplicate_check_fields: ['Email'] }
    : { data: [record] }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    return { ok: false, reason: 'api_error', detail }
  }

  const json = (await res.json()) as {
    data?: Array<{ code?: string; details?: { id?: string }; status?: string; action?: string }>
  }
  const entry = json.data?.[0]
  const leadId = entry?.details?.id
  if (!leadId) {
    return { ok: false, reason: 'api_error', detail: JSON.stringify(json) }
  }
  return { ok: true, leadId, created: entry?.action !== 'update' }
}

export function isZohoConfigured(): boolean {
  return isConfigured()
}
