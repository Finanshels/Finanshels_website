import 'server-only'
import { createHash, pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto'
import { Timestamp } from 'firebase-admin/firestore'
import { getDb } from './firestore'
import { normalizeFirestoreTimestamps } from './normalizeDoc'

import {
  ROLE_RANK,
  ROLE_LABEL,
  ROLE_DESCRIPTION,
  isValidRole,
  roleAtLeast,
} from './roles'
import type { CmsUserRole, CmsUserStatus } from './roles'

export const USERS_COLLECTION = 'cms_users'

// Role catalog lives in the client-safe `./roles` module (no firebase-admin) so
// it can be shared with client components. Re-export here so existing
// `@/lib/cms/usersRepository` imports continue to resolve unchanged.
export { ROLE_RANK, ROLE_LABEL, ROLE_DESCRIPTION, isValidRole, roleAtLeast }
export type { CmsUserRole, CmsUserStatus }

export type CmsUserPublic = {
  id: string
  email: string
  name: string
  role: CmsUserRole
  status: CmsUserStatus
  createdAt?: Date
  createdBy?: string
  updatedAt?: Date
  lastLoginAt?: Date
  tokenVersion: number
  inviteSentAt?: Date
  inviteExpiresAt?: Date
  resetSentAt?: Date
  resetExpiresAt?: Date
}

type CmsUserRecord = CmsUserPublic & {
  passwordHash: string
  passwordSalt: string
  passwordIterations: number
  inviteTokenHash?: string | null
  resetTokenHash?: string | null
}

const PBKDF2_ITERATIONS = 200_000
const PBKDF2_KEYLEN = 32
const PBKDF2_DIGEST = 'sha256'

const INVITE_TOKEN_BYTES = 32
const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

// Password-reset tokens are short-lived (1h) — much shorter than the 7-day
// invite window — because they let anyone with the link take over an *active*
// account. Same 32-byte random token, SHA-256-hashed at rest.
const RESET_TTL_MS = 1000 * 60 * 60 // 1 hour

export function generateInviteToken(): { raw: string; hash: string } {
  const raw = randomBytes(INVITE_TOKEN_BYTES).toString('hex')
  const hash = createHash('sha256').update(raw).digest('hex')
  return { raw, hash }
}

export function hashInviteToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex')
}

export function normalizeEmail(input: string): string {
  return input.trim().toLowerCase()
}

export function hashPassword(password: string, salt?: string, iterations: number = PBKDF2_ITERATIONS) {
  const usedSalt = salt ?? randomBytes(16).toString('hex')
  const hash = pbkdf2Sync(password, usedSalt, iterations, PBKDF2_KEYLEN, PBKDF2_DIGEST).toString('hex')
  return { hash, salt: usedSalt, iterations }
}

export function verifyPassword(password: string, salt: string, iterations: number, expectedHash: string): boolean {
  const computed = pbkdf2Sync(password, salt, iterations, PBKDF2_KEYLEN, PBKDF2_DIGEST)
  const expected = Buffer.from(expectedHash, 'hex')
  if (computed.length !== expected.length) return false
  return timingSafeEqual(computed, expected)
}

function toPublicUser(record: CmsUserRecord): CmsUserPublic {
  const { passwordHash: _h, passwordSalt: _s, passwordIterations: _i, ...rest } = record
  return rest
}

function readStatus(value: unknown): CmsUserStatus {
  if (value === 'disabled') return 'disabled'
  if (value === 'invited') return 'invited'
  return 'active'
}

