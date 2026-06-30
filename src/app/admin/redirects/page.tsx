import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { requireAdminAuth } from '@/lib/cms/adminAuth'
import {
  createRedirect,
  deleteRedirect,
  listRedirects,
  updateRedirect,
} from '@/lib/cms/redirectsRepository'
import { getSiteUrl } from '@/lib/cms/config'
import { Alert, Button, Card, Input } from '@/components/cms/admin/ui'

/**
 * FIX-073: CMS redirect manager. Marketing manages 301/302 rules here with no
 * deploy; `src/middleware.ts` applies them at runtime. Admin-only — redirects
 * are SEO-critical during the Webflow migration.
 */

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ error?: string; ok?: string }>

const MESSAGES: Record<string, string> = {
  invalid: 'Both "from" and "to" are required.',
  duplicate: 'A redirect for that path already exists — edit or delete it first.',
  loop: 'Source and destination cannot be identical.',
  not_configured: 'Firestore is not configured in this environment.',
}

async function createAction(formData: FormData) {
  'use server'
  await requireAdminAuth('admin')
  const result = await createRedirect({
    from: String(formData.get('from') ?? ''),
    to: String(formData.get('to') ?? ''),
    permanent: formData.get('permanent') === 'on',
    note: String(formData.get('note') ?? ''),
  })
  if (!result.ok) {
    redirect(`/admin/redirects?error=${result.error}`)
  }
  revalidatePath('/admin/redirects')
  redirect('/admin/redirects?ok=created')
}

async function toggleAction(formData: FormData) {
  'use server'
  await requireAdminAuth('admin')
  const id = String(formData.get('id') ?? '')
  const enabled = String(formData.get('enabled') ?? '') === 'true'
  if (id) await updateRedirect(id, { enabled: !enabled })
  revalidatePath('/admin/redirects')
  redirect('/admin/redirects?ok=updated')
}

async function deleteAction(formData: FormData) {
  'use server'
  await requireAdminAuth('admin')
  const id = String(formData.get('id') ?? '')
  if (id) await deleteRedirect(id)
  revalidatePath('/admin/redirects')
  redirect('/admin/redirects?ok=deleted')
}

// FIX-073: manual sitemap refresh. Google deprecated the sitemap ping endpoint,
// so "submission" is: force-regenerate /sitemap.xml so freshly published (and
// freshly redirected) URLs appear immediately, then submit in Search Console.
async function revalidateSitemapAction() {
  'use server'
  await requireAdminAuth('admin')
  revalidatePath('/sitemap.xml')
  revalidatePath('/llms.txt')
  redirect('/admin/redirects?ok=sitemap-refreshed')
}

export default async function RedirectsAdminPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdminAuth('admin')
  const { error, ok } = await searchParams
  const rules = await listRedirects()
  const activeCount = rules.filter((r) => r.enabled).length
  const siteUrl = getSiteUrl()
  const sitemapUrl = `${siteUrl}/sitemap.xml`
  const gscSitemapUrl = `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(siteUrl)}`

  const OK_MESSAGES: Record<string, string> = {
    created: 'Redirect created.',
    updated: 'Redirect updated.',
    deleted: 'Redirect deleted.',
    'sitemap-refreshed': 'Sitemap regenerated — submit it in Search Console to recrawl.',
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/admin/cms"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft className="size-4" />
        Back to CMS
      </Link>

      <div className="mt-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Redirects</h1>
        <p className="mt-2 text-sm text-slate-600">
          301/302 rules applied at the edge. Use these to preserve SEO when old Webflow URLs change.
          {' '}
          <span className="font-medium text-slate-800">{activeCount} active</span> of {rules.length}.
        </p>
      </div>

      {error ? (
        <div className="mt-5">
          <Alert variant="error">{MESSAGES[error] ?? 'Something went wrong.'}</Alert>
        </div>
      ) : null}
      {ok ? (
        <div className="mt-5">
          <Alert variant="success">{OK_MESSAGES[ok] ?? 'Done.'}</Alert>
        </div>
      ) : null}

      {/* Add a redirect */}
      <Card className="mt-6 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Add a redirect</h2>
        <form action={createAction} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="from"
              label="From (old path)"
              placeholder="/old-webflow-url"
              required
              helperText="Pathname only — query strings are ignored."
            />
            <Input
              name="to"
              label="To (destination)"
              placeholder="/new-url or https://…"
              required
            />
          </div>
          <Input name="note" label="Note (optional)" placeholder="Why this redirect exists" />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="permanent" defaultChecked className="size-4 rounded border-slate-300" />
            Permanent (301 / 308) — uncheck for a temporary 302 / 307
          </label>
          <Button type="submit" variant="primary">
            Add redirect
          </Button>
        </form>
      </Card>

      {/* Sitemap & submission */}
      <Card className="mt-6 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Sitemap</h2>
        <p className="mt-2 text-sm text-slate-600">
          Redirected URLs are dropped from the sitemap automatically. Refresh it after bulk changes,
          then (re)submit in Google Search Console to trigger a recrawl.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <a
            href={sitemapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 underline-offset-2 hover:underline"
          >
            View sitemap.xml ↗
          </a>
          <a
            href={gscSitemapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 underline-offset-2 hover:underline"
          >
            Open Search Console ↗
          </a>
        </div>
        <form action={revalidateSitemapAction} className="mt-4">
          <Button type="submit" variant="secondary" size="sm">
            Regenerate sitemap now
          </Button>
        </form>
      </Card>

      {/* Existing rules */}
      <div className="mt-8">
        {rules.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
            No redirects yet. Add your first rule above.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">From → To</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rules.map((rule) => (
                  <tr key={rule.id} className="align-top">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{rule.from}</div>
                      <div className="text-slate-500">→ {rule.to}</div>
                      {rule.note ? <div className="mt-1 text-xs text-slate-400">{rule.note}</div> : null}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{rule.permanent ? '301' : '302'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                          rule.enabled
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {rule.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <form action={toggleAction}>
                          <input type="hidden" name="id" value={rule.id} />
                          <input type="hidden" name="enabled" value={String(rule.enabled)} />
                          <Button type="submit" variant="secondary" size="sm">
                            {rule.enabled ? 'Disable' : 'Enable'}
                          </Button>
                        </form>
                        <form action={deleteAction}>
                          <input type="hidden" name="id" value={rule.id} />
                          <Button type="submit" variant="danger" size="sm">
                            Delete
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
