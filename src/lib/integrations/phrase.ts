import 'server-only'

/**
 * FIX-081: Phrase (Strings) connector — first step of the content workflow
 * Phrase → Claude (MCP) → Walter AI (humanization) → CMS.
 *
 * This module owns the Phrase side: list locales and pull a locale's key→value
 * translations. It is env-gated like the Resend client — when PHRASE_API_TOKEN
 * / PHRASE_PROJECT_ID are unset every call returns a typed "not_configured"
 * result instead of throwing, so the rest of the app is unaffected until the
 * token is added in Vercel. The downstream humanization + CMS write steps
 * consume `pullLocaleTranslations()` output (see scripts/phrase-pull.mts).
 *
 * Phrase Strings API v2: https://developers.phrase.com/api/
 *   Auth header:  Authorization: token <PHRASE_API_TOKEN>
 *   Locales:      GET /v2/projects/{project_id}/locales
 *   Download:     GET /v2/projects/{project_id}/locales/{id}/download?file_format=simple_json
 */

const PHRASE_API_BASE = 'https://api.phrase.com/v2'

export type PhraseConfig = { token: string; projectId: string }

export type PhraseLocale = { id: string; code: string; name: string; default: boolean }

export type PhraseResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: 'not_configured' | 'request_failed'; message: string }

function loadConfig(): PhraseConfig | null {
  const token = (process.env.PHRASE_API_TOKEN ?? '').trim()
  const projectId = (process.env.PHRASE_PROJECT_ID ?? '').trim()
  if (!token || !projectId) return null
  return { token, projectId }
}

export function isPhraseConfigured(): boolean {
  return loadConfig() !== null
}

async function phraseFetch(config: PhraseConfig, path: string): Promise<Response> {
  return fetch(`${PHRASE_API_BASE}${path}`, {
    headers: {
      Authorization: `token ${config.token}`,
      'User-Agent': 'finanshels-web (phrase-connector)',
    },
    // Translation data is fetched on demand by scripts/admin actions, never per request.
    cache: 'no-store',
  })
}

const NOT_CONFIGURED = {
  ok: false as const,
  reason: 'not_configured' as const,
  message:
    'Phrase is not configured. Set PHRASE_API_TOKEN and PHRASE_PROJECT_ID to enable the localisation workflow.',
}

export async function listLocales(): Promise<PhraseResult<PhraseLocale[]>> {
  const config = loadConfig()
  if (!config) return NOT_CONFIGURED

  try {
    const res = await phraseFetch(config, `/projects/${config.projectId}/locales`)
    if (!res.ok) {
      return { ok: false, reason: 'request_failed', message: `Phrase locales request failed (${res.status})` }
    }
    const raw = (await res.json()) as Array<Record<string, unknown>>
    const data: PhraseLocale[] = raw.map((l) => ({
      id: String(l.id ?? ''),
      code: String(l.code ?? ''),
      name: String(l.name ?? ''),
      default: l.default === true,
    }))
    return { ok: true, data }
  } catch (err) {
    return { ok: false, reason: 'request_failed', message: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * Download a locale as a flat key→value map (simple_json format). This is the
 * payload handed to the humanization + CMS-write steps of the workflow.
 */
export async function pullLocaleTranslations(localeId: string): Promise<PhraseResult<Record<string, string>>> {
  const config = loadConfig()
  if (!config) return NOT_CONFIGURED
  if (!localeId.trim()) {
    return { ok: false, reason: 'request_failed', message: 'localeId is required.' }
  }

  try {
    const res = await phraseFetch(
      config,
      `/projects/${config.projectId}/locales/${encodeURIComponent(localeId)}/download?file_format=simple_json`
    )
    if (!res.ok) {
      return { ok: false, reason: 'request_failed', message: `Phrase download failed (${res.status})` }
    }
    const json = (await res.json()) as Record<string, unknown>
    const data: Record<string, string> = {}
    for (const [key, value] of Object.entries(json)) {
      if (typeof value === 'string') data[key] = value
    }
    return { ok: true, data }
  } catch (err) {
    return { ok: false, reason: 'request_failed', message: err instanceof Error ? err.message : 'Unknown error' }
  }
}
