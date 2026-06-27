'use client'

// FIX-039: single field-editor used across the CMS editor (admin/cms/page.tsx)
// for both create (?intent=create) and edit (?slug=…) modes. Every CmsFieldType
// renders through one switch here, so `blocks`, `json`, `rows`, `icon`, `image`,
// `file`, `tags`, and `multi_reference` get their real editors instead of falling
// through to a plain `<input type="text">`.

import { lazy, Suspense, useState } from 'react'
import { CmsMultiReferencePick } from '@/components/cms/admin/CmsMultiReferencePick'
import { MediaField } from '@/components/cms/admin/MediaField'
import type { CmsFieldDefinition } from '@/lib/cms/collectionDefinitions'
import type { AiContext } from '@/lib/cms/ai/fieldMap'

// PERF: the Tiptap rich-text editor (StarterKit + ~13 extensions + ProseMirror)
// and the page-blocks editor are the two heaviest things in the admin bundle,
// and they were eagerly imported on every create/edit page — even for
// collections that render neither. Code-split them so they download only when a
// field actually needs them. The Suspense fallback below renders a hidden input
// that preserves the field's value, so submitting/autosaving before the chunk
// finishes loading can never wipe content.
const PageBlocksEditor = lazy(() => import('@/components/cms/admin/PageBlocksEditor'))
const RichTextField = lazy(() => import('@/components/cms/admin/RichTextField'))

/** Value-preserving placeholder shown while a heavy editor chunk loads. */
function EditorLoadingFallback({ name, value }: { name: string; value: string }) {
  return (
    <div className="mt-2">
      <input type="hidden" name={name} defaultValue={value} />
      <div className="h-[260px] animate-pulse rounded-xl border border-cms-rule bg-cms-soft" />
    </div>
  )
}

export type ReferenceOption = { id: string; label: string }

type Props = {
  field: CmsFieldDefinition
  /** Initial DOM value. The editor is uncontrolled — submission reads from the form. */
  value: string
  referenceOptions: Record<string, ReferenceOption[]>
  /** Suggested asset URLs that decorate URL/image/file inputs as a datalist. */
  mediaAssetUrls?: string[]
  /** Stable per open document so multi-reference picks remount after navigation. */
  documentHydrationKey?: string
  /** When set, long-form rich-text fields show an AI "Write" button in the toolbar. */
  aiContext?: AiContext
}

const inputClass =
  'mt-2 w-full rounded-xl border border-cms-rule bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'

/**
 * Heuristic mirrored from admin/cms/page.tsx. A long-body textarea earns the
 * Tiptap rich editor; everything else stays as a plain textarea.
 */
function isLongBodyField(field: CmsFieldDefinition): boolean {
  if (field.type === 'blocks') return true
  if (field.type !== 'textarea') return false
  const n = field.name.toLowerCase()
  return (
    n.includes('body') ||
    n.includes('content') ||
    n.includes('definition') ||
    n.includes('answer') ||
    n.includes('article') ||
    n.includes('story') ||
    n.includes('full_bio') ||
    n === 'bio' ||
    n === 'long_description' ||
    n === 'full_description'
  )
}

function fieldHint(field: CmsFieldDefinition): string | null {
  if (field.type === 'tags') return 'Use comma-separated values and press save to store.'
  if (field.type === 'json') return 'Valid JSON only. Invalid JSON will not be saved.'
  if (field.type === 'url') return 'Use full URL including https://'
  if (field.type === 'image')
    return 'Paste a stable https:// image URL (CDN recommended). Suggestions come from uploaded Media assets when available.'
  if (field.type === 'file') return 'Paste a downloadable file URL (storage/CDN).'
  if (field.type === 'icon')
    return 'Lucide icon name in kebab-case (example: arrow-right), or paste a https:// URL to force an image. The site maps names to lucide-react at render time.'
  if (field.type === 'datetime') return 'Use local datetime; this is saved as text/timestamp value.'
  if (field.type === 'boolean') return 'Choose true or false.'
  if (field.type === 'textarea') return 'Supports rich text/HTML where applicable.'
  return null
}

