import 'server-only'
import { Timestamp } from 'firebase-admin/firestore'
import { getDb } from './firestore'
import { normalizeFirestoreTimestamps } from './normalizeDoc'
import {
  CMS_COLLECTION_DEFINITIONS,
  CMS_COLLECTION_DEFINITION_MAP,
  resolveDocumentTitle,
  type CmsCollectionDefinition,
  type CmsCollectionKey,
} from './collectionDefinitions'
import { slugifyForCms } from './slugify'
import { deleteCmsMediaObject } from './storageUpload'

// FIX-047: status enum collapsed from 6 values to 3. Legacy `scheduled` /
// `approved` / `archived` values from older docs are coerced via readStatus()
// so the runtime never sees them. The migration script
// `scripts/cms-collapse-status.mjs` permanently rewrites them in Firestore.
export type CmsDocumentStatus = 'draft' | 'in_review' | 'published'
export type CmsMediaAssetType = 'image' | 'video' | 'document' | 'other'

export type CmsDocumentListItem = {
  id: string
  slug: string
  title: string
  status: CmsDocumentStatus
  updatedAt?: Date
  createdAt?: Date
  publishedAt?: Date
}

export type CmsRevision = {
  id: string
  createdAt?: Date
  status: string
  updatedBy?: string
}

function readStatus(value: unknown): CmsDocumentStatus {
  if (value === 'published') return 'published'
  if (value === 'in_review') return 'in_review'
  // Legacy 6-state enum values get coerced to the closest new value.
  if (value === 'scheduled' || value === 'approved') return 'in_review'
  return 'draft'
}

function readTitle(value: unknown): string {
  if (typeof value === 'string' && value.trim()) return value
  return 'Untitled'
}

function referenceOptionLabel(
  docId: string,
  normalized: Record<string, unknown>,
  def: CmsCollectionDefinition
): string {
  // FIX-029: resolveDocumentTitle handles canonical + legacy alias fallbacks.
  // Use the slug as the ultimate fallback (different from resolveDocumentTitle's
  // 'Untitled' default) so reference dropdowns always show *something* clickable.
  const slug = readSlug(docId, normalized, def.slugField)
  return resolveDocumentTitle(def, normalized, slug)
}

function readSlug(id: string, raw: Record<string, unknown>, slugField: string): string {
  const val = raw[slugField]
  if (typeof val === 'string' && val.trim()) return val
  return id
}

function readOptionalString(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value.trim()
  return null
}

function inferCmsMediaAssetType(
  rawType: unknown,
  mimeType: string | null,
  assetUrl: string
): CmsMediaAssetType {
  if (rawType === 'image' || rawType === 'video' || rawType === 'document' || rawType === 'other') return rawType

  const mime = mimeType?.toLowerCase() ?? ''
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (
    mime === 'application/pdf' ||
    mime.startsWith('text/') ||
    mime.includes('document') ||
    mime.includes('spreadsheet') ||
    mime.includes('presentation') ||
    mime.includes('msword') ||
    mime.includes('officedocument') ||
    mime === 'application/rtf'
  ) {
    return 'document'
  }

  const cleanUrl = assetUrl.toLowerCase().split('?')[0] ?? ''
  if (/\.(png|jpe?g|gif|webp|svg)$/.test(cleanUrl)) return 'image'
  if (/\.(mp4|webm|mov|m4v)$/.test(cleanUrl)) return 'video'
  if (/\.(pdf|docx?|xlsx?|pptx?|csv|txt|rtf)$/.test(cleanUrl)) return 'document'

  return 'other'
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

/**
 * FIX-030: shared listing-query fallback ladder. Firestore can refuse an
 * ordered query when the indexed field doesn't exist on every document (common
 * mid-migration). We try the canonical sort (`updatedAt desc`), then a
 * structural sort by slug, then an unordered fetch — each path independently
 * caught so a single bad query doesn't kill the whole listing.
 *
 * Returns the snapshot plus a `truncated` flag indicating whether the result
 * hit the limit (callers surface this in the admin UI).
 */
async function safeOrderedQuery(
  db: FirebaseFirestore.Firestore,
  collection: string,
  slugField: string,
  limit: number
): Promise<{ snap: FirebaseFirestore.QuerySnapshot; truncated: boolean }> {
  let snap: FirebaseFirestore.QuerySnapshot
  try {
    snap = await db.collection(collection).orderBy('updatedAt', 'desc').limit(limit).get()
  } catch {
    try {
      snap = await db.collection(collection).orderBy(slugField).limit(limit).get()
    } catch {
      snap = await db.collection(collection).limit(limit).get()
    }
  }
  return { snap, truncated: snap.size >= limit }
}

export async function listCmsDocuments(
  collection: CmsCollectionKey,
  titleField: string,
  slugField: string,
  limit = 150
): Promise<CmsDocumentListItem[]> {
  const db = getDb()
  if (!db) return []

  const { snap } = await safeOrderedQuery(db, collection, slugField, limit)
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
    }
  })
}

