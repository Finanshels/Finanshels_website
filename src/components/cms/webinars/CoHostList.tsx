import Image from 'next/image'
import { Users } from 'lucide-react'
import type { WebinarCoHost } from '@/lib/cms/webinarsRepository'

/**
 * FIX-068: co-host / partner row. Renders one or many partner orgs (logo +
 * name + optional role). Used in the webinar meta panel in place of the old
 * single "In partnership with X" line.
 */
export function CoHostList({ coHosts }: { coHosts: WebinarCoHost[] }) {
  if (coHosts.length === 0) return null

  return (
    <div className="flex items-start gap-2.5 text-slate-700">
      <Users className="mt-0.5 size-4 shrink-0 text-slate-400" />
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">In partnership with</p>
        <ul className="mt-1.5 space-y-1.5">
          {coHosts.map((h) => (
            <li key={`${h.name}-${h.role ?? ''}`} className="flex items-center gap-2">
              {h.logoUrl ? (
                <span className="relative size-5 shrink-0 overflow-hidden rounded bg-white">
                  <Image src={h.logoUrl} alt={h.name} fill sizes="20px" className="object-contain" />
                </span>
              ) : null}
              <span className="text-sm text-slate-700">{h.name}</span>
              {h.role ? <span className="text-xs text-slate-400">· {h.role}</span> : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
