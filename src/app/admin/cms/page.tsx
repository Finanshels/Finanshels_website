import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import RichTextField from '@/components/cms/admin/RichTextField'
import PageBlocksEditor from '@/components/cms/admin/PageBlocksEditor'
import CardPreview from '@/components/cms/admin/CardPreview'
import { ReverseReferencesPanel } from '@/components/cms/admin/ReverseReferencesPanel'
import { CmsCollectionItemTable } from '@/components/cms/admin/CmsCollectionItemTable'
import {
  destroyAdminSession,
  requireAdminAuth,
  sessionDisplayName,
  sessionRole,
  type CmsAdminRole,
  type CmsSession,
} from '@/lib/cms/adminAuth'
import { ROLE_LABEL, ROLE_RANK, type CmsUserRole } from '@/lib/cms/usersRepository'
import {
  CMS_BLOCK_TYPES,
  CMS_COLLECTION_DEFINITIONS,
  CMS_COLLECTION_DEFINITION_MAP,
  getAllFields,
  getCmsCollectionDefinition,
  type CmsCollectionDefinition,
  type CmsCollectionKey,
  type CmsFieldDefinition,
  type CmsSectionKey,
} from '@/lib/cms/collectionDefinitions'

const CMS_BLOCK_TYPES_LABEL_LIST = CMS_BLOCK_TYPES.map((b) => b.label).join(', ')
import {
  bulkDeleteCmsDocuments,
  bulkUpdateCmsDocumentStatus,
  deleteCmsDocument,
  duplicateCmsDocument,
  getCmsCollectionItemCounts,
  getCmsDocument,
  listCmsRevisions,
  listReferenceOptions,
  listCmsDocuments,
  listReverseReferences,
  rollbackCmsDocumentToRevision,
  upsertCmsDocument,
  type CmsDocumentStatus,
  type CmsReverseReferenceGroup,
} from '@/lib/cms/collectionRepository'

type SearchParams = Promise<{
  saved?: string
  error?: string
  collection?: string
  slug?: string
  new?: string
}>

type FieldValueMap = Record<string, unknown>

export const dynamic = 'force-dynamic'

function parseFieldValue(field: CmsFieldDefinition, raw: string): unknown {
  if (field.type === 'boolean') {
    const normalized = raw.trim().toLowerCase()
    if (normalized === 'true' || normalized === '1' || normalized === 'on' || normalized === 'yes') return true
    return false
  }
  if (field.type === 'blocks') {
    if (!raw.trim()) return []
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  if (!raw.trim()) return undefined
  if (field.type === 'number') {
    const num = Number(raw)
    return Number.isFinite(num) ? num : undefined
  }
  if (field.type === 'tags') {
    return raw
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
  }
  if (field.type === 'json') {
    try {
      return JSON.parse(raw)
    } catch {
      return undefined
    }
  }
  if (field.type === 'reference') return raw.trim()
  if (field.type === 'multi_reference') {
    return raw
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
  }
  return raw
}

function stringifyFieldValue(field: CmsFieldDefinition, value: unknown): string {
  if (field.type === 'boolean') {
    if (value === true || value === 'true' || value === 'on' || value === 1 || value === '1') return 'true'
    return 'false'
  }
  if (field.type === 'blocks') {
    if (Array.isArray(value)) return JSON.stringify(value)
    if (typeof value === 'string' && value.trim().startsWith('[')) return value
    return '[]'
  }
  if (value === undefined || value === null) return ''
  if (field.type === 'datetime') {
    if (value instanceof Date) return value.toISOString().slice(0, 16)
    if (typeof value === 'string') return value.slice(0, 16)
    return ''
  }
  if ((field.type === 'tags' || field.type === 'multi_reference') && Array.isArray(value)) return value.join(', ')
  if (field.type === 'json') return JSON.stringify(value, null, 2)
  return String(value)
}

function getReferencedCollections(definition: CmsCollectionDefinition): CmsCollectionKey[] {
  const refs = new Set<CmsCollectionKey>()
  for (const field of getAllFields(definition)) {
    if ((field.type === 'reference' || field.type === 'multi_reference') && field.referenceCollection) {
      refs.add(field.referenceCollection)
    }
  }
  return [...refs]
}

const BLOCKS_REFERENCED_COLLECTIONS: CmsCollectionKey[] = [
  'team_members',
  'customer_reviews',
  'our_customers',
  'faq_questions',
  'videos',
  'tools',
]

/**
 * Drives RichTextField (Tiptap) and md:col-span-2 grid spans.
 * Long-form prose fields that deserve the rich editor surface.
 * NOTE: JSON is intentionally NOT included — JSON gets a code textarea, not RTE.
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

/**
 * Decides if a field is part of the MAIN editor canvas vs. the SIDEBAR Publish tab.
 * Webflow rule:
 *  - title field    → main
 *  - slug field     → main
 *  - all blocks     → main
 *  - all REQUIRED textareas → main (body, excerpt, summary, etc.)
 *  - long-body keyword textareas (body / content / definition / story…) → main
 *  - everything else (status, dates, tags, refs, images, urls, json, booleans, plain text)
 *    → sidebar
 */
function isMainContentField(field: CmsFieldDefinition): boolean {
  if (field.type === 'blocks') return true
  if (field.type !== 'textarea') return false
  if (field.required) return true
  return isLongBodyField(field)
}

function fieldHint(field: CmsFieldDefinition): string | null {
  if (field.type === 'tags') return 'Use comma-separated values and press save to store.'
  if (field.type === 'json') return 'Valid JSON only. Invalid JSON will not be saved.'
  if (field.type === 'url') return 'Use full URL including https://'
  if (field.type === 'image') return 'Use an accessible image URL, preferably with CDN optimization.'
  if (field.type === 'file') return 'Paste a downloadable file URL (storage/CDN).'
  if (field.type === 'icon') return 'Use an icon key or a direct image URL.'
  if (field.type === 'datetime') return 'Use local datetime; this is saved as text/timestamp value.'
  if (field.type === 'boolean') return 'Choose true or false.'
  if (field.type === 'textarea') return 'Supports rich text/HTML where applicable.'
  return null
}

function fieldColumnSpan(field: CmsFieldDefinition): string {
  if (field.type === 'blocks') return 'md:col-span-2'
  if (field.type === 'textarea') return 'md:col-span-2'
  if (field.type === 'json') return 'md:col-span-2'
  return 'md:col-span-1'
}

function readText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function readTagCount(value: unknown): number {
  if (Array.isArray(value)) return value.filter((item) => String(item).trim().length > 0).length
  if (typeof value !== 'string') return 0
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean).length
}

function readJsonArrayCount(value: unknown): number {
  if (Array.isArray(value)) return value.length
  if (typeof value !== 'string' || !value.trim()) return 0
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.length : 0
  } catch {
    return 0
  }
}

