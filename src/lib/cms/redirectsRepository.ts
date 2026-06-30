import 'server-only'
import { Timestamp } from 'firebase-admin/firestore'
import { getDb } from './firestore'
import { normalizeFirestoreTimestamps } from './normalizeDoc'

/**
 * FIX-073: CMS-managed redirect table for the Webflow → Next migration.
 *
 * Rules are stored in Firestore (`redirects`) and applied at runtime by
 * `src/middleware.ts`. Editors manage them from `/admin/redirects` with no
 * deploy. `firestore.rules` denies all client access — reads/writes go through
 * this server-only repository, same as every other collection.
 */

const COLLECTION = 'redirects'
const LIST_LIMIT = 2000

export type RedirectRule = {
  id: string
  from: string
  to: string
  permanent: boolean
  enabled: boolean
  note?: string
  createdAt: string | null
  updatedAt: string | null
}

/** A redirect source is matched on exact pathname — normalise both sides the same way. */
export function normalizeFromPath(input: string): string {
  let p = (input ?? '').trim()
  if (!p) return ''
  if (/^https?:\/\//i.test(p)) {
    try {
      p = new URL(p).pathname
    } catch {
      /* fall through with the raw value */
    }
  }
  // Drop query + hash; the matcher keys on pathname only.
  p = p.split('?')[0]!.split('#')[0]!
  if (!p.startsWith('/')) p = `/${p}`
  // Collapse a trailing slash (except the root) so `/x` and `/x/` are one rule.
  if (p.length > 1) p = p.replace(/\/+$/, '')
  return p
}

/** Destination may be an internal path or an absolute URL. */
function normalizeToPath(input: string): string {
  const t = (input ?? '').trim()
  if (!t) return ''
  if (/^https?:\/\//i.test(t)) return t
  // Mirror normalizeFromPath: collapse a trailing slash so an internal
  // `to` like `/x/` can't dodge the from===to loop guard and ping-pong with
  // the middleware's path normalisation. (admin-auth review, FIX-073.)
  let p = t.startsWith('/') ? t : `/${t}`
  if (p.length > 1) p = p.replace(/\/+$/, '')
  return p
}

function readRule(id: string, data: Record<string, unknown>): RedirectRule {
  return {
    id,
    from: typeof data.from === 'string' ? data.from : '',
    to: typeof data.to === 'string' ? data.to : '',
    permanent: data.permanent !== false,
    enabled: data.enabled !== false,
    note: typeof data.note === 'string' && data.note.trim() ? data.note.trim() : undefined,
    createdAt: typeof data.createdAt === 'string' ? data.createdAt : null,
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : null,
  }
}

export async function listRedirects(): Promise<RedirectRule[]> {
  const db = getDb()
  if (!db) return []
  const snap = await db.collection(COLLECTION).limit(LIST_LIMIT).get()
  const rules = snap.docs.map((doc) =>
    readRule(doc.id, normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>))
  )
  // Newest first; rules without a timestamp sort last.
  rules.sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
  return rules
}

/** Enabled rules only, shaped for the middleware lookup map. */
export async function getActiveRedirects(): Promise<Array<{ from: string; to: string; permanent: boolean }>> {
  const all = await listRedirects()
  return all
    .filter((r) => r.enabled && r.from && r.to)
    .map((r) => ({ from: r.from, to: r.to, permanent: r.permanent }))
}

export type RedirectInput = {
  from: string
  to: string
  permanent?: boolean
  enabled?: boolean
  note?: string
}

export type RedirectWriteResult =
  | { ok: true; id: string }
  | { ok: false; error: 'not_configured' | 'invalid' | 'duplicate' | 'loop'; message: string }

export async function createRedirect(input: RedirectInput): Promise<RedirectWriteResult> {
  const db = getDb()
  if (!db) return { ok: false, error: 'not_configured', message: 'Firestore is not configured.' }

  const from = normalizeFromPath(input.from)
  const to = normalizeToPath(input.to)
  if (!from || !to) return { ok: false, error: 'invalid', message: 'Both "from" and "to" are required.' }
  if (from === to) return { ok: false, error: 'loop', message: 'Source and destination are identical.' }

  const existing = await db.collection(COLLECTION).where('from', '==', from).limit(1).get()
  if (!existing.empty) {
    return { ok: false, error: 'duplicate', message: `A redirect for ${from} already exists.` }
  }

  const now = Timestamp.now()
  const ref = await db.collection(COLLECTION).add({
    from,
    to,
    permanent: input.permanent !== false,
    enabled: input.enabled !== false,
    note: input.note?.trim() || null,
    createdAt: now,
    updatedAt: now,
  })
  return { ok: true, id: ref.id }
}

export async function updateRedirect(
  id: string,
  patch: Partial<RedirectInput>
): Promise<RedirectWriteResult> {
  const db = getDb()
  if (!db) return { ok: false, error: 'not_configured', message: 'Firestore is not configured.' }
  if (!id) return { ok: false, error: 'invalid', message: 'Missing redirect id.' }

  const update: Record<string, unknown> = { updatedAt: Timestamp.now() }
  if (patch.from !== undefined) update.from = normalizeFromPath(patch.from)
  if (patch.to !== undefined) update.to = normalizeToPath(patch.to)
  if (patch.permanent !== undefined) update.permanent = patch.permanent
  if (patch.enabled !== undefined) update.enabled = patch.enabled
  if (patch.note !== undefined) update.note = patch.note?.trim() || null

  if (typeof update.from === 'string' && update.from && update.from === update.to) {
    return { ok: false, error: 'loop', message: 'Source and destination are identical.' }
  }

  await db.collection(COLLECTION).doc(id).set(update, { merge: true })
  return { ok: true, id }
}

export async function deleteRedirect(id: string): Promise<void> {
  const db = getDb()
  if (!db || !id) return
  await db.collection(COLLECTION).doc(id).delete()
}
