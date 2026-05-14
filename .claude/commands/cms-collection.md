---
description: Scaffold a new CMS collection with all sections and revalidation wiring
allowed-tools: Read, Edit, Write, Grep, Glob, Bash
---

# /cms-collection — add a new CMS collection

You are adding a new collection to the Finanshels CMS. There are 15 today. The collection drives admin UI, public routing, revalidation, sitemap, and JSON-LD — wiring any of those incorrectly silently breaks something.

## Inputs

- **Key** — snake_case (e.g. `case_studies`, `events`). Pluralised. Must be unique.
- **Singular label** + **plural label** for admin UI.
- **Route segment** — usually matches the key (e.g. `/case-studies`), kebab-case.
- **Routed?** Most are. If not (config-style collections), skip routing/SEO steps.
- **JSON-LD type** — `Article` / `DefinedTerm` / `Event` / `Person` / `VideoObject` / `FAQPage` / etc.

## Steps

1. **Read first**:
   - [src/lib/cms/collectionDefinitions.ts](../../src/lib/cms/collectionDefinitions.ts) — find an existing similar collection (e.g. `blog_posts` for editorial, `tools` for product-style).
   - [docs/cms-firestore.md](../../docs/cms-firestore.md) — section on collection structure.
   - [.claude/rules/cms.md](../rules/cms.md) — invariants.

2. **Extend the key union**:
   ```ts
   export type CmsCollectionKey =
     | 'blog_posts'
     | ...
     | '<your-new-key>'
   ```

3. **Append a `CmsCollectionDefinition`** with all 9 sections:
   - `publish` — title, slug, status, scheduledAt, locale, authorName
   - `card` — `card_title`, `card_description`, `card_image`, `card_icon`, `card_label`, `card_cta_label`, `card_cta_link`, `featured`, `sort_order`
   - `listing` — listing-page hero + toggles (`enable_search`, `enable_filters`, etc.)
   - `detail` — detail-page hero + toggles (`enable_breadcrumbs`, `enable_social_share`, etc.)
   - `blocks` — page builder (usually `page_blocks` field of type `blocks`)
   - `relations` — typed `reference` / `multi_reference` pickers
   - `seo` — `seoTitle`, `seoDescription`, `canonicalUrl`, `noIndex`
   - `aeo` — AI answer engine fields (citations, statistics, quotes — type `rows`)
   - `geo` — local search fields (location, region)

   **Copy a similar collection wholesale, then prune. Faster than building from scratch.**

4. **Wire revalidation** — set on the definition:
   ```ts
   routePattern: '/<route-segment>/[slug]',
   listingRoute: '/<route-segment>',
   defaultSchemaType: '<JSON-LD-type>',
   ```
   Without these, `collectionRepository` silently skips revalidation on save.

5. **Firestore indexes** — append to `firestore.indexes.json` if you'll query `status` + an ordering field:
   ```json
   {
     "collectionGroup": "<key>",
     "queryScope": "COLLECTION",
     "fields": [
       { "fieldPath": "status", "order": "ASCENDING" },
       { "fieldPath": "publishedAt", "order": "DESCENDING" }
     ]
   }
   ```
   Then `npm run firebase:deploy`.

6. **Cross-collection references** — if other collections should be able to reference this one:
   - Add `reference` / `multi_reference` fields on the source collection's `relations` section.
   - Add an entry to `CMS_INCOMING_REFERENCES` in `src/lib/cms/definitions/incomingReferences.ts` so reverse-reference panel works.

7. **Routing** — usually nothing to do. The generic detail page at [src/app/content/[collection]/[slug]/page.tsx](../../src/app/content/) resolves all routed collections via the definition. Only add a dedicated route (`/blog`, `/glossary`) if you need a marketing-tuned listing different from the generic one.

8. **SEO surfaces** — update both:
   - [src/app/sitemap.ts](../../src/app/sitemap.ts) — add the collection to the sitemap generator.
   - [src/app/llms.txt](../../src/app/) — add to the AI answer engine manifest.

9. **Verify**:
   ```bash
   npm run typecheck
   npm run build       # catches firebase-admin client-bundle leaks
   npm run dev
   ```
   Open `/admin/cms`, find your collection in the sidebar, create a doc, publish it, hit the public URL.

10. **Document** — append a row to the collection table in [docs/cms-firestore.md](../../docs/cms-firestore.md).

## Don't

- Don't create a collection without `routePattern` + `listingRoute` if it's user-facing — silent revalidation miss.
- Don't write to the collection from outside `src/lib/cms/collectionRepository.ts` — bypasses revisions and revalidation.
- Don't add a new dedicated route page without checking if the generic `/content/[collection]` already covers it.
