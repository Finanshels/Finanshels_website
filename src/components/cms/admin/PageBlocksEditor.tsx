'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Copy,
  GripVertical,
  Plus,
  Trash2,
} from 'lucide-react'
import {
  CMS_BLOCK_TYPES,
  CMS_BLOCK_TYPE_MAP,
  type CmsBlockField,
  type CmsBlockType,
} from '@/lib/cms/collectionDefinitions'

type BlockValue = Record<string, unknown> & { type: string; id?: string }

type Props = {
  name: string
  initialValue: unknown
  /** Pre-loaded reference suggestions per target collection. */
  referenceOptions?: Record<string, Array<{ id: string; label: string }>>
}

function safeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().slice(0, 8)
  }
  return Math.random().toString(36).slice(2, 10)
}

function coerceInitial(initial: unknown): BlockValue[] {
  if (Array.isArray(initial)) {
    return initial
      .filter((entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === 'object')
      .map((entry) => ({
        ...(entry as Record<string, unknown>),
        type: typeof entry.type === 'string' ? entry.type : 'rich_text',
        id: typeof entry.id === 'string' && entry.id ? entry.id : safeId(),
      }))
  }
  if (typeof initial === 'string' && initial.trim()) {
    try {
      return coerceInitial(JSON.parse(initial))
    } catch {
      return []
    }
  }
  return []
}

function defaultBlockValue(type: CmsBlockType): BlockValue {
  const block: BlockValue = { type: type.type, id: safeId() }
  for (const field of type.fields) {
    if (field.type === 'boolean') block[field.name] = false
    else if (field.type === 'number') block[field.name] = ''
    else if (field.type === 'tags' || field.type === 'multi_reference') block[field.name] = []
    else if (field.type === 'json') block[field.name] = ''
    else block[field.name] = ''
  }
  return block
}

function fieldInputType(field: CmsBlockField): string {
  if (field.type === 'url') return 'url'
  if (field.type === 'email') return 'email'
  if (field.type === 'number') return 'number'
  return 'text'
}

function jsonStringify(value: unknown): string {
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return ''
  }
}

function tagsToString(value: unknown): string {
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'string') return value
  return ''
}

