import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BlogCard } from '@/components/cms/BlogCard'
import { DevCmsBanner } from '@/components/cms/DevCmsBanner'
import { isCmsConfigured } from '@/lib/cms/config'
import { listPublishedBlogPosts } from '@/lib/cms/blogRepository'

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

const CATEGORY_LABELS: Record<string, string> = {
  'corporate-tax': 'Corporate Tax',
  'vat': 'VAT',
  'transfer-pricing': 'Transfer Pricing',
  'audit': 'Audit',
  'accounting': 'Accounting',
  'bookkeeping': 'Bookkeeping',
  'payroll': 'Payroll',
  'compliance': 'Compliance',
  'advisory': 'Advisory',
  'cfo-services': 'CFO Services',
  'esr-aml-ubo': 'ESR / AML / UBO',
  'regulatory-updates': 'Regulatory Updates',
  'founder-stories': 'Founder Stories',
  'how-to-guides': 'How-to Guides',
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const activeCategory = category && CATEGORY_LABELS[category] ? category : null

  const allPosts = await listPublishedBlogPosts().catch((err) => {
    console.warn('[blog] listing failed:', err instanceof Error ? err.message : err)
    return []
  })
  const cmsReady = isCmsConfigured()

  const posts = activeCategory
    ? allPosts.filter((p) => p.blog_category === activeCategory)
    : allPosts

  // Only show categories that have at least one published post
  const usedCategories = Array.from(
    new Set(allPosts.map((p) => p.blog_category).filter(Boolean) as string[])
  ).filter((c) => c in CATEGORY_LABELS)

  return (
    <>
      <DevCmsBanner />
      <div className="bg-gradient-to-b from-slate-950 to-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-36 sm:px-10 lg:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Insights</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Blog</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            Sharp takes on startup finance, tax, and operations—built for teams scaling across MENA.
          </p>
          <Link
            href="/glossary"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#ffb088] hover:text-white"
          >
            Browse the glossary
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-16">
        {!cmsReady ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50/80 px-8 py-16 text-center">
            <p className="text-lg font-medium text-slate-800">Production content loads from Firestore on GCP.</p>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
              On Vercel, set the Firebase Admin service account variables. Until then, this index stays empty by design so you never ship placeholder copy as real content.
            </p>
          </div>
        ) : allPosts.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-slate-200 px-8 py-16 text-center text-slate-600">
            No published posts yet. Publish documents in the <code className="font-mono text-sm">blog_posts</code> collection
            with <code className="font-mono text-sm">status: &quot;published&quot;</code>.
          </p>
        ) : (
          <>
            {usedCategories.length > 0 && (
              <div className="mb-10 flex flex-wrap gap-2">
                <Link
                  href="/blog"
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    !activeCategory
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900'
                  }`}
                >
                  All
                </Link>
                {usedCategories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/blog?category=${cat}`}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                      activeCategory === cat
                        ? 'bg-slate-900 text-white'
                        : 'border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </Link>
                ))}
              </div>
            )}

            {posts.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-slate-200 px-8 py-16 text-center text-slate-500">
                No posts in this category yet.
              </p>
            ) : (
              <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <BlogCard post={post} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  )
}
