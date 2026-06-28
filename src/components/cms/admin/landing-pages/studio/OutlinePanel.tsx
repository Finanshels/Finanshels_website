'use client'

import { useState } from 'react'
import { Copy, Eye, EyeOff, GripVertical, Plus, Trash2 } from 'lucide-react'
import {
  SECTION_CATALOG,
  getSectionCatalogEntry,
} from '@/lib/landing-pages/sectionCatalog'
import type { LandingPageSection } from '@/lib/landing-pages/types'
import { LucideIcon } from '../fields/lucideClient'

/** Catalog grouping order for the "Add a section" picker. */
const SECTION_GROUPS = ['Hero', 'Trust', 'Value', 'Conversion', 'Objection'] as const

/** Group accent dots so the outline reads as a structured page, not a flat list. */
const GROUP_DOT: Record<string, string> = {
  Hero: 'bg-violet-400',
  Trust: 'bg-emerald-400',
  Value: 'bg-sky-400',
  Conversion: 'bg-amber-400',
  Objection: 'bg-rose-400',
}

export type OutlinePanelProps = {
  sections: LandingPageSection[]
  selectedId: string | null
  hoveredId: string | null
  pageSelected: boolean
  onSelectPage: () => void
  onSelectSection: (id: string) => void
  onHoverSection: (id: string | null) => void
  /** atIndex === null appends; otherwise inserts before that index. */
  onAdd: (type: string, atIndex: number | null) => void
  onReorder: (from: number, to: number) => void
  onToggleEnabled: (id: string, enabled: boolean) => void
  onDuplicate: (id: string) => void
  onRemove: (id: string) => void
}

export function OutlinePanel(props: OutlinePanelProps) {
  const {
    sections,
    selectedId,
    hoveredId,
    pageSelected,
    onSelectPage,
    onSelectSection,
    onHoverSection,
    onAdd,
    onReorder,
    onToggleEnabled,
    onDuplicate,
    onRemove,
  } = props

  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  // null = closed; number = insert-at index; 'append' = bottom button.
  const [addTarget, setAddTarget] = useState<number | 'append' | null>(null)

  function openCatalog(target: number | 'append') {
    setAddTarget((cur) => (cur === target ? null : target))
  }

  function handleAdd(type: string) {
    onAdd(type, addTarget === 'append' || addTarget === null ? null : addTarget)
    setAddTarget(null)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Page-level settings entry */}
      <button
        type="button"
        onClick={onSelectPage}
        className={`mb-2 flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[13px] transition ${
          pageSelected
            ? 'border-violet-400 bg-violet-50 text-violet-900'
            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
          <LucideIcon name="Settings" className="h-3 w-3" />
        </span>
        <span className="min-w-0">
          <span className="block font-medium leading-tight">Page settings</span>
          <span className="block truncate text-[10px] text-slate-500">URL, contact, theme, SEO</span>
        </span>
      </button>

      <p className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        Sections · {sections.length}
      </p>

      <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto pr-0.5">
        {sections.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-center text-xs text-slate-500">
            No sections yet. Add one below, or click a section in the preview.
          </div>
        ) : null}

        {sections.map((sec, i) => {
          const entry = getSectionCatalogEntry(sec.type)
          const isSelected = selectedId === sec.id
          const isHovered = hoveredId === sec.id
          const isOver = overIndex === i && dragIndex !== null && dragIndex !== i
          return (
            <div key={sec.id}>
              {/* Insert-between affordance */}
              <InsertGap onClick={() => openCatalog(i)} active={addTarget === i} />

              <div
                draggable
                onDragStart={(e) => {
                  setDragIndex(i)
                  e.dataTransfer.effectAllowed = 'move'
                  try {
                    e.dataTransfer.setData('text/plain', sec.id)
                  } catch {
                    /* some browsers reject */
                  }
                }}
                onDragOver={(e) => {
                  if (dragIndex === null) return
                  e.preventDefault()
                  e.dataTransfer.dropEffect = 'move'
                  if (overIndex !== i) setOverIndex(i)
                }}
                onDragLeave={() => {
                  if (overIndex === i) setOverIndex(null)
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  if (dragIndex !== null && dragIndex !== i) onReorder(dragIndex, i)
                  setDragIndex(null)
                  setOverIndex(null)
                }}
                onDragEnd={() => {
                  setDragIndex(null)
                  setOverIndex(null)
                }}
                onMouseEnter={() => onHoverSection(sec.id)}
                onMouseLeave={() => onHoverSection(null)}
                onClick={() => onSelectSection(sec.id)}
                className={`group flex cursor-pointer items-center gap-1.5 rounded-lg border px-2 py-1.5 transition ${
                  isSelected
                    ? 'border-violet-400 bg-violet-50'
                    : isHovered
                      ? 'border-violet-200 bg-violet-50/40'
                      : 'border-transparent hover:bg-slate-50'
                } ${isOver ? 'ring-2 ring-blue-300' : ''} ${sec.enabled ? '' : 'opacity-60'}`}
              >
                <span
                  className="shrink-0 cursor-grab text-slate-300 transition hover:text-slate-400 active:cursor-grabbing"
                  aria-hidden="true"
                  title="Drag to reorder"
                >
                  <GripVertical className="h-3.5 w-3.5" />
                </span>
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${GROUP_DOT[entry?.group ?? ''] ?? 'bg-slate-300'}`}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-slate-800">
                    {entry?.label ?? sec.type}
                  </span>
                </span>
                {!sec.enabled ? (
                  <span className="shrink-0 rounded bg-slate-100 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                    Hidden
                  </span>
                ) : null}

                {/* Hover-revealed row actions */}
                <span className="flex shrink-0 items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
                  <RowButton
                    title={sec.enabled ? 'Hide section' : 'Show section'}
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleEnabled(sec.id, !sec.enabled)
                    }}
                  >
                    {sec.enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </RowButton>
                  <RowButton
                    title="Duplicate"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDuplicate(sec.id)
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </RowButton>
                  <RowButton
                    title="Delete"
                    danger
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemove(sec.id)
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </RowButton>
                </span>
              </div>

              {addTarget === i ? (
                <SectionCatalog onPick={handleAdd} onClose={() => setAddTarget(null)} />
              ) : null}
            </div>
          )
        })}
      </div>

      {/* Add a section (append) */}
      <div className="mt-2 border-t border-slate-100 pt-2">
        <button
          type="button"
          onClick={() => openCatalog('append')}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          <Plus className="h-4 w-4" /> Add a section
        </button>
        {addTarget === 'append' ? (
          <SectionCatalog onPick={handleAdd} onClose={() => setAddTarget(null)} />
        ) : null}
      </div>
    </div>
  )
}

