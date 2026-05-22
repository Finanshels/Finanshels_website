'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { slugifyForCms } from '@/lib/cms/slugify'
import type { CmsCreateProfile, CmsCreateTemplate } from '@/lib/cms/createProfiles'
import type { CmsFieldDefinition } from '@/lib/cms/collectionDefinitions'
import { FieldEditor } from '@/components/cms/admin/FieldEditor'

export type ReferenceOption = { id: string; label: string }

type Props = {
  profile: CmsCreateProfile
  fields: CmsFieldDefinition[]
  titleField: string
  collectionLabel: string
  collectionKey: string
  /** Keyed by referenced collection key (e.g. `team_members`), matching FieldEditor's contract. */
  referenceOptions: Record<string, ReferenceOption[]>
  /** Optional asset URLs that decorate url/image/file inputs with a datalist. */
  mediaAssetUrls?: string[]
  action: (formData: FormData) => Promise<{ ok: false; error: string } | void>
}

// FIX-039: create form previously rendered every field via its own primitive
// FieldInput switch — only 11 of 17 field types were handled, the rest fell
// through to a plain text input (blocks, json, rows, icon, image, file, tags,
// multi_reference). Now both the create and edit flows render fields through
// the shared FieldEditor, so creating a new doc has the same UI as editing one.

function initialValueFor(field: CmsFieldDefinition, template: CmsCreateTemplate | undefined): string {
  const fromTemplate = template?.values?.[field.name]
  if (fromTemplate != null) return String(fromTemplate)
  if (field.defaultValue == null) return ''
  if (
    typeof field.defaultValue === 'string' ||
    typeof field.defaultValue === 'number' ||
    typeof field.defaultValue === 'boolean'
  ) {
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
  mediaAssetUrls = [],
  action,
}: Props) {
  const templates = profile.templates ?? []
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? '')
  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === templateId),
    [templates, templateId]
  )

  const titleFieldDef = fields.find((f) => f.name === titleField)
  const initialTitle = titleFieldDef ? initialValueFor(titleFieldDef, selectedTemplate) : ''
  const [titlePreview, setTitlePreview] = useState(initialTitle)

  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const previewSlug = useMemo(() => slugifyForCms(titlePreview), [titlePreview])

  const handleSubmit = (formData: FormData) => {
    setError(null)
    formData.set('templateId', templateId)
    startTransition(async () => {
      const result = await action(formData)
      if (result && result.ok === false) setError(result.error)
    })
  }

  const nonTitleFields = fields.filter((f) => f.name !== titleField)

  return (
    <form action={handleSubmit} className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-10">
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
        <fieldset className="rounded-2xl border border-cms-rule bg-white p-4">
          <legend className="px-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Start from
          </legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {templates.map((tpl) => (
              <button
                type="button"
                key={tpl.id}
                onClick={() => setTemplateId(tpl.id)}
                className={`rounded-xl border px-3 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-brand-primary/30 ${
                  templateId === tpl.id
                    ? 'border-brand-primary bg-brand-primary/5'
                    : 'border-cms-rule hover:border-brand-primary/40'
                }`}
              >
                <div className="text-sm font-semibold text-slate-900">{tpl.label}</div>
                <div className="mt-1 text-xs text-slate-500">{tpl.description}</div>
              </button>
            ))}
          </div>
          <p className="mt-2 px-2 text-xs text-slate-500">
            Switching template resets the form to that template&apos;s defaults.
          </p>
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

      {/* key={templateId} forces uncontrolled inputs to remount with new defaults when the template changes. */}
      <div key={templateId} className="flex flex-col gap-5">
        {titleFieldDef ? (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cms-create-title" className="text-sm font-medium text-slate-800">
              {titleFieldDef.label}
              {titleFieldDef.required ? <span className="ml-1 text-red-600">*</span> : null}
            </label>
            <input
              id="cms-create-title"
              type="text"
              name={titleFieldDef.name}
              required={titleFieldDef.required}
              defaultValue={initialTitle}
              onChange={(e) => setTitlePreview(e.target.value)}
              placeholder={titleFieldDef.placeholder}
              className="rounded-xl border border-cms-rule bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            />
            {titleFieldDef.description ? (
              <p className="text-xs text-slate-500">{titleFieldDef.description}</p>
            ) : null}
            {previewSlug ? (
              <p className="text-xs text-slate-500">
                Slug preview:{' '}
                <code className="rounded bg-slate-100 px-1 py-0.5">/{previewSlug}</code>
              </p>
            ) : null}
          </div>
        ) : null}

        {nonTitleFields.map((field) => (
          <div key={field.name} className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-800">
              {field.label}
              {field.required ? <span className="ml-1 text-red-600">*</span> : null}
            </label>
            <FieldEditor
              field={field}
              value={initialValueFor(field, selectedTemplate)}
              referenceOptions={referenceOptions}
              mediaAssetUrls={mediaAssetUrls}
            />
            {field.description ? <p className="text-xs text-slate-500">{field.description}</p> : null}
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-cms-rule bg-cms-canvas px-6 py-4">
        <Link
          href={`/admin/cms?collection=${collectionKey}`}
          className="rounded-xl px-4 py-2 text-sm text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-brand-dark shadow-[0_12px_30px_rgba(241,102,16,0.25)] transition focus:outline-none focus:ring-2 focus:ring-brand-primary/40 disabled:opacity-60"
        >
          {pending ? 'Creating…' : 'Create draft'}
        </button>
      </div>
    </form>
  )
}
