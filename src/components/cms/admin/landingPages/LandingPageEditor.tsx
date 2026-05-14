'use client'

import { useMemo, useState } from 'react'
import { SECTION_CATALOG, getSectionCatalogEntry, type SectionCatalogEntry, type SectionFieldDef } from '@/lib/landingPages/sectionCatalog'
import { SERVICE_INTERESTS } from '@/lib/landingPages/serviceInterests'
import type {
  HeroVariant,
  LandingPageDoc,
  LandingPageSection,
  LandingPageStatus,
} from '@/lib/landingPages/types'

type Tab = 'content' | 'settings' | 'seo'

type EditorState = {
  slug: string
  internal_name: string
  status: LandingPageStatus
  service_interest: string
  google_ads_conversion_id: string
  conversion_labels: { form_submit: string; call_click: string; whatsapp_click: string }
  primary_phone: string
  whatsapp_number: string
  whatsapp_prefilled_message: string
  form_destination_emails: string
  thank_you_redirect_url: string
  sections: LandingPageSection[]
  theme: {
    accent_color: string
    hero_variant: HeroVariant
    show_sticky_mobile_cta_bar: boolean
    show_floating_whatsapp_button: boolean
    badge_text: string
  }
  seo: {
    title: string
    description: string
    og_image_url: string
    allow_indexing: boolean
    canonical_url: string
  }
}

function pageToState(page: LandingPageDoc): EditorState {
  return {
    slug: page.slug,
    internal_name: page.internal_name,
    status: page.status,
    service_interest: page.service_interest,
    google_ads_conversion_id: page.google_ads_conversion_id,
    conversion_labels: { ...page.conversion_labels },
    primary_phone: page.primary_phone,
    whatsapp_number: page.whatsapp_number,
    whatsapp_prefilled_message: page.whatsapp_prefilled_message ?? '',
    form_destination_emails: (page.form_destination_emails ?? []).join(', '),
    thank_you_redirect_url: page.thank_you_redirect_url ?? '',
    sections: page.sections,
    theme: {
      accent_color: page.theme.accent_color ?? '',
      hero_variant: page.theme.hero_variant,
      show_sticky_mobile_cta_bar: page.theme.show_sticky_mobile_cta_bar,
      show_floating_whatsapp_button: page.theme.show_floating_whatsapp_button,
      badge_text: page.theme.badge_text ?? '',
    },
    seo: {
      title: page.seo.title,
      description: page.seo.description,
      og_image_url: page.seo.og_image_url ?? '',
      allow_indexing: page.seo.allow_indexing,
      canonical_url: page.seo.canonical_url ?? '',
    },
  }
}

function stateToPayload(s: EditorState) {
  return {
    slug: s.slug.trim(),
    internal_name: s.internal_name.trim(),
    status: s.status,
    service_interest: s.service_interest,
    google_ads_conversion_id: s.google_ads_conversion_id.trim(),
    conversion_labels: s.conversion_labels,
    primary_phone: s.primary_phone.trim(),
    whatsapp_number: s.whatsapp_number.trim(),
    whatsapp_prefilled_message: s.whatsapp_prefilled_message.trim(),
    form_destination_emails: s.form_destination_emails
      .split(/[,\n]/)
      .map((e) => e.trim())
      .filter(Boolean),
    thank_you_redirect_url: s.thank_you_redirect_url.trim(),
    sections: s.sections,
    theme: s.theme,
    seo: s.seo,
  }
}

