'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
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
  invalid_payload: 'Please check your name, phone, and email and try again.',
  unknown_ebook: 'This resource is no longer available.',
  download_unavailable: 'This download is being updated. Please try again shortly.',
  persist_failed: 'We could not save your details. Please try again in a moment.',
}

function humaniseError(rawError: unknown, status: number): string {
  if (typeof rawError === 'string' && rawError in ERROR_MESSAGES) return ERROR_MESSAGES[rawError]!
  if (status === 429) return ERROR_MESSAGES.rate_limited!
  if (status >= 500) return 'Our server hit an unexpected error. Please try again in a moment.'
  return 'Something went wrong. Please try again.'
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export type EbookDownloadFormProps = {
  ebookSlug: string
  ebookTitle: string
  submitLabel?: string
  className?: string
}

export default function EbookDownloadForm({
  ebookSlug,
  ebookTitle,
  submitLabel = 'Get the free download',
  className,
}: EbookDownloadFormProps) {
  const baseId = useId()
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
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
      const phone = String(data.get('phone') ?? '').trim()
      const email = String(data.get('email') ?? '').trim()
      const company_name = String(data.get('company_name') ?? '').trim() || undefined

      if (!name || !phone || !email) {
        setError('Please fill in your name, phone, and email.')
        return
      }
      const phoneDigits = phone.replace(/[^0-9]/g, '')
      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        setError('Please enter a valid phone number (7–15 digits).')
        return
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        setError('Please enter a valid email address.')
        return
      }

      setState('submitting')
      const currentAttribution = attribution.landing_url ? attribution : readAttribution()

      try {
        const res = await fetch('/api/guides/lead', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            ebook_slug: ebookSlug,
            name,
            phone,
            email,
            company_name,
            attribution: currentAttribution,
            turnstile_token: turnstileSiteKey ? turnstileToken : undefined,
          }),
        })

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}))
          throw new Error(humaniseError(errBody?.error, res.status))
        }

        const okBody = (await res.json()) as { file_url?: string }
        setFileUrl(okBody.file_url ?? null)
        setState('success')
        form.reset()
        const api = getTurnstile()
        if (turnstileWidgetId.current && api) {
          api.reset(turnstileWidgetId.current)
          setTurnstileToken('')
        }
        if (okBody.file_url) {
          window.open(okBody.file_url, '_blank', 'noopener,noreferrer')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
        setState('error')
      }
    },
    [attribution, ebookSlug, state, turnstileSiteKey, turnstileToken]
  )

  const shell = `rounded-2xl border border-slate-200 bg-white shadow-xl p-6 sm:p-7 ${className ?? ''}`

  if (state === 'success') {
    return (
      <div className={shell}>
        <div className="flex flex-col items-center text-center gap-3 py-2">
          <div className="size-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl">
            ✓
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Your download is ready</h3>
          <p className="text-slate-600 text-sm">
            {ebookTitle} should be opening in a new tab. If it didn&apos;t, use the button below.
          </p>
          {fileUrl ? (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition"
            >
              Download now
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
        <Field id={`${baseId}-phone`} label="Phone (WhatsApp)" name="phone" type="tel" autoComplete="tel" required />
        <Field id={`${baseId}-email`} label="Work email" name="email" type="email" autoComplete="email" required />
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
          <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</div>
        )}

        <button
          type="submit"
          disabled={state === 'submitting'}
          className="w-full inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/40 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {state === 'submitting' ? 'Preparing your download…' : submitLabel}
        </button>

        <p className="text-[11px] leading-relaxed text-slate-500 text-center">
          We&apos;ll email you the resource and occasional finance tips. Unsubscribe anytime.
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
        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/30 focus:border-slate-500"
      />
    </div>
  )
}
