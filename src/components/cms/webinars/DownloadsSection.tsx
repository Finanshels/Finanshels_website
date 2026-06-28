import Image from 'next/image'
import Link from 'next/link'
import { Download, FileText, Lock } from 'lucide-react'
import type { WebinarResource } from '@/lib/cms/webinarsRepository'

/**
 * Post-webinar downloads (slides, templates). Each resource is an `ebooks` doc,
 * so we link to its existing gated landing page at `/guides/[slug]` — that page
 * owns the email gate + server-side file delivery (FIX-048). The webinar replay
 * itself stays open; only these assets require an email.
 */
export function DownloadsSection({ resources }: { resources: WebinarResource[] }) {
  if (resources.length === 0) return null
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {resources.map((r) => (
        <Link
          key={r.slug}
          href={`/guides/${r.slug}`}
          className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
        >
          <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
            {r.coverImage ? (
              <Image src={r.coverImage} alt={r.title} fill sizes="64px" className="object-cover" />
            ) : (
              <span className="flex h-full items-center justify-center text-slate-400">
                <FileText className="size-6" />
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 font-semibold text-slate-900 group-hover:text-blue-700">{r.title}</p>
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-slate-500">
              {r.gated ? (
                <>
                  <Lock className="size-3" />
                  Free with email
                </>
              ) : (
                <>
                  <Download className="size-3" />
                  Free download
                </>
              )}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
