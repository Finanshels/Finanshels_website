/**
 * FIX-081: pull translations from Phrase for the localisation workflow
 * (Phrase → Claude → Walter AI → CMS).
 *
 * Usage:
 *   PHRASE_API_TOKEN=… PHRASE_PROJECT_ID=… npx tsx scripts/phrase-pull.mts            # list locales
 *   PHRASE_API_TOKEN=… PHRASE_PROJECT_ID=… npx tsx scripts/phrase-pull.mts <localeId> # dump a locale's key→value JSON
 *
 * Self-contained (does not import the app's `server-only` connector, which can't
 * be imported outside an RSC context). The app-facing connector lives in
 * src/lib/integrations/phrase.ts for use from server actions / API routes.
 */

const PHRASE_API_BASE = 'https://api.phrase.com/v2'

function requireEnv(): { token: string; projectId: string } {
  const token = (process.env.PHRASE_API_TOKEN ?? '').trim()
  const projectId = (process.env.PHRASE_PROJECT_ID ?? '').trim()
  if (!token || !projectId) {
    process.stderr.write('Missing PHRASE_API_TOKEN and/or PHRASE_PROJECT_ID.\n')
    process.exit(1)
  }
  return { token, projectId }
}

async function phraseGet(path: string, token: string): Promise<Response> {
  return fetch(`${PHRASE_API_BASE}${path}`, {
    headers: { Authorization: `token ${token}`, 'User-Agent': 'finanshels-web (phrase-pull)' },
  })
}

async function main(): Promise<void> {
  const { token, projectId } = requireEnv()
  const localeId = process.argv[2]?.trim()

  if (!localeId) {
    const res = await phraseGet(`/projects/${projectId}/locales`, token)
    if (!res.ok) {
      process.stderr.write(`Phrase locales request failed (${res.status}).\n`)
      process.exit(1)
    }
    const locales = (await res.json()) as Array<Record<string, unknown>>
    process.stdout.write('Locales (id — code — name):\n')
    for (const l of locales) {
      process.stdout.write(`  ${l.id}  ${l.code}  ${l.name}${l.default ? '  (default)' : ''}\n`)
    }
    process.stdout.write('\nRe-run with a locale id to dump its translations as JSON.\n')
    return
  }

  const res = await phraseGet(
    `/projects/${projectId}/locales/${encodeURIComponent(localeId)}/download?file_format=simple_json`,
    token
  )
  if (!res.ok) {
    process.stderr.write(`Phrase download failed (${res.status}).\n`)
    process.exit(1)
  }
  const json = await res.json()
  process.stdout.write(JSON.stringify(json, null, 2) + '\n')
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`)
  process.exit(1)
})
