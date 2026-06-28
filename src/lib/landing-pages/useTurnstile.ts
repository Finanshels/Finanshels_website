'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Shared Cloudflare Turnstile widget hook.
 *
 * Loads the explicit-render script once, renders the widget into `mountRef`,
 * and exposes the verification `token`. When `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
 * is unset, the widget is skipped and `token` stays empty — callers should send
 * `siteKey ? token : undefined` so dev/preview (where Turnstile is bypassed)
 * still works. In production the server fails closed when no token arrives
 * (see `verifyTurnstile`, FIX-059).
 *
 * Mirrors the inline integration in LeadForm / EbookDownloadForm /
 * WebinarRegisterForm; new forms should use this hook instead of re-copying it.
 */
type TurnstileApi = {
  render: (
    container: string | HTMLElement,
    options: {
      sitekey: string
      callback?: (token: string) => void
      'error-callback'?: () => void
      'expired-callback'?: () => void
      theme?: 'light' | 'dark' | 'auto'
    }
  ) => string
  reset: (widgetId?: string) => void
}

function getTurnstile(): TurnstileApi | undefined {
  return (window as unknown as { turnstile?: TurnstileApi }).turnstile
}

const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

export interface UseTurnstileResult {
  /** Site key, or undefined when Turnstile is not configured for this build. */
  siteKey: string | undefined
  /** Current verification token ('' until the user solves the challenge). */
  token: string
  /** Attach to the element the widget should render into. */
  mountRef: React.MutableRefObject<HTMLDivElement | null>
  /** Reset the widget + clear the token (call after a failed submit). */
  reset: () => void
}

export function useTurnstile(): UseTurnstileResult {
  const [token, setToken] = useState('')
  const mountRef = useRef<HTMLDivElement | null>(null)
  const widgetId = useRef<string | null>(null)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!siteKey || !mountRef.current) return
    let cancelled = false

    function tryRender() {
      const api = getTurnstile()
      if (cancelled || !api || !mountRef.current) return
      if (widgetId.current !== null) return
      try {
        widgetId.current = api.render(mountRef.current, {
          sitekey: siteKey!,
          callback: (t) => setToken(t),
          'error-callback': () => setToken(''),
          'expired-callback': () => setToken(''),
          theme: 'auto',
        })
      } catch {
        /* retry on next interval */
      }
    }

    if (getTurnstile()) {
      tryRender()
      return () => {
        cancelled = true
      }
    }

    let script = document.querySelector<HTMLScriptElement>(`script[src^="${TURNSTILE_SCRIPT_SRC}"]`)
    if (!script) {
      script = document.createElement('script')
      script.src = TURNSTILE_SCRIPT_SRC
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
    const interval = window.setInterval(tryRender, 200)
    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [siteKey])

  const reset = useCallback(() => {
    const api = getTurnstile()
    if (widgetId.current && api) {
      api.reset(widgetId.current)
      setToken('')
    }
  }, [])

  return { siteKey, token, mountRef, reset }
}
