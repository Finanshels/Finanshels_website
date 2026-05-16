import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdminAuth } from '@/lib/cms/adminAuth'
import { getConversation } from '@/lib/chat/leadRepository'

export const dynamic = 'force-dynamic'

const STATUS_STYLE: Record<string, string> = {
  synced: 'bg-emerald-100 text-emerald-800',
  queued: 'bg-amber-100 text-amber-800',
  failed: 'bg-red-100 text-red-800',
  pending: 'bg-slate-100 text-slate-700',
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-AE', {
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

interface PageProps {
  params: Promise<{ sessionId: string }>
}

function Field({
  label,
  value,
  mono = false,
}: {
  label: string
  value?: string | null
  mono?: boolean
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <dt className="col-span-1 text-slate-500">{label}</dt>
      <dd className={`col-span-2 break-words text-slate-900 ${mono ? 'font-mono text-[11px]' : ''}`}>
        {value && value.length > 0 ? value : <span className="text-slate-400">—</span>}
      </dd>
    </div>
  )
}

export default async function AdminChatDetailPage({ params }: PageProps) {
  await requireAdminAuth('editor')
  const { sessionId } = await params
  const conv = await getConversation(sessionId)
  if (!conv) notFound()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin/chat" className="text-sm text-slate-500 hover:text-slate-700">
            ← All conversations
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Conversation transcript</h1>
          <p className="text-xs text-slate-500">Session: {conv.sessionId}</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            STATUS_STYLE[conv.zohoStatus] ?? STATUS_STYLE.pending
          }`}
        >
          Zoho: {conv.zohoStatus}
        </span>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-1">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Lead</h2>
          <dl className="space-y-2 text-sm">
            <Field
              label="Name"
              value={[conv.lead.firstName, conv.lead.lastName].filter(Boolean).join(' ')}
            />
            <Field label="Email" value={conv.lead.email} />
            <Field label="Phone" value={conv.lead.phone} />
            <Field label="Company" value={conv.lead.companyName} />
            <Field label="Size" value={conv.lead.companySize} />
            <Field label="Intent" value={conv.lead.intent ?? conv.intent} />
            <Field label="Captured" value={conv.capturedAt ? fmtDate(conv.capturedAt) : '—'} />
            <Field label="Zoho lead ID" value={conv.zohoLeadId ?? '—'} />
            {conv.zohoLastError && <Field label="Last error" value={conv.zohoLastError} mono />}
          </dl>
          <hr className="my-4 border-slate-200" />
          <dl className="space-y-2 text-xs text-slate-500">
            <Field label="Page" value={conv.pageUrl} />
            <Field label="First seen" value={fmtDate(conv.firstSeenAt)} />
            <Field label="Last seen" value={fmtDate(conv.lastSeenAt)} />
            <Field label="Messages" value={String(conv.messageCount)} />
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-900">Transcript</h2>
          </div>
          <div className="space-y-3 px-4 py-4">
            {conv.messages.length === 0 && (
              <p className="text-sm text-slate-500">No messages yet.</p>
            )}
            {conv.messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={[
                    'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm',
                    m.role === 'user'
                      ? 'bg-orange-600 text-white rounded-br-md'
                      : 'bg-slate-100 text-slate-900 rounded-bl-md',
                  ].join(' ')}
                >
                  <p className="whitespace-pre-wrap break-words leading-relaxed">{m.content}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      m.role === 'user' ? 'text-orange-100' : 'text-slate-500'
                    }`}
                  >
                    {fmtDate(m.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
