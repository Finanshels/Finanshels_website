import 'server-only'
import { getDb } from './firestore'
import { getCmsDocument } from './collectionRepository'
import { normalizeFirestoreTimestamps } from './normalizeDoc'

/**
 * Read models for the public webinar surface at `/webinars` (hub) and
 * `/webinars/[slug]` (state-driven detail).
 *
 * The page renders by lifecycle: `webinar_status` of `upcoming`/`live` shows the
 * promo + registration; `completed` shows the on-demand replay + gated downloads
 * on the SAME URL. Typed/validated reads live here (the boundary) — there is no
 * separate Zod schema file, mirroring `ebooksRepository.ts`.
 *
 * `join_url` is intentionally NOT exposed in the public read model — it is only
 * emailed to registrants by `/api/webinars/register`.
 */

const COLLECTION = 'webinars'
/** Hub fetch cap. Single status-equality filter + in-memory sort (no index). */
const LIST_LIMIT = 60

export type WebinarStatus = 'upcoming' | 'live' | 'completed'
export type RegistrationMode = 'native' | 'external'

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

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((v): v is string => typeof v === 'string' && v.trim().length > 0).map((v) => v.trim())
    : []
}

/** datetime fields may be stored as ISO strings or Firestore Timestamps (→ Date). */
function asIsoDatetime(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString()
  const s = asString(value)
  if (!s) return null
  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? s : d.toISOString()
}

/** Document id is the slug for routed collections; fall back to the id. */
function readSlug(id: string, raw: Record<string, unknown>): string {
  const v = raw.slug
  return typeof v === 'string' && v.trim() ? v.trim() : id
}

function readWebinarStatus(value: unknown): WebinarStatus {
  return value === 'live' || value === 'completed' ? value : 'upcoming'
}

export type WebinarAgendaItem = { time: string | null; title: string }

/** agenda_items is a JSON array of strings (`"09:00 — Intro"`) or `{time,title}`. */
function readAgenda(value: unknown): WebinarAgendaItem[] {
  if (!Array.isArray(value)) return []
  const out: WebinarAgendaItem[] = []
  for (const item of value) {
    if (typeof item === 'string') {
      const title = item.trim()
      if (title) out.push({ time: null, title })
    } else if (item && typeof item === 'object') {
      const o = item as Record<string, unknown>
      const title = asString(o.title) || asString(o.label) || asString(o.description)
      if (title) out.push({ time: asOptionalString(o.time), title })
    }
  }
  return out
}

export type WebinarSpeaker = {
  name: string
  title: string | null
  photo: string | null
  bio: string | null
  linkedin: string | null
}

export type WebinarResource = {
  slug: string
  title: string
  coverImage: string | null
  gated: boolean
}

export type WebinarRelatedPost = {
  slug: string
  title: string
  excerpt: string
  image: string | null
}

export type WebinarCardData = {
  slug: string
  title: string
  status: WebinarStatus
  summary: string
  bannerImage: string | null
  startDatetime: string | null
  endDatetime: string | null
  timezone: string | null
  platform: string | null
  hostPartnerName: string | null
  hasRecording: boolean
  featured: boolean
}

