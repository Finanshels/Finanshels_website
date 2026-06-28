import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { IndustryIcon } from '@/components/cms/IndustryIcon'
import { INDUSTRY_OPTION_MAP } from '@/lib/cms/industryOptions'
import type { CustomerStoryCardData } from '@/lib/cms/collectionRepository'

/**
 * Case-study card for the /customers hub. Leads with the headline metric — the
 * measurable outcome is the hero of every card.
 */
export function CustomerStoryCard({ story }: { story: CustomerStoryCardData }) {
  const industry = story.industry ? INDUSTRY_OPTION_MAP[story.industry] ?? null : null
  const eyebrow = [story.customer, industry?.label].filter(Boolean).join('  ·  ')

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-[#f16610]/40 hover:shadow-lg hover:shadow-slate-900/5">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {story.heroImage ? (
          <Image
            src={story.heroImage}
            alt={story.title}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-6 text-center">
            <span className="text-balance text-lg font-semibold leading-snug text-white/90">
              {story.customer || 'Finanshels'}
            </span>
          </div>
        )}
        {industry ? (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700 backdrop-blur">
            <IndustryIcon icon={industry.icon} className="h-3.5 w-3.5" />
            {industry.label}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {eyebrow ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#b3470a]">{eyebrow}</p>
        ) : null}

        <h3 className="mt-2 text-balance text-lg font-bold leading-snug tracking-tight text-slate-900 group-hover:text-[#f16610]">
          <Link href={`/content/customer_stories/${story.slug}`} className="after:absolute after:inset-0">
            {story.title}
          </Link>
        </h3>

        {story.summary ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{story.summary}</p>
        ) : null}

        <div className="mt-5 flex-1" />

        {story.metric && story.metric.value ? (
          <div className="flex items-baseline gap-2 border-t border-slate-100 pt-4">
            <span className="text-2xl font-bold tracking-tight text-[#f16610]">{story.metric.value}</span>
            {story.metric.label ? (
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{story.metric.label}</span>
            ) : null}
          </div>
        ) : null}

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#f16610]">
          Read the story
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </span>
      </div>
    </article>
  )
}
