import { redirect } from 'next/navigation'
import { acceptInvite, getUserByInviteToken, ROLE_LABEL } from '@/lib/cms/usersRepository'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ token?: string; error?: string }>

async function acceptInviteAction(formData: FormData) {
  'use server'
  const token = String(formData.get('token') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const confirm = String(formData.get('confirm') ?? '')

  if (!token) {
    redirect('/admin/accept-invite?error=missing-token')
  }
  if (password.length < 8) {
    redirect(`/admin/accept-invite?token=${encodeURIComponent(token)}&error=weak-password`)
  }
  if (password !== confirm) {
    redirect(`/admin/accept-invite?token=${encodeURIComponent(token)}&error=mismatch`)
  }

  try {
    await acceptInvite(token, password)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to accept invite'
    const code =
      msg.toLowerCase().includes('expired')
        ? 'expired'
        : msg.toLowerCase().includes('already')
        ? 'already-accepted'
        : 'invalid'
    redirect(`/admin/accept-invite?token=${encodeURIComponent(token)}&error=${code}`)
  }

  redirect('/admin/login?ok=invite-accepted')
}

export default async function AcceptInvitePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const token = params.token ?? ''
  const error = params.error ?? ''

  if (!token) {
    return (
      <Wrapper>
        <Notice tone="danger" title="Invitation link is missing" body="The link you used didn't include a token. Please reopen the invitation email or ask your admin to resend it." />
      </Wrapper>
    )
  }

  const lookup = await getUserByInviteToken(token)
  if (!lookup.ok) {
    const reasons: Record<string, { title: string; body: string }> = {
      invalid: { title: 'This invitation link is invalid', body: 'The token wasn\'t recognised. Ask your admin to send a fresh invite.' },
      expired: { title: 'This invitation has expired', body: 'For security, invites expire after 7 days. Ask your admin to resend the invite.' },
      already_accepted: { title: 'This invitation was already used', body: 'Sign in with the password you set up earlier, or ask an admin to reset your password.' },
    }
    const r = reasons[lookup.reason]
    return (
      <Wrapper>
        <Notice tone="danger" title={r.title} body={r.body} />
      </Wrapper>
    )
  }

  const user = lookup.user
  const errorCopy: Record<string, string> = {
    'weak-password': 'Password must be at least 8 characters.',
    mismatch: 'Both passwords must match.',
    expired: 'This invitation has expired.',
    invalid: 'This invitation link is no longer valid.',
    'already-accepted': 'This invitation has already been used.',
  }

  return (
    <Wrapper>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Finanshels CMS</p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-900">Welcome, {user.name || user.email.split('@')[0]}</h1>
      <p className="mt-2 text-sm text-slate-600">
        You've been invited as <strong>{ROLE_LABEL[user.role]}</strong>. Choose a password to finish setting up your account.
      </p>

      <form action={acceptInviteAction} className="mt-8 space-y-4">
        <input type="hidden" name="token" value={token} />

        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={user.email}
            disabled
            readOnly
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-600"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          New password (≥ 8 characters)
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            minLength={8}
            required
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 outline-none ring-[#f16610] focus:ring"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Confirm password
          <input
            type="password"
            name="confirm"
            autoComplete="new-password"
            minLength={8}
            required
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 outline-none ring-[#f16610] focus:ring"
          />
        </label>

        {error ? <p className="text-sm text-red-600">{errorCopy[error] ?? `Error: ${error}`}</p> : null}

        <button
          type="submit"
          className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Set password & sign in
        </button>
      </form>
    </Wrapper>
  )
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-2xl px-6 pb-16 pt-32 sm:px-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">{children}</div>
    </section>
  )
}

function Notice({
  tone,
  title,
  body,
}: {
  tone: 'danger' | 'info'
  title: string
  body: string
}) {
  const cls =
    tone === 'danger'
      ? 'border-red-200 bg-red-50 text-red-900'
      : 'border-slate-200 bg-slate-50 text-slate-900'
  return (
    <div className={`rounded-2xl border p-6 ${cls}`}>
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm">{body}</p>
      <p className="mt-4 text-sm">
        <a href="/admin/login" className="font-medium text-slate-700 underline hover:text-slate-900">
          Back to sign in
        </a>
      </p>
    </div>
  )
}
