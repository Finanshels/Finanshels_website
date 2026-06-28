import Image from 'next/image'
import { ExternalLink, User } from 'lucide-react'
import type { WebinarSpeaker } from '@/lib/cms/webinarsRepository'

/** Speaker cards, resolved from the `speakerRefs` team_members relation. */
export function SpeakerList({ speakers }: { speakers: WebinarSpeaker[] }) {
  if (speakers.length === 0) return null
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {speakers.map((s) => (
        <div
          key={`${s.name}-${s.title ?? ''}`}
          className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4"
        >
          <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-slate-100">
            {s.photo ? (
              <Image src={s.photo} alt={s.name} fill sizes="56px" className="object-cover" />
            ) : (
              <span className="flex h-full items-center justify-center text-slate-400">
                <User className="size-6" />
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 font-semibold text-slate-900">
              {s.name}
              {s.linkedin ? (
                <a
                  href={s.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 transition hover:text-blue-700"
                  aria-label={`${s.name} on LinkedIn`}
                >
                  <ExternalLink className="size-4" />
                </a>
              ) : null}
            </p>
            {s.title ? <p className="text-sm text-slate-500">{s.title}</p> : null}
            {s.bio ? <p className="mt-1 line-clamp-3 text-sm text-slate-600">{s.bio}</p> : null}
          </div>
        </div>
      ))}
    </div>
  )
}
