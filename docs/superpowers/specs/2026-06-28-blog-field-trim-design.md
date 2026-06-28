# Blog editor field trim — design

**Date:** 2026-06-28
**Status:** Approved (design)
**Owner:** meet@finanshels.com
**Source of truth:** `src/lib/cms/collectionDefinitions.ts`

## Problem

The `blog_posts` editor still surfaces optional fields that are either redundant
with another field or genuinely dead (defined in the editor but never read by any
renderer, schema builder, or listing). This adds noise to the form without adding
capability. We want a leaner blog editor while preserving search and AI-engine
visibility.

## Decision

Keep the search/AI surfaces (SEO, AEO, GEO), the page-builder (Blocks), and
internal-linking (Relations). Delete the dead optional fields. Lead-gen CTAs on
blog posts are handled by the **CTA page-block** (Blocks tab), which renders and
is fully editable per post — so the dead `detail_*` CTA trio is deleted, not
revived (see **Blog lead-gen CTA** below).

### Fields to delete (12)

| Field | Reason | Mechanism |
|---|---|---|
| `lead_magnet_label` | Dead — no renderer reads it | Remove from blog `publish` override |
| `lead_magnet_url` | Dead — no renderer reads it | Remove from blog `publish` override |
| `lead_magnet_form_id` | Dead — superseded by `detail_lead_capture_form_id` | Remove from blog `publish` override |
| `series_ref` | Dead — no series UI consumes it | Remove from blog `publish` override |
| `target_persona` | Dead — no renderer, schema, or listing reads it | Remove from blog `publish` override |
| `table_of_contents_enabled` | Dead — no TOC renderer exists; flag does nothing | Remove from blog `publish` override |
| `detail_lead_capture_form_id` | Dead — no HubSpot embed component exists in the codebase | Remove from blog `publish` override |
| `detail_sticky_side_cta_label` | Dead — CTA is handled by the CTA page-block | Remove from blog `publish` override |
| `detail_sticky_side_cta_link` | Dead — CTA is handled by the CTA page-block | Remove from blog `publish` override |
| `thumbnail_image` | Redundant with `featured_image` | Add to blog `strip` list |
| `icon` | No icon concept for an article | Add to blog `strip` list |
| `status` | Phantom input — the server resolves status only from the header Save/Publish buttons (`requestedStatus`); the sidebar select is ignored | Add to blog `strip` list |

### Fields to keep (explicit)

- **Required (9):** `title`, `slug`, `status`, `language`, `excerpt`, `body`,
  `author`, `publish_date`, `blog_category`
- **Publish optional:** `featured_image`, `featured_image_alt`, `blog_industry`,
  `blog_tags`, `featured_post`, `related_posts`
- **SEO (14), AEO (2), GEO (7), Blocks (2), Relations (2):** unchanged

## Why two mechanisms

The blog editor's field set is computed in `collectionDefinitions.ts` by merging
global field sets with per-collection overrides, then applying a per-collection
`strip` list (`HIDDEN_FIELDS_BY_COLLECTION`).

- **Blog-specific fields** (`lead_magnet_*`, `series_ref`) exist only in the
  `blog_posts` `publish` override array. They are deleted outright from that array.
- **Global core fields** (`thumbnail_image`, `icon`) are shared by other
  collections and cannot be deleted globally without breaking them. They are
  added to the `blog_posts` entry's `strip` list, which removes them from the
  blog form across all sections while leaving every other collection untouched.

Both mechanisms produce the same outcome: the field no longer renders in the blog
editor.

## Downstream impact (verified)

Grep across `src/**/*.{ts,tsx,jsx}`:

