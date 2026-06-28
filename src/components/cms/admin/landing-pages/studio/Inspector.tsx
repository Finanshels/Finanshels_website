'use client'

import { Copy, Eye, EyeOff, Trash2 } from 'lucide-react'
import { getSectionCatalogEntry } from '@/lib/landing-pages/sectionCatalog'
import type { LandingPageSection } from '@/lib/landing-pages/types'
import { FieldEditor } from '../fields/FieldEditor'
import { LucideIcon } from '../fields/lucideClient'
import { PageSettings } from './PageSettings'
import type { EditorState } from './studioTypes'

/**
 * The contextual inspector. It shows exactly ONE of:
 * - page-level settings (when the "Page settings" outline row is selected), or
 * - the selected section's fields, or
 * - an empty state.
 *
 * This is the core fix for "right pane is one long stack of every section's
 * form" — only the active thing is shown.
 */
export function Inspector({
  mode,
  selectedSection,
  state,
  setState,
  setSlug,
  onUpdateSection,
  onToggleEnabled,
  onDuplicate,
  onRemove,
}: {
  mode: 'page' | 'section' | 'empty'
  selectedSection: LandingPageSection | null
  state: EditorState
  setState: React.Dispatch<React.SetStateAction<EditorState>>
  setSlug: (v: string) => void
  onUpdateSection: (id: string, patch: Partial<LandingPageSection>) => void
  onToggleEnabled: (id: string, enabled: boolean) => void
  onDuplicate: (id: string) => void
  onRemove: (id: string) => void
}) {
  if (mode === 'page') {
    return (
      <div className="p-3">
        <PageSettings state={state} setState={setState} setSlug={setSlug} />
      </div>
    )
  }

  if (mode === 'section' && selectedSection) {
    return (
      <SectionFields
        section={selectedSection}
        onUpdate={(patch) => onUpdateSection(selectedSection.id, patch)}
        onToggleEnabled={(enabled) => onToggleEnabled(selectedSection.id, enabled)}
        onDuplicate={() => onDuplicate(selectedSection.id)}
        onRemove={() => onRemove(selectedSection.id)}
      />
    )
  }

  return (
    <div className="flex h-full min-h-[280px] flex-col items-center justify-center p-8 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <LucideIcon name="MousePointerClick" className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium text-slate-700">Nothing selected</p>
      <p className="mt-1 max-w-[220px] text-xs text-slate-500">
        Click a section in the preview or the outline to edit it — or add a new section from the outline.
      </p>
    </div>
  )
}

function SectionFields({
  section,
  onUpdate,
  onToggleEnabled,
  onDuplicate,
  onRemove,
}: {
  section: LandingPageSection
  onUpdate: (patch: Partial<LandingPageSection>) => void
  onToggleEnabled: (enabled: boolean) => void
  onDuplicate: () => void
  onRemove: () => void
}) {
  const entry = getSectionCatalogEntry(section.type)

  function setProp(name: string, value: unknown) {
    onUpdate({ props: { ...section.props, [name]: value } })
  }

  return (
    <div className="flex h-full flex-col">
      {/* Sticky section header */}
      <div className="sticky top-0 z-10 flex items-start gap-2 border-b border-slate-100 bg-white/95 px-3 py-2.5 backdrop-blur">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <LucideIcon name={entry?.icon} className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[13px] font-semibold text-slate-900">{entry?.label ?? section.type}</h3>
          <p className="truncate text-[11px] text-slate-500">{entry?.description ?? 'Section'}</p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <HeaderButton
            title={section.enabled ? 'Hide section' : 'Show section'}
            onClick={() => onToggleEnabled(!section.enabled)}
          >
            {section.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </HeaderButton>
          <HeaderButton title="Duplicate section" onClick={onDuplicate}>
            <Copy className="h-4 w-4" />
          </HeaderButton>
          <HeaderButton title="Delete section" danger onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </HeaderButton>
        </div>
      </div>

      {!section.enabled ? (
        <div className="mx-4 mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          This section is hidden — it won’t appear on the published page.
        </div>
      ) : null}

      <div className="flex-1 space-y-3 p-3">
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
    </div>
  )
}

function HeaderButton({
  title,
  onClick,
  danger,
  children,
}: {
  title: string
  onClick: () => void
  danger?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 ${
        danger ? 'hover:border-rose-200 hover:text-rose-600' : 'hover:text-slate-800'
      }`}
    >
      {children}
    </button>
  )
}
