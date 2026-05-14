# Landing Pages — Design Spec

**Date:** 2026-05-14
**Owner:** Marketing + Engineering
**Status:** Draft (pending review)

## 1. Purpose

Finanshels runs Google Ads campaigns to service-specific landing pages (corporate tax registration, VAT filing, AML, liquidation, accounting, etc.). These pages must:

1. Convert paid traffic at high rate — multi-CTA mix (form + phone + WhatsApp).
2. Be invisible to organic visitors (default `noindex`, no internal links, excluded from sitemap).
3. Be built and edited entirely by the marketing team via CMS, with no developer involvement after launch.
4. Use a single template with a fully modular section library — marketing can add, remove, reorder, and toggle sections per page.
5. Push every lead to Zoho CRM with full Google Ads attribution and fire Google Ads conversion events for form, call, and WhatsApp interactions.

## 2. Out of scope

- A/B testing framework (future).
- Multi-variant optimization (future).
- Multi-language landing pages (future — UI is English-only for v1).
- Replacement of any existing service pages under `/services`.

## 3. URL & routing

- Public URL: `/landing-pages/[slug]`
- Renderer: `src/app/landing-pages/[slug]/page.tsx` (server component, ISR with `revalidate: 60`)
- Lead endpoint: `POST /api/landing-pages/lead` (single route, identifies page by `landing_page_id`)
- Revalidate endpoint: `POST /api/revalidate?slug=…` triggered by CMS publish
- Slug rules: unique within `landing_pages` collection, lowercase, dash-separated, must not collide with reserved values (`new`, `admin`, etc.)
- Unpublished pages return 404 to public; admins (authenticated via existing admin session) get a preview render with a "DRAFT" banner

## 4. Data model

### Collection `landing_pages` (Firestore)

```ts
type LandingPage = {
  id: string
  slug: string                       // unique, dash-case
  internal_name: string              // marketing reference, never shown to visitor
  status: 'draft' | 'published' | 'archived'
  published_at?: Timestamp
  created_at: Timestamp
  updated_at: Timestamp
  created_by: string                 // admin user id
  updated_by: string

  // Conversion configuration
  service_interest: string           // hidden field sent to Zoho — e.g. 'corporate_tax_registration'
  google_ads_conversion_id: string   // e.g. 'AW-1234567890'
  conversion_labels: {
    form_submit: string              // gtag conversion label
    call_click: string
    whatsapp_click: string
  }
  primary_phone: string              // E.164 — drives tel: links
  whatsapp_number: string            // E.164 — drives wa.me links
  whatsapp_prefilled_message?: string
  form_destination_emails: string[]  // internal lead notification recipients
  thank_you_redirect_url?: string    // optional post-submit redirect; default = inline thank-you

  // Content (page builder)
  sections: LandingPageSection[]     // ordered, see section catalog

  // Page-level theme overrides
  theme: {
    accent_color?: string            // hex
    hero_variant: 'split-form' | 'centered-form' | 'video-form' | 'urgency-banner'
    show_sticky_mobile_cta_bar: boolean   // default true
    show_floating_whatsapp_button: boolean // default true
    badge_text?: string              // e.g. 'FTA-approved' — shown in header
  }

  // SEO
  seo: {
    title: string
    description: string
    og_image_url?: string
    allow_indexing: boolean          // default false
    canonical_url?: string
  }
}

type LandingPageSection = {
  id: string                         // stable uuid
  type: SectionType                  // see section catalog
  enabled: boolean                   // marketing can disable without deleting
  props: Record<string, unknown>     // shape depends on type
}
```

### Collection `landing_page_leads` (Firestore)

```ts
type LandingPageLead = {
  id: string
  submitted_at: Timestamp

  // Form data
  name: string
  phone: string
  email: string
  company_name?: string

  // Page context
  landing_page_id: string
  landing_page_slug: string
  service_interest: string

  // Attribution
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
  ip_hash: string                    // sha256 of IP, not raw IP

  // Sync state
  zoho_lead_id?: string
  zoho_synced_at?: Timestamp
  zoho_sync_error?: string
  zoho_retry_count: number
  resend_email_sent_at?: Timestamp
  resend_email_error?: string
}
```

## 5. Section library

Each section is a self-contained React component registered in `LANDING_PAGE_SECTIONS` (parallel to `CMS_BLOCK_TYPES`). Marketing reorders, adds, removes, and enables/disables sections per page from the admin UI.

### Hero variants (one per page, selected via `theme.hero_variant`)

| Variant | When to use |
|---------|-------------|
| `split-form` | Default — copy left, lead form right; mobile stacks |
| `centered-form` | Short pages — centered headline + form below + bg blur image |
| `video-form` | High-trust services (audit, liquidation) — explainer video left, form right |
| `urgency-banner` | Deadline-driven — countdown above hero, then split-form |

### Trust & social proof