- `lead_magnet*` — **no readers** outside `collectionDefinitions.ts`. Pure dead form fields.
- `series_ref` — **no readers** outside `collectionDefinitions.ts`. Pure dead form field.
- `target_persona` — **no readers** outside `collectionDefinitions.ts`. Not in the blog Zod schema; the other `persona` hits (chat prompt, sector content) are unrelated. Pure dead form field.
- `table_of_contents_enabled` — **no readers** outside `collectionDefinitions.ts`. No TOC renderer exists for blog posts; the flag has never had an effect. The `toc` / "on this page" hits elsewhere (privacy/terms, marketing catch-all, landing templates) are unrelated. Pure dead form field.
- `detail_lead_capture_form_id` — **no readers** outside `collectionDefinitions.ts`. No HubSpot/embed component exists anywhere in `src` (`hubspot` only appeared in the field placeholder). The field could never render a form. Pure dead form field.
- `detail_sticky_side_cta_label` / `detail_sticky_side_cta_link` — only the blog `publish` override surfaced them (the shared `detail` section is suppressed for blogs). No blog renderer reads them; CTAs come from the CTA page-block. The shared `universalDetailFields()` copies (used by other collections' detail sections) are left untouched. Pure dead form fields for blogs.
- `thumbnail_image` — one reference, `src/app/admin/cms/page.tsx:1415`, an admin
  card-image fallback. The blog `card` section is already suppressed
  (`SUPPRESSED_SECTIONS_BY_COLLECTION`), so this path does not render for blogs.
  Stripping it is harmless.
- `icon` — global; only relevant to the suppressed blog `card` section.

No renderer behavior changes beyond the fields disappearing from the form.

## Blog lead-gen CTA (decision: use the CTA page-block)

The published blog post page rendered hero → image → excerpt → body → optional
page-blocks, then **stopped** — no conversion element. The `detail_sticky_side_cta_*`
fields were inputs for a CTA that was never wired to the page.

An always-on `BlogPostCta` renderer was built and trialled, but it **stacked
directly against a CTA page-block** an editor had already added to the post
(double CTA, no breathing room). Since the **CTA page-block** already renders a
fully-editable, per-post CTA via the Blocks tab, the always-on card was
redundant. Decision: **drop the custom renderer; the CTA page-block is the single
mechanism.**

Removed in this reversal:

- Deleted `src/components/cms/BlogPostCta.tsx` and its wiring in
  `src/app/blog/[slug]/page.tsx`.
- Removed the two `detail_sticky_side_cta_*` fields from `blogPostSchema`
  (`src/lib/cms/schemas/blog.ts`) and from the blog `publish` override.
- The shared `universalDetailFields()` copies and the AI `fieldMap` "✨ Suggest"
  entry for `detail_sticky_side_cta_label` are left intact — other collections'
  detail sections still use them.

Deferred: embedded HubSpot lead form (would need a new embed component).

## SEO & schema cleanup (cross-collection, same pass)

Three redundant SEO/schema controls were cleaned up beyond blogs. These touch
`globalSeoFields()` / `universalBlocksFields()`, so they affect **all** collections:

- **`twitter_card_type` removed** from the SEO form. It's an org-wide setting
  (always `summary_large_image`); the blog route hardcodes it and the generic
  `/content` route defaults to it, so it never needed to be per-post. Existing
  stored values still read.
- **`schema_type` (SEO tab) removed** as a duplicate. There were three schema
  controls (collection `defaultSchemaType` + SEO `schema_type` + Blocks
  `schema_type_override`). Consolidated onto **`schema_type_override`** as the
  single per-doc override; legacy `schema_type` values stay honored as a read
  fallback in `resolveSchemaType` and the blog route.
- **`schema_type_override` options curated per collection** via a new
  `SCHEMA_OVERRIDE_OPTIONS_BY_COLLECTION` map (e.g. blogs → Article / BlogPosting
  / NewsArticle / HowTo / FAQPage instead of all 19 types). Unlisted collections
  fall back to the full catalogue (`ALL_SCHEMA_TYPES`).
- **Blog route wiring:** `blog/[slug]/page.tsx` now reads
  `schema_type_override || schema_type || 'BlogPosting'`, and
  `schema_type_override` was added to `blogPostSchema` (Zod's plain `z.object`
  strips undeclared keys, so any field the route needs must be declared).

## Data

No migration. Existing Firestore documents keep any stored values for these
fields; they are simply never shown or editable again. The deleted blog-specific
fields almost certainly hold no data, since nothing ever rendered them.

## Cleanup riders

- Remove the now-stale `lead_magnet_*` / `series_ref` code comments in
  `collectionDefinitions.ts` (the `CMO-redesign:` notes that introduced them).
- Update the field-guide docs so they match the new field set:
  - `docs/cms-field-guide.md`
  - `docs/cms/marketing-field-guide.md`

## Verification

1. `npm run typecheck`
2. Open `/admin/cms` → Blog Posts → **+ New Blog Post**.
3. Confirm `thumbnail_image`, `icon`, `series_ref`, `target_persona`,
   `table_of_contents_enabled`, `detail_lead_capture_form_id`, the two
   `detail_sticky_side_cta_*` fields, and the three `lead_magnet_*` fields are
   gone from the form.
4. Confirm SEO / AEO / GEO / Blocks / Relations tabs are still present.
5. Add a **CTA page-block** to a post via the Blocks tab; open the published
   `/blog/[slug]` and confirm exactly one CTA renders (no duplicate/stacked CTA).

## Out of scope

- Per-collection field changes are limited to `blog_posts`. The SEO/schema cleanup
  (`twitter_card_type`, `schema_type`, schema-override curation) is cross-collection
  by nature — see **SEO & schema cleanup**.
- No changes to listing pages. (The blog detail renderer + `blogPostSchema` are
  touched only for `schema_type_override` — see **SEO & schema cleanup**. The
  trialled `BlogPostCta` renderer was reverted.)
- No Firestore data migration.
- Custom blog CTA renderer (reverted — CTA page-block is the mechanism).
- Embedded HubSpot lead form (deferred — needs a new embed component).
