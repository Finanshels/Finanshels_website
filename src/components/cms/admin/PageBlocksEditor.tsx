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

// id is always assigned by coerceInitial/defaultBlockValue, so it is required.
type BlockValue = Record<string, unknown> & { type: string; id: string }

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

/**
 * Parse a comma-separated multi-reference input into a deduped id list.
 * When options are available, only ids that exist in them are kept (drops
 * typos/unknown ids). With no options loaded we keep the deduped input as-is.
 */
function parseMultiReference(raw: string, options: Array<{ id: string; label: string }>): string[] {
  const deduped = [...new Set(parseTags(raw))]
  if (options.length === 0) return deduped
  const valid = new Set(options.map((o) => o.id))
  return deduped.filter((id) => valid.has(id))
}

const SUMMARY_MAX_LEN = 60

/** First non-empty, trimmed candidate string for the collapsed block header. */
function blockSummary(block: BlockValue): string {
  const candidates: string[] = []
  if (typeof block.heading === 'string') candidates.push(block.heading.trim())
  if (typeof block.eyebrow === 'string') candidates.push(block.eyebrow.trim())
  if (typeof block.quote === 'string') candidates.push(block.quote.trim())
  if (typeof block.html === 'string') candidates.push(block.html.replace(/<[^>]+>/g, '').trim())
  const first = candidates.find((c) => c.length > 0) ?? ''
  return first.slice(0, SUMMARY_MAX_LEN)
}

