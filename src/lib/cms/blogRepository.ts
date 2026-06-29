import 'server-only'
import type { Firestore, QueryDocumentSnapshot } from 'firebase-admin/firestore'
import { COLLECTIONS, getDb } from './firestore'
import { normalizeFirestoreTimestamps } from './normalizeDoc'
import { parseBlogPost, type BlogPost } from './schemas/blog'
import { resolveAuthorProfile, type AuthorProfile } from './authorsRepository'

/** A blog post with its resolved author profile (FIX-068). */
export type BlogPostWithAuthor = BlogPost & { authorProfile: AuthorProfile | null }

/** Lightweight card for the "posts by this author" grid on `/author/[slug]`. */
export type AuthorPostCard = {
  slug: string
  title: string
  excerpt: string | null
  image: string | null
  publishedAt: Date
}

// FIX-048: the `author` field on blog_posts is a reference to a team_members
// doc id (per collectionDefinitions.ts). Old / imported docs may still store
// a display-name string directly. Heuristic: if the value contains
// whitespace, treat it as a display name and skip the lookup; otherwise resolve
// it as a team_members id. Falls through to the original value on any miss.
async function resolveAuthorNameOnly(db: Firestore, post: BlogPost): Promise<string | undefined> {
  const authorRef = post.author
  if (!authorRef || authorRef.includes(' ')) return post.author
  try {
    const memberDoc = await db.collection(COLLECTIONS.teamMembers).doc(authorRef).get()
    if (!memberDoc.exists) return post.author
    const data = memberDoc.data() as Record<string, unknown> | undefined
    const fullName = typeof data?.full_name === 'string' ? data.full_name.trim() : ''
    return fullName || post.author
  } catch {
    return post.author
  }
}

// FIX-068: resolve the FULL author profile (photo + socials + bio) for the
// byline, not just the display name. `resolveAuthorProfile` gates on the author
// being published; when it returns null (legacy name string, missing, or a
// draft author doc) we fall back to the name-only lookup so a name still shows.
async function attachAuthor(db: Firestore, post: BlogPost): Promise<BlogPostWithAuthor> {
  const authorRef = post.author
  if (authorRef && !authorRef.includes(' ')) {
    const profile = await resolveAuthorProfile(authorRef)
    if (profile) return { ...post, author: profile.name, authorProfile: profile }
  }
  const author = await resolveAuthorNameOnly(db, post)
  return { ...post, author, authorProfile: null }
}

const LIST_LIMIT = 48

export async function listPublishedBlogPosts(): Promise<BlogPost[]> {
  const db = getDb()
  if (!db) return []

  const snap = await db
    .collection(COLLECTIONS.blogPosts)
    .where('status', '==', 'published')
    .orderBy('publishedAt', 'desc')
    .limit(LIST_LIMIT)
    .get()

  const posts: BlogPost[] = []
  for (const doc of snap.docs) {
    const data = normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>)
    const parsed = parseBlogPost(data, doc.id)
    if (parsed) posts.push(parsed)
  }
  return posts
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostWithAuthor | null> {
  const db = getDb()
  if (!db) return null

  const byId = await db.collection(COLLECTIONS.blogPosts).doc(slug).get()
  let doc = byId
  if (!byId.exists) {
    /** Slug shown in CMS can differ from Firestore doc id (imports / manual docs). */
    const byField = await db.collection(COLLECTIONS.blogPosts).where('slug', '==', slug).limit(1).get()
    if (byField.empty) return null
    doc = byField.docs[0]!
  }

  const parsed = parseBlogPost(normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>), doc.id)
  if (!parsed || parsed.status !== 'published') return null
  return attachAuthor(db, parsed)
}

/**
 * FIX-068: published posts authored by a given `team_members` doc id, for the
 * `/author/[slug]` profile page. Single-field `author` equality (no composite
 * index) + in-memory published filter and date sort — mirrors the glossary
 * client-filter cost pattern.
 */
export async function listPublishedPostsByAuthor(
  authorId: string,
  limit = 24
): Promise<AuthorPostCard[]> {
  const db = getDb()
  if (!db || !authorId.trim()) return []

  const snap = await db
    .collection(COLLECTIONS.blogPosts)
    .where('author', '==', authorId)
    .limit(60)
    .get()

  const cards: AuthorPostCard[] = []
  for (const doc of snap.docs) {
    const parsed = parseBlogPost(normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>), doc.id)
    if (!parsed || parsed.status !== 'published') continue
    cards.push({
      slug: parsed.slug,
      title: parsed.title,
      excerpt: parsed.card_description ?? parsed.excerpt ?? null,
      image: parsed.card_image ?? parsed.featured_image ?? null,
      publishedAt: parsed.publishedAt,
    })
  }

  return cards
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, limit)
}

/** For sitemap generation — paginates to stay within memory. */
export async function listAllPublishedBlogSlugsWithDates(): Promise<
  { slug: string; lastModified: Date }[]
> {
  const db = getDb()
  if (!db) return []

  const out: { slug: string; lastModified: Date }[] = []
  const pageSize = 300
  let last: QueryDocumentSnapshot | null = null

  for (;;) {
    let q = db
      .collection(COLLECTIONS.blogPosts)
      .where('status', '==', 'published')
      .orderBy('slug')
      .limit(pageSize)

    if (last) q = q.startAfter(last)

    const snap = await q.get()
    if (snap.empty) break

    for (const doc of snap.docs) {
      const data = normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>)
      const updated = data.updatedAt
      const published = data.publishedAt
      const lastModified =
        updated instanceof Date
          ? updated
          : published instanceof Date
            ? published
            : new Date()
      out.push({ slug: doc.id, lastModified })
    }

    last = snap.docs[snap.docs.length - 1]!
    if (snap.size < pageSize) break
  }

  return out
}
