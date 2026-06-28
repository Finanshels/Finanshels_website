import type {
  HeroVariant,
  LandingPageDoc,
  LandingPageSection,
  LandingPageStatus,
} from '@/lib/landing-pages/types'

/**
 * Shared editor state + (de)serialization for the Landing Page Studio.
 *
 * Extracted from LandingPageEditor so the three zones (outline / canvas /
 * inspector) can import the same source of truth without a circular import.
 * The renderer value shapes are NOT touched here — `sections` passes through
 * verbatim (Studio P1 invariant).
 */

export type DeviceKey = 'desktop' | 'tablet' | 'mobile'

/** Quick actions a section row / on-canvas toolbar can trigger. */
export type SectionAction = 'up' | 'down' | 'duplicate' | 'delete'

export type EditorState = {
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

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function genId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `s_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}

export function pageToState(page: LandingPageDoc): EditorState {
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

export function stateToPayload(s: EditorState) {
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
