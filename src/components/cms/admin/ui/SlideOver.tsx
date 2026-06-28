'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface SlideOverProps {
  /** Called on backdrop click, Escape, or the close button. */
  onClose: () => void
  ariaLabel: string
  /** Left-aligned header content (the close button is rendered automatically). */
  header: ReactNode
  footer?: ReactNode
  children: ReactNode
}

/**
 * Right-side slide-over shell. Mount it only while open (key it on the entity
 * id so re-opening replays the entrance animation). Owns the backdrop, the
 * two-paint slide-in, Escape-to-close, body scroll-lock, and initial focus.
 */
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function SlideOver({ onClose, ariaLabel, header, footer, children }: SlideOverProps) {
  const [shown, setShown] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true))
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      // Keep Tab focus cycling inside the panel (lightweight focus trap).
      if (e.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={ariaLabel}>
      {/* Backdrop: non-focusable so it never becomes a Tab stop; Escape / X close via keyboard. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`absolute inset-0 bg-slate-900/40 transition-opacity duration-200 ${shown ? 'opacity-100' : 'opacity-0'}`}
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl outline-none transition-transform duration-200 ease-out ${
          shown ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-start gap-3 border-b border-cms-rule bg-cms-soft px-5 py-4">
          <div className="min-w-0 flex-1">{header}</div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-cms-hover hover:text-slate-700"
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">{children}</div>

        {footer ? (
          <footer className="border-t border-cms-rule bg-cms-soft px-5 py-3 text-xs text-slate-500">{footer}</footer>
        ) : null}
      </div>
    </div>
  )
}