function editorStatusStyle(status: string): { dot: string; box: string } {
  if (status === 'published') return { dot: 'text-emerald-600', box: 'border-emerald-300 bg-emerald-50 text-emerald-700' }
  if (status === 'scheduled') return { dot: 'text-sky-600', box: 'border-sky-300 bg-sky-50 text-sky-700' }
  if (status === 'approved') return { dot: 'text-violet-600', box: 'border-violet-300 bg-violet-50 text-violet-700' }
  if (status === 'in_review') return { dot: 'text-blue-600', box: 'border-blue-300 bg-blue-50 text-blue-700' }
  if (status === 'archived') return { dot: 'text-slate-400', box: 'border-slate-300 bg-slate-100 text-slate-600' }
  return { dot: 'text-amber-500', box: 'border-amber-300 bg-amber-50 text-amber-700' }
}

function renderChecklistCard(
  title: string,
  entries: { label: string; ok: boolean; points: number }[]
) {
  return (
    <section className="rounded-2xl border border-[#e8dccf] bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{title}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {entries.map((entry) => (
          <li key={entry.label} className="flex items-start justify-between gap-2 text-slate-700">
            <span className={entry.ok ? 'text-emerald-700' : 'text-slate-500'}>
              {entry.ok ? '✓' : '○'} {entry.label}
            </span>
            <span className={entry.ok ? 'text-emerald-700' : 'text-slate-500'}>+{entry.points}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function buildRevalidateTargets(collection: CmsCollectionKey, slug: string): string[] {
  const def = CMS_COLLECTION_DEFINITION_MAP[collection]
  const base = ['/sitemap.xml', '/llms.txt', `/content/${collection}/${slug}`]
  if (!def) return base
  const targets = new Set(base)
  if (def.listingRoute) targets.add(def.listingRoute)
  if (def.routePattern) targets.add(def.routePattern.replace('[slug]', slug))
  return [...targets]
}

async function saveCmsDocumentAction(formData: FormData) {
  'use server'
  const session = await requireAdminAuth()
  const role = sessionRole(session)

  const collectionRaw = String(formData.get('collection') ?? '')
  const definition = getCmsCollectionDefinition(collectionRaw)
  if (!definition) {
    redirect('/admin/cms?error=invalid-collection')
  }

  const cmsIntent = String(formData.get('cmsIntent') ?? '')
  const isCreate = cmsIntent === 'create'
  const cmsOriginalSlug = String(formData.get('cmsOriginalSlug') ?? '').trim()
  const editorBaseCreate = `/admin/cms?collection=${definition.key}&new=1`
  const editorBaseEdit = (s: string) => `/admin/cms?collection=${definition.key}&slug=${encodeURIComponent(s)}`

  const slugField = definition.slugField
  const slug = String(formData.get(slugField) ?? '').trim()
  if (!slug) {
    const back = cmsOriginalSlug ? editorBaseEdit(cmsOriginalSlug) : editorBaseCreate
    redirect(`${back}&error=missing-slug`)
  }

  const payload: Record<string, unknown> = {}
  for (const field of getAllFields(definition)) {
    const raw = String(formData.get(field.name) ?? '')
    const value = parseFieldValue(field, raw)
    if (field.required && (value === undefined || value === '' || value === null)) {
      redirect(`${isCreate ? editorBaseCreate : editorBaseEdit(slug)}&error=missing-${field.name}`)
    }
    if (value !== undefined) payload[field.name] = value
  }

  payload[slugField] = slug

  // Status precedence: button-clicked `requestedStatus` (Publish/Draft/etc.) wins.
  // Fallback to whatever `status` was submitted by the form (select field), then to current status.
  const ALLOWED_STATUSES = new Set(['published', 'draft', 'in_review', 'approved', 'scheduled'])
  const requestedStatus = String(formData.get('requestedStatus') ?? '').trim()
  const formStatus = String(formData.get('status') ?? '').trim()
  const currentDocStatus = String(formData.get('cmsCurrentStatus') ?? '').trim()
  const resolvedStatus = ALLOWED_STATUSES.has(requestedStatus)
    ? requestedStatus
    : ALLOWED_STATUSES.has(formStatus)
    ? formStatus
    : ALLOWED_STATUSES.has(currentDocStatus)
    ? currentDocStatus
    : 'draft'
  payload.status = resolvedStatus

  // Editors cannot directly publish or approve — bump to in_review.
  if (role === 'editor' && (payload.status === 'published' || payload.status === 'approved')) {
    payload.status = 'in_review'
  }
  const scheduledAt = String(formData.get('scheduledAt') ?? '').trim()
  if (scheduledAt) payload.scheduledAt = scheduledAt
  const locale = String(formData.get('locale') ?? '').trim()
  if (locale) payload.locale = locale
  const localeGroupId = String(formData.get('localeGroupId') ?? '').trim()
  if (localeGroupId) payload.localeGroupId = localeGroupId
  if (typeof payload.status !== 'string') payload.status = 'draft'

  try {
    await upsertCmsDocument(definition.key, slug, payload, role)
  } catch {
    redirect(`${isCreate ? editorBaseCreate : editorBaseEdit(slug)}&error=save-failed`)
  }

  for (const target of buildRevalidateTargets(definition.key, slug)) {
    revalidatePath(target)
  }
  redirect(`/admin/cms?collection=${definition.key}&slug=${encodeURIComponent(slug)}&saved=1`)
}

async function rollbackCmsRevisionAction(revisionId: string, formData: FormData) {
  'use server'
  const session = await requireAdminAuth('admin')
  const role = sessionRole(session)
  const collectionRaw = String(formData.get('collection') ?? '')
  const id = String(formData.get('id') ?? '')
  const definition = getCmsCollectionDefinition(collectionRaw)
  if (!definition || !id || !revisionId.trim()) {
    redirect('/admin/cms?error=rollback-input')
  }

  try {
    await rollbackCmsDocumentToRevision(definition.key, id, revisionId, role)
  } catch {
    redirect(`/admin/cms?collection=${definition.key}&slug=${encodeURIComponent(id)}&error=rollback-failed`)
  }
  for (const target of buildRevalidateTargets(definition.key, id)) {
    revalidatePath(target)
  }
  redirect(`/admin/cms?collection=${definition.key}&slug=${encodeURIComponent(id)}&saved=1`)
}

async function bulkUpdateStatusAction(formData: FormData) {
  'use server'
  const session = await requireAdminAuth()
  const role = sessionRole(session)

  const collectionRaw = String(formData.get('collection') ?? '')
  const definition = getCmsCollectionDefinition(collectionRaw)
  if (!definition) redirect('/admin/cms?error=invalid-collection')

  const ALLOWED: CmsDocumentStatus[] = ['draft', 'in_review', 'approved', 'scheduled', 'published', 'archived']
  const requested = String(formData.get('status') ?? '') as CmsDocumentStatus
  if (!ALLOWED.includes(requested)) redirect(`/admin/cms?collection=${definition.key}&error=invalid-status`)

  // Editors cannot directly publish/approve in bulk.
  let effective: CmsDocumentStatus = requested
  if (role === 'editor' && (effective === 'published' || effective === 'approved')) {
    effective = 'in_review'
  }

  const ids = formData.getAll('ids').map((v) => String(v)).filter(Boolean)
  if (ids.length === 0) redirect(`/admin/cms?collection=${definition.key}&error=no-selection`)

  try {
    await bulkUpdateCmsDocumentStatus(definition.key, ids, effective, role)
  } catch {
    redirect(`/admin/cms?collection=${definition.key}&error=bulk-update-failed`)
  }

  for (const id of ids) {
    for (const target of buildRevalidateTargets(definition.key, id)) {
      revalidatePath(target)
    }
  }
  redirect(`/admin/cms?collection=${definition.key}&saved=1`)
}

async function duplicateCmsDocumentAction(formData: FormData) {
  'use server'
  const session = await requireAdminAuth()
  const role = sessionRole(session)
  const collectionRaw = String(formData.get('collection') ?? '')
  const id = String(formData.get('id') ?? '')
  const definition = getCmsCollectionDefinition(collectionRaw)
  if (!definition || !id) redirect('/admin/cms?error=invalid-input')
  let result: { id: string; slug: string }
  try {
    result = await duplicateCmsDocument(definition.key, id, role)
  } catch {
    redirect(`/admin/cms?collection=${definition.key}&error=duplicate-failed`)
  }
  for (const target of buildRevalidateTargets(definition.key, result.id)) {
    revalidatePath(target)
  }
  redirect(`/admin/cms?collection=${definition.key}&slug=${encodeURIComponent(result.id)}&saved=1`)
}

async function deleteCmsDocumentAction(formData: FormData) {
  'use server'
  await requireAdminAuth('admin')
  const collectionRaw = String(formData.get('collection') ?? '')
  const id = String(formData.get('id') ?? '')
  const definition = getCmsCollectionDefinition(collectionRaw)
  if (!definition || !id) redirect('/admin/cms?error=invalid-input')
  try {
    await deleteCmsDocument(definition.key, id)
  } catch {
    redirect(`/admin/cms?collection=${definition.key}&error=delete-failed`)
  }
  for (const target of buildRevalidateTargets(definition.key, id)) {
    revalidatePath(target)
  }
  redirect(`/admin/cms?collection=${definition.key}&saved=1`)
}

async function bulkDeleteAction(formData: FormData) {
  'use server'
  await requireAdminAuth('admin')

  const collectionRaw = String(formData.get('collection') ?? '')
  const definition = getCmsCollectionDefinition(collectionRaw)
  if (!definition) redirect('/admin/cms?error=invalid-collection')

  const ids = formData.getAll('ids').map((v) => String(v)).filter(Boolean)
  if (ids.length === 0) redirect(`/admin/cms?collection=${definition.key}&error=no-selection`)

  try {
    await bulkDeleteCmsDocuments(definition.key, ids)
  } catch {
    redirect(`/admin/cms?collection=${definition.key}&error=bulk-delete-failed`)
  }

  for (const id of ids) {
    for (const target of buildRevalidateTargets(definition.key, id)) {
      revalidatePath(target)
    }
  }
  redirect(`/admin/cms?collection=${definition.key}&saved=1`)
}

async function logoutAction() {
  'use server'
  await destroyAdminSession()
  redirect('/admin/login')
}

function FieldRenderer({
  field,
  value,
  referenceOptions,
  mediaAssetUrls,
}: {
  field: CmsFieldDefinition
  value: string
  referenceOptions: Record<string, Array<{ id: string; label: string }>>
  mediaAssetUrls: string[]
}) {
  const common =
    'mt-2 w-full rounded-xl border border-[#e8dccf] bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'
  const hint = fieldHint(field)
  const tagPreview =
    field.type === 'tags'
      ? value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : []
  if (field.type === 'blocks') {
    return (
      <PageBlocksEditor
        name={field.name}
        initialValue={value}
        referenceOptions={referenceOptions}
      />
    )
  }
  if (field.type === 'textarea' || field.type === 'json') {
    if (field.type === 'textarea' && isLongBodyField(field)) {
      return <RichTextField name={field.name} initialValue={value} placeholder={field.placeholder} />
    }
    return (
      <>
        <textarea
          name={field.name}
          required={field.required}
          rows={field.type === 'json' ? 12 : isLongBodyField(field) ? 16 : 5}
          defaultValue={value}
          placeholder={field.placeholder}
          className={`${common} ${field.type === 'json' ? 'font-mono text-xs' : ''}`}
        />
        {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      </>
    )
  }
  if (field.type === 'select' && field.options?.length) {
    const defaultOption = typeof field.defaultValue === 'string' ? field.defaultValue : field.options[0]
    return (
      <>
        <select name={field.name} required={field.required} defaultValue={value || defaultOption} className={common}>
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
      <label className="mt-2 inline-flex items-center gap-2 rounded-xl border border-[#e8dccf] bg-white px-3 py-2 text-sm text-slate-700">
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
          className={common}
        />
        {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      </>
    )
  }
  if (field.type === 'reference') {
    const options = field.referenceCollection ? referenceOptions[field.referenceCollection] ?? [] : []
    return (
      <>
        <select name={field.name} required={field.required} defaultValue={value} className={common}>
          <option value="">Select reference</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      </>
    )
  }
  if (field.type === 'multi_reference') {
    const options = field.referenceCollection ? referenceOptions[field.referenceCollection] ?? [] : []
    return (
      <>
        <input name={field.name} defaultValue={value} placeholder="id-one, id-two, id-three" className={common} list={`${field.name}-ref-suggestions`} />
        <datalist id={`${field.name}-ref-suggestions`}>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </datalist>
        <p className="mt-1 text-xs text-slate-500">Enter comma-separated reference IDs. Suggestions available.</p>
      </>
    )
  }
  return (
    <>
      <input
        type={
          field.type === 'url' || field.type === 'image' || field.type === 'file'
            ? 'url'
            : field.type === 'number'
            ? 'number'
            : field.type === 'email'
            ? 'email'
            : 'text'
        }
        step={field.type === 'number' ? 'any' : undefined}
        name={field.name}
        required={field.required}
        defaultValue={value}
        placeholder={field.placeholder}
        list={field.type === 'url' && mediaAssetUrls.length > 0 ? `${field.name}-asset-suggestions` : undefined}
        className={common}
      />
      {field.type === 'url' && mediaAssetUrls.length > 0 ? (
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
            <span key={`${field.name}-${tag}`} className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 text-xs text-brand-primary">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </>
  )
}

function renderSection(
  id: string,
  title: string,
  fields: CmsFieldDefinition[],
  values: FieldValueMap,
  referenceOptions: Record<string, Array<{ id: string; label: string }>>,
  mediaAssetUrls: string[]
) {
  return (
    <section id={id} className="rounded-2xl border border-[#e8dccf] bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
      <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{title}</h3>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {fields.map((field) => {
          const value = stringifyFieldValue(field, values[field.name])
          return (
            <label key={field.name} className={`block text-sm font-medium text-slate-800 ${fieldColumnSpan(field)}`}>
              <span className="flex items-center gap-2">
                {field.label}
                {field.required ? (
                  <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-brand-primary">
                    Required
                  </span>
                ) : null}
              </span>
              <FieldRenderer field={field} value={value} referenceOptions={referenceOptions} mediaAssetUrls={mediaAssetUrls} />
            </label>
          )
        })}
      </div>
    </section>
  )
}

/**
 * Same field grid as `renderSection` but wrapped in a native `<details>` so
 * editors can collapse/expand without client-side state.
 */
function renderCollapsibleSection(
  id: string,
  title: string,
  subtitle: string,
  fields: CmsFieldDefinition[],
  values: FieldValueMap,
  referenceOptions: Record<string, Array<{ id: string; label: string }>>,
  mediaAssetUrls: string[],
  options: { defaultOpen?: boolean; extra?: React.ReactNode } = {}
) {
  if (!fields || fields.length === 0) {
    if (!options.extra) return null
  }
  return (
    <details
      id={id}
      open={options.defaultOpen ?? false}
      className="group rounded-2xl border border-[#e8dccf] bg-white shadow-[0_8px_22px_rgba(15,23,42,0.06)]"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{title}</h3>
          {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
        </div>
        <span className="rounded-full border border-[#e8dccf] bg-[#fffaf5] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 transition group-open:border-brand-primary/40 group-open:bg-brand-primary/10 group-open:text-brand-primary">
          <span className="hidden group-open:inline">Hide</span>
          <span className="group-open:hidden">Edit</span>
        </span>
      </summary>
      <div className="space-y-4 border-t border-[#eee2d3] px-4 py-4">
        {fields && fields.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field) => {
              const value = stringifyFieldValue(field, values[field.name])
              return (
                <label key={field.name} className={`block text-sm font-medium text-slate-800 ${fieldColumnSpan(field)}`}>
                  <span className="flex items-center gap-2">
                    {field.label}
                    {field.required ? (
                      <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-brand-primary">
                        Required
                      </span>
                    ) : null}
                  </span>
                  <FieldRenderer field={field} value={value} referenceOptions={referenceOptions} mediaAssetUrls={mediaAssetUrls} />
                  {field.description ? <p className="mt-1 text-xs text-slate-500">{field.description}</p> : null}
                </label>
              )
            })}
          </div>
        ) : null}
        {options.extra ? <div className="pt-2">{options.extra}</div> : null}
      </div>
    </details>
  )
}

function renderSidebarSection(
  id: string,
  title: string,
  fields: CmsFieldDefinition[],
  values: FieldValueMap,
  subtitle?: string,
  referenceOptions: Record<string, Array<{ id: string; label: string }>> = {},
  mediaAssetUrls: string[] = []
) {
  return (
    <section id={id} className="rounded-2xl border border-[#e8dccf] bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{title}</p>
      {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
      <div className="mt-3 flex flex-col gap-3">
        {fields.map((field) => {
          const value = stringifyFieldValue(field, values[field.name])
          return (
            <label key={field.name} className="block rounded-xl border border-[#f1e7dc] bg-[#fffaf5] p-3 text-sm font-medium text-slate-800">
              <span className="flex items-center gap-2">
                {field.label}
                {field.required ? (
                  <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-brand-primary">
                    Required
                  </span>
                ) : null}
              </span>
              <FieldRenderer field={field} value={value} referenceOptions={referenceOptions} mediaAssetUrls={mediaAssetUrls} />
            </label>
          )
        })}
      </div>
    </section>
  )
}

/**
 * Webflow-style split:
 * - The main canvas only holds the entity's identity (title + slug) and its long-form
 *   body/definition/answer/summary content (long textareas).
 * - Everything else — meta, dates, language, categories, references, booleans, JSON,
 *   short excerpts, hero images, CTAs — goes into the right-side Publish tab.
 */
function isPrimaryEditorField(
  field: CmsFieldDefinition,
  slugFieldName: string,
  titleFieldName: string
): boolean {
  if (field.name === 'status') return false
  if (field.name === titleFieldName || field.name === slugFieldName) return true
  return isMainContentField(field)
}

/**
 * Sorts the MAIN editor fields so the entry's identity is always first:
 *   1. title field (the headline)
 *   2. slug field  (the URL identity)
 *   3. everything else, preserving the collection's authored order
 */
function sortPrimaryFields(
  fields: CmsFieldDefinition[],
  slugFieldName: string,
  titleFieldName: string
): CmsFieldDefinition[] {
  const rank = (f: CmsFieldDefinition) => {
    if (f.name === titleFieldName) return 0
    if (f.name === slugFieldName) return 1
    return 2
  }
  return fields
    .map((f, i) => ({ f, i, r: rank(f) }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .map(({ f }) => f)
}

function CmsSidebar({
  activeKey,
  collectionCounts,
  session,
}: {
  activeKey: CmsCollectionKey
  collectionCounts: Partial<Record<CmsCollectionKey, number>>
  session: CmsSession
}) {
  const definition = CMS_COLLECTION_DEFINITION_MAP[activeKey]
  const role = sessionRole(session)
  const canManageUsers = ROLE_RANK[role] >= ROLE_RANK['admin']
  const userName = sessionDisplayName(session)
  const userEmail = session.kind === 'user' ? session.user.email : null
  return (
          <aside className="rounded-2xl border border-[#e8dccf] bg-white p-4 xl:overflow-y-auto shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-brand-primary">Finanshels CMS</p>
      <Link
        href={`/admin/cms?collection=${definition.key}&new=1`}
        className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-brand-dark shadow-[0_12px_30px_rgba(241,102,16,0.25)] transition hover:brightness-110"
      >
        + New {definition.singularLabel}
      </Link>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Collections</p>
        <ul className="space-y-1.5">
          {CMS_COLLECTION_DEFINITIONS.map((item) => {
            const count = collectionCounts[item.key]
            return (
              <li key={item.key}>
                <Link
                  href={`/admin/cms?collection=${item.key}`}
                  className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm transition ${
                        item.key === definition.key
                          ? 'border-brand-primary/40 bg-brand-primary/10 text-slate-900'
                          : 'border-transparent text-slate-700 hover:border-[#eadfce] hover:bg-[#fff8f1]'
                  }`}
                >
                  <span className="min-w-0 flex-1 truncate font-semibold">{item.label}</span>
                  <span className="shrink-0 tabular-nums text-xs text-slate-500">{count ?? '—'}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="mt-5 space-y-1 border-t border-[#eee2d3] pt-4 text-sm text-slate-700">
        {canManageUsers ? (
          <Link
            href="/admin/settings/users"
            className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-[#fff8f1]"
          >
            <span>Settings</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Users</span>
          </Link>
        ) : (
          <Link href="/admin/settings/profile" className="block rounded-lg px-2 py-1.5 hover:bg-[#fff8f1]">
            Settings
          </Link>
        )}
        <Link href="/blog" className="block rounded-lg px-2 py-1.5 hover:bg-[#fff8f1]">
          View Blog
        </Link>
        <Link href="/" className="block rounded-lg px-2 py-1.5 hover:bg-[#fff8f1]">
          View Site
        </Link>
      </div>

      <div className="mt-4 rounded-xl border border-[#eee2d3] bg-[#fffaf3] p-3">
        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Signed in as</p>
        <p className="mt-1 truncate text-sm font-medium text-slate-900">{userName}</p>
        {userEmail ? <p className="truncate text-xs text-slate-500">{userEmail}</p> : null}
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="inline-flex rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-brand-primary">
            {ROLE_LABEL[role]}
          </span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:border-slate-300"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}

export default async function CmsAdminPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requireAdminAuth()
  const role = sessionRole(session)
  const params = await searchParams

  const requestedCollection = params.collection ?? 'blog_posts'
  const activeCollection = (CMS_COLLECTION_DEFINITION_MAP[requestedCollection as CmsCollectionKey]
    ? requestedCollection
    : 'blog_posts') as CmsCollectionKey
  const definition = CMS_COLLECTION_DEFINITION_MAP[activeCollection]

  const openNew = params.new === '1'
  const isEditorView = Boolean(params.slug) || openNew
  const fieldReferencedCollections = getReferencedCollections(definition)
  const allReferencedCollections = [
    ...new Set<CmsCollectionKey>([...fieldReferencedCollections, ...BLOCKS_REFERENCED_COLLECTIONS]),
  ]

  const [documentList, selectedDocument, collectionCounts, mediaAssets, referenceOptionResults, revisions, reverseRefs] =
    await Promise.all([
      isEditorView ? Promise.resolve([]) : listCmsDocuments(definition.key, definition.titleField, definition.slugField),
      isEditorView && params.slug ? getCmsDocument(definition.key, params.slug) : Promise.resolve(null),
      getCmsCollectionItemCounts(),
      listCmsDocuments('media_assets', 'title', 'slug'),
      Promise.all(allReferencedCollections.map((key) => listReferenceOptions(key).then((options) => [key, options] as const))),
      isEditorView && params.slug ? listCmsRevisions(definition.key, params.slug) : Promise.resolve([]),
      isEditorView && params.slug
        ? listReverseReferences(definition.key, params.slug)
        : Promise.resolve([] as CmsReverseReferenceGroup[]),
    ])
  const referenceOptions = Object.fromEntries(referenceOptionResults) as Record<string, Array<{ id: string; label: string }>>
  const mediaAssetDocUrls = await Promise.all(
    mediaAssets.slice(0, 120).map(async (asset) => {
      const doc = await getCmsDocument('media_assets', asset.id)
      return typeof doc?.assetUrl === 'string' ? doc.assetUrl : ''
    })
  )
  const allMediaUrls = [...new Set(mediaAssetDocUrls.filter(Boolean))]

  const saved = params.saved === '1'
  const error = params.error

  if (!isEditorView) {
    const listRows = documentList.map((d) => ({
      id: d.id,
      slug: d.slug,
      title: d.title,
      status: d.status,
      updatedAtIso: d.updatedAt?.toISOString(),
      createdAtIso: d.createdAt?.toISOString(),
      publishedAtIso: d.publishedAt?.toISOString(),
      scheduledAtIso: d.scheduledAt?.toISOString(),
    }))
    const canPublish = ROLE_RANK[role] >= ROLE_RANK['admin']
    const canDelete = ROLE_RANK[role] >= ROLE_RANK['admin']

    return (
      <section className="min-h-screen bg-[#f7f3ee] text-slate-900">
        <div className="mx-auto max-w-[1900px] px-3 py-3 sm:px-5">
          <div className="grid gap-3 xl:min-h-[calc(100vh-1.5rem)] xl:grid-cols-[minmax(260px,320px)_1fr]">
            <CmsSidebar activeKey={definition.key} collectionCounts={collectionCounts} session={session} />
            <div className="space-y-4 rounded-2xl border border-[#e8dccf] bg-white p-4 xl:overflow-y-auto shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              {saved ? (
                <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
                  Changes saved. Content cache revalidated and routes refreshed.
                </p>
              ) : null}
              {error ? (
                <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                  Action failed: {error}
                </p>
              ) : null}

              <CmsCollectionItemTable
                collectionKey={definition.key}
                label={definition.label}
                singularLabel={definition.singularLabel}
                items={listRows}
                routePattern={definition.routePattern}
                canPublish={canPublish}
                canDelete={canDelete}
                bulkStatusAction={bulkUpdateStatusAction}
                bulkDeleteAction={bulkDeleteAction}
                duplicateAction={duplicateCmsDocumentAction}
                deleteAction={deleteCmsDocumentAction}
              />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (params.slug && !selectedDocument) {
    return (
      <section className="min-h-screen bg-[#f7f3ee] text-slate-900">
        <div className="mx-auto max-w-[1900px] px-3 py-3 sm:px-5">
          <div className="grid gap-3 xl:grid-cols-[minmax(260px,320px)_1fr]">
            <CmsSidebar activeKey={definition.key} collectionCounts={collectionCounts} session={session} />
            <div className="rounded-2xl border border-[#e8dccf] bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <p className="text-lg font-medium text-slate-900">Item not found</p>
              <p className="mt-2 text-sm text-slate-400">
                No document with id <span className="font-mono text-slate-700">{params.slug}</span> in {definition.label}.
              </p>
              <Link
                href={`/admin/cms?collection=${definition.key}`}
                className="mt-6 inline-flex rounded-xl border border-brand-primary/40 bg-brand-primary/10 px-4 py-2 text-sm font-medium text-brand-primary transition hover:bg-brand-primary/20"
              >
                ← Back to all {definition.label}
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const formValues: FieldValueMap = selectedDocument ?? {}
  const activeSlug = params.slug ?? ''
  const publicSlug = readText(formValues[definition.slugField]) || activeSlug

  const primaryPublishFieldsRaw = definition.sections.publish.filter((f) => isPrimaryEditorField(f, definition.slugField, definition.titleField))
  const primaryPublishFields = sortPrimaryFields(primaryPublishFieldsRaw, definition.slugField, definition.titleField)
  const sidePublishFields = definition.sections.publish.filter(
    (f) =>
      !isPrimaryEditorField(f, definition.slugField, definition.titleField) &&
      // Avoid showing a duplicate generic "Title" in the sidebar when the
      // collection already uses a custom title field (e.g. term, full_name).
      !(f.name === 'title' && definition.titleField !== 'title')
  )
  const currentStatus = String(formValues.status ?? 'draft')
  const seoTitle = readText(formValues.seo_title ?? formValues.seoTitle)
  const seoDescription = readText(formValues.meta_description ?? formValues.seoDescription)
  const focusKeyword = readText(formValues.focusKeyword)
  const secondaryKeywordCount = readTagCount(formValues.meta_keywords ?? formValues.secondaryKeywords)
  const directAnswer = readText(formValues.directAnswer || formValues.answerSnippet)
  const faqCount = readJsonArrayCount(formValues.faqItems)
  const howToCount = readJsonArrayCount(formValues.howToSteps)
  const citationCount = readJsonArrayCount(formValues.citations) || readTagCount(formValues.sourceUrls)
  const statCount = readJsonArrayCount(formValues.keyStatistics)
  const expertQuoteCount = readJsonArrayCount(formValues.expertQuotes)
  const relatedEntityCount = readTagCount(formValues.relatedEntities)

  const seoChecklist = [
    { label: 'Focus keyword defined', ok: focusKeyword.length > 0, points: 12 },
    { label: 'Meta title is 50-60 chars', ok: seoTitle.length >= 50 && seoTitle.length <= 60, points: 10 },
    { label: 'Meta description is 120-160 chars', ok: seoDescription.length >= 120 && seoDescription.length <= 160, points: 12 },
    { label: '2+ secondary keywords', ok: secondaryKeywordCount >= 2, points: 8 },
    { label: 'OG image URL set', ok: readText(formValues.og_image ?? formValues.ogImageUrl).length > 0, points: 6 },
    { label: 'Canonical URL set', ok: readText(formValues.canonical_url ?? formValues.canonicalUrl).length > 0, points: 8 },
  ]
  const seoScore = seoChecklist.reduce((acc, item) => (item.ok ? acc + item.points : acc), 0)

  const aeoChecklist = [
    { label: 'Direct answer available', ok: directAnswer.length >= 50, points: 12 },
    { label: '3+ FAQs for FAQPage schema', ok: faqCount >= 3, points: 12 },
    { label: 'HowTo steps defined', ok: howToCount >= 3, points: 10 },
    { label: 'Speakable content prepared', ok: readText(formValues.speakableContent).length > 0, points: 8 },
  ]
  const aeoScore = aeoChecklist.reduce((acc, item) => (item.ok ? acc + item.points : acc), 0)

  const geoChecklist = [
    { label: '2+ cited sources', ok: citationCount >= 2, points: 15 },
    { label: '1+ key statistic', ok: statCount >= 1, points: 10 },
    { label: 'Expert quote included', ok: expertQuoteCount >= 1, points: 10 },
    { label: 'Content type selected', ok: readText(formValues.geoContentType).length > 0, points: 10 },
    { label: '2+ related entities tagged', ok: relatedEntityCount >= 2, points: 10 },
  ]
  const geoScore = geoChecklist.reduce((acc, item) => (item.ok ? acc + item.points : acc), 0)

  const renderCollapsibleSection = (
    id: string,
    title: string,
    _subtitle: string,
    fields: CmsFieldDefinition[],
    values: FieldValueMap,
    refs: Record<string, Array<{ id: string; label: string }>>,
    assets: string[],
    options?: { defaultOpen?: boolean; extra?: React.ReactNode }
  ) => (
    <div className="space-y-3">
      {renderSection(id, title, fields, values, refs, assets)}
      {options?.extra ? <div>{options.extra}</div> : null}
    </div>
  )

  return (
    <section className="min-h-screen bg-[#f7f3ee] text-slate-900">
      <div className="mx-auto max-w-[1900px] px-3 py-3 sm:px-5">
        <div className="grid gap-3 xl:h-[calc(100vh-1.5rem)] xl:grid-cols-[minmax(260px,320px)_60fr_25fr]">
          <CmsSidebar activeKey={definition.key} collectionCounts={collectionCounts} session={session} />

          <form
            action={saveCmsDocumentAction}
            id="cms-editor-form"
            data-cms-editor=""
            className="xl:col-span-2 grid gap-3 xl:h-[calc(100vh-1.5rem)] xl:grid-cols-[60fr_25fr]"
          >
            <input type="hidden" name="collection" value={definition.key} />
            <input type="hidden" name="cmsIntent" value={params.slug ? 'edit' : 'create'} />
            {params.slug ? <input type="hidden" name="cmsOriginalSlug" value={params.slug} /> : null}
            {params.slug ? <input type="hidden" name="id" value={params.slug} /> : null}
            <input type="hidden" name="cmsCurrentStatus" value={currentStatus} />

            <div className="space-y-3 rounded-2xl border border-[#e8dccf] bg-[#fcfaf7] p-0 xl:overflow-y-auto shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              {/* Sticky editor header — Webflow style */}
              <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-[#e8dccf] bg-white/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/85">
                <Link
                  href={`/admin/cms?collection=${definition.key}`}
                  aria-label={`Back to ${definition.label}`}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e8dccf] bg-white text-slate-600 hover:bg-[#fff3e8] hover:text-slate-900"
                >
                  <span aria-hidden className="text-base leading-none">←</span>
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="truncate text-sm font-semibold text-slate-900">
                      {params.slug ? (readText(formValues[definition.titleField]) || `Untitled ${definition.singularLabel}`) : `New ${definition.singularLabel}`}
                    </h1>
                    {(() => {
                      const st = editorStatusStyle(currentStatus)
                      return (
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${st.box}`}>
                          <span className={st.dot} aria-hidden>●</span>
                          {currentStatus.replace(/_/g, ' ')}
                        </span>
                      )
                    })()}
                  </div>
                  <p className="mt-0.5 truncate font-mono text-[11px] text-slate-500">
                    /{publicSlug || params.slug || `${definition.singularLabel.toLowerCase()}-slug`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {definition.routePattern && publicSlug ? (
                    <a
                      href={definition.routePattern.replace('[slug]', publicSlug)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#e8dccf] bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-[#fff3e8]"
                    >
                      <span aria-hidden>↗</span> View
                    </a>
                  ) : null}
                  <button
                    type="submit"
                    name="requestedStatus"
                    value={currentStatus === 'published' ? 'published' : 'draft'}
                    title="Save changes (keeps current status)"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-[0_6px_18px_rgba(15,23,42,0.18)] hover:bg-slate-800"
                  >
                    <span aria-hidden>💾</span> Save
                  </button>
                </div>
              </div>

              <div className="space-y-3 px-4 pb-4">
                {saved ? (
                  <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
                    Changes saved. Content cache revalidated and routes refreshed.
                  </p>
                ) : null}
                {error ? (
                  <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                    Action failed: {error}
                  </p>
                ) : null}

                <div className="space-y-4">
                  {renderSection('main-editor', 'Main Editor', primaryPublishFields, formValues, referenceOptions, allMediaUrls)}

                  {renderCollapsibleSection(
                    'card-section',
                    'Card',
                    'Universal listing-page card fields. Falls back to publish-section title/excerpt/featured image.',
                    definition.sections.card,
                    formValues,
                    referenceOptions,
                    allMediaUrls,
                    {
                      defaultOpen: false,
                      extra: (
                        <CardPreview
                          formId="cms-editor-form"
                          fallbackTitle={readText(formValues[definition.titleField])}
                          fallbackDescription={
                            readText(formValues.excerpt) ||
                            readText(formValues.summary) ||
                            readText(formValues.short_description)
                          }
                          fallbackImage={
                            readText(formValues.card_image) ||
                            readText(formValues.featured_image) ||
                            readText(formValues.thumbnail_image) ||
                            readText(formValues.heroImageUrl)
                          }
                          fallbackCtaUrl={
                            definition.routePattern
                              ? definition.routePattern.replace('[slug]', publicSlug || 'preview')
                              : ''
                          }
                          collectionLabel={definition.label}
                        />
                      ),
                    }
                  )}

                  {renderCollapsibleSection(
                    'listing-section',
                    `Listing page (${definition.listingRoute ?? '/' + definition.key})`,
                    'How this collection renders on its index page: hero, search, filters, sort, featured count, sticky CTA.',
                    definition.sections.listing,
                    formValues,
                    referenceOptions,
                    allMediaUrls
                  )}

                  {renderCollapsibleSection(
                    'detail-section',
                    `Detail page (${definition.routePattern ?? `/content/${definition.key}/[slug]`})`,
                    'Shared blocks every detail page renders: breadcrumbs, social share, sticky side CTA, lead capture, related content.',
                    definition.sections.detail,
                    formValues,
                    referenceOptions,
                    allMediaUrls
                  )}

                  {renderCollapsibleSection(
                    'blocks-section',
                    'Page blocks',
                    `Compose the detail page from reusable blocks (${CMS_COLLECTION_DEFINITION_MAP[
                      definition.key
                    ].sections.blocks.length} fields). Block library: ${CMS_BLOCK_TYPES_LABEL_LIST}.`,
                    definition.sections.blocks,
                    formValues,
                    referenceOptions,
                    allMediaUrls,
                    { defaultOpen: true }
                  )}

                  {definition.sections.relations.length > 0
                    ? renderCollapsibleSection(
                        'relations-section',
                        'Relationships',
                        'Typed cross-collection relationships. Use these to power related content blocks, hubs, and SEO clusters.',
                        definition.sections.relations,
                        formValues,
                        referenceOptions,
                        allMediaUrls,
                        {
                          defaultOpen: true,
                          extra: <ReverseReferencesPanel groups={reverseRefs} />,
                        }
                      )
                    : (
                        <ReverseReferencesPanel groups={reverseRefs} />
                      )}
                </div>
              </div>
            </div>

            <aside className="rounded-2xl border border-[#e8dccf] bg-[#fcfaf7] p-0 xl:overflow-y-auto shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <input id="cms-tab-publish" type="radio" name="cms-settings-tab" className="peer/tab-publish sr-only" defaultChecked />
              <input id="cms-tab-seo" type="radio" name="cms-settings-tab" className="peer/tab-seo sr-only" />
              <input id="cms-tab-aeo" type="radio" name="cms-settings-tab" className="peer/tab-aeo sr-only" />
              <input id="cms-tab-geo" type="radio" name="cms-settings-tab" className="peer/tab-geo sr-only" />

              <div className="sticky top-0 z-20 border-b border-[#e8dccf] bg-[#fcfaf7]/95 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-[#fcfaf7]/80">
                <div className="grid grid-cols-4 overflow-hidden rounded-lg border border-[#e8dccf] bg-white text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                <label
                  htmlFor="cms-tab-publish"
                  className="cursor-pointer border-r border-[#e8dccf] px-2 py-2 text-center transition hover:bg-[#fff8f1] peer-checked/tab-publish:bg-brand-primary/10 peer-checked/tab-publish:text-brand-primary"
                >
                  Publish
                </label>
                <label
                  htmlFor="cms-tab-seo"
                  className="cursor-pointer border-r border-[#e8dccf] px-2 py-2 text-center transition hover:bg-[#fff8f1] peer-checked/tab-seo:bg-brand-primary/10 peer-checked/tab-seo:text-brand-primary"
                >
                  SEO
                </label>
                <label
                  htmlFor="cms-tab-aeo"
                  className="cursor-pointer border-r border-[#e8dccf] px-2 py-2 text-center transition hover:bg-[#fff8f1] peer-checked/tab-aeo:bg-brand-primary/10 peer-checked/tab-aeo:text-brand-primary"
                >
                  AEO
                </label>
                <label
                  htmlFor="cms-tab-geo"
                  className="cursor-pointer px-2 py-2 text-center transition hover:bg-[#fff8f1] peer-checked/tab-geo:bg-brand-primary/10 peer-checked/tab-geo:text-brand-primary"
                >
                  GEO
                </label>
              </div>
              </div>

              <div className="space-y-3 px-3 pt-3 pb-3">
              <div className="hidden space-y-3 peer-checked/tab-publish:block">
                <div className="rounded-2xl border border-[#e8dccf] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Stage for publish</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="submit"
                      name="requestedStatus"
                      value="published"
                      className="col-span-2 rounded-lg bg-gradient-brand px-3 py-2.5 text-sm font-semibold text-brand-dark shadow-[0_8px_20px_rgba(241,102,16,0.25)] transition hover:brightness-110"
                    >
                      Publish Now
                    </button>
                    <button
                      type="submit"
                      name="requestedStatus"
                      value="draft"
                      className="rounded-lg border border-[#e8dccf] bg-[#fffaf5] px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#fff3e8]"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="submit"
                      name="requestedStatus"
                      value="in_review"
                      className="rounded-lg border border-[#e8dccf] bg-[#fffaf5] px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#fff3e8]"
                    >
                      Send for Review
                    </button>
                    <button
                      type="submit"
                      name="requestedStatus"
                      value="approved"
                      disabled={ROLE_RANK[role] < ROLE_RANK['admin']}
                      title={ROLE_RANK[role] < ROLE_RANK['admin'] ? 'Only admins and owners can approve' : 'Mark approved (ready to publish)'}
                      className="rounded-lg border border-[#e8dccf] bg-[#fffaf5] px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#fff3e8] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Approve
                    </button>
                    <button
                      type="submit"
                      name="requestedStatus"
                      value="scheduled"
                      className="rounded-lg border border-[#e8dccf] bg-[#fffaf5] px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#fff3e8]"
                    >
                      Save as Scheduled
                    </button>
                  </div>
                  <label className="mt-3 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Schedule At
                    <input
                      type="datetime-local"
                      name="scheduledAt"
                      defaultValue={typeof formValues.scheduledAt === 'string' ? formValues.scheduledAt : ''}
                      className="mt-1.5 w-full rounded-lg border border-[#e8dccf] bg-[#fffaf5] px-2.5 py-2 text-xs text-slate-700"
                    />
                  </label>
                  <label className="mt-3 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Locale
                    <select
                      name="locale"
                      defaultValue={typeof formValues.locale === 'string' ? formValues.locale : 'en'}
                      className="mt-1.5 w-full rounded-lg border border-[#e8dccf] bg-[#fffaf5] px-2.5 py-2 text-xs text-slate-700"
                    >
                      <option value="en">English (en)</option>
                      <option value="ar">Arabic (ar)</option>
                    </select>
                  </label>
                  <label className="mt-3 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Locale Group ID
                    <input
                      type="text"
                      name="localeGroupId"
                      defaultValue={typeof formValues.localeGroupId === 'string' ? formValues.localeGroupId : ''}
                      placeholder="Shared group id for localized variants"
                      className="mt-1.5 w-full rounded-lg border border-[#e8dccf] bg-[#fffaf5] px-2.5 py-2 text-xs text-slate-700"
                    />
                  </label>
                  <p className="mt-3 text-xs text-slate-500">
                    Current status:{' '}
                    <span className={currentStatus === 'published' ? 'text-emerald-700' : 'text-amber-700'}>{currentStatus}</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Role: {role}</p>
                </div>

                {sidePublishFields.length > 0
                  ? renderSidebarSection(
                      'publish',
                      'Publish Fields',
                      sidePublishFields,
                      formValues,
                      'Core metadata for publishing',
                      referenceOptions,
                      allMediaUrls
                    )
                  : null}

                {definition.routePattern && publicSlug ? (
                  <Link
                    href={definition.routePattern.replace('[slug]', publicSlug)}
                    className="block rounded-xl border border-brand-primary/40 bg-brand-primary/10 px-3 py-2 text-center text-sm font-medium text-brand-primary transition hover:bg-brand-primary/20"
                  >
                    Open Live URL
                  </Link>
                ) : null}

                {params.slug ? (
                  <section className="rounded-2xl border border-[#e8dccf] bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Revision History</p>
                    <div className="mt-3 space-y-2">
                      {revisions.length === 0 ? (
                        <p className="text-xs text-slate-500">No revisions yet.</p>
                      ) : (
                        revisions.map((rev) => (
                          <div key={rev.id} className="rounded-lg border border-[#efe4d8] bg-[#fffaf5] p-2.5">
                            <p className="text-xs text-slate-700">
                              {rev.status} · {rev.createdAt ? rev.createdAt.toLocaleString() : 'unknown time'}
                            </p>
                            {ROLE_RANK[role] >= ROLE_RANK['admin'] ? (
                              <button
                                type="submit"
                                formAction={rollbackCmsRevisionAction.bind(null, rev.id)}
                                className="mt-2 rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-white"
                              >
                                Rollback to this revision
                              </button>
                            ) : (
                              <p className="mt-2 text-[11px] text-slate-500">Admin role required for rollback.</p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </section>
                ) : null}
              </div>

              <div className="hidden space-y-3 peer-checked/tab-seo:block">
                <section className="rounded-2xl border border-[#e8dccf] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">SEO Score</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-3xl font-semibold text-emerald-700">{seoScore}</p>
                    <p className="text-xs text-slate-500">out of 56</p>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Keyword density target: 1.5%-2.5% | Meta description: {seoDescription.length}/160
                  </p>
                </section>
                <section className="rounded-2xl border border-[#e8dccf] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Google SERP Preview</p>
                  <p className="mt-3 text-xs text-emerald-700">{readText(formValues.canonical_url ?? formValues.canonicalUrl) || 'https://www.finanshels.com/...'}</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{seoTitle || 'Your SEO title appears here'}</p>
                  <p className="mt-1 text-sm text-slate-700">
                    {seoDescription || 'Your meta description appears here for search previews.'}
                  </p>
                </section>
                {renderSidebarSection(
                  'seo',
                  'SEO Metadata',
                  definition.sections.seo,
                  formValues,
                  'Single-column CMO control panel',
                  referenceOptions,
                  allMediaUrls
                )}
                {renderChecklistCard('SEO Checklist', seoChecklist)}
              </div>

              <div className="hidden space-y-3 peer-checked/tab-aeo:block">
                <section className="rounded-2xl border border-amber-300 bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">AEO Tips - Answer Engines</p>
                  <ul className="mt-2 space-y-1 text-sm text-amber-800">
                    <li>- Use exact question phrasing users search for</li>
                    <li>- Keep direct answer snippets under 50 words</li>
                    <li>- Add 3+ FAQ items for rich-result eligibility</li>
                  </ul>
                </section>
                <section className="rounded-2xl border border-[#e8dccf] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">AEO Score</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-3xl font-semibold text-violet-700">{aeoScore}</p>
                    <p className="text-xs text-slate-500">out of 42</p>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">Direct answer length: {directAnswer.length}/300</p>
                </section>
                {renderSidebarSection(
                  'aeo',
                  'AEO Fields',
                  definition.sections.aeo,
                  formValues,
                  'FAQ, direct answers, and speakable schema',
                  referenceOptions,
                  allMediaUrls
                )}
                {renderChecklistCard('AEO Checklist', aeoChecklist)}
              </div>

              <div className="hidden space-y-3 peer-checked/tab-geo:block">
                <section className="rounded-2xl border border-cyan-300 bg-cyan-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">GEO Tips - Optimized for LLMs</p>
                  <ul className="mt-2 space-y-1 text-sm text-cyan-800">
                    <li>- Cite trusted external sources for every major claim</li>
                    <li>- Add verifiable statistics and named expert quotes</li>
                    <li>- Tag related entities to improve AI context understanding</li>
                  </ul>
                </section>
                <section className="rounded-2xl border border-[#e8dccf] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">GEO Score</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-3xl font-semibold text-cyan-700">{geoScore}</p>
                    <p className="text-xs text-slate-500">out of 55</p>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Sources: {citationCount} | Stats: {statCount} | Quotes: {expertQuoteCount}
                  </p>
                </section>
                {renderSidebarSection(
                  'geo',
                  'GEO Fields',
                  definition.sections.geo,
                  formValues,
                  'Citations, entities, and AI-trust signals',
                  referenceOptions,
                  allMediaUrls
                )}
                {renderChecklistCard('GEO Checklist', geoChecklist)}
              </div>
              </div>
            </aside>
          </form>

        </div>
      </div>
    </section>
  )
}