export type WebinarDetail = WebinarCardData & {
  description: string
  registrationMode: RegistrationMode
  registrationUrl: string | null
  serviceInterest: string | null
  recordingUrl: string | null
  hostPartnerLogo: string | null
  agenda: WebinarAgendaItem[]
  keyTopics: string[]
  speakers: WebinarSpeaker[]
  downloads: WebinarResource[]
  relatedPosts: WebinarRelatedPost[]
  relatedWebinars: WebinarCardData[]
  /** Optional page-builder blocks appended below the structured content. */
  pageBlocks: unknown[]
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

function toCard(id: string, d: Record<string, unknown>): WebinarCardData {
  return {
    slug: readSlug(id, d),
    title: asString(d.webinar_title) || asString(d.title) || 'Untitled webinar',
    status: readWebinarStatus(d.webinar_status),
    summary: asString(d.summary) || stripHtml(d.description).slice(0, 200),
    bannerImage: asOptionalString(d.banner_image),
    startDatetime: asIsoDatetime(d.start_datetime),
    endDatetime: asIsoDatetime(d.end_datetime),
    timezone: asOptionalString(d.timezone),
    platform: asOptionalString(d.platform),
    hostPartnerName: asOptionalString(d.host_partner_name),
    hasRecording: Boolean(asOptionalString(d.recording_url)),
    featured: d.featured === true,
  }
}

/** Resolve an array of doc ids in a referenced collection, dropping misses. */
async function resolveSpeakers(ids: string[]): Promise<WebinarSpeaker[]> {
  const out: WebinarSpeaker[] = []
  for (const id of ids.slice(0, 12)) {
    const m = await getCmsDocument('team_members', id)
    if (!m) continue
    const name = asString(m.full_name) || asString(m.name)
    if (!name) continue
    out.push({
      name,
      title: asOptionalString(m.job_title),
      photo: asOptionalString(m.photo),
      bio: asOptionalString(m.short_bio),
      linkedin: asOptionalString(m.linkedin_url),
    })
  }
  return out
}

async function resolveDownloads(ids: string[]): Promise<WebinarResource[]> {
  const out: WebinarResource[] = []
  for (const id of ids.slice(0, 12)) {
    const e = await getCmsDocument('ebooks', id)
    if (!e || String(e.status ?? 'draft') !== 'published') continue
    const title = asString(e.ebook_title) || asString(e.title)
    if (!title) continue
    out.push({
      slug: readSlug(id, e),
      title,
      coverImage: asOptionalString(e.cover_image),
      gated: e.gated === true,
    })
  }
  return out
}

async function resolveRelatedPosts(ids: string[]): Promise<WebinarRelatedPost[]> {
  const out: WebinarRelatedPost[] = []
  for (const id of ids.slice(0, 6)) {
    const p = await getCmsDocument('blog_posts', id)
    if (!p || String(p.status ?? 'draft') !== 'published') continue
    const title = asString(p.title) || asString(p.seo_title)
    if (!title) continue
    out.push({
      slug: readSlug(id, p),
      title,
      excerpt: stripHtml(p.excerpt).slice(0, 160),
      image: asOptionalString(p.featured_image) || asOptionalString(p.card_image),
    })
  }
  return out
}

async function resolveRelatedWebinars(ids: string[], excludeSlug: string): Promise<WebinarCardData[]> {
  const out: WebinarCardData[] = []
  for (const id of ids.slice(0, 6)) {
    const w = await getCmsDocument('webinars', id)
    if (!w || String(w.status ?? 'draft') !== 'published') continue
    const card = toCard(id, w)
    if (card.slug === excludeSlug) continue
    out.push(card)
  }
  return out
}

/**
 * Published webinars for the `/webinars` hub. Single `status` equality filter
 * (no composite index); the page partitions upcoming vs on-demand and sorts.
 */
export async function listPublishedWebinars(limit = LIST_LIMIT): Promise<WebinarCardData[]> {
  const db = getDb()
  if (!db) return []
  const snap = await db.collection(COLLECTION).where('status', '==', 'published').limit(limit).get()
  return snap.docs.map((doc) =>
    toCard(doc.id, normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>))
  )
}

/** Public read model for `/webinars/[slug]`, or null when missing/unpublished. */
export async function getPublishedWebinarBySlug(slug: string): Promise<WebinarDetail | null> {
  const db = getDb()
  if (!db) return null
  const ref = await db.collection(COLLECTION).doc(slug).get()
  if (!ref.exists) return null
  const d = normalizeFirestoreTimestamps(ref.data() as Record<string, unknown>)
  if (String(d.status ?? 'draft') !== 'published') return null

  const card = toCard(ref.id, d)
  const mode: RegistrationMode = d.registration_mode === 'external' ? 'external' : 'native'

  const [speakers, downloads, relatedPosts, relatedWebinars] = await Promise.all([
    resolveSpeakers(asStringArray(d.speakerRefs)),
    resolveDownloads(asStringArray(d.downloadable_resources)),
    resolveRelatedPosts(asStringArray(d.relatedBlogRefs)),
    resolveRelatedWebinars(asStringArray(d.relatedWebinarRefs), card.slug),
  ])

  return {
    ...card,
    description: asString(d.description),
    registrationMode: mode,
    registrationUrl: asOptionalString(d.registration_url),
    serviceInterest: asOptionalString(d.service_interest),
    recordingUrl: asOptionalString(d.recording_url),
    hostPartnerLogo: asOptionalString(d.host_partner_logo),
    agenda: readAgenda(d.agenda_items),
    keyTopics: asStringArray(d.key_topics),
    speakers,
    downloads,
    relatedPosts,
    relatedWebinars,
    pageBlocks: Array.isArray(d.page_blocks) ? d.page_blocks : [],
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

/**
 * Server-only resolver used by `/api/webinars/register` to read registration
 * config + the join link to email registrants. Returns null unless published.
 */
export type WebinarRegistrationTarget = {
  slug: string
  title: string
  startDatetime: string | null
  timezone: string | null
  registrationMode: RegistrationMode
  joinUrl: string | null
  serviceInterest: string | null
}

export async function getWebinarRegistrationTarget(
  slug: string
): Promise<WebinarRegistrationTarget | null> {
  const db = getDb()
  if (!db) return null
  const ref = await db.collection(COLLECTION).doc(slug).get()
  if (!ref.exists) return null
  const d = normalizeFirestoreTimestamps(ref.data() as Record<string, unknown>)
  if (String(d.status ?? 'draft') !== 'published') return null
  return {
    slug: readSlug(ref.id, d),
    title: asString(d.webinar_title) || asString(d.title) || 'Webinar',
    startDatetime: asIsoDatetime(d.start_datetime),
    timezone: asOptionalString(d.timezone),
    registrationMode: d.registration_mode === 'external' ? 'external' : 'native',
    joinUrl: asOptionalString(d.join_url),
    serviceInterest: asOptionalString(d.service_interest),
  }
}
