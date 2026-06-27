'use client'

import type { SectionFieldDef } from '@/lib/landing-pages/sectionCatalog'

/** On-brand presets surfaced as one-click swatches. */
const BRAND_PRESETS: Array<{ label: string; hex: string }> = [
  { label: 'Amber', hex: '#F59E0B' },
  { label: 'Ink', hex: '#0F172A' },
  { label: 'Emerald', hex: '#10B981' },
  { label: 'Blue', hex: '#2563EB' },
  { label: 'Violet', hex: '#7C3AED' },
  { label: 'Rose', hex: '#E11D48' },
]

const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export function ColorField({
  field,
  value,
  onChange,
}: {
  field: SectionFieldDef
  value: unknown
  onChange: (next: unknown) => void
}) {
  const current = typeof value === 'string' ? value : ''
  const valid = HEX.test(current)

  return (
    <div className="block text-sm">
      <span className="font-medium text-slate-800">{field.label}</span>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          value={valid ? current : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-10 shrink-0 cursor-pointer rounded-lg border border-slate-300 bg-white p-0.5"
          aria-label={`${field.label} swatch`}
        />
        <input
          type="text"
          value={current}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? '#F59E0B'}
          className="w-28 rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
        />
        {current ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            Clear
          </button>
        ) : null}
        <div className="ml-auto flex items-center gap-1">
          {BRAND_PRESETS.map((p) => (
            <button
              key={p.hex}
              type="button"
              title={`${p.label} (${p.hex})`}
              onClick={() => onChange(p.hex)}
              className="h-6 w-6 rounded-full border border-slate-200 ring-offset-1 transition hover:scale-110"
              style={{ backgroundColor: p.hex }}
              aria-label={`Use ${p.label}`}
            />
          ))}
        </div>
      </div>
      {current && !valid ? (
        <p className="mt-1 text-xs text-amber-600">Enter a hex colour like #F59E0B.</p>
      ) : field.description ? (
        <p className="mt-1 text-xs text-slate-500">{field.description}</p>
      ) : null}
    </div>
  )
}
