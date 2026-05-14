'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { slugifyForCms } from '@/lib/cms/slugify'
import type { CmsCreateProfile, CmsCreateTemplate } from '@/lib/cms/createProfiles'
import type { CmsFieldDefinition } from '@/lib/cms/collectionDefinitions'

export type ReferenceOption = { id: string; label: string }

type Props = {
  profile: CmsCreateProfile
  fields: CmsFieldDefinition[]
  titleField: string
  collectionLabel: string
  collectionKey: string
  referenceOptions: Record<string, ReferenceOption[]>
  action: (formData: FormData) => Promise<{ ok: false; error: string } | void>
}

const initialValue = (field: CmsFieldDefinition): string => {
  if (field.defaultValue == null) return ''
  if (typeof field.defaultValue === 'string') return field.defaultValue
  if (typeof field.defaultValue === 'number' || typeof field.defaultValue === 'boolean') {
    return String(field.defaultValue)
  }
  return ''
}

export default function CmsCreateForm({
  profile,
  fields,
  titleField,
  collectionLabel,
  collectionKey,
  referenceOptions,
  action,
}: Props) {
  const templates = profile.templates ?? []
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? '')
  const [values, setValues] = useState<Record<string, string>>(() => {
    const seed: Record<string, string> = {}
    for (const f of fields) seed[f.name] = initialValue(f)
    return seed
  })
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const previewSlug = useMemo(
    () => slugifyForCms(values[titleField] ?? ''),
    [values, titleField]
  )

  const applyTemplate = (next: CmsCreateTemplate) => {
    setTemplateId(next.id)
    setValues((prev) => {
      const merged: Record<string, string> = { ...prev }
      for (const [k, v] of Object.entries(next.values)) {
        if (!prev[k]) merged[k] = v == null ? '' : String(v)
      }
      return merged
    })
  }

  const setField = (name: string, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }))

  const handleSubmit = (formData: FormData) => {
    setError(null)
    formData.set('templateId', templateId)
    startTransition(async () => {
      const result = await action(formData)
      if (result && result.ok === false) setError(result.error)
    })
  }

  return (
    <form action={handleSubmit} className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-10">
      <header className="flex flex-col gap-1">
        <Link
          href={`/admin/cms?collection=${collectionKey}`}
          className="text-sm text-slate-500 underline-offset-4 hover:underline"
        >
          ← Back to {collectionLabel}
        </Link>
        <h1 className="text-3xl font-semibold text-slate-900">{profile.heading}</h1>
        {profile.tagline ? <p className="text-sm text-slate-600">{profile.tagline}</p> : null}
      </header>

      {templates.length > 0 ? (
        <fieldset className="rounded-2xl border border-[#e8dccf] bg-white p-4">
          <legend className="px-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Start from
          </legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {templates.map((tpl) => (
              <button
                type="button"
                key={tpl.id}
                onClick={() => applyTemplate(tpl)}
                className={`rounded-xl border px-3 py-3 text-left transition ${
                  templateId === tpl.id
                    ? 'border-brand-primary bg-brand-primary/5'
                    : 'border-[#e8dccf] hover:border-brand-primary/40'
                }`}
              >
                <div className="text-sm font-semibold text-slate-900">{tpl.label}</div>
                <div className="mt-1 text-xs text-slate-500">{tpl.description}</div>
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800"
        >
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-5">
        {fields.map((field) => (
          <FieldInput
            key={field.name}
            field={field}
            value={values[field.name] ?? ''}
            onChange={(v) => setField(field.name, v)}
            referenceOptions={referenceOptions[field.name] ?? []}
          />
        ))}
      </div>

      {previewSlug ? (
        <p className="text-xs text-slate-500">
          Slug preview:{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5">/{previewSlug}</code>
        </p>
      ) : null}

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-[#e8dccf] bg-[#f7f3ee] px-6 py-4">
        <Link
          href={`/admin/cms?collection=${collectionKey}`}
          className="rounded-xl px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-brand-dark shadow-[0_12px_30px_rgba(241,102,16,0.25)] transition disabled:opacity-60"
        >
          {pending ? 'Creating…' : 'Create draft'}
        </button>
      </div>
    </form>
  )
}

function FieldInput({
  field,
  value,
  onChange,
  referenceOptions,
}: {
  field: CmsFieldDefinition
  value: string
  onChange: (v: string) => void
  referenceOptions: ReferenceOption[]
}) {
  const id = `field-${field.name}`
  const required = field.required ?? false
  const labelNode = (
    <label htmlFor={id} className="text-sm font-medium text-slate-800">
      {field.label}
      {required ? <span className="ml-1 text-red-600">*</span> : null}
    </label>
  )
  const wrap = (input: React.ReactNode) => (
    <div className="flex flex-col gap-1.5">
      {labelNode}
      {input}
      {field.description ? <p className="text-xs text-slate-500">{field.description}</p> : null}
    </div>
  )
  const base =
    'rounded-xl border border-[#e8dccf] bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-primary focus:outline-none'

  switch (field.type) {
    case 'textarea':
      return wrap(
        <textarea
          id={id}
          name={field.name}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder={field.placeholder}
          className={base}
        />
      )
    case 'select':
      return wrap(
        <select
          id={id}
          name={field.name}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        >
          <option value="">Select…</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )
    case 'reference':
      return wrap(
        referenceOptions.length === 0 ? (
          <div className={`${base} text-slate-500`}>
            No options yet — create one first in its collection.
          </div>
        ) : (
          <select
            id={id}
            name={field.name}
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={base}
          >
            <option value="">Select…</option>
            {referenceOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        )
      )
    case 'multi_reference':
      return wrap(
        <div className="flex flex-col gap-1.5 rounded-xl border border-[#e8dccf] bg-white px-3 py-2 text-sm">
          {referenceOptions.length === 0 ? (
            <span className="text-slate-500">
              No options yet — create one first in its collection.
            </span>
          ) : (
            referenceOptions.map((opt) => {
              const selected = value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
              const checked = selected.includes(opt.id)
              return (
                <label key={opt.id} className="flex items-center gap-2 text-slate-800">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const next = new Set(selected)
                      if (e.target.checked) next.add(opt.id)
                      else next.delete(opt.id)
                      onChange(Array.from(next).join(','))
                    }}
                  />
                  {opt.label}
                </label>
              )
            })
          )}
          <input type="hidden" name={field.name} value={value} />
        </div>
      )
    case 'boolean':
      return (
        <label className="flex items-center gap-2 text-sm text-slate-800">
          <input
            id={id}
            type="checkbox"
            name={field.name}
            checked={value === 'true'}
            onChange={(e) => onChange(e.target.checked ? 'true' : 'false')}
          />
          {field.label}
        </label>
      )
    case 'number':
      return wrap(
        <input
          id={id}
          type="number"
          name={field.name}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={base}
        />
      )
    case 'datetime':
      return wrap(
        <input
          id={id}
          type="datetime-local"
          name={field.name}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      )
    case 'email':
      return wrap(
        <input
          id={id}
          type="email"
          name={field.name}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={base}
        />
      )
    case 'url':
    case 'image':
    case 'file':
      return wrap(
        <input
          id={id}
          type="url"
          name={field.name}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? 'https://...'}
          className={base}
        />
      )
    case 'tags':
      return wrap(
        <input
          id={id}
          type="text"
          name={field.name}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? 'tag-a, tag-b'}
          className={base}
        />
      )
    default:
      return wrap(
        <input
          id={id}
          type="text"
          name={field.name}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={base}
        />
      )
  }
}
