import Link from 'next/link'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { redirect } from 'next/navigation'
import CardPreview from '@/components/cms/admin/CardPreview'
import { AdminSidebar } from '@/components/cms/admin/AdminSidebar'
import { AiFieldButton } from '@/components/cms/admin/ai/AiFieldButton'
import { resolveAiField, type AiContext } from '@/lib/cms/ai/fieldMap'
import { getFieldHelperText } from '@/lib/cms/fieldHelperText'
import { CmsTitleSlugFields } from '@/components/cms/admin/CmsTitleSlugFields'
import { CmsFormValidator } from '@/components/cms/admin/CmsFormValidator'
// FIX-039: FieldRenderer extracted to a shared FieldEditor reused by the create flow.
import { FieldEditor as FieldRenderer } from '@/components/cms/admin/FieldEditor'
import { getStatusStyle } from '@/components/cms/admin/statusStyle'
import { CmsCollectionItemTable } from '@/components/cms/admin/CmsCollectionItemTable'
import { CmsMediaLibrary } from '@/components/cms/admin/CmsMediaLibrary'
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
  listCmsMediaLibraryItems,
  rollbackCmsDocumentToRevision,
  upsertCmsDocument,
  type CmsDocumentStatus,
} from '@/lib/cms/collectionRepository'
import { isCmsConfigured } from '@/lib/cms/config'
import { decodeFieldValue, encodeFieldValue, InvalidFieldValueError } from '@/lib/cms/fieldCodec'
// Two-version publish workflow (Phase 4): Publish/Republish writes a published
// snapshot via publishDoc; Unpublish flips status via unpublishDoc; saves recompute
// has_unpublished_changes via markDraftDirty. Operations never revalidate — the
// caller (these actions) owns revalidation, matching the repo's existing pattern.
import { publishDoc, unpublishDoc, markDraftDirty } from '@/lib/cms/publishWorkflow/operations'
import { EditorPublishBar } from '@/components/cms/admin/EditorPublishBar'

type SearchParams = Promise<{
  saved?: string
  error?: string
  collection?: string
  slug?: string
  intent?: string
}>

type FieldValueMap = Record<string, unknown>

export const dynamic = 'force-dynamic'

// FIX-031: encode/decode delegated to the FIELD_CODECS registry.
function parseFieldValue(field: CmsFieldDefinition, raw: string): unknown {
  return decodeFieldValue(field, raw)
}

