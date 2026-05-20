'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'finanshels_cookie_consent_v1'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (!stored) setVisible(true)
    } catch {
      // localStorage blocked (private mode, embedded contexts) — fail silent.
    }
  }, [])

  function accept() {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ accepted: true, ts: new Date().toISOString() })
      )
    } catch {
      // ignore
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <p className="text-sm text-slate-700">
          We use cookies for essential site functionality and anonymous analytics. By
          using Finanshels you agree to our{' '}
          <Link href="/privacy" className="font-semibold text-[#f16610] underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={accept}
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
