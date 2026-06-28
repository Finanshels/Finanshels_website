import 'server-only'
import { getDb } from './firestore'
import { normalizeFirestoreTimestamps } from './normalizeDoc'

/**
 * Read models for the public ebook (lead-magnet) surface at `/guides`.
 *
 * Built from the trimmed `ebooks` publish fields (no card section — the hub
 * card renders from cover_image / ebook_title / full_description). The download
 * URL (`file_upload`) is treated as sensitive: for **gated** ebooks it is NEVER
 * placed in the public read model (FIX-048 — never leak a gated download URL
 * into HTML). Gated files are resolved server-side only by `getEbookDownload`
 * after a successful lead capture (see `/api/guides/lead`).
 */

const COLLECTION = 'ebooks'

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function asOptionalString(value: unknown): string | null {
  const s = asString(value)
  return s ? s : null
}

function stripHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Document id is the slug for routed collections; fall back to the id. */
function readSlug(id: string, raw: Record<string, unknown>): string {
  const v = raw.slug
  return typeof v === 'string' && v.trim() ? v.trim() : id
}

export type EbookCardData = {
  slug: string
  title: string
  coverImage: string | null
  summary: string
  format: string | null
  pageCount: number | null
  topics: string[]
  gated: boolean
  featured: boolean
}

export type EbookDetail = EbookCardData & {
  fullDescription: string
  /**
   * Direct download URL. Populated **only for non-gated ebooks**; `null` when
   * the ebook is gated (the file is delivered by the lead API after capture).
   */
  fileUrl: string | null
  seo: {
    seoTitle: string | null
    metaDescription: string | null
    ogTitle: string | null
    ogDescription: string | null
    ogImage: string | null
    canonicalUrl: string | null
    robotsMeta: string | null
    focusKeyword: string | null
  }
}

function toCard(id: string, d: Record<string, unknown>): EbookCardData {
  const topics = Array.isArray(d.topics)
    ? d.topics.filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
    : []
  const pageCountRaw = typeof d.page_count === 'number' ? d.page_count : Number(d.page_count)
  return {
    slug: readSlug(id, d),
    title: asString(d.ebook_title) || 'Untitled',
    coverImage: asOptionalString(d.cover_image),
    summary: stripHtml(d.full_description).slice(0, 200),
    format: asOptionalString(d.format),
    pageCount: Number.isFinite(pageCountRaw) && pageCountRaw > 0 ? pageCountRaw : null,
    topics,
    gated: d.gated === true,
    featured: d.featured === true,
  }
}

/**
 * Published ebooks for the `/guides` hub. Single `status` equality filter
 * (no composite index); featured first, then alphabetical.
 */
export async function listPublishedEbooks(limit = 60): Promise<EbookCardData[]> {
  const db = getDb()
  if (!db) return []
  const snap = await db.collection(COLLECTION).where('status', '==', 'published').limit(limit).get()
  const cards = snap.docs.map((doc) =>
    toCard(doc.id, normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>))
  )
  return cards.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return a.title.localeCompare(b.title)
  })
}

/** Public read model for the `/guides/[slug]` detail page, or null. */
export async function getPublishedEbookBySlug(slug: string): Promise<EbookDetail | null> {
  const db = getDb()
  if (!db) return null
  const ref = await db.collection(COLLECTION).doc(slug).get()
  if (!ref.exists) return null
  const d = normalizeFirestoreTimestamps(ref.data() as Record<string, unknown>)
  if (String(d.status ?? 'draft') !== 'published') return null

  const card = toCard(ref.id, d)
  return {
    ...card,
    fullDescription: asString(d.full_description),
    // FIX-048: gated download URLs never enter the public read model.
    fileUrl: card.gated ? null : asOptionalString(d.file_upload),
    seo: {
      seoTitle: asOptionalString(d.seo_title),
      metaDescription: asOptionalString(d.meta_description),
      ogTitle: asOptionalString(d.og_title),
      ogDescription: asOptionalString(d.og_description),
      ogImage: asOptionalString(d.og_image),
      canonicalUrl: asOptionalString(d.canonical_url),
      robotsMeta: asOptionalString(d.robots_meta),
      focusKeyword: asOptionalString(d.focus_keyword),
    },
  }
}

export type EbookDownload = {
  slug: string
  title: string
  fileUrl: string | null
  gated: boolean
}

/**
 * Server-only resolver for the actual download URL. Used by the lead API to
 * hand back the file *after* a gated capture succeeds. Returns null unless the
 * ebook exists and is published.
 */
export async function getEbookDownload(slug: string): Promise<EbookDownload | null> {
  const db = getDb()
  if (!db) return null
  const ref = await db.collection(COLLECTION).doc(slug).get()
  if (!ref.exists) return null
  const d = normalizeFirestoreTimestamps(ref.data() as Record<string, unknown>)
  if (String(d.status ?? 'draft') !== 'published') return null
  return {
    slug: readSlug(ref.id, d),
    title: asString(d.ebook_title) || 'Untitled',
    fileUrl: asOptionalString(d.file_upload),
    gated: d.gated === true,
  }
}
