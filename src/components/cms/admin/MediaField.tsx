'use client'

// FIX-051: image/file CMS fields used to be paste-only — editors had to leave the
// form, open the Media Library, upload, copy the CDN URL, return, and paste it.
// MediaField makes upload inline (drag/drop or click), adds a "Choose from
// library" picker over already-uploaded assets, shows a live preview, and keeps
// the paste-a-URL box as a fallback. It posts to the same /api/admin/cms/media
// /upload endpoint the library uses, so every inline upload also lands in the
// Media Library automatically.

import { useMemo, useRef, useState } from 'react'
import { FileText, ImageIcon, Library, Link2, Loader2, Search, Upload, X } from 'lucide-react'

const MEDIA_UPLOAD_API = '/api/admin/cms/media/upload'

// Friendly, human-readable accepted-format hints shown in the dropzone.
const ACCEPT_HINT: Record<MediaFieldKind, string> = {
  image: 'PNG · JPG · GIF · WEBP · SVG · AVIF',
  file: 'PDF · DOC · XLS · PPT · CSV · TXT',
}

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i
const IMAGE_ACCEPT =
  'image/png,image/jpeg,image/gif,image/webp,image/svg+xml,image/avif,.png,.jpg,.jpeg,.gif,.webp,.svg,.avif'
const FILE_ACCEPT =
  '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

export type MediaFieldKind = 'image' | 'file'

type UploadResponse = { ok?: boolean; url?: string; error?: string }

type Props = {
  name: string
  initialValue: string
  kind: MediaFieldKind
  required?: boolean
  placeholder?: string
  /** Already-uploaded asset URLs, used for the "Choose from library" picker + datalist. */
  suggestions?: string[]
  hint?: string | null
}

const inputClass =
  'w-full rounded-xl border border-cms-rule bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'

function isImageUrl(url: string): boolean {
  return IMAGE_EXT.test(url.trim())
}

function filenameFromUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  try {
    const path = new URL(trimmed).pathname
    const base = decodeURIComponent(path.split('/').pop() ?? '')
    return base || trimmed
  } catch {
    return decodeURIComponent(trimmed.split('?')[0]?.split('/').pop() ?? trimmed)
  }
}

