import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import ConfirmDeleteForm from '@/components/cms/admin/landingPages/ConfirmDeleteForm'
import LandingPageEditor from '@/components/cms/admin/landingPages/LandingPageEditor'
import { requireAdminAuth, sessionDisplayName } from '@/lib/cms/adminAuth'
import { deleteLandingPage, getLandingPageById, updateLandingPage } from '@/lib/landingPages/repository'
import type { LandingPageWriteInput } from '@/lib/landingPages/repository'

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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
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
          Saved.
        </div>
      ) : null}
      {sp.error ? (
        <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 px-3 py-2 text-sm">
          {decodeURIComponent(sp.error)}
        </div>
      ) : null}

      <LandingPageEditor page={page} saveAction={saveAction} />
    </div>
  )
}
