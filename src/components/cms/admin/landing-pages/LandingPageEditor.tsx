'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MediaLibraryProvider } from '@/components/cms/admin/MediaLibraryProvider'
import type { MediaPickerItem } from '@/components/cms/admin/MediaPickerModal'
import type { LandingPageDoc, LandingPageSection, LandingPageStatus } from '@/lib/landing-pages/types'
import { getSectionCatalogEntry } from '@/lib/landing-pages/sectionCatalog'
import { useLivePreview } from './useLivePreview'
import { CanvasPreview } from './studio/CanvasPreview'
import { Inspector } from './studio/Inspector'
import { OutlinePanel } from './studio/OutlinePanel'
import {
  genId,
  pageToState,
  slugify,
  stateToPayload,
  type DeviceKey,
  type EditorState,
  type SectionAction,
} from './studio/studioTypes'

type Selection = { kind: 'none' } | { kind: 'page' } | { kind: 'section'; id: string }

export default function LandingPageEditor({
  page,
  saveAction,
  mediaItems,
  bucketConfigured,
}: {
  page: LandingPageDoc
  saveAction: (formData: FormData) => void | Promise<void>
  mediaItems: MediaPickerItem[]
  bucketConfigured: boolean
}) {
  const [state, setState] = useState<EditorState>(() => pageToState(page))
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(() => slugify(page.internal_name) !== page.slug)
  const payload = useMemo(() => JSON.stringify(stateToPayload(state)), [state])
  const initialPayloadRef = useRef<string>(payload)
  const formRef = useRef<HTMLFormElement | null>(null)
  const isDirty = payload !== initialPayloadRef.current

  // ----- Selection + hover model (shared between outline, canvas, inspector) -----
  const [selection, setSelection] = useState<Selection>({ kind: 'none' })
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [device, setDevice] = useState<DeviceKey>('desktop')
  const selectedSectionId = selection.kind === 'section' ? selection.id : null
  const selectedSection = useMemo(
    () => (selectedSectionId ? state.sections.find((s) => s.id === selectedSectionId) ?? null : null),
    [state.sections, selectedSectionId],
  )

  // Slug auto-suggest until manually overridden.
  useEffect(() => {
    if (slugManuallyEdited) return
    const suggested = slugify(state.internal_name)
    if (suggested && suggested !== state.slug) {
      setState((s) => ({ ...s, slug: suggested }))
    }
  }, [state.internal_name, state.slug, slugManuallyEdited])

  // Cmd/Ctrl+S to save.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isSave = (e.metaKey || e.ctrlKey) && e.key === 's'
      if (!isSave) return
      e.preventDefault()
      if (formRef.current && isDirty) formRef.current.requestSubmit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isDirty])

  // Warn on unload if dirty.
  useEffect(() => {
    if (!isDirty) return
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  const setSlug = useCallback((v: string) => {
    setSlugManuallyEdited(true)
    setState((s) => ({ ...s, slug: v }))
  }, [])

  // ----- Section mutations (single source of truth lives here) -----
  const addSection = useCallback((type: string, atIndex: number | null) => {
    const entry = getSectionCatalogEntry(type)
    if (!entry) return
    const newSection: LandingPageSection = {
      id: genId(),
      type,
      enabled: true,
      props: JSON.parse(JSON.stringify(entry.defaultProps)),
    }
    setState((s) => {
      const next = s.sections.slice()
      const index = atIndex === null ? next.length : Math.min(Math.max(atIndex, 0), next.length)
      next.splice(index, 0, newSection)
      return { ...s, sections: next }
    })
    setSelection({ kind: 'section', id: newSection.id })
  }, [])

  const updateSection = useCallback((id: string, patch: Partial<LandingPageSection>) => {
    setState((s) => ({
      ...s,
      sections: s.sections.map((sec) => (sec.id === id ? { ...sec, ...patch } : sec)),
    }))
  }, [])

  const toggleEnabled = useCallback((id: string, enabled: boolean) => {
    updateSection(id, { enabled })
  }, [updateSection])

  const moveSection = useCallback((id: string, direction: -1 | 1) => {
    setState((s) => {
      const idx = s.sections.findIndex((sec) => sec.id === id)
      if (idx === -1) return s
      const target = idx + direction
      if (target < 0 || target >= s.sections.length) return s
      const next = s.sections.slice()
      const [item] = next.splice(idx, 1)
      next.splice(target, 0, item)
      return { ...s, sections: next }
    })
  }, [])

  const reorder = useCallback((from: number, to: number) => {
    setState((s) => {
      if (from === to || from < 0 || from >= s.sections.length) return s
      const next = s.sections.slice()
      const [item] = next.splice(from, 1)
      const target = Math.min(Math.max(to > from ? to - 1 : to, 0), next.length)
      next.splice(target, 0, item)
      return { ...s, sections: next }
    })
  }, [])

  const removeSection = useCallback((id: string) => {
    setState((s) => ({ ...s, sections: s.sections.filter((sec) => sec.id !== id) }))
    setSelection((cur) => (cur.kind === 'section' && cur.id === id ? { kind: 'none' } : cur))
  }, [])

  const duplicateSection = useCallback((id: string) => {
    setState((s) => {
      const idx = s.sections.findIndex((sec) => sec.id === id)
      if (idx === -1) return s
      const original = s.sections[idx]
      if (!original) return s
      const clone: LandingPageSection = {
        ...original,
        id: genId(),
        props: JSON.parse(JSON.stringify(original.props ?? {})),
      }
      const next = s.sections.slice()
      next.splice(idx + 1, 0, clone)
      return { ...s, sections: next }
    })
  }, [])

  // ----- Live preview bridge -----
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const previewPage = useMemo<LandingPageDoc>(
    () => ({ ...page, ...stateToPayload(state) }) as LandingPageDoc,
    [page, state],
  )

  const handleSelectFromPreview = useCallback((sectionId: string) => {
    setSelection({ kind: 'section', id: sectionId })
  }, [])

  const handleCanvasAction = useCallback(
    (action: SectionAction, sectionId: string) => {
      if (action === 'up') moveSection(sectionId, -1)
      else if (action === 'down') moveSection(sectionId, 1)
      else if (action === 'duplicate') duplicateSection(sectionId)
      else if (action === 'delete') removeSection(sectionId)
    },
    [moveSection, duplicateSection, removeSection],
  )

  useLivePreview({
    iframeRef,
    page: previewPage,
    selectedId: selectedSectionId,
    hoveredId,
    onSelect: handleSelectFromPreview,
    onHover: setHoveredId,
    onAction: handleCanvasAction,
  })

  const inspectorMode: 'page' | 'section' | 'empty' =
    selection.kind === 'page' ? 'page' : selectedSection ? 'section' : 'empty'

  return (
    <MediaLibraryProvider initialItems={mediaItems} bucketConfigured={bucketConfigured}>
      <div className="flex h-full min-h-0 flex-col">
        {/* Static toolbar: save controls */}
        <div className="flex flex-none flex-wrap items-center justify-end gap-3 border-b border-slate-200 bg-white px-4 py-2 sm:px-6">
          <form ref={formRef} action={saveAction} className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="id" value={page.id} />
            <input type="hidden" name="payload" value={payload} />
            {isDirty ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                <span className="size-1.5 rounded-full bg-amber-500" /> Unsaved
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                <span className="size-1.5 rounded-full bg-emerald-500" /> Saved
              </span>
            )}
            <select
              value={state.status}
              onChange={(e) => setState((s) => ({ ...s, status: e.target.value as LandingPageStatus }))}
              className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
              aria-label="Status"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <a
              href={`/landing-pages/${state.slug}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Open ↗
            </a>
            <button
              disabled={!isDirty}
              className="rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              title="Cmd/Ctrl+S"
            >
              {isDirty ? 'Save' : 'Saved'}
            </button>
          </form>
        </div>

        {/* Three-zone studio: outline | canvas | inspector */}
        <div className="grid min-h-0 flex-1 gap-3 p-3 sm:p-4 lg:grid-cols-[240px_minmax(0,1fr)_minmax(360px,400px)]">
          {/* Outline */}
          <div className="order-2 min-h-0 rounded-xl border border-slate-200 bg-white p-2 lg:order-none lg:h-full">
            <OutlinePanel
              sections={state.sections}
              selectedId={selectedSectionId}
              hoveredId={hoveredId}
              pageSelected={selection.kind === 'page'}
              onSelectPage={() => setSelection({ kind: 'page' })}
              onSelectSection={(id) => setSelection({ kind: 'section', id })}
              onHoverSection={setHoveredId}
              onAdd={addSection}
              onReorder={reorder}
              onToggleEnabled={toggleEnabled}
              onDuplicate={duplicateSection}
              onRemove={removeSection}
            />
          </div>

          {/* Canvas */}
          <div className="order-1 min-h-0 lg:order-none lg:h-full">
            <CanvasPreview pageId={page.id} iframeRef={iframeRef} device={device} onDeviceChange={setDevice} />
          </div>

          {/* Inspector */}
          <div className="order-3 min-h-0 overflow-y-auto rounded-xl border border-slate-200 bg-white lg:order-none lg:h-full">
            <Inspector
              mode={inspectorMode}
              selectedSection={selectedSection}
              state={state}
              setState={setState}
              setSlug={setSlug}
              onUpdateSection={updateSection}
              onToggleEnabled={toggleEnabled}
              onDuplicate={duplicateSection}
              onRemove={removeSection}
            />
          </div>
        </div>
      </div>
    </MediaLibraryProvider>
  )
}
