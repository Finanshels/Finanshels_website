import { Timestamp } from 'firebase-admin/firestore'
import { getDb } from './firestore'
import { normalizeFirestoreTimestamps } from './normalizeDoc'
import {
  CMS_COLLECTION_DEFINITIONS,
  CMS_COLLECTION_DEFINITION_MAP,
  CMS_INCOMING_REFERENCES,
  type CmsCollectionKey,
} from './collectionDefinitions'

export type CmsDocumentStatus = 'draft' | 'in_review' | 'approved' | 'scheduled' | 'published' | 'archived'

export type CmsDocumentListItem = {
  id: string
  slug: string
  title: string
  status: CmsDocumentStatus
  updatedAt?: Date
  createdAt?: Date
  publishedAt?: Date
  scheduledAt?: Date
}

export type CmsRevision = {
  id: string
  createdAt?: Date
  status: string
  updatedBy?: string
}

function readStatus(value: unknown): CmsDocumentStatus {
  if (value === 'published') return 'published'
  if (value === 'scheduled') return 'scheduled'
  if (value === 'approved') return 'approved'
  if (value === 'in_review') return 'in_review'
  if (value === 'archived') return 'archived'
  return 'draft'
}

function readTitle(value: unknown): string {
  if (typeof value === 'string' && value.trim()) return value
  return 'Untitled'
}

function readSlug(id: string, raw: Record<string, unknown>, slugField: string): string {
  const val = raw[slugField]
  if (typeof val === 'string' && val.trim()) return val
  return id
}

/** Parallel count queries for sidebar item totals (Webflow-style “Collection (N)”). */
export async function getCmsCollectionItemCounts(): Promise<Partial<Record<CmsCollectionKey, number>>> {
  const db = getDb()
  if (!db) return {}

  const results = await Promise.all(
    CMS_COLLECTION_DEFINITIONS.map(async (def) => {
      try {
        const snap = await db.collection(def.key).count().get()
        return [def.key, snap.data().count] as const
      } catch {
        return [def.key, 0] as const
      }
    })
  )
  return Object.fromEntries(results) as Partial<Record<CmsCollectionKey, number>>
}

export async function listCmsDocuments(
  collection: CmsCollectionKey,
  titleField: string,
  slugField: string,
  limit = 150
): Promise<CmsDocumentListItem[]> {
  const db = getDb()
  if (!db) return []

  const snap = await db.collection(collection).orderBy('updatedAt', 'desc').limit(limit).get()
  return snap.docs.map((doc) => {
    const normalized = normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>)
    return {
      id: doc.id,
      slug: readSlug(doc.id, normalized, slugField),
      title: readTitle(normalized[titleField]),
      status: readStatus(normalized.status),
      updatedAt: normalized.updatedAt instanceof Date ? normalized.updatedAt : undefined,
      createdAt: normalized.createdAt instanceof Date ? normalized.createdAt : undefined,
      publishedAt: normalized.publishedAt instanceof Date ? normalized.publishedAt : undefined,
      scheduledAt: normalized.scheduledAt instanceof Date ? normalized.scheduledAt : undefined,
    }
  })
}

export async function bulkUpdateCmsDocumentStatus(
  collection: CmsCollectionKey,
  ids: string[],
  status: CmsDocumentStatus,
  updatedBy?: string
): Promise<{ updated: number }> {
  const db = getDb()
  if (!db) throw new Error('CMS is not configured')
  const cleanIds = [...new Set(ids.map((id) => id.trim()).filter(Boolean))]
  if (cleanIds.length === 0) return { updated: 0 }

  const now = Timestamp.now()
  let updated = 0
  for (const id of cleanIds) {
    const ref = db.collection(collection).doc(id)
    const snap = await ref.get()
    if (!snap.exists) continue
    const previousData = normalizeFirestoreTimestamps(snap.data() as Record<string, unknown>)
    await writeRevision(collection, id, previousData, updatedBy)
    await ref.set(
      {
        status,
        updatedAt: now,
        publishedAt: status === 'published' ? (previousData.publishedAt instanceof Date ? Timestamp.fromDate(previousData.publishedAt) : now) : null,
      },
      { merge: true }
    )
    updated += 1
  }
  return { updated }
}

export async function deleteCmsDocument(
  collection: CmsCollectionKey,
  id: string
): Promise<void> {
  await bulkDeleteCmsDocuments(collection, [id])
}

