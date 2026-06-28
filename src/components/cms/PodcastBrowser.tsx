'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { PodcastCard } from '@/components/cms/PodcastCard'
import type { PodcastCardData } from '@/lib/cms/collectionRepository'

const PAGE_SIZE = 9
const MAX_TOPIC_CHIPS = 12

/**
 * Client-side archive browser for the /podcasts hub — instant search, topic
 * filtering, and incremental "load more". Built to stay fast as the episode
 * count grows: filtering happens over the already-loaded set, no round-trips.
 */
export function PodcastBrowser({ episodes }: { episodes: PodcastCardData[] }) {
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState<string | null>(null)
  const [visible, setVisible] = useState(PAGE_SIZE)

  const topics = useMemo(() => {
    const counts = new Map<string, number>()
    for (const e of episodes) for (const t of e.topics) counts.set(t, (counts.get(t) ?? 0) + 1)
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_TOPIC_CHIPS)
      .map(([t]) => t)
  }, [episodes])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return episodes.filter((e) => {
      if (topic && !e.topics.includes(topic)) return false
      if (!needle) return true
      const haystack = `${e.title} ${e.summary} ${e.podcastName ?? ''} ${e.topics.join(' ')}`.toLowerCase()
      return haystack.includes(needle)
    })
  }, [episodes, query, topic])

  // Reset the reveal window whenever the result set changes.
  useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [query, topic])

  const shown = filtered.slice(0, visible)
  const hasFilters = query.trim().length > 0 || topic !== null

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search episodes…"
            aria-label="Search episodes"
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#f16610]/50 focus:ring-2 focus:ring-[#f16610]/15"
          />
        </label>
        <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
          {filtered.length} {filtered.length === 1 ? 'episode' : 'episodes'}
        </span>
      </div>

      {topics.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTopic(null)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              topic === null
                ? 'bg-[#f16610] text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-[#f16610]/40 hover:text-slate-900'
            }`}
          >
            All topics
          </button>
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic((cur) => (cur === t ? null : t))}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                topic === t
                  ? 'bg-[#f16610] text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-[#f16610]/40 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center">
          <p className="text-slate-600">No episodes match your search.</p>
          {hasFilters ? (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setTopic(null)
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#f16610] hover:text-[#b3470a]"
            >
              <X className="h-4 w-4" aria-hidden />
              Clear filters
            </button>
          ) : null}
        </div>
      ) : (
        <>
          <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((episode) => (
              <li key={episode.slug}>
                <PodcastCard episode={episode} />
              </li>
            ))}
          </ul>

          {visible < filtered.length ? (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#f16610]/40 hover:text-slate-900"
              >
                Load more episodes
                <span className="font-mono text-xs text-slate-400">
                  {filtered.length - visible} left
                </span>
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
