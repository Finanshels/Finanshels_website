'use client'

/**
 * Small form primitives shared by the Studio inspector (page settings + SEO).
 * Extracted verbatim from the original LandingPageEditor so the inspector and
 * any future panels reuse one set of inputs.
 */

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-[13px] font-semibold text-slate-900">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

export function Text({
  label,
  value,
  onChange,
  required,
  placeholder,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  placeholder?: string
  hint?: string
}) {
  return (
    <label className="block text-[13px]">
      <span className="font-medium text-slate-800">
        {label}
        {required ? <span className="text-rose-600"> *</span> : null}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-[13px]"
      />
      {hint ? <span className="mt-1 block text-xs text-slate-500">{hint}</span> : null}
    </label>
  )
}

export function Textarea({
  label,
  value,
  onChange,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  hint?: string
}) {
  return (
    <label className="block text-[13px]">
      <span className="font-medium text-slate-800">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-[13px]"
      />
      {hint ? <span className="mt-1 block text-xs text-slate-500">{hint}</span> : null}
    </label>
  )
}

export function Select({
  label,
  value,
  options,
  onChange,
  required,
  hint,
}: {
  label: string
  value: string
  options: Array<{ label: string; value: string }>
  onChange: (v: string) => void
  required?: boolean
  hint?: string
}) {
  return (
    <label className="block text-[13px]">
      <span className="font-medium text-slate-800">
        {label}
        {required ? <span className="text-rose-600"> *</span> : null}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-[13px]"
      >
        <option value="">—</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint ? <span className="mt-1 block text-xs text-slate-500">{hint}</span> : null}
    </label>
  )
}

export function Bool({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="font-medium text-slate-800">{label}</span>
    </label>
  )
}
