'use client'

import { useEffect, useState } from 'react'
import LandingPageRenderer from '@/components/landing-pages/LandingPageRenderer'
import type { LandingPageDoc } from '@/lib/landing-pages/types'

type IncomingMessage =
  | { type: 'lp:render'; page: LandingPageDoc }
  | { type: 'lp:highlight'; sectionId: string | null }

export default function LivePreviewClient({ initialPage }: { initialPage: LandingPageDoc }) {
  const [page, setPage] = useState<LandingPageDoc>(initialPage)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    let received = false
    let timer: ReturnType<typeof setTimeout> | undefined

    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return
      const data = e.data as IncomingMessage | null
      if (!data || typeof data !== 'object') return
      if (data.type === 'lp:render' && data.page) {
        received = true
        setPage(data.page)
      } else if (data.type === 'lp:highlight') {
        setSelectedId(data.sectionId ?? null)
      }
    }
    window.addEventListener('message', onMessage)

    // Announce readiness, retrying until the first render lands. This survives
    // the race where the editor's listener attaches after our first ping.
    let tries = 0
    function announce() {
      if (received || !window.parent || window.parent === window) return
      window.parent.postMessage({ type: 'lp:ready' }, window.location.origin)
      tries += 1
      if (tries < 12) timer = setTimeout(announce, 250)
    }
    announce()

    return () => {
      window.removeEventListener('message', onMessage)
      if (timer) clearTimeout(timer)
    }
  }, [])

  function emit(message: { type: string; sectionId: string | null }) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(message, window.location.origin)
    }
  }

  return (
    <LandingPageRenderer
      page={page}
      isPreview
      editMode
      selectedId={selectedId}
      onSelectSection={(id) => emit({ type: 'lp:select', sectionId: id })}
      onHoverSection={(id) => emit({ type: 'lp:hover', sectionId: id })}
    />
  )
}