function stringifyFieldValue(field: CmsFieldDefinition, value: unknown): string {
  return encodeFieldValue(field, value)
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
  'faqs',
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

function fieldColumnSpan(field: CmsFieldDefinition): string {
  if (field.type === 'blocks') return 'md:col-span-2'
  if (field.type === 'textarea') return 'md:col-span-2'
  if (field.type === 'json') return 'md:col-span-2'
  if (field.type === 'rows') return 'md:col-span-2'
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
  // FIX-008: delegate to the shared statusStyle map. Uses dotText (text-color
  // variant) here because the editor renders the dot as a Lucide icon.
  const s = getStatusStyle(status)
  return { dot: s.dotText, box: s.box }
}

function renderChecklistCard(
  title: string,
  entries: { label: string; ok: boolean; points: number }[]
) {
  return (
    <section className="rounded-2xl border border-cms-rule bg-white p-4">
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

// FIX-011: slug-specific path targets only. Sitemap, llms.txt, and listing
// routes are invalidated once via revalidateTag('cms-content') in
// invalidateCmsCaches(); a bulk publish of N items triggers one tag
// invalidation, not 3+N path invalidations.
const CMS_CONTENT_CACHE_TAG = 'cms-content'

// PERF: sidebar collection counts query .count() against 12 collections in parallel
// on EVERY admin click. Wrap with unstable_cache + the existing cms-content tag so
// writes invalidate it (line 213 fires revalidateTag(CMS_CONTENT_CACHE_TAG)).
// TTL 5min is a safety net; tag invalidation is the primary signal.
const getCachedCmsCollectionItemCounts = unstable_cache(
  () => getCmsCollectionItemCounts(),
  ['cms-collection-counts'],
  { tags: [CMS_CONTENT_CACHE_TAG], revalidate: 300 }
)

// PERF: opening ANY document for editing fanned out listReferenceOptions() across
// every referenced collection (~5-8 collections × up to 200 docs each ≈ 1000-1600
// uncached Firestore reads) on every single editor open. Reference dropdowns are
// slow-changing label lists, so cache them per collection under the same
// 'cms-content' tag — any CMS save already invalidates that tag, so a newly
// created/renamed reference target shows up immediately, while repeat editor
// opens hit the cache instead of re-reading thousands of docs.
const CACHED_REFERENCE_OPTIONS: Partial<
  Record<CmsCollectionKey, () => Promise<Array<{ id: string; label: string }>>>
> = Object.fromEntries(
  CMS_COLLECTION_DEFINITIONS.map((def) => [
    def.key,
    unstable_cache(() => listReferenceOptions(def.key), ['cms-reference-options', def.key], {
      tags: [CMS_CONTENT_CACHE_TAG],
      revalidate: 300,
    }),
  ])
)

function getReferenceOptionsForCollection(
  key: CmsCollectionKey
): Promise<Array<{ id: string; label: string }>> {
  const cached = CACHED_REFERENCE_OPTIONS[key]
  return cached ? cached() : listReferenceOptions(key)
}

function buildRevalidatePathTargets(collection: CmsCollectionKey, slug: string): string[] {
  const def = CMS_COLLECTION_DEFINITION_MAP[collection]
  const targets = new Set<string>([`/content/${collection}/${slug}`])
  if (def?.routePattern) targets.add(def.routePattern.replace('[slug]', slug))
  // FIX-048: also bust the collection's listing route so newly published
  // docs appear without waiting for time-based ISR (previously up to
  // 5–10 min stale on /blog, /glossary, etc.).
  if (def?.listingRoute) targets.add(def.listingRoute)
  return [...targets]
}

function invalidateGlobalCmsCaches(): void {
  // Per-collection-driven aggregates. Each is hit once regardless of bulk size.
  revalidatePath('/sitemap.xml')
  revalidatePath('/llms.txt')
  // For any future fetch tagged with 'cms-content' (e.g. unstable_cache-wrapped
  // listing fetches), one tag invalidation covers all of them.
  revalidateTag(CMS_CONTENT_CACHE_TAG)
}

function invalidateCmsCaches(collection: CmsCollectionKey, slug: string): void {
  for (const target of buildRevalidatePathTargets(collection, slug)) {
    revalidatePath(target)
  }
  invalidateGlobalCmsCaches()
}

function invalidateCmsCachesForBulk(collection: CmsCollectionKey, slugs: string[]): void {
  for (const slug of slugs) {
    for (const target of buildRevalidatePathTargets(collection, slug)) {
      revalidatePath(target)
    }
  }
  // Aggregates are invalidated once for the whole batch, not once per slug.
  invalidateGlobalCmsCaches()
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
  const editorBaseCreate = `/admin/cms?collection=${definition.key}&intent=create`
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

  // FIX-052: editing the slug renames the document. Because document id = slug,
  // a rename = write at the new id + delete the old one (handled at save time).
  // Guard against clobbering an existing document at the target slug first.
  const isRename = !isCreate && cmsOriginalSlug.length > 0 && slug !== cmsOriginalSlug
  if (isRename) {
    const clash = await getCmsDocument(definition.key, slug)
    if (clash) {
      redirect(`${editorBaseEdit(cmsOriginalSlug)}&error=slug-taken`)
    }
  }

  // Pass 1: parse every field. parseFieldValue throws InvalidFieldValueError on
  // bad JSON / NaN / wrong shape — surface that to the editor instead of silently
  // dropping the value (FIX-001).
  const parsed: Record<string, unknown> = {}
  try {
    for (const field of getAllFields(definition)) {
      if (field.type === 'multi_reference') {
        const parts = formData.getAll(field.name).map((v) => String(v).trim()).filter(Boolean)
        parsed[field.name] = [...new Set(parts)]
        continue
      }
      const raw = String(formData.get(field.name) ?? '')
      parsed[field.name] = parseFieldValue(field, raw)
    }
  } catch (err) {
    if (err instanceof InvalidFieldValueError) {
      const back = isCreate ? editorBaseCreate : editorBaseEdit(slug)
      redirect(`${back}&error=invalid-${err.fieldName}`)
    }
    throw err
  }

  // Pass 2: required-field check (separate from parsing so a parse error is
  // distinguishable from a missing-required error).
  for (const field of getAllFields(definition)) {
    if (!field.required) continue
    const value = parsed[field.name]
    const missing =
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    if (missing) {
      redirect(`${isCreate ? editorBaseCreate : editorBaseEdit(slug)}&error=missing-${field.name}`)
    }
  }

  // FIX-020: image media assets require non-empty altText for accessibility.
  // Conditional on assetType=image because video/document assets don't render
  // as <img> on the public site.
  if (definition.key === 'media_assets' && parsed.assetType === 'image') {
    const alt = parsed.altText
    if (!(typeof alt === 'string' && alt.trim().length > 0)) {
      redirect(`${isCreate ? editorBaseCreate : editorBaseEdit(slug)}&error=missing-altText`)
    }
  }

  // CMO-redesign: blog_posts require featured_image_alt when featured_image
  // is set (a11y + image SEO). Symmetric with the media_assets rule above.
  if (definition.key === 'blog_posts') {
    const featuredImage = parsed.featured_image
    if (typeof featuredImage === 'string' && featuredImage.trim().length > 0) {
      const altText = parsed.featured_image_alt
      if (!(typeof altText === 'string' && altText.trim().length > 0)) {
        redirect(`${isCreate ? editorBaseCreate : editorBaseEdit(slug)}&error=missing-featured_image_alt`)
      }
    }
  }

  // Pass 3: build the payload, omitting undefined values so partial submits
  // don't overwrite stored data with undefined.
  const payload: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(parsed)) {
    if (v !== undefined) payload[k] = v
  }

  payload[slugField] = slug

  // CMO-redesign: auto-compute reading_time for blog_posts at save time.
  // Uses ~200 wpm on plain-text-stripped body; stored alongside payload so
  // the editor never has to think about it. If body is empty, omit the field.
  if (definition.key === 'blog_posts') {
    const body = parsed.body
    if (typeof body === 'string' && body.trim().length > 0) {
      const plain = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      const words = plain.length > 0 ? plain.split(' ').length : 0
      if (words > 0) {
        payload.reading_time = Math.max(1, Math.round(words / 200))
      }
    }
  }

  // Status precedence (FIX-016): button-clicked `requestedStatus` wins, then the
  // server-known current doc status, then 'draft'. The form's `status` select
  // (formStatus) is no longer in the chain — it was a phantom input that let any
  // API caller set any status. Editors must change status via the explicit
  // status-action buttons.
  // FIX-047: collapsed status enum from 6 values to 3.
  const ALLOWED_STATUSES = new Set(['draft', 'in_review', 'published'])
  const requestedStatus = String(formData.get('requestedStatus') ?? '').trim()
  const currentDocStatus = String(formData.get('cmsCurrentStatus') ?? '').trim()
  const resolvedStatus = ALLOWED_STATUSES.has(requestedStatus)
    ? requestedStatus
    : ALLOWED_STATUSES.has(currentDocStatus)
    ? currentDocStatus
    : 'draft'
  payload.status = resolvedStatus

  // Editors cannot directly publish — submission is bumped to in_review.
  if (role === 'editor' && payload.status === 'published') {
    payload.status = 'in_review'
  }

  if (typeof payload.status !== 'string') payload.status = 'draft'

  try {
    await upsertCmsDocument(definition.key, slug, payload, sessionDisplayName(session))
    // FIX-052: a rename writes at the new slug (= new id), then deletes the old
    // document so it isn't orphaned (left live at its old URL) and duplicated.
    if (isRename) {
      await deleteCmsDocument(definition.key, cmsOriginalSlug)
    }
    // Two-version workflow: a draft save NEVER touches the published snapshot —
    // it only recomputes has_unpublished_changes (draft vs snapshot). For a
    // published doc this flags the diverged draft so the header shows Republish;
    // for a draft it compares against any prior snapshot. Editing a published doc
    // therefore no longer changes the live page until Publish/Republish.
    await markDraftDirty(definition.key, slug, payload)
  } catch {
    redirect(`${isCreate ? editorBaseCreate : editorBaseEdit(slug)}&error=save-failed`)
  }

  invalidateCmsCaches(definition.key, slug)
  // Revalidate the old route too so the renamed-away URL stops serving stale content.
  if (isRename) invalidateCmsCaches(definition.key, cmsOriginalSlug)
  redirect(`/admin/cms?collection=${definition.key}&slug=${encodeURIComponent(slug)}&saved=1`)
}

/** "Published 12 Jun 2026" label for the publish bar (null when never published). */
function formatPublishedAtLabel(value: unknown): string | null {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(date.getTime())) return null
  return `Published ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
}

/**
 * Publish / Republish (admin/owner only). Serves BOTH: the publishWorkflow op
 * copies the current draft → `<id>/_published/current`, denormalises the card,
 * and sets publish meta. THEN we revalidate (the op intentionally does not).
 * `collection`/`slug` are bound by the editor so the form carries no fields.
 */
async function publishCmsDocumentAction(collection: string, slug: string, _formData: FormData) {
  'use server'
  const session = await requireAdminAuth('admin')
  const definition = getCmsCollectionDefinition(collection)
  if (!definition || !slug.trim()) redirect('/admin/cms?error=invalid-input')

  try {
    await publishDoc(definition.key, slug, sessionDisplayName(session))
  } catch {
    redirect(`/admin/cms?collection=${definition.key}&slug=${encodeURIComponent(slug)}&error=publish-failed`)
  }

  // Caller-owned revalidation: doc route + listing + sitemap + llms now reflect
  // the freshly written snapshot.
  invalidateCmsCaches(definition.key, slug)
  redirect(`/admin/cms?collection=${definition.key}&slug=${encodeURIComponent(slug)}&saved=1`)
}

/**
 * Unpublish (admin/owner only): flip status to draft so the live URL 404s. The
 * published snapshot is retained (cheap re-publish). Revalidate so the now-
 * unpublished route stops serving.
 */
async function unpublishCmsDocumentAction(collection: string, slug: string, _formData: FormData) {
  'use server'
  await requireAdminAuth('admin')
  const definition = getCmsCollectionDefinition(collection)
  if (!definition || !slug.trim()) redirect('/admin/cms?error=invalid-input')

  try {
    await unpublishDoc(definition.key, slug, 'draft')
  } catch {
    redirect(`/admin/cms?collection=${definition.key}&slug=${encodeURIComponent(slug)}&error=unpublish-failed`)
  }

  invalidateCmsCaches(definition.key, slug)
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
    await rollbackCmsDocumentToRevision(definition.key, id, revisionId, sessionDisplayName(session))
  } catch {
    redirect(`/admin/cms?collection=${definition.key}&slug=${encodeURIComponent(id)}&error=rollback-failed`)
  }
  invalidateCmsCaches(definition.key, id)
  redirect(`/admin/cms?collection=${definition.key}&slug=${encodeURIComponent(id)}&saved=1`)
}

async function bulkUpdateStatusAction(formData: FormData) {
  'use server'
  const session = await requireAdminAuth()
  const role = sessionRole(session)

  const collectionRaw = String(formData.get('collection') ?? '')
  const definition = getCmsCollectionDefinition(collectionRaw)
  if (!definition) redirect('/admin/cms?error=invalid-collection')

  // FIX-047: collapsed 6-state enum to 3.
  const ALLOWED: CmsDocumentStatus[] = ['draft', 'in_review', 'published']
  const requested = String(formData.get('status') ?? '') as CmsDocumentStatus
  if (!ALLOWED.includes(requested)) redirect(`/admin/cms?collection=${definition.key}&error=invalid-status`)

  // Editors cannot directly publish in bulk — bumped to in_review.
  let effective: CmsDocumentStatus = requested
  if (role === 'editor' && effective === 'published') {
    effective = 'in_review'
  }

  const ids = formData.getAll('ids').map((v) => String(v)).filter(Boolean)
  if (ids.length === 0) redirect(`/admin/cms?collection=${definition.key}&error=no-selection`)

  try {
    await bulkUpdateCmsDocumentStatus(definition.key, ids, effective, sessionDisplayName(session))
  } catch {
    redirect(`/admin/cms?collection=${definition.key}&error=bulk-update-failed`)
  }

  invalidateCmsCachesForBulk(definition.key, ids)
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
    result = await duplicateCmsDocument(definition.key, id, sessionDisplayName(session))
  } catch {
    redirect(`/admin/cms?collection=${definition.key}&error=duplicate-failed`)
  }
  invalidateCmsCaches(definition.key, result.id)
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
  invalidateCmsCaches(definition.key, id)
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

  invalidateCmsCachesForBulk(definition.key, ids)
  redirect(`/admin/cms?collection=${definition.key}&saved=1`)
}

async function logoutAction() {
  'use server'
  await destroyAdminSession()
  redirect('/admin/login')
}

/**
 * Per-field affordances shared by every section renderer:
 *  - an inline ✨ AI button for eligible short fields (rendered in the label row)
 *  - plain-language helper text under the control
 *  - an `aiContext` pass-through for long-form fields (handled in the editor toolbar)
 */
function fieldAffordances(field: CmsFieldDefinition, aiContext?: AiContext) {
  const ai = aiContext ? resolveAiField(field.name, field.type) : null
  const aiButton =
    ai && !ai.longForm && aiContext ? (
      <AiFieldButton targetName={field.name} fieldLabel={field.label} config={ai} context={aiContext} />
    ) : null
  const helperText = getFieldHelperText(field.name)
  const helper = helperText ? <p className="mt-1 text-xs text-slate-500">{helperText}</p> : null
  const editorAiContext = ai?.longForm ? aiContext : undefined
  return { aiButton, helper, editorAiContext }
}

function renderSection(
  id: string,
  title: string,
  fields: CmsFieldDefinition[],
  values: FieldValueMap,
  referenceOptions: Record<string, Array<{ id: string; label: string }>>,
  mediaAssetUrls: string[],
  documentHydrationKey = '',
  aiContext?: AiContext
) {
  return (
    <section id={id} className="rounded-2xl border border-cms-rule bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
      <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{title}</h3>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {fields.map((field) => {
          const value = stringifyFieldValue(field, values[field.name])
          const { aiButton, helper, editorAiContext } = fieldAffordances(field, aiContext)
          const header = (
            <span className="flex items-center gap-2">
              {field.label}
              {field.required ? (
                <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-brand-primary">
                  Required
                </span>
              ) : null}
              {aiButton}
            </span>
          )
          const control = (
            <FieldRenderer
              field={field}
              value={value}
              referenceOptions={referenceOptions}
              mediaAssetUrls={mediaAssetUrls}
              documentHydrationKey={documentHydrationKey}
              aiContext={editorAiContext}
            />
          )
          const baseClass = `block text-sm font-medium text-slate-800 ${fieldColumnSpan(field)}`
          if (field.type === 'multi_reference') {
            return (
              <div key={field.name} className={baseClass}>
                {header}
                {control}
                {helper}
              </div>
            )
          }
          return (
            <label key={field.name} className={baseClass}>
              {header}
              {control}
              {helper}
            </label>
          )
        })}
      </div>
    </section>
  )
}

/** Like `renderSection`, but pairs the title + slug so the slug can follow the title until the slug is edited. */
function renderMainEditorSection(
  id: string,
  titleText: string,
  fields: CmsFieldDefinition[],
  values: FieldValueMap,
  referenceOptions: Record<string, Array<{ id: string; label: string }>>,
  mediaAssetUrls: string[],
  documentHydrationKey: string,
  opts: { slugAutoSync: boolean; titleFieldName: string; slugFieldName: string },
  aiContext?: AiContext
) {
  const tf = fields[0]
  const sf = fields[1]
  const useSyncedPair =
    tf?.name === opts.titleFieldName &&
    sf?.name === opts.slugFieldName &&
    tf?.type === 'text' &&
    sf?.type === 'text'

  const restFields = useSyncedPair ? fields.slice(2) : fields

  return (
    <section id={id} className="rounded-2xl border border-cms-rule bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
      <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{titleText}</h3>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {useSyncedPair ? (
          <CmsTitleSlugFields
            autoSyncSlug={opts.slugAutoSync}
            titleName={tf.name}
            slugName={sf.name}
            titleLabel={tf.label}
            slugLabel={sf.label}
            titlePlaceholder={tf.placeholder}
            slugPlaceholder={sf.placeholder}
            titleRequired={tf.required}
            slugRequired={sf.required}
            initialTitle={stringifyFieldValue(tf, values[tf.name])}
            initialSlug={stringifyFieldValue(sf, values[sf.name])}
            titleClassName={`block text-sm font-medium text-slate-800 ${fieldColumnSpan(tf)}`}
            slugClassName={`block text-sm font-medium text-slate-800 ${fieldColumnSpan(sf)}`}
            aiContext={aiContext}
          />
        ) : null}
        {restFields.map((field) => {
          const value = stringifyFieldValue(field, values[field.name])
          const { aiButton, helper, editorAiContext } = fieldAffordances(field, aiContext)
          const header = (
            <span className="flex items-center gap-2">
              {field.label}
              {field.required ? (
                <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-brand-primary">
                  Required
                </span>
              ) : null}
              {aiButton}
            </span>
          )
          const control = (
            <FieldRenderer
              field={field}
              value={value}
              referenceOptions={referenceOptions}
              mediaAssetUrls={mediaAssetUrls}
              documentHydrationKey={documentHydrationKey}
              aiContext={editorAiContext}
            />
          )
          const baseClass = `block text-sm font-medium text-slate-800 ${fieldColumnSpan(field)}`
          if (field.type === 'multi_reference') {
            return (
              <div key={field.name} className={baseClass}>
                {header}
                {control}
                {helper}
              </div>
            )
          }
          return (
            <label key={field.name} className={baseClass}>
              {header}
              {control}
              {helper}
            </label>
          )
        })}
      </div>
    </section>
  )
}

function renderSidebarSection(
  id: string,
  title: string,
  fields: CmsFieldDefinition[],
  values: FieldValueMap,
  subtitle?: string,
  referenceOptions: Record<string, Array<{ id: string; label: string }>> = {},
  mediaAssetUrls: string[] = [],
  documentHydrationKey = '',
  aiContext?: AiContext
) {
  return (
    <section id={id} className="rounded-2xl border border-cms-rule bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{title}</p>
      {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
      <div className="mt-3 flex flex-col gap-3">
        {fields.map((field) => {
          const value = stringifyFieldValue(field, values[field.name])
          const { aiButton, helper, editorAiContext } = fieldAffordances(field, aiContext)
          const header = (
            <span className="flex items-center gap-2">
              {field.label}
              {field.required ? (
                <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-brand-primary">
                  Required
                </span>
              ) : null}
              {aiButton}
            </span>
          )
          const control = (
            <FieldRenderer
              field={field}
              value={value}
              referenceOptions={referenceOptions}
              mediaAssetUrls={mediaAssetUrls}
              documentHydrationKey={documentHydrationKey}
              aiContext={editorAiContext}
            />
          )
          const boxClass = 'block rounded-xl border border-cms-rule bg-cms-soft p-3 text-sm font-medium text-slate-800'
          if (field.type === 'multi_reference') {
            return (
              <div key={field.name} className={boxClass}>
                {header}
                {control}
                {helper}
              </div>
            )
          }
          return (
            <label key={field.name} className={boxClass}>
              {header}
              {control}
              {helper}
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
          <aside className="flex min-h-0 flex-col rounded-2xl border border-cms-rule bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] lg:overflow-y-auto">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-brand-primary">Finanshels CMS</p>
      <Link
        href={
          definition.key === 'media_assets'
            ? `/admin/cms?collection=${definition.key}#cms-media-upload`
            : `/admin/cms?collection=${definition.key}&intent=create`
        }
        className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-brand-dark shadow-[0_12px_30px_rgba(241,102,16,0.25)] transition hover:brightness-110"
      >
        {definition.key === 'media_assets' ? '+ Upload media' : `+ New ${definition.singularLabel}`}
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
                          : 'border-transparent text-slate-700 hover:border-cms-rule hover:bg-cms-soft'
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

      <div className="mt-5 border-t border-cms-rule pt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Marketing</p>
        <Link
          href="/admin/cms/landing-pages"
          className="flex items-center justify-between gap-2 rounded-xl border border-transparent px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cms-rule hover:bg-cms-soft"
        >
          <span>Landing pages</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Ad-only</span>
        </Link>
        <Link
          href="/admin/cms/landing-page-leads"
          className="mt-1 flex items-center justify-between gap-2 rounded-xl border border-transparent px-3 py-2.5 text-sm text-slate-700 transition hover:border-cms-rule hover:bg-cms-soft"
        >
          <span>Lead inbox</span>
        </Link>
      </div>

      <div className="mt-5 space-y-1 border-t border-cms-rule pt-4 text-sm text-slate-700">
        {canManageUsers ? (
          <Link
            href="/admin/settings/users"
            className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-cms-soft"
          >
            <span>Settings</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Users</span>
          </Link>
        ) : (
          <Link href="/admin/settings/profile" className="block rounded-lg px-2 py-1.5 hover:bg-cms-soft">
            Settings
          </Link>
        )}
        <Link href="/blog" className="block rounded-lg px-2 py-1.5 hover:bg-cms-soft">
          View Blog
        </Link>
        <Link href="/" className="block rounded-lg px-2 py-1.5 hover:bg-cms-soft">
          View Site
        </Link>
      </div>

      <div className="mt-4 rounded-xl border border-cms-rule bg-cms-soft p-3">
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

  // FIX-048: default to the first collection in the registry rather than
  // hardcoding `'blog_posts'` — if blog_posts is ever removed or renamed,
  // hardcoded lookup throws at runtime and 500s the whole CMS dashboard.
  const fallbackCollection = CMS_COLLECTION_DEFINITIONS[0]?.key ?? 'blog_posts'
  const requestedCollection = params.collection ?? fallbackCollection
  const activeCollection = (CMS_COLLECTION_DEFINITION_MAP[requestedCollection as CmsCollectionKey]
    ? requestedCollection
    : fallbackCollection) as CmsCollectionKey
  const definition = CMS_COLLECTION_DEFINITION_MAP[activeCollection]

  // Editor view opens for an existing doc (?slug=…) OR a blank create (?intent=create).
  // Create mode renders the same full editor with empty values; AutosaveShell and the
  // revision panel stay slug-gated, so a new doc is committed via the manual Save button.
  const isEditorView = Boolean(params.slug) || params.intent === 'create'
  const fieldReferencedCollections = getReferencedCollections(definition)
  const allReferencedCollections = [
    ...new Set<CmsCollectionKey>([...fieldReferencedCollections, ...BLOCKS_REFERENCED_COLLECTIONS]),
  ]

  const [
    documentList,
    selectedDocument,
    collectionCounts,
    mediaLibraryForDatalist,
    referenceOptionResults,
    revisions,
    mediaLibraryItems,
  ] = await Promise.all([
    isEditorView
      ? Promise.resolve([])
      : activeCollection === 'media_assets'
      ? Promise.resolve([])
      : listCmsDocuments(definition.key, definition.titleField, definition.slugField),
    isEditorView && params.slug ? getCmsDocument(definition.key, params.slug) : Promise.resolve(null),
    getCachedCmsCollectionItemCounts(),
    // PERF: the editor's URL/image/file inputs decorate themselves with a datalist
    // of uploaded asset URLs. listCmsMediaLibraryItems already returns assetUrl on
    // each item, so this single read replaces the old behavior of (a) a wholly
    // unused `listCmsDocuments('media_assets', …)` fetch AND (b) a second media
    // read that ran *serially* after this Promise.all. One parallel read now.
    isEditorView ? listCmsMediaLibraryItems(120) : Promise.resolve([]),
    // PERF: reference options are only used by the editor form (reference/multi_reference fields).
    // The list view never reads them; the editor reads them through the cached wrapper
    // so repeat opens don't re-fan-out across every referenced collection.
    isEditorView
      ? Promise.all(allReferencedCollections.map((key) => getReferenceOptionsForCollection(key).then((options) => [key, options] as const)))
      : Promise.resolve([] as Array<readonly [CmsCollectionKey, Array<{ id: string; label: string }>]>),
    isEditorView && params.slug ? listCmsRevisions(definition.key, params.slug) : Promise.resolve([]),
    !isEditorView && activeCollection === 'media_assets' ? listCmsMediaLibraryItems() : Promise.resolve([]),
  ])
  const referenceOptionsBase = Object.fromEntries(referenceOptionResults) as Record<string, Array<{ id: string; label: string }>>
  const editingBlogSlug = activeCollection === 'blog_posts' && typeof params.slug === 'string' && params.slug.trim() ? params.slug.trim() : ''
  const referenceOptions =
    editingBlogSlug.length > 0
      ? {
          ...referenceOptionsBase,
          blog_posts: (referenceOptionsBase.blog_posts ?? []).filter((o) => o.id !== editingBlogSlug),
        }
      : referenceOptionsBase
  // FIX-010: listCmsMediaLibraryItems already returns assetUrl on each item, so
  // one read backs the <datalist>. PERF: that read now runs inside the Promise.all
  // above (mediaLibraryForDatalist) instead of as a serial await here, removing a
  // full round-trip from every editor open.
  const allMediaUrls = [
    ...new Set(
      mediaLibraryForDatalist
        .map((item) => (typeof item.assetUrl === 'string' ? item.assetUrl : ''))
        .filter(Boolean)
    ),
  ]

  const saved = params.saved === '1'
  const errorRaw = params.error
  const error =
    typeof errorRaw === 'string'
      ? errorRaw
      : Array.isArray(errorRaw) && typeof errorRaw[0] === 'string'
      ? errorRaw[0]
      : undefined

  if (!isEditorView) {
    const listRows = documentList.map((d) => ({
      id: d.id,
      slug: d.slug,
      title: d.title,
      status: d.status,
      updatedAtIso: d.updatedAt?.toISOString(),
      createdAtIso: d.createdAt?.toISOString(),
      publishedAtIso: d.publishedAt?.toISOString(),
    }))
    const canPublish = ROLE_RANK[role] >= ROLE_RANK['admin']
    const canDelete = ROLE_RANK[role] >= ROLE_RANK['admin']

    return (
      <section className="min-h-screen bg-cms-canvas text-slate-900">
        <div className="mx-auto max-w-[1900px] px-3 py-3 sm:px-5">
          <div className="grid items-start gap-3 xl:grid-cols-[minmax(260px,320px)_1fr]">
            <div className="xl:sticky xl:top-3">
              <AdminSidebar activeKey={definition.key} collectionCounts={collectionCounts} session={session} />
            </div>
            <div className="space-y-4 rounded-2xl border border-cms-rule bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
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

              {definition.key === 'media_assets' ? (
                <CmsMediaLibrary
                  items={mediaLibraryItems}
                  canDelete={canDelete}
                  cmsConfigured={isCmsConfigured()}
                  bucketConfigured={Boolean(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim())}
                  deleteAction={deleteCmsDocumentAction}
                />
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (params.slug && !selectedDocument) {
    return (
      <section className="min-h-screen bg-cms-canvas text-slate-900">
        <div className="mx-auto max-w-[1900px] px-3 py-3 sm:px-5">
          <div className="grid gap-3 xl:grid-cols-[minmax(260px,320px)_1fr]">
            <AdminSidebar activeKey={definition.key} collectionCounts={collectionCounts} session={session} />
            <div className="rounded-2xl border border-cms-rule bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
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
  const editorDocKey = typeof params.slug === 'string' && params.slug.trim() ? params.slug.trim() : '__edit__'

  const primaryPublishFieldsRaw = definition.sections.publish.filter((f) => isPrimaryEditorField(f, definition.slugField, definition.titleField))
  const primaryPublishFields = sortPrimaryFields(primaryPublishFieldsRaw, definition.slugField, definition.titleField)
  const sidePublishFields = definition.sections.publish.filter(
    (f) =>
      !isPrimaryEditorField(f, definition.slugField, definition.titleField) &&
      // Avoid showing a duplicate generic "Title" in the sidebar when the
      // collection already uses a custom title field (e.g. term, full_name).
      !(f.name === 'title' && definition.titleField !== 'title')
  )
  // CLEANUP: profile/label collections suppress the SEO/AEO/GEO sections (no public
  // route → those answer-engine tabs are dead weight). Only surface a settings tab
  // when its section actually has fields, so the aside header isn't padded with
  // empty scorecards for a Team Member / Video / Review Source.
  const showSeoTab = definition.sections.seo.length > 0
  const showAeoTab = definition.sections.aeo.length > 0
  const showGeoTab = definition.sections.geo.length > 0
  const settingsTabIds = [
    'publish',
    ...(showSeoTab ? ['seo'] : []),
    ...(showAeoTab ? ['aeo'] : []),
    ...(showGeoTab ? ['geo'] : []),
  ]
  const lastSettingsTabId = settingsTabIds[settingsTabIds.length - 1]
  const currentStatus = String(formValues.status ?? 'draft')
  // AI generation context: title + main body field names let the ✨ buttons pull
  // live values from the form, and the collection key tunes the prompt voice.
  const aiContext: AiContext = {
    titleField: definition.titleField,
    bodyField: primaryPublishFields.find((f) => isMainContentField(f))?.name,
    collection: definition.key,
  }
  // FIX-025: canonical SEO field names are snake_case. CamelCase reads remain
  // as fallbacks for any unmigrated documents (whose admin form no longer
  // exposes them, but whose stored values still flow through grading).
  const seoTitle = readText(formValues.seo_title ?? formValues.seoTitle)
  const seoDescription = readText(formValues.meta_description ?? formValues.seoDescription)
  const focusKeyword = readText(formValues.focus_keyword ?? formValues.focusKeyword)
  const secondaryKeywordCount = readTagCount(formValues.secondary_keywords ?? formValues.secondaryKeywords ?? formValues.meta_keywords)
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
  ) => {
    // CLEANUP: never emit an empty section card (a header with no fields). Suppressed
    // sections (card/listing/detail/blocks) arrive here as [] and should render
    // nothing — this also drops the Card preview that rides on `extra`.
    if (fields.length === 0) return null
    return (
      <div className="space-y-3">
        {renderSection(id, title, fields, values, refs, assets, editorDocKey, aiContext)}
        {options?.extra ? <div>{options.extra}</div> : null}
      </div>
    )
  }

  return (
    <section className="min-h-dvh bg-cms-canvas text-slate-900">
      <div className="mx-auto max-w-[1900px] px-3 py-3 sm:px-5">
        {/* FIX-053: the editor is a normal-scroll page (like every other admin
            page since FIX-050), NOT a fixed h-dvh island. The old shell pinned the
            section to h-dvh + overflow-hidden with per-pane internal scroll, which
            left dead whitespace below short forms and trapped tall ones. Now the
            page scrolls; the left nav and right rail are sticky so they stay in
            view. `items-start` keeps the sticky rails from stretch-matching height. */}
        <div className="grid gap-3 lg:grid-cols-[minmax(260px,320px)_minmax(0,60fr)_minmax(0,25fr)] lg:items-start">
          <AdminSidebar activeKey={definition.key} collectionCounts={collectionCounts} session={session} />

          {/* FIX-052: noValidate — required fields can live in inactive (display:none)
              tabs, and native HTML5 validation aborts submit on a non-focusable
              required control with no message ("not focusable"), dead-ending the
              save. Validation is done server-side and surfaced by CmsFormValidator
              (which scrolls to + highlights the offending field, including in tabs). */}
          <form
            action={saveCmsDocumentAction}
            id="cms-editor-form"
            data-cms-editor=""
            noValidate
            className="grid gap-3 lg:col-span-2 lg:grid-cols-[minmax(0,60fr)_minmax(0,25fr)] lg:items-start"
          >
            <input type="hidden" name="collection" value={definition.key} />
            <input type="hidden" name="cmsIntent" value={params.slug ? 'edit' : 'create'} />
            {params.slug ? <input type="hidden" name="cmsOriginalSlug" value={params.slug} /> : null}
            {params.slug ? <input type="hidden" name="id" value={params.slug} /> : null}
            <input type="hidden" name="cmsCurrentStatus" value={currentStatus} />
            {/* Task 11: friendly inline validation — scrolls to + highlights the
                offending field instead of leaving a raw error code in a banner. */}
            <CmsFormValidator error={error ?? null} />

            <div className="flex flex-col space-y-0 rounded-2xl border border-cms-rule bg-[#fcfaf7] p-0 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              {/* Sticky editor header — Webflow style */}
              <div className="sticky top-0 z-20 flex items-center gap-3 rounded-t-2xl border-b border-cms-rule bg-white/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/85">
                <Link
                  href={`/admin/cms?collection=${definition.key}`}
                  aria-label={`Back to ${definition.label}`}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cms-rule bg-white text-slate-600 hover:bg-cms-hover hover:text-slate-900"
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

                <div className="flex flex-wrap items-center justify-end gap-2">
                  {saved ? (
                    <span
                      role="status"
                      aria-live="polite"
                      className="inline-flex shrink-0 items-center rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-800"
                    >
                      Saved · cache refreshed
                    </span>
                  ) : null}
                  {/* Two-version publish bar: autosave + Publish/Republish/Unpublish
                      (via publishDoc) + Preview/View. Supersedes the old AutosaveShell
                      and View link; the segmented control below keeps only the
                      draft-side Draft / In Review status changes. */}
                  {definition.routePattern && publicSlug ? (
                    <EditorPublishBar
                      formId="cms-editor-form"
                      collection={definition.key}
                      slug={params.slug}
                      status={currentStatus as 'draft' | 'in_review' | 'published' | 'archived'}
                      hasUnpublishedChanges={Boolean(formValues.has_unpublished_changes)}
                      canPublish={ROLE_RANK[role] >= ROLE_RANK['admin']}
                      publishedAtLabel={formatPublishedAtLabel(formValues.published_at)}
                      previewUrl={`${definition.routePattern.replace('[slug]', publicSlug)}?preview=1`}
                      liveUrl={
                        currentStatus === 'published'
                          ? definition.routePattern.replace('[slug]', publicSlug)
                          : null
                      }
                      publishAction={publishCmsDocumentAction.bind(null, definition.key, publicSlug)}
                      unpublishAction={unpublishCmsDocumentAction.bind(null, definition.key, publicSlug)}
                    />
                  ) : null}
                  {/*
                    FIX-047: status workflow collapsed to 3 states. The segmented
                    control below is the ONLY way to change status — each segment
                    is a submit button that saves the form with that status in
                    one click. The trailing Save Changes button preserves the
                    current status faithfully (previously it silently coerced to
                    'draft' whenever the doc wasn't 'published', producing the
                    "I clicked Save but it's still a draft" bug).
                  */}
                  <div className="inline-flex overflow-hidden rounded-lg border border-cms-rule bg-white text-[11px] font-semibold uppercase tracking-wide">
                    <button
                      type="submit"
                      name="requestedStatus"
                      value="draft"
                      title="Save as draft"
                      className={`px-2.5 py-2 transition ${
                        currentStatus === 'draft'
                          ? 'bg-amber-100 text-amber-800'
                          : 'text-slate-600 hover:bg-cms-soft'
                      }`}
                    >
                      Draft
                    </button>
                    <button
                      type="submit"
                      name="requestedStatus"
                      value="in_review"
                      title="Send for review"
                      className={`border-l border-cms-rule px-2.5 py-2 transition ${
                        currentStatus === 'in_review'
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-slate-600 hover:bg-cms-soft'
                      }`}
                    >
                      In Review
                    </button>
                    {/* "Published" removed from the form-save segmented control:
                        publishing now goes through the EditorPublishBar's Publish/
                        Republish action (publishDoc → snapshot), which is the only
                        path that writes the live snapshot. Draft / In Review remain
                        here as draft-side status changes. */}
                  </div>
                  <button
                    type="submit"
                    name="requestedStatus"
                    value={currentStatus}
                    title="Save field changes, keep current status"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-[0_6px_18px_rgba(15,23,42,0.18)] hover:bg-slate-800"
                  >
                    <span aria-hidden>💾</span> Save changes
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-4">
                <div className="space-y-4">
                  {renderMainEditorSection(
                    'main-editor',
                    'Main Editor',
                    primaryPublishFields,
                    formValues,
                    referenceOptions,
                    allMediaUrls,
                    editorDocKey,
                    {
                      slugAutoSync: false,
                      titleFieldName: definition.titleField,
                      slugFieldName: definition.slugField,
                    },
                    aiContext
                  )}

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
                        { defaultOpen: true }
                      )
                    : null}
                </div>
              </div>
            </div>

            <aside className="group/cms-aside flex flex-col rounded-2xl border border-cms-rule bg-[#fcfaf7] p-0 shadow-[0_10px_30px_rgba(15,23,42,0.06)] lg:sticky lg:top-3 lg:max-h-[calc(100dvh_-_1.5rem)] lg:overflow-y-auto">
              {/*
                Tab visibility: Tailwind `peer-checked` only works for *following siblings* of `.peer`.
                Panels lived inside a wrapper div, so they were never siblings of the radios and every
                panel stayed `hidden`. Use `group-has-[#id:checked]` on the aside instead.
                Tab labels: each radio must sit immediately before its label as a sibling so
                `peer-checked/*` styles apply to the active tab chip.
              */}
              <div className="sticky top-0 z-20 border-b border-cms-rule bg-[#fcfaf7]/95 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-[#fcfaf7]/80">
                <div
                  className="grid overflow-hidden rounded-lg border border-cms-rule bg-white text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500"
                  style={{ gridTemplateColumns: `repeat(${settingsTabIds.length}, minmax(0, 1fr))` }}
                >
                  <div className={`min-w-0${lastSettingsTabId === 'publish' ? '' : ' border-r border-cms-rule'}`}>
                    <input
                      id="cms-tab-publish"
                      type="radio"
                      name="cms-settings-tab"
                      className="peer/tab-publish sr-only"
                      defaultChecked
                    />
                    <label
                      htmlFor="cms-tab-publish"
                      className="block cursor-pointer px-2 py-2 text-center transition hover:bg-cms-soft peer-checked/tab-publish:bg-brand-primary/10 peer-checked/tab-publish:text-brand-primary"
                    >
                      Publish
                    </label>
                  </div>
                  {showSeoTab ? (
                    <div className={`min-w-0${lastSettingsTabId === 'seo' ? '' : ' border-r border-cms-rule'}`}>
                      <input id="cms-tab-seo" type="radio" name="cms-settings-tab" className="peer/tab-seo sr-only" />
                      <label
                        htmlFor="cms-tab-seo"
                        className="block cursor-pointer px-2 py-2 text-center transition hover:bg-cms-soft peer-checked/tab-seo:bg-brand-primary/10 peer-checked/tab-seo:text-brand-primary"
                      >
                        SEO
                      </label>
                    </div>
                  ) : null}
                  {showAeoTab ? (
                    <div className={`min-w-0${lastSettingsTabId === 'aeo' ? '' : ' border-r border-cms-rule'}`}>
                      <input id="cms-tab-aeo" type="radio" name="cms-settings-tab" className="peer/tab-aeo sr-only" />
                      <label
                        htmlFor="cms-tab-aeo"
                        className="block cursor-pointer px-2 py-2 text-center transition hover:bg-cms-soft peer-checked/tab-aeo:bg-brand-primary/10 peer-checked/tab-aeo:text-brand-primary"
                      >
                        AEO
                      </label>
                    </div>
                  ) : null}
                  {showGeoTab ? (
                    <div className="min-w-0">
                      <input id="cms-tab-geo" type="radio" name="cms-settings-tab" className="peer/tab-geo sr-only" />
                      <label
                        htmlFor="cms-tab-geo"
                        className="block cursor-pointer px-2 py-2 text-center transition hover:bg-cms-soft peer-checked/tab-geo:bg-brand-primary/10 peer-checked/tab-geo:text-brand-primary"
                      >
                        GEO
                      </label>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="hidden space-y-3 px-3 pb-3 pt-3 group-has-[#cms-tab-publish:checked]/cms-aside:block">
                {/*
                  FIX-047: the multi-button "Stage for publish" panel was the
                  source of every "I clicked publish but it stayed draft" bug.
                  Publish actions now live in the single segmented control in
                  the editor header. This card is just a status indicator.
                */}
                <div className="rounded-2xl border border-cms-rule bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Workflow</p>
                  <p className="mt-2 text-xs text-slate-600">
                    Change status with the{' '}
                    <span className="font-semibold text-slate-900">Draft / In Review / Published</span>{' '}
                    control in the editor header. Each click saves and changes status in one step.
                  </p>
                  <p className="mt-3 text-xs text-slate-500">
                    Current status:{' '}
                    <span
                      className={
                        currentStatus === 'published'
                          ? 'font-semibold text-emerald-700'
                          : currentStatus === 'in_review'
                          ? 'font-semibold text-blue-700'
                          : 'font-semibold text-amber-700'
                      }
                    >
                      {currentStatus.replace(/_/g, ' ')}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Role: {role}</p>
                  {role === 'editor' ? (
                    <p className="mt-2 text-[11px] text-slate-500">
                      Editors can save as draft or send for review. Only owner / admin can publish.
                    </p>
                  ) : null}
                </div>

                {sidePublishFields.length > 0
                  ? renderSidebarSection(
                      'publish',
                      'Publishing',
                      sidePublishFields,
                      formValues,
                      'Core metadata for publishing',
                      referenceOptions,
                      allMediaUrls,
                      editorDocKey,
                      aiContext
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
                  <section className="rounded-2xl border border-cms-rule bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Revision History</p>
                    <div className="mt-3 space-y-2">
                      {revisions.length === 0 ? (
                        <p className="text-xs text-slate-500">No revisions yet.</p>
                      ) : (
                        revisions.map((rev) => (
                          <div key={rev.id} className="rounded-lg border border-[#efe4d8] bg-cms-soft p-2.5">
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

              {showSeoTab ? (
              <div className="hidden space-y-3 px-3 pb-3 pt-3 group-has-[#cms-tab-seo:checked]/cms-aside:block">
                <section className="rounded-2xl border border-cms-rule bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">SEO Score</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-3xl font-semibold text-emerald-700">{seoScore}</p>
                    <p className="text-xs text-slate-500">out of 56</p>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Keyword density target: 1.5%-2.5% | Meta description: {seoDescription.length}/160
                  </p>
                </section>
                <section className="rounded-2xl border border-cms-rule bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Google SERP Preview</p>
                  <p className="mt-3 text-xs text-emerald-700">{readText(formValues.canonical_url ?? formValues.canonicalUrl) || 'https://www.finanshels.com/...'}</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{seoTitle || 'Your SEO title appears here'}</p>
                  <p className="mt-1 text-sm text-slate-700">
                    {seoDescription || 'Your meta description appears here for search previews.'}
                  </p>
                </section>
                {renderSidebarSection(
                  'seo',
                  'Search (SEO)',
                  definition.sections.seo,
                  formValues,
                  'Single-column CMO control panel',
                  referenceOptions,
                  allMediaUrls,
                  editorDocKey,
                  aiContext
                )}
                {renderChecklistCard('SEO Checklist', seoChecklist)}
              </div>
              ) : null}

              {showAeoTab ? (
              <div className="hidden space-y-3 px-3 pb-3 pt-3 group-has-[#cms-tab-aeo:checked]/cms-aside:block">
                <section className="rounded-2xl border border-amber-300 bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">AEO Tips - Answer Engines</p>
                  <ul className="mt-2 space-y-1 text-sm text-amber-800">
                    <li>- Use exact question phrasing users search for</li>
                    <li>- Keep direct answer snippets under 50 words</li>
                    <li>- Add 3+ FAQ items for rich-result eligibility</li>
                  </ul>
                </section>
                <section className="rounded-2xl border border-cms-rule bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">AEO Score</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-3xl font-semibold text-violet-700">{aeoScore}</p>
                    <p className="text-xs text-slate-500">out of 42</p>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">Direct answer length: {directAnswer.length}/300</p>
                </section>
                {renderSidebarSection(
                  'aeo',
                  'AI answers (AEO)',
                  definition.sections.aeo,
                  formValues,
                  'FAQ, direct answers, and speakable schema',
                  referenceOptions,
                  allMediaUrls,
                  editorDocKey,
                  aiContext
                )}
                {renderChecklistCard('AEO Checklist', aeoChecklist)}
              </div>
              ) : null}

              {showGeoTab ? (
              <div className="hidden space-y-3 px-3 pb-3 pt-3 group-has-[#cms-tab-geo:checked]/cms-aside:block">
                <section className="rounded-2xl border border-cyan-300 bg-cyan-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">GEO Tips - Optimized for LLMs</p>
                  <ul className="mt-2 space-y-1 text-sm text-cyan-800">
                    <li>- Cite trusted external sources for every major claim</li>
                    <li>- Add verifiable statistics and named expert quotes</li>
                    <li>- Tag related entities to improve AI context understanding</li>
                  </ul>
                </section>
                <section className="rounded-2xl border border-cms-rule bg-white p-4">
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
                  'AI search (GEO)',
                  definition.sections.geo,
                  formValues,
                  'Citations, entities, and AI-trust signals',
                  referenceOptions,
                  allMediaUrls,
                  editorDocKey,
                  aiContext
                )}
                {renderChecklistCard('GEO Checklist', geoChecklist)}
              </div>
              ) : null}
            </aside>
          </form>

        </div>
      </div>
    </section>
  )
}
