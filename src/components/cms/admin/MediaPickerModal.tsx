'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FileText, ImageIcon, Loader2, Search, Upload, X } from 'lucide-react'
import { CMS_MEDIA_UPLOAD_MAX_BYTES } from '@/lib/cms/mediaUploadLimits'

const MEDIA_UPLOAD_API = '/api/admin/cms/media/upload'
const MEDIA_UPLOAD_MAX_MB = Math.round(CMS_MEDIA_UPLOAD_MAX_BYTES / (1024 * 1024))

/** Lightweight, client-safe shape — mapped from `CmsMediaLibraryItem` server-side. */
export type MediaPickerItem = {
  url: string
  title: string
  mimeType: string | null
}

export type MediaPickerAccept = 'image' | 'any'

const IMAGE_ACCEPT = '.png,.jpg,.jpeg,.gif,.webp,.svg,image/png,image/jpeg,image/gif,image/webp,image/svg+xml'
const ANY_ACCEPT =
  '.png,.jpg,.jpeg,.gif,.webp,.svg,.pdf,image/png,image/jpeg,image/gif,image/webp,image/svg+xml,application/pdf'

function isImageItem(item: MediaPickerItem): boolean {
  const path = item.url.split('?')[0] ?? ''
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(path) || /^image\//.test(item.mimeType ?? '')
}

type Props = {
  open: boolean
  accept: MediaPickerAccept
  items: MediaPickerItem[]
  bucketConfigured: boolean
  onClose: () => void
  onSelect: (url: string) => void
  /** Called after a successful upload so the provider can cache the new asset. */
  onUploaded: (item: MediaPickerItem) => void
}

type UploadResponse = { ok?: boolean; url?: string; title?: string; error?: string }

export function MediaPickerModal({
  open,
  accept,
  items,
  bucketConfigured,
  onClose,
  onSelect,
  onUploaded,
}: Props) {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'library' | 'upload'>('library')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [pastedUrl, setPastedUrl] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset transient state whenever the modal (re)opens.
  useEffect(() => {
    if (open) {
      setQuery('')
      setTab('library')
      setUploadError(null)
      setPastedUrl('')
    }
  }, [open])

  // Close on Escape.
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const visibleItems = useMemo(() => {
    const base = accept === 'image' ? items.filter(isImageItem) : items
    const q = query.trim().toLowerCase()
    if (!q) return base
    return base.filter((i) => i.title.toLowerCase().includes(q) || i.url.toLowerCase().includes(q))
  }, [items, accept, query])

  const uploadFile = useCallback(
    async (file: File) => {
      if (!bucketConfigured) {
        setUploadError('Set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET to enable uploads, or paste a URL below.')
        return
      }
      setUploadError(null)
      setUploading(true)
      try {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch(MEDIA_UPLOAD_API, { method: 'POST', body: fd, credentials: 'same-origin' })
        let payload: UploadResponse | null = null
        try {
          payload = (await res.json()) as UploadResponse
        } catch {
          payload = null
        }
        if (!res.ok || !payload?.ok || !payload.url) {
          setUploadError(payload?.error ?? `Upload failed (${res.status}).`)
          return
        }
        const item: MediaPickerItem = {
          url: payload.url,
          title: payload.title ?? file.name,
          mimeType: file.type || null,
        }
        onUploaded(item)
        onSelect(payload.url)
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Upload failed.')
      } finally {
        setUploading(false)
      }
    },
    [bucketConfigured, onUploaded, onSelect],
  )

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Media picker"
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h2 className="text-sm font-semibold text-slate-900">Choose media</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 border-b border-slate-200 px-5">
          {(['library', 'upload'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 px-3 py-2.5 text-sm font-medium ${
                tab === t ? 'border-violet-600 text-violet-700' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t === 'library' ? 'Library' : 'Upload'}
            </button>
          ))}
        </div>

        {tab === 'library' ? (
          <div className="flex min-h-0 flex-1 flex-col p-4">
            <label className="relative block">
              <span className="sr-only">Search media</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name…"
                autoFocus
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
              />
            </label>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
              {visibleItems.length === 0 ? (
                <p className="py-12 text-center text-sm text-slate-500">
                  {items.length === 0 ? 'No media yet — upload a file.' : 'No matches.'}
                </p>
              ) : (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {visibleItems.map((item) => {
                    const img = isImageItem(item)
                    return (
                      <li key={item.url}>
                        <button
                          type="button"
                          onClick={() => onSelect(item.url)}
                          className="group flex w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-left transition hover:border-violet-400 hover:ring-2 hover:ring-violet-200"
                          title={item.title}
                        >
                          <span className="relative flex aspect-square items-center justify-center border-b border-slate-200 bg-white">
                            {img ? (
                              // eslint-disable-next-line @next/next/no-img-element -- arbitrary CDN URL
                              <img src={item.url} alt={item.title} className="size-full object-contain" loading="lazy" />
                            ) : (
                              <FileText className="h-8 w-8 text-slate-400" aria-hidden />
                            )}
                          </span>
                          <span className="truncate px-2 py-1.5 text-[11px] font-medium text-slate-700">{item.title}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            <div
              role="presentation"
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                const file = [...e.dataTransfer.files][0]
                if (file) void uploadFile(file)
              }}
              onClick={() => inputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${
                dragOver ? 'border-violet-400 bg-violet-50' : 'border-slate-300 bg-slate-50'
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                className="sr-only"
                accept={accept === 'image' ? IMAGE_ACCEPT : ANY_ACCEPT}
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  e.target.value = ''
                  if (file) void uploadFile(file)
                }}
              />
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                {uploading ? <Loader2 className="h-6 w-6 animate-spin" aria-hidden /> : <Upload className="h-6 w-6" aria-hidden />}
              </span>
              <p className="mt-4 text-sm font-medium text-slate-900">
                {uploading ? 'Uploading…' : 'Drop a file or click to browse'}
              </p>
              <p className="mt-1.5 text-xs text-slate-500">
                {accept === 'image' ? 'PNG, JPG, GIF, WebP, SVG' : 'Images & PDF'} · max {MEDIA_UPLOAD_MAX_MB} MB
              </p>
            </div>
            {uploadError ? <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{uploadError}</p> : null}
          </div>
        )}

        {/* URL escape hatch — external images / when storage is not configured. */}
        <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3">
          <ImageIcon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
          <input
            type="url"
            value={pastedUrl}
            onChange={(e) => setPastedUrl(e.target.value)}
            placeholder="…or paste an image URL"
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-violet-400"
          />
          <button
            type="button"
            disabled={!pastedUrl.trim()}
            onClick={() => onSelect(pastedUrl.trim())}
            className="shrink-0 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            Use URL
          </button>
        </div>
      </div>
    </div>
  )
}
