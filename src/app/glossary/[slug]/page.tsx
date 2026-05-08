import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArticleBody } from '@/components/cms/ArticleBody'
import { DevCmsBanner } from '@/components/cms/DevCmsBanner'
import { getSiteUrl } from '@/lib/cms/config'
import { getGlossaryTermBySlug } from '@/lib/cms/glossaryRepository'
import { sanitizeCmsHtml } from '@/lib/cms/sanitize'

export const revalidate = 600

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const term = await getGlossaryTermBySlug(slug)
  if (!term) return { title: 'Glossary' }

  const description = term.definition.replace(/<[^>]+>/g, '').slice(0, 160)
  const url = `${getSiteUrl()}/glossary/${term.slug}`

  return {
    title: term.term,
    description,
    openGraph: { title: term.term, description, url, type: 'article' },
    alternates: { canonical: url },
  }
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params
  const term = await getGlossaryTermBySlug(slug)
  if (!term) notFound()

  const defHtml = sanitizeCmsHtml(term.definition)
  const bodyHtml = term.bodyHtml ? sanitizeCmsHtml(term.bodyHtml) : ''

  return (
    <>
      <DevCmsBanner />
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
