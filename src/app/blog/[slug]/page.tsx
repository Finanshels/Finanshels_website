import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import { ArticleBody } from '@/components/cms/ArticleBody'
import { DevCmsBanner } from '@/components/cms/DevCmsBanner'
import { PageBlocksRenderer } from '@/components/cms/PageBlocksRenderer'
import { AuthorAvatar } from '@/components/cms/blog/AuthorAvatar'
import { ReadingProgress } from '@/components/cms/blog/ReadingProgress'
import { ArticleToc } from '@/components/cms/blog/ArticleToc'
import { ShareRow } from '@/components/cms/blog/ShareRow'
import { getSiteUrl } from '@/lib/cms/config'
import { getBlogPostBySlug } from '@/lib/cms/blogRepository'
import { sanitizeCmsHtml } from '@/lib/cms/sanitize'
import { buildArticleToc } from '@/lib/cms/articleToc'
import { estimateReadingMinutes } from '@/lib/cms/readingTime'
import { blogCategoryLabel } from '@/lib/cms/blogTaxonomy'
import { buildBreadcrumbList } from '@/lib/seo/breadcrumbList'
import { safeJsonLd } from '@/lib/seo/safeJsonLd'

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

function pickOgImage(post: { og_image?: string; card_image?: string; featured_image?: string; heroImageUrl?: string }): string | null {
  return post.og_image || post.card_image || post.featured_image || post.heroImageUrl || null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return { title: 'Article' }

  // FIX-034: honour noindex/indexable + use og_image fallback chain.
  const title = post.seo_title ?? post.seoTitle ?? post.title
  const description =
    post.meta_description ?? post.seoDescription ?? post.card_description ?? post.excerpt ?? undefined
  const ogTitle = post.og_title || title
  const ogDescription = post.og_description || description
  const ogImage = pickOgImage(post)
  const url = post.canonical_url || `${getSiteUrl()}/blog/${post.slug}`
  // FIX-047: `robots_meta` is the canonical control. Legacy `noindex` /
  // `indexable` booleans are honoured for pre-FIX-047 Firestore docs only.
  const robotsMeta = (post.robots_meta ?? '').toLowerCase()
  const noindex =
    robotsMeta.includes('noindex') ||
    post.noindex === true ||
    post.indexable === false

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url,
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  // Sanitize once, then derive anchors + TOC + read time from the same HTML.
  const sanitized = sanitizeCmsHtml(post.body ?? post.bodyHtml ?? '')
  const { html: bodyHtml, toc } = buildArticleToc(sanitized)
  const readingMinutes = estimateReadingMinutes(sanitized)
  const hasToc = toc.length >= 2

  const authorName = post.author ?? post.authorName ?? null
  const categoryLabel = blogCategoryLabel(post.blog_category)
  const tags = post.blog_tags ?? []
  const heroImage = post.featured_image ?? post.heroImageUrl ?? null
  const dateLabel = formatDate(post.publishedAt)
  const updatedLabel =
    post.updatedAt && post.updatedAt.getTime() - post.publishedAt.getTime() > 86_400_000
      ? formatDate(post.updatedAt)
      : null

  // FIX-034: render page_blocks below the body when present.
  const blocks = Array.isArray(post.page_blocks) ? post.page_blocks : []
  // FIX-034: emit BlogPosting JSON-LD.
  const ogImage = pickOgImage(post)
  const canonical = post.canonical_url || `${getSiteUrl()}/blog/${post.slug}`
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': post.schema_type_override || post.schema_type || 'BlogPosting',
    headline: post.title,
    description: post.meta_description ?? post.seoDescription ?? post.excerpt ?? undefined,
    datePublished: post.publishedAt.toISOString(),
    dateModified: (post.updatedAt ?? post.publishedAt).toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    author: authorName ? { '@type': 'Person', name: authorName } : undefined,
    image: ogImage ? [ogImage] : undefined,
  }
  const breadcrumbLd = buildBreadcrumbList([
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ])

  const readingColumn = (
    <div className="w-full max-w-[720px]">
      <header>
        <nav className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400">
          <Link href="/blog" className="transition-colors hover:text-[#f16610]">
            Blog
          </Link>
          {categoryLabel ? (
            <>
              <span className="px-2 text-slate-300">/</span>
              <span className="text-slate-500">{categoryLabel}</span>
            </>
          ) : null}
        </nav>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {categoryLabel ? (
            <span className="inline-flex rounded-full border border-[#f16610]/30 bg-[#f16610]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#b3470a]">
              {categoryLabel}
            </span>
          ) : null}
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
            {readingMinutes} min read
          </span>
        </div>

        <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.06] tracking-tight text-slate-900 sm:text-5xl">
          {post.title}
        </h1>

        <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-slate-200/80 pt-5">
          {authorName ? (
            <span className="flex items-center gap-2.5">
              <AuthorAvatar name={authorName} />
              <span className="text-sm font-semibold text-slate-700">{authorName}</span>
            </span>
          ) : null}
          <span className="font-mono text-[12px] text-slate-400">{dateLabel}</span>
          {updatedLabel ? (
            <span className="font-mono text-[12px] text-slate-400">
              <span className="text-slate-300">·</span> Updated {updatedLabel}
            </span>
          ) : null}
        </div>
      </header>

      {heroImage ? (
        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative aspect-[16/9]">
            <Image
              src={String(heroImage)}
              // FIX-048: editor-supplied alt text; fall back to the post title
              // (always populated) so screen readers + image search get something.
              alt={post.featured_image_alt?.trim() || post.title}
              fill
              sizes="(min-width: 1024px) 720px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      ) : null}

      {post.excerpt ? (
        <aside className="mt-10 rounded-r-xl border-l-2 border-[#f16610] bg-white/70 px-6 py-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#b3470a]">The bottom line</p>
          <p className="mt-3 text-lg leading-relaxed text-slate-700">{post.excerpt}</p>
        </aside>
      ) : null}

      <ArticleBody html={bodyHtml} className="fin-article mt-10" />

      <footer className="mt-14 border-t border-slate-200 pt-8">
        {tags.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">Tags</span>
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <ShareRow url={canonical} title={post.title} />
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition-colors hover:text-[#f16610]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to the index
          </Link>
        </div>

        {authorName ? (
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <AuthorAvatar name={authorName} size="md" />
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">Written by</p>
              <p className="text-sm font-semibold text-slate-800">{authorName}</p>
            </div>
          </div>
        ) : null}
      </footer>
    </div>
  )

  return (
    <>
      <DevCmsBanner />
      <ReadingProgress />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- emitting JSON-LD for crawlers
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- emitting JSON-LD for crawlers
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }}
      />
      <article className="bg-[#faf8f4] pb-24 pt-32 sm:pt-36">
        {hasToc ? (
          <div className="mx-auto flex max-w-6xl justify-center gap-10 px-6 sm:px-8 lg:gap-16">
            <aside className="hidden w-[200px] shrink-0 lg:block">
              <div className="sticky top-28">
                <ArticleToc items={toc} />
              </div>
            </aside>
            {readingColumn}
          </div>
        ) : (
          <div className="mx-auto max-w-[720px] px-6 sm:px-8">{readingColumn}</div>
        )}

        {blocks.length > 0 ? (
          <div className="mt-16">
            <PageBlocksRenderer blocks={blocks} />
          </div>
        ) : null}
      </article>
    </>
  )
}
