import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { BlogPost } from '@/lib/cms/schemas/blog'
import { AuthorAvatar } from '@/components/cms/blog/AuthorAvatar'
import { blogCategoryLabel } from '@/lib/cms/blogTaxonomy'
import { estimateReadingMinutes } from '@/lib/cms/readingTime'

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function BlogCard({ post }: { post: BlogPost }) {
  const categoryLabel = blogCategoryLabel(post.blog_category)
  const readingMinutes = estimateReadingMinutes(post.body)
  const image = post.card_image || post.featured_image || post.heroImageUrl || null
  const authorName = post.author ?? post.authorName ?? null

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-[#f16610]/40 hover:shadow-lg hover:shadow-slate-900/5">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {image ? (
          <Image
            src={String(image)}
            alt={post.featured_image_alt?.trim() || post.title}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/70">
              {categoryLabel ?? 'Finanshels'}
            </span>
          </div>
        )}
        {image && categoryLabel ? (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700 backdrop-blur">
            {categoryLabel}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-slate-400">
          <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
          <span className="text-slate-300">·</span>
          <span>{readingMinutes} min</span>
        </div>

        <h2 className="mt-3 text-lg font-bold leading-snug tracking-tight text-slate-900 group-hover:text-[#f16610]">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h2>

        {post.excerpt ? (
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
        ) : (
          <div className="flex-1" />
        )}

        <div className="mt-4 flex items-center justify-between">
          {authorName ? (
            <span className="flex items-center gap-2">
              <AuthorAvatar name={authorName} size="sm" />
              <span className="text-xs font-medium text-slate-500">{authorName}</span>
            </span>
          ) : (
            <span />
          )}
          <ArrowUpRight
            className="h-4 w-4 text-[#f16610] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </div>
      </div>
    </article>
  )
}
