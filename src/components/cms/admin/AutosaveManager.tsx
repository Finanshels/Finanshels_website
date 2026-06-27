'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { AutosaveState } from './AutosaveIndicator'

interface AutosaveManagerProps {
  formId: string
  collection: string
  slug: string
  /** Retained for the parent's wiring; autosave never writes status (see doSave). */
  currentStatus?: string
  onStateChange: (state: AutosaveState, savedAt?: Date) => void
  delayMs?: number
}

export function AutosaveManager({
  formId,
  collection,
  slug,
  onStateChange,
  delayMs = 3000,
}: AutosaveManagerProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDirtyRef = useRef(false)
  // FIX-051: monotonic request id + AbortController. Out-of-order autosave
  // responses must not overwrite newer edits, and an in-flight save is aborted
  // when a newer save (or a manual submit) starts.
  const seqRef = useRef(0)
  const inFlightRef = useRef<AbortController | null>(null)

  const doSave = useCallback(async () => {
    const form = document.getElementById(formId) as HTMLFormElement | null
    if (!form) return

    // Supersede any in-flight save — its response is now stale.
    inFlightRef.current?.abort()
    const controller = new AbortController()
    inFlightRef.current = controller
    const mySeq = ++seqRef.current
    // FIX-053: bound the request so a hung connection can't pin the indicator on
    // "Saving…" forever. A timeout aborts and surfaces as an error (distinct from
    // a supersede-abort, which is silent).
    let timedOut = false
    const timeoutId = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, 15000)

    onStateChange('saving')

    const formData = new FormData(form)
    // FIX-051: autosave must NEVER change workflow status. Status is an explicit
    // action (the segmented control submits the form). upsert merges, so omitting
    // `status` preserves whatever is stored — preventing the old bug where a
    // stale render-time status reverted the user's selection.
    const body: Record<string, unknown> = { collection, slug }
    formData.forEach((val, key) => {
      if (key === 'status') return
      body[key] = val
    })

    try {
      const res = await fetch('/api/admin/cms/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
      if (!res.ok) throw new Error(await res.text())
      if (mySeq !== seqRef.current) return // a newer save started; ignore this result
      isDirtyRef.current = false
      onStateChange('saved', new Date())
    } catch {
      // A timeout aborts too, but unlike a supersede it's a real failure to report.
      if (timedOut) {
        if (mySeq === seqRef.current) onStateChange('error')
        return
      }
      if (controller.signal.aborted) return // superseded — not a real failure
      if (mySeq !== seqRef.current) return
      // FIX-051: keep the dirty flag on failure so edits aren't considered saved;
      // the next keystroke / Cmd+S retries and the beforeunload guard stays armed.
      onStateChange('error')
    } finally {
      clearTimeout(timeoutId)
    }
  }, [formId, collection, slug, onStateChange])

  useEffect(() => {
    const form = document.getElementById(formId) as HTMLFormElement | null
    if (!form) return

    const schedule = () => {
      isDirtyRef.current = true
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(doSave, delayMs)
    }

    // FIX-051: a manual submit must win. Cancel the pending autosave and abort any
    // in-flight request so the two writers never race on the same document.
    const onSubmit = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      inFlightRef.current?.abort()
      seqRef.current++ // invalidate any outstanding autosave response
      isDirtyRef.current = false
    }

    form.addEventListener('input', schedule)
    form.addEventListener('change', schedule)
    form.addEventListener('submit', onSubmit)

    return () => {
      form.removeEventListener('input', schedule)
      form.removeEventListener('change', schedule)
      form.removeEventListener('submit', onSubmit)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [formId, delayMs, doSave])

  // FIX-051: warn before navigating away with unsaved edits (still within the
  // debounce window, or after a failed save).
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirtyRef.current) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [])

  // Save on Cmd+S / Ctrl+S
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        if (e.repeat) return
        if (isDirtyRef.current) doSave()
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [doSave])

  return null
}
