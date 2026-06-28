import Image from 'next/image'
import Link from 'next/link'
import { Download, FileText, Lock } from 'lucide-react'
import type { EbookCardData } from '@/lib/cms/ebooksRepository'

export function EbookCard({ ebook }: { ebook: EbookCardData }) {
  const badges = [ebook.format?.toUpperCase(), ebook.pageCount ? `${ebook.pageCount} pages` : null].filter(
    Boolean
  ) as string[]

  return (
    <Link
      href={`/guides/${ebook.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-[#f16610]/40 hover:shadow-xl hover:shadow-slate-900/5"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-slate-100">
        {ebook.coverImage ? (
          <Image
            src={ebook.coverImage}
            alt={ebook.title}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            <FileText className="size-10" />
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur">
          {ebook.gated ? <Lock className="size-3" /> : <Download className="size-3" />}
          {ebook.gated ? 'Gated' : 'Free'}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {badges.length > 0 ? (
          <div className="mb-2 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500"
              >
                {badge}
              </span>
            ))}
          </div>
        ) : null}

        <h3 className="text-lg font-semibold leading-snug text-slate-900 group-hover:text-[#f16610]">
          {ebook.title}
        </h3>

        {ebook.summary ? <p className="mt-2 line-clamp-3 text-sm text-slate-600">{ebook.summary}</p> : null}

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900">
          {ebook.gated ? 'Get the download' : 'Download free'}
          <Download className="size-4" />
        </span>
      </div>
    </Link>
  )
}
