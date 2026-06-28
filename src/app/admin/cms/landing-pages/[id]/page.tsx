import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import ConfirmDeleteForm from '@/components/cms/admin/landing-pages/ConfirmDeleteForm'
import LandingPageEditor from '@/components/cms/admin/landing-pages/LandingPageEditor'
import type { MediaPickerItem } from '@/components/cms/admin/MediaPickerModal'
import { requireAdminAuth, sessionDisplayName } from '@/lib/cms/adminAuth'
import { listCmsMediaLibraryItems } from '@/lib/cms/collectionRepository'
import { deleteLandingPage, getLandingPageById, updateLandingPage } from '@/lib/landing-pages/repository'
import type { LandingPageWriteInput } from '@/lib/landing-pages/repository'
import { markDraftDirty, publishDoc, unpublishDoc } from '@/lib/cms/publishWorkflow/operations'
import { LANDING_PAGE_COLLECTION } from '@/lib/landing-pages/types'

export const dynamic = 'force-dynamic'

/**
 * Persist the working draft. Two-version model: this NEVER flips status to
 * published and NEVER revalidates the public route — a save to a published page
 * stays invisible to visitors until Publish/Republish writes the snapshot.
 * After persisting, recompute `has_unpublished_changes` via `markDraftDirty`.
 * Returns the parsed payload so the publish path can reuse it.
 */
async function persistDraft(
  id: string,
  payloadJson: string,
  actorName: string,
): Promise<LandingPageWriteInput> {
  let parsed: LandingPageWriteInput
  try {
    parsed = JSON.parse(payloadJson) as LandingPageWriteInput
  } catch {
    redirect(`/admin/cms/landing-pages/${id}?error=invalid_payload`)
  }
  await updateLandingPage(id, parsed, actorName)
  // Recompute the draft-vs-published diff so the toolbar can show "Republish".
  // No public revalidation here — the live snapshot is untouched.
  await markDraftDirty(LANDING_PAGE_COLLECTION, id, parsed as unknown as Record<string, unknown>)
  return parsed
}

/** Save the working draft (status unchanged). Replaces the old go-live-on-save. */
async function saveAction(formData: FormData) {
  'use server'
  const session = await requireAdminAuth('editor')
  const id = String(formData.get('id') ?? '')
  const payloadJson = String(formData.get('payload') ?? '')
  if (!id || !payloadJson) redirect(`/admin/cms/landing-pages/${id}?error=missing_payload`)

  try {
    await persistDraft(id, payloadJson, sessionDisplayName(session))
  } catch (err) {
    const msg = encodeURIComponent(err instanceof Error ? err.message : 'unknown')
    redirect(`/admin/cms/landing-pages/${id}?error=${msg}`)
  }

  revalidatePath('/admin/cms/landing-pages')
  revalidatePath(`/admin/cms/landing-pages/${id}`)
  redirect(`/admin/cms/landing-pages/${id}?saved=1`)
}

/**
 * Publish or Republish. Persist the current draft (if the editor sent one),
 * snapshot it via `publishDoc`, then revalidate the live route. Serves both the
 * first publish and every republish of draft changes.
 */
async function publishAction(formData: FormData) {
  'use server'
  const session = await requireAdminAuth('editor')
  const id = String(formData.get('id') ?? '')
  if (!id) redirect(`/admin/cms/landing-pages?error=missing_id`)
  const payloadJson = String(formData.get('payload') ?? '')

  let slug = ''
  try {
    if (payloadJson) {
      const parsed = await persistDraft(id, payloadJson, sessionDisplayName(session))
      slug = parsed.slug ?? ''
    }
    await publishDoc(LANDING_PAGE_COLLECTION, id, sessionDisplayName(session))
    if (!slug) {
      const page = await getLandingPageById(id)
      slug = page?.slug ?? ''
    }
  } catch (err) {
    const msg = encodeURIComponent(err instanceof Error ? err.message : 'unknown')
    redirect(`/admin/cms/landing-pages/${id}?error=${msg}`)
  }

  revalidatePath('/admin/cms/landing-pages')
  revalidatePath(`/admin/cms/landing-pages/${id}`)
  if (slug) revalidatePath(`/landing-pages/${slug}`)
  redirect(`/admin/cms/landing-pages/${id}?published=1`)
}

