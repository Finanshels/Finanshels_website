import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { BlogCard } from '@/components/cms/BlogCard'
import { DevCmsBanner } from '@/components/cms/DevCmsBanner'
import { IndustryIcon } from '@/components/cms/IndustryIcon'
import { AuthorAvatar } from '@/components/cms/blog/AuthorAvatar'
import { isCmsConfigured, getSiteUrl } from '@/lib/cms/config'
import { listPublishedBlogPosts } from '@/lib/cms/blogRepository'
import { INDUSTRY_OPTION_MAP } from '@/lib/cms/industryOptions'
import { BLOG_CATEGORY_LABELS, blogCategoryLabel } from '@/lib/cms/blogTaxonomy'
import { estimateReadingMinutes } from '@/lib/cms/readingTime'
import type { BlogPost } from '@/lib/cms/schemas/blog'
import { CollectionHubHeader } from '@/components/cms/CollectionHubHeader'
import { safeJsonLd } from '@/lib/seo/safeJsonLd'
import { buildBreadcrumbList } from '@/lib/seo/breadcrumbList'

const ITEMLIST_LIMIT = 50

export const revalidate = 300

export const metadata = {
  title: 'Blog',
  description:
    'Sharp takes on startup finance, tax, and operations — built for teams scaling across MENA.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Finanshels Blog',
    description:
      'Sharp takes on startup finance, tax, and operations — built for teams scaling across MENA.',
    url: '/blog',
    type: 'website',
  },
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/** Large editorial feature for the most recent post in the current set. */
function LeadStory({ post }: { post: BlogPost }) {
  const categoryLabel = blogCategoryLabel(post.blog_category)
  const readingMinutes = estimateReadingMinutes(post.body)
  const image = post.card_image || post.featured_image || post.heroImageUrl || null
  const authorName = post.author ?? post.authorName ?? null

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group mb-12 block overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:border-[#f16610]/40 hover:shadow-xl hover:shadow-slate-900/5"
    >
      <div className="grid lg:grid-cols-2">
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 lg:aspect-auto lg:min-h-[360px]">
          {image ? (
            <Image
              src={String(image)}
              alt={post.featured_image_alt?.trim() || post.title}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">
                {categoryLabel ?? 'Finanshels'}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center p-8 lg:p-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#b3470a]">Latest</span>
            {categoryLabel ? (
              <span className="inline-flex rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                {categoryLabel}
              </span>
            ) : null}
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
              {readingMinutes} min read
            </span>
          </div>

          <h2 className="mt-4 text-balance text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 group-hover:text-[#f16610] sm:text-4xl">
            {post.title}
          </h2>

          {post.excerpt ? (
            <p className="mt-4 line-clamp-3 text-base leading-relaxed text-slate-600">{post.excerpt}</p>
          ) : null}

          <div className="mt-6 flex items-center gap-3">
            {authorName ? (
              <span className="flex items-center gap-2">
                <AuthorAvatar name={authorName} size="sm" />
                <span className="text-xs font-medium text-slate-500">{authorName}</span>
              </span>
            ) : null}
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-400">
              {formatDate(post.publishedAt)}
            </span>
          </div>

          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#f16610]">
            Read article
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; industry?: string }>
}) {
  const { category, industry } = await searchParams
  const activeCategory = category && BLOG_CATEGORY_LABELS[category] ? category : null
  const activeIndustry = industry && industry in INDUSTRY_OPTION_MAP ? industry : null

  const allPosts = await listPublishedBlogPosts().catch((err) => {
    console.warn('[blog] listing failed:', err instanceof Error ? err.message : err)
    return []
  })
  const cmsReady = isCmsConfigured()

  // Category + industry filter independently; a post must satisfy both active
  // filters. blog_industry is multi-value, so a post matches if it includes the
  // active industry.
  const posts = allPosts.filter(
    (p) =>
      (!activeCategory || p.blog_category === activeCategory) &&
      (!activeIndustry || (p.blog_industry ?? []).includes(activeIndustry))
  )

  // Only show filters that have at least one published post behind them.
  const usedCategories = Array.from(
    new Set(allPosts.map((p) => p.blog_category).filter(Boolean) as string[])
  ).filter((c) => c in BLOG_CATEGORY_LABELS)
  const usedIndustries = Array.from(
    new Set(allPosts.flatMap((p) => p.blog_industry ?? []))
  ).filter((v) => v in INDUSTRY_OPTION_MAP)

  // Build a /blog href, preserving the *other* active filter. Pass `null` to
  // clear a filter, omit a key to keep its current value.
  const buildHref = (next: { category?: string | null; industry?: string | null }) => {
    const cat = next.category !== undefined ? next.category : activeCategory
    const ind = next.industry !== undefined ? next.industry : activeIndustry
    const params = new URLSearchParams()
    if (cat) params.set('category', cat)
    if (ind) params.set('industry', ind)
    const qs = params.toString()
    return qs ? `/blog?${qs}` : '/blog'
  }

  const [lead, ...rest] = posts

  const site = getSiteUrl()
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'The Finanshels Blog',
    description:
      'Sharp takes on startup finance, tax, and operations — built for teams scaling across MENA.',
    url: `${site}/blog`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: allPosts.slice(0, ITEMLIST_LIMIT).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.title,
        url: `${site}/blog/${p.slug}`,
      })),
    },
  }
  const breadcrumbLd = buildBreadcrumbList([{ name: 'Blog', path: '/blog' }])

  return (
    <div className="bg-[#faf8f4]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }} />
      <DevCmsBanner />

      <CollectionHubHeader
        eyebrow="Insights · MENA finance"
        title="The Finanshels Blog"
        subtitle="Sharp takes on startup finance, tax, and operations—built for teams scaling across MENA."
        cta={{ href: '/glossary', label: 'Browse the glossary' }}
      />

      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-12">
        {!cmsReady ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-8 py-16 text-center">
            <p className="text-lg font-medium text-slate-800">Production content loads from Firestore on GCP.</p>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
              On Vercel, set the Firebase Admin service account variables. Until then, this index stays empty by design so you never ship placeholder copy as real content.
            </p>
          </div>
        ) : allPosts.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center text-slate-600">
            No published posts yet. Publish documents in the <code className="font-mono text-sm">blog_posts</code> collection
            with <code className="font-mono text-sm">status: &quot;published&quot;</code>.
          </p>
        ) : (
          <>
            {usedCategories.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                <Link
                  href={buildHref({ category: null })}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    !activeCategory
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'
                  }`}
                >
                  All
                </Link>
                {usedCategories.map((cat) => (
                  <Link
                    key={cat}
                    href={buildHref({ category: cat })}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                      activeCategory === cat
                        ? 'bg-slate-900 text-white'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {BLOG_CATEGORY_LABELS[cat]}
                  </Link>
                ))}
              </div>
            )}

            {usedIndustries.length > 0 && (
              <div className="mb-10 flex flex-wrap gap-2">
                <Link
                  href={buildHref({ industry: null })}
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
                      href={buildHref({ industry: value })}
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

            {posts.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center text-slate-500">
                No posts match this filter yet.
              </p>
            ) : (
              <>
                {lead ? <LeadStory post={lead} /> : null}
                {rest.length > 0 ? (
                  <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((post) => (
                      <li key={post.slug}>
                        <BlogCard post={post} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
