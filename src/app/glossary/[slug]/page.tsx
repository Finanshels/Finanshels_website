import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArticleBody } from '@/components/cms/ArticleBody'
import { DevCmsBanner } from '@/components/cms/DevCmsBanner'
import { FaqSection } from '@/components/cms/FaqSection'
import { getSiteUrl } from '@/lib/cms/config'
import { getGlossaryTermBySlug } from '@/lib/cms/glossaryRepository'
import { htmlDirFromLanguage, htmlLangFromLanguage } from '@/lib/cms/textDirection'
import { sanitizeCmsHtml } from '@/lib/cms/sanitize'
import { buildBreadcrumbList } from '@/lib/seo/breadcrumbList'
import { safeJsonLd } from '@/lib/seo/safeJsonLd'

export const revalidate = 600

// FIX-048: decode the handful of HTML entities most likely to survive
// `replace(/<[^>]+>/g, '')` on a glossary `definition` blob. Server-side
// helper — Node has no built-in entity decoder.
const ENTITY_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
}

function decodeEntities(input: string): string {
  return input
    .replace(/&(?:amp|lt|gt|quot|apos|nbsp);|&#39;/g, (m) => ENTITY_MAP[m] ?? m)
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const term = await getGlossaryTermBySlug(slug)
  if (!term) return { title: 'Glossary' }

  // FIX-048: also decode common HTML entities so meta description doesn't
  // ship `&amp;` / `&#39;` to crawlers and SERP previews.
  // glossary-trim (2026-06-28): honour per-term SEO overrides; fall back to the
  // term name / definition when unset.
  const title = term.seo_title || term.term
  const description =
    term.meta_description || decodeEntities(term.definition.replace(/<[^>]+>/g, '')).slice(0, 160)
  const url = term.canonical_url || `${getSiteUrl()}/glossary/${term.slug}`
  // FIX-047: `robots_meta` is the canonical control. Legacy `noindex` /
  // `indexable` booleans are honoured for pre-FIX-047 Firestore docs only.
  const robotsMeta = (term.robots_meta ?? '').toLowerCase()
  const noindex =
    robotsMeta.includes('noindex') ||
    term.noindex === true ||
    term.indexable === false

  const ogImage = term.og_image
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: term.og_title || title,
      description: term.og_description || description,
      url,
      type: 'article',
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params
  const term = await getGlossaryTermBySlug(slug)
  if (!term) notFound()

  const defHtml = sanitizeCmsHtml(term.definition)
  const bodyHtml = term.bodyHtml ? sanitizeCmsHtml(term.bodyHtml) : ''
  const canonical = term.canonical_url || `${getSiteUrl()}/glossary/${term.slug}`
  // FIX-077: Arabic terms render right-to-left.
  const dir = htmlDirFromLanguage(term.language)
  const lang = htmlLangFromLanguage(term.language)

  // FIX-035: DefinedTerm JSON-LD + optional FAQPage when faqItems present.
  const definedTermLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.term,
    description: term.definition_short || term.definition.replace(/<[^>]+>/g, '').slice(0, 300),
    url: canonical,
    inDefinedTermSet: `${getSiteUrl()}/glossary`,
  }

  const faqItems = (term.faqItems ?? []).filter(
    (item): item is { question: string; answer: string } =>
      typeof item?.question === 'string' && typeof item?.answer === 'string' && item.question.trim().length > 0
  )
  const breadcrumbLd = buildBreadcrumbList([
    { name: 'Glossary', path: '/glossary' },
    { name: term.term, path: `/glossary/${term.slug}` },
  ])
  const faqLd: Record<string, unknown> | null =
    faqItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }
      : null

  return (
    <>
      <DevCmsBanner />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- JSON-LD for crawlers
        dangerouslySetInnerHTML={{ __html: safeJsonLd(definedTermLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- JSON-LD for crawlers
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }}
      />
      {faqLd ? (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger -- JSON-LD for crawlers
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLd) }}
        />
      ) : null}
      <article dir={dir} lang={lang} className="border-b border-slate-100">
        <div className="mx-auto max-w-3xl px-6 pb-16 pt-28 sm:px-10 lg:px-16 lg:pt-32">
          <Link href="/glossary" className="text-sm font-semibold text-[#f16610] hover:text-[#c14e0d]">
            ← Glossary
          </Link>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">{term.term}</h1>
          <div className="mt-8 rounded-2xl border border-slate-100 bg-[#fffaf6] p-6 text-slate-800">
            <ArticleBody html={defHtml} className="prose-base" />
          </div>
          {bodyHtml ? (
            <div className="mt-12">
              <ArticleBody html={bodyHtml} />
            </div>
          ) : null}
          {/* FIX-071: render the FAQs that back the FAQPage schema above. */}
          <FaqSection items={faqItems} className="mt-14" />
        </div>
      </article>

      {/* General-purpose contact-Finanshels CTA on every glossary page. */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-3xl px-6 py-14 sm:px-10 lg:px-16">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-10 text-center text-white sm:px-12">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Need help with {term.term}?</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              Finanshels handles UAE tax, accounting, and compliance end-to-end. Talk to a specialist and get clarity in
              minutes.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-[#f16610] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-900/20 transition hover:bg-[#c14e0d]"
              >
                Book a free consultation
              </Link>
              <a
                href="https://wa.me/971521549572"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
