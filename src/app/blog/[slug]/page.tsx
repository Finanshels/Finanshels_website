import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArticleBody } from '@/components/cms/ArticleBody'
import { DevCmsBanner } from '@/components/cms/DevCmsBanner'
import { PageBlocksRenderer } from '@/components/cms/PageBlocksRenderer'
import { getSiteUrl } from '@/lib/cms/config'
import { getBlogPostBySlug } from '@/lib/cms/blogRepository'
import { sanitizeCmsHtml } from '@/lib/cms/sanitize'

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
  const noindex = post.noindex === true || post.indexable === false

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

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  const body = sanitizeCmsHtml(post.body ?? post.bodyHtml ?? '')
  const dateLabel = post.publishedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  // FIX-034: render page_blocks below the body when present.
  const blocks = Array.isArray(post.page_blocks) ? post.page_blocks : []
  // FIX-034: emit BlogPosting JSON-LD.
  const ogImage = pickOgImage(post)
  const canonical = post.canonical_url || `${getSiteUrl()}/blog/${post.slug}`
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': post.schema_type || 'BlogPosting',
    headline: post.title,
    description: post.meta_description ?? post.seoDescription ?? post.excerpt ?? undefined,
    datePublished: post.publishedAt.toISOString(),
    dateModified: (post.updatedAt ?? post.publishedAt).toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    author: post.author || post.authorName ? { '@type': 'Person', name: post.author ?? post.authorName } : undefined,
    image: ogImage ? [ogImage] : undefined,
  }

  return (
    <>
      <DevCmsBanner />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- emitting JSON-LD for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <header className="border-b border-slate-100 bg-gradient-to-b from-slate-950 to-slate-900 text-white">
          <div className="mx-auto max-w-3xl px-6 pb-16 pt-36 sm:px-10 lg:px-16">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Blog</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{post.title}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/70">
              <time dateTime={post.publishedAt.toISOString()}>{dateLabel}</time>
              {(post.author ?? post.authorName) ? (
                <>
                  <span aria-hidden className="text-white/40">
                    ·
                  </span>
                  <span>{post.author ?? post.authorName}</span>
                </>
              ) : null}
            </div>
          </div>
        </header>

        {(post.featured_image ?? post.heroImageUrl) ? (
          <div className="mx-auto -mt-8 max-w-4xl px-6 sm:px-10">
            <div className="relative aspect-[21/9] overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-slate-900/30">
              {/* eslint-disable-next-line @next/next/no-img-element -- hero image; admin-controlled URL */}
              <img src={String(post.featured_image ?? post.heroImageUrl)} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        ) : null}

        <div className="mx-auto max-w-3xl px-6 py-14 sm:px-10 lg:px-16">
          {post.excerpt ? <p className="text-xl leading-relaxed text-slate-600">{post.excerpt}</p> : null}
          <div className={post.excerpt ? 'mt-12' : ''}>
            <ArticleBody html={body} />
          </div>
        </div>

        {blocks.length > 0 ? <PageBlocksRenderer blocks={blocks} /> : null}
      </article>
    </>
  )
}
