import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { CustomerStoryCard } from '@/components/cms/CustomerStoryCard'
import { CustomerReviewCard } from '@/components/cms/CustomerReviewCard'
import { DevCmsBanner } from '@/components/cms/DevCmsBanner'
import { IndustryIcon } from '@/components/cms/IndustryIcon'
import { CollectionHubHeader } from '@/components/cms/CollectionHubHeader'
import { isCmsConfigured } from '@/lib/cms/config'
import {
  listPublishedCustomerStories,
  listPublishedCustomerReviews,
  type CustomerStoryCardData,
} from '@/lib/cms/collectionRepository'
import { INDUSTRY_OPTION_MAP } from '@/lib/cms/industryOptions'

export const revalidate = 300

export const metadata = {
  title: 'Customer stories',
  description:
    'Real outcomes from UAE founders and finance teams who run accounting, tax, and compliance with Finanshels. Read the case studies.',
  alternates: { canonical: '/customers' },
  openGraph: {
    title: 'Finanshels Customer Stories',
    description:
      'Real outcomes from UAE founders and finance teams who run accounting, tax, and compliance with Finanshels.',
    url: '/customers',
    type: 'website',
  },
}

// Real, brand-level proof points shown as a credibility band under the hero.
const PROOF = [
  { value: '7,000+', label: 'Founders served' },
  { value: '79', label: 'Average NPS' },
  { value: '12', label: 'Markets across MENA' },
  { value: '100%', label: 'On-time filings' },
]

