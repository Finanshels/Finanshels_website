# CMS per-type create flow + editor scroll fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic `?new=1` create form with a focused, per-collection `/admin/cms/new/[collection]` page that asks only for the essentials of each content type, and fix the editor shell so left/right rails stay fixed while only the middle column scrolls.

**Architecture:** A small catalog (`createProfiles.ts`) maps each `CmsCollectionKey` to an ordered list of existing field names plus optional templates. A new server-rendered route `/admin/cms/new/[collection]` renders only those fields using the existing field renderers and posts to a thin server action that delegates to the existing `upsertCmsDocument`. Four call sites that link to `?new=1` are switched to the new route, and the legacy `new=1` branch is deleted from `src/app/admin/cms/page.tsx`. The editor shell layout is rewritten to a fixed-height flex column where the three columns each own their scroll. No Firestore schema or repository API changes.

**Tech Stack:** Next.js 15 App Router (React server components + server actions), TypeScript, Tailwind, Firestore via `firebase-admin` (already wired). No test framework is installed; verification is via `npm run typecheck`, a small Node assertion script, and manual browser checks.

**Companion spec:** [docs/superpowers/specs/2026-05-14-cms-per-type-create-flow-design.md](../specs/2026-05-14-cms-per-type-create-flow-design.md)

---

## File map (locks in decomposition)

**Create**
- `src/lib/cms/createProfiles.ts` — profile catalog + types + runtime validator. ~200 lines. One responsibility: declare what each collection asks for on /new.
- `scripts/check-create-profiles.mjs` — Node ESM script that imports `createProfiles.ts` (via `tsx`) and asserts every field name resolves against the collection definition. Used in lieu of unit tests since no test framework is configured. ~30 lines.
- `src/components/cms/admin/CmsCreateForm.tsx` — client component. Renders a profile's fields + optional template chooser, owns local form state, posts via server action. ~180 lines.
- `src/app/admin/cms/new/[collection]/page.tsx` — server component. Resolves collection + profile, fetches reference options, renders `CmsCreateForm`. ~80 lines.
- `src/app/admin/cms/new/[collection]/actions.ts` — server action `createCmsDraft(collection, formData)`. Builds payload from profile + template, calls `upsertCmsDocument`, redirects. ~70 lines.

**Modify**
- `src/app/admin/cms/page.tsx` — remove `new=1` branch from the form action handler (around lines 261–282) and from the editor render path; update `editorBaseCreate` (line 264) and the sidebar "+ New" link (line 970) to point at `/admin/cms/new/{key}`; rewrite the outer layout to fixed-height flex with per-column scroll.
- `src/components/cms/admin/CmsCollectionItemTable.tsx` — update two `?new=1` links (lines 265 and 393).
- `src/components/AppChrome.tsx` — verify `min-h-dvh` doesn't fight the editor's `h-[100dvh]`; switch admin branch to `h-dvh` (no `min-h`) if the editor scroll fix shows whitespace below the shell.

**Untouched (explicit non-changes)**
- `src/lib/cms/collectionDefinitions.ts` — no field additions.
- `src/lib/cms/collectionRepository.ts` — no signature changes; `upsertCmsDocument` already accepts a partial payload with `status: 'draft'`.
- `src/components/cms/admin/RichTextField.tsx`, `CmsMultiReferencePick.tsx`, `CmsTitleSlugFields.tsx` — reused as-is.

---

## Verified field names (used in createProfiles.ts)

The spec required verification against `collectionDefinitions.ts`. Done — these are the exact field names used below:

| Collection | titleField | Profile fields |
|---|---|---|
| `blog_posts` | `title` | `title`, `excerpt`, `author`, `blog_category`, `publish_date` |
| `videos` | `title` | `title`, `video_platform`, `video_url`, `thumbnail_image`, `video_category` |
| `podcasts` | `episode_title` | `episode_title`, `episode_number`, `audio_url`, `hosts`, `publish_date` |
| `customer_reviews` | `review_title` | `customer_name`, `rating`, `review_source`, `review_text`, `approved_for_publication` |
| `customer_stories` | `story_title` | `story_title`, `customer`, `industry`, `challenge_summary`, `publish_date` |
| `our_customers` | `company_name` | `company_name`, `logo`, `industry`, `relationship_type` |
| `tools` | `tool_name` | `tool_name`, `tool_type`, `short_description`, `tool_embed_type`, `tool_route_key` |
| `review_sources` | `source_name` | `source_name`, `source_url`, `source_type`, `source_logo` |
| `ebooks` | `ebook_title` | `ebook_title`, `cover_image`, `short_description`, `file_upload`, `format` |
| `webinars` | `webinar_title` | `webinar_title`, `webinar_status`, `start_datetime`, `timezone`, `registration_url` |
| `glossary_terms` | `term` | `term`, `definition_short`, `definition_full`, `term_category`, `alphabet_letter` |
| `faq_questions` | `question` | `question`, `answer`, `faq_topic` |
| `faq_topics` | `topic_name` | `topic_name`, `topic_description`, `icon` |
| `team_members` | `full_name` | `full_name`, `job_title`, `photo`, `short_bio` |
| `media_assets` | `title` | `title`, `assetType`, `assetUrl`, `altText` |

Slug is always derived from the titleField using `slugifyForCms` and rendered as a read-only preview on the create page (the user can edit it on the full edit screen).

---

## Task 1: Add the create-profile catalog and runtime validator

**Files:**
- Create: `src/lib/cms/createProfiles.ts`

- [ ] **Step 1: Create `src/lib/cms/createProfiles.ts` with the full catalog**

Write this exact content:

```ts
import {
  CMS_COLLECTION_DEFINITION_MAP,
  getAllFields,
  type CmsCollectionDefinition,
  type CmsCollectionKey,
  type CmsFieldDefinition,
} from './collectionDefinitions'

export type CmsCreateTemplate = {
  id: string
  label: string
  description: string
  values: Record<string, unknown>
}

export type CmsCreateProfile = {
  collection: CmsCollectionKey
  heading: string
  tagline?: string
  fields: string[]
  templates?: CmsCreateTemplate[]
}

const PROFILES: Record<CmsCollectionKey, CmsCreateProfile> = {
  blog_posts: {
    collection: 'blog_posts',
    heading: 'New blog post',
    tagline: 'Title, author, and category are enough to start a draft. The body and SEO come later.',
    fields: ['title', 'excerpt', 'author', 'blog_category', 'publish_date'],
    templates: [
      { id: 'blank', label: 'Blank', description: 'Start from scratch.', values: {} },
      {
        id: 'how_to',
        label: 'How-to article',
        description: 'Step-by-step tutorial format.',
        values: { excerpt: 'A practical step-by-step guide.', blog_category: 'how_to' },
      },
      {
        id: 'industry_update',
        label: 'Industry update',
        description: 'News, changes, and analysis.',
        values: { excerpt: 'What changed and what it means.', blog_category: 'industry_update' },
      },
    ],
  },
  videos: {
    collection: 'videos',
    heading: 'New video',
    tagline: 'Paste the URL and the platform — the rest happens on the full editor.',
    fields: ['title', 'video_platform', 'video_url', 'thumbnail_image', 'video_category'],
  },
  podcasts: {
    collection: 'podcasts',
    heading: 'New podcast episode',
    fields: ['episode_title', 'episode_number', 'audio_url', 'hosts', 'publish_date'],
  },
  customer_reviews: {
    collection: 'customer_reviews',
    heading: 'New customer review',
    tagline: 'Capture the quote and who said it. Photos and detail come later.',
    fields: ['customer_name', 'rating', 'review_source', 'review_text', 'approved_for_publication'],
  },
  customer_stories: {
    collection: 'customer_stories',
    heading: 'New customer story',
    tagline: 'Pick the customer and frame the outcome. Build the case study on the full editor.',
    fields: ['story_title', 'customer', 'industry', 'challenge_summary', 'publish_date'],
    templates: [
      { id: 'blank', label: 'Blank', description: 'Start from scratch.', values: {} },
      {
        id: 'case_study',
        label: 'Case study',
        description: 'Challenge → solution → results.',
        values: {
          challenge_summary: 'Describe the situation the customer was in before working with us.',
        },
      },
      {
        id: 'migration_story',
        label: 'Migration story',
        description: 'Customer moved from another provider.',
        values: {
          challenge_summary: 'Customer was on a competing platform and needed to migrate.',
        },
      },
    ],
  },
  our_customers: {
    collection: 'our_customers',
    heading: 'New customer',
    fields: ['company_name', 'logo', 'industry', 'relationship_type'],
  },
  tools: {
    collection: 'tools',
    heading: 'New tool',
    fields: ['tool_name', 'tool_type', 'short_description', 'tool_embed_type', 'tool_route_key'],
  },
  review_sources: {
    collection: 'review_sources',
    heading: 'New review source',
    fields: ['source_name', 'source_url', 'source_type', 'source_logo'],
  },
  ebooks: {
    collection: 'ebooks',
    heading: 'New ebook',
    fields: ['ebook_title', 'cover_image', 'short_description', 'file_upload', 'format'],
  },
  webinars: {
    collection: 'webinars',
    heading: 'New webinar',
    tagline: 'Title, schedule, and registration link — the rest can be filled in once published.',
    fields: ['webinar_title', 'webinar_status', 'start_datetime', 'timezone', 'registration_url'],
  },
  glossary_terms: {
    collection: 'glossary_terms',
    heading: 'New glossary term',
    fields: ['term', 'definition_short', 'definition_full', 'term_category', 'alphabet_letter'],
  },
  faq_questions: {
    collection: 'faq_questions',
    heading: 'New FAQ question',
    fields: ['question', 'answer', 'faq_topic'],
  },
  faq_topics: {
    collection: 'faq_topics',
    heading: 'New FAQ topic',
    fields: ['topic_name', 'topic_description', 'icon'],
  },
  team_members: {
    collection: 'team_members',
    heading: 'New team member',
    fields: ['full_name', 'job_title', 'photo', 'short_bio'],
  },
  media_assets: {
    collection: 'media_assets',
    heading: 'New media asset',
    fields: ['title', 'assetType', 'assetUrl', 'altText'],
  },
}

export function getCreateProfile(collection: CmsCollectionKey): CmsCreateProfile {
  return PROFILES[collection]
}

export function getCreateProfileFields(
  profile: CmsCreateProfile,
  definition: CmsCollectionDefinition
): CmsFieldDefinition[] {
  const all = getAllFields(definition)
  const byName = new Map(all.map((f) => [f.name, f]))
  const resolved: CmsFieldDefinition[] = []
  for (const name of profile.fields) {
    const field = byName.get(name)
    if (!field) {
      throw new Error(
        `createProfiles: field "${name}" on collection "${profile.collection}" does not exist in collection definition`
      )
    }
    resolved.push(field)
  }
  return resolved
}

/**
 * Validates every profile against its collection definition. Returns an array of
 * problems (empty when valid). Called by scripts/check-create-profiles.mjs at
 * dev time and could be wired into CI later.
 */
export function validateAllProfiles(): string[] {
  const problems: string[] = []
  for (const key of Object.keys(PROFILES) as CmsCollectionKey[]) {
    const profile = PROFILES[key]
    const definition = CMS_COLLECTION_DEFINITION_MAP[key]
    if (!definition) {
      problems.push(`Profile "${key}" has no matching collection definition`)
      continue
    }
    if (profile.collection !== key) {
      problems.push(`Profile "${key}" has mismatched collection field "${profile.collection}"`)
    }
    const names = new Set(getAllFields(definition).map((f) => f.name))
    for (const fieldName of profile.fields) {
      if (!names.has(fieldName)) {
        problems.push(`Profile "${key}" references unknown field "${fieldName}"`)
      }
    }
    if (profile.templates) {
      for (const template of profile.templates) {
        for (const valueKey of Object.keys(template.values)) {
          if (!names.has(valueKey)) {
            problems.push(
              `Profile "${key}" template "${template.id}" sets unknown field "${valueKey}"`
            )
          }
        }
      }
    }
  }
  return problems
}

export const CMS_CREATE_PROFILES = PROFILES
```

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: PASS (no new errors).

- [ ] **Step 3: Commit**

```bash
git add src/lib/cms/createProfiles.ts
git commit -m "feat(cms): add create-profile catalog for per-type new pages"
```

---

## Task 2: Add a validator script so field-name typos fail fast

