'use client'

import { useEffect, useState } from 'react'

type Remaining = { days: number; hours: number; minutes: number; seconds: number; done: boolean }

function diff(targetMs: number, nowMs: number): Remaining {
  const delta = Math.max(0, targetMs - nowMs)
  return {
    days: Math.floor(delta / 86_400_000),
    hours: Math.floor((delta % 86_400_000) / 3_600_000),
    minutes: Math.floor((delta % 3_600_000) / 60_000),
    seconds: Math.floor((delta % 60_000) / 1000),
    done: delta <= 0,
  }
}

/**
 * Counts down to the webinar start. Client-only so the live ticking and the
 * initial value both come from the viewer's clock (avoids SSR hydration drift).
 */
export function CountdownTimer({ targetIso }: { targetIso: string }) {
  const targetMs = new Date(targetIso).getTime()
  const [remaining, setRemaining] = useState<Remaining | null>(null)

  useEffect(() => {
    if (Number.isNaN(targetMs)) return
    const tick = () => setRemaining(diff(targetMs, Date.now()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [targetMs])

  if (Number.isNaN(targetMs) || !remaining) return null
  if (remaining.done) {
    return <p className="text-sm font-semibold text-rose-600">Starting now — join in.</p>
  }

  const units: Array<{ label: string; value: number }> = [
    { label: 'days', value: remaining.days },
    { label: 'hrs', value: remaining.hours },
    { label: 'min', value: remaining.minutes },
    { label: 'sec', value: remaining.seconds },
  ]

  return (
    <div className="flex gap-2" role="timer" aria-label="Time until the webinar starts">
      {units.map((u) => (
        <div
          key={u.label}
          className="flex min-w-[3.25rem] flex-col items-center rounded-xl border border-slate-200 bg-white px-2 py-1.5"
        >
          <span className="text-xl font-bold tabular-nums text-slate-900">
            {String(u.value).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{u.label}</span>
        </div>
      ))}
    </div>
  )
}