function readUserDoc(id: string, raw: Record<string, unknown>): CmsUserRecord | null {
  const email = typeof raw.email === 'string' ? raw.email : null
  const role = isValidRole(raw.role) ? raw.role : null
  if (!email || !role) return null
  return {
    id,
    email,
    role,
    name: typeof raw.name === 'string' ? raw.name : '',
    status: readStatus(raw.status),
    createdAt: raw.createdAt instanceof Date ? raw.createdAt : undefined,
    createdBy: typeof raw.createdBy === 'string' ? raw.createdBy : undefined,
    updatedAt: raw.updatedAt instanceof Date ? raw.updatedAt : undefined,
    lastLoginAt: raw.lastLoginAt instanceof Date ? raw.lastLoginAt : undefined,
    tokenVersion: typeof raw.tokenVersion === 'number' ? raw.tokenVersion : 1,
    passwordHash: typeof raw.passwordHash === 'string' ? raw.passwordHash : '',
    passwordSalt: typeof raw.passwordSalt === 'string' ? raw.passwordSalt : '',
    passwordIterations:
      typeof raw.passwordIterations === 'number' ? raw.passwordIterations : PBKDF2_ITERATIONS,
    inviteTokenHash: typeof raw.inviteTokenHash === 'string' ? raw.inviteTokenHash : null,
    inviteSentAt: raw.inviteSentAt instanceof Date ? raw.inviteSentAt : undefined,
    inviteExpiresAt: raw.inviteExpiresAt instanceof Date ? raw.inviteExpiresAt : undefined,
    resetTokenHash: typeof raw.resetTokenHash === 'string' ? raw.resetTokenHash : null,
    resetSentAt: raw.resetSentAt instanceof Date ? raw.resetSentAt : undefined,
    resetExpiresAt: raw.resetExpiresAt instanceof Date ? raw.resetExpiresAt : undefined,
  }
}

export async function getUserCount(): Promise<number> {
  const db = getDb()
  if (!db) return 0
  try {
    const snap = await db.collection(USERS_COLLECTION).count().get()
    return snap.data().count
  } catch {
    return 0
  }
}

export async function listUsers(): Promise<CmsUserPublic[]> {
  const db = getDb()
  if (!db) return []
  const snap = await db.collection(USERS_COLLECTION).orderBy('createdAt', 'desc').limit(500).get()
  const users: CmsUserPublic[] = []
  for (const doc of snap.docs) {
    const record = readUserDoc(doc.id, normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>))
    if (record) users.push(toPublicUser(record))
  }
  return users
}

export async function getUserByEmail(email: string): Promise<CmsUserRecord | null> {
  const db = getDb()
  if (!db) return null
  const normalized = normalizeEmail(email)
  const snap = await db.collection(USERS_COLLECTION).where('email', '==', normalized).limit(1).get()
  if (snap.empty) return null
  const doc = snap.docs[0]
  return readUserDoc(doc.id, normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>))
}

export async function getUserById(id: string): Promise<CmsUserPublic | null> {
  const db = getDb()
  if (!db) return null
  const doc = await db.collection(USERS_COLLECTION).doc(id).get()
  if (!doc.exists) return null
  const record = readUserDoc(doc.id, normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>))
  return record ? toPublicUser(record) : null
}

export async function getUserRecordById(id: string): Promise<CmsUserRecord | null> {
  const db = getDb()
  if (!db) return null
  const doc = await db.collection(USERS_COLLECTION).doc(id).get()
  if (!doc.exists) return null
  return readUserDoc(doc.id, normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>))
}

export async function countOwners(): Promise<number> {
  const db = getDb()
  if (!db) return 0
  try {
    const snap = await db
      .collection(USERS_COLLECTION)
      .where('role', '==', 'owner')
      .where('status', '==', 'active')
      .count()
      .get()
    return snap.data().count
  } catch {
    return 0
  }
}

export type CreateUserInput = {
  email: string
  name: string
  password: string
  role: CmsUserRole
  createdBy?: string
}

export async function createUser(input: CreateUserInput): Promise<CmsUserPublic> {
  const db = getDb()
  if (!db) throw new Error('Database is not configured')

  const email = normalizeEmail(input.email)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email address')
  if (input.password.length < 8) throw new Error('Password must be at least 8 characters')
  if (!input.name.trim()) throw new Error('Name is required')
  if (!isValidRole(input.role)) throw new Error('Invalid role')

  const existing = await getUserByEmail(email)
  if (existing) throw new Error('A user with that email already exists')

  const { hash, salt, iterations } = hashPassword(input.password)
  const now = Timestamp.now()

  const docRef = db.collection(USERS_COLLECTION).doc()
  await docRef.set({
    email,
    name: input.name.trim(),
    role: input.role,
    status: 'active' as CmsUserStatus,
    passwordHash: hash,
    passwordSalt: salt,
    passwordIterations: iterations,
    tokenVersion: 1,
    createdAt: now,
    createdBy: input.createdBy ?? null,
    updatedAt: now,
  })

  const created = await getUserById(docRef.id)
  if (!created) throw new Error('Failed to read created user')
  return created
}

