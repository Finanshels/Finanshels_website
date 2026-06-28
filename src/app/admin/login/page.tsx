import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  createAdminSession,
  isAdminLoginAvailable,
  isAdminAuthenticated,
  isLegacyEnvAuthEnabled,
} from '@/lib/cms/adminAuth'
import { getUserCount } from '@/lib/cms/usersRepository'
import { extractClientIp, hashIp } from '@/lib/chat/guards'
import { checkAndIncrementRateLimit } from '@/lib/landing-pages/repository'
import { Alert, Button, Input } from '@/components/cms/admin/ui'

// FIX-060: brute-force guard for the admin login Server Action. 10 attempts per
// source IP per 10-minute window, enforced via the durable Firestore-backed
// limiter (in-memory limits are per-instance and bypassable on serverless).
const LOGIN_RATE_WINDOW_MS = 10 * 60 * 1000
const LOGIN_RATE_MAX = 10

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

  // FIX-060: throttle per source IP before touching the credential check so an
  // attacker can't brute-force the admin password. Namespaced doc id keeps these
  // buckets separate from the public lead-form rate-limit buckets.
  const ipHash = hashIp(extractClientIp(await headers()))
  const limit = await checkAndIncrementRateLimit(
    `admin-login:${ipHash}`,
    LOGIN_RATE_WINDOW_MS,
    LOGIN_RATE_MAX
  )
  if (!limit.allowed) {
    redirect('/admin/login?error=rate_limited')
  }

  const result = await createAdminSession(email, password)
  if (!result.ok) {
    const reason = result.reason
    const nextQs = next === '/admin/cms' ? '' : `&next=${encodeURIComponent(next)}`
    redirect(`/admin/login?error=${reason}&email=${encodeURIComponent(email)}${nextQs}`)
  }
  redirect(next)
}

/** Shared full-height, centered shell so every login state looks the same. */
function LoginShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center overflow-y-auto bg-cms-canvas px-4 py-10">
      <div className="w-full max-w-md">{children}</div>
    </main>
  )
}

/** Finanshels brandmark + heading used at the top of the auth card. */
function Brandmark({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary text-xl font-bold text-white shadow-sm">
        F
      </div>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </div>
  )
}

export default async function AdminLoginPage({ searchParams }: { searchParams: SearchParams }) {
  if (!(await isAdminLoginAvailable())) {
    return (
      <LoginShell>
        <Brandmark title="Almost there" subtitle="Finanshels Content Studio" />
        <div className="rounded-2xl border border-cms-rule bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] sm:p-8">
          <Alert variant="warning">
            <div>
              <p className="font-semibold">Admin login isn&rsquo;t available yet</p>
              <p className="mt-1 text-sm">
                Pick one of these setups (Vercel → Project →{' '}
                <strong className="font-semibold">Settings → Environment Variables</strong>, then redeploy):
              </p>
            </div>
          </Alert>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-600">
            <li>
              <strong className="text-slate-900">Bootstrap (empty database):</strong> set{' '}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">CMS_ADMIN_PASSWORD</code>, reload, sign in
              with email empty and that password, then add users under{' '}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">/admin/settings/users</code>.
            </li>
            <li>
              <strong className="text-slate-900">Team login only:</strong> ensure Firestore is wired ({' '}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">FIREBASE_ADMIN_*</code>) and create at least
              one user in <code className="rounded bg-slate-100 px-1 font-mono text-xs">cms_users</code> (locally or via
              bootstrap). Also set{' '}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">CMS_ADMIN_SESSION_SECRET</code> for cookie
              signing in production.
            </li>
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-slate-500">
            Without Firebase credentials on Vercel, user-based login cannot work — add them so this page can reach your{' '}
            <code className="font-mono">cms_users</code> collection.
          </p>
        </div>
      </LoginShell>
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
  const showRateLimited = errorReason === 'rate_limited'
  const showInvitePending = errorReason === 'invite_pending'
  const showInviteAccepted = (params.ok ?? '') === 'invite-accepted'
  const prefillEmail = params.email ?? ''
  const userCount = await getUserCount().catch(() => 0)
  const allowEnvOnly = isLegacyEnvAuthEnabled()

  const subtext =
    userCount > 0
      ? 'Use your team email and password.'
      : allowEnvOnly
      ? 'No team members yet — sign in with the bootstrap admin password (leave email empty), then invite your team in Settings.'
      : 'Use your team email and password.'

  return (
    <LoginShell>
      <Brandmark title="Welcome back" subtitle="Sign in to Finanshels Content Studio" />

      <div className="rounded-2xl border border-cms-rule bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] sm:p-8">
        <p className="text-sm text-slate-600">{subtext}</p>

        {showInviteAccepted ? (
          <Alert variant="success" className="mt-5">
            Password set. Sign in below to enter the CMS.
          </Alert>
        ) : null}
        {showError ? (
          <Alert variant="error" className="mt-5">
            Invalid credentials. Please try again.
          </Alert>
        ) : null}
        {showDisabled ? (
          <Alert variant="error" className="mt-5">
            This account is disabled. Contact an owner.
          </Alert>
        ) : null}
        {showRateLimited ? (
          <Alert variant="error" className="mt-5">
            Too many sign-in attempts. Please wait a few minutes and try again.
          </Alert>
        ) : null}
        {showInvitePending ? (
          <Alert variant="warning" className="mt-5">
            You haven&rsquo;t accepted your invite yet — check your email for the invitation link, or ask an admin to
            resend it.
          </Alert>
        ) : null}

        <form action={loginAction} className="mt-6 space-y-4">
          {/* FIX-048: pass through the post-login destination (sanitised
              upstream) so the editor returns to where the session expired. */}
          <input type="hidden" name="next" value={nextPath} />
          <Input
            label="Email"
            type="email"
            name="email"
            autoComplete="username"
            defaultValue={prefillEmail}
            placeholder={userCount === 0 && allowEnvOnly ? 'Leave empty for bootstrap login' : 'you@finanshels.com'}
          />
          <Input label="Password" type="password" name="password" autoComplete="current-password" required />
          <Button type="submit" variant="primary" size="lg" className="w-full">
            Sign in
          </Button>
        </form>

        {allowEnvOnly && userCount === 0 ? (
          <p className="mt-6 text-xs leading-relaxed text-slate-500">
            First sign in: leave the email empty and enter your{' '}
            <code className="rounded bg-slate-100 px-1 font-mono">CMS_ADMIN_PASSWORD</code> value. You&rsquo;ll then
            create real users in <code className="rounded bg-slate-100 px-1 font-mono">/admin/settings/users</code>.
          </p>
        ) : null}
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">Finanshels · UAE financial services</p>
    </LoginShell>
  )
}
