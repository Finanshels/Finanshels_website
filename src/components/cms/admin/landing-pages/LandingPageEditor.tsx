'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, Copy, GripVertical, Monitor, Plus, Smartphone, Tablet, Trash2 } from 'lucide-react'
import { SECTION_CATALOG, getSectionCatalogEntry, type SectionCatalogEntry } from '@/lib/landing-pages/sectionCatalog'
import { SERVICE_INTERESTS } from '@/lib/landing-pages/serviceInterests'
import { MediaLibraryProvider } from '@/components/cms/admin/MediaLibraryProvider'
import type { MediaPickerItem } from '@/components/cms/admin/MediaPickerModal'
import { PublishControls, type PublishStatus, type SavingState } from '@/components/cms/admin/PublishControls'
import { FieldEditor } from './fields/FieldEditor'
import { LucideIcon } from './fields/lucideClient'
import { useLivePreview } from './useLivePreview'
import type {
  HeroVariant,
  LandingPageDoc,
  LandingPageSection,
  LandingPageStatus,
} from '@/lib/landing-pages/types'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/** "Published 2h ago" style label for the publish toolbar; null when never published. */
function formatPublishedAtLabel(at: Date | null): string | null {
  if (!at) return null
  const diffMs = Date.now() - at.getTime()
  const mins = Math.round(diffMs / 60_000)
  if (mins < 1) return 'Published just now'
  if (mins < 60) return `Published ${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `Published ${hours}h ago`
  const days = Math.round(hours / 24)
  return `Published ${days}d ago`
}

type Tab = 'content' | 'settings' | 'seo'

type DeviceKey = 'desktop' | 'tablet' | 'mobile'

/**
 * Device frames render the page at its TRUE viewport width, then scale-to-fit
 * the available pane. This is the only way "Desktop" shows the real desktop
 * layout instead of reflowing to the narrow editor pane.
 */
const DEVICES: Array<{ key: DeviceKey; label: string; width: number; Icon: React.ComponentType<{ className?: string }> }> = [
  { key: 'desktop', label: 'Desktop', width: 1280, Icon: Monitor },
  { key: 'tablet', label: 'Tablet', width: 834, Icon: Tablet },
  { key: 'mobile', label: 'Mobile', width: 390, Icon: Smartphone },
]

/** Catalog grouping order for the "Add a section" picker. */
const SECTION_GROUPS = ['Hero', 'Trust', 'Value', 'Conversion', 'Objection'] as const

type EditorState = {
  slug: string
  internal_name: string
  status: LandingPageStatus
  service_interest: string
  google_ads_conversion_id: string
  conversion_labels: { form_submit: string; call_click: string; whatsapp_click: string }
  primary_phone: string
  whatsapp_number: string
  whatsapp_prefilled_message: string
  form_destination_emails: string
  thank_you_redirect_url: string
  sections: LandingPageSection[]
  theme: {
    accent_color: string
    hero_variant: HeroVariant
    show_sticky_mobile_cta_bar: boolean
    show_floating_whatsapp_button: boolean
    badge_text: string
  }
  seo: {
    title: string
    description: string
    og_image_url: string
    allow_indexing: boolean
    canonical_url: string
  }
}

function pageToState(page: LandingPageDoc): EditorState {
  return {
    slug: page.slug,
    internal_name: page.internal_name,
    status: page.status,
    service_interest: page.service_interest,
    google_ads_conversion_id: page.google_ads_conversion_id,
    conversion_labels: { ...page.conversion_labels },
    primary_phone: page.primary_phone,
    whatsapp_number: page.whatsapp_number,
    whatsapp_prefilled_message: page.whatsapp_prefilled_message ?? '',
    form_destination_emails: (page.form_destination_emails ?? []).join(', '),
    thank_you_redirect_url: page.thank_you_redirect_url ?? '',
    sections: page.sections,
    theme: {
      accent_color: page.theme.accent_color ?? '',
      hero_variant: page.theme.hero_variant,
      show_sticky_mobile_cta_bar: page.theme.show_sticky_mobile_cta_bar,
      show_floating_whatsapp_button: page.theme.show_floating_whatsapp_button,
      badge_text: page.theme.badge_text ?? '',
    },
    seo: {
      title: page.seo.title,
      description: page.seo.description,
      og_image_url: page.seo.og_image_url ?? '',
      allow_indexing: page.seo.allow_indexing,
      canonical_url: page.seo.canonical_url ?? '',
    },
  }
}

function stateToPayload(s: EditorState) {
  return {
    slug: s.slug.trim(),
    internal_name: s.internal_name.trim(),
    status: s.status,
    service_interest: s.service_interest,
    google_ads_conversion_id: s.google_ads_conversion_id.trim(),
    conversion_labels: s.conversion_labels,
    primary_phone: s.primary_phone.trim(),
    whatsapp_number: s.whatsapp_number.trim(),
    whatsapp_prefilled_message: s.whatsapp_prefilled_message.trim(),
    form_destination_emails: s.form_destination_emails
      .split(/[,\n]/)
      .map((e) => e.trim())
      .filter(Boolean),
    thank_you_redirect_url: s.thank_you_redirect_url.trim(),
    sections: s.sections,
    theme: s.theme,
    seo: s.seo,
  }
}

function genId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `s_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}