export type CustomerStoryCardData = {
  slug: string
  title: string
  customer: string
  industry: string | null
  heroImage: string | null
  summary: string
  metric: { label: string; value: string } | null
  featured: boolean
  publishedAt?: Date
}

/**
 * Published customer stories (case studies) for the public `/customers` hub.
 * Reads card fields directly (the collection has no per-doc schema) and sorts
 * featured-first, then newest. Uses a single `status` equality filter — no
 * composite index required; the small case-study set is ordered in memory.
 */
export async function listPublishedCustomerStories(limit = 60): Promise<CustomerStoryCardData[]> {
  const db = getDb()
  if (!db) return []
  const def = CMS_COLLECTION_DEFINITION_MAP.customer_stories

  const snap = await db
    .collection('customer_stories')
    .where('status', '==', 'published')
    .limit(limit)
    .get()

  const stripHtml = (s: unknown) =>
    String(s ?? '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

  const cards = snap.docs.map((doc): CustomerStoryCardData => {
    const d = normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>)
    const metrics = Array.isArray(d.metrics_highlights) ? d.metrics_highlights : []
    const firstMetric = metrics.find(
      (m): m is Record<string, unknown> => !!m && typeof m === 'object'
    )
    const metric =
      firstMetric && (firstMetric.value || firstMetric.label)
        ? { label: String(firstMetric.label ?? ''), value: String(firstMetric.value ?? '') }
        : null
    const publishedAt =
      d.publishedAt instanceof Date
        ? d.publishedAt
        : d.publish_date instanceof Date
        ? d.publish_date
        : undefined
    return {
      slug: readSlug(doc.id, d, def.slugField),
      title: readTitle(d[def.titleField]),
      customer: typeof d.customer === 'string' ? d.customer : '',
      industry: typeof d.industry === 'string' && d.industry ? d.industry : null,
      heroImage: typeof d.hero_image === 'string' && d.hero_image.trim() ? d.hero_image.trim() : null,
      summary: stripHtml(d.results_summary || d.challenge_summary).slice(0, 180),
      metric,
      featured: d.featured === true,
      publishedAt,
    }
  })

  return cards.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0)
  })
}

export type CustomerReviewCardData = {
  id: string
  quote: string
  customerName: string
  designation: string | null
  company: string | null
  rating: number | null
  photo: string | null
  videoUrl: string | null
  featured: boolean
}

/**
 * Published + approved customer reviews (testimonials) for the `/customers` hub.
 * Reviews have no public detail page (embedded-only / blocklisted from
 * `/content`), so this returns inline quote data. Requires
 * `approved_for_publication === true` (PDPL/GDPR consent gate) on top of
 * `status === 'published'`; the consent flag is filtered in memory to avoid a
 * composite index. Featured first.
 */
export async function listPublishedCustomerReviews(limit = 60): Promise<CustomerReviewCardData[]> {
  const db = getDb()
  if (!db) return []

  const snap = await db
    .collection('customer_reviews')
    .where('status', '==', 'published')
    .limit(limit)
    .get()

  const stripHtml = (s: unknown) =>
    String(s ?? '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

  const reviews: CustomerReviewCardData[] = []
  for (const doc of snap.docs) {
    const d = normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>)
    if (d.approved_for_publication !== true) continue
    const quote = stripHtml(d.review_text)
    if (!quote) continue
    const ratingRaw = typeof d.rating === 'number' ? d.rating : Number(d.rating)
    reviews.push({
      id: doc.id,
      quote,
      customerName: typeof d.customer_name === 'string' ? d.customer_name : '',
      designation:
        typeof d.customer_designation === 'string' && d.customer_designation ? d.customer_designation : null,
      company: typeof d.company === 'string' && d.company ? d.company : null,
      rating: Number.isFinite(ratingRaw) && ratingRaw > 0 ? Math.min(5, Math.round(ratingRaw)) : null,
      photo: typeof d.customer_photo === 'string' && d.customer_photo.trim() ? d.customer_photo.trim() : null,
      videoUrl: typeof d.video_review_url === 'string' && d.video_review_url.trim() ? d.video_review_url.trim() : null,
      featured: d.featured === true,
    })
  }

  return reviews.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1))
}

