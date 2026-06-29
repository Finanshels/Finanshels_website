import Image from 'next/image'
import Link from 'next/link'
import { Users, User } from 'lucide-react'
import { CollectionHubHeader } from '@/components/cms/CollectionHubHeader'
import { AuthorSocialLinks } from '@/components/cms/authors/AuthorSocialLinks'
import { DevCmsBanner } from '@/components/cms/DevCmsBanner'
import { isCmsConfigured } from '@/lib/cms/config'
import { listPublishedAuthors } from '@/lib/cms/authorsRepository'

export const revalidate = 300

export const metadata = {
  title: 'Authors',
  description:
    'The Finanshels team behind our guides, articles, and webinars — finance, tax, and compliance specialists for UAE founders and growth companies.',
  alternates: { canonical: '/authors' },
  openGraph: {
    title: 'Finanshels Authors',
    description: 'The finance, tax, and compliance specialists behind Finanshels content.',
    url: '/authors',
    type: 'website',
  },
}

export default async function AuthorsHubPage() {
  const authors = isCmsConfigured() ? await listPublishedAuthors() : []

  return (
    <main className="bg-gradient-to-b from-white to-slate-50">
      <CollectionHubHeader
        eyebrow="Authors"
        title="The people behind Finanshels content"
        subtitle="Finance, tax, and compliance specialists writing the guides, articles, and webinars that help UAE founders stay compliant and grow."
        cta={{ href: '/blog', label: 'Browse the blog' }}
      />
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
        {!isCmsConfigured() ? (
          <div className="mt-10">
            <DevCmsBanner />
          </div>
        ) : authors.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/60 py-20 text-center">
            <Users className="size-10 text-slate-300" />
            <p className="text-slate-500">No authors published yet — check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {authors.map((author) => (
              <div
                key={author.slug}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-[#f16610]/40 hover:shadow-sm"
              >
                <Link href={`/author/${author.slug}`} className="flex items-center gap-4">
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-[#f16610]/10 ring-1 ring-[#f16610]/20">
                    {author.photo ? (
                      <Image src={author.photo} alt={author.name} fill sizes="56px" className="object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center text-[#b3470a]">
                        <User className="size-6" />
                      </span>
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-slate-900">{author.name}</span>
                    {author.jobTitle ? <span className="block text-sm text-slate-500">{author.jobTitle}</span> : null}
                  </span>
                </Link>
                {author.shortBio ? (
                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600">{author.shortBio}</p>
                ) : null}
                <AuthorSocialLinks socials={author.socials} name={author.name} className="mt-4" />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
