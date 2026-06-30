'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, Copy, GripVertical, Plus, Trash2 } from 'lucide-react'
import { CMS_BLOCK_TYPES, CMS_BLOCK_TYPE_MAP, type CmsBlockType } from '@/lib/cms/collectionDefinitions'
import { BlockFields, type ReferenceOptionMap } from '@/components/cms/admin/blocks/BlockFields'
import { defaultBlockValue, safeId, type BlockValue } from '@/components/cms/admin/blocks/blockDefaults'

type Props = {
  name: string
  initialValue: unknown
  /** Pre-loaded reference suggestions per target collection. */
  referenceOptions?: ReferenceOptionMap
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

const SUMMARY_MAX_LEN = 60

/** First non-empty, trimmed candidate string for the collapsed block header. */
function blockSummary(block: BlockValue): string {
  const candidates: string[] = []
  if (typeof block.heading === 'string') candidates.push(block.heading.trim())
  if (typeof block.eyebrow === 'string') candidates.push(block.eyebrow.trim())
  if (typeof block.title === 'string') candidates.push(block.title.trim())
  if (typeof block.quote === 'string') candidates.push(block.quote.trim())
  if (typeof block.text === 'string') candidates.push(block.text.trim())
  if (typeof block.html === 'string') candidates.push(block.html.replace(/<[^>]+>/g, '').trim())
  const first = candidates.find((c) => c.length > 0) ?? ''
  return first.slice(0, SUMMARY_MAX_LEN)
}

export default function PageBlocksEditor({ name, initialValue, referenceOptions = {} }: Props) {
  const [blocks, setBlocks] = useState<BlockValue[]>(() => coerceInitial(initialValue))
  const [openId, setOpenId] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  const serialised = useMemo(() => JSON.stringify(blocks), [blocks])

  const updateField = useCallback((id: string, fieldName: string, value: unknown) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, [fieldName]: value } : b)))
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
              <li key={block.id} className="overflow-hidden rounded-2xl border border-cms-rule bg-white">
                <header className="flex items-center gap-2 border-b border-cms-rule bg-cms-soft px-3 py-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-300">
                    <GripVertical className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <span className="rounded-md bg-brand-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-primary">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">{def?.label ?? block.type}</span>
                  {summary ? <span className="hidden truncate text-xs text-slate-500 sm:block">— {summary}</span> : null}
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
                    <BlockFields
                      fields={def.fields}
                      values={block}
                      onChange={(fieldName, value) => updateField(block.id, fieldName, value)}
                      referenceOptions={referenceOptions}
                      idPrefix={`block-${block.id}`}
                    />
                  </div>
                ) : null}
              </li>
            )
          })}
        </ol>
      )}

      <BlockTypePicker
        open={pickerOpen}
        onOpen={() => setPickerOpen(true)}
        onClose={() => setPickerOpen(false)}
        onPick={insertBlock}
      />
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
