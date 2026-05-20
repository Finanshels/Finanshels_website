import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The page you were looking for does not exist.',
  robots: { index: false, follow: false },
}

const QUICK_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Talk to us' },
]

export default function NotFound() {
  return (
    <main className="relative min-h-[70vh] bg-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 left-12 w-64 h-64 bg-[#f16610]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-6 w-72 h-72 bg-[#6b70ff]/10 rounded-full blur-[160px]" />
      </div>
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">404</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold text-slate-900">
          We couldn’t find that page
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          The link may be outdated or the page has moved. Try one of these instead:
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 transition hover:border-[#f16610] hover:text-[#f16610]"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