function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export default function PageBlocksEditor({ name, initialValue, referenceOptions = {} }: Props) {
  const [blocks, setBlocks] = useState<BlockValue[]>(() => coerceInitial(initialValue))
  const [openId, setOpenId] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  const serialised = useMemo(() => JSON.stringify(blocks), [blocks])

  const updateBlock = useCallback((id: string, patch: Record<string, unknown>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)))
  }, [])

  const moveBlock = useCallback((id: string, direction: -1 | 1) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id)
      if (idx < 0) return prev
      const next = [...prev]
      const target = idx + direction
      if (target < 0 || target >= next.length) return prev
      const [item] = next.splice(idx, 1)
      next.splice(target, 0, item)
      return next
    })
  }, [])

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const duplicateBlock = useCallback((id: string) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id)
      if (idx < 0) return prev
      const original = prev[idx]
      const copy: BlockValue = { ...original, id: safeId() }
      const next = [...prev]
      next.splice(idx + 1, 0, copy)
      return next
    })
  }, [])

  const insertBlock = useCallback((type: CmsBlockType) => {
    setBlocks((prev) => [...prev, defaultBlockValue(type)])
    setPickerOpen(false)
  }, [])

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={serialised} readOnly />

      {blocks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e8dccf] bg-[#fffaf5] px-6 py-10 text-center">
          <p className="text-sm font-medium text-slate-700">No blocks yet</p>
          <p className="mt-1 text-xs text-slate-500">
            Compose this detail page from reusable blocks. Each block is rendered top-to-bottom on the page.
          </p>
        </div>
      ) : (
        <ol className="space-y-3">
          {blocks.map((block, index) => {
            const def = CMS_BLOCK_TYPE_MAP[block.type] ?? null
            const open = openId === block.id
            const summary =
              (typeof block.heading === 'string' && block.heading) ||
              (typeof block.eyebrow === 'string' && block.eyebrow) ||
              (typeof block.quote === 'string' && (block.quote as string).slice(0, 60)) ||
              (typeof block.html === 'string' && (block.html as string).replace(/<[^>]+>/g, '').slice(0, 60)) ||
              ''
            return (
              <li
                key={block.id ?? `${block.type}-${index}`}
                className="overflow-hidden rounded-2xl border border-[#e8dccf] bg-white"
              >
                <header className="flex items-center gap-2 border-b border-[#eee2d3] bg-[#fffaf5] px-3 py-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-300">
                    <GripVertical className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <span className="rounded-md bg-brand-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-primary">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {def?.label ?? block.type}
                  </span>
                  {summary ? (
                    <span className="hidden truncate text-xs text-slate-500 sm:block">— {summary}</span>
                  ) : null}
                  <div className="ml-auto flex items-center gap-1">
                    <button
                      type="button"
                      title="Move up"
                      onClick={() => moveBlock(block.id ?? '', -1)}
                      className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-slate-800"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Move down"
                      onClick={() => moveBlock(block.id ?? '', 1)}
                      className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-slate-800"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Duplicate"
                      onClick={() => duplicateBlock(block.id ?? '')}
                      className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-slate-800"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => removeBlock(block.id ?? '')}
                      className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : block.id ?? null)}
                      className="ml-1 inline-flex items-center gap-1 rounded-md border border-[#e8dccf] bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-[#fff3e8]"
                    >
                      {open ? 'Close' : 'Edit'}
                    </button>
                  </div>
                </header>

                {open && def ? (
                  <div className="space-y-3 px-3 py-3">
                    <p className="text-[11px] text-slate-500">{def.description}</p>
                    <div className="grid gap-3 md:grid-cols-2">
                      {def.fields.map((field) => {
                        const value = block[field.name]
                        const colSpan =
                          field.type === 'textarea' || field.type === 'json' ? 'md:col-span-2' : 'md:col-span-1'
                        return (
                          <label
                            key={field.name}
                            className={`block text-sm font-medium text-slate-700 ${colSpan}`}
                          >
                            <span className="flex items-center gap-2">
                              {field.label}
                              {field.required ? (
                                <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-brand-primary">
                                  Required
                                </span>
                              ) : null}
                            </span>
                            {field.type === 'textarea' ? (
                              <textarea
                                rows={field.name === 'html' ? 8 : 4}
                                value={typeof value === 'string' ? value : ''}
                                onChange={(e) => updateBlock(block.id ?? '', { [field.name]: e.target.value })}
                                placeholder={field.placeholder}
                                className="mt-2 w-full rounded-lg border border-[#e8dccf] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                              />
                            ) : field.type === 'json' ? (
                              <textarea
                                rows={6}
                                value={jsonStringify(value)}
                                onChange={(e) => {
                                  const raw = e.target.value
                                  try {
                                    const parsed = raw.trim() ? JSON.parse(raw) : ''
                                    updateBlock(block.id ?? '', { [field.name]: parsed })
                                  } catch {
                                    updateBlock(block.id ?? '', { [field.name]: raw })
                                  }
                                }}
                                placeholder={field.placeholder}
                                spellCheck={false}
                                className="mt-2 w-full rounded-lg border border-[#e8dccf] bg-white px-3 py-2 font-mono text-xs text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                              />
                            ) : field.type === 'select' && field.options?.length ? (
                              <select
                                value={typeof value === 'string' ? value : ''}
                                onChange={(e) => updateBlock(block.id ?? '', { [field.name]: e.target.value })}
                                className="mt-2 w-full rounded-lg border border-[#e8dccf] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                              >
                                <option value="">— select —</option>
                                {field.options.map((o) => (
                                  <option key={o} value={o}>
                                    {o}
                                  </option>
                                ))}
                              </select>
                            ) : field.type === 'boolean' ? (
                              <label className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700">
                                <input
                                  type="checkbox"
                                  checked={value === true}
                                  onChange={(e) => updateBlock(block.id ?? '', { [field.name]: e.target.checked })}
                                  className="h-4 w-4 cursor-pointer rounded border-slate-300 bg-white accent-[var(--brand-primary,#f16610)]"
                                />
                                Enabled
                              </label>
                            ) : field.type === 'tags' ? (
                              <input
                                type="text"
                                value={tagsToString(value)}
                                onChange={(e) =>
                                  updateBlock(block.id ?? '', { [field.name]: parseTags(e.target.value) })
                                }
                                placeholder={field.placeholder}
                                className="mt-2 w-full rounded-lg border border-[#e8dccf] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                              />
                            ) : field.type === 'reference' ? (
                              <select
                                value={typeof value === 'string' ? value : ''}
                                onChange={(e) => updateBlock(block.id ?? '', { [field.name]: e.target.value })}
                                className="mt-2 w-full rounded-lg border border-[#e8dccf] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                              >
                                <option value="">— select —</option>
                                {(field.referenceCollection
                                  ? referenceOptions[field.referenceCollection] ?? []
                                  : []
                                ).map((opt) => (
                                  <option key={opt.id} value={opt.id}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            ) : field.type === 'multi_reference' ? (
                              <input
                                type="text"
                                value={tagsToString(value)}
                                onChange={(e) =>
                                  updateBlock(block.id ?? '', { [field.name]: parseTags(e.target.value) })
                                }
                                placeholder="id-one, id-two"
                                list={`block-${block.id}-${field.name}-suggest`}
                                className="mt-2 w-full rounded-lg border border-[#e8dccf] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                              />
                            ) : (
                              <input
                                type={fieldInputType(field)}
                                value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''}
                                onChange={(e) => updateBlock(block.id ?? '', { [field.name]: e.target.value })}
                                placeholder={field.placeholder}
                                className="mt-2 w-full rounded-lg border border-[#e8dccf] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                              />
                            )}
                            {field.type === 'multi_reference' && field.referenceCollection ? (
                              <datalist id={`block-${block.id}-${field.name}-suggest`}>
                                {(referenceOptions[field.referenceCollection] ?? []).map((opt) => (
                                  <option key={opt.id} value={opt.id}>
                                    {opt.label}
                                  </option>
                                ))}
                              </datalist>
                            ) : null}
                          </label>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ol>
      )}

      <BlockTypePicker open={pickerOpen} onOpen={() => setPickerOpen(true)} onClose={() => setPickerOpen(false)} onPick={insertBlock} />
    </div>
  )
}

/**
 * FIX-019: accessible block-type menu — role=menu, focus trap, ESC closes,
 * arrow keys move, click-outside closes, focus returns to the trigger.
 */
function BlockTypePicker({
  open,
  onOpen,
  onClose,
  onPick,
}: {
  open: boolean
  onOpen: () => void
  onClose: () => void
  onPick: (type: (typeof CMS_BLOCK_TYPES)[number]) => void
}) {
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    if (!open) return
    // Move focus to the first menu item when the menu opens.
    requestAnimationFrame(() => itemRefs.current[0]?.focus())

    function onDown(e: MouseEvent) {
      const t = e.target as Node | null
      if (!t) return
      if (menuRef.current?.contains(t) || triggerRef.current?.contains(t)) return
      onClose()
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        triggerRef.current?.focus()
        return
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const items = itemRefs.current.filter(Boolean) as HTMLButtonElement[]
        if (items.length === 0) return
        const active = document.activeElement as HTMLElement | null
        const idx = items.findIndex((el) => el === active)
        const next = e.key === 'ArrowDown' ? (idx + 1) % items.length : (idx - 1 + items.length) % items.length
        items[next].focus()
      }
      if (e.key === 'Home') {
        e.preventDefault()
        itemRefs.current[0]?.focus()
      }
      if (e.key === 'End') {
        e.preventDefault()
        const items = itemRefs.current.filter(Boolean) as HTMLButtonElement[]
        items[items.length - 1]?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? onClose() : onOpen())}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-brand-primary/60 bg-brand-primary/5 px-3 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10"
      >
        <Plus className="h-4 w-4" />
        Add block
      </button>
      {open ? (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Insert block"
          className="absolute z-30 mt-1.5 grid w-[min(640px,calc(100vw-2rem))] grid-cols-1 gap-1 overflow-hidden rounded-2xl border border-[#e8dccf] bg-white p-2 text-sm shadow-[0_24px_60px_rgba(15,23,42,0.18)] sm:grid-cols-2"
        >
          {CMS_BLOCK_TYPES.map((type, i) => (
            <button
              key={type.type}
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              type="button"
              role="menuitem"
              onClick={() => {
                onPick(type)
                onClose()
                triggerRef.current?.focus()
              }}
              className="flex flex-col items-start rounded-lg border border-transparent px-3 py-2 text-left hover:border-[#e8dccf] hover:bg-[#fff8f1] focus:border-brand-primary focus:bg-brand-primary/5 focus:outline-none"
            >
              <span className="text-sm font-semibold text-slate-900">{type.label}</span>
              <span className="mt-0.5 text-xs text-slate-500">{type.description}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
