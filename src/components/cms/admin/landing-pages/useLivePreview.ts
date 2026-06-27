'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { LandingPageDoc } from '@/lib/landing-pages/types'

/**
 * Editor side of the Studio live-preview bridge.
 *
 * - Pushes the current (unsaved) page into the preview iframe on every change,
 *   debounced, once the iframe says it's ready.
 * - Pushes the current selection so the preview can outline it.
 * - Listens for clicks coming back from the preview and reports the section id.
 *
 * Same-origin only; messages are targeted at window.location.origin.
 */
export function useLivePreview({
  iframeRef,
  page,
  selectedId,
  onSelect,
}: {
  iframeRef: RefObject<HTMLIFrameElement | null>
  page: LandingPageDoc
  selectedId: string | null
  onSelect: (sectionId: string) => void
}) {
  const pageRef = useRef(page)
  pageRef.current = page
  const selectedRef = useRef(selectedId)
  selectedRef.current = selectedId
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const readyRef = useRef(false)

  const postRender = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'lp:render', page: pageRef.current },
      window.location.origin,
    )
  }, [iframeRef])

  const postHighlight = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'lp:highlight', sectionId: selectedRef.current },
      window.location.origin,
    )
  }, [iframeRef])

  // Debounced state push on every edit.
  useEffect(() => {
    if (!readyRef.current) return
    const t = setTimeout(postRender, 120)
    return () => clearTimeout(t)
  }, [page, postRender])

  // Selection highlight push.
  useEffect(() => {
    if (!readyRef.current) return
    postHighlight()
  }, [selectedId, postHighlight])

  // Inbound messages from the preview iframe.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return
      const data = e.data as { type?: string; sectionId?: string } | null
      if (!data || typeof data !== 'object') return
      if (data.type === 'lp:ready') {
        readyRef.current = true
        postRender()
        postHighlight()
      } else if (data.type === 'lp:select' && typeof data.sectionId === 'string') {
        onSelectRef.current(data.sectionId)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [postRender, postHighlight])
}
