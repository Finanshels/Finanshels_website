import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { DevCmsBanner } from '@/components/cms/DevCmsBanner'
import { GlossarySearch } from '@/components/cms/GlossarySearch'
import { isCmsConfigured } from '@/lib/cms/config'
import { listPublishedGlossaryTerms } from '@/lib/cms/glossaryRepository'

export const revalidate = 600

export const metadata = {
  title: 'Finance & Tax Glossary',
  description:
    'Clear definitions of UAE finance, tax, accounting, and compliance terms — from VAT and corporate tax to bookkeeping and audit.',
  alternates: { canonical: '/glossary' },
  openGraph: {
    title: 'Finanshels Finance & Tax Glossary',
    description:
      'Clear definitions of UAE finance, tax, accounting, and compliance terms.',
    url: '/glossary',
    type: 'website',
  },
}

export default async function GlossaryIndexPage() {
  const terms = await listPublishedGlossaryTerms().catch((err) => {
    console.warn('[glossary] listing failed:', err instanceof Error ? err.message : err)
    return []
  })
  const cmsReady = isCmsConfigured()

  return (
    <>
      <DevCmsBanner />
      <div className="bg-gradient-to-b from-slate-950 to-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-36 sm:px-10 lg:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Reference</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Glossary</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            Running a business in the UAE means navigating a financial vocabulary that can feel overwhelming — especially if accounting is not your background. Bookmark this page.
          </p>
          <Link
            href="/blog"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#ffb088] hover:text-white"
          >
            Browse the blog
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10 lg:px-16">
        {!cmsReady ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50/80 px-8 py-16 text-center">
            <p className="text-lg font-medium text-slate-800">Terms load from Firestore.</p>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
              Configure Firebase Admin env vars on Vercel (see <code className="font-mono text-xs">docs/cms-firestore.md</code>). Local
              search UI appears once terms are available.
            </p>
          </div>
        ) : terms.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-slate-200 px-8 py-16 text-center text-slate-600">
            Ops something went wrong. No published terms found in <code className="font-mono text-sm">glossary</code> with{' '}
            <code className="font-mono text-sm">Please check back later.</code>.
          </p>
        ) : (
          <GlossarySearch terms={terms} />
        )}
      </div>
    </>
  )
}
