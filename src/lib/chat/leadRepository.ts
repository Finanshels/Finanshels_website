import 'server-only'

import { FieldValue, Timestamp, type DocumentData } from 'firebase-admin/firestore'
import { getDb } from '@/lib/cms/firestore'
import { upsertZohoLead, type ZohoLeadInput, type ZohoUpsertResult } from './zoho'

export const CHAT_COLLECTION = 'chat_conversations'

export type ChatRole = 'user' | 'assistant' | 'system'

export interface StoredChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
  citations?: string[]
}

export type ZohoSyncStatus = 'pending' | 'queued' | 'synced' | 'failed'

export interface ChatLead {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  companyName?: string
  companySize?: string
  intent?: string
  consentAt?: string
}

export interface ChatConversation {
  sessionId: string
  ipHash?: string
  userAgent?: string
  pageUrl?: string
  messages: StoredChatMessage[]
  lead: ChatLead
  zohoLeadId: string | null
  zohoStatus: ZohoSyncStatus
  zohoLastError?: string
  intent?: string
  firstSeenAt: string
  lastSeenAt: string
  capturedAt: string | null
  messageCount: number
}

interface ChatConversationDoc {
  sessionId: string
  ipHash?: string
  userAgent?: string
  pageUrl?: string
  messages: Array<Omit<StoredChatMessage, 'createdAt'> & { createdAt: Timestamp }>
  lead: ChatLead
  zohoLeadId: string | null
  zohoStatus: ZohoSyncStatus
  zohoLastError?: string
  intent?: string
  firstSeenAt: Timestamp
  lastSeenAt: Timestamp
  capturedAt: Timestamp | null
  messageCount: number
}

function tsToIso(ts: Timestamp | undefined | null): string {
  if (!ts) return new Date().toISOString()
  return ts.toDate().toISOString()
}

function fromDoc(id: string, raw: DocumentData): ChatConversation {
  const doc = raw as Partial<ChatConversationDoc>
  return {
    sessionId: doc.sessionId ?? id,
    ipHash: doc.ipHash,
    userAgent: doc.userAgent,
    pageUrl: doc.pageUrl,
    messages: (doc.messages ?? []).map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      citations: m.citations,
      createdAt: tsToIso(m.createdAt),
    })),
    lead: doc.lead ?? {},
    zohoLeadId: doc.zohoLeadId ?? null,
    zohoStatus: doc.zohoStatus ?? 'pending',
    zohoLastError: doc.zohoLastError,
    intent: doc.intent,
    firstSeenAt: tsToIso(doc.firstSeenAt),
    lastSeenAt: tsToIso(doc.lastSeenAt),
    capturedAt: doc.capturedAt ? tsToIso(doc.capturedAt) : null,
    messageCount: doc.messageCount ?? (doc.messages?.length ?? 0),
  }
}

export interface EnsureSessionInput {
  sessionId: string
  ipHash?: string
  userAgent?: string
  pageUrl?: string
}

export async function ensureSession(input: EnsureSessionInput): Promise<ChatConversation | null> {
  const db = getDb()
  if (!db) return null

  const ref = db.collection(CHAT_COLLECTION).doc(input.sessionId)
  const snap = await ref.get()
  if (snap.exists) {
    const update: Record<string, unknown> = { lastSeenAt: FieldValue.serverTimestamp() }
    if (input.pageUrl) update.pageUrl = input.pageUrl
    await ref.update(update)
    const fresh = await ref.get()
    return fromDoc(fresh.id, fresh.data() ?? {})
  }

  const now = FieldValue.serverTimestamp()
  const doc: Record<string, unknown> = {
    sessionId: input.sessionId,
    ipHash: input.ipHash ?? null,
    userAgent: input.userAgent ?? null,
    pageUrl: input.pageUrl ?? null,
    messages: [],
    lead: {},
    zohoLeadId: null,
    zohoStatus: 'pending' as ZohoSyncStatus,
    intent: null,
    firstSeenAt: now,
    lastSeenAt: now,
    capturedAt: null,
    messageCount: 0,
  }
  await ref.set(doc)
  const fresh = await ref.get()
  return fromDoc(fresh.id, fresh.data() ?? {})
}

export async function getConversation(sessionId: string): Promise<ChatConversation | null> {
  const db = getDb()
  if (!db) return null
  const snap = await db.collection(CHAT_COLLECTION).doc(sessionId).get()
  if (!snap.exists) return null
  return fromDoc(snap.id, snap.data() ?? {})
}

export async function appendMessages(
  sessionId: string,
  newMessages: Omit<StoredChatMessage, 'createdAt'>[]
): Promise<void> {
  const db = getDb()
  if (!db) return
  const ref = db.collection(CHAT_COLLECTION).doc(sessionId)
  const now = Timestamp.now()
  const stored = newMessages.map((m) => ({ ...m, createdAt: now }))
  await ref.update({
    messages: FieldValue.arrayUnion(...stored),
    messageCount: FieldValue.increment(stored.length),
    lastSeenAt: FieldValue.serverTimestamp(),
  })
}