export type PodcastCardData = {
  slug: string
  title: string
  podcastName: string | null
  episodeNumber: number | null
  duration: string | null
  summary: string
  heroImage: string | null
  topics: string[]
  publishedAt?: Date
}

/**
 * Published podcast episodes for the `/podcasts` hub, newest first. Reads card
 * fields directly (no per-doc schema). Single `status` equality filter — no
 * composite index required; the episode set is sorted in memory.
 */
export async function listPublishedPodcasts(limit = 60): Promise<PodcastCardData[]> {
  const db = getDb()
  if (!db) return []
  const def = CMS_COLLECTION_DEFINITION_MAP.podcasts

  const snap = await db
    .collection('podcasts')
    .where('status', '==', 'published')
    .limit(limit)
    .get()

  const stripHtml = (s: unknown) =>
    String(s ?? '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

  const cards = snap.docs.map((doc): PodcastCardData => {
    const d = normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>)
    const epRaw = typeof d.episode_number === 'number' ? d.episode_number : Number(d.episode_number)
    const publishedAt =
      d.publishedAt instanceof Date
        ? d.publishedAt
        : d.publish_date instanceof Date
        ? d.publish_date
        : undefined
    return {
      slug: readSlug(doc.id, d, def.slugField),
      title: readTitle(d[def.titleField]),
      podcastName: typeof d.podcast_name === 'string' && d.podcast_name ? d.podcast_name : null,
      episodeNumber: Number.isFinite(epRaw) && epRaw > 0 ? epRaw : null,
      duration: typeof d.duration === 'string' && d.duration ? d.duration : null,
      summary: stripHtml(d.episode_summary).slice(0, 180),
      heroImage: typeof d.featured_image === 'string' && d.featured_image.trim() ? d.featured_image.trim() : null,
      topics: (Array.isArray(d.key_topics) ? d.key_topics : []).filter(
        (t): t is string => typeof t === 'string' && t.trim().length > 0
      ),
      publishedAt,
    }
  })

  return cards.sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0))
}

export type CmsMediaLibraryItem = {
  id: string
  slug: string
  title: string
  status: CmsDocumentStatus
  assetType: CmsMediaAssetType
  assetUrl: string
  mimeType: string | null
  byteSize: number | null
  category: string | null
  folder: string | null
  updatedAtIso?: string
}

/** Media library grid — includes URLs and sizes for admin UI without N+1 getDocument calls. */
export async function listCmsMediaLibraryItems(limit = 400): Promise<CmsMediaLibraryItem[]> {
  const db = getDb()
  if (!db) return []
  const def = CMS_COLLECTION_DEFINITION_MAP.media_assets
  const titleField = def.titleField

  const { snap } = await safeOrderedQuery(db, 'media_assets', def.slugField, limit)

  return snap.docs.map((doc) => {
    const normalized = normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>)
    const slug = readSlug(doc.id, normalized, def.slugField)
    const title = readTitle(normalized[titleField])
    const assetUrl = typeof normalized.assetUrl === 'string' ? normalized.assetUrl : ''
    const mimeType = typeof normalized.mimeType === 'string' ? normalized.mimeType : null
    const byteSizeRaw = normalized.byteSize
    const byteSize =
      typeof byteSizeRaw === 'number' && Number.isFinite(byteSizeRaw)
        ? byteSizeRaw
        : typeof byteSizeRaw === 'string' && Number.isFinite(Number(byteSizeRaw))
        ? Number(byteSizeRaw)
        : null

    const updated =
      normalized.updatedAt instanceof Date
        ? normalized.updatedAt.toISOString()
        : normalized.updated_at instanceof Date
        ? (normalized.updated_at as Date).toISOString()
        : undefined

    return {
      id: doc.id,
      slug,
      title,
      status: readStatus(normalized.status),
      assetType: inferCmsMediaAssetType(normalized.assetType, mimeType, assetUrl),
      assetUrl,
      mimeType,
      byteSize,
      category: readOptionalString(normalized.category),
      folder: readOptionalString(normalized.folder),
      updatedAtIso: updated,
    }
  })
}

// FIX-049: added max-iteration guard to prevent unbounded loops.
const MAX_SLUG_ATTEMPTS = 200