export async function duplicateCmsDocument(
  collection: CmsCollectionKey,
  sourceId: string,
  updatedBy?: string
): Promise<{ id: string; slug: string }> {
  const db = getDb()
  if (!db) throw new Error('CMS is not configured')
  const def = CMS_COLLECTION_DEFINITION_MAP[collection]
  if (!def) throw new Error('Unknown collection')

  const src = await db.collection(collection).doc(sourceId).get()
  if (!src.exists) throw new Error('Source not found')

  const data = normalizeFirestoreTimestamps(src.data() as Record<string, unknown>)

  const baseSlug = typeof data[def.slugField] === 'string' && data[def.slugField] ? String(data[def.slugField]) : sourceId
  const baseTitle = typeof data[def.titleField] === 'string' && data[def.titleField] ? String(data[def.titleField]) : 'Untitled'

  // Find a free slug: "{slug}-copy", "{slug}-copy-2", …
  let candidate = `${baseSlug}-copy`
  let attempt = 1
  while ((await db.collection(collection).doc(candidate).get()).exists) {
    attempt += 1
    candidate = `${baseSlug}-copy-${attempt}`
  }

  const payload: Record<string, unknown> = { ...data }
  // Drop server-managed/timestamp fields so upsert recomputes them.
  delete payload.createdAt
  delete payload.updatedAt
  delete payload.publishedAt
  delete payload.scheduledAt
  payload[def.slugField] = candidate
  payload[def.titleField] = `${baseTitle} (copy)`
  payload.status = 'draft'

  await upsertCmsDocument(collection, candidate, payload, updatedBy)
  return { id: candidate, slug: candidate }
}

export async function bulkDeleteCmsDocuments(
  collection: CmsCollectionKey,
  ids: string[]
): Promise<{ deleted: number }> {
  const db = getDb()
  if (!db) throw new Error('CMS is not configured')
  const cleanIds = [...new Set(ids.map((id) => id.trim()).filter(Boolean))]
  if (cleanIds.length === 0) return { deleted: 0 }

  let deleted = 0
  for (const id of cleanIds) {
    const ref = db.collection(collection).doc(id)
    const snap = await ref.get()
    if (!snap.exists) continue
    // Best-effort delete of revisions subcollection (small collection, sequential is fine).
    const revs = await ref.collection('_revisions').listDocuments()
    if (revs.length > 0) {
      const batch = db.batch()
      for (const r of revs) batch.delete(r)
      await batch.commit()
    }
    await ref.delete()
    deleted += 1
  }
  return { deleted }
}

export async function getCmsDocument(
  collection: CmsCollectionKey,
  id: string
): Promise<Record<string, unknown> | null> {
  const db = getDb()
  if (!db) return null
  const doc = await db.collection(collection).doc(id).get()
  if (!doc.exists) return null
  return normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>)
}

async function writeRevision(
  collection: CmsCollectionKey,
  id: string,
  snapshot: Record<string, unknown>,
  updatedBy?: string
): Promise<void> {
  const db = getDb()
  if (!db) return

  const now = Timestamp.now()
  await db
    .collection(collection)
    .doc(id)
    .collection('_revisions')
    .add({
      snapshot,
      status: snapshot.status ?? 'draft',
      createdAt: now,
      updatedBy: updatedBy ?? null,
    })
}

export async function upsertCmsDocument(
  collection: CmsCollectionKey,
  id: string,
  payload: Record<string, unknown>,
  updatedBy?: string
): Promise<void> {
  const db = getDb()
  if (!db) throw new Error('CMS is not configured')

  const previous = await db.collection(collection).doc(id).get()
  if (previous.exists) {
    const previousData = normalizeFirestoreTimestamps(previous.data() as Record<string, unknown>)
    await writeRevision(collection, id, previousData, updatedBy)
  }

  const now = Timestamp.now()
  const allowedStatuses = new Set(['draft', 'in_review', 'approved', 'scheduled', 'published'])
  const incomingStatus = String(payload.status ?? 'draft')
  const status = allowedStatuses.has(incomingStatus) ? incomingStatus : 'draft'
  const scheduledAtValue = typeof payload.scheduledAt === 'string' ? new Date(payload.scheduledAt) : payload.scheduledAt
  const scheduledAt =
    scheduledAtValue instanceof Date && Number.isFinite(scheduledAtValue.getTime())
      ? Timestamp.fromDate(scheduledAtValue)
      : null

  const isNew = !previous.exists
  await db
    .collection(collection)
    .doc(id)
    .set(
      {
        ...payload,
        status,
        updatedAt: now,
        scheduledAt,
        locale: typeof payload.locale === 'string' && payload.locale ? payload.locale : 'en',
        localeGroupId: typeof payload.localeGroupId === 'string' ? payload.localeGroupId : null,
        publishedAt: status === 'published' ? (payload.publishedAt instanceof Date ? Timestamp.fromDate(payload.publishedAt) : now) : null,
        ...(isNew ? { createdAt: now, createdBy: updatedBy ?? null } : {}),
      },
      { merge: true }
    )
}

