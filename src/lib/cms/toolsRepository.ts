import 'server-only'
import { COLLECTIONS, getDb } from './firestore'
import { normalizeFirestoreTimestamps } from './normalizeDoc'
import { parseTool, type Tool } from './schemas/tools'

/** Tools are few; one page is plenty. Add pagination only past ~150. */
const LIST_LIMIT = 150

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const db = getDb()
  if (!db) return null

  const doc = await db.collection(COLLECTIONS.tools).doc(slug).get()
  if (!doc.exists) return null

  const tool = parseTool(
    normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>),
    doc.id
  )
  if (!tool || tool.status !== 'published') return null
  return tool
}

export async function listPublishedTools(): Promise<Tool[]> {
  const db = getDb()
  if (!db) return []

  // No Firestore orderBy: `sort_order` is stripped from the tools editor, so docs
  // don't carry the field and `orderBy('sort_order')` would exclude every one of
  // them (Firestore omits docs missing the ordered field). Load published tools
  // and sort in memory below.
  const snap = await db
    .collection(COLLECTIONS.tools)
    .where('status', '==', 'published')
    .limit(LIST_LIMIT)
    .get()

  const tools: Tool[] = []
  for (const doc of snap.docs) {
    const tool = parseTool(
      normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>),
      doc.id
    )
    if (tool) tools.push(tool)
  }
  return tools.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder
    return a.toolName.localeCompare(b.toolName)
  })
}

export interface ToolFaq {
  question: string
  answer: string
}

/** How many faq refs we resolve per tool — caps Firestore reads on the detail page. */
const FAQ_RESOLVE_LIMIT = 12

/**
 * Resolve a tool's `faq_items` (faqs doc ids) to published Q&A pairs, preserving
 * the curated order. Unpublished / missing / malformed refs are skipped silently
 * so an editor's stale reference never blanks the page.
 */
export async function resolveToolFaqs(ids: string[]): Promise<ToolFaq[]> {
  const db = getDb()
  if (!db || ids.length === 0) return []

  const out: ToolFaq[] = []
  for (const id of ids.slice(0, FAQ_RESOLVE_LIMIT)) {
    if (typeof id !== 'string' || !id.trim()) continue
    const doc = await db.collection(COLLECTIONS.faqs).doc(id.trim()).get()
    if (!doc.exists) continue
    const data = doc.data() as Record<string, unknown>
    if (data.status !== 'published') continue
    const question = typeof data.question === 'string' ? data.question.trim() : ''
    const answer = typeof data.answer === 'string' ? data.answer.trim() : ''
    if (!question || !answer) continue
    out.push({ question, answer })
  }
  return out
}