/** Finds a Firestore-safe document id `{base}`, `{base}-2`, … that does not exist yet. */
export async function reserveUnusedMediaSlug(originalBase: string): Promise<string> {
  const db = getDb()
  if (!db) throw new Error('CMS is not configured')
  let base = slugifyForCms(originalBase).replace(/^-+|-+$/g, '') || 'asset'
  if (!base || base === '-') base = 'asset'
  let candidate = base
  let suffix = 0
  for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
    const snap = await db.collection('media_assets').doc(candidate).get()
    if (!snap.exists) return candidate
    suffix += 1
    candidate = `${base}-${suffix + 1}`
  }
  throw new Error(`Could not reserve a unique media slug after ${MAX_SLUG_ATTEMPTS} attempts (base: "${base}")`)
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
  const baseTitle = resolveDocumentTitle(def, data)

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
    // FIX-052: for media assets, delete the underlying Storage blob too — deleting
    // only the Firestore doc orphaned the file forever (cost + still public).
    // Best-effort: never let a storage hiccup block the Firestore delete.
    if (collection === 'media_assets') {
      const assetUrl = snap.get('assetUrl')
      if (typeof assetUrl === 'string' && assetUrl) {
        try {
          await deleteCmsMediaObject(assetUrl)
        } catch (err) {
          console.error('[cms] failed to delete media storage object', id, err)
        }
      }
    }
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

export type UpsertCmsDocumentOptions = {
  /**
   * Whether to snapshot the pre-save state into the `_revisions` subcollection.
   * Defaults to true (explicit saves are version checkpoints). Autosave passes
   * `false`: it fires every few seconds, so snapshotting each one doubled the
   * write count and let `_revisions` grow unbounded — which then slowed every
   * subsequent editor open (listCmsRevisions reads it back). Autosave still
   * persists the document itself; it just no longer creates a revision per tick.
   */
  snapshotRevision?: boolean
}

export async function upsertCmsDocument(
  collection: CmsCollectionKey,
  id: string,
  payload: Record<string, unknown>,
  updatedBy?: string,
  options: UpsertCmsDocumentOptions = {}
): Promise<void> {
  const { snapshotRevision = true } = options
  const db = getDb()
  if (!db) throw new Error('CMS is not configured')

  // Read the previous doc once: needed both for the optional revision snapshot
  // and for `isNew` detection below (createdAt / locale defaults).
  const previous = await db.collection(collection).doc(id).get()
  if (previous.exists && snapshotRevision) {
    const previousData = normalizeFirestoreTimestamps(previous.data() as Record<string, unknown>)
    await writeRevision(collection, id, previousData, updatedBy)
  }

  const now = Timestamp.now()
  // FIX-047: collapsed 6-state enum to 3.
  const allowedStatuses = new Set(['draft', 'in_review', 'published'])
  const incomingStatus = String(payload.status ?? 'draft')
  const status = allowedStatuses.has(incomingStatus) ? incomingStatus : 'draft'

  const isNew = !previous.exists
  // FIX-042: preserve existing locale/localeGroupId on partial updates. Earlier
  // behavior always wrote `locale: payload.locale || 'en'`, silently resetting an
  // existing 'ar' doc to 'en' on any save that didn't include locale in the form
  // — destructive after the Publish-tab UI dropped the Locale select in favor of
  // the global `language` field. Now: write only on new docs (defaults) or when
  // the caller explicitly provides the value.
  const localeUpdate =
    typeof payload.locale === 'string' && payload.locale
      ? { locale: payload.locale }
      : isNew
      ? { locale: 'en' }
      : {}
  const localeGroupIdUpdate =
    typeof payload.localeGroupId === 'string'
      ? { localeGroupId: payload.localeGroupId }
      : isNew
      ? { localeGroupId: null }
      : {}
  await db
    .collection(collection)
    .doc(id)
    .set(
      {
        ...payload,
        status,
        updatedAt: now,
        // FIX-047: scheduled publishing dropped. Always null so any pre-existing
        // value in the doc is cleared on the next save.
        scheduledAt: null,
        ...localeUpdate,
        ...localeGroupIdUpdate,
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
  const db = getDb()
  if (!db) return []

  const { snap } = await safeOrderedQuery(db, collection, def.slugField, limit)

  return snap.docs.map((doc) => {
    const normalized = normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>)
    return {
      id: doc.id,
      label: referenceOptionLabel(doc.id, normalized, def),
    }
  })
}

