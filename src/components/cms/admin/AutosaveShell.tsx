'use client'

import { useState, useCallback } from 'react'
import { AutosaveManager } from './AutosaveManager'
import { AutosaveIndicator, type AutosaveState } from './AutosaveIndicator'

interface AutosaveShellProps {
  formId: string
  collection: string
  slug: string
  currentStatus: string
}

export function AutosaveShell({ formId, collection, slug, currentStatus }: AutosaveShellProps) {
  const [state, setState] = useState<AutosaveState>('idle')
  const [savedAt, setSavedAt] = useState<Date | undefined>()

  const handleStateChange = useCallback((s: AutosaveState, at?: Date) => {
    setState(s)
    if (at) setSavedAt(at)
  }, [])

  return (
    <>
      <AutosaveManager
        formId={formId}
        collection={collection}
        slug={slug}
        currentStatus={currentStatus}
        onStateChange={handleStateChange}
      />
      <AutosaveIndicator state={state} savedAt={savedAt} />
    </>
  )
}