/** Unpublish: flip status to draft so the live URL 404s; snapshot is retained. */
async function unpublishAction(formData: FormData) {
  'use server'
  await requireAdminAuth('editor')
  const id = String(formData.get('id') ?? '')
  if (!id) redirect(`/admin/cms/landing-pages?error=missing_id`)

  let slug = ''
  try {
    await unpublishDoc(LANDING_PAGE_COLLECTION, id, 'draft')
    const page = await getLandingPageById(id)
    slug = page?.slug ?? ''
  } catch (err) {
    const msg = encodeURIComponent(err instanceof Error ? err.message : 'unknown')
    redirect(`/admin/cms/landing-pages/${id}?error=${msg}`)
  }

  revalidatePath('/admin/cms/landing-pages')
  revalidatePath(`/admin/cms/landing-pages/${id}`)
  if (slug) revalidatePath(`/landing-pages/${slug}`)
  redirect(`/admin/cms/landing-pages/${id}?unpublished=1`)
}

async function deleteAction(formData: FormData) {
  'use server'
  await requireAdminAuth('owner')
  const id = String(formData.get('id') ?? '')
  if (!id) return
  await deleteLandingPage(id)
  revalidatePath('/admin/cms/landing-pages')
  redirect('/admin/cms/landing-pages')
}

export default async function EditLandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string; error?: string; published?: string; unpublished?: string }>
}) {
  await requireAdminAuth('editor')
  const { id } = await params
  const sp = await searchParams

  const page = await getLandingPageById(id)
  if (!page) notFound()

  // Media library for inline image pickers (upload + browse, no URL pasting).
  const mediaRaw = await listCmsMediaLibraryItems()
  const mediaItems: MediaPickerItem[] = mediaRaw
    .filter((m) => Boolean(m.assetUrl))
    .map((m) => ({ url: m.assetUrl, title: m.title, mimeType: m.mimeType }))
  const bucketConfigured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)

  return (
    <div className="mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <Link href="/admin/cms/landing-pages" className="text-xs text-slate-500 hover:text-slate-700">← All landing pages</Link>
          <h1 className="mt-1 text-xl font-semibold text-slate-900">{page.internal_name || 'Untitled landing page'}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            /landing-pages/{page.slug}{' '}
            {page.status === 'published' ? (
              <a className="text-blue-700 hover:underline" target="_blank" rel="noreferrer" href={`/landing-pages/${page.slug}`}>
                View live →
              </a>
            ) : (
              <a className="text-blue-700 hover:underline" target="_blank" rel="noreferrer" href={`/landing-pages/${page.slug}`}>
                Preview (logged in) →
              </a>
            )}
          </p>
        </div>
        <ConfirmDeleteForm
          action={deleteAction}
          id={page.id}
          confirmMessage="Delete this landing page? This cannot be undone."
        >
          <button className="text-xs px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50">Delete</button>
        </ConfirmDeleteForm>
      </div>

      {sp.saved ? (
        <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 text-sm">
          Draft saved.
        </div>
      ) : null}
      {sp.published ? (
        <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 text-sm">
          Published — your changes are now live.
        </div>
      ) : null}
      {sp.unpublished ? (
        <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2 text-sm">
          Unpublished — this page is no longer live.
        </div>
      ) : null}
      {sp.error ? (
        <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 px-3 py-2 text-sm">
          {decodeURIComponent(sp.error)}
        </div>
      ) : null}

      <LandingPageEditor
        page={page}
        saveAction={saveAction}
        publishAction={publishAction}
        unpublishAction={unpublishAction}
        mediaItems={mediaItems}
        bucketConfigured={bucketConfigured}
      />
    </div>
  )
}
