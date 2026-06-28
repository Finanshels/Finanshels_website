import 'server-only'
import { FieldValue } from 'firebase-admin/firestore'
import { getDb } from '../firestore'
import { normalizeFirestoreTimestamps } from '../normalizeDoc'
import { diffExceedsPublished } from './diff'
import { extractPublishedCard } from './card'

/**
 * Generic server-side operations for the two-version draft/publish model. They
 * work on any collection by id — the CMS repository and the landing-pages
 * repository both route through these, then handle their own revalidation
 * (route patterns differ, so revalidation stays with the caller).
 *
 * Storage: the working draft is the parent doc's fields; the published snapshot
 * lives at `<collection>/<id>/_published/current` (separate doc → no 1 MB bloat).
 */

const PUBLISHED_SUBCOLLECTION = '_published'
const PUBLISHED_DOC = 'current'

/** Parent-doc meta that is workflow bookkeeping, not publishable content. */
const META_KEYS = new Set([
  'status',
  'published_at',
  'published_by',
  'last_published_at',
  'has_unpublished_changes',
  'published_card',
  'created_at',
  'createdAt',
  'updated_at',
  'updatedAt',
  '_snapshot_at',
])

function publishedDocRef(db: FirebaseFirestore.Firestore, collection: string, id: string) {
  return db.collection(collection).doc(id).collection(PUBLISHED_SUBCOLLECTION).doc(PUBLISHED_DOC)
}

/** Strip workflow meta so only publishable content is snapshotted/compared. */
function contentFields(parent: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const key of Object.keys(parent)) {
    if (!META_KEYS.has(key)) out[key] = parent[key]
  }
  return out
}

/** The live snapshot for a doc, or null if never published. */
export async function getPublishedSnapshot(
  collection: string,
  id: string
): Promise<Record<string, unknown> | null> {
  const db = getDb()
  if (!db) return null
  const snap = await publishedDocRef(db, collection, id).get()
  if (!snap.exists) return null
  return normalizeFirestoreTimestamps(snap.data() as Record<string, unknown>)
}

/** Whether the current draft differs from the published snapshot. */
export async function computeHasUnpublishedChanges(
  collection: string,
  id: string,
  draftFields: Record<string, unknown>
): Promise<boolean> {
  const snapshot = await getPublishedSnapshot(collection, id)
  return diffExceedsPublished(contentFields(draftFields), snapshot)
}

/**
 * Recompute + persist `has_unpublished_changes` after a draft save. Call from
 * save/autosave paths (which must NOT revalidate the public route).
 */
export async function markDraftDirty(
  collection: string,
  id: string,
  draftFields: Record<string, unknown>
): Promise<void> {
  const db = getDb()
  if (!db) return
  const hasChanges = await computeHasUnpublishedChanges(collection, id, draftFields)
  await db.collection(collection).doc(id).update({ has_unpublished_changes: hasChanges })
}

/**
 * Publish or republish: copy the current draft into the published snapshot,
 * denormalise the card subset onto the parent, set publish meta. The CALLER
 * revalidates the public route afterwards.
 */
export async function publishDoc(collection: string, id: string, userId: string): Promise<void> {
  const db = getDb()
  if (!db) throw new Error('publishDoc: Firestore unavailable')
  const ref = db.collection(collection).doc(id)
  const parent = await ref.get()
  if (!parent.exists) throw new Error(`publishDoc: ${collection}/${id} not found`)

  const existing = parent.data() as Record<string, unknown>
  const fields = contentFields(existing)

  await publishedDocRef(db, collection, id).set({
    ...fields,
    _snapshot_at: FieldValue.serverTimestamp(),
  })

  const update: Record<string, unknown> = {
    status: 'published',
    published_by: userId,
    has_unpublished_changes: false,
    published_card: extractPublishedCard(fields),
    last_published_at: FieldValue.serverTimestamp(),
  }
  if (!existing.published_at) update.published_at = FieldValue.serverTimestamp()

  await ref.update(update)
}

/**
 * Unpublish: flip status so the live URL 404s. The snapshot is retained so a
 * later re-publish is cheap and revision history is preserved. Caller revalidates.
 */
export async function unpublishDoc(
  collection: string,
  id: string,
  nextStatus: 'draft' | 'archived' = 'draft'
): Promise<void> {
  const db = getDb()
  if (!db) throw new Error('unpublishDoc: Firestore unavailable')
  await db.collection(collection).doc(id).update({ status: nextStatus })
}