function genId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `s_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}

export default function LandingPageEditor({
  page,
  saveAction,
}: {
  page: LandingPageDoc
  saveAction: (formData: FormData) => void | Promise<void>
}) {
  const [tab, setTab] = useState<Tab>('content')
  const [state, setState] = useState<EditorState>(() => pageToState(page))
  const payload = useMemo(() => JSON.stringify(stateToPayload(state)), [state])

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6">
      <div>
        <div className="flex items-center gap-1 mb-4 border-b border-slate-200">
          {(['content', 'settings', 'seo'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                tab === t
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t === 'content' ? 'Content' : t === 'settings' ? 'Settings' : 'SEO'}
            </button>
          ))}
        </div>

        {tab === 'content' ? (
          <ContentTab state={state} setState={setState} />
        ) : tab === 'settings' ? (
          <SettingsTab state={state} setState={setState} />
        ) : (
          <SeoTab state={state} setState={setState} />
        )}
      </div>

      <aside className="bg-white rounded-xl border border-slate-200 p-4 h-fit sticky top-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Save & publish</h3>
        <form action={saveAction} className="space-y-3">
          <input type="hidden" name="id" value={page.id} />
          <input type="hidden" name="payload" value={payload} />

          <label className="block text-sm">
            <span className="text-slate-700 font-medium">Status</span>
            <select
              value={state.status}
              onChange={(e) => setState((s) => ({ ...s, status: e.target.value as LandingPageStatus }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <button className="w-full inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Save changes
          </button>

          <div className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
            <p>Default: <strong>noindex, nofollow</strong>. Pages are excluded from sitemap.</p>
            <p className="mt-1.5">Service interest sent to Zoho: <code className="bg-slate-100 rounded px-1">{state.service_interest || '—'}</code></p>
          </div>
        </form>
      </aside>
    </div>
  )
}

// ---------------- Content tab ----------------

function ContentTab({ state, setState }: { state: EditorState; setState: React.Dispatch<React.SetStateAction<EditorState>> }) {
  function addSection(type: string) {
    const entry = getSectionCatalogEntry(type)
    if (!entry) return
    const newSection: LandingPageSection = {
      id: genId(),
      type,
      enabled: true,
      props: JSON.parse(JSON.stringify(entry.defaultProps)),
    }
    setState((s) => ({ ...s, sections: [...s.sections, newSection] }))
  }

  function updateSection(id: string, patch: Partial<LandingPageSection>) {
    setState((s) => ({
      ...s,
      sections: s.sections.map((sec) => (sec.id === id ? { ...sec, ...patch } : sec)),
    }))
  }

  function moveSection(id: string, direction: -1 | 1) {
    setState((s) => {
      const idx = s.sections.findIndex((sec) => sec.id === id)
      if (idx === -1) return s
      const target = idx + direction
      if (target < 0 || target >= s.sections.length) return s
      const next = s.sections.slice()
      const [item] = next.splice(idx, 1)
      next.splice(target, 0, item)
      return { ...s, sections: next }
    })
  }

  function removeSection(id: string) {
    setState((s) => ({ ...s, sections: s.sections.filter((sec) => sec.id !== id) }))
  }

  return (
    <div className="grid md:grid-cols-[260px_1fr] gap-5">
      {/* Catalog (left) */}
      <div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 sticky top-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2 px-1">Add a section</h3>
          <div className="space-y-1">
            {SECTION_CATALOG.map((entry) => (
              <button
                key={entry.type}
                type="button"
                onClick={() => addSection(entry.type)}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-800"
                title={entry.description}
              >
                <span className="font-medium">{entry.label}</span>
                <span className="block text-xs text-slate-500 truncate">{entry.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current sections (right) */}
      <div className="space-y-3">
        {state.sections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500 bg-white">
            No sections yet. Pick one from the left to add it.
          </div>
        ) : null}
        {state.sections.map((sec, i) => {
          const entry = getSectionCatalogEntry(sec.type)
          return (
            <SectionRow
              key={sec.id}
              section={sec}
              entry={entry}
              isFirst={i === 0}
              isLast={i === state.sections.length - 1}
              onUpdate={(patch) => updateSection(sec.id, patch)}
              onMove={(dir) => moveSection(sec.id, dir)}
              onRemove={() => removeSection(sec.id)}
            />
          )
        })}
      </div>
    </div>
  )
}

function SectionRow({
  section,
  entry,
  isFirst,
  isLast,
  onUpdate,
  onMove,
  onRemove,
}: {
  section: LandingPageSection
  entry: SectionCatalogEntry | null
  isFirst: boolean
  isLast: boolean
  onUpdate: (patch: Partial<LandingPageSection>) => void
  onMove: (dir: -1 | 1) => void
  onRemove: () => void
}) {
  const [open, setOpen] = useState(true)

  function setProp(name: string, value: unknown) {
    onUpdate({ props: { ...section.props, [name]: value } })
  }

  return (
    <div className={`bg-white rounded-xl border ${section.enabled ? 'border-slate-200' : 'border-slate-200 opacity-60'}`}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
        <div className="flex flex-col gap-0.5">
          <button type="button" disabled={isFirst} onClick={() => onMove(-1)} className="text-slate-400 hover:text-slate-700 disabled:opacity-30 text-xs">▲</button>
          <button type="button" disabled={isLast} onClick={() => onMove(1)} className="text-slate-400 hover:text-slate-700 disabled:opacity-30 text-xs">▼</button>
        </div>
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex-1 text-left">
          <div className="text-sm font-semibold text-slate-900">{entry?.label ?? section.type}</div>
          <div className="text-xs text-slate-500">{entry?.description ?? 'Unknown section type'}</div>
        </button>
        <label className="inline-flex items-center gap-1.5 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={section.enabled}
            onChange={(e) => onUpdate({ enabled: e.target.checked })}
          />
          Enabled
        </label>
        <button type="button" onClick={onRemove} className="text-xs px-2 py-1 rounded border border-rose-200 text-rose-700 hover:bg-rose-50">Remove</button>
      </div>
      {open ? (
        <div className="p-4 space-y-3">
          {entry?.fields?.length ? (
            entry.fields.map((field) => (
              <FieldEditor
                key={field.name}
                field={field}
                value={section.props[field.name]}
                onChange={(value) => setProp(field.name, value)}
              />
            ))
          ) : (
            <div className="text-sm text-slate-500">No editable fields for this section.</div>
          )}
        </div>
      ) : null}
    </div>
  )
}

function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: SectionFieldDef
  value: unknown
  onChange: (next: unknown) => void
}) {
  if (field.type === 'boolean') {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="font-medium text-slate-800">{field.label}</span>
        {field.description ? <span className="text-xs text-slate-500">— {field.description}</span> : null}
      </label>
    )
  }

  if (field.type === 'select') {
    return (
      <label className="block text-sm">
        <span className="font-medium text-slate-800">{field.label}</span>
        <select
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">—</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </label>
    )
  }

  if (field.type === 'textarea') {
    return (
      <label className="block text-sm">
        <span className="font-medium text-slate-800">{field.label}</span>
        <textarea
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
        />
      </label>
    )
  }

  if (field.type === 'json') {
    return <JsonField field={field} value={value} onChange={onChange} />
  }

  if (field.type === 'number') {
    return (
      <label className="block text-sm">
        <span className="font-medium text-slate-800">{field.label}</span>
        <input
          type="number"
          value={typeof value === 'number' ? value : ''}
          onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </label>
    )
  }

  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-800">{field.label}{field.required ? <span className="text-rose-600"> *</span> : null}</span>
      <input
        type={field.type === 'url' || field.type === 'image' ? 'url' : 'text'}
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
    </label>
  )
}

function JsonField({ field, value, onChange }: { field: SectionFieldDef; value: unknown; onChange: (next: unknown) => void }) {
  const [raw, setRaw] = useState(() => JSON.stringify(value ?? [], null, 2))
  const [err, setErr] = useState<string | null>(null)

  function commit(next: string) {
    setRaw(next)
    if (!next.trim()) {
      setErr(null)
      onChange([])
      return
    }
    try {
      const parsed = JSON.parse(next)
      setErr(null)
      onChange(parsed)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'invalid JSON')
    }
  }

  return (
    <div className="block text-sm">
      <span className="font-medium text-slate-800 flex items-center justify-between">
        <span>{field.label}</span>
        {err ? <span className="text-xs text-rose-600 font-normal">{err}</span> : null}
      </span>
      <textarea
        value={raw}
        onChange={(e) => commit(e.target.value)}
        rows={8}
        className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs font-mono ${err ? 'border-rose-300' : 'border-slate-300'}`}
      />
      {field.placeholder ? <p className="mt-1 text-xs text-slate-500">{field.placeholder}</p> : null}
    </div>
  )
}

