import { FileText } from 'lucide-react'
import { EbookCard } from '@/components/guides/EbookCard'
import { DevCmsBanner } from '@/components/cms/DevCmsBanner'
import { isCmsConfigured } from '@/lib/cms/config'
import { listPublishedEbooks } from '@/lib/cms/ebooksRepository'
import { CollectionHubHeader } from '@/components/cms/CollectionHubHeader'

export const revalidate = 300

export const metadata = {
  title: 'Free finance resources & guides',
  description:
    'Downloadable guides, templates, and ebooks for UAE founders and finance teams — corporate tax, VAT, bookkeeping, and compliance, free from Finanshels.',
  alternates: { canonical: '/guides' },
  openGraph: {
    title: 'Finanshels Resources',
    description:
      'Downloadable guides, templates, and ebooks for UAE founders and finance teams — corporate tax, VAT, bookkeeping, and compliance.',
    url: '/guides',
    type: 'website',
  },
}

export default async function ResourcesHubPage() {
  const ebooks = isCmsConfigured() ? await listPublishedEbooks(60) : []

  return (
    <main className="bg-gradient-to-b from-white to-slate-50">
      <CollectionHubHeader
        eyebrow="Resources"
        title="Free guides for founders & finance teams"
        subtitle="Practical, UAE-specific playbooks on corporate tax, VAT, bookkeeping, and compliance — written by the Finanshels team and free to download."
        cta={{ href: '/blog', label: 'Browse the blog' }}
      />
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16">

        {!isCmsConfigured() ? (
          <div className="mt-10">
            <DevCmsBanner />
          </div>
        ) : ebooks.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/60 py-20 text-center">
            <FileText className="size-10 text-slate-300" />
            <p className="text-slate-500">No resources published yet — check back soon.</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ebooks.map((ebook) => (
              <EbookCard key={ebook.slug} ebook={ebook} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
