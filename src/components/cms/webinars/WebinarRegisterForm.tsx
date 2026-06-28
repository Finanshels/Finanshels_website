'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { CalendarCheck } from 'lucide-react'
import { captureAttribution, readAttribution } from '@/lib/landing-pages/attribution'
import type { LeadAttribution } from '@/lib/landing-pages/types'

type TurnstileApi = {
  render: (
    container: string | HTMLElement,
    options: {
      sitekey: string
      callback?: (token: string) => void
      'error-callback'?: () => void
      'expired-callback'?: () => void
      theme?: 'light' | 'dark' | 'auto'
    }
  ) => string
  reset: (widgetId?: string) => void
}

function getTurnstile(): TurnstileApi | undefined {
  return (window as unknown as { turnstile?: TurnstileApi }).turnstile
}

const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

const ERROR_MESSAGES: Record<string, string> = {
  rate_limited: 'Too many requests from your network. Please try again in a few minutes.',
  turnstile_failed: 'We could not verify your browser. Please refresh the page and try again.',
  invalid_payload: 'Please check your name and email and try again.',
  unknown_webinar: 'This webinar is no longer available.',
  persist_failed: 'We could not save your registration. Please try again in a moment.',
}

function humaniseError(rawError: unknown, status: number): string {
  if (typeof rawError === 'string' && rawError in ERROR_MESSAGES) return ERROR_MESSAGES[rawError]!
  if (status === 429) return ERROR_MESSAGES.rate_limited!
  if (status >= 500) return 'Our server hit an unexpected error. Please try again in a moment.'
  return 'Something went wrong. Please try again.'
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export type WebinarRegisterFormProps = {
  webinarSlug: string
  webinarTitle: string
  submitLabel?: string
  className?: string
}

export function WebinarRegisterForm({
  webinarSlug,
  webinarTitle,
  submitLabel = 'Save my seat',
  className,
}: WebinarRegisterFormProps) {
  const baseId = useId()
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [joinUrl, setJoinUrl] = useState<string | null>(null)
  const [attribution, setAttribution] = useState<LeadAttribution>({ landing_url: '' })
  const [turnstileToken, setTurnstileToken] = useState<string>('')
  const turnstileMountRef = useRef<HTMLDivElement | null>(null)
  const turnstileWidgetId = useRef<string | null>(null)
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    setAttribution(captureAttribution())
  }, [])

  useEffect(() => {
    if (!turnstileSiteKey || !turnstileMountRef.current) return
    let cancelled = false

    function tryRender() {
      const api = getTurnstile()
      if (cancelled || !api || !turnstileMountRef.current) return
      if (turnstileWidgetId.current !== null) return
      try {
        turnstileWidgetId.current = api.render(turnstileMountRef.current, {
          sitekey: turnstileSiteKey!,
          callback: (token) => setTurnstileToken(token),
          'error-callback': () => setTurnstileToken(''),
          'expired-callback': () => setTurnstileToken(''),
          theme: 'auto',
        })
      } catch {
        /* retry on next interval */
      }
    }

    if (getTurnstile()) {
      tryRender()
      return () => {
        cancelled = true
      }
    }

    let script = document.querySelector<HTMLScriptElement>(`script[src^="${TURNSTILE_SCRIPT_SRC}"]`)
    if (!script) {
      script = document.createElement('script')
      script.src = TURNSTILE_SCRIPT_SRC
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
    const interval = window.setInterval(tryRender, 200)
    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [turnstileSiteKey])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (state === 'submitting') return
      setError(null)

      const form = e.currentTarget
      const data = new FormData(form)
      const honeypot = String(data.get('company_website') ?? '')
      if (honeypot) {
        setState('success')
        return
      }

      const name = String(data.get('name') ?? '').trim()
      const email = String(data.get('email') ?? '').trim()
      const phone = String(data.get('phone') ?? '').trim()
      const company_name = String(data.get('company_name') ?? '').trim() || undefined

      if (!name || !email) {
        setError('Please fill in your name and email.')
        return
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        setError('Please enter a valid email address.')
        return
      }
      if (phone) {
        const phoneDigits = phone.replace(/[^0-9]/g, '')
        if (phoneDigits.length < 7 || phoneDigits.length > 15) {
          setError('Please enter a valid phone number (7–15 digits).')
          return
        }
      }

      setState('submitting')
      const currentAttribution = attribution.landing_url ? attribution : readAttribution()

      try {
        const res = await fetch('/api/webinars/register', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            webinar_slug: webinarSlug,
            name,
            email,
            phone: phone || undefined,
            company_name,
            attribution: currentAttribution,
            turnstile_token: turnstileSiteKey ? turnstileToken : undefined,
          }),
        })

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}))
          throw new Error(humaniseError(errBody?.error, res.status))
        }

        const okBody = (await res.json()) as { join_url?: string | null }
        setJoinUrl(okBody.join_url ?? null)
        setState('success')
        form.reset()
        const api = getTurnstile()
        if (turnstileWidgetId.current && api) {
          api.reset(turnstileWidgetId.current)
          setTurnstileToken('')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
        setState('error')
      }
    },
    [attribution, webinarSlug, state, turnstileSiteKey, turnstileToken]
  )

  const shell = `rounded-2xl border border-slate-200 bg-white shadow-xl p-6 sm:p-7 ${className ?? ''}`

  if (state === 'success') {
    return (
      <div className={shell}>
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CalendarCheck className="size-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">You&apos;re registered</h3>
          <p className="text-sm text-slate-600">
            We&apos;ve emailed your confirmation and join link for {webinarTitle}. See you there.
          </p>
          {joinUrl ? (
            <a
              href={joinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Open the join link
            </a>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={shell} noValidate>
      <div className="space-y-3">
        <Field id={`${baseId}-name`} label="Full name" name="name" autoComplete="name" required />
        <Field id={`${baseId}-email`} label="Work email" name="email" type="email" autoComplete="email" required />
        <Field id={`${baseId}-phone`} label="Phone (WhatsApp)" name="phone" type="tel" autoComplete="tel" />
        <Field id={`${baseId}-company`} label="Company name" name="company_name" autoComplete="organization" />

        {/* Honeypot */}
        <div className="hidden" aria-hidden="true">
          <label>
            Company website
            <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {turnstileSiteKey ? <div ref={turnstileMountRef} className="mt-1" /> : null}

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
        )}

        <button
          type="submit"
          disabled={state === 'submitting'}
          className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === 'submitting' ? 'Reserving your seat…' : submitLabel}
        </button>

        <p className="text-center text-[11px] leading-relaxed text-slate-500">
          We&apos;ll email your join link and a reminder. Unsubscribe anytime.
        </p>
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  name,
  type = 'text',
  required = false,
  autoComplete,
}: {
  id: string
  label: string
  name: string
  type?: string
  required?: boolean
  autoComplete?: string
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-medium text-slate-700">
        {label}
        {required ? <span className="text-rose-600"> *</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/30"
      />
    </div>
  )
}
