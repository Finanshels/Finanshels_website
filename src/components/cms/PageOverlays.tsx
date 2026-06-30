'use client'

// Page-level overlay layer for promo blocks (`nudge` / `offer_banner` / `popup`)
// whose `display_mode` is `overlay`. Each overlay manages its own trigger
// (load / delay / scroll / exit-intent) and frequency cap (always / session /
// once) client-side. Receives plain serializable block data from the
// server-rendered PageBlocksRenderer — no server-only imports here.

import { useCallback, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { safeUrl } from '@/lib/cms/safeUrl'

type OverlayBlock = Record<string, unknown> & { type: string }

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

function num(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string' && v.trim()) {
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  }
  return null
}

/** Block-controlled hrefs are admin-authored but still gated against XSS schemes. */
const safeHref = safeUrl

const STORAGE_PREFIX = 'fin_overlay_'

function storageKey(block: OverlayBlock): string {
  return `${STORAGE_PREFIX}${block.type}_${str(block.id) || 'x'}`
}

function alreadySeen(block: OverlayBlock): boolean {
  const freq = str(block.frequency) || 'session'
  if (freq === 'always') return false
  try {
    const key = storageKey(block)
    if (freq === 'once') return window.localStorage.getItem(key) === '1'
    return window.sessionStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function rememberSeen(block: OverlayBlock): void {
  const freq = str(block.frequency) || 'session'
  if (freq === 'always') return
  try {
    const key = storageKey(block)
    if (freq === 'once') window.localStorage.setItem(key, '1')
    else window.sessionStorage.setItem(key, '1')
  } catch {
    /* storage unavailable — fail open (show once, can't persist) */
  }
}

function toneClasses(tone: string): { surface: string; cta: string } {
  if (tone === 'dark') {
    return {
      surface: 'bg-slate-950 text-white',
      cta: 'bg-white text-slate-900 hover:bg-slate-100',
    }
  }
  if (tone === 'light') {
    return {
      surface: 'bg-white text-slate-900 ring-1 ring-slate-200',
      cta: 'bg-brand-primary text-brand-dark hover:brightness-110',
    }
  }
  return {
    surface: 'bg-brand-primary text-brand-dark',
    cta: 'bg-slate-900 text-white hover:bg-slate-800',
  }
}

function useOverlayTrigger(block: OverlayBlock): { open: boolean; close: () => void } {
  const [open, setOpen] = useState(false)

  // Runs client-side only. SSR and the first client paint both render nothing
  // (open=false), so there is no hydration mismatch; the effect then decides
  // whether/when to reveal based on the trigger + frequency cap.
  useEffect(() => {
    if (alreadySeen(block)) return

    const trigger = str(block.trigger) || 'load'
    const value = num(block.triggerValue)

    if (trigger === 'load') {
      setOpen(true)
      return
    }
    if (trigger === 'delay') {
      const ms = Math.max(0, value ?? 3) * 1000
      const timer = window.setTimeout(() => setOpen(true), ms)
      return () => window.clearTimeout(timer)
    }
    if (trigger === 'scroll') {
      const pct = Math.min(100, Math.max(1, value ?? 50))
      const onScroll = () => {
        const scrolled = window.scrollY + window.innerHeight
        const total = document.documentElement.scrollHeight
        if (total > 0 && (scrolled / total) * 100 >= pct) {
          setOpen(true)
          window.removeEventListener('scroll', onScroll)
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      return () => window.removeEventListener('scroll', onScroll)
    }
    if (trigger === 'exit') {
      const onLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) setOpen(true)
      }
      document.addEventListener('mouseout', onLeave)
      return () => document.removeEventListener('mouseout', onLeave)
    }
  }, [block])

  // Count a shown overlay as "seen" so reloads honour session/once frequency.
  useEffect(() => {
    if (open) rememberSeen(block)
  }, [open, block])

  const close = useCallback(() => setOpen(false), [])
  return { open, close }
}

function DismissButton({ onClick, light }: { onClick: () => void; light?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Dismiss"
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${
        light ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-700' : 'text-current/70 hover:bg-white/15'
      }`}
    >
      <X className="h-4 w-4" />
    </button>
  )
}

function OfferBannerOverlay({ block }: { block: OverlayBlock }) {
  const { open, close } = useOverlayTrigger(block)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (open) requestAnimationFrame(() => setShown(true))
  }, [open])
  if (!open) return null

  const tone = str(block.tone) || 'brand'
  const { surface, cta } = toneClasses(tone)
  const placement = str(block.placement) === 'bottom' ? 'bottom' : 'top'
  const href = safeHref(block.ctaUrl)
  const ctaLabel = str(block.ctaLabel)

  return (
    <div
      role="region"
      aria-label="Promotional banner"
      className={`fixed inset-x-0 z-[60] ${placement === 'bottom' ? 'bottom-0' : 'top-0'} ${surface} shadow-[0_4px_24px_rgba(15,23,42,0.18)] transition-all duration-300 ${
        shown ? 'translate-y-0 opacity-100' : `${placement === 'bottom' ? 'translate-y-2' : '-translate-y-2'} opacity-0`
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <p className="min-w-0 flex-1 text-sm font-medium">{str(block.text)}</p>
        {href && ctaLabel ? (
          <a href={href} className={`hidden shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition sm:inline-flex ${cta}`}>
            {ctaLabel}
          </a>
        ) : null}
        {block.dismissible === false ? null : <DismissButton onClick={close} />}
      </div>
    </div>
  )
}

function NudgeOverlay({ block }: { block: OverlayBlock }) {
  const { open, close } = useOverlayTrigger(block)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (open) requestAnimationFrame(() => setShown(true))
  }, [open])
  if (!open) return null

  const tone = str(block.tone) || 'light'
  const { surface, cta } = toneClasses(tone)
  const placement = str(block.placement) || 'bottom-right'
  const posClass =
    placement === 'bottom-left'
      ? 'bottom-4 left-4'
      : placement === 'top-right'
        ? 'top-20 right-4'
        : placement === 'top-left'
          ? 'top-20 left-4'
          : 'bottom-4 right-4'
  const href = safeHref(block.ctaUrl)
  const ctaLabel = str(block.ctaLabel)
  const heading = str(block.heading)
  const text = str(block.text)
  const image = str(block.imageUrl)

  return (
    <div
      role="dialog"
      aria-label={heading || 'Notification'}
      className={`fixed z-[60] w-[min(360px,calc(100vw-2rem))] rounded-2xl ${surface} p-4 shadow-[0_24px_60px_rgba(15,23,42,0.22)] transition-all duration-300 ${posClass} ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      <div className="flex items-start gap-3">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- author-supplied remote avatar in a client overlay
          <img src={image} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
        ) : null}
        <div className="min-w-0 flex-1">
          {heading ? <p className="text-sm font-semibold">{heading}</p> : null}
          {text ? <p className="mt-0.5 text-sm opacity-80">{text}</p> : null}
          {href && ctaLabel ? (
            <a href={href} className={`mt-3 inline-flex rounded-lg px-3 py-1.5 text-xs font-semibold transition ${cta}`}>
              {ctaLabel}
            </a>
          ) : null}
        </div>
        <DismissButton onClick={close} light={tone === 'light'} />
      </div>
    </div>
  )
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function PopupOverlay({ block }: { block: OverlayBlock }) {
  const { open, close } = useOverlayTrigger(block)
  const [shown, setShown] = useState(false)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (open) requestAnimationFrame(() => setShown(true))
  }, [open])

  // Move focus into the dialog on open (WCAG dialog pattern).
  useEffect(() => {
    if (!open) return
    const node = dialogRef.current
    if (!node) return
    const focusables = node.querySelectorAll<HTMLElement>(FOCUSABLE)
    ;(focusables[0] ?? node).focus()
  }, [open])

  // Escape to close + trap Tab focus within the dialog.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const focusables = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (focusables.length === 0) {
        e.preventDefault()
        return
      }
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  if (!open) return null

  const heading = str(block.heading)
  const body = str(block.body)
  const image = str(block.imageUrl)
  const primaryHref = safeHref(block.ctaUrl)
  const primaryLabel = str(block.ctaLabel)
  const secondaryHref = safeHref(block.secondaryCtaUrl)
  const secondaryLabel = str(block.secondaryCtaLabel)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={heading || 'Dialog'}
      className={`fixed inset-0 z-[70] flex items-center justify-center p-4 transition-opacity duration-300 ${shown ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={close} aria-hidden />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`relative z-10 w-[min(460px,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-white shadow-[0_40px_120px_rgba(15,23,42,0.35)] outline-none transition-transform duration-300 ${
          shown ? 'scale-100' : 'scale-95'
        }`}
      >
        <div className="absolute right-3 top-3">
          <DismissButton onClick={close} light />
        </div>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- author-supplied remote image in a client overlay
          <img src={image} alt="" className="h-40 w-full object-cover" />
        ) : null}
        <div className="px-6 py-6">
          {heading ? <h2 className="text-xl font-semibold tracking-tight text-slate-900">{heading}</h2> : null}
          {body ? <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p> : null}
          {(primaryHref && primaryLabel) || (secondaryHref && secondaryLabel) ? (
            <div className="mt-5 flex flex-wrap gap-3">
              {primaryHref && primaryLabel ? (
                <a
                  href={primaryHref}
                  className="inline-flex rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-brand-dark hover:brightness-110"
                >
                  {primaryLabel}
                </a>
              ) : null}
              {secondaryHref && secondaryLabel ? (
                <a
                  href={secondaryHref}
                  className="inline-flex rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {secondaryLabel}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function PageOverlays({ blocks }: { blocks: OverlayBlock[] }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null
  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.type}-${str(block.id) || index}`
        switch (block.type) {
          case 'offer_banner':
            return <OfferBannerOverlay key={key} block={block} />
          case 'nudge':
            return <NudgeOverlay key={key} block={block} />
          case 'popup':
            return <PopupOverlay key={key} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}
