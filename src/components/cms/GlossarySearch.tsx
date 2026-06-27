'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import type { GlossaryTerm } from '@/lib/cms/schemas/glossary'
import { GlossaryCard } from './GlossaryCard'

export function GlossarySearch({ terms }: { terms: GlossaryTerm[] }) {
  const [q, setQ] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = useMemo(
    () =>
      Array.from(
        new Set(terms.map((t) => t.term_category).filter(Boolean) as string[])
      ).sort(),
    [terms]
  )

  const filtered = useMemo(() => {
    let result = terms
    if (activeCategory) result = result.filter((t) => t.term_category === activeCategory)
    const s = q.trim().toLowerCase()
    if (s) {
      result = result.filter(
        (t) =>
          t.term.toLowerCase().includes(s) ||
          t.slug.toLowerCase().includes(s) ||
          t.definition.toLowerCase().includes(s)
      )
    }
    return result
  }, [q, activeCategory, terms])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative max-w-xl flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search terms…"
            className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm outline-none ring-[#f16610]/20 transition focus:border-[#f16610]/50 focus:ring-4"
            aria-label="Filter glossary terms"
          />
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              !activeCategory
                ? 'bg-slate-900 text-white'
                : 'border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center text-slate-600">
          No matches.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {filtered.map((t) => (
            <li key={t.slug}>
              <GlossaryCard term={t} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
