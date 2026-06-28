import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { Download } from 'lucide-react'
import { requireAdminAuth } from '@/lib/cms/adminAuth'
import {
  getLead,
  listLandingPages,
  listLeads,
  updateLeadSyncState,
} from '@/lib/landing-pages/repository'
import type { LandingPageLead } from '@/lib/landing-pages/types'
import { leadToZohoPayload, pushLeadToZoho } from '@/lib/landing-pages/zohoClient'
import { getServiceInterestLabel } from '@/lib/landing-pages/serviceInterests'
import { LeadRoster } from '@/components/cms/admin/leads/LeadRoster'
import type { LeadView } from '@/components/cms/admin/leads/leadTypes'

export const dynamic = 'force-dynamic'

async function retryZohoAction(formData: FormData) {
  'use server'
  await requireAdminAuth('editor')
  const leadId = String(formData.get('lead_id') ?? '')
  if (!leadId) return
  const lead = await getLead(leadId)
  if (!lead) return
  const result = await pushLeadToZoho(leadToZohoPayload(lead))
  if (result.ok) {
    await updateLeadSyncState(leadId, {
      zoho_lead_id: result.zoho_lead_id,
      zoho_synced_at: new Date(),
      zoho_sync_error: null,
    })
  } else {
    await updateLeadSyncState(leadId, {
      zoho_sync_error: result.error,
      increment_zoho_retry: true,
    })
  }
  revalidatePath('/admin/cms/landing-page-leads')
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

function formatDateTime(d: Date | null): string {
  if (!d) return '—'
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function parseDate(input: string | undefined, endOfDay = false): Date | undefined {
  if (!input) return undefined
  // Expecting yyyy-mm-dd from <input type="date">
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) return undefined
  const d = new Date(`${input}T${endOfDay ? '23:59:59.999' : '00:00:00'}Z`)
  return Number.isNaN(d.getTime()) ? undefined : d
}

/** Maps a firebase-backed lead into the client roster's stringified view-model. */
function toLeadView(lead: LandingPageLead): LeadView {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company_name ?? '',
    pageSlug: lead.landing_page_slug,
    serviceLabel: getServiceInterestLabel(lead.service_interest),
    zohoStatus: lead.zoho_lead_id ? 'synced' : lead.zoho_sync_error ? 'failed' : 'pending',
    zohoLeadId: lead.zoho_lead_id ?? '',
    zohoSyncedLabel: formatDateTime(lead.zoho_synced_at),
    zohoRetryCount: String(lead.zoho_retry_count),
    zohoSyncError: lead.zoho_sync_error ?? '',
    submittedLabel: formatDateTime(lead.submitted_at),
    resendSentLabel: formatDateTime(lead.resend_email_sent_at),
    resendError: lead.resend_email_error ?? '',
    gclid: lead.gclid ?? '',
    gbraid: lead.gbraid ?? '',
    wbraid: lead.wbraid ?? '',
    utmSource: lead.utm_source ?? '',
    utmMedium: lead.utm_medium ?? '',
    utmCampaign: lead.utm_campaign ?? '',
    utmTerm: lead.utm_term ?? '',
    utmContent: lead.utm_content ?? '',
    referrer: lead.referrer ?? '',
    landingUrl: lead.landing_url ?? '',
    userAgent: lead.user_agent ?? '',
    ipHash: lead.ip_hash ?? '',
  }
}