export default function LandingPageEditor({
  page,
  saveAction,
  publishAction,
  unpublishAction,
  mediaItems,
  bucketConfigured,
}: {
  page: LandingPageDoc
  saveAction: (formData: FormData) => void | Promise<void>
  publishAction: (formData: FormData) => void | Promise<void>
  unpublishAction: (formData: FormData) => void | Promise<void>
  mediaItems: MediaPickerItem[]
  bucketConfigured: boolean
}) {
  const [tab, setTab] = useState<Tab>('content')
  const [state, setState] = useState<EditorState>(() => pageToState(page))
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(() => slugify(page.internal_name) !== page.slug)
  const payload = useMemo(() => JSON.stringify(stateToPayload(state)), [state])
  const initialPayloadRef = useRef<string>(payload)
  const formRef = useRef<HTMLFormElement | null>(null)
  const isDirty = payload !== initialPayloadRef.current

  // ----- Autosave (Phase 5) -----
  // The form save is a "save draft": status stays put, the live snapshot is
  // untouched, and `has_unpublished_changes` is recomputed server-side. We add a
  // focused 3s debounce that submits this same form, so edits persist without a
  // full AutosaveManager port (the landing form posts one JSON `payload` blob to
  // a Server Action, not the CMS field-by-field autosave route).
  const [savingState, setSavingState] = useState<SavingState>('idle')
  const lastSavedPayloadRef = useRef<string>(payload)
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const AUTOSAVE_DELAY_MS = 3000

  // Live draft↔published separation: `has_unpublished_changes` is the persisted
  // diff from the published snapshot (set by markDraftDirty); `isDirty` covers
  // in-session edits not yet saved. Either means the draft is ahead of live, so
  // PublishControls offers "Republish".
  const hasUnpublishedChanges = page.has_unpublished_changes || isDirty

  // PublishControls' status union includes 'in_review' (CMS-only); landing has no
  // review state, so its narrower status maps straight through.
  const publishStatus: PublishStatus = page.status

  const publishedAtLabel = formatPublishedAtLabel(page.last_published_at ?? page.published_at)

  // Mark the form "saving" optimistically on submit (manual, autosave, or Cmd+S);
  // the action redirects on success so this primarily covers the in-flight window.
  const markSaving = useCallback(() => {
    setSavingState('saving')
    lastSavedPayloadRef.current = payload
  }, [payload])

  // PublishControls renders its own field-less <form action={...}>, so bind the
  // doc id + current draft payload into the actions here (publish persists the
  // draft first, then snapshots it).
  const runPublish = useCallback(async () => {
    const fd = new FormData()
    fd.set('id', page.id)
    fd.set('payload', payload)
    await publishAction(fd)
  }, [page.id, payload, publishAction])

  const runUnpublish = useCallback(async () => {
    const fd = new FormData()
    fd.set('id', page.id)
    await unpublishAction(fd)
  }, [page.id, unpublishAction])

  // Slug auto-suggest: when internal_name changes and slug hasn't been manually edited yet,
  // recompute slug from internal_name.
  useEffect(() => {
    if (slugManuallyEdited) return
    const suggested = slugify(state.internal_name)
    if (suggested && suggested !== state.slug) {
      setState((s) => ({ ...s, slug: suggested }))
    }
  }, [state.internal_name, state.slug, slugManuallyEdited])

  // Cmd/Ctrl+S to save
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

  // Debounced autosave of the draft. Submits the same save-draft form 3s after
  // edits settle, so work persists without a click. The save-draft action
  // redirects on success (re-rendering with fresh `page` data), which is what
  // resets dirty state — autosave just automates the submit, it never goes live.
  useEffect(() => {
    if (!isDirty) return
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
    autosaveTimerRef.current = setTimeout(() => {
      if (formRef.current && payload !== lastSavedPayloadRef.current) {
        formRef.current.requestSubmit()
      }
    }, AUTOSAVE_DELAY_MS)
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
    }
  }, [payload, isDirty])

  // Warn on unload if dirty
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

  // ----- Live preview bridge -----
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [device, setDevice] = useState<DeviceKey>('desktop')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // A full LandingPageDoc reflecting unsaved edits, pushed into the iframe.
  const previewPage = useMemo<LandingPageDoc>(
    () => ({ ...page, ...stateToPayload(state) }) as LandingPageDoc,
    [page, state],
  )

  const handleSelectFromPreview = useCallback((sectionId: string) => {
    setSelectedId(sectionId)
    setTab('content')
  }, [])

  useLivePreview({ iframeRef, page: previewPage, selectedId, onSelect: handleSelectFromPreview })

  // ----- Scale-to-fit device frame -----
  // Measure the available pane width and the viewport height, then render the
  // iframe at its real device width scaled down to fit. The visible canvas keeps
  // a constant height; the iframe scrolls internally.
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const [paneWidth, setPaneWidth] = useState(0)
  const [canvasHeight, setCanvasHeight] = useState(640)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width
      if (w) setPaneWidth(w)
    })
    ro.observe(el)
    function onResize() {
      setCanvasHeight(Math.max(520, Math.round(window.innerHeight - 230)))
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const deviceWidth = DEVICES.find((d) => d.key === device)?.width ?? 1280
  const scale = paneWidth > 0 ? Math.min(1, paneWidth / deviceWidth) : 1
  const zoomPct = Math.round(scale * 100)

  return (
    <MediaLibraryProvider initialItems={mediaItems} bucketConfigured={bucketConfigured}>
      <div className="flex flex-col gap-4">
        {/* Topbar: device toggle + save controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
          <div className="inline-flex items-center gap-0.5 rounded-lg border border-slate-200 p-0.5">
            {DEVICES.map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => setDevice(d.key)}
                aria-label={d.label}
                aria-pressed={device === d.key}
                title={d.label}
                className={`rounded-md p-1.5 ${device === d.key ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <d.Icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Save-draft form. Cmd/Ctrl+S, the manual "Save draft" button, and
                the debounced autosave all submit this. status is carried unchanged
                in the payload — going live is the Publish button's job. */}
            <form ref={formRef} action={saveAction} onSubmit={markSaving} className="flex items-center gap-2">
              <input type="hidden" name="id" value={page.id} />
              <input type="hidden" name="payload" value={payload} />
              <button
                disabled={!isDirty}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                title="Save draft (Cmd/Ctrl+S)"
              >
                {isDirty ? 'Save draft' : 'Saved'}
              </button>
            </form>

            {/* Two-version publish toolbar: Publish / Republish / Unpublish +
                Preview / View live + autosave indicator. Replaces the old status
                dropdown + go-live-on-save button. */}
            <PublishControls
              status={publishStatus}
              hasUnpublishedChanges={hasUnpublishedChanges}
              savingState={savingState}
              publishedAtLabel={publishedAtLabel}
              previewUrl={`/landing-pages/${state.slug}?preview=1`}
              liveUrl={page.status === 'published' ? `/landing-pages/${state.slug}` : null}
              canPublish
              publishAction={runPublish}
              unpublishAction={runUnpublish}
            />
          </div>
        </div>

        {/* Two-pane: live preview + inspector */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(380px,440px)] lg:items-start">
          <div className="lg:sticky lg:top-4">
            <div className="rounded-xl border border-slate-200 bg-slate-100 p-3">
              <div ref={canvasRef} className="flex justify-center" style={{ height: canvasHeight }}>
                <div
                  className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5"
                  style={{ width: deviceWidth * scale, height: canvasHeight }}
                >
                  <iframe
                    ref={iframeRef}
                    title="Live preview"
                    src={`/admin/cms/landing-pages/${page.id}/preview`}
                    style={{
                      width: deviceWidth,
                      height: scale > 0 ? canvasHeight / scale : canvasHeight,
                      border: 0,
                      transform: `scale(${scale})`,
                      transformOrigin: 'top left',
                    }}
                  />
                </div>
              </div>
            </div>
            <p className="mt-1.5 text-center text-[11px] text-slate-400">
              {DEVICES.find((d) => d.key === device)?.label} · {deviceWidth}px{zoomPct < 100 ? ` · ${zoomPct}%` : ''} · click any section to edit it
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center gap-1 border-b border-slate-200 px-2">
              {(['content', 'settings', 'seo'] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`-mb-px border-b-2 px-3 py-2.5 text-sm font-medium ${
                    tab === t ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t === 'content' ? 'Content' : t === 'settings' ? 'Settings' : 'SEO'}
                </button>
              ))}
            </div>
            <div className="p-3">
              {tab === 'content' ? (
                <ContentTab state={state} setState={setState} selectedId={selectedId} onSelect={setSelectedId} />
              ) : tab === 'settings' ? (
                <SettingsTab state={state} setState={setState} setSlug={setSlug} />
              ) : (
                <SeoTab state={state} setState={setState} />
              )}
            </div>
          </div>
        </div>
      </div>
    </MediaLibraryProvider>
  )
}

// ---------------- Content tab ----------------

function ContentTab({
  state,
  setState,
  selectedId,
  onSelect,
}: {
  state: EditorState
  setState: React.Dispatch<React.SetStateAction<EditorState>>
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const [showCatalog, setShowCatalog] = useState(false)

  function addSection(type: string) {
    const entry = getSectionCatalogEntry(type)
    if (!entry) return
    const newSection: LandingPageSection = {
      id: genId(),
      type,
      enabled: true,
      props: JSON.parse(JSON.stringify(entry.defaultProps)),
    }
    setState((s) => ({ ...s, sections: [...s.sections, newSection] }))
    onSelect(newSection.id)
    setShowCatalog(false)
  }

  function updateSection(id: string, patch: Partial<LandingPageSection>) {
    setState((s) => ({
      ...s,
      sections: s.sections.map((sec) => (sec.id === id ? { ...sec, ...patch } : sec)),
    }))
  }

  function moveSection(id: string, direction: -1 | 1) {
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
  }

  function removeSection(id: string) {
    setState((s) => ({ ...s, sections: s.sections.filter((sec) => sec.id !== id) }))
  }

  function duplicateSection(id: string) {
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
  }

  function reorder(from: number, to: number) {
    setState((s) => {
      if (from === to || from < 0 || from >= s.sections.length) return s
      const next = s.sections.slice()
      const [item] = next.splice(from, 1)
      // adjust `to` if removing earlier index shifts target
      const target = Math.min(Math.max(to > from ? to - 1 : to, 0), next.length)
      next.splice(target, 0, item)
      return { ...s, sections: next }
    })
  }

  return (
    <div className="space-y-3">
      {/* Add a section */}
      <div>
        <button
          type="button"
          onClick={() => setShowCatalog((v) => !v)}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50"
        >
          <Plus className="h-4 w-4" /> Add a section
        </button>
        {showCatalog ? (
          <div className="mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2">
            {SECTION_GROUPS.map((group) => {
              const entries = SECTION_CATALOG.filter((e) => e.group === group)
              if (entries.length === 0) return null
              return (
                <div key={group} className="mb-2 last:mb-0">
                  <p className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{group}</p>
                  <div className="grid grid-cols-1 gap-1">
                    {entries.map((entry) => (
                      <button
                        key={entry.type}
                        type="button"
                        onClick={() => addSection(entry.type)}
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left hover:bg-slate-50"
                        title={entry.description}
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                          <LucideIcon name={entry.icon} className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-slate-800">{entry.label}</span>
                          <span className="block truncate text-xs text-slate-500">{entry.description}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : null}
      </div>

      {/* Current sections */}
      {state.sections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
          No sections yet. Use “Add a section” above, or click a section in the preview.
        </div>
      ) : null}

      {state.sections.map((sec, i) => {
        const entry = getSectionCatalogEntry(sec.type)
        const isOver = overIndex === i && dragIndex !== null && dragIndex !== i
        return (
          <div
            key={sec.id}
            draggable
            onDragStart={(e) => {
              setDragIndex(i)
              e.dataTransfer.effectAllowed = 'move'
              try { e.dataTransfer.setData('text/plain', sec.id) } catch { /* some browsers reject */ }
            }}
            onDragOver={(e) => {
              if (dragIndex === null) return
              e.preventDefault()
              e.dataTransfer.dropEffect = 'move'
              if (overIndex !== i) setOverIndex(i)
            }}
            onDragLeave={() => {
              if (overIndex === i) setOverIndex(null)
            }}
            onDrop={(e) => {
              e.preventDefault()
              if (dragIndex !== null && dragIndex !== i) reorder(dragIndex, i)
              setDragIndex(null)
              setOverIndex(null)
            }}
            onDragEnd={() => {
              setDragIndex(null)
              setOverIndex(null)
            }}
            className={isOver ? 'ring-2 ring-blue-300 rounded-xl' : undefined}
          >
            <SectionRow
              section={sec}
              entry={entry}
              isFirst={i === 0}
              isLast={i === state.sections.length - 1}
              isSelected={selectedId === sec.id}
              onSelect={() => onSelect(sec.id)}
              onUpdate={(patch) => updateSection(sec.id, patch)}
              onMove={(dir) => moveSection(sec.id, dir)}
              onRemove={() => removeSection(sec.id)}
              onDuplicate={() => duplicateSection(sec.id)}
            />
          </div>
        )
      })}
    </div>
  )
}

function SectionRow({
  section,
  entry,
  isFirst,
  isLast,
  isSelected,
  onSelect,
  onUpdate,
  onMove,
  onRemove,
  onDuplicate,
}: {
  section: LandingPageSection
  entry: SectionCatalogEntry | null
  isFirst: boolean
  isLast: boolean
  isSelected: boolean
  onSelect: () => void
  onUpdate: (patch: Partial<LandingPageSection>) => void
  onMove: (dir: -1 | 1) => void
  onRemove: () => void
  onDuplicate: () => void
}) {
  const [open, setOpen] = useState(true)
  const rowRef = useRef<HTMLDivElement | null>(null)

  // When selected from the preview, expand and scroll this row into view.
  useEffect(() => {
    if (isSelected) {
      setOpen(true)
      rowRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [isSelected])

  function setProp(name: string, value: unknown) {
    onUpdate({ props: { ...section.props, [name]: value } })
  }

  return (
    <div
      ref={rowRef}
      className={`bg-white rounded-xl border transition ${
        isSelected ? 'border-violet-400 ring-2 ring-violet-200' : 'border-slate-200'
      } ${section.enabled ? '' : 'opacity-70'}`}
    >
      <div className={`flex items-center gap-2 px-3 py-2.5 ${open ? 'border-b border-slate-100' : ''}`}>
        {/* Drag handle */}
        <span
          className="shrink-0 cursor-grab text-slate-300 transition hover:text-slate-400 active:cursor-grabbing"
          aria-hidden="true"
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </span>

        {/* Reorder */}
        <div className="flex shrink-0 flex-col">
          <button type="button" disabled={isFirst} onClick={() => onMove(-1)} className="text-slate-400 transition hover:text-slate-700 disabled:opacity-30" aria-label="Move section up">
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button type="button" disabled={isLast} onClick={() => onMove(1)} className="text-slate-400 transition hover:text-slate-700 disabled:opacity-30" aria-label="Move section down">
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Title + description (click to expand/collapse) */}
        <button type="button" onClick={() => { onSelect(); setOpen((v) => !v) }} className="min-w-0 flex-1 text-left" aria-expanded={open}>
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-slate-900">{entry?.label ?? section.type}</span>
            {!section.enabled ? (
              <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Hidden</span>
            ) : null}
          </div>
          <div className="truncate text-xs text-slate-500">{entry?.description ?? 'Unknown section type'}</div>
        </button>

        {/* Controls */}
        <div className="flex shrink-0 items-center gap-0.5">
          <label
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-slate-600 transition hover:bg-slate-50"
            title={section.enabled ? 'Section is shown on the page' : 'Section is hidden from the page'}
          >
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
              checked={section.enabled}
              onChange={(e) => onUpdate({ enabled: e.target.checked })}
            />
            <span className="hidden sm:inline">Enabled</span>
          </label>
          <button
            type="button"
            onClick={onDuplicate}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
            title="Duplicate section"
            aria-label="Duplicate section"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            title="Remove section"
            aria-label="Remove section"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => { onSelect(); setOpen((v) => !v) }}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
            aria-label={open ? 'Collapse section' : 'Expand section'}
            aria-expanded={open}
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      {open ? (
        <div className="p-4 space-y-3">
          {entry?.fields?.length ? (
            entry.fields.map((field) => (
              <FieldEditor
                key={field.name}
                field={field}
                value={section.props[field.name]}
                onChange={(value) => setProp(field.name, value)}
              />
            ))
          ) : (
            <div className="text-sm text-slate-500">No editable fields for this section.</div>
          )}
        </div>
      ) : null}
    </div>
  )
}

// Field rendering now lives in ./fields/FieldEditor (structured repeater/image/
// icon/color editors). The inline form-only renderer was removed in the Studio
// Phase 1 upgrade.

// ---------------- Settings tab ----------------

function SettingsTab({ state, setState, setSlug }: {
  state: EditorState
  setState: React.Dispatch<React.SetStateAction<EditorState>>
  setSlug: (v: string) => void
}) {
  function set<K extends keyof EditorState>(key: K, value: EditorState[K]) {
    setState((s) => ({ ...s, [key]: value }))
  }
  function setTheme<K extends keyof EditorState['theme']>(key: K, value: EditorState['theme'][K]) {
    setState((s) => ({ ...s, theme: { ...s.theme, [key]: value } }))
  }
  function setLabel<K extends keyof EditorState['conversion_labels']>(key: K, value: string) {
    setState((s) => ({ ...s, conversion_labels: { ...s.conversion_labels, [key]: value } }))
  }

  return (
    <div className="space-y-4">
      <Card title="Identity">
        <Text label="Internal name" value={state.internal_name} onChange={(v) => set('internal_name', v)} required />
        <Text
          label="URL slug"
          value={state.slug}
          onChange={(v) => setSlug(slugify(v) || v.toLowerCase().replace(/\s+/g, '-'))}
          required
          hint="Used in /landing-pages/[slug] — auto-generated from internal name; edit to override"
        />
        <Select
          label="Service interest"
          value={state.service_interest}
          options={SERVICE_INTERESTS.map((s) => ({ label: s.label, value: s.value }))}
          onChange={(v) => set('service_interest', v)}
          required
          hint="Hidden field sent to Zoho when a lead submits"
        />
      </Card>

      <Card title="Contact / CTAs">
        <Text label="Primary phone (E.164)" value={state.primary_phone} onChange={(v) => set('primary_phone', v)} placeholder="+97150…" />
        <Text label="WhatsApp number (E.164)" value={state.whatsapp_number} onChange={(v) => set('whatsapp_number', v)} placeholder="+97150…" />
        <Textarea label="WhatsApp prefilled message" value={state.whatsapp_prefilled_message} onChange={(v) => set('whatsapp_prefilled_message', v)} />
        <Textarea
          label="Lead notification emails"
          hint="Comma- or newline-separated"
          value={state.form_destination_emails}
          onChange={(v) => set('form_destination_emails', v)}
        />
        <Text label="Thank-you redirect URL (optional)" value={state.thank_you_redirect_url} onChange={(v) => set('thank_you_redirect_url', v)} />
      </Card>

      <Card title="Theme">
        <Select
          label="Hero variant"
          value={state.theme.hero_variant}
          options={[
            { label: 'Split with form (default)', value: 'split-form' },
            { label: 'Centered with form', value: 'centered-form' },
            { label: 'Video + form', value: 'video-form' },
            { label: 'Urgency banner + split', value: 'urgency-banner' },
          ]}
          onChange={(v) => setTheme('hero_variant', v as HeroVariant)}
        />
        <Text label="Accent color (hex, optional)" value={state.theme.accent_color} onChange={(v) => setTheme('accent_color', v)} placeholder="#F59E0B" />
        <Text label="Header badge text" value={state.theme.badge_text} onChange={(v) => setTheme('badge_text', v)} placeholder="FTA-approved" />
        <Bool label="Sticky mobile CTA bar" checked={state.theme.show_sticky_mobile_cta_bar} onChange={(v) => setTheme('show_sticky_mobile_cta_bar', v)} />
        <Bool label="Floating WhatsApp button (desktop)" checked={state.theme.show_floating_whatsapp_button} onChange={(v) => setTheme('show_floating_whatsapp_button', v)} />
      </Card>

      <Card title="Google Ads tracking">
        <Text label="Conversion ID" value={state.google_ads_conversion_id} onChange={(v) => set('google_ads_conversion_id', v)} placeholder="AW-1234567890" />
        <Text label="Form submit label" value={state.conversion_labels.form_submit} onChange={(v) => setLabel('form_submit', v)} placeholder="abcDEFghi" />
        <Text label="Call click label" value={state.conversion_labels.call_click} onChange={(v) => setLabel('call_click', v)} />
        <Text label="WhatsApp click label" value={state.conversion_labels.whatsapp_click} onChange={(v) => setLabel('whatsapp_click', v)} />
      </Card>
    </div>
  )
}

// ---------------- SEO tab ----------------

function SeoTab({ state, setState }: { state: EditorState; setState: React.Dispatch<React.SetStateAction<EditorState>> }) {
  function setSeo<K extends keyof EditorState['seo']>(key: K, value: EditorState['seo'][K]) {
    setState((s) => ({ ...s, seo: { ...s.seo, [key]: value } }))
  }
  return (
    <div className="space-y-4">
      <Card title="Page SEO">
        <Text label="SEO title" value={state.seo.title} onChange={(v) => setSeo('title', v)} />
        <Textarea label="Meta description" value={state.seo.description} onChange={(v) => setSeo('description', v)} />
        <Text label="OG image URL" value={state.seo.og_image_url} onChange={(v) => setSeo('og_image_url', v)} />
        <Text label="Canonical URL (optional)" value={state.seo.canonical_url} onChange={(v) => setSeo('canonical_url', v)} />
      </Card>
      <Card title="Indexing">
        <Bool
          label="Allow search engine indexing"
          checked={state.seo.allow_indexing}
          onChange={(v) => setSeo('allow_indexing', v)}
        />
        <p className="text-xs text-slate-500 leading-relaxed">
          By default landing pages are <code className="bg-slate-100 rounded px-1">noindex,nofollow</code> and excluded from <code className="bg-slate-100 rounded px-1">sitemap.xml</code>.
          Only enable this if you want this page to appear in organic search.
        </p>
      </Card>
    </div>
  )
}

// ---------------- Small UI primitives ----------------

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function Text({
  label,
  value,
  onChange,
  required,
  placeholder,
  hint,
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; hint?: string }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-800">{label}{required ? <span className="text-rose-600"> *</span> : null}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      {hint ? <span className="block mt-1 text-xs text-slate-500">{hint}</span> : null}
    </label>
  )
}

function Textarea({
  label,
  value,
  onChange,
  hint,
}: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-800">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      {hint ? <span className="block mt-1 text-xs text-slate-500">{hint}</span> : null}
    </label>
  )
}

function Select({
  label,
  value,
  options,
  onChange,
  required,
  hint,
}: {
  label: string
  value: string
  options: Array<{ label: string; value: string }>
  onChange: (v: string) => void
  required?: boolean
  hint?: string
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-800">{label}{required ? <span className="text-rose-600"> *</span> : null}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      >
        <option value="">—</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {hint ? <span className="block mt-1 text-xs text-slate-500">{hint}</span> : null}
    </label>
  )
}

function Bool({
  label,
  checked,
  onChange,
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="font-medium text-slate-800">{label}</span>
    </label>
  )
}
