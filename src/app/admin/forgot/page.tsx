import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createPasswordResetToken } from '@/lib/cms/usersRepository'
import { getSiteUrl } from '@/lib/cms/config'
import { isEmailConfigured, sendEmail } from '@/lib/email/resend'
import { renderPasswordResetEmail } from '@/lib/email/templates/passwordReset'
import { extractClientIp, hashIp } from '@/lib/chat/guards'
import { checkAndIncrementRateLimit } from '@/lib/landing-pages/repository'
import { Alert, Button, Input } from '@/components/cms/admin/ui'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ sent?: string; error?: string; email?: string }>

// Throttle reset requests per source IP so an attacker can't enumerate accounts
// by timing, or spam a victim's inbox. Mirrors the login limiter (FIX-060).
const FORGOT_RATE_WINDOW_MS = 15 * 60 * 1000
const FORGOT_RATE_MAX = 5

function buildResetUrl(rawToken: string): string {
  return `${getSiteUrl()}/admin/reset?token=${encodeURIComponent(rawToken)}`
}

async function forgotAction(formData: FormData) {
  'use server'
  const email = String(formData.get('email') ?? '').trim().toLowerCase()

  const ipHash = hashIp(extractClientIp(await headers()))
  const limit = await checkAndIncrementRateLimit(
    `admin-forgot:${ipHash}`,
    FORGOT_RATE_WINDOW_MS,
    FORGOT_RATE_MAX
  )
  if (!limit.allowed) {
    redirect(`/admin/forgot?error=rate_limited&email=${encodeURIComponent(email)}`)
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect(`/admin/forgot?error=invalid_email&email=${encodeURIComponent(email)}`)
  }

  // Never reveal whether the email maps to an account. On success we issue a
  // token and (best-effort) email it; on `no_account` we do nothing. Both paths
  // land on the identical "check your email" screen (account-enumeration guard).
  const issue = await createPasswordResetToken(email)
  if (issue.ok) {
    if (isEmailConfigured()) {
      const message = renderPasswordResetEmail({
        recipientEmail: issue.user.email,
        recipientName: issue.user.name,
        resetUrl: buildResetUrl(issue.rawToken),
        expiresAt: issue.expiresAt,
      })
      const result = await sendEmail({
        to: issue.user.email,
        subject: message.subject,
        html: message.html,
        text: message.text,
      })
      // Log the recipient + reason only — never the raw token URL.
      if (!result.ok) {
        console.warn('[cms-reset] Email send failed for', issue.user.email, '—', result.message)
      }
    } else {
      console.warn('[cms-reset] Reset requested but email is not configured; no link delivered.')
    }
  }

  redirect('/admin/forgot?sent=1')
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center overflow-y-auto bg-cms-canvas px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary text-xl font-bold text-white shadow-sm">
            F
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">Reset your password</h1>
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

export default async function ForgotPasswordPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const sent = params.sent === '1'
  const error = params.error ?? ''
  const prefillEmail = params.email ?? ''

  if (sent) {
    return (
      <Shell>
        <Alert variant="success">
          <div>
            <p className="font-semibold">Check your email</p>
            <p className="mt-1 text-sm">
              If an account exists for that address, we&rsquo;ve sent a link to reset your password. The link expires in
              1&nbsp;hour.
            </p>
          </div>
        </Alert>
        <p className="mt-5 text-sm text-slate-600">
          Didn&rsquo;t get it? Check your spam folder, or{' '}
          <a href="/admin/forgot" className="font-medium text-brand-primary underline">
            try again
          </a>
          .
        </p>
      </Shell>
    )
  }

  return (
    <Shell>
      <p className="text-sm text-slate-600">
        Enter the email you use to sign in and we&rsquo;ll send you a link to set a new password.
      </p>

      {error === 'rate_limited' ? (
        <Alert variant="error" className="mt-5">
          Too many requests. Please wait a few minutes and try again.
        </Alert>
      ) : null}
      {error === 'invalid_email' ? (
        <Alert variant="error" className="mt-5">
          Please enter a valid email address.
        </Alert>
      ) : null}

      <form action={forgotAction} className="mt-6 space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="username"
          defaultValue={prefillEmail}
          placeholder="you@finanshels.com"
          required
        />
        <Button type="submit" variant="primary" size="lg" className="w-full">
          Send reset link
        </Button>
      </form>
    </Shell>
  )
}
