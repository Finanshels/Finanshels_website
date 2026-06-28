'use client'

import { useState } from 'react'
import { SERVICE_INTERESTS } from '@/lib/landing-pages/serviceInterests'
import type { HeroVariant } from '@/lib/landing-pages/types'
import { Bool, Card, Select, Text, Textarea } from './editorPrimitives'
import { slugify, type EditorState } from './studioTypes'

type SubTab = 'settings' | 'seo'

/**
 * Page-level settings, shown in the inspector when the "Page settings" row is
 * selected in the outline. These were the old top-level Settings + SEO tabs;
 * they now live in the page context so section editing owns the inspector.
 */
export function PageSettings({
  state,
  setState,
  setSlug,
}: {
  state: EditorState
  setState: React.Dispatch<React.SetStateAction<EditorState>>
  setSlug: (v: string) => void
}) {
  const [sub, setSub] = useState<SubTab>('settings')

  function set<K extends keyof EditorState>(key: K, value: EditorState[K]) {
    setState((s) => ({ ...s, [key]: value }))
  }
  function setTheme<K extends keyof EditorState['theme']>(key: K, value: EditorState['theme'][K]) {
    setState((s) => ({ ...s, theme: { ...s.theme, [key]: value } }))
  }
  function setLabel<K extends keyof EditorState['conversion_labels']>(key: K, value: string) {
    setState((s) => ({ ...s, conversion_labels: { ...s.conversion_labels, [key]: value } }))
  }
  function setSeo<K extends keyof EditorState['seo']>(key: K, value: EditorState['seo'][K]) {
    setState((s) => ({ ...s, seo: { ...s.seo, [key]: value } }))
  }

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg border border-slate-200 p-0.5">
        {(['settings', 'seo'] as SubTab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setSub(t)}
            className={`rounded-md px-3 py-1 text-sm font-medium transition ${
              sub === t ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t === 'settings' ? 'Settings' : 'SEO'}
          </button>
        ))}
      </div>

      {sub === 'settings' ? (
        <>
          <Card title="Identity">
            <Text label="Internal name" value={state.internal_name} onChange={(v) => set('internal_name', v)} required />
            <Text
              label="URL slug"
              value={state.slug}
              onChange={(v) => setSlug(slugify(v) || v.toLowerCase().replace(/\s+/g, '-'))}
              required
              hint="Used in /landing-pages/[slug] — auto-generated from internal name; edit to override"
            />
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
        </>
      ) : (
        <>
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
            <p className="text-xs leading-relaxed text-slate-500">
              By default landing pages are{' '}
              <code className="rounded bg-slate-100 px-1">noindex,nofollow</code> and excluded from{' '}
              <code className="rounded bg-slate-100 px-1">sitemap.xml</code>. Only enable this if you want this page to
              appear in organic search.
            </p>
          </Card>
        </>
      )}
    </div>
  )
}
