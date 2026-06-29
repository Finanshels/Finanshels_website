import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowLeft, User } from 'lucide-react'
import { AuthorSocialLinks } from '@/components/cms/authors/AuthorSocialLinks'
import { getSiteUrl } from '@/lib/cms/config'
import { getPublishedAuthorBySlug } from '@/lib/cms/authorsRepository'
import { listPublishedPostsByAuthor } from '@/lib/cms/blogRepository'
import { safeJsonLd } from '@/lib/seo/safeJsonLd'

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const author = await getPublishedAuthorBySlug(slug)
  if (!author) return { title: 'Author' }

  const title = author.jobTitle ? `${author.name} — ${author.jobTitle}` : author.name
  const description =
    author.shortBio ||
    author.fullBio ||
    `${author.name}${author.jobTitle ? `, ${author.jobTitle}` : ''} at Finanshels.`
  const url = `${getSiteUrl()}/author/${author.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'profile',
      images: author.photo ? [author.photo] : undefined,
    },
  }
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function AuthorProfilePage({ params }: Props) {
  const { slug } = await params
  const author = await getPublishedAuthorBySlug(slug)
  if (!author) notFound()

  const posts = await listPublishedPostsByAuthor(author.slug)
  const site = getSiteUrl()
  const url = `${site}/author/${author.slug}`
  const bio = author.fullBio || author.shortBio

  const sameAs = [
    author.socials.linkedin,
    author.socials.twitter,
    author.socials.instagram,
    author.socials.website,
  ].filter((v): v is string => Boolean(v))

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.jobTitle || undefined,
    description: author.shortBio || author.fullBio || undefined,
    image: author.photo || undefined,
    url,
    worksFor: { '@type': 'Organization', name: 'Finanshels', url: site },
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  }

  return (
    <main className="bg-[#faf8f4] pb-24 pt-32 sm:pt-36">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- emitting JSON-LD for crawlers
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <Link
          href="/authors"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-[#f16610]"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          All authors
        </Link>

        <header className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-full bg-[#f16610]/10 ring-1 ring-[#f16610]/20">
            {author.photo ? (
              <Image src={author.photo} alt={author.name} fill sizes="96px" className="object-cover" priority />
            ) : (
              <span className="flex h-full items-center justify-center text-[#b3470a]">
                <User className="size-10" />
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{author.name}</h1>
            {author.jobTitle ? <p className="mt-1.5 text-lg text-slate-600">{author.jobTitle}</p> : null}
            <AuthorSocialLinks socials={author.socials} name={author.name} size={18} className="mt-3" />
          </div>
        </header>

        {bio ? <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-slate-700">{bio}</p> : null}

        {author.expertiseTags.length > 0 ? (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {author.expertiseTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {posts.length > 0 ? (
          <section className="mt-14 border-t border-slate-200 pt-10">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400">
              Articles by {author.name}
            </h2>
            <ul className="mt-6 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="group flex items-start gap-4 p-5 transition hover:bg-slate-50">
                    {post.image ? (
                      <span className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:block">
                        <Image src={post.image} alt={post.title} fill sizes="96px" className="object-cover" />
                      </span>
                    ) : null}
                    <span className="min-w-0">
                      <span className="block font-semibold text-slate-900 group-hover:text-[#f16610]">{post.title}</span>
                      {post.excerpt ? (
                        <span className="mt-1 line-clamp-2 block text-sm text-slate-500">{post.excerpt}</span>
                      ) : null}
                      <span className="mt-1.5 block font-mono text-[11px] text-slate-400">{formatDate(post.publishedAt)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  )
}
