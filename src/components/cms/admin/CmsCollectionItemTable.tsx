'use client'

import Link from 'next/link'
import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, Pencil, Trash2, Eye, Search, Download, Plus, ChevronDown, X } from 'lucide-react'
import { getStatusStyle } from './statusStyle'

export type CmsListRow = {
  id: string
  slug: string
  title: string
  status: 'draft' | 'in_review' | 'approved' | 'scheduled' | 'published' | 'archived'
  updatedAtIso?: string
  createdAtIso?: string
  publishedAtIso?: string
  scheduledAtIso?: string
}

type SortKey = 'title' | 'status' | 'createdAt' | 'updatedAt'
type SortDir = 'asc' | 'desc'

type Props = {
  collectionKey: string
  label: string
  singularLabel: string
  items: CmsListRow[]
  /** Live URL pattern, eg "/blog/[slug]". When provided each row gets a "View" link. */
  routePattern?: string
  canPublish: boolean
  canDelete: boolean
  bulkStatusAction: (formData: FormData) => Promise<void>
  bulkDeleteAction: (formData: FormData) => Promise<void>
  duplicateAction: (formData: FormData) => Promise<void>
  deleteAction: (formData: FormData) => Promise<void>
}

const CMS_TABLE_DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'UTC',
})

function formatRelative(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return CMS_TABLE_DATE_FORMATTER.format(d)
}