export type CreateInvitedUserInput = {
  email: string
  name: string
  role: CmsUserRole
  createdBy?: string
}

export type InviteIssue = {
  user: CmsUserPublic
  rawToken: string
  expiresAt: Date
}

export async function createInvitedUser(input: CreateInvitedUserInput): Promise<InviteIssue> {
  const db = getDb()
  if (!db) throw new Error('Database is not configured')

  const email = normalizeEmail(input.email)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email address')
  if (!input.name.trim()) throw new Error('Name is required')
  if (!isValidRole(input.role)) throw new Error('Invalid role')

  const existing = await getUserByEmail(email)
  if (existing) throw new Error('A user with that email already exists')

  const { raw, hash } = generateInviteToken()
  const expiresAt = new Date(Date.now() + INVITE_TTL_MS)
  const now = Timestamp.now()

  const docRef = db.collection(USERS_COLLECTION).doc()
  await docRef.set({
    email,
    name: input.name.trim(),
    role: input.role,
    status: 'invited' as CmsUserStatus,
    passwordHash: '',
    passwordSalt: '',
    passwordIterations: PBKDF2_ITERATIONS,
    tokenVersion: 1,
    createdAt: now,
    createdBy: input.createdBy ?? null,
    updatedAt: now,
    inviteTokenHash: hash,
    inviteSentAt: now,
    inviteExpiresAt: Timestamp.fromDate(expiresAt),
  })

  const created = await getUserById(docRef.id)
  if (!created) throw new Error('Failed to read created user')
  return { user: created, rawToken: raw, expiresAt }
}

export async function regenerateInviteToken(id: string): Promise<{ rawToken: string; expiresAt: Date }> {
  const db = getDb()
  if (!db) throw new Error('Database is not configured')

  const ref = db.collection(USERS_COLLECTION).doc(id)
  const snap = await ref.get()
  if (!snap.exists) throw new Error('User not found')

  const data = readUserDoc(snap.id, normalizeFirestoreTimestamps(snap.data() as Record<string, unknown>))
  if (!data) throw new Error('User record is invalid')
  if (data.status === 'active') throw new Error('User has already accepted their invite')
  if (data.status === 'disabled') throw new Error('Cannot resend invite for a disabled user')

  const { raw, hash } = generateInviteToken()
  const expiresAt = new Date(Date.now() + INVITE_TTL_MS)
  const now = Timestamp.now()
  await ref.set(
    {
      status: 'invited' as CmsUserStatus,
      inviteTokenHash: hash,
      inviteSentAt: now,
      inviteExpiresAt: Timestamp.fromDate(expiresAt),
      updatedAt: now,
    },
    { merge: true }
  )
  return { rawToken: raw, expiresAt }
}

export type InviteLookup =
  | { ok: true; user: CmsUserPublic }
  | { ok: false; reason: 'invalid' | 'expired' | 'already_accepted' }

export async function getUserByInviteToken(rawToken: string): Promise<InviteLookup> {
  const db = getDb()
  if (!db) return { ok: false, reason: 'invalid' }
  if (!rawToken || rawToken.length < 32) return { ok: false, reason: 'invalid' }

  const tokenHash = hashInviteToken(rawToken)
  const snap = await db
    .collection(USERS_COLLECTION)
    .where('inviteTokenHash', '==', tokenHash)
    .limit(1)
    .get()
  if (snap.empty) return { ok: false, reason: 'invalid' }

  const doc = snap.docs[0]
  const record = readUserDoc(doc.id, normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>))
  if (!record) return { ok: false, reason: 'invalid' }
  if (record.status === 'active') return { ok: false, reason: 'already_accepted' }
  if (record.status === 'disabled') return { ok: false, reason: 'invalid' }

  if (record.inviteExpiresAt && record.inviteExpiresAt.getTime() < Date.now()) {
    return { ok: false, reason: 'expired' }
  }
  return { ok: true, user: toPublicUser(record) }
}

