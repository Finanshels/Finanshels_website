'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { LandingPageDoc } from '@/lib/landing-pages/types'
import type { SectionAction } from './studio/studioTypes'

/**
 * Editor side of the Studio live-preview bridge.
 *
 * Outbound (editor → iframe):
 * - `lp:render`         push the current (unsaved) page, debounced.
 * - `lp:highlight`      the selected section (violet outline).
 * - `lp:hover-highlight`the section hovered in the OUTLINE (light outline).
 * - `lp:scrollto`       scroll a section into view (on selection from outline).
 *
 * Inbound (iframe → editor):
 * - `lp:ready`   first paint done; (re)send render + highlight.
 * - `lp:select`  a section was clicked on the canvas.
 * - `lp:hover`   a section is hovered on the canvas (null on leave).
 * - `lp:action`  an on-canvas toolbar button (move/duplicate/delete).
 *
 * Same-origin only; messages are targeted at window.location.origin.
 */
export function useLivePreview({
  iframeRef,
  page,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  onAction,
}: {
  iframeRef: RefObject<HTMLIFrameElement | null>
  page: LandingPageDoc
  selectedId: string | null
  hoveredId: string | null
  onSelect: (sectionId: string) => void
  onHover: (sectionId: string | null) => void
  onAction: (action: SectionAction, sectionId: string) => void
}) {
  const pageRef = useRef(page)
  pageRef.current = page
  const selectedRef = useRef(selectedId)
  selectedRef.current = selectedId
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const onHoverRef = useRef(onHover)
  onHoverRef.current = onHover
  const onActionRef = useRef(onAction)
  onActionRef.current = onAction
  const readyRef = useRef(false)

  const post = useCallback(
    (message: Record<string, unknown>) => {
      iframeRef.current?.contentWindow?.postMessage(message, window.location.origin)
    },
    [iframeRef],
  )

  const postRender = useCallback(() => {
    post({ type: 'lp:render', page: pageRef.current })
  }, [post])

  const postHighlight = useCallback(() => {
    post({ type: 'lp:highlight', sectionId: selectedRef.current })
  }, [post])

  // Debounced state push on every edit.
  useEffect(() => {
    if (!readyRef.current) return
    const t = setTimeout(postRender, 120)
    return () => clearTimeout(t)
  }, [page, postRender])

  // Selection highlight + scroll-into-view push.
  useEffect(() => {
    if (!readyRef.current) return
    postHighlight()
    if (selectedId) post({ type: 'lp:scrollto', sectionId: selectedId })
  }, [selectedId, postHighlight, post])

  // Outline-originated hover highlight push.
  useEffect(() => {
    if (!readyRef.current) return
    post({ type: 'lp:hover-highlight', sectionId: hoveredId })
  }, [hoveredId, post])

  // Inbound messages from the preview iframe.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return
      const data = e.data as
        | { type?: string; sectionId?: string | null; action?: SectionAction }
        | null
      if (!data || typeof data !== 'object') return
      if (data.type === 'lp:ready') {
        readyRef.current = true
        postRender()
        postHighlight()
      } else if (data.type === 'lp:select' && typeof data.sectionId === 'string') {
        onSelectRef.current(data.sectionId)
      } else if (data.type === 'lp:hover') {
        onHoverRef.current(typeof data.sectionId === 'string' ? data.sectionId : null)
      } else if (data.type === 'lp:action' && typeof data.sectionId === 'string' && data.action) {
        onActionRef.current(data.action, data.sectionId)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [postRender, postHighlight])
}
