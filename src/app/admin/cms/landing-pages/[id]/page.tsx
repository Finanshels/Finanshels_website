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

export const dynamic = 'force-dynamic'

async function saveAction(formData: FormData) {
  'use server'
  const session = await requireAdminAuth('editor')
  const id = String(formData.get('id') ?? '')
  const payloadJson = String(formData.get('payload') ?? '')
  if (!id || !payloadJson) redirect(`/admin/cms/landing-pages/${id}?error=missing_payload`)

  let parsed: LandingPageWriteInput
  try {
    parsed = JSON.parse(payloadJson) as LandingPageWriteInput
  } catch {
    redirect(`/admin/cms/landing-pages/${id}?error=invalid_payload`)
    return
  }

  try {
    await updateLandingPage(id, parsed, sessionDisplayName(session))
  } catch (err) {
    const msg = encodeURIComponent(err instanceof Error ? err.message : 'unknown')
    redirect(`/admin/cms/landing-pages/${id}?error=${msg}`)
    return
  }

  revalidatePath('/admin/cms/landing-pages')
  revalidatePath(`/admin/cms/landing-pages/${id}`)
  if (parsed.slug) revalidatePath(`/landing-pages/${parsed.slug}`)
  redirect(`/admin/cms/landing-pages/${id}?saved=1`)
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
  searchParams: Promise<{ saved?: string; error?: string }>
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
    <div className="flex flex-col bg-slate-50 lg:h-screen lg:overflow-hidden">
      {/* Static app-shell header */}
      <header className="flex flex-none items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-2 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <Link href="/admin/cms/landing-pages" className="shrink-0 text-xs text-slate-500 hover:text-slate-700">
            ← All
          </Link>
          <span className="h-4 w-px shrink-0 bg-slate-200" aria-hidden />
          <h1 className="truncate text-sm font-semibold text-slate-900">
            {page.internal_name || 'Untitled landing page'}
          </h1>
          <span className="hidden truncate text-xs text-slate-400 md:inline">/landing-pages/{page.slug}</span>
          <a
            className="hidden shrink-0 text-xs text-blue-700 hover:underline sm:inline"
            target="_blank"
            rel="noreferrer"
            href={`/landing-pages/${page.slug}`}
          >
            {page.status === 'published' ? 'View live ↗' : 'Preview ↗'}
          </a>
        </div>
        <ConfirmDeleteForm
          action={deleteAction}
          id={page.id}
          confirmMessage="Delete this landing page? This cannot be undone."
        >
          <button className="shrink-0 rounded-lg border border-rose-200 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50">
            Delete
          </button>
        </ConfirmDeleteForm>
      </header>

      {sp.saved ? (
        <div className="flex-none border-b border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm text-emerald-800 sm:px-6">
          Saved.
        </div>
      ) : null}
      {sp.error ? (
        <div className="flex-none border-b border-rose-200 bg-rose-50 px-4 py-1.5 text-sm text-rose-800 sm:px-6">
          {decodeURIComponent(sp.error)}
        </div>
      ) : null}

      <div className="min-h-0 flex-1">
        <LandingPageEditor
          page={page}
          saveAction={saveAction}
          mediaItems={mediaItems}
          bucketConfigured={bucketConfigured}
        />
      </div>
    </div>
  )
}
