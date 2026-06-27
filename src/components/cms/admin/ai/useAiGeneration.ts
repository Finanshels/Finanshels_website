'use client'

import { useCallback, useRef, useState } from 'react'
import type { AiGenerateField } from '@/lib/cms/ai/fieldMap'

export type AiStatus = 'idle' | 'loading' | 'done' | 'error'

export interface AiGeneratePayload {
  field: AiGenerateField
  model: 'haiku' | 'sonnet'
  title?: string
  body?: string
  fieldLabel?: string
  collection?: string
}

interface AiGenerationState {
  text: string
  status: AiStatus
  error: string | null
  generate: (payload: AiGeneratePayload) => Promise<void>
  stop: () => void
  reset: () => void
}

/**
 * Streams plain text from POST /api/admin/ai/generate. The route returns a raw
 * text stream (AI SDK v5 `toTextStreamResponse`), so we read the body reader
 * directly — no protocol framing to keep in sync with the SDK version.
 */
export function useAiGeneration(): AiGenerationState {
  const [text, setText] = useState('')
  const [status, setStatus] = useState<AiStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const generate = useCallback(async (payload: AiGeneratePayload) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setText('')
    setError(null)
    setStatus('loading')

    try {
      const res = await fetch('/api/admin/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      if (!res.ok || !res.body) {
        let message = 'AI generation failed. Please try again.'
        try {
          const data = await res.json()
          if (data?.error) message = String(data.error)
        } catch {
          /* non-JSON error body */
        }
        setError(message)
        setStatus('error')
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setText(acc)
      }
      acc += decoder.decode()
      setText(acc)
      setStatus('done')
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      setError('Connection lost. Please try again.')
      setStatus('error')
    }
  }, [])

  const stop = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setText('')
    setError(null)
    setStatus('idle')
  }, [])

  return { text, status, error, generate, stop, reset }
}