- `trust-bar` — horizontal logo strip + "Trusted by 5,000+ UAE businesses" + Google/Trustpilot rating chip
- `stats-row` — animated counters (reuses `AnimatedCounter`)
- `testimonials-carousel` — reuses `TestimonialCarousel`, pulls from `customer_reviews` Firestore collection
- `video-testimonial` — single embedded video + quote + name/role
- `awards-press` — logos of FTA, news mentions, certifications

### Value / explanation

- `feature-grid` — 3/4/6 cards (icon + title + 1-line description)
- `process-steps` — 3-5 numbered steps (icon + 2-line description)
- `comparison-table` — Finanshels vs. DIY vs. other firms
- `pricing` — 1-3 tier cards or "from AED X" hero card with bullets + per-card CTA

### Conversion blocks

- `inline-form` — same form as hero, mid-page re-engagement
- `cta-banner` — full-width band with one line + CTA buttons (Call / WhatsApp / Get Quote)
- `lead-magnet` — "Download free checklist" → form unlocks PDF
- `final-cta` — large closing block; always last; contains form + call + WhatsApp

### Objection handling

- `faq` — accordion (large impact on conversion + AEO)
- `guarantee` — money-back / FTA-approved / 30-day guarantee callout
- `risk-reversal` — "No commitment, free quote in 24 hours" badge row

### Always-on chrome (page-level toggles, not sections)

- Sticky mobile **bottom CTA bar** (Call · WhatsApp · Form) — on by default, `theme.show_sticky_mobile_cta_bar`
- Floating **WhatsApp button** bottom-right on desktop — on by default
- Minimal **footer** — logo + legal links only (no main nav, prevents leak-off)
- Minimal **header** — logo + primary phone number only, no nav links

## 6. Lead submission flow

1. User submits hero / inline / final-cta form (single shared `<LeadForm />` client component)
2. Client validates with Zod, includes attribution hidden inputs and `landing_page_id`
3. Honeypot field + Cloudflare Turnstile token included
4. `POST /api/landing-pages/lead`
5. Server route:
   a. Verify Turnstile token
   b. Rate-limit by IP (Firestore-based: max 10 submits / hour / IP)
   c. Zod-validate payload
   d. Write `landing_page_leads` document — source of truth
   e. Push to Zoho CRM Leads module via OAuth refresh-token flow (separate `zohoClient.ts`)
   f. Send Resend email to `form_destination_emails`
   g. Return `{ ok: true, lead_id, conversion_event: { send_to, value? } }`
6. Steps (e) and (f) wrapped in try/catch — failures stored on the lead doc (`zoho_sync_error`, `resend_email_error`) and retryable from admin
7. Client fires `gtag('event', 'conversion', { send_to })` and shows thank-you state or redirects to `thank_you_redirect_url`

## 7. Attribution & Google Ads conversion tracking

### Capture (client-side, on landing)

- Read URL params: `gclid`, `gbraid`, `wbraid`, `utm_source|medium|campaign|term|content`
- Read `document.referrer`
- Persist to `sessionStorage` key `fns_attr` and 90-day first-party cookie `fns_attr` (JSON-encoded)
- On any form, attribution values populate hidden inputs

### gtag setup

- `gtag.js` loaded once via `<Script strategy="afterInteractive">` in the landing-page layout
- Per-page Google Ads conversion ID from `landing_pages.google_ads_conversion_id`
- Conversion events:
  - **Form submit** — fired after server 200, `send_to: '{id}/{conversion_labels.form_submit}'`
  - **Call click** — `tel:` link onClick handler, `send_to: '{id}/{conversion_labels.call_click}'`
  - **WhatsApp click** — `wa.me` link onClick handler, `send_to: '{id}/{conversion_labels.whatsapp_click}'`

### Enhanced conversions

- Before firing form_submit conversion, hash email and phone (SHA-256, client-side via `crypto.subtle`) and call `gtag('set', 'user_data', { sha256_email_address, sha256_phone_number })`

### Offline conversion seed

- Server includes `gclid` on Zoho lead — supports later offline-conversion upload from CRM

## 8. Admin UI

### Collection card on `/admin/cms`

New card "Landing Pages" linking to `/admin/cms/landing-pages`.

### List view `/admin/cms/landing-pages`

- Columns: Internal name, Slug, Status, Service, Updated, Leads (24h count), Actions
- Filters: status, service_interest
- Search: slug, internal_name
- Actions: Edit, Duplicate, Archive, View public URL

### Edit view `/admin/cms/landing-pages/[id]`

Three tabs:

1. **Content** — section builder
   - Left: section catalog with "Add" buttons
   - Center: ordered list of current sections, each with drag handle, enabled toggle, collapse/expand, "Remove" button
   - Each section expands to its props editor (similar to `PageBlocksEditor`)
   - Hero variant picker is a radio at the top of the Content tab
   - Right: live preview iframe (renders `/landing-pages/[slug]?preview=1`)
