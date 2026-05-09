import type { QueryDocumentSnapshot } from 'firebase-admin/firestore'
import { COLLECTIONS, getDb } from './firestore'
import { normalizeFirestoreTimestamps } from './normalizeDoc'
import { parseBlogPost, type BlogPost } from './schemas/blog'

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

  const parsed = parseBlogPost(normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>), doc.id)
  if (!parsed || parsed.status !== 'published') return null
  return parsed
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
