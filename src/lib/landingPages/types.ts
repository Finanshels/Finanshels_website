export type LandingPageStatus = 'draft' | 'published' | 'archived'

export type HeroVariant = 'split-form' | 'centered-form' | 'video-form' | 'urgency-banner'

export type LeadAttribution = {
  gclid?: string
  gbraid?: string
  wbraid?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  referrer?: string
  landing_url: string
}

export type LandingPageSection = {
  id: string
  type: string
  enabled: boolean
  props: Record<string, unknown>
}

export type LandingPageConversionLabels = {
  form_submit: string
  call_click: string
  whatsapp_click: string
}

export type LandingPageTheme = {
  accent_color?: string
  hero_variant: HeroVariant
  show_sticky_mobile_cta_bar: boolean
  show_floating_whatsapp_button: boolean
  badge_text?: string
}

export type LandingPageSeo = {
  title: string
  description: string
  og_image_url?: string
  allow_indexing: boolean
  canonical_url?: string
}

export type LandingPageDoc = {
  id: string
  slug: string
  internal_name: string
  status: LandingPageStatus
  published_at: Date | null
  created_at: Date | null
  updated_at: Date | null
  created_by: string
  updated_by: string

  service_interest: string
  google_ads_conversion_id: string
  conversion_labels: LandingPageConversionLabels
  primary_phone: string
  whatsapp_number: string
  whatsapp_prefilled_message?: string
  form_destination_emails: string[]
  thank_you_redirect_url?: string

  sections: LandingPageSection[]
  theme: LandingPageTheme
  seo: LandingPageSeo
}

export type LandingPageListItem = {
  id: string
  slug: string
  internal_name: string
  status: LandingPageStatus
  service_interest: string
  updated_at: Date | null
  published_at: Date | null
}

export type LandingPageLead = {
  id: string
  submitted_at: Date | null

  name: string
  phone: string
  email: string
  company_name?: string

  landing_page_id: string
  landing_page_slug: string
  service_interest: string

  gclid?: string
  gbraid?: string
  wbraid?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  referrer?: string
  landing_url: string
  user_agent: string
  ip_hash: string

  zoho_lead_id?: string
  zoho_synced_at: Date | null
  zoho_sync_error?: string
  zoho_retry_count: number
  resend_email_sent_at: Date | null
  resend_email_error?: string
}

export const DEFAULT_CONVERSION_LABELS: LandingPageConversionLabels = {
  form_submit: '',
  call_click: '',
  whatsapp_click: '',
}

export const DEFAULT_THEME: LandingPageTheme = {
  accent_color: '',
  hero_variant: 'split-form',
  show_sticky_mobile_cta_bar: true,
  show_floating_whatsapp_button: true,
  badge_text: '',
}

export const DEFAULT_SEO: LandingPageSeo = {
  title: '',
  description: '',
  og_image_url: '',
  allow_indexing: false,
  canonical_url: '',
}

export const LANDING_PAGE_COLLECTION = 'landing_pages'
export const LANDING_PAGE_LEAD_COLLECTION = 'landing_page_leads'
export const LANDING_PAGE_RATE_LIMIT_COLLECTION = 'landing_page_rate_limits'
