import { redirect } from 'next/navigation'
import { completePasswordReset, getUserByResetToken } from '@/lib/cms/usersRepository'
import { Alert, Button, Input } from '@/components/cms/admin/ui'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ token?: string; error?: string }>

async function resetAction(formData: FormData) {
  'use server'
  const token = String(formData.get('token') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const confirm = String(formData.get('confirm') ?? '')

  if (!token) {
    redirect('/admin/reset?error=missing-token')
  }
  if (password.length < 8) {
    redirect(`/admin/reset?token=${encodeURIComponent(token)}&error=weak-password`)
  }
  if (password !== confirm) {
    redirect(`/admin/reset?token=${encodeURIComponent(token)}&error=mismatch`)
  }

  try {
    await completePasswordReset(token, password)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to reset password'
    const code = msg.toLowerCase().includes('expired') ? 'expired' : 'invalid'
    redirect(`/admin/reset?token=${encodeURIComponent(token)}&error=${code}`)
  }

  redirect('/admin/login?ok=password-reset')
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center overflow-y-auto bg-cms-canvas px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary text-xl font-bold text-white shadow-sm">
            F
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">Choose a new password</h1>
          <p className="mt-1 text-sm text-slate-500">Finanshels Content Studio</p>
        </div>
        <div className="rounded-2xl border border-cms-rule bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] sm:p-8">
          {children}
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">
          <a href="/admin/login" className="underline hover:text-slate-600">
            Back to sign in
          </a>
        </p>
      </div>
    </main>
  )
}

export default async function ResetPasswordPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const token = params.token ?? ''
  const error = params.error ?? ''

  if (!token) {
    return (
      <Shell>
        <Alert variant="error">
          <div>
            <p className="font-semibold">Reset link is missing</p>
            <p className="mt-1 text-sm">
              The link didn&rsquo;t include a token. Reopen the reset email or request a new link.
            </p>
          </div>
        </Alert>
        <p className="mt-5 text-sm">
          <a href="/admin/forgot" className="font-medium text-brand-primary underline">
            Request a new reset link
          </a>
        </p>
      </Shell>
    )
  }

  const lookup = await getUserByResetToken(token)
  if (!lookup.ok) {
    const copy: Record<string, { title: string; body: string }> = {
      invalid: {
        title: 'This reset link is invalid',
        body: 'The token wasn’t recognised. It may have already been used. Request a fresh link below.',
      },
      expired: {
        title: 'This reset link has expired',
        body: 'For security, reset links expire after 1 hour. Request a fresh link below.',
      },
    }
    const r = copy[lookup.reason]
    return (
      <Shell>
        <Alert variant="error">
          <div>
            <p className="font-semibold">{r.title}</p>
            <p className="mt-1 text-sm">{r.body}</p>
          </div>
        </Alert>
        <p className="mt-5 text-sm">
          <a href="/admin/forgot" className="font-medium text-brand-primary underline">
            Request a new reset link
          </a>
        </p>
      </Shell>
    )
  }

  const user = lookup.user
  const errorCopy: Record<string, string> = {
    'weak-password': 'Password must be at least 8 characters.',
    mismatch: 'Both passwords must match.',
    expired: 'This reset link has expired.',
    invalid: 'This reset link is no longer valid.',
  }

  return (
    <Shell>
      <p className="text-sm text-slate-600">
        Set a new password for <strong className="text-slate-900">{user.email}</strong>. You&rsquo;ll be signed out
        everywhere and can sign in with the new password.
      </p>

      <form action={resetAction} className="mt-6 space-y-4">
        <input type="hidden" name="token" value={token} />
        <Input
          label="New password (≥ 8 characters)"
          type="password"
          name="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <Input
          label="Confirm password"
          type="password"
          name="confirm"
          autoComplete="new-password"
          minLength={8}
          required
        />

        {error ? (
          <Alert variant="error">{errorCopy[error] ?? `Error: ${error}`}</Alert>
        ) : null}

        <Button type="submit" variant="primary" size="lg" className="w-full">
          Set new password
        </Button>
      </form>
    </Shell>
  )
}
