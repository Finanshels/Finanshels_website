import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { requireAdminAuth } from '@/lib/cms/adminAuth'
import {
  getLead,
  listLandingPages,
  listLeads,
  updateLeadSyncState,
} from '@/lib/landing-pages/repository'
import { leadToZohoPayload, pushLeadToZoho } from '@/lib/landing-pages/zohoClient'
import { getServiceInterestLabel } from '@/lib/landing-pages/serviceInterests'

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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <Link href="/admin/cms/landing-pages" className="text-xs text-slate-500 hover:text-slate-700">← Landing pages</Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Landing page leads</h1>
          <p className="text-sm text-slate-600 mt-1">Every form submission across all landing pages. Source of truth in Firestore.</p>
        </div>
        <a
          href={`?${new URLSearchParams({
            ...(sp.status ? { status: sp.status } : {}),
            ...(sp.page ? { page: sp.page } : {}),
            ...(sp.from ? { from: sp.from } : {}),
            ...(sp.to ? { to: sp.to } : {}),
            export: '1',
          }).toString()}`}
          className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Export CSV
        </a>
      </div>

      <form method="get" className="flex flex-wrap gap-2 mb-4 text-sm items-end">
        <label className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Landing page</span>
          <select name="page" defaultValue={sp.page ?? ''} className="rounded-lg border border-slate-300 px-3 py-1.5 min-w-[180px]">
            <option value="">All pages</option>
            {allPages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.internal_name || p.slug}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Zoho status</span>
          <select name="status" defaultValue={sp.status ?? ''} className="rounded-lg border border-slate-300 px-3 py-1.5">
            <option value="">All</option>
            <option value="synced">Synced</option>
            <option value="failed">Failed</option>
          </select>
        </label>
        <label className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">From</span>
          <input type="date" name="from" defaultValue={sp.from ?? ''} className="rounded-lg border border-slate-300 px-3 py-1.5" />
        </label>
        <label className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">To</span>
          <input type="date" name="to" defaultValue={sp.to ?? ''} className="rounded-lg border border-slate-300 px-3 py-1.5" />
        </label>
        <button className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium hover:bg-slate-50">Apply</button>
        {(sp.page || sp.status || sp.from || sp.to) ? (
          <Link href="/admin/cms/landing-page-leads" className="rounded-lg px-3 py-1.5 text-slate-500 hover:text-slate-700">Clear</Link>
        ) : null}
        <span className="text-xs text-slate-500 ml-auto">{leads.length} {leads.length === 1 ? 'lead' : 'leads'}</span>
      </form>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <Th>When</Th>
              <Th>Name</Th>
              <Th>Phone</Th>
              <Th>Email</Th>
              <Th>Page</Th>
              <Th>Service</Th>
              <Th>UTM source</Th>
              <Th>Zoho</Th>
              <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-slate-500">No leads match these filters.</td></tr>
            ) : leads.flatMap((lead) => [
              <tr key={lead.id} className="hover:bg-slate-50/60">
                <Td>{formatDateTime(lead.submitted_at)}</Td>
                <Td className="font-medium text-slate-900">{lead.name}</Td>
                <Td><a href={`tel:${lead.phone}`} className="text-blue-700 hover:underline">{lead.phone}</a></Td>
                <Td><a href={`mailto:${lead.email}`} className="text-blue-700 hover:underline">{lead.email}</a></Td>
                <Td className="text-xs font-mono text-slate-600">/landing-pages/{lead.landing_page_slug}</Td>
                <Td>{getServiceInterestLabel(lead.service_interest)}</Td>
                <Td className="text-slate-600">{lead.utm_source ?? '—'}</Td>
                <Td>
                  {lead.zoho_lead_id ? (
                    <span className="inline-flex items-center rounded-full text-[11px] font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-700" title={`Zoho ID: ${lead.zoho_lead_id}`}>
                      Synced
                    </span>
                  ) : lead.zoho_sync_error ? (
                    <span className="inline-flex items-center rounded-full text-[11px] font-semibold px-2 py-0.5 bg-rose-100 text-rose-700" title={lead.zoho_sync_error}>
                      Failed
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full text-[11px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600">Pending</span>
                  )}
                </Td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    {!lead.zoho_lead_id ? (
                      <form action={retryZohoAction}>
                        <input type="hidden" name="lead_id" value={lead.id} />
                        <button className="text-xs px-2 py-1 rounded border border-slate-200 hover:bg-white">Retry Zoho</button>
                      </form>
                    ) : null}
                  </div>
                </td>
              </tr>,
              <tr key={`${lead.id}-detail`} className="bg-slate-50/40">
                <td colSpan={9} className="px-4 py-0">
                  <details className="group">
                    <summary className="cursor-pointer list-none py-2 text-xs text-slate-500 hover:text-slate-700 select-none">
                      <span className="group-open:hidden">▸ Show attribution &amp; sync details</span>
                      <span className="hidden group-open:inline">▾ Hide details</span>
                    </summary>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 pb-4 text-[11px]">
                      <Detail label="Lead ID" value={lead.id} mono />
                      <Detail label="Company" value={lead.company_name ?? '—'} />
                      <Detail label="Submitted at" value={lead.submitted_at?.toISOString() ?? '—'} mono />
                      <Detail label="Zoho ID" value={lead.zoho_lead_id ?? '—'} mono />
                      <Detail label="Zoho synced at" value={lead.zoho_synced_at?.toISOString() ?? '—'} mono />
                      <Detail label="Zoho retries" value={String(lead.zoho_retry_count)} />
                      <Detail label="Resend sent at" value={lead.resend_email_sent_at?.toISOString() ?? '—'} mono />
                      <Detail label="Resend error" value={lead.resend_email_error ?? '—'} />
                      <Detail label="GCLID" value={lead.gclid ?? '—'} mono />
                      <Detail label="UTM source" value={lead.utm_source ?? '—'} />
                      <Detail label="UTM medium" value={lead.utm_medium ?? '—'} />
                      <Detail label="UTM campaign" value={lead.utm_campaign ?? '—'} />
                      <Detail label="UTM term" value={lead.utm_term ?? '—'} />
                      <Detail label="UTM content" value={lead.utm_content ?? '—'} />
                      <Detail label="Referrer" value={lead.referrer ?? '—'} mono />
                      <Detail label="Landing URL" value={lead.landing_url ?? '—'} mono />
                      <div className="col-span-2 md:col-span-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">User agent</p>
                        <p className="text-[11px] font-mono text-slate-700 truncate" title={lead.user_agent}>{lead.user_agent || '—'}</p>
                      </div>
                      {lead.zoho_sync_error ? (
                        <div className="col-span-2 md:col-span-4">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-rose-600">Last Zoho sync error</p>
                          <p className="text-[11px] font-mono text-rose-700 whitespace-pre-wrap break-all">{lead.zoho_sync_error}</p>
                        </div>
                      ) : null}
                    </div>
                  </details>
                </td>
              </tr>,
            ])}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap">{children}</th>
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className ?? ''}`}>{children}</td>
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`text-[11px] text-slate-800 truncate ${mono ? 'font-mono' : ''}`} title={value}>{value}</p>
    </div>
  )
}
