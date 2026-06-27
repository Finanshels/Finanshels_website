'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

export type AutosaveState = 'idle' | 'saving' | 'saved' | 'error'

interface AutosaveIndicatorProps {
  state: AutosaveState
  savedAt?: Date
}

export function AutosaveIndicator({ state, savedAt }: AutosaveIndicatorProps) {
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (state === 'saving') {
      setLabel('Saving...')
      return
    }
    if (state === 'saved') {
      setLabel('Saved')
      const t = setTimeout(() => {
        setLabel(savedAt ? 'Autosaved just now' : '')
      }, 2000)
      return () => clearTimeout(t)
    }
    if (state === 'error') {
      setLabel('Save failed — check connection')
      return
    }
    if (state === 'idle' && savedAt) {
      // Refresh the relative time on an interval so it doesn't read "just now"
      // forever while the editor sits idle.
      const render = () => {
        const diff = Math.round((Date.now() - savedAt.getTime()) / 60_000)
        setLabel(diff < 1 ? 'Autosaved just now' : `Autosaved ${diff}m ago`)
      }
      render()
      const id = setInterval(render, 30_000)
      return () => clearInterval(id)
    }
  }, [state, savedAt])

  if (!label) return null

  return (
    <span
      className={cn('text-[12px] transition-all', state === 'error' ? 'text-red-500' : 'text-slate-400')}
      role="status"
      aria-live="polite"
    >
      {state === 'saving' && (
        <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-slate-400" />
      )}
      {state === 'saved' && <span className="mr-1 text-emerald-500">✓</span>}
      {label}
    </span>
  )
}
