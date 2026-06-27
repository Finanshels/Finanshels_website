'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { useAiGeneration, type AiGeneratePayload } from './useAiGeneration'

interface AiGeneratePopoverProps {
  payload: AiGeneratePayload
  multiChoice?: boolean
  charLimit?: { min: number; max: number }
  onUse: (text: string) => void
  onClose: () => void
  /** Positioning override for the absolutely-positioned panel. */
  align?: 'left' | 'right'
}

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
  align = 'right',
}: AiGeneratePopoverProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { text, status, error, generate, stop, reset } = useAiGeneration()
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
      if (ref.current && !ref.current.contains(e.target as Node)) {
        stop()
        onClose()
      }
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
  }, [onClose, stop])

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

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="AI suggestion"
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'absolute top-full z-50 mt-2 w-[420px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-cms-rule bg-white shadow-xl',
        align === 'right' ? 'right-0' : 'left-0',
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
    </div>
  )
}
