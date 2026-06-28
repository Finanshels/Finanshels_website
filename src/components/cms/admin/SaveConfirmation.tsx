'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

/**
 * Transient, action-aware confirmation shown after a manual save/publish.
 *
 * Why this exists: every editor action used to redirect to `?saved=1` and render
 * one permanent "Saved · cache refreshed" pill — so Republish/Unpublish/Publish
 * were indistinguishable, and the pill lingered (and could sit next to a stale
 * autosave "Save failed", since the server-action redirect is a soft navigation
 * that doesn't remount the header). This reads the action `kind` from the server,
 * announces it, auto-dismisses, and strips the URL params so a refresh / back
 * doesn't replay it. Re-mount it with a changing `key` (the redirect nonce) so a
 * repeated action shows the toast again.
 */

type Tone = 'success' | 'info' | 'notice'

const KIND_MESSAGE: Record<string, { text: string; tone: Tone; icon: string }> = {
  published: { text: 'Published — now live on the site', tone: 'success', icon: '✓' },
  republished: { text: 'Republished — your changes are live', tone: 'success', icon: '✓' },
  unpublished: { text: 'Unpublished — removed from the site', tone: 'notice', icon: '●' },
  review: { text: 'Submitted for review', tone: 'info', icon: '✓' },
  saved: { text: 'Saved · cache refreshed', tone: 'success', icon: '✓' },
}

const TONE_CLASS: Record<Tone, string> = {
  success: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  info: 'border-blue-200 bg-blue-50 text-blue-700',
  notice: 'border-amber-300 bg-amber-50 text-amber-800',
}

const DISMISS_MS = 4500

export function SaveConfirmation({ kind }: { kind: string }) {
  const message = KIND_MESSAGE[kind] ?? KIND_MESSAGE.saved
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Drop the confirmation params from the URL so a refresh / Back doesn't
    // replay the toast or leave it stuck on.
    const url = new URL(window.location.href)
    let changed = false
    for (const key of ['saved', 'sn']) {
      if (url.searchParams.has(key)) {
        url.searchParams.delete(key)
        changed = true
      }
    }
    if (changed) {
      // Preserve the existing history state (Next's router keeps scroll/prefetch
      // metadata there) — replacing it with null can break scroll restoration.
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
    }
    const t = setTimeout(() => setVisible(false), DISMISS_MS)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide',
        TONE_CLASS[message.tone],
      )}
    >
      <span aria-hidden>{message.icon}</span>
      {message.text}
    </span>
  )
}