/** Large editorial feature for the lead (featured or newest) case study. */
function LeadStory({ story }: { story: CustomerStoryCardData }) {
  const industry = story.industry ? INDUSTRY_OPTION_MAP[story.industry] ?? null : null
  const eyebrow = [story.customer, industry?.label].filter(Boolean).join('  ·  ')

  return (
    <Link
      href={`/content/customer_stories/${story.slug}`}
      className="group mb-12 block overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:border-[#f16610]/40 hover:shadow-xl hover:shadow-slate-900/5"
    >
      <div className="grid lg:grid-cols-2">
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 lg:aspect-auto lg:min-h-[380px]">
          {story.heroImage ? (
            <Image
              src={story.heroImage}
              alt={story.title}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-center">
              <span className="text-balance text-2xl font-semibold leading-snug text-white/90">
                {story.customer || 'Finanshels'}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center p-8 lg:p-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#b3470a]">Featured story</span>
            {industry ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                <IndustryIcon icon={industry.icon} className="h-3.5 w-3.5" />
                {industry.label}
              </span>
            ) : null}
          </div>

          {story.customer ? (
            <p className="mt-4 text-sm font-semibold text-slate-500">{story.customer}</p>
          ) : null}

          <h2 className="mt-2 text-balance text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 group-hover:text-[#f16610] sm:text-4xl">
            {story.title}
          </h2>

          {story.summary ? (
            <p className="mt-4 line-clamp-3 text-base leading-relaxed text-slate-600">{story.summary}</p>
          ) : null}

          {story.metric && story.metric.value ? (
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-[#f16610]">{story.metric.value}</span>
              {story.metric.label ? (
                <span className="text-sm font-medium uppercase tracking-wide text-slate-500">{story.metric.label}</span>
              ) : null}
            </div>
          ) : null}

          <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-[#f16610]">
            Read the full story
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ industry?: string }>
}) {
  const { industry } = await searchParams
  const activeIndustry = industry && industry in INDUSTRY_OPTION_MAP ? industry : null

  const [allStories, reviews] = await Promise.all([
    listPublishedCustomerStories().catch((err) => {
      console.warn('[customers] stories listing failed:', err instanceof Error ? err.message : err)
      return [] as CustomerStoryCardData[]
    }),
    listPublishedCustomerReviews().catch((err) => {
      console.warn('[customers] reviews listing failed:', err instanceof Error ? err.message : err)
      return []
    }),
  ])
  const cmsReady = isCmsConfigured()

  const stories = allStories.filter((s) => !activeIndustry || s.industry === activeIndustry)
  const usedIndustries = Array.from(
    new Set(allStories.map((s) => s.industry).filter((v): v is string => !!v))
  ).filter((v) => v in INDUSTRY_OPTION_MAP)

  const buildHref = (next: string | null) => (next ? `/customers?industry=${next}` : '/customers')

  const [lead, ...rest] = stories

  return (
    <div className="bg-[#faf8f4]">
      <DevCmsBanner />

      <CollectionHubHeader
        eyebrow="Customer stories · MENA finance"
        title="Outcomes, not promises"
        subtitle="How founders and finance teams across the Gulf cut compliance time, close their books faster, and stay penalty-free—with Finanshels as their embedded finance team."
        cta={{ href: 'mailto:contact@finanshels.com', label: 'Become our next story', external: true }}
      />

      <div className="mx-auto max-w-6xl px-6 pt-12 sm:px-8 lg:px-12">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
          {PROOF.map((p) => (
            <div key={p.label}>
              <dt className="text-3xl font-bold tracking-tight text-slate-900">{p.value}</dt>
              <dd className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{p.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-12">
        {!cmsReady ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-8 py-16 text-center">
            <p className="text-lg font-medium text-slate-800">Stories load from Firestore on GCP.</p>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
              Set the Firebase Admin service-account variables on Vercel. Until then this hub stays empty by design,
              so you never ship placeholder copy as a real case study.
            </p>
          </div>
        ) : allStories.length === 0 && reviews.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center text-slate-600">
            No published stories or reviews yet. Publish documents in the{' '}
            <code className="font-mono text-sm">customer_stories</code> or{' '}
            <code className="font-mono text-sm">customer_reviews</code> collection with{' '}
            <code className="font-mono text-sm">status: &quot;published&quot;</code>.
          </p>
        ) : (
          <div className="space-y-20">
            {allStories.length > 0 ? (
              <section>
                <div className="mb-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#b3470a]">Case studies</p>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">In-depth stories</h2>
                </div>

                {usedIndustries.length > 1 && (
                  <div className="mb-10 flex flex-wrap gap-2">
                    <Link
                      href={buildHref(null)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                        !activeIndustry
                          ? 'bg-[#f16610] text-white'
                          : 'border border-slate-200 bg-white text-slate-600 hover:border-[#f16610]/40 hover:text-slate-900'
                      }`}
                    >
                      All industries
                    </Link>
                    {usedIndustries.map((value) => {
                      const opt = INDUSTRY_OPTION_MAP[value]
                      return (
                        <Link
                          key={value}
                          href={buildHref(value)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                            activeIndustry === value
                              ? 'bg-[#f16610] text-white'
                              : 'border border-slate-200 bg-white text-slate-600 hover:border-[#f16610]/40 hover:text-slate-900'
                          }`}
                        >
                          <IndustryIcon icon={opt.icon} className="h-4 w-4" />
                          {opt.label}
                        </Link>
                      )
                    })}
                  </div>
                )}

                {stories.length === 0 ? (
                  <p className="rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center text-slate-500">
                    No stories match this filter yet.
                  </p>
                ) : (
                  <>
                    {lead ? <LeadStory story={lead} /> : null}
                    {rest.length > 0 ? (
                      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {rest.map((story) => (
                          <li key={story.slug}>
                            <CustomerStoryCard story={story} />
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </>
                )}
              </section>
            ) : null}

            {reviews.length > 0 ? (
              <section>
                <div className="mb-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#b3470a]">Testimonials</p>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">What customers say</h2>
                </div>
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {reviews.map((review) => (
                    <li key={review.id}>
                      <CustomerReviewCard review={review} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        )}
      </div>

      <section className="border-t border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:px-8 lg:px-12">
          <h2 className="text-balance text-4xl font-bold tracking-tight">Make finance your advantage</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Tell us your company name and we&apos;ll connect you with founders in your industry—or start building
            your own story with Finanshels.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="mailto:contact@finanshels.com"
              className="inline-flex items-center gap-2 rounded-full bg-[#f16610] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d8550a]"
            >
              Talk to our team
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white/90 transition hover:border-white/50"
            >
              Read the blog
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
