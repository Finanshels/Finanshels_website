# Webflow CMS Parity Audit (Finanshels Admin)

Date: 2026-05-08

This audit compares the current custom CMS admin against core Webflow CMS patterns and identifies gaps.

## Current parity status

### Implemented

- Multi-collection CMS architecture
- Editorial workflow: `draft → in_review → approved → scheduled → published`
- Scheduled publishing (`scheduledAt`)
- Collection-specific field sets with five universal sections
  (Card / Listing page / Detail page / Page blocks / Relationships)
- Slug-based content entries with per-collection `routePattern` and
  `listingRoute`
- Per-collection `defaultSchemaType` + per-document `schema_type_override`
  for JSON-LD
- SEO / AEO / GEO field sections
- Rich text editing for long-form fields (TipTap)
- Per-entry route revalidation on save (detail + listing + sitemap +
  llms.txt)
- **Reference and multi-reference relationship pickers** between
  collections (e.g. blog post → author / co-authors / related content)
- **Reverse-reference panel** ("Where this is used") backed by
  `listReverseReferences` and `CMS_INCOMING_REFERENCES`
- **Universal card fields** (`card_title`, `card_description`,
  `card_image`, `card_icon`, `card_label`, `card_cta_label`,
  `card_cta_link`, `featured`, `sort_order`) with a live `CardPreview`
- **Listing page configuration** (hero, search, filters, sort, items per
  page, sticky CTA)
- **Detail page configuration** (hero, breadcrumbs, social share, related
  content, lead capture, sticky side CTA)
- **Page builder** with a 15-block catalog (Hero, Rich Text, CTA,
  Testimonial, FAQ Accordion, Stats, Logo Wall, Video Embed, Tool Embed,
  Form, Download, Speaker, Related Content, Table, Timeline) rendered by
  `src/components/cms/PageBlocksRenderer.tsx`
- Localization (`locale`, `localeGroupId`)
- Revision history per document with rollback (`/_revisions` subcollection)
- Role-based access control (`owner`, `admin`, `editor`, `viewer`)
- Bulk operations (publish/unpublish/delete) on the collection list view
- Field widgets: text, textarea, rich text, select, json, boolean
  (checkbox), datetime (`datetime-local`), reference, multi-reference,
  blocks (page builder)

### Partially implemented

- Asset library is still URL-based; no upload browser or asset reuse
- Inline field validation is minimal (server-side required checks only)
- Search / filter on listing pages relies on Firestore queries; no
  cross-collection unified search UI yet

## Remaining gaps vs Webflow-style CMS

### High priority

1. **Media manager / assets library**
   - Missing upload browser, asset picker, and reuse flow
   - Current state: URL-only media fields

2. **Inline validation and field-level constraints**
   - Missing min/max lengths, regex checks, required warnings before submit
   - Current state: basic required check server-side

### Medium priority

3. **Cross-collection search UI**
   - `enable_search` toggle exists per collection, but a unified
     full-CMS search bar (admin + frontend) is not yet wired

4. **Editorial dashboard signals**
   - "Needs SEO", "Missing OG image", "Draft older than X days"
   - Currently shown ad-hoc per row, not aggregated

### Nice-to-have

5. **Visual page-builder canvas**
   - The block editor is form-based; a drag-and-drop canvas could
     replace it later

6. **Webhook / external publish triggers**
   - On-demand revalidation already runs locally; outbound webhooks
     (Slack, Zapier) on publish would close the loop

## Recommended implementation order

1. Media manager + asset picker
2. Cross-collection search and editorial dashboard
3. Inline validation rules wired into `CmsField` definitions
4. Outbound publish webhooks
5. Visual page-builder canvas
