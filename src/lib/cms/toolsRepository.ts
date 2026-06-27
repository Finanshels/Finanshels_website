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

  const snap = await db
    .collection(COLLECTIONS.tools)
    .where('status', '==', 'published')
    .orderBy('sort_order')
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
