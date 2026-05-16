'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export interface LeadDetails {
  service: string
  firstName: string
  lastName: string
  email: string
  phone: string
  companyName: string
  message: string
}

interface LeadFormProps {
  pageUrl?: string
  onSubmitted: (lead: LeadDetails, sessionId: string) => void
}

interface ServiceGroup {
  label: string
  services: readonly string[]
}

const SERVICE_GROUPS: readonly ServiceGroup[] = [
  {
    label: 'Tax & FTA',
    services: [
      'Corporate Tax Registration',
      'Corporate Tax Filing',
      'Corporate Tax Deregistration',
      'VAT Registration',
      'VAT Filing',
      'VAT Deregistration',
      'FTA Amendments',
    ],
  },
  {
    label: 'Accounting',
    services: [
      'Monthly Accounting',
      'Quarterly Accounting',
      'Annual Accounting',
      'Accounting',
      'Management Accounting',
      'Financial Statement Preparation',
    ],
  },
  {
    label: 'Audit & Compliance',
    services: [
      'Auditing',
      'Audited Financial Statements',
      'AML Compliance',
      'Liquidation',
    ],
  },
  {
    label: 'CFO Advisory',
    services: [
      'Fractional CFO - hourly',
      'CFO Services',
      'Salary Benchmarking',
    ],
  },
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^[+()\-\s\d]{6,}$/

interface FieldErrors {
  service?: string
  firstName?: string
  email?: string
  phone?: string
  companyName?: string
  message?: string
}

function validate(values: LeadDetails): FieldErrors {
  const errors: FieldErrors = {}
  if (!values.service) errors.service = 'Pick a service so we can route you correctly.'
  if (!values.firstName.trim()) errors.firstName = 'Your name helps us greet you properly.'
  if (!values.email.trim() || !EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'A valid email is required.'
  }
  if (!values.phone.trim() || !PHONE_REGEX.test(values.phone.trim())) {
    errors.phone = 'A reachable phone number is required.'
  }
  if (!values.companyName.trim()) errors.companyName = 'Company name helps us prep context.'
  if (!values.message.trim()) errors.message = 'Tell us briefly what you need.'
  return errors
}

const FIELD_BASE =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100'

export function LeadForm({ pageUrl, onSubmitted }: LeadFormProps) {
  const [values, setValues] = useState<LeadDetails>({
    service: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    message: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function update<K extends keyof LeadDetails>(key: K, value: LeadDetails[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (errors[key as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(null)
    const fieldErrors = validate(values)
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/chat/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim() || undefined,
          email: values.email.trim(),
          phone: values.phone.trim(),
          companyName: values.companyName.trim(),
          intent: values.service,
          pageUrl: pageUrl ?? (typeof window !== 'undefined' ? window.location.href : undefined),
          conversationSummary: `Service: ${values.service}\nMessage: ${values.message.trim()}`,
          consent: true,
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        if (body?.error === 'rate_limited') {
          setSubmitError('Too many submissions. Please try again shortly.')
        } else if (body?.error === 'invalid_email') {
          setErrors((prev) => ({ ...prev, email: 'That email does not look valid.' }))
        } else if (body?.error === 'invalid_phone') {
          setErrors((prev) => ({ ...prev, phone: 'That phone number does not look valid.' }))
        } else {
          setSubmitError('We could not submit your details. Please retry.')
        }
        return
      }

      const data = (await response.json()) as { ok: boolean; sessionId: string }
      if (!data.ok || !data.sessionId) {
        setSubmitError('We could not submit your details. Please retry.')
        return
      }

      onSubmitted(values, data.sessionId)
    } catch {
      setSubmitError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:py-10">
      <div className="mb-6 text-center sm:mb-8">
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Tell us a little about you
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          A quick intro lets a Finanshels specialist follow up properly — then Finny will jump in
          to answer your questions right here.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
            What service do you need?
          </label>
          <select
            value={values.service}
            onChange={(event) => update('service', event.target.value)}
            className={FIELD_BASE}
          >
            <option value="">Choose a service…</option>
            {SERVICE_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.services.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.service && <p className="mt-1 text-xs text-red-600">{errors.service}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              First name
            </label>
            <input
              type="text"
              autoComplete="given-name"
              value={values.firstName}
              onChange={(event) => update('firstName', event.target.value)}
              placeholder="Ayesha"
              className={FIELD_BASE}
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Last name <span className="font-normal normal-case text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              autoComplete="family-name"
              value={values.lastName}
              onChange={(event) => update('lastName', event.target.value)}
              placeholder="Khan"
              className={FIELD_BASE}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => update('email', event.target.value)}
              placeholder="you@company.com"
              className={FIELD_BASE}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Phone (with country code)
            </label>
            <input
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(event) => update('phone', event.target.value)}
              placeholder="+971 50 123 4567"
              className={FIELD_BASE}
            />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
            Company name
          </label>
          <input
            type="text"
            autoComplete="organization"
            value={values.companyName}
            onChange={(event) => update('companyName', event.target.value)}
            placeholder="Acme Trading LLC"
            className={FIELD_BASE}
          />
          {errors.companyName && <p className="mt-1 text-xs text-red-600">{errors.companyName}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
            How can we help?
          </label>
          <textarea
            value={values.message}
            onChange={(event) => update('message', event.target.value)}
            rows={4}
            placeholder="A few words on what you're trying to solve, current setup, or deadlines…"
            className={`${FIELD_BASE} resize-none`}
          />
          {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
        </div>

        {submitError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
            </>
          ) : (
            'Continue to chat'
          )}
        </button>

        <p className="text-center text-[11px] leading-relaxed text-slate-400">
          We respect your privacy. Details are used only to contact you and improve your chat. See
          our{' '}
          <a href="/privacy-policy" className="underline hover:text-slate-600">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </div>
  )
}
