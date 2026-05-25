import { redirect } from 'next/navigation'
import {
  createAdminSession,
  isAdminLoginAvailable,
  isAdminAuthenticated,
  isLegacyEnvAuthEnabled,
} from '@/lib/cms/adminAuth'
import { getUserCount } from '@/lib/cms/usersRepository'

type SearchParams = Promise<{ error?: string; email?: string; ok?: string; next?: string }>

export const dynamic = 'force-dynamic'

// FIX-048: only allow same-origin internal redirects. Anything else (protocol,
// schemeless `//host`, or non-admin path) collapses to `/admin/cms`. Prevents
// open-redirect via `?next=https://evil`.
function safeNextPath(raw: string | undefined): string {
  if (!raw) return '/admin/cms'
  if (!raw.startsWith('/admin/')) return '/admin/cms'
  if (raw.startsWith('//')) return '/admin/cms'
  return raw
}

async function loginAction(formData: FormData) {
  'use server'
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const next = safeNextPath(String(formData.get('next') ?? ''))

  const result = await createAdminSession(email, password)
  if (!result.ok) {
    const reason = result.reason
    const nextQs = next === '/admin/cms' ? '' : `&next=${encodeURIComponent(next)}`
    redirect(`/admin/login?error=${reason}&email=${encodeURIComponent(email)}${nextQs}`)
  }
  redirect(next)
}

export default async function AdminLoginPage({ searchParams }: { searchParams: SearchParams }) {
  if (!(await isAdminLoginAvailable())) {
    return (
      <section className="mx-auto max-w-2xl px-6 pb-16 pt-32 sm:px-10">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-amber-900">
          <h1 className="text-2xl font-semibold">Admin login is not available yet</h1>
          <p className="mt-3 text-sm leading-relaxed">
            Pick one of these setups (Vercel → Project →{' '}
            <strong className="font-semibold">Settings → Environment Variables</strong>, then redeploy):
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">
            <li>
              <strong>Bootstrap (empty database):</strong> set{' '}
              <code className="rounded bg-amber-100/80 px-1 font-mono text-xs">CMS_ADMIN_PASSWORD</code>, reload, sign in
              with email empty and that password, then add users under{' '}
              <code className="font-mono text-xs">/admin/settings/users</code>.
            </li>
            <li>
              <strong>Team login only:</strong> ensure Firestore is wired ({' '}
              <code className="font-mono text-xs">FIREBASE_ADMIN_*</code>) and create at least one user in{' '}
              <code className="font-mono text-xs">cms_users</code> (locally or via bootstrap). Also set{' '}
              <code className="font-mono text-xs">CMS_ADMIN_SESSION_SECRET</code> for cookie signing in production.
            </li>
          </ul>
          <p className="mt-4 text-xs text-amber-800/90">
            Without Firebase credentials on Vercel, user-based login cannot work — add them so this page can reach your{' '}
            <code className="font-mono">cms_users</code> collection.
          </p>
        </div>
      </section>
    )
  }

  const params = await searchParams
  const nextPath = safeNextPath(params.next)

  if (await isAdminAuthenticated()) {
    redirect(nextPath)
  }

  const errorReason = params.error ?? ''
  const showError = errorReason === 'invalid' || errorReason === '1'
  const showDisabled = errorReason === 'disabled'
  const showInvitePending = errorReason === 'invite_pending'
  const showInviteAccepted = (params.ok ?? '') === 'invite-accepted'
  const prefillEmail = params.email ?? ''
  const userCount = await getUserCount().catch(() => 0)
  const allowEnvOnly = isLegacyEnvAuthEnabled()

  return (
    <section className="mx-auto max-w-2xl px-6 pb-16 pt-32 sm:px-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Finanshels CMS</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600">
          {userCount > 0
            ? 'Use your team email and password.'
            : allowEnvOnly
            ? 'No team members yet — sign in with the bootstrap admin password (leave email empty), then invite your team in Settings.'
            : 'Use your team email and password.'}
        </p>

        {showInviteAccepted ? (
          <p className="mt-6 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
            Password set. Sign in below to enter the CMS.
          </p>
        ) : null}

        <form action={loginAction} className="mt-8 space-y-4">
          {/* FIX-048: pass through the post-login destination (sanitised
              upstream) so the editor returns to where the session expired. */}
          <input type="hidden" name="next" value={nextPath} />
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              name="email"
              autoComplete="username"
              defaultValue={prefillEmail}
              placeholder={userCount === 0 && allowEnvOnly ? 'Leave empty for bootstrap login' : 'you@finanshels.com'}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 outline-none ring-[#f16610] focus:ring"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 outline-none ring-[#f16610] focus:ring"
              required
            />
          </label>
          {showError ? (
            <p className="text-sm text-red-600">Invalid credentials. Try again.</p>
          ) : null}
          {showDisabled ? (
            <p className="text-sm text-red-600">This account is disabled. Contact an owner.</p>
          ) : null}
          {showInvitePending ? (
            <p className="text-sm text-amber-700">
              You haven't accepted your invite yet — check your email for the invitation link, or ask an admin to resend it.
            </p>
          ) : null}
          <button
            type="submit"
            className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Sign in
          </button>
        </form>

        {allowEnvOnly && userCount === 0 ? (
          <p className="mt-6 text-xs text-slate-500">
            First sign in: leave the email empty and enter your <code className="font-mono">CMS_ADMIN_PASSWORD</code>{' '}
            value. You'll then create real users in <code className="font-mono">/admin/settings/users</code>.
          </p>
        ) : null}
      </div>
    </section>
  )
}
