'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, ChevronRight, Copy, GripVertical, Plus, Trash2 } from 'lucide-react'
import type { SectionFieldDef } from '@/lib/landing-pages/sectionCatalog'
import { FieldEditor } from './FieldEditor'

function buildDefaultItem(field: SectionFieldDef): unknown {
  if (field.itemPrimitive === 'boolean') return false
  if (field.itemPrimitive === 'string') return ''
  const obj: Record<string, unknown> = {}
  for (const sub of field.itemFields ?? []) {
    if (sub.type === 'repeater') obj[sub.name] = []
    else if (sub.type === 'boolean') obj[sub.name] = false
    else if (sub.type === 'number') obj[sub.name] = undefined
    else obj[sub.name] = sub.defaultValue ?? ''
  }
  return obj
}

function summarize(item: unknown, itemFields: SectionFieldDef[]): string {
  if (typeof item === 'string') return item || '—'
  if (typeof item === 'boolean') return item ? 'Yes' : 'No'
  if (item && typeof item === 'object') {
    const rec = item as Record<string, unknown>
    for (const f of itemFields) {
      if (f.type === 'text' || f.type === 'textarea') {
        const v = rec[f.name]
        if (typeof v === 'string' && v.trim()) return v.length > 48 ? `${v.slice(0, 48)}…` : v
      }
    }
  }
  return '—'
}

export function RepeaterField({
  field,
  value,
  onChange,
}: {
  field: SectionFieldDef
  value: unknown
  onChange: (next: unknown) => void
}) {
  const items: unknown[] = Array.isArray(value) ? value : []
  const itemLabel = field.itemLabel ?? 'Item'
  const isPrimitive = Boolean(field.itemPrimitive)
  const itemFields = field.itemFields ?? []

  const [open, setOpen] = useState<boolean[]>(() => items.map(() => false))

  // Keep collapse-state array aligned if the value array is replaced wholesale.
  useEffect(() => {
    setOpen((prev) => (prev.length === items.length ? prev : items.map(() => false)))
  }, [items.length])

  function commit(nextItems: unknown[], nextOpen: boolean[]) {
    onChange(nextItems)
    setOpen(nextOpen)
  }

  function addItem() {
    commit([...items, buildDefaultItem(field)], [...open, true])
  }
  function removeAt(i: number) {
    commit(items.filter((_, k) => k !== i), open.filter((_, k) => k !== i))
  }
  function duplicateAt(i: number) {
    const clone = JSON.parse(JSON.stringify(items[i] ?? null))
    const nextItems = [...items.slice(0, i + 1), clone, ...items.slice(i + 1)]
    const nextOpen = [...open.slice(0, i + 1), true, ...open.slice(i + 1)]
    commit(nextItems, nextOpen)
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const nextItems = [...items]
    const nextOpen = [...open]
    ;[nextItems[i], nextItems[j]] = [nextItems[j], nextItems[i]]
    ;[nextOpen[i], nextOpen[j]] = [nextOpen[j], nextOpen[i]]
    commit(nextItems, nextOpen)
  }
  function updateAt(i: number, nextItem: unknown) {
    onChange(items.map((it, k) => (k === i ? nextItem : it)))
  }
  function setSubField(i: number, name: string, v: unknown) {
    const base = (items[i] && typeof items[i] === 'object' ? (items[i] as Record<string, unknown>) : {}) as Record<string, unknown>
    updateAt(i, { ...base, [name]: v })
  }

  return (
    <div className="block text-sm">
      <div className="flex items-center justify-between">
        <span className="font-medium text-slate-800">{field.label}</span>
        <span className="text-xs text-slate-400">
          {items.length}
          {field.max ? ` / ${field.max}` : ''}
        </span>
      </div>
      {field.description ? <p className="mt-0.5 text-xs text-slate-500">{field.description}</p> : null}

      <div className="mt-2 space-y-2">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 px-3 py-4 text-center text-xs text-slate-500">
            No {itemLabel.toLowerCase()}s yet.
          </div>
        ) : null}

        {items.map((item, i) => {
          const isOpen = open[i] ?? false
          return (
            <div key={i} className="rounded-lg border border-slate-200 bg-slate-50/60">
              <div className="flex items-center gap-1.5 px-2 py-1.5">
                <GripVertical className="h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden />
                {isPrimitive ? (
                  field.itemPrimitive === 'boolean' ? (
                    <label className="flex flex-1 items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(item)}
                        onChange={(e) => updateAt(i, e.target.checked)}
                      />
                      <span className="text-slate-600">
                        {itemLabel} {i + 1}
                      </span>
                    </label>
                  ) : (
                    <input
                      type="text"
                      value={typeof item === 'string' ? item : ''}
                      onChange={(e) => updateAt(i, e.target.value)}
                      placeholder={field.placeholder}
                      className="flex-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm"
                    />
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => setOpen((o) => o.map((v, k) => (k === i ? !v : v)))}
                    className="flex flex-1 items-center gap-1.5 truncate text-left"
                  >
                    {isOpen ? (
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    )}
                    <span className="text-xs font-semibold text-slate-500">{itemLabel} {i + 1}</span>
                    {!isOpen ? <span className="truncate text-xs text-slate-400">· {summarize(item, itemFields)}</span> : null}
                  </button>
                )}

                <div className="ml-auto flex shrink-0 items-center gap-0.5">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1 text-slate-400 hover:bg-slate-200 disabled:opacity-30" aria-label="Move up">▲</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="rounded p-1 text-slate-400 hover:bg-slate-200 disabled:opacity-30" aria-label="Move down">▼</button>
                  {!isPrimitive ? (
                    <button type="button" onClick={() => duplicateAt(i)} className="rounded p-1 text-slate-400 hover:bg-slate-200" aria-label="Duplicate">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                  <button type="button" onClick={() => removeAt(i)} className="rounded p-1 text-rose-400 hover:bg-rose-100" aria-label="Remove">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {!isPrimitive && isOpen ? (
                <div className="space-y-3 border-t border-slate-200 bg-white px-3 py-3">
                  {itemFields.map((sub) => {
                    const rec = (item && typeof item === 'object' ? (item as Record<string, unknown>) : {}) as Record<string, unknown>
                    return (
                      <FieldEditor
                        key={sub.name}
                        field={sub}
                        value={rec[sub.name]}
                        onChange={(v) => setSubField(i, sub.name, v)}
                      />
                    )
                  })}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={addItem}
        disabled={field.max != null && items.length >= field.max}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
      >
        <Plus className="h-3.5 w-3.5" /> Add {itemLabel.toLowerCase()}
      </button>
    </div>
  )
}
