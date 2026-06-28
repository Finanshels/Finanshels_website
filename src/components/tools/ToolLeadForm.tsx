'use client'

import { useState } from 'react'
import { useTurnstile } from '@/lib/landing-pages/useTurnstile'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface ToolLeadFormProps {
  slug: string
  serviceInterest: string
  submitLabel: string
  /** A JSON-serializable snapshot of the user's inputs + computed result. */
  resultSnapshot: Record<string, unknown>
  onSuccess?: () => void
  /** Headline shown after a successful submit. Defaults to the breakdown wording. */
  successTitle?: string
  /** Sub-copy shown after a successful submit. */
  successMessage?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ToolLeadForm({
  slug,
  serviceInterest,
  submitLabel,
  resultSnapshot,
  onSuccess,
  successTitle = 'Done — check your inbox.',
  successMessage = 'Your full breakdown is on its way.',
}: ToolLeadFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState<string | null>(null)
  // FIX-059 companion: /api/tools/lead enforces Turnstile, so the form must
  // send a token. Bypassed automatically when the site key is unset (dev).
  const turnstile = useTurnstile()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (name.trim().length < 2) return setError('Please enter your name.')
    if (!EMAIL_RE.test(email)) return setError('Please enter a valid work email.')
    const digits = phone.replace(/[^0-9]/g, '')
    if (digits.length < 7 || digits.length > 15) return setError('Please enter a valid phone number.')
    if (turnstile.siteKey && !turnstile.token) {
      return setError('Please complete the verification challenge and try again.')
    }

    setState('submitting')
    try {
      const res = await fetch('/api/tools/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          tool_slug: slug,
          service_interest: serviceInterest,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          result_snapshot: resultSnapshot,
          turnstile_token: turnstile.siteKey ? turnstile.token : undefined,
        }),
      })
      if (!res.ok) {
        setState('error')
        setError('Something went wrong. Please try again in a moment.')
        turnstile.reset()
        return
      }
      setState('success')
      onSuccess?.()
    } catch {
      setState('error')
      setError('Network error. Please try again.')
      turnstile.reset()
    }
  }

  if (state === 'success') {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
        <p className="font-semibold">{successTitle}</p>
        <p className="mt-1 text-sm">{successMessage}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-6">
      <input
        type="text"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2"
        autoComplete="name"
      />
      <input
        type="email"
        placeholder="Work email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2"
        autoComplete="email"
      />
      <input
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2"
        autoComplete="tel"
      />
      {turnstile.siteKey ? <div ref={turnstile.mountRef} className="mt-1" /> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={state === 'submitting'}
        className="rounded-lg bg-[#f16610] px-4 py-2.5 font-semibold text-white disabled:opacity-60"
      >
        {state === 'submitting' ? 'Sending…' : submitLabel}
      </button>
    </form>
  )
}
