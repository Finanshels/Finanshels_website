'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { SiteAnnouncement } from '@/lib/cms/siteAnnouncementTypes'

/**
 * FIX-078: site-wide nudge + countdown. A dismissable bottom-left card (the
 * chat widget owns bottom-right) driven by the `site_config/announcement` doc.
 * When a countdown deadline is set it ticks live and the card auto-hides once
 * the deadline lapses. Dismissal persists per message via localStorage.
 */

const TONE: Record<SiteAnnouncement['tone'], string> = {
  brand: 'bg-[#f16610] text-white',
  dark: 'bg-slate-900 text-white',
  urgent: 'bg-red-600 text-white',
}

function remaining(deadlineMs: number, nowMs: number) {
  const total = Math.max(0, Math.floor((deadlineMs - nowMs) / 1000))
  return {
    expired: deadlineMs - nowMs <= 0,
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

export function AnnouncementBar({ announcement }: { announcement: SiteAnnouncement }) {
  const { enabled, message, ctaLabel, ctaUrl, countdownTo, tone } = announcement
  const [mounted, setMounted] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [now, setNow] = useState(0)

  const storageKey = `fin-annc:${countdownTo ?? ''}:${message}`

  useEffect(() => {
    setMounted(true)
    setNow(Date.now())
    try {
      if (window.localStorage.getItem(storageKey) === '1') setDismissed(true)
    } catch {
      /* private mode — show the nudge */
    }
  }, [storageKey])

  useEffect(() => {
    if (!countdownTo) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [countdownTo])

  if (!enabled || !message.trim()) return null

  const deadlineMs = countdownTo ? Date.parse(countdownTo) : NaN
  const hasCountdown = Number.isFinite(deadlineMs)
  const time = hasCountdown && mounted ? remaining(deadlineMs, now) : null

  // Don't render until mounted (avoids SSR/client countdown + dismiss mismatch).
  if (!mounted) return null
  if (dismissed) return null
  if (time?.expired) return null

  const dismiss = () => {
    setDismissed(true)
    try {
      window.localStorage.setItem(storageKey, '1')
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-[60] w-[calc(100vw-2rem)] max-w-sm sm:w-auto">
      <div className={`relative rounded-2xl px-5 py-4 pr-10 shadow-xl ${TONE[tone]}`}>
        <button
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute right-2 top-2 rounded-full p-1 text-white/70 transition hover:bg-white/15 hover:text-white"
        >
          <X className="size-4" />
        </button>
        <p className="text-sm font-medium leading-snug">{message}</p>
        {time ? (
          <p className="mt-2 font-mono text-lg font-bold tabular-nums">
            {time.days > 0 ? `${time.days}d ` : ''}
            {pad(time.hours)}:{pad(time.minutes)}:{pad(time.seconds)}
          </p>
        ) : null}
        {ctaLabel && ctaUrl ? (
          <a
            href={ctaUrl}
            className="mt-3 inline-flex items-center rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold transition hover:bg-white/30"
          >
            {ctaLabel}
          </a>
        ) : null}
      </div>
    </div>
  )
}
