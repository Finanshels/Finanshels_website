'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { captureAttribution, readAttribution, sha256Hex } from '@/lib/landing-pages/attribution'
import { fireConversion, fireEvent } from '@/lib/landing-pages/gtag'
import type { LeadAttribution } from '@/lib/landing-pages/types'

// FIX-059: thank_you_redirect_url is editor-controlled free text. Only follow a
// same-origin path or an http(s) URL — never javascript:/data: (which would run
// in the visitor's browser after a successful conversion).
function safeRedirectTarget(raw?: string): string | null {
  const value = (raw ?? '').trim()
  if (!value) return null
  if (value.startsWith('/') && !value.startsWith('//')) return value
  try {
    const url = new URL(value, window.location.origin)
    if (url.protocol === 'http:' || url.protocol === 'https:') return url.href
  } catch {
    return null
  }
  return null
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string
          callback?: (token: string) => void
          'error-callback'?: () => void
          'expired-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
          size?: 'normal' | 'compact' | 'invisible'
          appearance?: 'always' | 'interaction-only' | 'execute'
        }
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

export type LeadFormProps = {
  landingPageId: string
  landingPageSlug: string
  serviceInterest: string
  conversionId: string
  conversionLabel: string
  submitLabel?: string
  thankYouRedirectUrl?: string
  variant?: 'card' | 'inline' | 'compact'
  showCompany?: boolean
  /** Optional extra fields injected by lead-magnet flows */
  extraHiddenFields?: Record<string, string>
  /** Used as anchor target for "Get quote" CTAs */
  anchorId?: string
  className?: string
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

const LEAD_ERROR_MESSAGES: Record<string, string> = {
  rate_limited: 'Too many submissions from your network. Please try again in a few minutes.',
  turnstile_failed: 'We could not verify your browser. Please refresh the page and try again.',
  invalid_payload: 'Please check your name, phone, and email and try again.',
  invalid_json: 'Something went wrong sending your details. Please refresh and try again.',
  unknown_landing_page: 'This page is no longer available. Please refresh and try again.',
  persist_failed: 'We could not save your details. Please try again in a moment.',
  method_not_allowed: 'Submission failed. Please refresh and try again.',
}

function humaniseLeadError(rawError: unknown, status: number): string {
  if (typeof rawError === 'string' && rawError in LEAD_ERROR_MESSAGES) {
    return LEAD_ERROR_MESSAGES[rawError]!
  }
  if (status === 429) return LEAD_ERROR_MESSAGES.rate_limited!
  if (status >= 500) return 'Our server hit an unexpected error. Please try again in a moment.'
  if (status === 400) return LEAD_ERROR_MESSAGES.invalid_payload!
  return 'Something went wrong. Please try again — or call us directly.'
}

export default function LeadForm(props: LeadFormProps) {
  const {
    landingPageId,
    landingPageSlug,
    serviceInterest,
    conversionId,
    conversionLabel,
    submitLabel = 'Get my free quote',
    thankYouRedirectUrl,
    variant = 'card',
    showCompany = true,
    extraHiddenFields,
    anchorId,
    className,
  } = props

  const baseId = useId()
  const nameId = `${baseId}-name`
  const phoneId = `${baseId}-phone`
  const emailId = `${baseId}-email`
  const companyId = `${baseId}-company`

  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [attribution, setAttribution] = useState<LeadAttribution>({ landing_url: '' })
  const [turnstileToken, setTurnstileToken] = useState<string>('')
  const turnstileMountRef = useRef<HTMLDivElement | null>(null)
  const turnstileWidgetId = useRef<string | null>(null)
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  // Capture attribution on mount
  useEffect(() => {
    setAttribution(captureAttribution())
  }, [])

  // Mount Turnstile widget once script is loaded
  useEffect(() => {
    if (!turnstileSiteKey || !turnstileMountRef.current) return

    let cancelled = false

    function tryRender() {
      if (cancelled || !window.turnstile || !turnstileMountRef.current) return
      if (turnstileWidgetId.current !== null) return
      try {
        turnstileWidgetId.current = window.turnstile.render(turnstileMountRef.current, {
          sitekey: turnstileSiteKey!,
          callback: (token) => setTurnstileToken(token),
          'error-callback': () => setTurnstileToken(''),
          'expired-callback': () => setTurnstileToken(''),
          theme: 'auto',
        })
      } catch {
        /* will retry on next interval */
      }
    }

    if (window.turnstile) {
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
        // Silently succeed for bots
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
        const res = await fetch('/api/landing-pages/lead', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            landing_page_id: landingPageId,
            landing_page_slug: landingPageSlug,
            service_interest: serviceInterest,
            name,
            phone,
            email,
            company_name,
            attribution: currentAttribution,
            turnstile_token: turnstileSiteKey ? turnstileToken : undefined,
            extra: extraHiddenFields ?? undefined,
          }),
        })

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(humaniseLeadError(body?.error, res.status))
        }

        // Enhanced conversions
        const [emailHash, phoneHash] = await Promise.all([sha256Hex(email), sha256Hex(phone)])
        if (conversionId && conversionLabel) {
          fireConversion({ conversionId, conversionLabel, emailHash, phoneHash })
        }
        fireEvent('generate_lead', {
          form_id: anchorId ?? `lead-form-${variant}`,
          service_interest: serviceInterest,
        })

        setState('success')
        form.reset()
        if (turnstileWidgetId.current && window.turnstile) {
          window.turnstile.reset(turnstileWidgetId.current)
          setTurnstileToken('')
        }

        if (thankYouRedirectUrl) {
          const dest = safeRedirectTarget(thankYouRedirectUrl)
          if (dest) window.location.href = dest
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
        setState('error')
      }
    },
    [
      anchorId,
      attribution,
      conversionId,
      conversionLabel,
      extraHiddenFields,
      landingPageId,
      landingPageSlug,
      serviceInterest,
      state,
      thankYouRedirectUrl,
      turnstileSiteKey,
      turnstileToken,
      variant,
    ]
  )

  const tone = useMemo(() => {
    if (variant === 'card') {
      return 'rounded-2xl border border-slate-200 bg-white shadow-xl p-6 sm:p-7'
    }
    if (variant === 'inline') {
      return 'rounded-2xl bg-white border border-slate-200 p-6'
    }
    return 'space-y-3'
  }, [variant])

  if (state === 'success' && !thankYouRedirectUrl) {
    return (
      <div className={`${tone} ${className ?? ''}`}>
        <div className="flex flex-col items-center text-center gap-3 py-4">
          <div className="size-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl">✓</div>
          <h3 className="text-lg font-semibold text-slate-900">Thanks — we&apos;ve got it.</h3>
          <p className="text-slate-600 text-sm">
            A Finanshels tax expert will reach out within 24 hours. Keep an eye on your phone and inbox.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form
      id={anchorId}
      onSubmit={handleSubmit}
      className={`${tone} ${className ?? ''}`}
      noValidate
      data-landing-form
    >
      <div className="space-y-3">
        <Field id={nameId} label="Full name" name="name" autoComplete="name" required />
        <Field id={phoneId} label="Phone (WhatsApp)" name="phone" type="tel" autoComplete="tel" required />
        <Field id={emailId} label="Work email" name="email" type="email" autoComplete="email" required />
        {showCompany && (
          <Field id={companyId} label="Company name" name="company_name" autoComplete="organization" />
        )}

        {/* Honeypot */}
        <div className="hidden" aria-hidden="true">
          <label>
            Company website
            <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {turnstileSiteKey ? <div ref={turnstileMountRef} className="mt-1" /> : null}

        {error && (
          <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={state === 'submitting'}
          className="w-full inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/40 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {state === 'submitting' ? 'Sending…' : submitLabel}
        </button>

        <p className="text-[11px] leading-relaxed text-slate-500 text-center">
          By submitting you agree to be contacted by Finanshels. We never share your data.
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
