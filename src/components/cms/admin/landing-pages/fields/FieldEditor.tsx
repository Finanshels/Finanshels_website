'use client'

import type { SectionFieldDef } from '@/lib/landing-pages/sectionCatalog'
import { ColorField } from './ColorField'
import { IconField } from './IconField'
import { ImageField } from './ImageField'
import { RepeaterField } from './RepeaterField'

export type FieldEditorProps = {
  field: SectionFieldDef
  value: unknown
  onChange: (next: unknown) => void
}

function countWords(input: string): number {
  const t = input.trim()
  return t ? t.split(/\s+/).length : 0
}

/** Live "words / recommended range" hint + optional coaching line. */
function Guidance({ field, value }: { field: SectionFieldDef; value: string }) {
  if (!field.recommendedRange && !field.guidance && !field.description) return null
  const words = countWords(value)
  const range = field.recommendedRange
  const inRange = range ? words >= range[0] && words <= range[1] : true
  return (
    <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
      {range ? (
        <span className={inRange ? 'text-emerald-600' : 'text-amber-600'}>
          {words} word{words === 1 ? '' : 's'} · aim for {range[0]}–{range[1]}
        </span>
      ) : null}
      {field.guidance ?? field.description ? <span>{field.guidance ?? field.description}</span> : null}
    </p>
  )
}

export function FieldEditor({ field, value, onChange }: FieldEditorProps) {
  if (field.type === 'boolean') {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        <span className="font-medium text-slate-800">{field.label}</span>
        {field.description ? <span className="text-xs text-slate-500">— {field.description}</span> : null}
      </label>
    )
  }

  if (field.type === 'select') {
    return (
      <label className="block text-[13px]">
        <span className="font-medium text-slate-800">{field.label}</span>
        <select
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-[13px]"
        >
          <option value="">—</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {field.description ? <p className="mt-1 text-xs text-slate-500">{field.description}</p> : null}
      </label>
    )
  }

  if (field.type === 'icon') return <IconField field={field} value={value} onChange={onChange} />
  if (field.type === 'color') return <ColorField field={field} value={value} onChange={onChange} />
  if (field.type === 'image') return <ImageField field={field} value={value} onChange={onChange} />
  if (field.type === 'repeater') return <RepeaterField field={field} value={value} onChange={onChange} />

  if (field.type === 'textarea' || field.type === 'rich_text') {
    const str = String(value ?? '')
    return (
      <label className="block text-[13px]">
        <span className="font-medium text-slate-800">
          {field.label}
          {field.required ? <span className="text-rose-600"> *</span> : null}
        </span>
        <textarea
          value={str}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-[13px]"
        />
        <Guidance field={field} value={str} />
      </label>
    )
  }

  if (field.type === 'number') {
    return (
      <label className="block text-[13px]">
        <span className="font-medium text-slate-800">{field.label}</span>
        <input
          type="number"
          value={typeof value === 'number' ? value : ''}
          onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
          className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-[13px]"
        />
        {field.description ? <p className="mt-1 text-xs text-slate-500">{field.description}</p> : null}
      </label>
    )
  }

  if (field.type === 'json') {
    return <JsonField field={field} value={value} onChange={onChange} />
  }

  // text / url / fallback
  const str = String(value ?? '')
  return (
    <label className="block text-[13px]">
      <span className="font-medium text-slate-800">
        {field.label}
        {field.required ? <span className="text-rose-600"> *</span> : null}
      </span>
      <input
        type={field.type === 'url' ? 'url' : 'text'}
        value={str}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-[13px]"
      />
      <Guidance field={field} value={str} />
    </label>
  )
}

/**
 * Legacy escape hatch — only reached when a stored value can't be expressed by
 * the structured editors (e.g. a malformed array from hand-edited history). Keeps
 * the raw data editable so nothing is silently dropped.
 */
function JsonField({ field, value, onChange }: FieldEditorProps) {
  return (
    <label className="block text-[13px]">
      <span className="font-medium text-slate-800">{field.label}</span>
      <textarea
        defaultValue={JSON.stringify(value ?? [], null, 2)}
        onChange={(e) => {
          const next = e.target.value
          if (!next.trim()) {
            onChange([])
            return
          }
          try {
            onChange(JSON.parse(next))
          } catch {
            /* keep typing; don't clobber on transient invalid JSON */
          }
        }}
        rows={8}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs"
      />
      <p className="mt-1 text-xs text-slate-500">Advanced (raw JSON).</p>
    </label>
  )
}
