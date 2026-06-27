import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { HOME_FAQS } from '@/data/homeFaqs'
import { safeJsonLd } from '@/lib/seo/safeJsonLd'
import HomeFaqSection from '@/components/HomeFaqSection'
import { FaqAccordion } from '@/components/cms/FaqAccordion'
import { isCmsConfigured } from '@/lib/cms/config'
import { listPublishedFaqs } from '@/lib/cms/faqsRepository'
import type { CmsFaq } from '@/lib/cms/schemas/faqs'

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

function groupByTopic(faqs: CmsFaq[]) {
  const map = new Map<string, CmsFaq[]>()
  for (const faq of faqs) {
    const topic = faq.topic?.trim() || 'General'
    const existing = map.get(topic)
    if (existing) {
      existing.push(faq)
    } else {
      map.set(topic, [faq])
    }
  }
  const groups = Array.from(map.entries()).map(([topic, items]) => ({ topic, items }))
  // Move "General" to end
  const generalIdx = groups.findIndex((g) => g.topic === 'General')
  if (generalIdx > 0) groups.push(groups.splice(generalIdx, 1)[0]!)
  return groups
}

export default async function FaqPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>
}) {
  const { topic } = await searchParams

  const cmsReady = isCmsConfigured()
  const allFaqs = cmsReady
    ? await listPublishedFaqs().catch((err) => {
        console.warn('[faq] listing failed:', err instanceof Error ? err.message : err)
        return [] as CmsFaq[]
      })
    : []

  const hasCmsFaqs = allFaqs.length > 0

  const allTopics = Array.from(
    new Set(allFaqs.map((f) => f.topic?.trim()).filter(Boolean) as string[])
  )
  const activeTopic = topic && allTopics.includes(topic) ? topic : null

  const filteredFaqs = activeTopic
    ? allFaqs.filter((f) => (f.topic?.trim() || 'General') === activeTopic)
    : allFaqs

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
          {allTopics.length > 0 && (
            <div className="mb-10 flex flex-wrap gap-2">
              <Link
                href="/faq"
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  !activeTopic
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900'
                }`}
              >
                All
              </Link>
              {allTopics.map((t) => (
                <Link
                  key={t}
                  href={`/faq?topic=${encodeURIComponent(t)}`}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    activeTopic === t
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900'
                  }`}
                >
                  {t}
                </Link>
              ))}
            </div>
          )}
          <FaqAccordion groups={groupByTopic(filteredFaqs)} />
        </div>
      ) : (
        <HomeFaqSection showHeader={false} />
      )}
    </>
  )
}
