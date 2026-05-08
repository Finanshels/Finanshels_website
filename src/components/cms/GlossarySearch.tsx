'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import type { GlossaryTerm } from '@/lib/cms/schemas/glossary'
import { GlossaryCard } from './GlossaryCard'

export function GlossarySearch({ terms }: { terms: GlossaryTerm[] }) {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return terms
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(s) ||
        t.slug.toLowerCase().includes(s) ||
        t.definition.toLowerCase().includes(s)
    )
  }, [q, terms])

  return (
    <div className="space-y-8">
      <div className="relative max-w-xl">
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
      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center text-slate-600">No matches.</p>
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
