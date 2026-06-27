'use client'

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { MediaPickerModal, type MediaPickerAccept, type MediaPickerItem } from './MediaPickerModal'

type PickOptions = { accept?: MediaPickerAccept }

type MediaLibraryContextValue = {
  /** Opens the picker and resolves with the chosen URL, or null if dismissed. */
  pickMedia: (opts?: PickOptions) => Promise<string | null>
}

const MediaLibraryContext = createContext<MediaLibraryContextValue | null>(null)

export function useMediaLibrary(): MediaLibraryContextValue {
  const ctx = useContext(MediaLibraryContext)
  if (!ctx) {
    throw new Error('useMediaLibrary must be used within <MediaLibraryProvider>')
  }
  return ctx
}

type Props = {
  initialItems: MediaPickerItem[]
  bucketConfigured: boolean
  children: React.ReactNode
}

/**
 * Holds the media list once and renders a single picker modal for the whole
 * subtree. Image fields (even deep inside repeaters) call `pickMedia()` to open
 * it imperatively, avoiding prop-drilling and N modal instances.
 */
export function MediaLibraryProvider({ initialItems, bucketConfigured, children }: Props) {
  const [items, setItems] = useState<MediaPickerItem[]>(initialItems)
  const [open, setOpen] = useState(false)
  const [accept, setAccept] = useState<MediaPickerAccept>('any')
  const resolverRef = useRef<((url: string | null) => void) | null>(null)

  const settle = useCallback((url: string | null) => {
    const resolve = resolverRef.current
    resolverRef.current = null
    setOpen(false)
    if (resolve) resolve(url)
  }, [])

  const pickMedia = useCallback((opts?: PickOptions): Promise<string | null> => {
    setAccept(opts?.accept ?? 'any')
    setOpen(true)
    return new Promise<string | null>((resolve) => {
      resolverRef.current = resolve
    })
  }, [])

  const onUploaded = useCallback((item: MediaPickerItem) => {
    setItems((prev) => (prev.some((i) => i.url === item.url) ? prev : [item, ...prev]))
  }, [])

  const value = useMemo<MediaLibraryContextValue>(() => ({ pickMedia }), [pickMedia])

  return (
    <MediaLibraryContext.Provider value={value}>
      {children}
      <MediaPickerModal
        open={open}
        accept={accept}
        items={items}
        bucketConfigured={bucketConfigured}
        onClose={() => settle(null)}
        onSelect={(url) => settle(url)}
        onUploaded={onUploaded}
      />
    </MediaLibraryContext.Provider>
  )
}
