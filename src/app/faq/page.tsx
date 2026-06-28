import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { HOME_FAQS } from '@/content/home-faqs'
import { safeJsonLd } from '@/lib/seo/safeJsonLd'
import HomeFaqSection from '@/components/marketing/HomeFaqSection'
import { FaqAccordion } from '@/components/cms/FaqAccordion'
import { isCmsConfigured } from '@/lib/cms/config'
import { listPublishedFaqs } from '@/lib/cms/faqsRepository'
import type { CmsFaq } from '@/lib/cms/schemas/faqs'
import { CONTENT_CATEGORY_OPTIONS, CONTENT_CATEGORY_LABELS } from '@/lib/cms/contentCategoryOptions'

export const revalidate = 300

const PAGE_TITLE = 'Frequently Asked Questions | Finanshels'
const PAGE_DESCRIPTION =
  'Answers to every question founders ask before starting with Finanshels — pricing, onboarding, software, quality, and UAE corporate tax.'

export const metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: '/faq' },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
  twitter: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
}

export default async function FaqPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>
}) {
  const { service } = await searchParams

  const cmsReady = isCmsConfigured()
  const allFaqs = cmsReady
    ? await listPublishedFaqs().catch((err) => {
        console.warn('[faq] listing failed:', err instanceof Error ? err.message : err)
        return [] as CmsFaq[]
      })
    : []

  const hasCmsFaqs = allFaqs.length > 0

  // Service chips: only the services that actually appear, in canonical order.
  const presentServices = new Set<string>()
  for (const faq of allFaqs) for (const s of faq.service_category ?? []) presentServices.add(s)
  const serviceChips = CONTENT_CATEGORY_OPTIONS.filter((v) => presentServices.has(v))

  const activeService = service && presentServices.has(service) ? service : null

  const filteredFaqs = activeService
    ? allFaqs.filter((f) => (f.service_category ?? []).includes(activeService))
    : allFaqs

  // A single accordion group; 'General' suppresses the heading (see FaqAccordion).
  const accordionGroups = [
    {
      topic: activeService ? CONTENT_CATEGORY_LABELS[activeService] ?? activeService : 'General',
      items: filteredFaqs,
    },
  ]

  // JSON-LD: prefer CMS data, fall back to static
  const faqSchemaItems = hasCmsFaqs
    ? allFaqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      }))
    : HOME_FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      }))

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqSchemaItems,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />

      <div className="bg-gradient-to-b from-slate-950 to-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-36 sm:px-10 lg:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Quick Reference</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Frequently asked questions.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            Everything founders ask before they start.{' '}
            <a
              href="https://wa.me/971521549572?text=Hi%20Team%20Finanshels%2C%20I%20have%20a%20question."
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#ffb088] hover:text-white"
            >
              Chat with our team
            </a>{' '}
            if you need a straight answer.
          </p>
          <Link
            href="/blog"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#ffb088] hover:text-white"
          >
            Browse the blog
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>

      {hasCmsFaqs ? (
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-10 lg:px-16">
          {serviceChips.length > 0 && (
            <div className="mb-10 flex flex-wrap gap-2">
              <Link
                href="/faq"
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  !activeService
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900'
                }`}
              >
                All
              </Link>
              {serviceChips.map((s) => (
                <Link
                  key={s}
                  href={`/faq?service=${encodeURIComponent(s)}`}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    activeService === s
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900'
                  }`}
                >
                  {CONTENT_CATEGORY_LABELS[s] ?? s}
                </Link>
              ))}
            </div>
          )}
          <FaqAccordion groups={accordionGroups} />
        </div>
      ) : (
        <HomeFaqSection showHeader={false} />
      )}
    </>
  )
}