**Files:**
- Create: `scripts/check-create-profiles.mjs`

- [ ] **Step 1: Create `scripts/check-create-profiles.mjs`**

Write this exact content:

```js
#!/usr/bin/env node
// Validates src/lib/cms/createProfiles.ts against src/lib/cms/collectionDefinitions.ts
// Run: npx tsx scripts/check-create-profiles.mjs
import { validateAllProfiles } from '../src/lib/cms/createProfiles.ts'

const problems = validateAllProfiles()
if (problems.length === 0) {
  console.log('createProfiles: OK — all fields and template keys resolve.')
  process.exit(0)
}

console.error('createProfiles: validation failed.')
for (const p of problems) console.error(' -', p)
process.exit(1)
```

- [ ] **Step 2: Run the script**

Run: `npx tsx scripts/check-create-profiles.mjs`
Expected output: `createProfiles: OK — all fields and template keys resolve.`

If it errors with "tsx: not found", install it: `npm install --save-dev tsx` and rerun.

- [ ] **Step 3: Add a `check:cms-profiles` script entry to package.json**

In `package.json` scripts section, add (alongside existing entries):

```json
"check:cms-profiles": "tsx scripts/check-create-profiles.mjs"
```

- [ ] **Step 4: Run via npm**

Run: `npm run check:cms-profiles`
Expected: same success output.

- [ ] **Step 5: Commit**

```bash
git add scripts/check-create-profiles.mjs package.json package-lock.json
git commit -m "feat(cms): add validator script for create profiles"
```

---

## Task 3: Build the CmsCreateForm client component

**Files:**
- Create: `src/components/cms/admin/CmsCreateForm.tsx`

- [ ] **Step 1: Create `src/components/cms/admin/CmsCreateForm.tsx`**

Write this exact content:

```tsx
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

  const previewSlug = useMemo(() => slugifyForCms(values[titleField] ?? ''), [values, titleField])

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

  const onSubmit = (formData: FormData) => {
    setError(null)
    formData.set('templateId', templateId)
    startTransition(async () => {
      const result = await action(formData)
      if (result && result.ok === false) setError(result.error)
    })
  }

  return (
    <form action={onSubmit} className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-10">
      <header className="flex flex-col gap-1">
        <Link
          href={`/admin/cms?collection=${collectionKey}`}
          className="text-sm text-slate-500 underline-offset-4 hover:underline"
        >
          ← Back to {collectionLabel}
        </Link>
        <h1 className="text-3xl font-semibold text-slate-900">{profile.heading}</h1>
        {profile.tagline ? (
          <p className="text-sm text-slate-600">{profile.tagline}</p>
        ) : null}
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
        <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
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
          Slug preview: <code className="rounded bg-slate-100 px-1 py-0.5">/{previewSlug}</code>
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
  const label = (
    <label htmlFor={id} className="text-sm font-medium text-slate-800">
      {field.label}
      {required ? <span className="ml-1 text-red-600">*</span> : null}
    </label>
  )
  const wrapper = (input: React.ReactNode) => (
    <div className="flex flex-col gap-1.5">
      {label}
      {input}
      {field.description ? <p className="text-xs text-slate-500">{field.description}</p> : null}
    </div>
  )
  const base =
    'rounded-xl border border-[#e8dccf] bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-primary focus:outline-none'

  switch (field.type) {
    case 'textarea':
      return wrapper(
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
      return wrapper(
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
      return wrapper(
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
      return wrapper(
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
      return wrapper(
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
      return wrapper(
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
      return wrapper(
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
      return wrapper(
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
      return wrapper(
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
```

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/cms/admin/CmsCreateForm.tsx
git commit -m "feat(cms): add CmsCreateForm client component for per-type create pages"
```

---

## Task 4: Build the server action that creates the draft

**Files:**
- Create: `src/app/admin/cms/new/[collection]/actions.ts`

- [ ] **Step 1: Create `src/app/admin/cms/new/[collection]/actions.ts`**

Write this exact content:

```ts
'use server'

