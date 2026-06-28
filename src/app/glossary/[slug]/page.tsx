import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArticleBody } from '@/components/cms/ArticleBody'
import { DevCmsBanner } from '@/components/cms/DevCmsBanner'
import { DraftPreviewBanner } from '@/components/cms/DraftPreviewBanner'
import { isAdminAuthenticated } from '@/lib/cms/adminAuth'
import { getSiteUrl } from '@/lib/cms/config'
import { getGlossaryTermBySlug } from '@/lib/cms/glossaryRepository'
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

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>
type Props = { params: Promise<{ slug: string }>; searchParams: SearchParams }

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params
  // noindex preview pages: gate solely on the searchParam (a non-admin's normal
  // page never carries ?preview=1, so this can't suppress a real page's index).
  const isPreviewRequest = (await searchParams).preview === '1'
  const term = await getGlossaryTermBySlug(slug, { preview: isPreviewRequest })
  if (!term) return { title: 'Glossary' }
  if (isPreviewRequest) {
    return { title: term.term, robots: { index: false, follow: false } }
  }

  // FIX-048: also decode common HTML entities so meta description doesn't
  // ship `&amp;` / `&#39;` to crawlers and SERP previews.
  const description = decodeEntities(term.definition.replace(/<[^>]+>/g, '')).slice(0, 160)
  const url = term.canonical_url || `${getSiteUrl()}/glossary/${term.slug}`
  // FIX-047: `robots_meta` is the canonical control. Legacy `noindex` /
  // `indexable` booleans are honoured for pre-FIX-047 Firestore docs only.
  const robotsMeta = (term.robots_meta ?? '').toLowerCase()
  const noindex =
    robotsMeta.includes('noindex') ||
    term.noindex === true ||
    term.indexable === false

  return {
    title: term.term,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: { title: term.term, description, url, type: 'article' },
  }
}

export default async function GlossaryTermPage({ params, searchParams }: Props) {
  const { slug } = await params
  const preview = (await searchParams).preview === '1' && (await isAdminAuthenticated())
  const term = await getGlossaryTermBySlug(slug, { preview })
  if (!term) notFound()

  const defHtml = sanitizeCmsHtml(term.definition)
  const bodyHtml = term.bodyHtml ? sanitizeCmsHtml(term.bodyHtml) : ''
  const canonical = term.canonical_url || `${getSiteUrl()}/glossary/${term.slug}`

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
      {preview ? <DraftPreviewBanner /> : null}
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
      <article className="border-b border-slate-100">
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
        </div>
      </article>
    </>
  )
}