// ---------------- Settings tab ----------------

function SettingsTab({ state, setState }: { state: EditorState; setState: React.Dispatch<React.SetStateAction<EditorState>> }) {
  function set<K extends keyof EditorState>(key: K, value: EditorState[K]) {
    setState((s) => ({ ...s, [key]: value }))
  }
  function setTheme<K extends keyof EditorState['theme']>(key: K, value: EditorState['theme'][K]) {
    setState((s) => ({ ...s, theme: { ...s.theme, [key]: value } }))
  }
  function setLabel<K extends keyof EditorState['conversion_labels']>(key: K, value: string) {
    setState((s) => ({ ...s, conversion_labels: { ...s.conversion_labels, [key]: value } }))
  }

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card title="Identity">
        <Text label="Internal name" value={state.internal_name} onChange={(v) => set('internal_name', v)} required />
        <Text label="URL slug" value={state.slug} onChange={(v) => set('slug', v)} required hint="Used in /landing-pages/[slug]" />
        <Select
          label="Service interest"
          value={state.service_interest}
          options={SERVICE_INTERESTS.map((s) => ({ label: s.label, value: s.value }))}
          onChange={(v) => set('service_interest', v)}
          required
          hint="Hidden field sent to Zoho when a lead submits"
        />
      </Card>

      <Card title="Contact / CTAs">
        <Text label="Primary phone (E.164)" value={state.primary_phone} onChange={(v) => set('primary_phone', v)} placeholder="+97150…" />
        <Text label="WhatsApp number (E.164)" value={state.whatsapp_number} onChange={(v) => set('whatsapp_number', v)} placeholder="+97150…" />
        <Textarea label="WhatsApp prefilled message" value={state.whatsapp_prefilled_message} onChange={(v) => set('whatsapp_prefilled_message', v)} />
        <Textarea
          label="Lead notification emails"
          hint="Comma- or newline-separated"
          value={state.form_destination_emails}
          onChange={(v) => set('form_destination_emails', v)}
        />
        <Text label="Thank-you redirect URL (optional)" value={state.thank_you_redirect_url} onChange={(v) => set('thank_you_redirect_url', v)} />
      </Card>

      <Card title="Theme">
        <Select
          label="Hero variant"
          value={state.theme.hero_variant}
          options={[
            { label: 'Split with form (default)', value: 'split-form' },
            { label: 'Centered with form', value: 'centered-form' },
            { label: 'Video + form', value: 'video-form' },
            { label: 'Urgency banner + split', value: 'urgency-banner' },
          ]}
          onChange={(v) => setTheme('hero_variant', v as HeroVariant)}
        />
        <Text label="Accent color (hex, optional)" value={state.theme.accent_color} onChange={(v) => setTheme('accent_color', v)} placeholder="#F59E0B" />
        <Text label="Header badge text" value={state.theme.badge_text} onChange={(v) => setTheme('badge_text', v)} placeholder="FTA-approved" />
        <Bool label="Sticky mobile CTA bar" checked={state.theme.show_sticky_mobile_cta_bar} onChange={(v) => setTheme('show_sticky_mobile_cta_bar', v)} />
        <Bool label="Floating WhatsApp button (desktop)" checked={state.theme.show_floating_whatsapp_button} onChange={(v) => setTheme('show_floating_whatsapp_button', v)} />
      </Card>

      <Card title="Google Ads tracking">
        <Text label="Conversion ID" value={state.google_ads_conversion_id} onChange={(v) => set('google_ads_conversion_id', v)} placeholder="AW-1234567890" />
        <Text label="Form submit label" value={state.conversion_labels.form_submit} onChange={(v) => setLabel('form_submit', v)} placeholder="abcDEFghi" />
        <Text label="Call click label" value={state.conversion_labels.call_click} onChange={(v) => setLabel('call_click', v)} />
        <Text label="WhatsApp click label" value={state.conversion_labels.whatsapp_click} onChange={(v) => setLabel('whatsapp_click', v)} />
      </Card>
    </div>
  )
}