export default async function LandingPageLeadsView({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; export?: string; from?: string; to?: string }>
}) {
  await requireAdminAuth('editor')
  const sp = await searchParams

  const startDate = parseDate(sp.from, false)
  const endDate = parseDate(sp.to, true)

  const filters = {
    landingPageId: sp.page || undefined,
    status: (sp.status === 'synced' || sp.status === 'failed' ? sp.status : 'all') as 'synced' | 'failed' | 'all',
    startDate,
    endDate,
    limit: sp.export === '1' ? 5000 : 500,
  }

  const [leads, allPages] = await Promise.all([listLeads(filters), listLandingPages({})])

  if (sp.export === '1') {
    const header = [
      'submitted_at',
      'landing_page_slug',
      'name',
      'phone',
      'email',
      'company_name',
      'service_interest',
      'gclid',
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'referrer',
      'landing_url',
      'zoho_lead_id',
      'zoho_sync_error',
    ]
    const lines = [header.join(',')]
    for (const lead of leads) {
      lines.push(
        header
          .map((key) => {
            if (key === 'submitted_at') return csvEscape(lead.submitted_at?.toISOString() ?? '')
            const v = (lead as unknown as Record<string, unknown>)[key]
            return csvEscape(typeof v === 'string' ? v : v == null ? '' : String(v))
          })
          .join(',')
      )
    }
    const body = lines.join('\n')
    return (
      <pre className="p-4 text-xs font-mono whitespace-pre-wrap bg-white border border-slate-200 rounded-lg m-6">
        {body}
      </pre>
    )
  }

  const leadViews = leads.map(toLeadView)
  const hasFilters = Boolean(sp.page || sp.status || sp.from || sp.to)
  const exportHref = `?${new URLSearchParams({
    ...(sp.status ? { status: sp.status } : {}),
    ...(sp.page ? { page: sp.page } : {}),
    ...(sp.from ? { from: sp.from } : {}),
    ...(sp.to ? { to: sp.to } : {}),
    export: '1',
  }).toString()}`

  const filterFieldClass =
    'rounded-lg border border-cms-rule bg-white px-3 py-1.5 text-slate-900 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'

  return (
    <section className="min-h-screen bg-cms-canvas text-slate-900">
      <div className="mx-auto max-w-6xl px-3 py-6 sm:px-5">
        <div className="space-y-4 rounded-2xl border border-cms-rule bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Link href="/admin/cms/landing-pages" className="text-xs text-slate-500 hover:text-brand-primary">
                ← Landing pages
              </Link>
              <h1 className="mt-1 text-xl font-semibold text-slate-900">Landing page leads</h1>
              <p className="mt-1 text-sm text-slate-500">
                Every form submission across all landing pages. Source of truth in Firestore.
              </p>
              <p className="mt-2 text-xs text-slate-500">
                <strong className="font-semibold text-slate-700">{leadViews.length}</strong>{' '}
                {leadViews.length === 1 ? 'lead' : 'leads'}
                {hasFilters ? ' match these filters' : ''}
              </p>
            </div>
            <a
              href={exportHref}
              className="inline-flex items-center gap-2 rounded-lg border border-cms-rule bg-cms-soft px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-cms-hover"
            >
              <Download size={15} /> Export CSV
            </a>
          </header>

          <form method="get" className="flex flex-wrap items-end gap-2 rounded-2xl border border-cms-rule bg-cms-soft p-3 text-sm">
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Landing page</span>
              <select name="page" defaultValue={sp.page ?? ''} className={`${filterFieldClass} min-w-[180px]`}>
                <option value="">All pages</option>
                {allPages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.internal_name || p.slug}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Zoho status</span>
              <select name="status" defaultValue={sp.status ?? ''} className={filterFieldClass}>
                <option value="">All</option>
                <option value="synced">Synced</option>
                <option value="failed">Failed</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">From</span>
              <input type="date" name="from" defaultValue={sp.from ?? ''} className={filterFieldClass} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">To</span>
              <input type="date" name="to" defaultValue={sp.to ?? ''} className={filterFieldClass} />
            </label>
            <button
              type="submit"
              className="rounded-lg border border-cms-rule bg-white px-3 py-1.5 font-medium text-slate-700 transition hover:bg-cms-hover"
            >
              Apply
            </button>
            {hasFilters ? (
              <Link
                href="/admin/cms/landing-page-leads"
                className="rounded-lg px-3 py-1.5 text-slate-500 transition hover:text-brand-primary"
              >
                Clear
              </Link>
            ) : null}
          </form>

          <section className="overflow-hidden rounded-2xl border border-cms-rule bg-white">
            <header className="flex items-center justify-between border-b border-cms-rule bg-cms-soft px-4 py-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Leads</h2>
              <span className="text-xs text-slate-500">{leadViews.length} total</span>
            </header>
            {leadViews.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <p className="text-sm font-medium text-slate-600">No leads match these filters</p>
                <p className="mt-1 text-sm text-slate-400">
                  Adjust the filters above or clear them to see all submissions.
                </p>
              </div>
            ) : (
              <LeadRoster leads={leadViews} retryZoho={retryZohoAction} />
            )}
          </section>
        </div>
      </div>
    </section>
  )
}