function RowButton({
  title,
  onClick,
  danger,
  children,
}: {
  title: string
  onClick: (e: React.MouseEvent) => void
  danger?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition hover:bg-white ${
        danger ? 'hover:text-rose-600' : 'hover:text-slate-800'
      }`}
    >
      {children}
    </button>
  )
}

function InsertGap({ onClick, active }: { onClick: () => void; active: boolean }) {
  return (
    <div className="group/gap relative h-1.5">
      <button
        type="button"
        onClick={onClick}
        aria-label="Insert section here"
        className={`absolute inset-x-2 top-1/2 flex -translate-y-1/2 items-center justify-center transition ${
          active ? 'opacity-100' : 'opacity-0 group-hover/gap:opacity-100'
        }`}
      >
        <span className="h-px flex-1 bg-violet-300" />
        <span className="mx-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-white">
          <Plus className="h-3 w-3" />
        </span>
        <span className="h-px flex-1 bg-violet-300" />
      </button>
    </div>
  )
}

function SectionCatalog({
  onPick,
  onClose,
}: {
  onPick: (type: string) => void
  onClose: () => void
}) {
  return (
    <div className="mt-1 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex items-center justify-between px-1 pb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          Choose a section
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-[11px] text-slate-400 hover:text-slate-700"
        >
          Cancel
        </button>
      </div>
      {SECTION_GROUPS.map((group) => {
        const entries = SECTION_CATALOG.filter((e) => e.group === group)
        if (entries.length === 0) return null
        return (
          <div key={group} className="mb-2 last:mb-0">
            <p className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              {group}
            </p>
            <div className="grid grid-cols-1 gap-0.5">
              {entries.map((entry) => (
                <button
                  key={entry.type}
                  type="button"
                  onClick={() => onPick(entry.type)}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left hover:bg-slate-50"
                  title={entry.description}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                    <LucideIcon name={entry.icon} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-medium text-slate-800">{entry.label}</span>
                    <span className="block truncate text-[11px] text-slate-500">{entry.description}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
