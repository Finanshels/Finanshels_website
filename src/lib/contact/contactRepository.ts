import 'server-only'

import { FieldValue, Timestamp, type DocumentData } from 'firebase-admin/firestore'
import { getDb } from '@/lib/cms/firestore'

export const CONTACT_COLLECTION = 'contact_submissions'

export type ContactReason = 'sales' | 'support' | 'partnership' | 'careers'

export type ContactSyncStatus = 'pending' | 'queued' | 'synced' | 'failed'

export interface ContactSubmissionInput {
  name: string
  email: string
  company?: string
  phone?: string
  companySize?: string
  message: string
  reason: ContactReason
  pageUrl?: string
  userAgent?: string
  ipHash?: string
}

export interface ContactSubmission extends ContactSubmissionInput {
  id: string
  createdAt: string
  zohoLeadId: string | null
  zohoStatus: ContactSyncStatus
  zohoLastError?: string
  emailSentAt: string | null
  emailError?: string
}

function tsToIso(ts: Timestamp | undefined | null): string {
  if (!ts) return new Date().toISOString()
  return ts.toDate().toISOString()
}

function fromDoc(id: string, raw: DocumentData): ContactSubmission {
  return {
    id,
    name: raw.name ?? '',
    email: raw.email ?? '',
    company: raw.company ?? undefined,
    phone: raw.phone ?? undefined,
    companySize: raw.companySize ?? undefined,
    message: raw.message ?? '',
    reason: (raw.reason ?? 'sales') as ContactReason,
    pageUrl: raw.pageUrl ?? undefined,
    userAgent: raw.userAgent ?? undefined,
    ipHash: raw.ipHash ?? undefined,
    createdAt: tsToIso(raw.createdAt),
    zohoLeadId: raw.zohoLeadId ?? null,
    zohoStatus: (raw.zohoStatus ?? 'pending') as ContactSyncStatus,
    zohoLastError: raw.zohoLastError ?? undefined,
    emailSentAt: raw.emailSentAt ? tsToIso(raw.emailSentAt) : null,
    emailError: raw.emailError ?? undefined,
  }
}

/** Persists a contact submission. Returns null when Firestore is not configured. */
export async function writeContactSubmission(
  input: ContactSubmissionInput
): Promise<ContactSubmission | null> {
  const db = getDb()
  if (!db) return null

  const ref = db.collection(CONTACT_COLLECTION).doc()
  const doc: Record<string, unknown> = {
    name: input.name,
    email: input.email,
    company: input.company ?? null,
    phone: input.phone ?? null,
    companySize: input.companySize ?? null,
    message: input.message,
    reason: input.reason,
    pageUrl: input.pageUrl ?? null,
    userAgent: input.userAgent ?? null,
    ipHash: input.ipHash ?? null,
    createdAt: FieldValue.serverTimestamp(),
    zohoLeadId: null,
    zohoStatus: 'pending' as ContactSyncStatus,
    emailSentAt: null,
  }
  await ref.set(doc)
  const fresh = await ref.get()
  return fromDoc(fresh.id, fresh.data() ?? {})
}

export interface ContactSyncPatch {
  zohoLeadId?: string
  zohoStatus?: ContactSyncStatus
  zohoLastError?: string | null
  emailSentAt?: Date
  emailError?: string | null
}

export async function updateContactSyncState(id: string, patch: ContactSyncPatch): Promise<void> {
  const db = getDb()
  if (!db) return
  const update: Record<string, unknown> = {}
  if (patch.zohoLeadId !== undefined) update.zohoLeadId = patch.zohoLeadId
  if (patch.zohoStatus !== undefined) update.zohoStatus = patch.zohoStatus
  if (patch.zohoLastError !== undefined) {
    update.zohoLastError = patch.zohoLastError === null ? FieldValue.delete() : patch.zohoLastError
  }
  if (patch.emailSentAt !== undefined) update.emailSentAt = Timestamp.fromDate(patch.emailSentAt)
  if (patch.emailError !== undefined) {
    update.emailError = patch.emailError === null ? FieldValue.delete() : patch.emailError
  }
  if (Object.keys(update).length === 0) return
  await db.collection(CONTACT_COLLECTION).doc(id).update(update)
}
