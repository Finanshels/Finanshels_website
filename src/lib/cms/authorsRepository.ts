import 'server-only'
import { getDb } from './firestore'
import { normalizeFirestoreTimestamps } from './normalizeDoc'

/**
 * FIX-068: read models for the public author surface at `/authors` (listing)
 * and `/author/[slug]` (profile). Backed by the `team_members` collection
 * (renamed "Authors" in the admin — the Firestore key is unchanged).
 *
 * SECURITY — PII whitelist: the underlying `team_members` doc holds `email`
 * and `phone`. These read models build the public object field-by-field and
 * NEVER include contact PII. This is why `team_members` stays in the generic
 * `/content/[collection]/[slug]` blocklist (that route dumps the whole doc).
 * Add only safe, public-by-design fields here.
 */

const COLLECTION = 'team_members'
/** Listing fetch cap — single status-equality filter + in-memory sort (no index). */
const LIST_LIMIT = 200

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function asOptionalString(value: unknown): string | null {
  const s = asString(value)
  return s ? s : null
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((v): v is string => typeof v === 'string' && v.trim().length > 0).map((v) => v.trim())
    : []
}

/** Document id is the slug for routed collections; fall back to the id. */
function readSlug(id: string, raw: Record<string, unknown>): string {
  const v = raw.slug
  return typeof v === 'string' && v.trim() ? v.trim() : id
}

function readSortOrder(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER
}

export type AuthorSocials = {
  linkedin: string | null
  twitter: string | null
  instagram: string | null
  website: string | null
}

/** Compact author byline used on blog/webinar bylines and the `/authors` grid. */
export type AuthorProfile = {
  slug: string
  name: string
  photo: string | null
  jobTitle: string | null
  department: string | null
  shortBio: string | null
  fullBio: string | null
  expertiseTags: string[]
  socials: AuthorSocials
}

/** Build the safe public profile from a raw `team_members` doc. NO email/phone. */
function toProfile(id: string, d: Record<string, unknown>): AuthorProfile {
  return {
    slug: readSlug(id, d),
    name: asString(d.full_name) || asString(d.name) || 'Author',
    photo: asOptionalString(d.photo),
    jobTitle: asOptionalString(d.job_title),
    department: asOptionalString(d.department),
    shortBio: asOptionalString(d.short_bio),
    fullBio: asOptionalString(d.full_bio),
    expertiseTags: asStringArray(d.expertise_tags),
    socials: {
      linkedin: asOptionalString(d.linkedin_url),
      twitter: asOptionalString(d.twitter_url),
      instagram: asOptionalString(d.instagram_url),
      website: asOptionalString(d.website_url),
    },
  }
}

/**
 * Resolve a single author profile by its `team_members` doc id (the value the
 * blog `author` field stores). Used by the blog byline. Returns null on miss,
 * an unpublished doc, or any Firestore error (never throws into the page).
 */
export async function resolveAuthorProfile(authorRef: string): Promise<AuthorProfile | null> {
  if (!authorRef.trim()) return null
  try {
    const db = getDb()
    if (!db) return null
    const ref = await db.collection(COLLECTION).doc(authorRef).get()
    if (!ref.exists) return null
    const d = normalizeFirestoreTimestamps(ref.data() as Record<string, unknown>)
    if (String(d.status ?? 'draft') !== 'published') return null
    return toProfile(ref.id, d)
  } catch {
    return null
  }
}

/** Public read model for `/author/[slug]`, or null when missing/unpublished. */
export async function getPublishedAuthorBySlug(slug: string): Promise<AuthorProfile | null> {
  const db = getDb()
  if (!db) return null
  const ref = await db.collection(COLLECTION).doc(slug).get()
  if (!ref.exists) return null
  const d = normalizeFirestoreTimestamps(ref.data() as Record<string, unknown>)
  if (String(d.status ?? 'draft') !== 'published') return null
  return toProfile(ref.id, d)
}

/** Published authors for the `/authors` index, sorted by sort_order then name. */
export async function listPublishedAuthors(limit = LIST_LIMIT): Promise<AuthorProfile[]> {
  const db = getDb()
  if (!db) return []
  const snap = await db.collection(COLLECTION).where('status', '==', 'published').limit(limit).get()
  const profiles = snap.docs.map((doc) => {
    const d = normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>)
    return { profile: toProfile(doc.id, d), sortOrder: readSortOrder(d.sort_order) }
  })
  return profiles
    .sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder
      return a.profile.name.localeCompare(b.profile.name)
    })
    .map((p) => p.profile)
}
