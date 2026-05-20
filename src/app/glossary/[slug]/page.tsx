import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArticleBody } from '@/components/cms/ArticleBody'
import { DevCmsBanner } from '@/components/cms/DevCmsBanner'
import { getSiteUrl } from '@/lib/cms/config'
import { getGlossaryTermBySlug } from '@/lib/cms/glossaryRepository'
import { sanitizeCmsHtml } from '@/lib/cms/sanitize'
import { buildBreadcrumbList } from '@/lib/seo/breadcrumbList'

export const revalidate = 600

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const term = await getGlossaryTermBySlug(slug)
  if (!term) return { title: 'Glossary' }

  const description = term.definition.replace(/<[^>]+>/g, '').slice(0, 160)
  const url = term.canonical_url || `${getSiteUrl()}/glossary/${term.slug}`
  const noindex = term.noindex === true || term.indexable === false

  return {
    title: term.term,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: { title: term.term, description, url, type: 'article' },
  }
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params
  const term = await getGlossaryTermBySlug(slug)
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
      <DevCmsBanner />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- JSON-LD for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- JSON-LD for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd ? (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger -- JSON-LD for crawlers
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
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
