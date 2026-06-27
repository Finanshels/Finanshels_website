'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import type { SectionFieldDef } from '@/lib/landing-pages/sectionCatalog'
import { LANDING_ICON_GROUPS } from '@/lib/landing-pages/iconSet'
import { LucideIcon } from './lucideClient'

export function IconField({
  field,
  value,
  onChange,
}: {
  field: SectionFieldDef
  value: unknown
  onChange: (next: unknown) => void
}) {
  const current = typeof value === 'string' ? value : ''
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return LANDING_ICON_GROUPS
    return LANDING_ICON_GROUPS.map((g) => ({
      ...g,
      icons: g.icons.filter((name) => name.includes(q)),
    })).filter((g) => g.icons.length > 0)
  }, [query])

  return (
    <div className="block text-sm" ref={rootRef}>
      <span className="font-medium text-slate-800">{field.label}</span>
      <div className="relative mt-1">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-left hover:border-slate-400"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-700">
            <LucideIcon name={current || 'circle-dashed'} className="h-4 w-4" />
          </span>
          <span className="flex-1 truncate text-sm text-slate-700">{current || 'Choose an icon'}</span>
          {current ? (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation()
                onChange('')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation()
                  onChange('')
                }
              }}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Clear icon"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          ) : null}
        </button>

        {open ? (
          <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
            <label className="relative block">
              <span className="sr-only">Search icons</span>
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search icons…"
                autoFocus
                className="w-full rounded-lg border border-slate-200 py-1.5 pl-9 pr-2 text-sm outline-none focus:border-violet-400"
              />
            </label>
            <div className="mt-2 max-h-64 overflow-y-auto pr-1">
              {groups.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-500">No icons match “{query}”.</p>
              ) : (
                groups.map((g) => (
                  <div key={g.label} className="mb-3">
                    <p className="mb-1 px-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{g.label}</p>
                    <div className="grid grid-cols-6 gap-1">
                      {g.icons.map((name) => (
                        <button
                          key={name}
                          type="button"
                          title={name}
                          onClick={() => {
                            onChange(name)
                            setOpen(false)
                          }}
                          className={`flex h-9 items-center justify-center rounded-lg border text-slate-700 transition hover:bg-violet-50 ${
                            name === current ? 'border-violet-400 bg-violet-50' : 'border-transparent'
                          }`}
                        >
                          <LucideIcon name={name} className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : null}
      </div>
      {field.description ? <p className="mt-1 text-xs text-slate-500">{field.description}</p> : null}
    </div>
  )
}
