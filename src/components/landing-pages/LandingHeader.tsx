import Link from 'next/link'
import { CallButton } from './CtaButtons'
import type { CtaConfig } from './CtaButtons'

export default function LandingHeader({
  badgeText,
  cta,
}: {
  badgeText?: string
  cta: CtaConfig
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Finanshels">
          <span className="text-base sm:text-lg font-display font-semibold tracking-tight text-slate-900">
            Finanshels
          </span>
          {badgeText ? (
            <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium px-2 py-0.5">
              {badgeText}
            </span>
          ) : null}
        </Link>
        <div className="flex items-center gap-2">
          {cta.hasPhone ? <CallButton cta={cta} label="Call us" className="hidden sm:inline-flex !py-2 !px-4 !text-xs" /> : null}
          {cta.hasPhone ? (
            <a
              href={cta.telHref}
              className="sm:hidden inline-flex items-center justify-center rounded-lg bg-slate-900 text-white text-xs font-semibold px-3 py-2"
            >
              Call
            </a>
          ) : null}
        </div>
      </div>
    </header>
  )
}
