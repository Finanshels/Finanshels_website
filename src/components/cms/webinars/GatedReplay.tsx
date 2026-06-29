'use client'

import { useState } from 'react'
import { Lock, PlayCircle } from 'lucide-react'
import { ReplayEmbed } from './ReplayEmbed'
import { WebinarRegisterForm } from './WebinarRegisterForm'

/**
 * FIX-068: replay gated behind registration. Shows a locked poster + the
 * webinar registration form; once registration succeeds (reusing the existing
 * `/api/webinars/register` + Zoho/email pipeline) the full replay is revealed.
 * For un-gated replays the page renders <ReplayEmbed> directly instead.
 */
export function GatedReplay({
  url,
  title,
  webinarSlug,
  teaserUrl,
}: {
  url: string
  title: string
  webinarSlug: string
  teaserUrl?: string | null
}) {
  const [revealed, setRevealed] = useState(false)

  if (revealed) return <ReplayEmbed url={url} title={title} />

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm">
        {teaserUrl ? (
          <ReplayEmbed url={teaserUrl} title={`${title} — preview`} />
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 text-white/80">
            <Lock className="size-9" />
            <p className="text-sm font-medium">Register to watch the full replay</p>
          </div>
        )}
      </div>
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          <PlayCircle className="size-4" />
          Free — register to watch
        </div>
        <WebinarRegisterForm
          webinarSlug={webinarSlug}
          webinarTitle={title}
          submitLabel="Watch the replay"
          onRegistered={() => setRevealed(true)}
        />
      </div>
    </div>
  )
}
