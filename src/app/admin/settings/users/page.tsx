import Link from 'next/link'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { SettingsSidebar } from '@/components/cms/admin/SettingsSidebar'
import {
  destroyAdminSession,
  requireAdminAuth,
  sessionDisplayName,
  sessionRole,
  sessionUserId,
} from '@/lib/cms/adminAuth'
import {
  countOwners,
  createInvitedUser,
  deleteUser,
  getUserById,
  isValidRole,
  listUsers,
  regenerateInviteToken,
  resetUserPassword,
  ROLE_DESCRIPTION,
  ROLE_LABEL,
  ROLE_RANK,
  updateUserRoleAndStatus,
  type CmsUserPublic,
  type CmsUserRole,
  type CmsUserStatus,
} from '@/lib/cms/usersRepository'
import { getSiteUrl, isCmsConfigured } from '@/lib/cms/config'
import { isEmailConfigured, sendEmail } from '@/lib/email/resend'
import { renderInviteEmail } from '@/lib/email/templates/invite'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{
  ok?: string
  error?: string
  msg?: string
  /** Optional invite URL to surface when email delivery wasn't possible. */
  inviteUrl?: string
  /** Email associated with the surfaced inviteUrl. */
  inviteEmail?: string
}>

const SETTINGS_PATH = '/admin/settings/users'

function safeRedirect(qs: string) {
  redirect(`${SETTINGS_PATH}?${qs}`)
}

function buildAcceptInviteUrl(rawToken: string): string {
  return `${getSiteUrl()}/admin/accept-invite?token=${encodeURIComponent(rawToken)}`
}

async function sendInviteEmailFor(params: {
  recipientEmail: string
  recipientName: string
  inviterName: string
  role: CmsUserRole
  rawToken: string
  expiresAt: Date
}): Promise<{ delivered: boolean; reason?: string; url: string }> {
  const url = buildAcceptInviteUrl(params.rawToken)
  if (!isEmailConfigured()) {
    return {
      delivered: false,
      reason: 'Email provider not configured (set RESEND_API_KEY + RESEND_FROM_EMAIL).',
      url,
    }
  }
  const message = renderInviteEmail({
    recipientEmail: params.recipientEmail,
    recipientName: params.recipientName,
    inviterName: params.inviterName,
    role: params.role,
    acceptUrl: url,
    expiresAt: params.expiresAt,
  })
  const result = await sendEmail({
    to: params.recipientEmail,
    subject: message.subject,
    html: message.html,
    text: message.text,
  })
  if (result.ok) return { delivered: true, url }
  return { delivered: false, reason: result.message, url }
}

async function logoutAction() {
  'use server'
  await destroyAdminSession()
  redirect('/admin/login')
}

