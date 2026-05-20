'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error('Page error:', error)
    }
  }, [error])

  return (
    <main className="relative min-h-[70vh] bg-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 left-12 w-64 h-64 bg-rose-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-6 w-72 h-72 bg-[#6b70ff]/10 rounded-full blur-[160px]" />
      </div>
      <div className="relative z-10 mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Something went wrong
        </p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold text-slate-900">
          We hit an unexpected error
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Our team has been notified. You can try again or head back home.
        </p>
        {error.digest ? (
          <p className="mt-3 text-xs text-slate-400">Reference: {error.digest}</p>
        ) : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#f16610] hover:text-[#f16610]"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
