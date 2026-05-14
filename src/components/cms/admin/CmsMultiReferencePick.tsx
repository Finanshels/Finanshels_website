'use client'

import { useMemo, useState } from 'react'

type Option = { id: string; label: string }

/**
 * Multi-reference editor: searchable checkbox list (no comma-separated IDs).
 * All options stay mounted; search only toggles visibility so checked state is not lost.
 */
export function CmsMultiReferencePick({
  name,
  label,
  options,
  valueCsv,
}: {
  name: string
  label: string
  options: Option[]
  valueCsv: string
}) {
  const selectedIds = useMemo(() => {
    const s = valueCsv
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
    return new Set(s)
  }, [valueCsv])

  const [q, setQ] = useState('')

  const mergedOptions = useMemo(() => {
    const byId = new Map(options.map((o) => [o.id, o]))
    const out: Option[] = [...options]
    for (const id of selectedIds) {
      if (!byId.has(id)) {
        out.unshift({ id, label: `«${id}» (missing from list)` })
      }
    }
    return out
  }, [options, selectedIds])

  const match = (o: Option) => {
    const qq = q.trim().toLowerCase()
    if (!qq) return true
    return o.id.toLowerCase().includes(qq) || o.label.toLowerCase().includes(qq)
  }

  // FIX-018: aria-live count announces filter results to screen readers.
  const visibleCount = mergedOptions.filter(match).length

  const inputCls =
    'w-full rounded-xl border border-[#e8dccf] bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'

  return (
    <div className="mt-2 space-y-2">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by title or id…"
        className={inputCls}
        autoComplete="off"
        aria-label={`Filter ${label}`}
      />
      <span aria-live="polite" className="sr-only">
        {q.trim() ? `${visibleCount} ${visibleCount === 1 ? 'result' : 'results'}` : ''}
      </span>
      <fieldset className="max-h-56 space-y-0.5 overflow-y-auto rounded-xl border border-[#e8dccf] bg-white p-2">
        <legend className="sr-only">{label}</legend>
        {mergedOptions.length === 0 ? (
          <p className="px-2 py-3 text-xs text-slate-500">No items in this collection yet.</p>
        ) : (
          mergedOptions.map((opt) => (
            <label
              key={opt.id}
              className={
                match(opt)
                  ? 'flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-[#fff3e8]'
                  : 'hidden'
              }
            >
              <input
                type="checkbox"
                name={name}
                value={opt.id}
                defaultChecked={selectedIds.has(opt.id)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 bg-white accent-[var(--brand-primary,#f16610)]"
              />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-medium leading-snug text-slate-900">{opt.label}</span>
                <span className="truncate font-mono text-[11px] text-slate-500">{opt.id}</span>
              </span>
            </label>
          ))
        )}
      </fieldset>
      <p className="text-xs text-slate-500">Select related items. Uncheck to remove. Nothing is saved until you press Save.</p>
    </div>
  )
}
