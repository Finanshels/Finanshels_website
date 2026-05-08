import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { BlogPost } from '@/lib/cms/schemas/blog'

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group relative flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-[#f16610]/30 hover:shadow-md">
      <time className="text-xs font-medium uppercase tracking-wider text-slate-400" dateTime={post.publishedAt.toISOString()}>
        {formatDate(post.publishedAt)}
      </time>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-900 group-hover:text-[#f16610]">
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </h2>
      {post.excerpt ? <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{post.excerpt}</p> : null}
      {post.authorName ? <p className="mt-4 text-xs text-slate-500">By {post.authorName}</p> : null}
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#f16610]">
        Read article
        <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      </span>
    </article>
  )
}
