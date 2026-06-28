import 'server-only'
import type { Firestore, QueryDocumentSnapshot } from 'firebase-admin/firestore'
import { COLLECTIONS, getDb } from './firestore'
import { normalizeFirestoreTimestamps } from './normalizeDoc'
import { getEffectivePublishedData } from './publishWorkflow/operations'
import { parseBlogPost, type BlogPost } from './schemas/blog'

// FIX-048: the `author` field on blog_posts is a reference to a team_members
// doc id (per collectionDefinitions.ts). Old / imported docs may still store
// a display-name string directly. Heuristic: if the value contains
// whitespace, treat it as a display name and skip the lookup; otherwise try
// to resolve it as a team_members id and substitute `full_name`. Falls
// through to the original value on any miss.
async function resolveAuthorDisplayName(db: Firestore, post: BlogPost): Promise<BlogPost> {
  const authorRef = post.author
  if (!authorRef || authorRef.includes(' ')) return post
  try {
    const memberDoc = await db.collection(COLLECTIONS.teamMembers).doc(authorRef).get()
    if (!memberDoc.exists) return post
    const data = memberDoc.data() as Record<string, unknown> | undefined
    const fullName = typeof data?.full_name === 'string' ? data.full_name.trim() : ''
    if (!fullName) return post
    return { ...post, author: fullName }
  } catch {
    return post
  }
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

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
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

  const raw = normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>)
  if (raw.status !== 'published') return null

  // Two-version: render the published snapshot (falls back to the draft until a
  // snapshot exists). The editor reads the draft directly via getCmsDocument.
  const effective = await getEffectivePublishedData(COLLECTIONS.blogPosts, doc.id, raw)
  const parsed = parseBlogPost(effective, doc.id)
  if (!parsed || parsed.status !== 'published') return null
  return resolveAuthorDisplayName(db, parsed)
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