export function MediaField({
  name,
  initialValue,
  kind,
  required = false,
  placeholder,
  suggestions = [],
  hint,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState(initialValue)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)

  const uploadEnabled = Boolean(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
  const accept = kind === 'image' ? IMAGE_ACCEPT : FILE_ACCEPT
  const datalistId = `${name}-asset-suggestions`

  // The picker shows assets that match this field's kind: images for image
  // fields, non-image files for file fields.
  const pickerAssets = useMemo(() => {
    const unique = [...new Set(suggestions.map((s) => s.trim()).filter(Boolean))]
    return unique.filter((url) => (kind === 'image' ? isImageUrl(url) : !isImageUrl(url)))
  }, [suggestions, kind])

  // Set the canonical input value AND fire a bubbling `input` event so the
  // form-level listeners (AutosaveManager, CardPreview, CmsFormValidator) react
  // exactly as they do for a typed value. The input stays uncontrolled.
  function commit(nextUrl: string) {
    const input = inputRef.current
    if (input && input.value !== nextUrl) {
      input.value = nextUrl
      input.dispatchEvent(new Event('input', { bubbles: true }))
    }
    setValue(nextUrl)
    setError(null)
  }

  async function uploadFile(file: File | undefined) {
    if (!file || !uploadEnabled) return
    setError(null)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(MEDIA_UPLOAD_API, {
        method: 'POST',
        body: fd,
        credentials: 'same-origin',
      })
      let payload: UploadResponse | null = null
      try {
        payload = (await res.json()) as UploadResponse
      } catch {
        payload = null
      }
      if (!res.ok || !payload?.ok || !payload.url) {
        setError(payload?.error ?? `Upload failed (${res.status}).`)
        return
      }
      commit(payload.url)
    } catch {
      setError('Upload failed — check your connection and try again.')
    } finally {
      setUploading(false)
    }
  }

  const hasValue = value.trim().length > 0
  const showImagePreview = hasValue && kind === 'image' && isImageUrl(value)

  return (
    <div className="mt-2 flex flex-col gap-2">
      {/* Preview of the current value */}
      {hasValue ? (
        <div className="flex items-center gap-3 rounded-xl border border-cms-rule bg-cms-soft p-2.5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-cms-rule bg-white">
            {showImagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element -- arbitrary CDN URL preview
              <img src={value} alt="" className="h-full w-full object-cover" />
            ) : kind === 'image' ? (
              <ImageIcon className="h-6 w-6 text-slate-400" aria-hidden />
            ) : (
              <FileText className="h-6 w-6 text-slate-400" aria-hidden />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800" title={value}>
              {filenameFromUrl(value)}
            </p>
            <p className="truncate text-xs text-slate-400" title={value}>
              {value}
            </p>
          </div>
          <button
            type="button"
            onClick={() => commit('')}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-cms-rule bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <X className="h-3.5 w-3.5" aria-hidden /> Remove
          </button>
        </div>
      ) : null}

      {/* Hero dropzone — the primary, most-inviting way to add media. Kept as a
          <button> so a wrapping <label> doesn't double-fire to the URL input. */}
      {uploadEnabled ? (
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            void uploadFile(e.dataTransfer.files?.[0])
          }}
          className={`group w-full rounded-2xl border-2 border-dashed text-center transition ${
            hasValue ? 'px-4 py-3' : 'px-4 py-7'
          } ${
            dragOver
              ? 'border-brand-primary bg-brand-primary/5'
              : 'border-cms-rule bg-cms-soft hover:border-brand-primary/50 hover:bg-brand-primary/[0.03]'
          } disabled:cursor-wait disabled:opacity-70`}
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2 text-sm font-medium text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Uploading…
            </span>
          ) : hasValue ? (
            <span className="flex items-center justify-center gap-2 text-sm font-medium text-slate-600">
              <Upload className="h-4 w-4" aria-hidden /> Replace — drop or click to upload
            </span>
          ) : (
            <span className="flex flex-col items-center gap-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-primary shadow-sm ring-1 ring-cms-rule transition group-hover:scale-105">
                <Upload className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-sm font-semibold text-slate-700">
                Drop {kind === 'image' ? 'an image' : 'a file'} here, or{' '}
                <span className="text-brand-primary">click to upload</span>
              </span>
              <span className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{ACCEPT_HINT[kind]}</span>
            </span>
          )}
        </button>
      ) : null}

      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          void uploadFile(file)
        }}
      />

      {/* Divider — only shown when the dropzone above offers the primary path. */}
      {uploadEnabled ? (
        <div className="flex items-center gap-3" aria-hidden>
          <span className="h-px flex-1 bg-cms-rule" />
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">or</span>
          <span className="h-px flex-1 bg-cms-rule" />
        </div>
      ) : null}

      {/* Secondary actions: library picker + paste-a-URL. The URL input is the
          canonical form value — uncontrolled, always in the DOM so server-side
          `required` validation and form serialization work unchanged. */}
      <div className="flex flex-col gap-2 sm:flex-row">
        {pickerAssets.length > 0 ? (
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-cms-rule bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-brand-primary/40 hover:text-slate-900"
          >
            <Library className="h-4 w-4" aria-hidden /> Choose from library
          </button>
        ) : null}
        <div className="relative flex-1">
          <Link2
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            ref={inputRef}
            type="url"
            name={name}
            required={required}
            defaultValue={initialValue}
            placeholder={placeholder ?? (uploadEnabled ? 'Or paste a URL…' : 'Paste a URL…')}
            list={pickerAssets.length > 0 ? datalistId : undefined}
            onInput={(e) => setValue(e.currentTarget.value)}
            className={`${inputClass} pl-9 text-sm`}
          />
        </div>
        {pickerAssets.length > 0 ? (
          <datalist id={datalistId}>
            {pickerAssets.map((url) => (
              <option key={url} value={url} />
            ))}
          </datalist>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs text-red-700">{error}</p>
      ) : null}
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}

      {pickerOpen ? (
        <MediaLibraryPicker
          kind={kind}
          assets={pickerAssets}
          onSelect={(url) => {
            commit(url)
            setPickerOpen(false)
          }}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}
    </div>
  )
}

function MediaLibraryPicker({
  kind,
  assets,
  onSelect,
  onClose,
}: {
  kind: MediaFieldKind
  assets: string[]
  onSelect: (url: string) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return assets
    return assets.filter((url) => url.toLowerCase().includes(q))
  }, [assets, query])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Choose from media library"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-cms-rule bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-cms-rule px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">Choose from library</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="border-b border-cms-rule p-3">
          <label className="relative block">
            <span className="sr-only">Search assets</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            {/* eslint-disable-next-line jsx-a11y/no-autofocus -- focus search on open */}
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by filename or URL…"
              className="w-full rounded-xl border border-cms-rule bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            />
          </label>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">No matching assets.</p>
          ) : kind === 'image' ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {filtered.map((url) => (
                <li key={url}>
                  <button
                    type="button"
                    onClick={() => onSelect(url)}
                    title={url}
                    className="group flex w-full flex-col overflow-hidden rounded-xl border border-cms-rule bg-white text-left transition hover:border-brand-primary hover:ring-2 hover:ring-brand-primary/20"
                  >
                    <span className="block aspect-square w-full overflow-hidden bg-cms-soft">
                      {/* eslint-disable-next-line @next/next/no-img-element -- CDN preview */}
                      <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </span>
                    <span className="truncate px-2 py-1.5 text-xs text-slate-600">{filenameFromUrl(url)}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {filtered.map((url) => (
                <li key={url}>
                  <button
                    type="button"
                    onClick={() => onSelect(url)}
                    title={url}
                    className="flex w-full items-center gap-3 rounded-xl border border-cms-rule bg-white px-3 py-2.5 text-left transition hover:border-brand-primary hover:bg-brand-primary/5"
                  >
                    <FileText className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-800">{filenameFromUrl(url)}</span>
                      <span className="block truncate text-xs text-slate-400">{url}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
