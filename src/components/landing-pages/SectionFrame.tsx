'use client'

import { ChevronDown, ChevronUp, Copy, Trash2 } from 'lucide-react'
import type { SectionAction } from '@/components/cms/admin/landing-pages/studio/studioTypes'

/**
 * Edit-mode wrapper used ONLY inside the Studio live preview. It makes each
 * rendered section selectable/hoverable, shows an on-canvas quick-action
 * toolbar, and reports clicks/actions back to the editor.
 *
 * In production (editMode off) this component is never rendered — the renderer
 * outputs sections directly — so the public page is byte-identical.
 */
export function SectionFrame({
  sectionId,
  label,
  selected,
  hovered,
  onSelect,
  onHover,
  onAction,
  children,
}: {
  sectionId: string
  label: string
  selected: boolean
  hovered: boolean
  onSelect?: (id: string) => void
  onHover?: (id: string | null) => void
  onAction?: (action: SectionAction, id: string) => void
  children: React.ReactNode
}) {
  const active = selected || hovered

  function act(e: React.MouseEvent, action: SectionAction) {
    e.stopPropagation()
    onAction?.(action, sectionId)
  }

  return (
    <div
      data-lp-section-id={sectionId}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.(sectionId)
      }}
      onMouseEnter={() => onHover?.(sectionId)}
      onMouseLeave={() => onHover?.(null)}
      className={`relative cursor-pointer transition-[outline] ${
        selected
          ? 'outline outline-2 -outline-offset-2 outline-violet-500'
          : hovered
            ? 'outline outline-2 -outline-offset-2 outline-violet-300'
            : 'hover:outline hover:outline-2 hover:-outline-offset-2 hover:outline-violet-200'
      }`}
    >
      {active ? (
        <div className="pointer-events-none absolute left-0 top-0 z-20 flex items-center">
          <span className="rounded-br-md bg-violet-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            {label}
          </span>
        </div>
      ) : null}

      {active && onAction ? (
        <div className="absolute right-2 top-2 z-20 flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white/95 p-0.5 shadow-sm backdrop-blur">
          <button
            type="button"
            onClick={(e) => act(e, 'up')}
            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            title="Move up"
            aria-label="Move section up"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => act(e, 'down')}
            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            title="Move down"
            aria-label="Move section down"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => act(e, 'duplicate')}
            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            title="Duplicate"
            aria-label="Duplicate section"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => act(e, 'delete')}
            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-rose-50 hover:text-rose-600"
            title="Delete"
            aria-label="Delete section"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      {children}
    </div>
  )
}
