import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BlogCard } from '@/components/cms/BlogCard'
import { DevCmsBanner } from '@/components/cms/DevCmsBanner'
import { isCmsConfigured } from '@/lib/cms/config'
import { listPublishedBlogPosts } from '@/lib/cms/blogRepository'

export const revalidate = 300

export default async function BlogIndexPage() {
  const posts = await listPublishedBlogPosts()
  const cmsReady = isCmsConfigured()

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
        ) : posts.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-slate-200 px-8 py-16 text-center text-slate-600">
            No published posts yet. Publish documents in the <code className="font-mono text-sm">blog_posts</code> collection
            with <code className="font-mono text-sm">status: &quot;published&quot;</code>.
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
      </div>
    </>
  )
}