import { redirect } from 'next/navigation'
import {
  getCmsCollectionDefinition,
  type CmsCollectionKey,
} from '@/lib/cms/collectionDefinitions'
import { getCreateProfile, getCreateProfileFields } from '@/lib/cms/createProfiles'
import {
  getCmsDocument,
  upsertCmsDocument,
} from '@/lib/cms/collectionRepository'
import { decodeFieldValue, InvalidFieldValueError } from '@/lib/cms/fieldCodec'
import { requireAdminAuth, sessionDisplayName } from '@/lib/cms/adminAuth'
import { slugifyForCms } from '@/lib/cms/slugify'

export async function createCmsDraft(
  collectionKey: CmsCollectionKey,
  formData: FormData
): Promise<{ ok: false; error: string } | void> {
  const session = await requireAdminAuth()
  const definition = getCmsCollectionDefinition(collectionKey)
  if (!definition) return { ok: false, error: `Unknown collection ${collectionKey}` }

  const profile = getCreateProfile(collectionKey)
  const fields = getCreateProfileFields(profile, definition)

  const titleRaw = String(formData.get(definition.titleField) ?? '').trim()
  if (!titleRaw) return { ok: false, error: `${definition.titleField} is required` }

  const slug = slugifyForCms(titleRaw)
  if (!slug) return { ok: false, error: 'Could not derive a URL slug from the title' }

  const collision = await getCmsDocument(collectionKey, slug)
  if (collision) {
    return { ok: false, error: `A document with slug "${slug}" already exists` }
  }

  const templateId = String(formData.get('templateId') ?? '')
  const template = profile.templates?.find((t) => t.id === templateId)
  const payload: Record<string, unknown> = { ...(template?.values ?? {}) }

  try {
    for (const field of fields) {
      const raw = formData.get(field.name)
      if (raw === null) continue
      const value = decodeFieldValue(field, typeof raw === 'string' ? raw : '')
      if (value !== undefined) payload[field.name] = value
    }
  } catch (err) {
    if (err instanceof InvalidFieldValueError) return { ok: false, error: err.message }
    throw err
  }

  payload[definition.slugField] = slug
  payload.status = 'draft'

  await upsertCmsDocument(collectionKey, slug, payload, sessionDisplayName(session))
  redirect(`/admin/cms?collection=${collectionKey}&slug=${encodeURIComponent(slug)}&saved=created`)
}
```

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: PASS. If `getCmsCollectionDefinition` or `decodeFieldValue` import paths don't resolve, open the referenced modules and adjust the imports to match the actual exports.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/cms/new/[collection]/actions.ts
git commit -m "feat(cms): add createCmsDraft server action"
```

---

## Task 5: Build the new route page

**Files:**
- Create: `src/app/admin/cms/new/[collection]/page.tsx`

- [ ] **Step 1: Create `src/app/admin/cms/new/[collection]/page.tsx`**

Write this exact content:

```tsx
import { notFound } from 'next/navigation'
import {
  CMS_COLLECTION_DEFINITION_MAP,
  type CmsCollectionKey,
} from '@/lib/cms/collectionDefinitions'
import {
  getCreateProfile,
  getCreateProfileFields,
} from '@/lib/cms/createProfiles'
import { listReferenceOptions } from '@/lib/cms/collectionRepository'
import { requireAdminAuth } from '@/lib/cms/adminAuth'
import CmsCreateForm, { type ReferenceOption } from '@/components/cms/admin/CmsCreateForm'
import { createCmsDraft } from './actions'

export const dynamic = 'force-dynamic'

type Params = Promise<{ collection: string }>

export default async function NewCmsDocumentPage({ params }: { params: Params }) {
  await requireAdminAuth()
  const { collection } = await params
  const definition = CMS_COLLECTION_DEFINITION_MAP[collection as CmsCollectionKey]
  if (!definition) notFound()

  const profile = getCreateProfile(definition.key)
  const fields = getCreateProfileFields(profile, definition)

  const referenceOptions: Record<string, ReferenceOption[]> = {}
  for (const field of fields) {
    if ((field.type === 'reference' || field.type === 'multi_reference') && field.referenceCollection) {
      const opts = await listReferenceOptions(field.referenceCollection)
      referenceOptions[field.name] = opts.map((o) => ({ id: o.id, label: o.label }))
    }
  }

  const boundAction = async (formData: FormData) => {
    'use server'
    return createCmsDraft(definition.key, formData)
  }

  return (
    <div className="min-h-dvh bg-[#f7f3ee]">
      <CmsCreateForm
        profile={profile}
        fields={fields}
        titleField={definition.titleField}
        collectionLabel={definition.label}
        collectionKey={definition.key}
        referenceOptions={referenceOptions}
        action={boundAction}
      />
    </div>
  )
}
```

