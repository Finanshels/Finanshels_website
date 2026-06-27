'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { AutosaveState } from './AutosaveIndicator'

interface AutosaveManagerProps {
  formId: string
  collection: string
  slug: string
  currentStatus: string
  onStateChange: (state: AutosaveState, savedAt?: Date) => void
  delayMs?: number
}

export function AutosaveManager({
  formId,
  collection,
  slug,
  currentStatus,
  onStateChange,
  delayMs = 3000,
}: AutosaveManagerProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDirtyRef = useRef(false)

  const doSave = useCallback(async () => {
    const form = document.getElementById(formId) as HTMLFormElement | null
    if (!form) return

    onStateChange('saving')

    const formData = new FormData(form)
    const body: Record<string, unknown> = { collection, slug, currentStatus }
    formData.forEach((val, key) => {
      body[key] = val
    })

    try {
      const res = await fetch('/api/admin/cms/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(await res.text())
      onStateChange('saved', new Date())
    } catch {
      onStateChange('error')
    }
    isDirtyRef.current = false
  }, [formId, collection, slug, currentStatus, onStateChange])

  useEffect(() => {
    const form = document.getElementById(formId) as HTMLFormElement | null
    if (!form) return

    const schedule = () => {
      isDirtyRef.current = true
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(doSave, delayMs)
    }

    form.addEventListener('input', schedule)
    form.addEventListener('change', schedule)

    return () => {
      form.removeEventListener('input', schedule)
      form.removeEventListener('change', schedule)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [formId, delayMs, doSave])

  // Save on Cmd+S / Ctrl+S
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        if (isDirtyRef.current) doSave()
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [doSave])

  return null
}