export async function listCmsRevisions(
  collection: CmsCollectionKey,
  id: string,
  limit = 20
): Promise<CmsRevision[]> {
  const db = getDb()
  if (!db) return []

  const snap = await db.collection(collection).doc(id).collection('_revisions').orderBy('createdAt', 'desc').limit(limit).get()
  return snap.docs.map((doc) => {
    const data = normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>)
    return {
      id: doc.id,
      createdAt: data.createdAt instanceof Date ? data.createdAt : undefined,
      status: typeof data.status === 'string' ? data.status : 'draft',
      updatedBy: typeof data.updatedBy === 'string' ? data.updatedBy : undefined,
    }
  })
}

export async function rollbackCmsDocumentToRevision(
  collection: CmsCollectionKey,
  id: string,
  revisionId: string,
  updatedBy?: string
): Promise<void> {
  const db = getDb()
  if (!db) throw new Error('CMS is not configured')

  const revisionDoc = await db.collection(collection).doc(id).collection('_revisions').doc(revisionId).get()
  if (!revisionDoc.exists) throw new Error('Revision not found')

  const revision = normalizeFirestoreTimestamps(revisionDoc.data() as Record<string, unknown>)
  const snapshot = revision.snapshot
  if (!snapshot || typeof snapshot !== 'object') throw new Error('Invalid revision snapshot')

  await upsertCmsDocument(collection, id, snapshot as Record<string, unknown>, updatedBy)
}

export async function listReferenceOptions(
  collection: CmsCollectionKey,
  limit = 200
): Promise<Array<{ id: string; label: string }>> {
  const def = CMS_COLLECTION_DEFINITION_MAP[collection]
  if (!def) return []
  const docs = await listCmsDocuments(collection, def.titleField, def.slugField, limit)
  return docs.map((item) => ({ id: item.id, label: item.title }))
}

export type CmsReverseReferenceGroup = {
  source: CmsCollectionKey
  field: string
  label: string
  multi: boolean
  items: Array<{ id: string; title: string; status: CmsDocumentStatus }>
}

/**
 * Find every CMS document that references the given (collection, id). Drives
 * the "where this is used" panel in the admin editor. Cheap: each query is a
 * single equality filter — bounded by `limit` per relationship.
 */
export async function listReverseReferences(
  targetCollection: CmsCollectionKey,
  targetId: string,
  limit = 25
): Promise<CmsReverseReferenceGroup[]> {
  const db = getDb()
  if (!db) return []
  const incoming = CMS_INCOMING_REFERENCES[targetCollection] ?? []
  if (incoming.length === 0) return []

  const groups = await Promise.all(
    incoming.map(async (spec) => {
      const def = CMS_COLLECTION_DEFINITION_MAP[spec.source]
      if (!def) {
        return {
          source: spec.source,
          field: spec.field,
          label: spec.label,
          multi: spec.multi,
          items: [] as Array<{ id: string; title: string; status: CmsDocumentStatus }>,
        }
      }
      try {
        const op = spec.multi ? 'array-contains' : '=='
        const snap = await db
          .collection(spec.source)
          .where(spec.field, op as FirebaseFirestore.WhereFilterOp, targetId)
          .limit(limit)
          .get()
        const items = snap.docs.map((doc) => {
          const data = normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>)
          return {
            id: doc.id,
            title: readTitle(data[def.titleField]),
            status: readStatus(data.status),
          }
        })
        return { source: spec.source, field: spec.field, label: spec.label, multi: spec.multi, items }
      } catch {
        return {
          source: spec.source,
          field: spec.field,
          label: spec.label,
          multi: spec.multi,
          items: [] as Array<{ id: string; title: string; status: CmsDocumentStatus }>,
        }
      }
    })
  )

  return groups
}