function csvEscape(value: string): string {
  if (value == null) return ''
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

function exportCsv(rows: CmsListRow[], collectionKey: string): void {
  const headers = ['id', 'slug', 'title', 'status', 'createdAt', 'updatedAt', 'publishedAt', 'scheduledAt']
  const lines = [headers.join(',')]
  for (const r of rows) {
    lines.push(
      [r.id, r.slug, r.title, r.status, r.createdAtIso ?? '', r.updatedAtIso ?? '', r.publishedAtIso ?? '', r.scheduledAtIso ?? '']
        .map((v) => csvEscape(String(v ?? '')))
        .join(',')
    )
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${collectionKey}-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

const TAB_DEFS: Array<{ key: 'all' | CmsListRow['status']; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'draft', label: 'Draft' },
  { key: 'in_review', label: 'In Review' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'archived', label: 'Archived' },
]

export function CmsCollectionItemTable({
  collectionKey,
  label,
  singularLabel,
  items,
  routePattern,
  canPublish,
  canDelete,
  bulkStatusAction,
  bulkDeleteAction,
  duplicateAction,
  deleteAction,
}: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [q, setQ] = useState('')
  const [tab, setTab] = useState<'all' | CmsListRow['status']>('all')
  const [sortKey, setSortKey] = useState<SortKey>('updatedAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [updateOpen, setUpdateOpen] = useState(false)

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length }
    for (const i of items) c[i.status] = (c[i.status] ?? 0) + 1
    return c
  }, [items])

  const visible = useMemo(() => {
    const s = q.trim().toLowerCase()
    let list = items
    if (tab !== 'all') list = list.filter((i) => i.status === tab)
    if (s) {
      list = list.filter(
        (i) => i.title.toLowerCase().includes(s) || i.slug.toLowerCase().includes(s) || i.id.toLowerCase().includes(s)
      )
    }
    return [...list].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'title') return a.title.localeCompare(b.title) * dir
      if (sortKey === 'status') return a.status.localeCompare(b.status) * dir
      if (sortKey === 'createdAt') return ((new Date(a.createdAtIso ?? 0).getTime()) - (new Date(b.createdAtIso ?? 0).getTime())) * dir
      return ((new Date(a.updatedAtIso ?? 0).getTime()) - (new Date(b.updatedAtIso ?? 0).getTime())) * dir
    })
  }, [items, q, tab, sortKey, sortDir])

  const allVisibleSelected = visible.length > 0 && visible.every((r) => selected.has(r.id))
  const someVisibleSelected = visible.some((r) => selected.has(r.id))
  const selectionCount = selected.size

  function toggleAllVisible(): void {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allVisibleSelected) {
        for (const r of visible) next.delete(r.id)
      } else {
        for (const r of visible) next.add(r.id)
      }
      return next
    })
  }

  function toggleOne(id: string): void {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function clearSelection(): void {
    setSelected(new Set())
  }

  function toggleSort(key: SortKey): void {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir(key === 'title' ? 'asc' : 'desc')
    }
  }

  function submitBulkStatus(status: CmsListRow['status']): void {
    if (selectionCount === 0) return
    setUpdateOpen(false)
    startTransition(async () => {
      const fd = new FormData()
      for (const id of selected) fd.append('ids', id)
      fd.set('status', status)
      fd.set('collection', collectionKey)
      await bulkStatusAction(fd)
      clearSelection()
      router.refresh()
    })
  }

  function submitBulkDelete(): void {
    if (selectionCount === 0) return
    if (typeof window !== 'undefined') {
      const ok = window.confirm(`Delete ${selectionCount} ${selectionCount === 1 ? 'item' : 'items'}? This cannot be undone.`)
      if (!ok) return
    }
    startTransition(async () => {
      const fd = new FormData()
      for (const id of selected) fd.append('ids', id)
      fd.set('collection', collectionKey)
      await bulkDeleteAction(fd)
      clearSelection()
      router.refresh()
    })
  }

  function submitDuplicate(id: string): void {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('collection', collectionKey)
      fd.set('id', id)
      await duplicateAction(fd)
      router.refresh()
    })
  }

  function submitDelete(id: string, title: string): void {
    if (typeof window !== 'undefined') {
      const ok = window.confirm(`Delete "${title}"? This cannot be undone.`)
      if (!ok) return
    }
    startTransition(async () => {
      const fd = new FormData()
      fd.set('collection', collectionKey)
      fd.set('id', id)
      await deleteAction(fd)
      router.refresh()
    })
  }

  function SortBtn({ keyName, children }: { keyName: SortKey; children: React.ReactNode }) {
    const active = sortKey === keyName
    return (
      <button
        type="button"
        onClick={() => toggleSort(keyName)}
        className={`group inline-flex items-center gap-1 font-semibold uppercase tracking-[0.2em] ${active ? 'text-slate-800' : 'text-slate-500'} hover:text-slate-700`}
      >
        {children}
        <span aria-hidden className={`text-[10px] ${active ? 'opacity-100' : 'opacity-30 group-hover:opacity-60'}`}>
          {active ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
        </span>
      </button>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{label}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Browse, search, and manage every {singularLabel.toLowerCase()} in this collection.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportCsv(visible, collectionKey)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cms-rule bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-cms-soft"
            title="Export visible rows to CSV"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <Link
            href={
              collectionKey === 'media_assets'
                ? `/admin/cms?collection=${collectionKey}#cms-media-upload`
                : `/admin/cms/new/${collectionKey}`
            }
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-brand px-4 py-2 text-sm font-semibold text-brand-dark shadow-[0_10px_30px_rgba(241,102,16,0.35)] hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            New {singularLabel}
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${label.toLowerCase()}…`}
          className="w-full rounded-lg border border-cms-rule bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          aria-label="Filter items"
        />
        {/* FIX-018: announce filter result count to screen readers. */}
        <span aria-live="polite" className="sr-only">
          {q.trim() ? `${visible.length} ${visible.length === 1 ? 'result' : 'results'}` : ''}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-cms-rule text-sm">
        {TAB_DEFS.map((t) => {
          const active = tab === t.key
          const n = counts[t.key] ?? 0
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`relative -mb-px inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? 'text-slate-900 after:absolute after:inset-x-2 after:-bottom-px after:h-[2px] after:rounded-full after:bg-brand-primary'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
              <span className={`text-xs tabular-nums ${active ? 'text-slate-500' : 'text-slate-400'}`}>({n})</span>
            </button>
          )
        })}
      </div>

      {/* Bulk-action bar */}
      {selectionCount > 0 ? (
        <div className="sticky top-2 z-10 flex flex-col gap-2 rounded-xl border border-brand-primary/35 bg-cms-soft px-3 py-2 shadow-[0_10px_28px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-primary/15 px-2 text-xs font-semibold text-brand-primary">
              {selectionCount}
            </span>
            <span className="text-slate-800">{selectionCount === 1 ? 'item' : 'items'} selected</span>
            <button type="button" onClick={clearSelection} className="ml-1 inline-flex items-center text-xs text-slate-500 hover:text-slate-800">
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setUpdateOpen((o) => !o)}
                disabled={pending}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-primary px-3 py-2 text-sm font-semibold text-brand-dark hover:brightness-110 disabled:opacity-60"
              >
                Update items
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {updateOpen ? (
                <div className="absolute right-0 z-20 mt-1.5 w-56 overflow-hidden rounded-xl border border-cms-rule bg-white py-1 text-sm shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
                  <button type="button" onClick={() => submitBulkStatus('in_review')} className="block w-full px-4 py-2 text-left text-slate-700 hover:bg-cms-soft">
                    Stage for review
                  </button>
                  {canPublish ? (
                    <>
                      <button type="button" onClick={() => submitBulkStatus('approved')} className="block w-full px-4 py-2 text-left text-slate-700 hover:bg-cms-soft">
                        Approve
                      </button>
                      <button type="button" onClick={() => submitBulkStatus('published')} className="block w-full px-4 py-2 text-left font-semibold text-emerald-700 hover:bg-emerald-50">
                        Publish
                      </button>
                    </>
                  ) : null}
                  <button type="button" onClick={() => submitBulkStatus('draft')} className="block w-full px-4 py-2 text-left text-slate-700 hover:bg-cms-soft">
                    Save as draft
                  </button>
                  {canPublish ? (
                    <>
                      <div className="my-1 border-t border-cms-rule" />
                      <button type="button" onClick={() => submitBulkStatus('draft')} className="block w-full px-4 py-2 text-left text-slate-700 hover:bg-cms-soft">
                        Unpublish
                      </button>
                      <button type="button" onClick={() => submitBulkStatus('archived')} className="block w-full px-4 py-2 text-left text-slate-700 hover:bg-cms-soft">
                        Archive
                      </button>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
            {canDelete ? (
              <button
                type="button"
                onClick={submitBulkDelete}
                disabled={pending}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Table */}
      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cms-rule bg-cms-soft px-6 py-16 text-center">
          <p className="text-sm text-slate-600">
            {items.length === 0 ? (
              <>
                No entries yet in this collection.{' '}
                <Link
                  href={
                    collectionKey === 'media_assets'
                      ? `/admin/cms?collection=${collectionKey}#cms-media-upload`
                      : `/admin/cms/new/${collectionKey}`
                  }
                  className="font-medium text-brand-primary underline-offset-4 hover:underline"
                >
                  Create your first {singularLabel.toLowerCase()}
                </Link>
              </>
            ) : (
              'No items match your filters.'
            )}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-cms-rule bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-cms-rule bg-cms-soft text-xs">
              <tr>
                <th className="w-9 px-3 py-3">
                  <input
                    type="checkbox"
                    aria-label="Select all visible"
                    checked={allVisibleSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = !allVisibleSelected && someVisibleSelected
                    }}
                    onChange={toggleAllVisible}
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 bg-white accent-[var(--brand-primary,#f16610)]"
                  />
                </th>
                <th className="px-4 py-3"><SortBtn keyName="title">Title</SortBtn></th>
                <th className="hidden px-4 py-3 md:table-cell"><SortBtn keyName="status">Status</SortBtn></th>
                <th className="hidden px-4 py-3 lg:table-cell"><SortBtn keyName="createdAt">Created</SortBtn></th>
                <th className="hidden px-4 py-3 lg:table-cell"><SortBtn keyName="updatedAt">Modified</SortBtn></th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cms-rule">
              {visible.map((row) => {
                const st = getStatusStyle(row.status)
                const isChecked = selected.has(row.id)
                const liveUrl = routePattern && row.slug ? routePattern.replace('[slug]', row.slug) : null
                return (
                  <tr
                    key={row.id}
                    className={`group transition ${
                      isChecked
                        ? 'bg-brand-primary/15 ring-1 ring-inset ring-brand-primary/30'
                        : 'hover:bg-cms-hover'
                    }`}
                  >
                    <td className="w-9 px-3 py-3 align-middle">
                      <input
                        type="checkbox"
                        aria-label={`Select ${row.title}`}
                        checked={isChecked}
                        onChange={() => toggleOne(row.id)}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 bg-white accent-[var(--brand-primary,#f16610)]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/cms?collection=${collectionKey}&slug=${encodeURIComponent(row.id)}`}
                        className="block font-semibold text-slate-900 hover:text-brand-primary"
                      >
                        {row.title}
                      </Link>
                      <p className="mt-0.5 truncate font-mono text-[11px] text-slate-500">/{row.slug}</p>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wider ${st.box}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} aria-hidden />
                        {st.label}
                      </span>
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-slate-500 lg:table-cell">{formatRelative(row.createdAtIso)}</td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-slate-500 lg:table-cell">{formatRelative(row.updatedAtIso)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-0.5 opacity-70 transition group-hover:opacity-100">
                        {liveUrl ? (
                          <a
                            href={liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            title="View live"
                            className="rounded-md p-1.5 text-slate-400 hover:bg-cms-hover hover:text-slate-800"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        ) : null}
                        <Link
                          href={`/admin/cms?collection=${collectionKey}&slug=${encodeURIComponent(row.id)}`}
                          title="Edit"
                          className="rounded-md p-1.5 text-slate-400 hover:bg-cms-hover hover:text-slate-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => submitDuplicate(row.id)}
                          disabled={pending}
                          title="Duplicate"
                          className="rounded-md p-1.5 text-slate-400 hover:bg-cms-hover hover:text-slate-800 disabled:opacity-50"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        {canDelete ? (
                          <button
                            type="button"
                            onClick={() => submitDelete(row.id, row.title)}
                            disabled={pending}
                            title="Delete"
                            className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