async function inviteUserAction(formData: FormData) {
  'use server'
  const session = await requireAdminAuth('admin')
  const actorRole = sessionRole(session)
  const inviterName = sessionDisplayName(session)

  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const name = String(formData.get('name') ?? '').trim()
  const role = String(formData.get('role') ?? 'editor')

  if (!isValidRole(role)) safeRedirect(`error=invalid-role`)
  if (role === 'owner' && actorRole !== 'owner') {
    safeRedirect(`error=only-owner-can-create-owner`)
  }

  let issued: { rawToken: string; expiresAt: Date; userEmail: string; userName: string } | null = null
  try {
    const result = await createInvitedUser({
      email,
      name,
      role: role as CmsUserRole,
      createdBy: sessionUserId(session) ?? 'env',
    })
    issued = {
      rawToken: result.rawToken,
      expiresAt: result.expiresAt,
      userEmail: result.user.email,
      userName: result.user.name,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create user'
    safeRedirect(`error=create-failed&msg=${encodeURIComponent(msg)}`)
  }

  if (!issued) safeRedirect(`error=create-failed&msg=${encodeURIComponent('Unknown error')}`)

  const send = await sendInviteEmailFor({
    recipientEmail: issued!.userEmail,
    recipientName: issued!.userName,
    inviterName,
    role: role as CmsUserRole,
    rawToken: issued!.rawToken,
    expiresAt: issued!.expiresAt,
  })

  revalidatePath(SETTINGS_PATH)

  if (send.delivered) {
    safeRedirect(`ok=invited&msg=${encodeURIComponent(email)}`)
  } else {
    // Email couldn't be sent — surface the URL so the admin can copy/paste it.
    console.warn('[cms-invite] Email send failed:', send.reason, '→ accept URL:', send.url)
    const qs = new URLSearchParams({
      ok: 'invited_no_email',
      msg: send.reason ?? 'Email send failed',
      inviteUrl: send.url,
      inviteEmail: issued!.userEmail,
    })
    redirect(`${SETTINGS_PATH}?${qs.toString()}`)
  }
}

async function resendInviteAction(formData: FormData) {
  'use server'
  const session = await requireAdminAuth('admin')
  const actorRole = sessionRole(session)
  const inviterName = sessionDisplayName(session)

  const id = String(formData.get('userId') ?? '')
  if (!id) safeRedirect(`error=invalid-input`)

  const target = await getUserById(id)
  if (!target) safeRedirect(`error=not-found`)
  if (target!.status === 'active') safeRedirect(`error=already-accepted`)
  if (target!.role === 'owner' && actorRole !== 'owner') {
    safeRedirect(`error=only-owner-can-modify-owner`)
  }

  let issued: { rawToken: string; expiresAt: Date }
  try {
    issued = await regenerateInviteToken(id)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to regenerate invite'
    safeRedirect(`error=create-failed&msg=${encodeURIComponent(msg)}`)
  }

  const send = await sendInviteEmailFor({
    recipientEmail: target!.email,
    recipientName: target!.name,
    inviterName,
    role: target!.role,
    rawToken: issued!.rawToken,
    expiresAt: issued!.expiresAt,
  })

  revalidatePath(SETTINGS_PATH)

  if (send.delivered) {
    safeRedirect(`ok=invite-resent&msg=${encodeURIComponent(target!.email)}`)
  } else {
    console.warn('[cms-invite] Resend failed:', send.reason, '→ accept URL:', send.url)
    const qs = new URLSearchParams({
      ok: 'invited_no_email',
      msg: send.reason ?? 'Email send failed',
      inviteUrl: send.url,
      inviteEmail: target!.email,
    })
    redirect(`${SETTINGS_PATH}?${qs.toString()}`)
  }
}

async function updateRoleAction(formData: FormData) {
  'use server'
  const session = await requireAdminAuth('admin')
  const actorRole = sessionRole(session)
  const actorId = sessionUserId(session)

  const id = String(formData.get('userId') ?? '')
  const role = String(formData.get('role') ?? '')
  if (!id || !isValidRole(role)) safeRedirect(`error=invalid-input`)

  const target = await getUserById(id)
  if (!target) safeRedirect(`error=not-found`)

  if (target!.role === 'owner' && actorRole !== 'owner') {
    safeRedirect(`error=only-owner-can-modify-owner`)
  }
  if (role === 'owner' && actorRole !== 'owner') {
    safeRedirect(`error=only-owner-can-promote-to-owner`)
  }
  if (target!.role === 'owner' && role !== 'owner') {
    const owners = await countOwners()
    if (owners <= 1) safeRedirect(`error=last-owner-protected`)
  }
  if (target!.id === actorId && role !== actorRole && ROLE_RANK[role as CmsUserRole] < ROLE_RANK[actorRole]) {
    safeRedirect(`error=cannot-self-demote`)
  }

  await updateUserRoleAndStatus(id, { role: role as CmsUserRole })
  revalidatePath(SETTINGS_PATH)
  safeRedirect(`ok=role-updated`)
}

async function updateStatusAction(formData: FormData) {
  'use server'
  const session = await requireAdminAuth('admin')
  const actorRole = sessionRole(session)
  const actorId = sessionUserId(session)

  const id = String(formData.get('userId') ?? '')
  const status = String(formData.get('status') ?? '')
  if (!id || (status !== 'active' && status !== 'disabled')) safeRedirect(`error=invalid-input`)

  const target = await getUserById(id)
  if (!target) safeRedirect(`error=not-found`)

  if (target!.id === actorId) safeRedirect(`error=cannot-disable-self`)
  if (target!.role === 'owner' && actorRole !== 'owner') {
    safeRedirect(`error=only-owner-can-modify-owner`)
  }
  if (target!.role === 'owner' && status === 'disabled') {
    const owners = await countOwners()
    if (owners <= 1) safeRedirect(`error=last-owner-protected`)
  }

  await updateUserRoleAndStatus(id, { status: status as CmsUserStatus })
  revalidatePath(SETTINGS_PATH)
  safeRedirect(`ok=status-updated`)
}

async function resetPasswordAction(formData: FormData) {
  'use server'
  const session = await requireAdminAuth('admin')
  const actorRole = sessionRole(session)

  const id = String(formData.get('userId') ?? '')
  const password = String(formData.get('newPassword') ?? '')
  if (!id) safeRedirect(`error=invalid-input`)
  if (password.length < 8) safeRedirect(`error=weak-password`)

  const target = await getUserById(id)
  if (!target) safeRedirect(`error=not-found`)
  if (target!.role === 'owner' && actorRole !== 'owner') {
    safeRedirect(`error=only-owner-can-modify-owner`)
  }

  try {
    await resetUserPassword(id, password)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to reset password'
    safeRedirect(`error=reset-failed&msg=${encodeURIComponent(msg)}`)
  }

  revalidatePath(SETTINGS_PATH)
  safeRedirect(`ok=password-reset`)
}

async function deleteUserAction(formData: FormData) {
  'use server'
  const session = await requireAdminAuth('admin')
  const actorRole = sessionRole(session)
  const actorId = sessionUserId(session)

  const id = String(formData.get('userId') ?? '')
  if (!id) safeRedirect(`error=invalid-input`)

  const target = await getUserById(id)
  if (!target) safeRedirect(`error=not-found`)

  if (target!.id === actorId) safeRedirect(`error=cannot-delete-self`)
  if (target!.role === 'owner' && actorRole !== 'owner') {
    safeRedirect(`error=only-owner-can-modify-owner`)
  }
  if (target!.role === 'owner') {
    const owners = await countOwners()
    if (owners <= 1) safeRedirect(`error=last-owner-protected`)
  }

  await deleteUser(id)
  revalidatePath(SETTINGS_PATH)
  safeRedirect(`ok=deleted`)
}

function fmtDate(d?: Date): string {
  if (!d) return '—'
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

function StatusPill({ status }: { status: CmsUserStatus }) {
  const map: Record<CmsUserStatus, { box: string; dot: string; label: string }> = {
    active: { box: 'border-emerald-300 bg-emerald-50 text-emerald-700', dot: 'text-emerald-700', label: 'active' },
    invited: { box: 'border-amber-300 bg-amber-50 text-amber-800', dot: 'text-amber-700', label: 'invited' },
    disabled: { box: 'border-slate-300 bg-slate-100 text-slate-700', dot: 'text-slate-500', label: 'disabled' },
  }
  const s = map[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-wider ${s.box}`}>
      <span className={s.dot} aria-hidden>●</span>
      {s.label}
    </span>
  )
}

function RolePill({ role }: { role: CmsUserRole }) {
  const map: Record<CmsUserRole, string> = {
    owner: 'border-brand-primary/40 bg-brand-primary/10 text-brand-primary',
    admin: 'border-violet-300 bg-violet-50 text-violet-700',
    editor: 'border-sky-300 bg-sky-50 text-sky-700',
    viewer: 'border-slate-300 bg-slate-100 text-slate-700',
  }
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-wider ${map[role]}`}>
      {ROLE_LABEL[role]}
    </span>
  )
}

function UserRow({
  user,
  actorRole,
  actorUserId,
}: {
  user: CmsUserPublic
  actorRole: CmsUserRole
  actorUserId: string | null
}) {
  const isSelf = user.id === actorUserId
  const protectedOwner = user.role === 'owner' && actorRole !== 'owner'
  const canEditTarget = !protectedOwner

  const assignableRoles: CmsUserRole[] = (['viewer', 'editor', 'admin', 'owner'] as CmsUserRole[]).filter((r) => {
    if (r === 'owner') return actorRole === 'owner'
    return true
  })

  return (
    <tr className="align-top">
      <td className="px-4 py-3">
        <p className="font-semibold text-slate-900">
          {user.name || '(no name)'} {isSelf ? <span className="text-xs text-slate-500">(you)</span> : null}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">{user.email}</p>
      </td>
      <td className="px-4 py-3">
        <RolePill role={user.role} />
      </td>
      <td className="px-4 py-3">
        <StatusPill status={user.status} />
      </td>
      <td className="hidden whitespace-nowrap px-4 py-3 text-xs text-slate-500 lg:table-cell">{fmtDate(user.lastLoginAt)}</td>
      <td className="hidden whitespace-nowrap px-4 py-3 text-xs text-slate-500 lg:table-cell">{fmtDate(user.createdAt)}</td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-2">
          {canEditTarget ? (
            <form action={updateRoleAction} className="flex items-center gap-2">
              <input type="hidden" name="userId" value={user.id} />
              <select
                name="role"
                defaultValue={user.role}
                className="rounded-lg border border-cms-rule bg-white px-2 py-1 text-xs text-slate-700"
              >
                {assignableRoles.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABEL[r]}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-lg border border-cms-rule bg-cms-soft px-2 py-1 text-xs text-slate-700 hover:bg-cms-hover"
              >
                Save role
              </button>
            </form>
          ) : null}

          {canEditTarget && !isSelf && user.status !== 'invited' ? (
            <form action={updateStatusAction} className="flex items-center gap-2">
              <input type="hidden" name="userId" value={user.id} />
              <input type="hidden" name="status" value={user.status === 'active' ? 'disabled' : 'active'} />
              <button
                type="submit"
                className={`rounded-lg border px-2 py-1 text-xs transition ${
                  user.status === 'active'
                    ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {user.status === 'active' ? 'Disable' : 'Enable'}
              </button>
            </form>
          ) : null}

          {canEditTarget && user.status === 'invited' ? (
            <form action={resendInviteAction} className="flex items-center gap-2">
              <input type="hidden" name="userId" value={user.id} />
              <button
                type="submit"
                className="rounded-lg border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100"
                title="Generate a new invite link and email it"
              >
                Resend invite
              </button>
            </form>
          ) : null}

          {canEditTarget && user.status === 'active' ? (
            <form action={resetPasswordAction} className="flex items-center gap-2">
              <input type="hidden" name="userId" value={user.id} />
              <input
                // FIX-048: was `type="text"` — exposed the new password in
                // plaintext on screen while the admin typed it. `type="password"`
                // masks input the standard way.
                type="password"
                name="newPassword"
                placeholder="New password (≥ 8 chars)"
                autoComplete="new-password"
                className="w-44 rounded-lg border border-cms-rule bg-white px-2 py-1 text-xs text-slate-700 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="rounded-lg border border-cms-rule bg-cms-soft px-2 py-1 text-xs text-slate-700 hover:bg-cms-hover"
              >
                Reset
              </button>
            </form>
          ) : null}

          {canEditTarget && !isSelf ? (
            <form action={deleteUserAction}>
              <input type="hidden" name="userId" value={user.id} />
              <button
                type="submit"
                className="rounded-lg border border-red-300 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100"
              >
                Delete user
              </button>
            </form>
          ) : null}

          {protectedOwner ? (
            <p className="text-xs text-slate-500">Only an owner can modify another owner.</p>
          ) : null}
        </div>
      </td>
    </tr>
  )
}

export default async function UsersSettingsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requireAdminAuth('admin')
  const actorRole = sessionRole(session)
  const actorId = sessionUserId(session)

  const dbConfigured = isCmsConfigured()
  const params = await searchParams
  const ok = params.ok
  const error = params.error
  const msg = params.msg
  const inviteUrl = params.inviteUrl
  const inviteEmail = params.inviteEmail
  const emailReady = isEmailConfigured()

  if (!dbConfigured) {
    return (
      <section className="min-h-screen bg-cms-canvas text-slate-900">
        <div className="mx-auto max-w-[1900px] px-3 py-3 sm:px-5">
          <div className="grid gap-3 xl:grid-cols-[minmax(260px,320px)_1fr]">
            <SettingsSidebar
              active="users"
              currentRole={actorRole}
              currentUserName={sessionDisplayName(session)}
              currentUserEmail={session.kind === 'user' ? session.user.email : null}
            />
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-900">
              <h1 className="text-lg font-semibold">Firestore is not configured</h1>
              <p className="mt-2 text-sm">
                Set <code className="font-mono">FIREBASE_ADMIN_PROJECT_ID</code>,{' '}
                <code className="font-mono">FIREBASE_ADMIN_CLIENT_EMAIL</code>, and{' '}
                <code className="font-mono">FIREBASE_ADMIN_PRIVATE_KEY</code> in your environment, then refresh this page.
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const users = await listUsers()
  const owners = users.filter((u) => u.role === 'owner').length
  const errorMessages: Record<string, string> = {
    'invalid-role': 'Invalid role value.',
    'only-owner-can-create-owner': 'Only an owner can create another owner.',
    'only-owner-can-modify-owner': 'Only an owner can modify another owner.',
    'only-owner-can-promote-to-owner': 'Only an owner can promote a user to owner.',
    'last-owner-protected': 'Cannot remove or demote the last active owner.',
    'cannot-self-demote': 'You cannot demote yourself below your current role.',
    'cannot-disable-self': 'You cannot disable your own account.',
    'cannot-delete-self': 'You cannot delete your own account.',
    'invalid-input': 'Invalid input.',
    'not-found': 'User not found.',
    'create-failed': msg ? `Failed to create user: ${msg}` : 'Failed to create user.',
    'reset-failed': msg ? `Failed to reset password: ${msg}` : 'Failed to reset password.',
    'weak-password': 'Password must be at least 8 characters.',
    'already-accepted': 'This user has already accepted their invite.',
  }
  const okMessages: Record<string, string> = {
    invited: msg ? `Invitation sent to ${msg}.` : 'Invitation sent.',
    invited_no_email: 'User created — but the invite email could not be sent. Copy the link below and share it directly.',
    'invite-resent': msg ? `Fresh invite sent to ${msg}.` : 'Invite resent.',
    'role-updated': 'Role updated.',
    'status-updated': 'Status updated.',
    'password-reset': 'Password reset.',
    deleted: 'User deleted.',
  }

  return (
    <section className="min-h-screen bg-cms-canvas text-slate-900">
      <div className="mx-auto max-w-[1900px] px-3 py-3 sm:px-5">
        <div className="grid gap-3 xl:min-h-[calc(100vh-1.5rem)] xl:grid-cols-[minmax(260px,320px)_1fr]">
          <SettingsSidebar
            active="users"
            currentRole={actorRole}
            currentUserName={sessionDisplayName(session)}
            currentUserEmail={session.kind === 'user' ? session.user.email : null}
          />

          <div className="space-y-4 rounded-2xl border border-cms-rule bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] xl:overflow-y-auto">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Settings</p>
                <h1 className="mt-1 text-xl font-semibold text-slate-900">Users & access</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Add your marketing team, control roles, reset passwords. {users.length} {users.length === 1 ? 'user' : 'users'} ·{' '}
                  {owners} {owners === 1 ? 'owner' : 'owners'}.
                </p>
              </div>
              <form action={logoutAction}>
                <button type="submit" className="rounded-xl border border-cms-rule bg-cms-soft px-3 py-2 text-sm text-slate-700 hover:bg-cms-hover">
                  Sign out
                </button>
              </form>
            </header>

            {ok ? (
              <p
                className={`rounded-xl border px-4 py-2.5 text-sm ${
                  ok === 'invited_no_email'
                    ? 'border-amber-300 bg-amber-50 text-amber-800'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-700'
                }`}
              >
                {okMessages[ok] ?? 'Done.'}
              </p>
            ) : null}
            {error ? (
              <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {errorMessages[error] ?? `Action failed: ${error}`}
              </p>
            ) : null}

            {inviteUrl ? (
              <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900">
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Manual invite link</p>
                <p className="mt-1 text-sm">
                  Share this link with <strong>{inviteEmail}</strong> over a secure channel — it expires in 7 days.
                  {msg ? <span className="ml-1 text-amber-800/80">({msg})</span> : null}
                </p>
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-3 py-2">
                  <code className="flex-1 truncate text-xs text-slate-700" title={inviteUrl}>
                    {inviteUrl}
                  </code>
                  <a
                    href={inviteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-amber-300 bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 hover:bg-amber-200"
                  >
                    Open
                  </a>
                </div>
              </div>
            ) : null}

            {!emailReady ? (
              <div className="rounded-2xl border border-amber-200 bg-[#fff8ef] p-4 text-amber-900">
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Email delivery not configured</p>
                <p className="mt-1 text-sm">
                  Invitations work, but no email will actually be sent. After clicking <em>Invite user</em>, the system will
                  display the accept-invite link inline so you can share it manually. To enable real emails, set{' '}
                  <code className="font-mono text-xs">RESEND_API_KEY</code> and{' '}
                  <code className="font-mono text-xs">RESEND_FROM_EMAIL</code> in your environment and restart the server.
                </p>
              </div>
            ) : null}

            <section className="rounded-2xl border border-cms-rule bg-cms-soft p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Invite a team member</h2>
              <p className="mt-1 text-xs text-slate-500">
                We'll email a one-time link so they can set their own password. The invite expires in 7 days; you can resend
                it any time.
              </p>
              <form action={inviteUserAction} className="mt-4 grid gap-3 md:grid-cols-2">
                <label className="block text-sm text-slate-700">
                  Full name
                  <input
                    type="text"
                    name="name"
                    required
                    className="mt-1.5 w-full rounded-lg border border-cms-rule bg-white px-3 py-2 text-sm text-slate-900"
                    placeholder="Sara Marketing"
                  />
                </label>
                <label className="block text-sm text-slate-700">
                  Email
                  <input
                    type="email"
                    name="email"
                    required
                    className="mt-1.5 w-full rounded-lg border border-cms-rule bg-white px-3 py-2 text-sm text-slate-900"
                    placeholder="sara@finanshels.com"
                  />
                </label>
                <label className="block text-sm text-slate-700 md:col-span-2">
                  Role
                  <select
                    name="role"
                    defaultValue="editor"
                    className="mt-1.5 w-full rounded-lg border border-cms-rule bg-white px-3 py-2 text-sm text-slate-900"
                  >
                    <option value="viewer">{ROLE_LABEL.viewer} — read-only</option>
                    <option value="editor">{ROLE_LABEL.editor} — content edit/publish</option>
                    <option value="admin">{ROLE_LABEL.admin} — content + users</option>
                    {actorRole === 'owner' ? <option value="owner">{ROLE_LABEL.owner} — full access</option> : null}
                  </select>
                </label>
                <div className="md:col-span-2 flex items-center justify-between gap-3">
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-brand-dark shadow-[0_12px_30px_rgba(241,102,16,0.25)] transition hover:brightness-110"
                  >
                    {emailReady ? '+ Send invitation' : '+ Generate invite link'}
                  </button>
                  <span className="text-xs text-slate-500">
                    {emailReady ? 'Email will be sent via Resend.' : 'Email delivery is OFF — link will be shown inline.'}
                  </span>
                </div>
              </form>
            </section>

            <section className="rounded-2xl border border-cms-rule bg-white">
              <header className="flex items-center justify-between border-b border-cms-rule bg-cms-soft px-4 py-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Team members</h2>
                <Link href="#role-reference" className="text-xs text-slate-500 hover:text-brand-primary">
                  Role reference ↓
                </Link>
              </header>
              {users.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-slate-400">
                  No users yet. Use the invite form above to add your first team member.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-cms-rule bg-cms-soft text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Name / email</th>
                        <th className="px-4 py-3 font-semibold">Role</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="hidden px-4 py-3 font-semibold lg:table-cell">Last login</th>
                        <th className="hidden px-4 py-3 font-semibold lg:table-cell">Created</th>
                        <th className="px-4 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cms-rule">
                      {users.map((u) => (
                        <UserRow key={u.id} user={u} actorRole={actorRole} actorUserId={actorId} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section id="role-reference" className="rounded-2xl border border-cms-rule bg-cms-soft p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Role reference</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {(['owner', 'admin', 'editor', 'viewer'] as CmsUserRole[]).map((r) => (
                  <li key={r} className="flex items-start gap-3">
                    <span className="w-20 shrink-0">
                      <RolePill role={r} />
                    </span>
                    <span className="text-slate-700">{ROLE_DESCRIPTION[r]}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </section>
  )
}
