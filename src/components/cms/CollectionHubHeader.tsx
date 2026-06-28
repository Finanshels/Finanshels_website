import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/**
 * Canonical dark-hero header for every CMS collection hub/listing page
 * (blog, glossary, guides, tools, podcasts, customers, webinars, faq).
 *
 * Extracted verbatim from the FAQ / glossary hero so all hubs share one
 * source of truth: navy gradient, spaced-out eyebrow, large white title,
 * a subtitle that may carry an inline link, and an optional `#ffb088` CTA.
 */
export interface CollectionHubHeaderProps {
  /** Small uppercase kicker, e.g. "Quick reference" or "Podcast · MENA finance". */
  eyebrow: string
  /** The H1. */
  title: string
  /** Lead paragraph. Accepts nodes so a page can embed an inline link. */
  subtitle?: React.ReactNode
  /** Optional secondary link rendered under the subtitle. */
  cta?: { href: string; label: string; external?: boolean }
}

export function CollectionHubHeader({ eyebrow, title, subtitle, cta }: CollectionHubHeaderProps) {
  const ctaClass =
    'mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#ffb088] hover:text-white'

  return (
    <div className="bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-36 sm:px-10 lg:px-16">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-6 max-w-2xl text-lg text-white/75">{subtitle}</p> : null}
        {cta ? (
          cta.external ? (
            <a href={cta.href} target="_blank" rel="noreferrer" className={ctaClass}>
              {cta.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          ) : (
            <Link href={cta.href} className={ctaClass}>
              {cta.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )
        ) : null}
      </div>
    </div>
  )
}
