import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import ConfirmDeleteForm from '@/components/cms/admin/landing-pages/ConfirmDeleteForm'
import CreateLandingPageForm from '@/components/cms/admin/landing-pages/CreateLandingPageForm'
import { requireAdminAuth, sessionDisplayName } from '@/lib/cms/adminAuth'
import {
  createLandingPage,
  deleteLandingPage,
  duplicateLandingPage,
  findAvailableSlug,
  listLandingPages,
} from '@/lib/landing-pages/repository'
import { getLandingPageTemplate, landingPageTemplateMetas } from '@/lib/landing-pages/templates'
import { draftLandingPage } from '@/lib/landing-pages/aiDraft'
import { isAiConfigured } from '@/lib/cms/ai/models'
import { DEFAULT_CONVERSION_LABELS, DEFAULT_SEO, DEFAULT_THEME } from '@/lib/landing-pages/types'
import { SERVICE_INTERESTS, getServiceInterestLabel } from '@/lib/landing-pages/serviceInterests'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

async function createLandingPageAction(formData: FormData) {
  'use server'
  const session = await requireAdminAuth('editor')
  const internalName = String(formData.get('internal_name') ?? '').trim()
  const serviceInterest = String(formData.get('service_interest') ?? '').trim()
  if (!internalName) redirect('/admin/cms/landing-pages?error=missing_internal_name')

  const templateId = String(formData.get('template') ?? '').trim()
  const built = templateId ? getLandingPageTemplate(templateId)?.build() : null

  const slug = await findAvailableSlug(internalName)
  const id = await createLandingPage(
    {
      slug,
      internal_name: internalName,
      status: 'draft',
      service_interest: serviceInterest,
      google_ads_conversion_id: '',
      conversion_labels: { ...DEFAULT_CONVERSION_LABELS },
      primary_phone: '',
      whatsapp_number: '',
      whatsapp_prefilled_message: '',
      form_destination_emails: [],
      thank_you_redirect_url: '',
      sections: built?.sections ?? [],
      theme: { ...DEFAULT_THEME, ...(built?.theme ?? {}) },
      seo: { ...DEFAULT_SEO, ...(built?.seo ?? {}), title: internalName },
    },
    sessionDisplayName(session)
  )
  revalidatePath('/admin/cms/landing-pages')
  redirect(`/admin/cms/landing-pages/${id}`)
}

async function draftWithAiAction(formData: FormData) {
  'use server'
  const session = await requireAdminAuth('editor')
  const internalName = String(formData.get('internal_name') ?? '').trim()
  const serviceInterest = String(formData.get('service_interest') ?? '').trim()
  const goal = String(formData.get('goal') ?? '').trim()
  if (!internalName) redirect('/admin/cms/landing-pages?error=missing_internal_name')
  if (!goal) redirect('/admin/cms/landing-pages?error=missing_goal')
  if (!isAiConfigured()) redirect('/admin/cms/landing-pages?error=AI%20is%20not%20configured')

  let drafted
  try {
    drafted = await draftLandingPage({
      goal,
      service: serviceInterest,
      audience: String(formData.get('audience') ?? '').trim() || undefined,
      offer: String(formData.get('offer') ?? '').trim() || undefined,
      tone: String(formData.get('tone') ?? '').trim() || undefined,
    })
  } catch (err) {
    const msg = encodeURIComponent(err instanceof Error ? err.message : 'AI drafting failed')
    redirect(`/admin/cms/landing-pages?error=${msg}`)
    return
  }

  const slug = await findAvailableSlug(internalName)
  const id = await createLandingPage(
    {
      slug,
      internal_name: internalName,
      status: 'draft',
      service_interest: serviceInterest,
      google_ads_conversion_id: '',
      conversion_labels: { ...DEFAULT_CONVERSION_LABELS },
      primary_phone: '',
      whatsapp_number: '',
      whatsapp_prefilled_message: '',
      form_destination_emails: [],
      thank_you_redirect_url: '',
      sections: drafted.sections,
      theme: { ...DEFAULT_THEME, ...drafted.theme },
      seo: { ...DEFAULT_SEO, ...drafted.seo, title: drafted.seo.title || internalName },
    },
    sessionDisplayName(session)
  )
  revalidatePath('/admin/cms/landing-pages')
  redirect(`/admin/cms/landing-pages/${id}`)
}

