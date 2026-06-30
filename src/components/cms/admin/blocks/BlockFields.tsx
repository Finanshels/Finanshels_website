'use client'

// Reusable field grid for one CMS block instance. Shared by the page-builder
// (PageBlocksEditor) and the Notion-style inline block editor (CmsBlockNode) so
// the two editing surfaces never drift. Owns its own per-field JSON draft state
// (invalid JSON stays visible but is never propagated to the block value).

import { useCallback, useState } from 'react'
import type { CmsBlockField } from '@/lib/cms/collectionDefinitions'

export type ReferenceOptionMap = Record<string, Array<{ id: string; label: string }>>

type Props = {
  fields: CmsBlockField[]
  values: Record<string, unknown>
  onChange: (name: string, value: unknown) => void
  referenceOptions?: ReferenceOptionMap
  /** Unique prefix for datalist element ids (avoid collisions across instances). */
  idPrefix?: string
}

function fieldInputType(field: CmsBlockField): string {
  if (field.type === 'url') return 'url'
  if (field.type === 'email') return 'email'
  if (field.type === 'number') return 'number'
  return 'text'
}

function jsonStringify(value: unknown): string {
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return ''
  }
}

function tagsToString(value: unknown): string {
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'string') return value
  return ''
}

function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function parseMultiReference(raw: string, options: Array<{ id: string; label: string }>): string[] {
  const deduped = [...new Set(parseTags(raw))]
  if (options.length === 0) return deduped
  const valid = new Set(options.map((o) => o.id))
  return deduped.filter((id) => valid.has(id))
}

const inputClass =
  'mt-2 w-full rounded-lg border border-cms-rule bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'

export function BlockFields({ fields, values, onChange, referenceOptions = {}, idPrefix = 'block' }: Props) {
  const [jsonDrafts, setJsonDrafts] = useState<Record<string, { raw: string; invalid: boolean }>>({})

  const handleJsonChange = useCallback(
    (name: string, raw: string) => {
      if (!raw.trim()) {
        setJsonDrafts((prev) => {
          const next = { ...prev }
          delete next[name]
          return next
        })
        onChange(name, '')
        return
      }
      try {
        const parsed = JSON.parse(raw)
        setJsonDrafts((prev) => {
          const next = { ...prev }
          delete next[name]
          return next
        })
        onChange(name, parsed)
      } catch {
        setJsonDrafts((prev) => ({ ...prev, [name]: { raw, invalid: true } }))
      }
    },
    [onChange]
  )

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {fields.map((field) => {
        const value = values[field.name]
        const colSpan = field.type === 'textarea' || field.type === 'json' ? 'md:col-span-2' : 'md:col-span-1'
        return (
          <label key={field.name} className={`block text-sm font-medium text-slate-700 ${colSpan}`}>
            <span className="flex items-center gap-2">
              {field.label}
              {field.required ? (
                <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-brand-primary">
                  Required
                </span>
              ) : null}
            </span>
            {field.type === 'textarea' ? (
              <textarea
                rows={field.name === 'html' ? 8 : 4}
                value={typeof value === 'string' ? value : ''}
                onChange={(e) => onChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={inputClass}
              />
            ) : field.type === 'json' ? (
              (() => {
                const draft = jsonDrafts[field.name]
                const jsonInvalid = draft?.invalid === true
                return (
                  <>
                    <textarea
                      rows={6}
                      value={draft ? draft.raw : jsonStringify(value)}
                      onChange={(e) => handleJsonChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      spellCheck={false}
                      aria-invalid={jsonInvalid}
                      className={`mt-2 w-full rounded-lg border bg-white px-3 py-2 font-mono text-xs text-slate-900 outline-none focus:ring-2 ${
                        jsonInvalid
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-cms-rule focus:border-brand-primary focus:ring-brand-primary/20'
                      }`}
                    />
                    {jsonInvalid ? (
                      <p className="mt-1 text-xs text-red-600">
                        Invalid JSON — fix the syntax. The last valid value is kept until this parses.
                      </p>
                    ) : null}
                  </>
                )
              })()
            ) : field.type === 'select' && field.options?.length ? (
              <select
                value={typeof value === 'string' ? value : ''}
                onChange={(e) => onChange(field.name, e.target.value)}
                className={inputClass}
              >
                <option value="">— select —</option>
                {field.options.map((o) => (
                  <option key={o} value={o}>
                    {field.optionLabels?.[o] ?? o}
                  </option>
                ))}
              </select>
            ) : field.type === 'boolean' ? (
              <label className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={value === true}
                  onChange={(e) => onChange(field.name, e.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 bg-white accent-[var(--brand-primary,#f16610)]"
                />
                Enabled
              </label>
            ) : field.type === 'tags' ? (
              <input
                type="text"
                value={tagsToString(value)}
                onChange={(e) => onChange(field.name, parseTags(e.target.value))}
                placeholder={field.placeholder}
                className={inputClass}
              />
            ) : field.type === 'reference' ? (
              (() => {
                const current = typeof value === 'string' ? value : ''
                const baseOptions = field.referenceCollection ? referenceOptions[field.referenceCollection] ?? [] : []
                const mergedOptions =
                  current && !baseOptions.some((o) => o.id === current)
                    ? [{ id: current, label: `${current} (not in list)` }, ...baseOptions]
                    : baseOptions
                return (
                  <select value={current} onChange={(e) => onChange(field.name, e.target.value)} className={inputClass}>
                    <option value="">— select —</option>
                    {mergedOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )
              })()
            ) : field.type === 'multi_reference' ? (
              <input
                type="text"
                value={tagsToString(value)}
                onChange={(e) =>
                  onChange(
                    field.name,
                    parseMultiReference(
                      e.target.value,
                      field.referenceCollection ? referenceOptions[field.referenceCollection] ?? [] : []
                    )
                  )
                }
                placeholder="id-one, id-two"
                list={`${idPrefix}-${field.name}-suggest`}
                className={inputClass}
              />
            ) : (
              <input
                type={fieldInputType(field)}
                value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''}
                onChange={(e) => onChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={inputClass}
              />
            )}
            {field.type === 'multi_reference' && field.referenceCollection ? (
              <datalist id={`${idPrefix}-${field.name}-suggest`}>
                {(referenceOptions[field.referenceCollection] ?? []).map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </datalist>
            ) : null}
          </label>
        )
      })}
    </div>
  )
}
