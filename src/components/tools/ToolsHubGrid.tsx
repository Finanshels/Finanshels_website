'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

export interface HubTool {
  slug: string
  toolName: string
  cardDescription: string
  hubGroup: 'Calculators' | 'Benchmarks & Checks'
}

const GROUPS: HubTool['hubGroup'][] = ['Calculators', 'Benchmarks & Checks']

export function ToolsHubGrid({ tools }: { tools: HubTool[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return tools
    return tools.filter(
      (t) => t.toolName.toLowerCase().includes(q) || t.cardDescription.toLowerCase().includes(q)
    )
  }, [tools, query])

  return (
    <div>
      <input
        type="search"
        placeholder="Search tools…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-md rounded-lg border border-slate-300 px-4 py-2.5"
      />

      {GROUPS.map((group) => {
        const items = filtered.filter((t) => t.hubGroup === group)
        if (items.length === 0) return null
        return (
          <section key={group} className="mt-10">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#f16610]">{group}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#f16610]/50 hover:shadow-sm"
                >
                  <p className="font-semibold text-slate-900">{t.toolName}</p>
                  <p className="mt-1 text-sm text-slate-600">{t.cardDescription}</p>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
