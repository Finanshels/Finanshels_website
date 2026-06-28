import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Download, FileText, Lock } from 'lucide-react'
import EbookDownloadForm from '@/components/guides/EbookDownloadForm'
import { getPublishedEbookBySlug, type EbookDetail } from '@/lib/cms/ebooksRepository'
import { safeJsonLd } from '@/lib/seo/safeJsonLd'

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const ebook = await getPublishedEbookBySlug(slug)
  if (!ebook) return { title: 'Resource not found' }

  const title = ebook.seo.seoTitle || ebook.title
  const description = ebook.seo.metaDescription || ebook.summary || undefined
  const ogImage = ebook.seo.ogImage || ebook.coverImage || undefined
  const canonical = ebook.seo.canonicalUrl || `/guides/${ebook.slug}`

  return {
    title,
    description,
    keywords: ebook.seo.focusKeyword || undefined,
    alternates: { canonical },
    robots: ebook.seo.robotsMeta || undefined,
    openGraph: {
      title: ebook.seo.ogTitle || title,
      description: ebook.seo.ogDescription || description,
      url: `/guides/${ebook.slug}`,
      type: 'article',
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

function metaBadges(ebook: EbookDetail): string[] {
  const badges: string[] = []
  if (ebook.format) badges.push(ebook.format.toUpperCase())
  if (ebook.pageCount) badges.push(`${ebook.pageCount} pages`)
  return badges
}

export default async function EbookLandingPage({ params }: Props) {
  const { slug } = await params
  const ebook = await getPublishedEbookBySlug(slug)
  if (!ebook) notFound()

  const badges = metaBadges(ebook)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: ebook.title,
    description: ebook.seo.metaDescription || ebook.summary || undefined,
    image: ebook.coverImage || ebook.seo.ogImage || undefined,
    url: `/guides/${ebook.slug}`,
    bookFormat: 'https://schema.org/EBook',
    author: { '@type': 'Organization', name: 'Finanshels' },
    publisher: { '@type': 'Organization', name: 'Finanshels' },
  }

  return (
    <main className="bg-gradient-to-b from-white to-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          All resources
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Left: cover + copy */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  <FileText className="size-3.5" />
                  {badge}
                </span>
              ))}
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {ebook.title}
            </h1>

            {ebook.fullDescription ? (
              <div className="mt-5 whitespace-pre-line text-base leading-relaxed text-slate-600">
                {ebook.fullDescription}
              </div>
            ) : null}

            {ebook.topics.length > 0 ? (
              <div className="mt-8">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  What&apos;s inside
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {ebook.topics.map((topic) => (
                    <li
                      key={topic}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* Right: cover image + download */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {ebook.coverImage ? (
              <div className="relative mx-auto mb-6 aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-lg">
                <Image
                  src={ebook.coverImage}
                  alt={ebook.title}
                  fill
                  sizes="(min-width: 1024px) 320px, 80vw"
                  className="object-cover"
                  priority
                />
              </div>
            ) : null}

            {ebook.gated ? (
              <EbookDownloadForm ebookSlug={ebook.slug} ebookTitle={ebook.title} />
            ) : ebook.fileUrl ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl sm:p-7">
                <p className="text-sm text-slate-600">Free download — no sign-up required.</p>
                <a
                  href={ebook.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  <Download className="size-4" />
                  Download now
                </a>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                <Lock className="size-4" />
                Download coming soon.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
