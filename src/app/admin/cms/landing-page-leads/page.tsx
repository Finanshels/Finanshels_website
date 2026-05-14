import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { requireAdminAuth } from '@/lib/cms/adminAuth'
import {
  getLead,
  listLeads,
  updateLeadSyncState,
} from '@/lib/landingPages/repository'
import { leadToZohoPayload, pushLeadToZoho } from '@/lib/landingPages/zohoClient'
import { getServiceInterestLabel } from '@/lib/landingPages/serviceInterests'

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

export default async function LandingPageLeadsView({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; export?: string }>
}) {
  await requireAdminAuth('editor')
  const sp = await searchParams

  const filters = {
    landingPageId: sp.page || undefined,
    status: (sp.status === 'synced' || sp.status === 'failed' ? sp.status : 'all') as 'synced' | 'failed' | 'all',
    limit: sp.export === '1' ? 5000 : 500,
  }

  const leads = await listLeads(filters)

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
          href={`?${new URLSearchParams({ ...(sp.status ? { status: sp.status } : {}), ...(sp.page ? { page: sp.page } : {}), export: '1' }).toString()}`}
          className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Export CSV
        </a>
      </div>

      <form method="get" className="flex flex-wrap gap-2 mb-4 text-sm">
        <select name="status" defaultValue={sp.status ?? ''} className="rounded-lg border border-slate-300 px-3 py-1.5">
          <option value="">All statuses</option>
          <option value="synced">Synced to Zoho</option>
          <option value="failed">Zoho sync failed</option>
        </select>
        <button className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium hover:bg-slate-50">Filter</button>
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
              <tr><td colSpan={9} className="px-4 py-8 text-center text-slate-500">No leads yet.</td></tr>
            ) : leads.map((lead) => (
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
                  {!lead.zoho_lead_id ? (
                    <form action={retryZohoAction}>
                      <input type="hidden" name="lead_id" value={lead.id} />
                      <button className="text-xs px-2 py-1 rounded border border-slate-200 hover:bg-white">Retry Zoho</button>
                    </form>
                  ) : null}
                </td>
              </tr>
            ))}
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
