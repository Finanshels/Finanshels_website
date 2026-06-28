import Image from 'next/image'
import Link from 'next/link'
import { Headphones, Play } from 'lucide-react'
import type { PodcastCardData } from '@/lib/cms/collectionRepository'

function formatDate(d: Date): string {
  // Fixed locale + UTC so server and client render identically (this card is used
  // inside the client-side PodcastBrowser; a system-timezone format would mismatch).
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
}

export function PodcastCard({ episode }: { episode: PodcastCardData }) {
  const meta = [
    episode.episodeNumber ? `Ep. ${episode.episodeNumber}` : null,
    episode.podcastName,
  ]
    .filter(Boolean)
    .join('  ·  ')

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-[#f16610]/40 hover:shadow-lg hover:shadow-slate-900/5">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {episode.heroImage ? (
          <Image
            src={episode.heroImage}
            alt={episode.title}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
            <Headphones className="h-10 w-10 text-white/60" aria-hidden />
          </div>
        )}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700 backdrop-blur">
          <Play className="h-3 w-3 fill-[#f16610] text-[#f16610]" aria-hidden />
          Listen
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {meta ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#b3470a]">{meta}</p>
        ) : null}

        <h3 className="mt-2 text-balance text-lg font-bold leading-snug tracking-tight text-slate-900 group-hover:text-[#f16610]">
          <Link href={`/content/podcasts/${episode.slug}`} className="after:absolute after:inset-0">
            {episode.title}
          </Link>
        </h3>

        {episode.summary ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{episode.summary}</p>
        ) : null}

        <div className="mt-5 flex-1" />

        <div className="flex items-center gap-2 border-t border-slate-100 pt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-slate-400">
          {episode.publishedAt ? (
            <time dateTime={episode.publishedAt.toISOString()}>{formatDate(episode.publishedAt)}</time>
          ) : null}
          {episode.publishedAt && episode.duration ? <span className="text-slate-300">·</span> : null}
          {episode.duration ? <span>{episode.duration}</span> : null}
        </div>
      </div>
    </article>
  )
}
