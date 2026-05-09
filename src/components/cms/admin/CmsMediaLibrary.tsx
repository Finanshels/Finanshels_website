'use client'

import Link from 'next/link'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, ImageIcon, Link2, Loader2, Search, Trash2, Upload } from 'lucide-react'
import type { CmsMediaLibraryItem } from '@/lib/cms/collectionRepository'

const MEDIA_UPLOAD_API = '/api/admin/cms/media/upload'

type Props = {
  items: CmsMediaLibraryItem[]
  canDelete: boolean
  cmsConfigured: boolean
  bucketConfigured: boolean
  deleteAction: (fd: FormData) => Promise<void>
}

function formatBytes(n: number): string {
  if (!Number.isFinite(n)) return '—'
  if (n < 1024) return `${n} B`
  const kb = n / 1024
  if (kb < 1024) return `${kb >= 100 ? kb.toFixed(0) : kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb >= 100 ? mb.toFixed(0) : mb.toFixed(1)} MB`
}

const ACCEPT =
  '.png,.jpg,.jpeg,.gif,.webp,.svg,.pdf,image/png,image/jpeg,image/gif,image/webp,image/svg+xml,application/pdf'

export function CmsMediaLibrary({
  items,
  canDelete,
  cmsConfigured,
  bucketConfigured,
  deleteAction,
}: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [query, setQuery] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [uploadNotes, setUploadNotes] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.slug.toLowerCase().includes(q) ||
        i.assetUrl.toLowerCase().includes(q)
    )
  }, [items, query])

  const runUploadBatch = useCallback(
    async (files: File[]) => {
      if (!files.length || !cmsConfigured || !bucketConfigured) return
      setUploadNotes(null)
      setUploading(true)
      try {
        for (let i = 0; i < files.length; i++) {
          const f = files[i]
          const fd = new FormData()
          fd.append('file', f)
          const res = await fetch(MEDIA_UPLOAD_API, {
            method: 'POST',
            body: fd,
            credentials: 'same-origin',
          })
          let payload: { ok?: boolean; error?: string } | null = null
          try {
            payload = (await res.json()) as { ok?: boolean; error?: string }
          } catch {
            payload = null
          }
          if (!res.ok || !payload?.ok) {
            setUploadNotes(payload?.error ?? `Upload failed (${res.status}).`)
            break
          }
        }
      } finally {
        setUploading(false)
        router.refresh()
      }
    },
    [bucketConfigured, cmsConfigured, router]
  )

  const flash = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2400)
  }

  async function handleCopy(url: string) {
    try {
      await navigator.clipboard.writeText(url)
      flash('URL copied.')
    } catch {
      flash('Unable to copy (browser blocked clipboard).')
    }
  }

  const uploadDisabledReason = !cmsConfigured
    ? 'CMS is offline — configure FIREBASE_ADMIN_*.'
    : !bucketConfigured
    ? 'Set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET to enable uploads.'
    : null

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Media Library</h2>
          <p className="text-sm text-slate-600">
            Drop files to upload into Firebase Storage, then copy CDN URLs anywhere in the CMS.
          </p>
        </div>
        {toast ? (
          <p className="text-sm font-medium text-violet-700" role="status">
            {toast}
          </p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm">
        <div
          id="cms-media-upload"
          role="presentation"
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            if (uploadDisabledReason) return
            const list = [...e.dataTransfer.files].filter(Boolean)
            void runUploadBatch(list)
          }}
          className={`relative border-b border-slate-200 px-6 py-10 transition ${
            dragOver ? 'bg-violet-50 ring-2 ring-violet-400 ring-inset' : 'bg-slate-50/80'
          } ${uploadDisabledReason ? 'opacity-70' : 'cursor-pointer'}`}
          onClick={() => {
            if (!uploadDisabledReason) inputRef.current?.click()
          }}
        >
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            accept={ACCEPT}
            disabled={Boolean(uploadDisabledReason) || uploading}
            multiple
            onChange={(e) => {
              const list = e.target.files ? [...e.target.files] : []
              e.target.value = ''
              void runUploadBatch(list)
            }}
          />
          <div className="pointer-events-none flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700 ring-1 ring-violet-200">
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
              ) : (
                <Upload className="h-6 w-6" aria-hidden />
              )}
            </span>
            <p className="mt-4 text-sm font-medium text-slate-900">
              {uploadDisabledReason
                ? 'Uploads paused'
                : 'Drop files here or click to browse'}
            </p>
            <p className="mt-2 max-w-lg text-xs text-slate-500">
              PNG, JPG, GIF, WebP, SVG, PDF supported · max 25 MB per file · published immediately for picker fields
            </p>
          </div>
        </div>

        {uploadDisabledReason ? (
          <p className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            {uploadDisabledReason}
          </p>
        ) : null}
        {uploadNotes ? (
          <p className="border-b border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{uploadNotes}</p>
        ) : null}

        <div className="p-4">
          <label className="relative block">
            <span className="sr-only">Search by filename</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by filename…"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-violet-500/0 transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
              autoCapitalize="off"
              autoCorrect="off"
            />
          </label>

          <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-slate-500">
            {filtered.length === items.length ? `${filtered.length} files` : `${filtered.length} of ${items.length} files`}
          </p>

          <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((item) => {
              const assetPath = item.assetUrl.split('?')[0] ?? ''
              const isImg = /\.(png|jpe?g|gif|webp|svg)$/i.test(assetPath) ||
                /^image\//.test(item.mimeType ?? '')
              const isPdf =
                item.mimeType === 'application/pdf' ||
                /\.pdf$/i.test(assetPath) ||
                /\.pdf$/i.test(item.title)
              return (
                <li
                  key={item.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                >
                  <div className="relative aspect-square border-b border-slate-200 bg-white">
                    {item.assetUrl && isImg ? (
                      // eslint-disable-next-line @next/next/no-img-element -- arbitrary Firebase CDN URLs
                      <img
                        src={item.assetUrl}
                        alt={item.title}
                        className="size-full object-contain"
                        loading="lazy"
                      />
                    ) : isPdf ? (
                      <div className="flex size-full flex-col items-center justify-center gap-2 text-red-600">
                        <FileText className="h-12 w-12" aria-hidden />
                        <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-semibold tracking-[0.2em] text-red-700">
                          PDF
                        </span>
                      </div>
                    ) : (
                      <div className="flex size-full items-center justify-center text-slate-400">
                        <ImageIcon className="h-10 w-10" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-3">
                    <Link
                      href={`/admin/cms?collection=media_assets&slug=${encodeURIComponent(item.slug)}`}
                      className="line-clamp-2 text-[13px] font-medium leading-snug text-slate-900 underline-offset-2 hover:text-violet-700 hover:underline"
                    >
                      {item.title}
                    </Link>
                    <p className="truncate text-[11px] font-mono text-slate-500" title={item.assetUrl}>
                      {item.byteSize != null ? formatBytes(item.byteSize) : '—'}
                    </p>
                    <div className="mt-auto flex gap-2">
                      <button
                        type="button"
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-violet-200 bg-white px-2 py-2 text-xs font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-50"
                        onClick={() => void handleCopy(item.assetUrl)}
                      >
                        <Link2 className="h-3.5 w-3.5" aria-hidden /> Copy URL
                      </button>
                      {canDelete ? (
                        <form action={deleteAction} className="shrink-0">
                          <input type="hidden" name="collection" value="media_assets" />
                          <input type="hidden" name="id" value={item.id} />
                          <button
                            type="submit"
                            aria-label={`Delete ${item.title}`}
                            className="inline-flex h-[38px] w-[42px] items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      ) : null}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          {!filtered.length ? (
            <p className="mt-12 text-center text-sm text-slate-500">
              {items.length === 0
                ? 'No files yet — upload files above.'
                : 'No matches — try another search.'}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