async function duplicateAction(formData: FormData) {
  'use server'
  const session = await requireAdminAuth('editor')
  const id = String(formData.get('id') ?? '')
  if (!id) return
  const newId = await duplicateLandingPage(id, sessionDisplayName(session))
  revalidatePath('/admin/cms/landing-pages')
  redirect(`/admin/cms/landing-pages/${newId}`)
}

async function deleteAction(formData: FormData) {
  'use server'
  await requireAdminAuth('owner')
  const id = String(formData.get('id') ?? '')
  if (!id) return
  await deleteLandingPage(id)
  revalidatePath('/admin/cms/landing-pages')
}

function formatDate(d: Date | null): string {
  if (!d) return '—'
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default async function LandingPagesAdminList({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; q?: string; status?: string }>
}) {
  await requireAdminAuth('editor')
  const sp = await searchParams
  const status = sp.status === 'published' || sp.status === 'draft' || sp.status === 'archived' ? sp.status : undefined
  const items = await listLandingPages({ status, search: sp.q })

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <Link href="/admin/cms" className="text-xs text-slate-500 hover:text-slate-700">← Back to CMS</Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Landing pages</h1>
          <p className="text-sm text-slate-600 mt-1">Ad-only landing pages. Default to <code className="text-xs">noindex</code> + excluded from sitemap.</p>
        </div>
        <Link
          href="/admin/cms/landing-page-leads"
          className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          View leads →
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Create a new landing page</h2>
        <CreateLandingPageForm
          action={createLandingPageAction}
          draftAction={draftWithAiAction}
          aiConfigured={isAiConfigured()}
          serviceInterests={SERVICE_INTERESTS}
          templates={landingPageTemplateMetas()}
        />
      </div>

      <form className="flex flex-wrap gap-2 mb-4 text-sm" method="get">
        <input name="q" defaultValue={sp.q ?? ''} placeholder="Search slug or name" className="rounded-lg border border-slate-300 px-3 py-1.5" />
        <select name="status" defaultValue={status ?? ''} className="rounded-lg border border-slate-300 px-3 py-1.5">
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <button className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium hover:bg-slate-50">Filter</button>
        {sp.q || sp.status ? (
          <Link href="/admin/cms/landing-pages" className="rounded-lg px-3 py-1.5 text-slate-500 hover:text-slate-700">
            Clear
          </Link>
        ) : null}
      </form>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">Slug</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">Service</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">Updated</th>
              <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No landing pages yet. Create one above.</td></tr>
            ) : items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3 font-medium text-slate-900">
                  <Link href={`/admin/cms/landing-pages/${item.id}`} className="hover:underline">{item.internal_name || 'Untitled'}</Link>
                </td>
                <td className="px-4 py-3 text-slate-600 text-xs font-mono">/landing-pages/{item.slug}</td>
                <td className="px-4 py-3">
                  <StatusPill status={item.status} />
                </td>
                <td className="px-4 py-3 text-slate-600">{getServiceInterestLabel(item.service_interest)}</td>
                <td className="px-4 py-3 text-slate-500">{formatDate(item.updated_at)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    {item.status === 'published' ? (
                      <a
                        href={`/landing-pages/${item.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs px-2 py-1 rounded border border-slate-200 hover:bg-white"
                      >
                        View
                      </a>
                    ) : null}
                    <form action={duplicateAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <button className="text-xs px-2 py-1 rounded border border-slate-200 hover:bg-white">Duplicate</button>
                    </form>
                    <Link href={`/admin/cms/landing-pages/${item.id}`} className="text-xs px-2 py-1 rounded border border-slate-200 hover:bg-white">
                      Edit
                    </Link>
                    <ConfirmDeleteForm
                      action={deleteAction}
                      id={item.id}
                      confirmMessage="Delete this landing page? This cannot be undone."
                    >
                      <button className="text-xs px-2 py-1 rounded border border-rose-200 text-rose-700 hover:bg-rose-50">Delete</button>
                    </ConfirmDeleteForm>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: 'draft' | 'published' | 'archived' }) {
  const map = {
    draft: 'bg-slate-100 text-slate-700',
    published: 'bg-emerald-100 text-emerald-700',
    archived: 'bg-amber-100 text-amber-800',
  } as const
  return <span className={`inline-flex items-center rounded-full text-[11px] font-semibold px-2 py-0.5 ${map[status]}`}>{status}</span>
}
