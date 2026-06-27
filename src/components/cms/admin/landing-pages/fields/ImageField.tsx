'use client'

import { ImageIcon } from 'lucide-react'
import type { SectionFieldDef } from '@/lib/landing-pages/sectionCatalog'
import { useMediaLibrary } from '../../MediaLibraryProvider'

export function ImageField({
  field,
  value,
  onChange,
}: {
  field: SectionFieldDef
  value: unknown
  onChange: (next: unknown) => void
}) {
  const { pickMedia } = useMediaLibrary()
  const current = typeof value === 'string' ? value : ''

  async function choose() {
    const url = await pickMedia({ accept: 'image' })
    if (url !== null) onChange(url)
  }

  return (
    <div className="block text-sm">
      <span className="font-medium text-slate-800">
        {field.label}
        {field.required ? <span className="text-rose-600"> *</span> : null}
      </span>
      <div className="mt-1 flex items-center gap-3">
        <button
          type="button"
          onClick={() => void choose()}
          className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-300 bg-slate-50 hover:border-violet-400"
          aria-label={current ? 'Replace image' : 'Choose image'}
        >
          {current ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary CDN URL
            <img src={current} alt="" className="size-full object-contain" />
          ) : (
            <ImageIcon className="h-6 w-6 text-slate-400" aria-hidden />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void choose()}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {current ? 'Replace' : 'Choose image'}
            </button>
            {current ? (
              <button
                type="button"
                onClick={() => onChange('')}
                className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
              >
                Remove
              </button>
            ) : null}
          </div>
          {current ? (
            <p className="mt-1 truncate font-mono text-[11px] text-slate-400" title={current}>
              {current}
            </p>
          ) : field.description ? (
            <p className="mt-1 text-xs text-slate-500">{field.description}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
