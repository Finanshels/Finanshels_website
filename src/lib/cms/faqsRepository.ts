import 'server-only'
import { COLLECTIONS, getDb } from './firestore'
import { normalizeFirestoreTimestamps } from './normalizeDoc'
import { parseFaq, type CmsFaq } from './schemas/faqs'

const LIST_LIMIT = 300

export async function listPublishedFaqs(): Promise<CmsFaq[]> {
  const db = getDb()
  if (!db) return []

  const snap = await db
    .collection(COLLECTIONS.faqs)
    .where('status', '==', 'published')
    .limit(LIST_LIMIT)
    .get()

  const faqs: CmsFaq[] = []
  for (const doc of snap.docs) {
    const data = normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>)
    const parsed = parseFaq(data, doc.id)
    if (parsed) faqs.push(parsed)
  }

  // Sort in memory so docs without sort_order are included rather than dropped
  faqs.sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))
  return faqs
}

/**
 * Published FAQs tagged with `service` (a slug from contentCategoryOptions.ts),
 * in sort_order. Filtered in memory off `listPublishedFaqs` — FAQ volume is
 * small (<= LIST_LIMIT) so this avoids a composite array-contains + status index.
 */
export async function listPublishedFaqsByService(service: string): Promise<CmsFaq[]> {
  const target = service.trim()
  if (!target) return []
  const all = await listPublishedFaqs()
  return all.filter((faq) => (faq.service_category ?? []).includes(target))
}