export async function acceptInvite(rawToken: string, newPassword: string): Promise<CmsUserPublic> {
  const db = getDb()
  if (!db) throw new Error('Database is not configured')
  if (newPassword.length < 8) throw new Error('Password must be at least 8 characters')

  const lookup = await getUserByInviteToken(rawToken)
  if (!lookup.ok) {
    if (lookup.reason === 'expired') throw new Error('This invite link has expired')
    if (lookup.reason === 'already_accepted') throw new Error('This invite has already been used')
    throw new Error('Invalid invite link')
  }

  const { hash, salt, iterations } = hashPassword(newPassword)
  const ref = db.collection(USERS_COLLECTION).doc(lookup.user.id)
  await ref.set(
    {
      status: 'active' as CmsUserStatus,
      passwordHash: hash,
      passwordSalt: salt,
      passwordIterations: iterations,
      tokenVersion: lookup.user.tokenVersion + 1,
      inviteTokenHash: null,
      inviteSentAt: null,
      inviteExpiresAt: null,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  )

  const updated = await getUserById(lookup.user.id)
  if (!updated) throw new Error('Failed to load activated user')
  return updated
}

export async function updateUserRoleAndStatus(
  id: string,
  patch: { role?: CmsUserRole; status?: CmsUserStatus }
): Promise<void> {
  const db = getDb()
  if (!db) throw new Error('Database is not configured')

  if (patch.role && !isValidRole(patch.role)) throw new Error('Invalid role')

  const update: Record<string, unknown> = { updatedAt: Timestamp.now() }
  if (patch.role) update.role = patch.role
  if (patch.status) update.status = patch.status

  await db.collection(USERS_COLLECTION).doc(id).set(update, { merge: true })
}

export async function resetUserPassword(id: string, newPassword: string): Promise<void> {
  const db = getDb()
  if (!db) throw new Error('Database is not configured')
  if (newPassword.length < 8) throw new Error('Password must be at least 8 characters')

  const ref = db.collection(USERS_COLLECTION).doc(id)
  const snap = await ref.get()
  if (!snap.exists) throw new Error('User not found')
  const current = snap.data() as Record<string, unknown>

  const { hash, salt, iterations } = hashPassword(newPassword)
  await ref.set(
    {
      passwordHash: hash,
      passwordSalt: salt,
      passwordIterations: iterations,
      tokenVersion: typeof current.tokenVersion === 'number' ? current.tokenVersion + 1 : 2,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  )
}

export type PasswordResetIssue =
  | { ok: true; user: CmsUserPublic; rawToken: string; expiresAt: Date }
  // `no_account` covers "email not found" and "account not eligible" (invited /
  // disabled). Callers MUST treat this the same as success in user-facing copy
  // to avoid leaking which emails have accounts (account enumeration).
  | { ok: false; reason: 'no_account' }

/**
 * Issue a self-serve password-reset token for an ACTIVE user. Invited users
 * finish onboarding via the invite flow, and disabled accounts cannot reset —
 * both collapse to `no_account` so the caller can respond identically.
 */
export async function createPasswordResetToken(email: string): Promise<PasswordResetIssue> {
  const db = getDb()
  if (!db) return { ok: false, reason: 'no_account' }

  const record = await getUserByEmail(email)
  if (!record || record.status !== 'active') return { ok: false, reason: 'no_account' }

  // Reuses the invite-token primitive (32-byte CSPRNG + SHA-256 at rest); the
  // name is invite-specific but the crypto is a generic secure token. Stored in
  // the separate `resetTokenHash` field so it never collides with invites.
  const { raw, hash } = generateInviteToken()
  const expiresAt = new Date(Date.now() + RESET_TTL_MS)
  const now = Timestamp.now()

  await db.collection(USERS_COLLECTION).doc(record.id).set(
    {
      resetTokenHash: hash,
      resetSentAt: now,
      resetExpiresAt: Timestamp.fromDate(expiresAt),
      updatedAt: now,
    },
    { merge: true }
  )

  return { ok: true, user: toPublicUser(record), rawToken: raw, expiresAt }
}

export type ResetLookup =
  | { ok: true; user: CmsUserPublic }
  | { ok: false; reason: 'invalid' | 'expired' }

export async function getUserByResetToken(rawToken: string): Promise<ResetLookup> {
  const db = getDb()
  if (!db) return { ok: false, reason: 'invalid' }
  if (!rawToken || rawToken.length < 32) return { ok: false, reason: 'invalid' }

  const tokenHash = hashInviteToken(rawToken)
  const snap = await db
    .collection(USERS_COLLECTION)
    .where('resetTokenHash', '==', tokenHash)
    .limit(1)
    .get()
  if (snap.empty) return { ok: false, reason: 'invalid' }

  const doc = snap.docs[0]
  const record = readUserDoc(doc.id, normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>))
  if (!record) return { ok: false, reason: 'invalid' }
  // Only active accounts can complete a reset; a status change since the token
  // was issued (e.g. account disabled) voids the link.
  if (record.status !== 'active') return { ok: false, reason: 'invalid' }
  if (record.resetExpiresAt && record.resetExpiresAt.getTime() < Date.now()) {
    return { ok: false, reason: 'expired' }
  }
  return { ok: true, user: toPublicUser(record) }
}

/**
 * Consume a reset token: set the new password, bump `tokenVersion` (invalidating
 * every existing session — including any the attacker may hold) and clear the
 * single-use token fields.
 */
export async function completePasswordReset(rawToken: string, newPassword: string): Promise<CmsUserPublic> {
  const db = getDb()
  if (!db) throw new Error('Database is not configured')
  if (newPassword.length < 8) throw new Error('Password must be at least 8 characters')

  const lookup = await getUserByResetToken(rawToken)
  if (!lookup.ok) {
    if (lookup.reason === 'expired') throw new Error('This reset link has expired')
    throw new Error('Invalid reset link')
  }

  const { hash, salt, iterations } = hashPassword(newPassword)
  const ref = db.collection(USERS_COLLECTION).doc(lookup.user.id)
  await ref.set(
    {
      passwordHash: hash,
      passwordSalt: salt,
      passwordIterations: iterations,
      tokenVersion: lookup.user.tokenVersion + 1,
      resetTokenHash: null,
      resetSentAt: null,
      resetExpiresAt: null,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  )

  const updated = await getUserById(lookup.user.id)
  if (!updated) throw new Error('Failed to load updated user')
  return updated
}

export async function deleteUser(id: string): Promise<void> {
  const db = getDb()
  if (!db) throw new Error('Database is not configured')
  await db.collection(USERS_COLLECTION).doc(id).delete()
}

export async function recordSuccessfulLogin(id: string): Promise<void> {
  const db = getDb()
  if (!db) return
  await db
    .collection(USERS_COLLECTION)
    .doc(id)
    .set({ lastLoginAt: Timestamp.now() }, { merge: true })
    .catch(() => undefined)
}

export async function authenticate(
  email: string,
  password: string
): Promise<
  | { ok: true; user: CmsUserPublic; tokenVersion: number }
  | { ok: false; reason: 'invalid' | 'disabled' | 'invite_pending' }
> {
  const record = await getUserByEmail(email)
  if (!record) return { ok: false, reason: 'invalid' }
  if (record.status === 'invited') return { ok: false, reason: 'invite_pending' }
  if (record.status !== 'active') return { ok: false, reason: 'disabled' }
  if (!record.passwordHash || !record.passwordSalt) return { ok: false, reason: 'invalid' }
  const ok = verifyPassword(password, record.passwordSalt, record.passwordIterations, record.passwordHash)
  if (!ok) return { ok: false, reason: 'invalid' }
  return { ok: true, user: toPublicUser(record), tokenVersion: record.tokenVersion }
}