If `listReferenceOptions` returns a different shape (`{ id, label }` vs `{ id, title }`), look at `src/lib/cms/collectionRepository.ts` for the exact return type and adjust the `.map` call. Do not redefine the helper.

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Manual smoke test — happy path**

Start the dev server in another terminal: `npm run dev`
Visit: `http://localhost:3000/admin/cms/new/videos`
Expected:
- A focused single-column form titled "New video"
- Five fields: Title, Video platform (select), Video URL, Thumbnail image, Video category
- "Cancel" and "Create draft" buttons in a sticky footer
- Filling the title shows a slug preview below the fields
Submit a valid payload → expect redirect to `/admin/cms?collection=videos&slug=…&saved=created`.

- [ ] **Step 4: Manual smoke test — error path**

Visit `http://localhost:3000/admin/cms/new/videos` again. Submit with the **same title** as the doc you just created.
Expected: form re-renders inline with a red error banner saying the slug already exists. No document is created.

- [ ] **Step 5: Manual smoke test — templates**

Visit `http://localhost:3000/admin/cms/new/blog_posts`.
Expected: three template cards at the top ("Blank", "How-to article", "Industry update"), "Blank" pre-selected.
- Type a title.
- Click "How-to article" → expect the Excerpt field to pre-fill with "A practical step-by-step guide." (only because the field was empty).
- Click "Blank" again → previously typed values stay; template defaults do NOT roll back. (User input wins per spec §4.4.)

- [ ] **Step 6: Manual smoke test — unknown collection**

Visit `http://localhost:3000/admin/cms/new/does-not-exist`
Expected: 404 page.

- [ ] **Step 7: Commit**

```bash
git add src/app/admin/cms/new/[collection]/page.tsx
git commit -m "feat(cms): add /admin/cms/new/[collection] route"
```

---

## Task 6: Switch entry points to the new route

**Files:**
- Modify: `src/app/admin/cms/page.tsx` (lines around 264 and 970)
- Modify: `src/components/cms/admin/CmsCollectionItemTable.tsx` (lines 265 and 393)

- [ ] **Step 1: Update `editorBaseCreate` in `src/app/admin/cms/page.tsx`**

Find this line (currently around line 264):

```ts
const editorBaseCreate = `/admin/cms?collection=${definition.key}&new=1`
```

Replace with:

```ts
const editorBaseCreate = `/admin/cms/new/${definition.key}`
```

- [ ] **Step 2: Update the sidebar "+ New" link in `src/app/admin/cms/page.tsx`**

Find this block (currently around lines 966–971):

