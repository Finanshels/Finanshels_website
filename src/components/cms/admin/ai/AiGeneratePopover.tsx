'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'
import { useAiGeneration, type AiGeneratePayload } from './useAiGeneration'

interface AiGeneratePopoverProps {
  payload: AiGeneratePayload
  multiChoice?: boolean
  charLimit?: { min: number; max: number }
  onUse: (text: string) => void
  onClose: () => void
  /** The trigger element the panel is anchored to. */
  anchorRef: React.RefObject<HTMLElement | null>
  /** Align the panel's left or right edge to the trigger. */
  align?: 'left' | 'right'
}

const PANEL_WIDTH = 420
const PANEL_MAX_HEIGHT = 420
const VIEWPORT_MARGIN = 8

type PanelPosition = { top: number; left: number; width: number }

function parseOptions(raw: string): string[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^\d+[.)]/.test(line))
    .map((line) => line.replace(/^\d+[.)]\s*/, '').replace(/^["']|["']$/g, '').trim())
    .filter(Boolean)
}

export function AiGeneratePopover({
  payload,
  multiChoice = false,
  charLimit,
  onUse,
  onClose,
  anchorRef,
  align = 'right',
}: AiGeneratePopoverProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { text, status, error, generate, stop, reset } = useAiGeneration()
  // FIX-054: the panel is portaled to <body> and fixed-positioned against the
  // trigger's rect. Rendering it inline made it clip against the editor's
  // scrollable rails (overflow-y-auto clips horizontal overflow too), cutting
  // off the suggestion text. Portaling escapes every overflow/stacking context.
  const [pos, setPos] = useState<PanelPosition | null>(null)

  useLayoutEffect(() => {
    const place = () => {
      const anchor = anchorRef.current
      if (!anchor) return
      const rect = anchor.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      const width = Math.min(PANEL_WIDTH, vw - VIEWPORT_MARGIN * 2)
      let left = align === 'left' ? rect.left : rect.right - width
      left = Math.max(VIEWPORT_MARGIN, Math.min(left, vw - width - VIEWPORT_MARGIN))
      // Drop below the trigger, but never let the panel run off the bottom edge.
      let top = rect.bottom + VIEWPORT_MARGIN
      top = Math.max(VIEWPORT_MARGIN, Math.min(top, vh - PANEL_MAX_HEIGHT - VIEWPORT_MARGIN))
      setPos({ top, left, width })
    }
    place()
    window.addEventListener('resize', place)
    // Capture phase so the editor rails' internal scroll repositions the panel.
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [anchorRef, align])
  // FIX-052: track the selection by index, not by option text. The option strings
  // change as the stream arrives, so a text-keyed selection silently deselected.
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  // Auto-start once on mount.
  useEffect(() => {
    void generate(payload)
    return () => stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Outside click + Escape close.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (ref.current?.contains(target)) return
      // Clicking the trigger toggles it shut on its own — don't double-handle.
      if (anchorRef.current?.contains(target)) return
      stop()
      onClose()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stop()
        onClose()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose, stop, anchorRef])

  const isLoading = status === 'loading'
  // FIX-052: only expose selectable options once streaming is DONE. Parsing the
  // partial stream made the option list shift mid-flight; while loading we show
  // the raw streaming text instead.
  const optionsReady = multiChoice && !isLoading
  const options = optionsReady ? parseOptions(text) : []
  const chosen = multiChoice ? (selectedIdx != null ? options[selectedIdx] ?? '' : '') : text.trim()
  const charCount = chosen.length

  const charColor = (() => {
    if (!charLimit || !chosen) return 'text-slate-400'
    return charCount >= charLimit.min && charCount <= charLimit.max ? 'text-emerald-600' : 'text-amber-600'
  })()

  const canUse = Boolean(chosen) && status !== 'loading'

  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-label="AI suggestion"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        width: pos?.width ?? PANEL_WIDTH,
        visibility: pos ? 'visible' : 'hidden',
      }}
      className={cn(
        'z-[100] overflow-hidden rounded-xl border border-cms-rule bg-white shadow-xl',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cms-rule bg-cms-soft px-4 py-2.5">
        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700">
          <span aria-hidden>✨</span>
          {isLoading ? 'AI is writing…' : error ? 'AI suggestion' : 'AI suggestion'}
        </span>
        <button
          type="button"
          onClick={() => {
            stop()
            onClose()
          }}
          aria-label="Close"
          className="text-lg leading-none text-slate-400 transition hover:text-slate-700"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="max-h-72 overflow-y-auto px-4 py-3">
        {error ? (
          <p className="text-[13px] text-red-600">{error}</p>
        ) : multiChoice && optionsReady ? (
          <div className="space-y-2">
            {options.map((opt, i) => (
              <label key={`${i}-${opt}`} className="group flex cursor-pointer items-start gap-2.5">
                <input
                  type="radio"
                  name="ai-option"
                  checked={selectedIdx === i}
                  onChange={() => setSelectedIdx(i)}
                  className="mt-0.5 accent-brand-primary"
                />
                <span className="text-[13px] leading-snug text-slate-700 transition group-hover:text-slate-900">
                  {opt}
                </span>
              </label>
            ))}
            {options.length === 0 && (
              <p className="text-[13px] text-slate-400">No options returned. Try regenerating.</p>
            )}
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-slate-700">
            {text || (isLoading ? <span className="animate-pulse text-slate-400">Writing…</span> : '')}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 border-t border-cms-rule px-4 py-2.5">
        <span className={cn('text-[11px] font-medium tabular-nums', charColor)}>
          {charLimit && chosen ? `${charCount} chars · ideal ${charLimit.min}–${charLimit.max}` : ''}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedIdx(null)
              reset()
              void generate(payload)
            }}
            disabled={isLoading}
            className="rounded-lg border border-cms-rule bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Regenerate
          </button>
          <button
            type="button"
            onClick={() => {
              stop()
              onClose()
            }}
            className="rounded-lg border border-cms-rule bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 transition hover:bg-gray-50"
          >
            Discard
          </button>
          <button
            type="button"
            disabled={!canUse}
            onClick={() => {
              if (chosen) {
                onUse(chosen)
                onClose()
              }
            }}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            Use this
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