export default function PageBlocksEditor({ name, initialValue, referenceOptions = {} }: Props) {
  const [blocks, setBlocks] = useState<BlockValue[]>(() => coerceInitial(initialValue))
  const [openId, setOpenId] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  // Per-field JSON editing state keyed by `${blockId}:${fieldName}`.
  // Holds the in-progress raw text + validity so invalid JSON is shown but
  // never propagated into block state (last valid value is kept on save).
  const [jsonDrafts, setJsonDrafts] = useState<Record<string, { raw: string; invalid: boolean }>>({})

  const serialised = useMemo(() => JSON.stringify(blocks), [blocks])

  const updateBlock = useCallback((id: string, patch: Record<string, unknown>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)))
  }, [])

  const handleJsonChange = useCallback((blockId: string, fieldName: string, raw: string) => {
    const key = `${blockId}:${fieldName}`
    if (!raw.trim()) {
      // Empty clears both the value and any prior error.
      setJsonDrafts((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
      setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, [fieldName]: '' } : b)))
      return
    }
    try {
      const parsed = JSON.parse(raw)
      // Valid: persist the parsed value and drop the draft/error state.
      setJsonDrafts((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
      setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, [fieldName]: parsed } : b)))
    } catch {
      // Invalid: keep the raw text visible + flag error, but do NOT touch block state.
      setJsonDrafts((prev) => ({ ...prev, [key]: { raw, invalid: true } }))
    }
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
        <div className="rounded-2xl border border-dashed border-cms-rule bg-cms-soft px-6 py-10 text-center">
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
            const summary = blockSummary(block)
            return (
              <li
                key={block.id}
                className="overflow-hidden rounded-2xl border border-cms-rule bg-white"
              >
                <header className="flex items-center gap-2 border-b border-cms-rule bg-cms-soft px-3 py-2">
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
                      onClick={() => moveBlock(block.id, -1)}
                      className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-slate-800"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Move down"
                      onClick={() => moveBlock(block.id, 1)}
                      className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-slate-800"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Duplicate"
                      onClick={() => duplicateBlock(block.id)}
                      className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-slate-800"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => removeBlock(block.id)}
                      className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : block.id)}
                      className="ml-1 inline-flex items-center gap-1 rounded-md border border-cms-rule bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-cms-hover"
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
                                onChange={(e) => updateBlock(block.id, { [field.name]: e.target.value })}
                                placeholder={field.placeholder}
                                className="mt-2 w-full rounded-lg border border-cms-rule bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                              />
                            ) : field.type === 'json' ? (
                              (() => {
                                // While invalid, show the raw draft; otherwise show the stored value.
                                const draft = jsonDrafts[`${block.id}:${field.name}`]
                                const jsonInvalid = draft?.invalid === true
                                return (
                                  <>
                                    <textarea
                                      rows={6}
                                      value={draft ? draft.raw : jsonStringify(value)}
                                      onChange={(e) => handleJsonChange(block.id, field.name, e.target.value)}
                                      placeholder={field.placeholder}
                                      spellCheck={false}
                                      aria-invalid={jsonInvalid}
                                      className={`mt-2 w-full rounded-lg border bg-white px-3 py-2 font-mono text-xs text-slate-900 outline-none focus:ring-2 ${
                                        jsonInvalid
                                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                          : 'border-cms-rule focus:border-brand-primary focus:ring-brand-primary/20'
                                      }`}
                                    />
                                    {jsonInvalid ? (
                                      <p className="mt-1 text-xs text-red-600">
                                        Invalid JSON — fix the syntax. The last valid value is kept until this parses.
                                      </p>
                                    ) : null}
                                  </>
                                )
                              })()
                            ) : field.type === 'select' && field.options?.length ? (
                              <select
                                value={typeof value === 'string' ? value : ''}
                                onChange={(e) => updateBlock(block.id, { [field.name]: e.target.value })}
                                className="mt-2 w-full rounded-lg border border-cms-rule bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
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
                                  onChange={(e) => updateBlock(block.id, { [field.name]: e.target.checked })}
                                  className="h-4 w-4 cursor-pointer rounded border-slate-300 bg-white accent-[var(--brand-primary,#f16610)]"
                                />
                                Enabled
                              </label>
                            ) : field.type === 'tags' ? (
                              <input
                                type="text"
                                value={tagsToString(value)}
                                onChange={(e) =>
                                  updateBlock(block.id, { [field.name]: parseTags(e.target.value) })
                                }
                                placeholder={field.placeholder}
                                className="mt-2 w-full rounded-lg border border-cms-rule bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                              />
                            ) : field.type === 'reference' ? (
                              (() => {
                                const current = typeof value === 'string' ? value : ''
                                const baseOptions = field.referenceCollection
                                  ? referenceOptions[field.referenceCollection] ?? []
                                  : []
                                // Server caps options at 200; if the saved id isn't in the
                                // list, inject it so the value isn't blanked out and lost on save.
                                const mergedOptions =
                                  current && !baseOptions.some((o) => o.id === current)
                                    ? [{ id: current, label: `${current} (not in list)` }, ...baseOptions]
                                    : baseOptions
                                return (
                                  <select
                                    value={current}
                                    onChange={(e) => updateBlock(block.id, { [field.name]: e.target.value })}
                                    className="mt-2 w-full rounded-lg border border-cms-rule bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                                  >
                                    <option value="">— select —</option>
                                    {mergedOptions.map((opt) => (
                                      <option key={opt.id} value={opt.id}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                )
                              })()
                            ) : field.type === 'multi_reference' ? (
                              <input
                                type="text"
                                value={tagsToString(value)}
                                onChange={(e) =>
                                  updateBlock(block.id, {
                                    [field.name]: parseMultiReference(
                                      e.target.value,
                                      field.referenceCollection
                                        ? referenceOptions[field.referenceCollection] ?? []
                                        : [],
                                    ),
                                  })
                                }
                                placeholder="id-one, id-two"
                                list={`block-${block.id}-${field.name}-suggest`}
                                className="mt-2 w-full rounded-lg border border-cms-rule bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                              />
                            ) : (
                              <input
                                type={fieldInputType(field)}
                                value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''}
                                onChange={(e) => updateBlock(block.id, { [field.name]: e.target.value })}
                                placeholder={field.placeholder}
                                className="mt-2 w-full rounded-lg border border-cms-rule bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
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
          className="absolute z-30 mt-1.5 grid w-[min(640px,calc(100vw-2rem))] grid-cols-1 gap-1 overflow-hidden rounded-2xl border border-cms-rule bg-white p-2 text-sm shadow-[0_24px_60px_rgba(15,23,42,0.18)] sm:grid-cols-2"
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
              className="flex flex-col items-start rounded-lg border border-transparent px-3 py-2 text-left hover:border-cms-rule hover:bg-cms-soft focus:border-brand-primary focus:bg-brand-primary/5 focus:outline-none"
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
