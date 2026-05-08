import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  authenticate,
  getUserById,
  recordSuccessfulLogin,
  ROLE_RANK,
  type CmsUserPublic,
  type CmsUserRole,
} from './usersRepository'

const LEGACY_COOKIE_NAME = 'finanshels_admin'
const SESSION_COOKIE_NAME = 'finanshels_admin_v2'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12

export type CmsAdminRole = CmsUserRole

export type CmsSession =
  | { kind: 'env'; role: CmsUserRole; displayName: string; email: string | null }
  | { kind: 'user'; user: CmsUserPublic }

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex')
}

function getAdminPassword(): string {
  return process.env.CMS_ADMIN_PASSWORD ?? ''
}

function getEditorPassword(): string {
  return process.env.CMS_EDITOR_PASSWORD ?? ''
}

function getSessionSalt(): string {
  return process.env.CMS_ADMIN_SESSION_SECRET ?? 'finanshels-cms-admin'
}

function expectedLegacyToken(role: 'admin' | 'editor'): string {
  const secret = role === 'admin' ? getAdminPassword() : getEditorPassword()
  return sha256(`${role}::${secret}::${getSessionSalt()}`)
}

function secureEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  try {
    return timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'))
  } catch {
    return false
  }
}

function secureEqualString(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

function signSessionToken(userId: string, tokenVersion: number): string {
  const payload = `${userId}.${tokenVersion}`
  return createHmac('sha256', getSessionSalt()).update(payload).digest('hex')
}

function buildSessionCookieValue(userId: string, tokenVersion: number): string {
  return `${userId}.${tokenVersion}.${signSessionToken(userId, tokenVersion)}`
}

function parseSessionCookie(value: string): { userId: string; tokenVersion: number; mac: string } | null {
  const parts = value.split('.')
  if (parts.length !== 3) return null
  const [userId, versionStr, mac] = parts
  const tokenVersion = Number(versionStr)
  if (!userId || !Number.isFinite(tokenVersion) || !mac) return null
  return { userId, tokenVersion, mac }
}

function parseLegacyCookie(value: string): { role: 'admin' | 'editor'; token: string } | null {
  const [roleRaw, token] = value.split(':')
  if (!token) return null
  if (roleRaw !== 'admin' && roleRaw !== 'editor') return null
  return { role: roleRaw, token }
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(getAdminPassword() || getEditorPassword())
}

export function isLegacyEnvAuthEnabled(): boolean {
  return Boolean(getAdminPassword() || getEditorPassword())
}

async function readSessionFromCookies(): Promise<CmsSession | null> {
  const store = await cookies()

  const v2 = store.get(SESSION_COOKIE_NAME)?.value
  if (v2) {
    const parsed = parseSessionCookie(v2)
    if (parsed) {
      const expectedMac = signSessionToken(parsed.userId, parsed.tokenVersion)
      if (secureEqualHex(parsed.mac, expectedMac)) {
        const user = await getUserById(parsed.userId)
        if (user && user.status === 'active' && user.tokenVersion === parsed.tokenVersion) {
          return { kind: 'user', user }
        }
      }
    }
  }

  const legacy = store.get(LEGACY_COOKIE_NAME)?.value
  if (legacy && isLegacyEnvAuthEnabled()) {
    const parsed = parseLegacyCookie(legacy)
    if (parsed) {
      const expected = expectedLegacyToken(parsed.role)
      if (expected && secureEqualString(parsed.token, expected)) {
        return {
          kind: 'env',
          role: parsed.role === 'admin' ? 'owner' : 'editor',
          displayName: parsed.role === 'admin' ? 'Owner (env)' : 'Editor (env)',
          email: null,
        }
      }
    }
  }

  return null
}

export async function getCurrentSession(): Promise<CmsSession | null> {
  return readSessionFromCookies()
}

export function sessionRole(session: CmsSession): CmsUserRole {
  return session.kind === 'env' ? session.role : session.user.role
}

export function sessionUserId(session: CmsSession): string | null {
  return session.kind === 'user' ? session.user.id : null
}

export function sessionDisplayName(session: CmsSession): string {
  if (session.kind === 'env') return session.displayName
  return session.user.name || session.user.email
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return (await readSessionFromCookies()) !== null
}

export async function getAdminRole(): Promise<CmsUserRole | null> {
  const session = await readSessionFromCookies()
  return session ? sessionRole(session) : null
}

export async function requireAdminAuth(minRole: CmsUserRole = 'editor'): Promise<CmsSession> {
  const session = await readSessionFromCookies()
  if (!session) redirect('/admin/login')
  const role = sessionRole(session)
  if (ROLE_RANK[role] < ROLE_RANK[minRole]) {
    redirect('/admin/cms?error=insufficient-role')
  }
  return session
}

/** Convenience: same as requireAdminAuth but returns just the role. */
export async function requireAdminRole(minRole: CmsUserRole = 'editor'): Promise<CmsUserRole> {
  const session = await requireAdminAuth(minRole)
  return sessionRole(session)
}

export type LoginResult =
  | { ok: true }
  | { ok: false; reason: 'invalid' | 'disabled' | 'invite_pending' | 'unconfigured' }

export async function createAdminSession(email: string, password: string): Promise<LoginResult> {
  const trimmedEmail = email.trim()
  const store = await cookies()

  if (trimmedEmail) {
    const result = await authenticate(trimmedEmail, password)
    if (!result.ok) {
      if (result.reason === 'disabled') return { ok: false, reason: 'disabled' }
      if (result.reason === 'invite_pending') return { ok: false, reason: 'invite_pending' }
      return { ok: false, reason: 'invalid' }
    }
    store.set({
      name: SESSION_COOKIE_NAME,
      value: buildSessionCookieValue(result.user.id, result.tokenVersion),
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    })
    store.delete(LEGACY_COOKIE_NAME)
    await recordSuccessfulLogin(result.user.id)
    return { ok: true }
  }

  if (!isLegacyEnvAuthEnabled()) {
    return { ok: false, reason: 'unconfigured' }
  }

  let role: 'admin' | 'editor' | null = null
  if (getAdminPassword() && secureEqualString(sha256(password), sha256(getAdminPassword()))) {
    role = 'admin'
  } else if (
    getEditorPassword() &&
    secureEqualString(sha256(password), sha256(getEditorPassword()))
  ) {
    role = 'editor'
  }
  if (!role) return { ok: false, reason: 'invalid' }

  store.set({
    name: LEGACY_COOKIE_NAME,
    value: `${role}:${expectedLegacyToken(role)}`,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
  store.delete(SESSION_COOKIE_NAME)
  return { ok: true }
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies()
  store.delete(SESSION_COOKIE_NAME)
  store.delete(LEGACY_COOKIE_NAME)
}