export async function setIntent(sessionId: string, intent: string): Promise<void> {
  const db = getDb()
  if (!db) return
  await db.collection(CHAT_COLLECTION).doc(sessionId).update({ intent })
}

export interface UpdateLeadInput extends ChatLead {
  pageUrl?: string
  conversationSummary?: string
}

export async function updateLeadAndSync(
  sessionId: string,
  patch: UpdateLeadInput
): Promise<{ conversation: ChatConversation | null; zoho: ZohoUpsertResult }> {
  const db = getDb()
  if (!db) {
    return {
      conversation: null,
      zoho: { ok: false, reason: 'unconfigured', detail: 'Firestore not configured' },
    }
  }

  const ref = db.collection(CHAT_COLLECTION).doc(sessionId)
  const before = await ref.get()
  if (!before.exists) {
    return {
      conversation: null,
      zoho: { ok: false, reason: 'unconfigured', detail: 'Session does not exist' },
    }
  }
  const existing = fromDoc(before.id, before.data() ?? {})

  const mergedLead: ChatLead = {
    ...existing.lead,
    ...Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined && v !== '')),
  }

  const update: Record<string, unknown> = {
    lead: mergedLead,
    lastSeenAt: FieldValue.serverTimestamp(),
  }
  if (patch.pageUrl) update.pageUrl = patch.pageUrl
  if (!existing.capturedAt) update.capturedAt = FieldValue.serverTimestamp()
  await ref.update(update)

  const zohoInput: ZohoLeadInput = {
    sessionId,
    firstName: mergedLead.firstName,
    lastName: mergedLead.lastName,
    email: mergedLead.email,
    phone: mergedLead.phone,
    companyName: mergedLead.companyName,
    companySize: mergedLead.companySize,
    intent: mergedLead.intent ?? existing.intent,
    conversationSummary: patch.conversationSummary,
    pageUrl: patch.pageUrl ?? existing.pageUrl,
  }

  const result = await upsertZohoLead(zohoInput, existing.zohoLeadId ?? undefined)

  const syncUpdate: Record<string, unknown> = {}
  if (result.ok) {
    syncUpdate.zohoLeadId = result.leadId
    syncUpdate.zohoStatus = 'synced' satisfies ZohoSyncStatus
    syncUpdate.zohoLastError = FieldValue.delete()
  } else if (result.reason === 'unconfigured') {
    syncUpdate.zohoStatus = 'queued' satisfies ZohoSyncStatus
    syncUpdate.zohoLastError = 'Zoho not configured — queued for replay'
  } else {
    syncUpdate.zohoStatus = 'failed' satisfies ZohoSyncStatus
    syncUpdate.zohoLastError = result.detail ?? result.reason
  }
  await ref.update(syncUpdate)

  const fresh = await ref.get()
  return { conversation: fromDoc(fresh.id, fresh.data() ?? {}), zoho: result }
}

export interface ListConversationsOptions {
  limit?: number
  capturedOnly?: boolean
}

export async function listConversations(
  options: ListConversationsOptions = {}
): Promise<ChatConversation[]> {
  const db = getDb()
  if (!db) return []
  const limit = options.limit ?? 50
  const baseQuery = options.capturedOnly
    ? db.collection(CHAT_COLLECTION).where('capturedAt', '!=', null).orderBy('capturedAt', 'desc')
    : db.collection(CHAT_COLLECTION).orderBy('lastSeenAt', 'desc')
  const snap = await baseQuery.limit(limit).get()
  return snap.docs.map((d) => fromDoc(d.id, d.data()))
}

export async function replayQueuedLeads(maxBatch = 10): Promise<{ replayed: number; failed: number }> {
  const db = getDb()
  if (!db) return { replayed: 0, failed: 0 }
  const snap = await db
    .collection(CHAT_COLLECTION)
    .where('zohoStatus', '==', 'queued')
    .limit(maxBatch)
    .get()

  let replayed = 0
  let failed = 0
  for (const docSnap of snap.docs) {
    const conv = fromDoc(docSnap.id, docSnap.data())
    const res = await upsertZohoLead({
      sessionId: conv.sessionId,
      ...conv.lead,
      conversationSummary: conv.messages.map((m) => `${m.role}: ${m.content}`).join('\n').slice(0, 30_000),
      pageUrl: conv.pageUrl,
    })
    if (res.ok) {
      await docSnap.ref.update({
        zohoLeadId: res.leadId,
        zohoStatus: 'synced' satisfies ZohoSyncStatus,
        zohoLastError: FieldValue.delete(),
      })
      replayed++
    } else {
      failed++
    }
  }
  return { replayed, failed }
}
