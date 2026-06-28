'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'

type Props = {
  name: string
  options: string[]
  optionLabels?: Record<string, string>
  /** Max selectable; unselected options disable once reached. */
  maxItems?: number
  /** Comma-joined initial value (from the multi_select codec encode). */
  value: string
}

function parseCsv(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Dropdown multi-select for the `multi_select` field type. The collapsed trigger
 * shows the chosen verticals as removable chips; clicking opens a checklist
 * panel. Submits a single comma-joined hidden input (`name`), which the
 * multi_select codec splits back into string[]. Everything is `type="button"`
 * so interacting never submits the editor form.
 */
export function MultiSelectField({ name, options, optionLabels, maxItems, value }: Props) {
  const [selected, setSelected] = useState<string[]>(() =>
    // Keep only known options; preserve the stored order.
    parseCsv(value).filter((v) => options.includes(v))
  )
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const atMax = maxItems !== undefined && selected.length >= maxItems
  const labelOf = (opt: string) => optionLabels?.[opt] ?? opt

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggle = (opt: string) => {
    setSelected((cur) => {
      if (cur.includes(opt)) return cur.filter((x) => x !== opt)
      if (maxItems !== undefined && cur.length >= maxItems) return cur
      return [...cur, opt]
    })
  }
  const remove = (opt: string) => setSelected((cur) => cur.filter((x) => x !== opt))

  return (
    <div className="relative mt-2" ref={rootRef}>
      {/* Serializes as a single comma-joined value; the multi_select codec splits it. */}
      <input type="hidden" name={name} value={selected.join(', ')} readOnly />

      {/* Collapsed trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-cms-rule bg-white px-3 py-2 text-left outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
      >
        <span className="flex flex-1 flex-wrap items-center gap-1.5">
          {selected.length === 0 ? (
            <span className="py-0.5 text-sm text-slate-400">Select…</span>
          ) : (
            selected.map((opt) => (
              <span
                key={opt}
                className="inline-flex items-center gap-1 rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-medium text-brand-primary"
              >
                {labelOf(opt)}
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Remove ${labelOf(opt)}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    remove(opt)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      e.stopPropagation()
                      remove(opt)
                    }
                  }}
                  className="grid h-3.5 w-3.5 place-items-center rounded-full text-brand-primary/70 hover:bg-brand-primary/20 hover:text-brand-primary"
                >
                  <X className="h-2.5 w-2.5" aria-hidden />
                </span>
              </span>
            ))
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {/* Dropdown panel */}
      {open ? (
        <div
          role="listbox"
          aria-multiselectable
          className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-cms-rule bg-white p-1 shadow-[0_12px_30px_rgba(15,23,42,0.14)]"
        >
          {options.map((opt) => {
            const isSelected = selected.includes(opt)
            const disabled = !isSelected && atMax
            return (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={disabled}
                onClick={() => toggle(opt)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition ${
                  isSelected
                    ? 'bg-brand-primary/10 text-brand-primary'
                    : disabled
                    ? 'cursor-not-allowed text-slate-300'
                    : 'text-slate-700 hover:bg-cms-soft'
                }`}
              >
                <span
                  className={`grid h-4 w-4 shrink-0 place-items-center rounded border transition ${
                    isSelected ? 'border-brand-primary bg-brand-primary text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected ? <Check className="h-3 w-3" aria-hidden /> : null}
                </span>
                {labelOf(opt)}
              </button>
            )
          })}
        </div>
      ) : null}

      {maxItems !== undefined ? (
        <p className="mt-1.5 text-xs text-slate-500">
          {selected.length}/{maxItems} selected{atMax ? ' — deselect one to change' : ''}
        </p>
      ) : null}
    </div>
  )
}
