import Link from 'next/link'
import { requireAdminAuth } from '@/lib/cms/adminAuth'
import { listConversations } from '@/lib/chat/leadRepository'

export const dynamic = 'force-dynamic'

const STATUS_STYLE: Record<string, string> = {
  synced: 'bg-emerald-100 text-emerald-800',
  queued: 'bg-amber-100 text-amber-800',
  failed: 'bg-red-100 text-red-800',
  pending: 'bg-slate-100 text-slate-700',
}

function fmtDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString('en-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function firstUserMessage(messages: { role: string; content: string }[]): string {
  const m = messages.find((m) => m.role === 'user')
  return m?.content.slice(0, 140) ?? '(no user message yet)'
}

function leadLabel(lead: {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}): string {
  const name = [lead.firstName, lead.lastName].filter(Boolean).join(' ').trim()
  if (name && lead.email) return `${name} · ${lead.email}`
  if (name && lead.phone) return `${name} · ${lead.phone}`
  if (name) return name
  if (lead.email) return lead.email
  if (lead.phone) return lead.phone
  return 'Anonymous'
}

export default async function AdminChatListPage() {
  await requireAdminAuth('editor')
  const conversations = await listConversations({ limit: 100 })

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Chat conversations</h1>
          <p className="text-sm text-slate-500">
            Newest first. Click a row to see the full transcript and lead status.
          </p>
        </div>
        <Link
          href="/admin/cms"
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          ← Back to CMS
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Lead
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                First message
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Messages
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Zoho
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Last seen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {conversations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-500">
                  No conversations yet. The widget shows up at the bottom-right of every marketing page.
                </td>
              </tr>
            )}
            {conversations.map((conv) => (
              <tr key={conv.sessionId} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/chat/${conv.sessionId}`}
                    className="text-sm font-medium text-slate-900 hover:text-orange-600"
                  >
                    {leadLabel(conv.lead)}
                  </Link>
                  {conv.intent && <p className="text-xs text-slate-500">Intent: {conv.intent}</p>}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {firstUserMessage(conv.messages)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">{conv.messageCount}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      STATUS_STYLE[conv.zohoStatus] ?? STATUS_STYLE.pending
                    }`}
                  >
                    {conv.zohoStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{fmtDate(conv.lastSeenAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