```tsx
href={
  definition.key === 'media_assets'
    ? `/admin/cms?collection=${definition.key}#cms-media-upload`
    : `/admin/cms?collection=${definition.key}&new=1`
}
```

Replace with:

```tsx
href={
  definition.key === 'media_assets'
    ? `/admin/cms?collection=${definition.key}#cms-media-upload`
    : `/admin/cms/new/${definition.key}`
}
```

(`media_assets` continues to use the in-page upload widget; everything else goes to the new route.)

- [ ] **Step 3: Update the two `+ New` links in `src/components/cms/admin/CmsCollectionItemTable.tsx`**

Line 265 currently reads:

```tsx
href={`/admin/cms?collection=${collectionKey}&new=1`}
```

Change to:

```tsx
href={collectionKey === 'media_assets' ? `/admin/cms?collection=${collectionKey}#cms-media-upload` : `/admin/cms/new/${collectionKey}`}
```

Apply the same exact change to line 393.

- [ ] **Step 4: Run typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Manual smoke test — entry points**

With `npm run dev` running:
- Open `http://localhost:3000/admin/cms?collection=videos`
- Click "+ New Video" in the left sidebar → expect to land on `/admin/cms/new/videos`
- Go back and click "+ New" in the listing table (or empty state) → expect to land on `/admin/cms/new/videos`
- Open `http://localhost:3000/admin/cms?collection=media_assets` and verify "+ Upload media" still points at the media library anchor.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/cms/page.tsx src/components/cms/admin/CmsCollectionItemTable.tsx
git commit -m "feat(cms): route + New buttons to /admin/cms/new/[collection]"
```

---

## Task 7: Remove the legacy `new=1` branch

**Files:**
- Modify: `src/app/admin/cms/page.tsx` (form action handler and editor render path)

The form action still treats `cmsIntent === 'create'` as valid. After Task 6, no UI sends a create intent to the old action, but we want to eliminate the dead code path so a stale tab or a bookmarked URL doesn't reach a half-supported route.

- [ ] **Step 1: Identify the create branch**

Re-read `src/app/admin/cms/page.tsx` around lines 261–282. The block beginning with:

```ts
const isCreate = cmsIntent === 'create'
```

…and the subsequent slug-missing redirect to `editorBaseCreate` plus the slug-taken guard inside `if (isCreate)`.

- [ ] **Step 2: Replace the create branch with a guard**

Change:

```ts
const cmsIntent = String(formData.get('cmsIntent') ?? '')
const isCreate = cmsIntent === 'create'
const cmsOriginalSlug = String(formData.get('cmsOriginalSlug') ?? '').trim()
const editorBaseCreate = `/admin/cms/new/${definition.key}`
const editorBaseEdit = (s: string) => `/admin/cms?collection=${definition.key}&slug=${encodeURIComponent(s)}`

const slugField = definition.slugField
const slug = String(formData.get(slugField) ?? '').trim()
if (!slug) {
  const back = cmsOriginalSlug ? editorBaseEdit(cmsOriginalSlug) : editorBaseCreate
  redirect(`${back}&error=missing-slug`)
}

// FIX-002: On create, refuse if a document with this slug already exists.
// Without this guard, upsertCmsDocument's set({merge:true}) silently overwrites
// a sibling document at the same id.
if (isCreate) {
  const existing = await getCmsDocument(definition.key, slug)
  if (existing) {
    redirect(`${editorBaseCreate}&error=slug-taken`)
  }
}
```

To:

```ts
const cmsOriginalSlug = String(formData.get('cmsOriginalSlug') ?? '').trim()
const editorBaseEdit = (s: string) => `/admin/cms?collection=${definition.key}&slug=${encodeURIComponent(s)}`

const slugField = definition.slugField
const slug = String(formData.get(slugField) ?? '').trim()
if (!slug) {
  if (!cmsOriginalSlug) {
    redirect(`/admin/cms/new/${definition.key}?error=missing-slug`)
  }
  redirect(`${editorBaseEdit(cmsOriginalSlug)}&error=missing-slug`)
}
```

(We keep the missing-slug fallback to the create page for the edge case where someone clears the slug on the edit screen.)

- [ ] **Step 3: Find the editor render branch that handles `new=1`**

Search for `new=1` or the `?new` searchParam handling in `page.tsx`. There is likely a block that selects "render the empty editor" when `searchParams.new === '1'`. Delete that branch so visiting `?new=1` falls through to the "no slug → show listing" path (or returns 404 — either is fine because nothing links there anymore).

Run: `grep -n "searchParams.*\\bnew\\b\\|params\\.new\\|'new=1'" src/app/admin/cms/page.tsx`

Expected: a small number of hits. Inspect each, delete the create-render branch, and keep the existing edit/listing branches intact.

- [ ] **Step 4: Run typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Manual smoke test — legacy URL**

With `npm run dev` running, visit `http://localhost:3000/admin/cms?collection=videos&new=1`
Expected: the listing renders normally — no broken create form, no crash.

- [ ] **Step 6: Manual smoke test — edit still works**

Pick an existing video doc, open it at `/admin/cms?collection=videos&slug=…`, change the title, click Save.
Expected: the saved pill appears in the top bar; reload and the change is persisted.

- [ ] **Step 7: Commit**

```bash
git add src/app/admin/cms/page.tsx
git commit -m "refactor(cms): drop legacy ?new=1 create branch in editor"
```

---

## Task 8: Fix the editor shell scroll