2. **Settings**
   - Slug, internal name, status
   - Service interest (dropdown — service registry curated by engineering)
   - Google Ads conversion ID + 3 labels
   - Primary phone, WhatsApp number, WhatsApp message
   - Form destination emails (chips)
   - Thank-you redirect URL
   - Theme accent color, sticky-bar toggles, badge text
3. **SEO**
   - Title, description, OG image URL, canonical, allow_indexing toggle (default off)

### Leads view `/admin/cms/landing-page-leads`

- Columns: Submitted, Name, Phone, Email, Page, Service, Zoho status, Actions
- Filters: page, date range, sync status
- Per-row action: "Retry Zoho push"
- Top-bar: CSV export of filtered set

## 9. SEO, performance, visibility

- Default `<meta name="robots" content="noindex,nofollow">` — flipped to `index,follow` only when `seo.allow_indexing === true`
- `sitemap.ts` skips all `landing_pages` regardless of `allow_indexing` (paid pages stay out of sitemap)
- ISR `revalidate: 60`; CMS publish hits `/api/revalidate?slug=…` for near-instant updates
- Critical CSS via Tailwind; fonts preloaded; hero image uses `next/image` with `priority`
- All sections server-rendered except form, which is a client island
- Performance budget: Lighthouse mobile Performance ≥ 90, LCP < 2.0s on a slow 4G simulation

## 10. Conversion-design principles (enforced by template, not optional)

1. **Form visible above the fold** on every page — even non-hero variants. If page has no form-bearing hero, an `inline-form` auto-injects as first section.
2. **Sub-2-second LCP** target on mobile.
3. **Mobile-first** — UAE Google Ads traffic is ~75% mobile; sticky bottom CTA bar by default.
4. **One destination per CTA** — color-coded: primary = form submit, secondary = WhatsApp, tertiary = call.
5. **Trust within 5 seconds** — by 600px scroll, rating, business count, or recognizable logo visible.
6. **No leak-off** — header has logo + phone only; footer has only legal links.
7. **Specificity & scarcity** — concrete numbers and real testimonials; urgency only when truly time-bound (filing deadlines).

## 11. Security & abuse

- Cloudflare Turnstile on all forms (free, privacy-friendly)
- Honeypot text field hidden via CSS
- Per-IP rate limit: 10 submits / hour, tracked in Firestore
- IP stored hashed (SHA-256 + per-env salt), never raw
- Phone/email stored plaintext (needed for CRM); Firestore rules deny client reads of `landing_page_leads` (admin SDK only)

## 12. Configuration & secrets

Environment variables required:

- `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`, `ZOHO_API_DOMAIN` (e.g. `https://www.zohoapis.com`)
- `TURNSTILE_SITE_KEY` (public), `TURNSTILE_SECRET_KEY`
- `IP_HASH_SALT`
- `RESEND_API_KEY` (existing)

## 13. Service-interest registry

Curated in code at `src/lib/landingPages/serviceInterests.ts`:

```ts
export const SERVICE_INTERESTS = [
  { value: 'corporate_tax_registration', label: 'Corporate Tax Registration' },
  { value: 'corporate_tax_filing', label: 'Corporate Tax Filing' },
  { value: 'vat_registration', label: 'VAT Registration' },
  { value: 'vat_filing', label: 'VAT Filing' },
  { value: 'accounting_bookkeeping', label: 'Accounting & Bookkeeping' },
  { value: 'aml_compliance', label: 'AML Compliance' },
  { value: 'goaml_registration', label: 'goAML Registration' },
  { value: 'company_liquidation', label: 'Company Liquidation' },
  // …extensible
] as const
```

Marketing picks from this dropdown when creating a page. Engineering maintains the list (one-line addition per service).

## 14. Migration & rollout

1. Build template + section library + admin UI + lead pipeline in parallel
2. Engineering creates the first landing page (corporate tax registration) end-to-end as a validation
3. Marketing reviews, requests adjustments
4. Marketing duplicates and creates the remaining 12 pages independently
5. Update Google Ads destination URLs

No data migration — existing service pages stay where they are; landing pages are net-new.

## 15. Acceptance criteria

- [ ] A marketing user can create a new landing page from scratch in the admin UI with no developer involvement and publish it to a working public URL
- [ ] A marketing user can duplicate an existing landing page and edit a copy
- [ ] A marketing user can add, remove, reorder, and toggle sections; live preview reflects changes within 60s of publish
- [ ] All landing pages default to `noindex,nofollow` and are excluded from `sitemap.xml`
- [ ] A form submission writes to Firestore, pushes to Zoho CRM Leads, sends Resend email, and fires the Google Ads form_submit conversion
- [ ] Call clicks and WhatsApp clicks fire their respective Google Ads conversion events
- [ ] Attribution (`gclid`, `utm_*`, `referrer`) is captured on landing and travels through to both Firestore and Zoho
- [ ] Admin can view all leads, filter, export CSV, and retry failed Zoho pushes
- [ ] Lighthouse mobile Performance ≥ 90 on the first published landing page
- [ ] Turnstile + honeypot + rate limit block obvious bot traffic