// ---------------- SEO tab ----------------

function SeoTab({ state, setState }: { state: EditorState; setState: React.Dispatch<React.SetStateAction<EditorState>> }) {
  function setSeo<K extends keyof EditorState['seo']>(key: K, value: EditorState['seo'][K]) {
    setState((s) => ({ ...s, seo: { ...s.seo, [key]: value } }))
  }
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card title="Page SEO">
        <Text label="SEO title" value={state.seo.title} onChange={(v) => setSeo('title', v)} />
        <Textarea label="Meta description" value={state.seo.description} onChange={(v) => setSeo('description', v)} />
        <Text label="OG image URL" value={state.seo.og_image_url} onChange={(v) => setSeo('og_image_url', v)} />
        <Text label="Canonical URL (optional)" value={state.seo.canonical_url} onChange={(v) => setSeo('canonical_url', v)} />
      </Card>
      <Card title="Indexing">
        <Bool
          label="Allow search engine indexing"
          checked={state.seo.allow_indexing}
          onChange={(v) => setSeo('allow_indexing', v)}
        />
        <p className="text-xs text-slate-500 leading-relaxed">
          By default landing pages are <code className="bg-slate-100 rounded px-1">noindex,nofollow</code> and excluded from <code className="bg-slate-100 rounded px-1">sitemap.xml</code>.
          Only enable this if you want this page to appear in organic search.
        </p>
      </Card>
    </div>
  )
}

// ---------------- Small UI primitives ----------------

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function Text({
  label,
  value,
  onChange,
  required,
  placeholder,
  hint,
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; hint?: string }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-800">{label}{required ? <span className="text-rose-600"> *</span> : null}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      {hint ? <span className="block mt-1 text-xs text-slate-500">{hint}</span> : null}
    </label>
  )
}

function Textarea({
  label,
  value,
  onChange,
  hint,
}: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-800">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      {hint ? <span className="block mt-1 text-xs text-slate-500">{hint}</span> : null}
    </label>
  )
}

function Select({
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
    <label className="block text-sm">
      <span className="font-medium text-slate-800">{label}{required ? <span className="text-rose-600"> *</span> : null}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      >
        <option value="">—</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {hint ? <span className="block mt-1 text-xs text-slate-500">{hint}</span> : null}
    </label>
  )
}

function Bool({
  label,
  checked,
  onChange,
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="font-medium text-slate-800">{label}</span>
    </label>
  )
}