**Files:**
- Modify: `src/app/admin/cms/page.tsx` (outer layout)
- Modify (if needed): `src/components/AppChrome.tsx` (admin branch)

- [ ] **Step 1: Locate the editor shell wrapper**

In `src/app/admin/cms/page.tsx`, find the outermost JSX returned by the main editor component (the one containing the left sidebar, middle form, and right Publish/SEO panel). It currently does not constrain height — the page body scrolls.

- [ ] **Step 2: Rewrite the wrapper to fixed-height flex**

Apply these class changes:

- Outer root: `flex h-[100dvh] flex-col overflow-hidden bg-[#f7f3ee]`
- Top bar (the row containing title/save/status pill): keep `shrink-0` (or add it).
- Body row (the row that holds the three columns): `flex min-h-0 flex-1`
- Left sidebar column container: add `min-h-0 overflow-y-auto`
- Middle pane container: add `min-h-0 flex-1 overflow-y-auto`
- Right sidebar column container: add `min-h-0 overflow-y-auto`

Reuse existing width/padding classes. Do not introduce new spacing.

- [ ] **Step 3: Verify AppChrome doesn't fight the new layout**

Open `src/components/AppChrome.tsx`. The admin branch returns:

```tsx
<div className="min-h-dvh bg-[#f7f3ee]">{children}</div>
```

Because the editor now owns `h-[100dvh]`, change this to:

```tsx
<div className="h-dvh bg-[#f7f3ee]">{children}</div>
```

Only change this if step 4 verification shows whitespace below the editor. Otherwise leave AppChrome untouched.

- [ ] **Step 4: Manual smoke test — scroll containment**

With `npm run dev` running:
- Open `/admin/cms?collection=blog_posts&slug=<some-existing-slug>`
- Scroll the middle pane down → expect the left "Collections" list and the right "Publish / SEO / AEO / GEO" tabs to stay visible without moving.
- Resize the browser to a short viewport (e.g. 700px tall) → the left and right rails get their own scrollbars; the middle pane scrolls independently.
- Verify the listing page (`/admin/cms?collection=blog_posts` with no slug) still renders correctly — no clipped content.

- [ ] **Step 5: Manual smoke test — Safari**

Repeat the scroll test in Safari (the `dvh` unit historically behaves slightly differently). Expected: same containment, no overflow on the body, no double scrollbars.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/cms/page.tsx src/components/AppChrome.tsx
git commit -m "fix(cms): contain editor scroll to middle column, keep rails fixed"
```

---

## Task 9: Update docs and final verification

**Files:**
- Modify: `docs/cms-field-guide.md`

- [ ] **Step 1: Update the field guide**

In `docs/cms-field-guide.md`, add a short section after the "Sections" table:

```markdown
### Creating new documents

Clicking **+ New …** opens a focused per-type page at `/admin/cms/new/[collection]` that asks only for the essentials needed to ship a draft of that content type. The full editor (sections, SEO, AEO, GEO, blocks) opens automatically after Save. The mapping of essentials per collection lives in `src/lib/cms/createProfiles.ts`.
```

- [ ] **Step 2: Run the full local verification**

```bash
npm run check:cms-profiles
npm run typecheck
npm run build
```

Expected: all three succeed. If `npm run build` complains about unused imports left over from Task 7, remove them.

- [ ] **Step 3: One-pass manual sweep**

For each of these three collections, walk through create → save → edit:
- `videos` (flat form, no templates, no references on /new)
- `customer_stories` (templates + reference field for customer)
- `glossary_terms` (no slug field on /new — slug derived from `term`)

Each should land on the full editor after save with the entered values pre-populated and a draft status.

- [ ] **Step 4: Commit and close out**

```bash
git add docs/cms-field-guide.md
git commit -m "docs(cms): document per-type create flow"
```

---

## Out of scope (follow-ups)

- URL auto-fill for `videos` and `podcasts` (paste YouTube/Spotify → fetch title, thumbnail, duration).
- Template library beyond the three hard-coded starters per collection.
- Per-type empty states on listing pages.
- Rethinking the `media_assets` /new flow around upload rather than URL paste.
- Per-type create flow for `landing_pages` (separate system at `src/lib/landingPages/`).