export function FieldEditor({
  field,
  value,
  referenceOptions,
  mediaAssetUrls = [],
  documentHydrationKey = '',
  aiContext,
}: Props) {
  const hint = fieldHint(field)
  // Live tag-chip preview: track the input so chips update as the user types,
  // instead of only refreshing after a save/reload.
  const [tagDraft, setTagDraft] = useState(value)
  const tagPreview =
    field.type === 'tags'
      ? tagDraft
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : []

  if (field.type === 'blocks') {
    return (
      <Suspense fallback={<EditorLoadingFallback name={field.name} value={value} />}>
        <PageBlocksEditor
          key={`${documentHydrationKey}:${field.name}`}
          name={field.name}
          initialValue={value}
          referenceOptions={referenceOptions}
        />
      </Suspense>
    )
  }

  if (field.type === 'textarea' || field.type === 'json' || field.type === 'rows') {
    if (field.type === 'textarea' && isLongBodyField(field)) {
      return (
        <Suspense fallback={<EditorLoadingFallback name={field.name} value={value} />}>
          <RichTextField
            key={`${documentHydrationKey}:${field.name}`}
            name={field.name}
            initialValue={value}
            placeholder={field.placeholder}
            aiContext={aiContext}
          />
        </Suspense>
      )
    }
    const isCode = field.type === 'json' || field.type === 'rows'
    const rowsAttr = field.type === 'json' ? 12 : field.type === 'rows' ? 6 : isLongBodyField(field) ? 16 : 5
    const rowsHint =
      field.type === 'rows'
        ? field.description ||
          (field.rowFormat ? `One per line. Format: ${field.rowFormat.join(' | ')}` : 'One per line.')
        : hint
    return (
      <>
        <textarea
          name={field.name}
          required={field.required}
          rows={rowsAttr}
          defaultValue={value}
          placeholder={field.placeholder}
          className={`${inputClass} ${isCode ? 'font-mono text-xs' : ''}`}
        />
        {rowsHint ? <p className="mt-1 text-xs text-slate-500">{rowsHint}</p> : null}
      </>
    )
  }

  if (field.type === 'select' && field.options?.length) {
    const defaultOption = typeof field.defaultValue === 'string' ? field.defaultValue : field.options[0]
    return (
      <>
        <select
          name={field.name}
          required={field.required}
          defaultValue={value !== '' ? value : field.options.includes('') ? '' : defaultOption}
          className={inputClass}
        >
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt || '— none —'}
            </option>
          ))}
        </select>
        {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      </>
    )
  }

  if (field.type === 'boolean') {
    const normalized = value.toLowerCase()
    const checked = normalized === 'true' || normalized === '1' || normalized === 'on' || normalized === 'yes'
    return (
      <label className="mt-2 inline-flex items-center gap-2 rounded-xl border border-cms-rule bg-white px-3 py-2 text-sm text-slate-700">
        <input
          type="checkbox"
          name={field.name}
          value="true"
          defaultChecked={checked}
          className="h-4 w-4 cursor-pointer rounded border-slate-300 bg-white accent-[var(--brand-primary,#f16610)]"
        />
        <span>Enabled</span>
      </label>
    )
  }

  if (field.type === 'datetime') {
    return (
      <>
        <input
          type="datetime-local"
          name={field.name}
          required={field.required}
          defaultValue={value}
          className={inputClass}
        />
        {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      </>
    )
  }

  if (field.type === 'reference') {
    const options = field.referenceCollection ? referenceOptions[field.referenceCollection] ?? [] : []
    return (
      <>
        <select name={field.name} required={field.required} defaultValue={value} className={inputClass}>
          <option value="">Select reference</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        {options.length === 0 ? (
          <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs text-amber-900">
            No documents to link yet in <span className="font-mono">{field.referenceCollection ?? '—'}</span>. Create one in that
            collection (or check Firestore config) so it appears here.
          </p>
        ) : null}
        {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      </>
    )
  }

  if (field.type === 'multi_reference') {
    const options = field.referenceCollection ? referenceOptions[field.referenceCollection] ?? [] : []
    return (
      <>
        <CmsMultiReferencePick
          key={`${documentHydrationKey}:${field.name}:${value}`}
          name={field.name}
          label={field.label}
          options={options}
          valueCsv={value}
        />
        {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      </>
    )
  }

  if (field.type === 'image' || field.type === 'file') {
    return (
      <MediaField
        name={field.name}
        initialValue={value}
        kind={field.type === 'image' ? 'image' : 'file'}
        required={field.required}
        placeholder={field.placeholder}
        suggestions={mediaAssetUrls}
        hint={hint}
      />
    )
  }

  const inputType =
    field.type === 'url'
      ? 'url'
      : field.type === 'number'
      ? 'number'
      : field.type === 'email'
      ? 'email'
      : 'text'
  // image/file are handled above by MediaField; only plain `url` keeps the datalist.
  const showAssetSuggestions = field.type === 'url' && mediaAssetUrls.length > 0
  return (
    <>
      <input
        type={inputType}
        step={field.type === 'number' ? 'any' : undefined}
        name={field.name}
        required={field.required}
        defaultValue={value}
        onChange={field.type === 'tags' ? (e) => setTagDraft(e.target.value) : undefined}
        placeholder={field.placeholder}
        list={showAssetSuggestions ? `${field.name}-asset-suggestions` : undefined}
        className={inputClass}
      />
      {showAssetSuggestions ? (
        <datalist id={`${field.name}-asset-suggestions`}>
          {mediaAssetUrls.map((url) => (
            <option key={`${field.name}-${url}`} value={url} />
          ))}
        </datalist>
      ) : null}
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      {tagPreview.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tagPreview.map((tag) => (
            <span
              key={`${field.name}-${tag}`}
              className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 text-xs text-brand-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </>
  )
}
