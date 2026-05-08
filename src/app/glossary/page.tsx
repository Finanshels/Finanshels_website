import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { DevCmsBanner } from '@/components/cms/DevCmsBanner'
import { GlossarySearch } from '@/components/cms/GlossarySearch'
import { isCmsConfigured } from '@/lib/cms/config'
import { listPublishedGlossaryTerms } from '@/lib/cms/glossaryRepository'

export const revalidate = 600

export default async function GlossaryIndexPage() {
  const terms = await listPublishedGlossaryTerms().catch((err) => {
    console.warn('[glossary] listing failed:', err instanceof Error ? err.message : err)
    return []
  })
  const cmsReady = isCmsConfigured()

  return (
    <>
      <DevCmsBanner />
      <div className="border-b border-slate-100 bg-[#fffaf6]">
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-28 sm:px-10 lg:px-16 lg:pb-16 lg:pt-32">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#f16610] hover:text-[#c14e0d]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to blog
          </Link>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Glossary</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Plain-language definitions for finance and compliance in MENA—synced from your Firestore CMS on GCP.
          </p>
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
            No published terms yet. Add documents to <code className="font-mono text-sm">glossary_terms</code> with{' '}
            <code className="font-mono text-sm">status: &quot;published&quot;</code>.
          </p>
        ) : (
          <GlossarySearch terms={terms} />
        )}
      </div>
    </>
  )
}
