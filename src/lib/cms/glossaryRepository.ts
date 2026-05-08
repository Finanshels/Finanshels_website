import type { QueryDocumentSnapshot } from 'firebase-admin/firestore'
import { COLLECTIONS, getDb } from './firestore'
import { normalizeFirestoreTimestamps } from './normalizeDoc'
import { parseGlossaryTerm, type GlossaryTerm } from './schemas/glossary'

/** First page size; add cursor pagination or search for 500+ terms. */
const LIST_LIMIT = 200

export async function listPublishedGlossaryTerms(): Promise<GlossaryTerm[]> {
  const db = getDb()
  if (!db) return []

  const snap = await db
    .collection(COLLECTIONS.glossaryTerms)
    .where('status', '==', 'published')
    .orderBy('term')
    .limit(LIST_LIMIT)
    .get()

  const terms: GlossaryTerm[] = []
  for (const doc of snap.docs) {
    const data = normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>)
    const parsed = parseGlossaryTerm(data, doc.id)
    if (parsed) terms.push(parsed)
  }
  return terms
}

export async function getGlossaryTermBySlug(slug: string): Promise<GlossaryTerm | null> {
  const db = getDb()
  if (!db) return null

  const doc = await db.collection(COLLECTIONS.glossaryTerms).doc(slug).get()
  if (!doc.exists) return null

  const parsed = parseGlossaryTerm(
    normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>),
    doc.id
  )
  if (!parsed || parsed.status !== 'published') return null
  return parsed
}

export async function listAllPublishedGlossarySlugsWithDates(): Promise<
  { slug: string; lastModified: Date }[]
> {
  const db = getDb()
  if (!db) return []

  const out: { slug: string; lastModified: Date }[] = []
  const pageSize = 300
  let last: QueryDocumentSnapshot | null = null

  for (;;) {
    let q = db
      .collection(COLLECTIONS.glossaryTerms)
      .where('status', '==', 'published')
      .orderBy('slug')
      .limit(pageSize)

    if (last) q = q.startAfter(last)

    const snap = await q.get()
    if (snap.empty) break

    for (const doc of snap.docs) {
      const data = normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>)
      const updated = data.updatedAt
      const lastModified = updated instanceof Date ? updated : new Date()
      out.push({ slug: doc.id, lastModified })
    }

    last = snap.docs[snap.docs.length - 1]!
    if (snap.size < pageSize) break
  }

  return out
}
