# CMS Admin — Audit, Code Review & Module Documentation

**Generated:** 2026-05-08
**Spec:** [`docs/superpowers/specs/2026-05-08-cms-admin-audit-design.md`](../superpowers/specs/2026-05-08-cms-admin-audit-design.md)
**Population data:** [`admin-audit.data.json`](./admin-audit.data.json) (currently empty — Firestore project was fresh at audit time; verdicts are based on frontend-usage analysis)

This is the source-of-truth audit for the CMS admin panel. It covers code-level findings, the field-type / section meta-model, every field of every collection (with editorial CMO verdicts and module-level documentation), and a prioritized fix backlog.

**Severity tags:** `P0` blocker · `P1` should-fix · `P2` polish.
**Verdict tags:** `keep` · `keep-but-rework` · `move-to-<section>` · `rename` · `merge-with-<other>` · `remove` · `flag-for-product`.
**Finding ids:** `CR-NNN` cross-cutting · `MM-NNN` meta-model · `<COLL>-NNN` per-collection (e.g. `BLOG-014`) · `FIX-NNN` backlog.

---

## Table of contents

1. [Part 1 — Cross-cutting code review](#part-1--cross-cutting-code-review)
2. [Part 2 — Field-type & section model review](#part-2--field-type--section-model-review)
3. [Part 3 — Per-collection deep dive (per-module documentation)](#part-3--per-collection-deep-dive-per-module-documentation)
4. [Part 4 — Prioritized fix backlog](#part-4--prioritized-fix-backlog)

---

## Part 1 — Cross-cutting code review

#### Type safety & contract drift

### CR-001 [P1] `CmsFieldDefinition.defaultValue` typed too narrowly to model real defaults

- **File:** `src/lib/cms/collectionDefinitions.ts:36-46`
- **Observation:** `defaultValue` is typed `string | number | boolean`, but `buildDefaultDocumentValues()` (lines 1487-1507) seeds non-scalar defaults like `page_blocks: []`. Any future migration that wires `defaultValue` into the renderer would silently lose array/object defaults, and downstream consumers cannot trust the field shape.
- **Why it matters:** Two parallel default systems exist (`field.defaultValue` for `select` fallback in `FieldRenderer` line 534, and the unrelated `buildDefaultDocumentValues`), the bigger one is hand-maintained and not wired to the field schema.
- **Suggested fix:** Either delete `defaultValue` (only used as a `select` default at `page.tsx:534`) or widen the type to `unknown` and stop relying on the per-field constant for non-select types.
- **Risk if changed:** low

### CR-002 [P0] `parseFieldValue` silently drops invalid JSON and invalid blocks instead of surfacing the error

- **File:** `src/app/admin/cms/page.tsx:65-106` (esp. lines 73-78, 91-96)
- **Observation:** When the editor pastes malformed JSON or blocks, `parseFieldValue` returns `[]` / `undefined`. The save action then writes `undefined` (skipped) or the cleared array, and the redirect carries `saved=1` — the editor sees "Saved" while their JSON content was discarded.
- **Why it matters:** Data loss with no warning. A subtle typo in a `citations` JSON, `page_blocks`, `metricsHighlights`, etc. wipes the field on next save.
- **Suggested fix:** Bubble parse failures up to the save action so it can `redirect(...&error=invalid-json:fieldName)`; do not silently coerce to `[]`/`undefined`.
- **Risk if changed:** medium (touches save flow; need to make sure existing valid-but-quoted strings stay legal)

### CR-003 [P1] `parseBlogPost` / `parseGlossaryTerm` carry parallel "snake_case ↔ camelCase" aliases that the schema then duplicates

- **File:** `src/lib/cms/schemas/blog.ts:4-41`, `src/lib/cms/schemas/glossary.ts:4-31`
- **Observation:** Both schemas define `seo_title` and `seoTitle`, `featured_image` and `heroImageUrl`, `definition` and `definition_full`, etc. Then `parseBlogPost` does a manual `??` chain to merge them. The `CmsFieldDefinition` model and `collectionDefinitions.ts` only emits one canonical name (snake_case) per field, so the camelCase variants come from "legacy" Webflow imports the admin can no longer write.
- **Why it matters:** Two readers (`schemas/blog.ts`, `content/[collection]/[slug]/page.tsx:18-50`) hand-maintain alias lists. New SEO fields like `og_title` are emitted by the admin (`collectionDefinitions.ts:471`) but neither schema reads them, so they round-trip as orphans.
- **Suggested fix:** Define one canonical name per field in the schema, write a single `legacyAliasMap` in a shared util, and run incoming docs through it once at read time. Drop the alias drift from individual schemas.
- **Risk if changed:** medium (must keep import-era documents readable until backfill)

### CR-004 [P2] Schemas accept `status: 'draft' | 'published'` but Firestore stores 6 statuses

- **File:** `src/lib/cms/schemas/blog.ts:21`, `src/lib/cms/schemas/glossary.ts:15`, contrast with `src/lib/cms/collectionRepository.ts:13` and `src/app/admin/cms/page.tsx:386`
- **Observation:** `blogPostSchema.status` is `z.enum(['draft', 'published'])`, but `bulkUpdateCmsDocumentStatus` accepts `in_review`, `approved`, `scheduled`, `archived` too. Any blog with status `in_review` or `archived` will silently fail `parseBlogPost.safeParse` and `getBlogPostBySlug` returns null — the term/post becomes unreachable on the public site even though it's not yet "draft".
- **Why it matters:** A reviewer sets a post to `in_review`, the post disappears from the live site (correct) but also disappears from `getBlogPostBySlug` checks that the schema validates *before* the published gate at `blogRepository.ts:42`. Same shape, but the failure mode is subtle.
- **Suggested fix:** Widen the schema enum to the full status set; gate publishing only at `parsed.status !== 'published'` (already the check at line 42). Glossary same.
- **Risk if changed:** low

### CR-005 [P2] `CmsFieldType` union has `'json'` and `'blocks'` but `'json'` ends up storing arrays-of-objects identical to blocks

- **File:** `src/lib/cms/collectionDefinitions.ts:18-34` and uses at lines 167, 188, 332, 1039, 1101, 1280
- **Observation:** Many `json` fields (`faqItems`, `howToSteps`, `key_takeaways`, `metrics_highlights`, `agenda_items`, `keyStatistics`, `expertQuotes`, `citations`) are arrays of typed objects. They could either be modeled as nested blocks or dedicated typed-array fields with item schemas. Today they require editors to hand-write JSON and skip validation.
- **Why it matters:** Editors must hand-author JSON with no schema help; `parseFieldValue` for `json` swallows errors (CR-002).
- **Suggested fix:** Introduce a `repeatable` field type with a per-item field set, like `blocks` but flat, or have an explicit `json_items_schema` so the editor can render a real form. Long-term, deprecate `json` for known-shape arrays.
- **Risk if changed:** medium

#### Duplication

### CR-006 [P1] Title-resolution logic duplicated in 4 places, drifting between them

- **File:** `src/lib/cms/collectionRepository.ts:48-60`, `src/app/content/[collection]/[slug]/page.tsx:18-50`, `src/lib/cms/collectionDefinitions.ts:1392-1403` (`NORMALIZED_TITLE_FIELD_BY_COLLECTION`), and inferred from `definition.titleField`
- **Observation:** Each location has its own list of "title-bearing" field names: collectionRepository's `referenceOptionLabel` falls back to `name` only for `team_members`, content/page.tsx hand-codes 13 fields, the definitions file has its own override map, and the admin sidebar/page reads `definition.titleField` directly. They are not in sync (e.g. content/page.tsx tries `topic_name` but the definition only stores `topic_name` if the collection key matched in NORMALIZED_TITLE_FIELD_BY_COLLECTION).
- **Why it matters:** Adding a new collection or renaming a title field requires changes in 4 files; missing one yields "Untitled" in some UI but real titles in others.
- **Suggested fix:** Single helper `resolveDocumentTitle(definition, doc, fallback)` in `collectionDefinitions.ts` (or `collectionRepository.ts`) consumed by all four call sites. Remove `NORMALIZED_TITLE_FIELD_BY_COLLECTION` once each definition declares `titleField` correctly.
- **Risk if changed:** low

### CR-007 [P1] Three separate listing-query fallback chains in `collectionRepository.ts`

- **File:** `src/lib/cms/collectionRepository.ts:131-140`, `:177-186`, `:471-481`
- **Observation:** `listCmsDocuments`, `listCmsMediaLibraryItems`, and `listReferenceOptions` each implement the same `try orderBy('updatedAt') → catch → try orderBy(slugField) → catch → fall through` pattern. Three copies of the same try/catch ladder.
- **Why it matters:** Bug fixes (e.g. adding pagination, supporting deleted docs, status filters) need to be replicated three times.
- **Suggested fix:** Extract `safeOrderedQuery(db, collection, slugField, limit)` and have all three sites call it.
- **Risk if changed:** low

### CR-008 [P1] Reference-options pre-loaded eagerly for every reference target plus `BLOCKS_REFERENCED_COLLECTIONS`

- **File:** `src/app/admin/cms/page.tsx:139-146`, `:1000-1029`
- **Observation:** Even when editing a document with no `multi_reference` to, say, `customer_reviews`, the page eagerly fetches up to 200 customer reviews because `BLOCKS_REFERENCED_COLLECTIONS` is a static union of every collection any block can reference. Six extra Firestore queries on every editor open.
- **Why it matters:** Performance + cost. Each reference list is up to 200 documents and three separate Firestore queries (the fallback ladder above).
- **Suggested fix:** Compute the actual block-referenced collections from `CMS_BLOCK_TYPES` at module init; only prefetch reference options for collections that the document's blocks actually contain (or load them lazily when the picker opens).
- **Risk if changed:** low–medium (block picker would need to fetch on demand)

### CR-009 [P1] Stringify/parse pair (`stringifyFieldValue` ↔ `parseFieldValue`) duplicates per-type rules in both directions

- **File:** `src/app/admin/cms/page.tsx:65-127`
- **Observation:** Type-specific serialization is split between two functions with no shared registry. Any new field type (e.g. `time`, `color`) requires edits in both. They also disagree subtly: `stringifyFieldValue('boolean', 1)` returns `'true'` but `parseFieldValue('boolean', 'true')` returns `true` (correct), while `parseFieldValue('boolean', 'TRUE')` returns `true` and `stringifyFieldValue('boolean', 'TRUE')` returns `'false'` (case-sensitive comparison missing in stringify).
- **Why it matters:** Data round-trips can lose values (boolean cast above) and additions are error-prone.
- **Suggested fix:** Build `FIELD_CODECS: Record<CmsFieldType, { encode, decode }>`; `stringifyFieldValue`/`parseFieldValue` become two-line wrappers.
- **Risk if changed:** medium

#### Correctness

### CR-010 [P0] Slug uniqueness is never enforced — a save with an existing slug silently overwrites the sibling document

- **File:** `src/lib/cms/collectionRepository.ts:380-422`, `src/app/admin/cms/page.tsx:275-353`
- **Observation:** `upsertCmsDocument` blindly `set({...payload}, { merge: true })` on `db.collection(collection).doc(id)`. The save action passes `id = slug` (line 344). If two editors create different blog posts and pick the same slug, the second save merges into the first and data is destroyed.
- **Why it matters:** Silent data loss with no audit trail (the revision is the previous-version of the *overwritten* doc, not of the would-be new one). On import-from-Webflow with hand-edited slugs this is very likely.
- **Suggested fix:** In create flow (`cmsIntent === 'create'`), `await db.collection.doc(slug).get()` first, redirect with `error=slug-taken` if it exists. Add a unique index check in `upsertCmsDocument` when `previous.exists === false` — refuse rather than overwrite a doc with a different `createdAt`.
- **Risk if changed:** low

### CR-011 [P1] Missing-required redirects in the save action lose all the editor's other field input

- **File:** `src/app/admin/cms/page.tsx:294-312`
- **Observation:** When `field.required` is missing, the action calls `redirect(...&error=missing-${field.name})`. The redirect is a server-side 302 to the editor URL; the form's other fields (the editor just spent 20 minutes filling) are not preserved — the editor reloads from the last saved Firestore doc.
- **Why it matters:** Painful UX for new entries: typing 800 words then hitting Save without filling a small required field reloads the editor to the last saved (or empty) state, discarding all in-progress unsaved input. No Firestore data that was previously persisted is affected — this is loss of in-flight unsaved work only. Revisions are not written since the document was never saved.
- **Suggested fix:** Persist the in-flight payload to a draft doc *before* validating required fields; OR keep the editor on the page (return validation errors) by switching from a redirect-based save to client-side fetch + validation. Short-term, validate required fields client-side first.
- **Risk if changed:** medium

### CR-012 [P1] `scheduledAt` form field is a string, but `upsertCmsDocument` parses it as `new Date(string)` only when it is already a string — admin form posts `scheduledAt` as form-data string, so OK; but `payload.scheduledAt` from the form save action is *also* a string, and the action never validates it

- **File:** `src/app/admin/cms/page.tsx:335-336`, `src/lib/cms/collectionRepository.ts:399-403`
- **Observation:** The action does `if (scheduledAt) payload.scheduledAt = scheduledAt`, then `upsertCmsDocument` does `typeof payload.scheduledAt === 'string' ? new Date(...) : payload.scheduledAt`. An invalid string like `2026-13-99` becomes `Invalid Date` → `Number.isFinite(time) === false` → `scheduledAt = null` is written, silently. The editor sees their schedule disappear.
- **Why it matters:** Editors believe an item is scheduled when it has been silently un-scheduled. Public render path keys on `scheduledAt` (`content/[collection]/[slug]/page.tsx:230-235`) so the doc never goes live.
- **Suggested fix:** Parse + validate `scheduledAt` in the action, redirect with `error=invalid-schedule` if invalid. Reject statuses of `scheduled` without a future `scheduledAt`.
- **Risk if changed:** low

### CR-013 [P1] Status precedence accepts a `formStatus` from the `status` <select> that the page never renders for users

- **File:** `src/app/admin/cms/page.tsx:316-329`
- **Observation:** The fallback chain is `requestedStatus` (button) → `formStatus` (`<select name="status">`) → `cmsCurrentStatus` (hidden) → `'draft'`. The admin no longer renders a `status` select in `primaryPublishFields` (it is filtered out at line 864). But blocks-section nested fields named `status` would conflict; more importantly, manual API/JS callers can post any `status` and it sticks even though no UI exists for them.
- **Why it matters:** Surface-area concern; it works correctly today but couples the action to a phantom field.
- **Suggested fix:** Drop `formStatus` from the precedence list; only accept `requestedStatus` (button) and fall back to `cmsCurrentStatus`.
- **Risk if changed:** low

### CR-014 [P1] Datetime fields lose timezone information and can shift by hours

- **File:** `src/app/admin/cms/page.tsx:119-123` and submission via `<input type="datetime-local">`
- **Observation:** `stringifyFieldValue` for `datetime` does `value.toISOString().slice(0, 16)` — that strips the timezone and casts to UTC. The browser's `datetime-local` input then interprets that string as *local* time, not UTC. So a publish_date saved as `2026-01-01T08:00Z` is shown to a Dubai editor as `08:00` local on next edit — they save it back, and we record `04:00Z`. Drift on every save.
- **Why it matters:** Schedule fields and `publish_date` slowly walk through timezones across edits.
- **Suggested fix:** Either (a) display dates in UTC explicitly with a label, or (b) convert ISO → local in stringify and local → ISO on parse.
- **Risk if changed:** medium (existing dates may shift on first re-save after fix)

### CR-015 [P1] `parseFieldValue('reference', '')` returns `''`, which gets stored as `payload[name] = ''`

- **File:** `src/app/admin/cms/page.tsx:98`, `:308-311`
- **Observation:** When a user clears the reference dropdown to "Select reference" (empty value), `parseFieldValue` returns `raw.trim()` which is `''`. The save action checks `value === ''` and treats it as "missing" only if the field is required. For optional refs, `''` is *not* equal to undefined, so `payload[name] = ''` overwrites a previously-set reference with an empty string — and the public render path looks for `typeof X === 'string' && X` and sees a falsey empty.
- **Why it matters:** Empty strings pollute Firestore docs; some downstream queries are `where(field, '==', truthyId)` which still works, but it makes Firestore queries on `where(field, '!=', null)` find documents with `''`.
- **Suggested fix:** For `reference`, return `undefined` when raw is empty; for optional refs, delete the key entirely.
- **Risk if changed:** low

### CR-016 [P1] `multi_reference` parsing CSV-splits the `reference` value, but the form posts checkboxes (not CSV) and the parser path is unreachable for the actual UI

- **File:** `src/app/admin/cms/page.tsx:99-104`, `:300-305`
- **Observation:** `parseFieldValue('multi_reference', raw)` exists but the save action handles multi_reference *first* via `formData.getAll(field.name)` and skips the parser (`continue`). The CSV-split branch in `parseFieldValue` is dead. Worse, the only consumer of CSV-formatted multi-reference values is the legacy import path that no longer exists, and `stringifyFieldValue` always emits CSV.
- **Why it matters:** Dead branch confuses readers; if anyone bypasses the multi_reference fast path they'd silently CSV-parse an array.
- **Suggested fix:** Delete the multi_reference branch in `parseFieldValue` and the CSV emit branch in `stringifyFieldValue`; use a `string[]` round-trip via the dedicated picker only.
- **Risk if changed:** low

### CR-017 [P1] `cmsOriginalSlug` is read but never used to prevent slug collisions on rename

- **File:** `src/app/admin/cms/page.tsx:288-296`, `:344`
- **Observation:** The action reads `cmsOriginalSlug` to compute the redirect URL, but on slug change (`slug !== cmsOriginalSlug`) it writes a *new* doc at `slug` and never deletes the old `cmsOriginalSlug` doc. Old slug stays live (and indexed), new slug appears, references to the old slug break.
- **Why it matters:** Silent fork: editors think they've renamed; they've actually duplicated.
- **Suggested fix:** When `cmsOriginalSlug && cmsOriginalSlug !== slug`, delete the old doc, also rewrite incoming-reference fields (or add a redirect doc). At minimum, refuse the rename and require explicit "duplicate" or "delete & recreate" action.
- **Risk if changed:** medium

### CR-018 [P2] `referenceOptionLabel` falls back to `name` for `team_members` only, not for any other collection that imports legacy data

- **File:** `src/lib/cms/collectionRepository.ts:48-60`
- **Observation:** Only `team_members` checks `normalized.name`. Other collections with legacy fields (e.g. `our_customers.companyName`, `tools.name`, `customer_reviews.title`) listed in `LEGACY_FIELDS_BY_COLLECTION` would render as their slug instead of their human name in the reference picker.
- **Why it matters:** Pickers show `/some-slug` instead of `Acme Corp` for legacy-imported docs.
- **Suggested fix:** Use the full `LEGACY_FIELDS_BY_COLLECTION` list (or a smaller `LEGACY_TITLE_FIELDS_BY_COLLECTION`) as a fallback chain for every collection, not just `team_members`.
- **Risk if changed:** low

### CR-019 [P1] `persistMediaAssetUpload` accepts video/document MIMEs but `uploadCmsMediaBytes` rejects them

- **File:** `src/lib/cms/persistMediaAssetUpload.ts:70-80`, `:122-124`; `src/lib/cms/storageUpload.ts:6-12`, `:62-65`
- **Observation:** `inferUploadedMediaAssetType` returns `'video' | 'document'` for non-image MIMEs, and the upload route accepts them. But `uploadCmsMediaBytes.ALLOWED_MIME` is image-only — it throws "Unsupported type" for any video or PDF. Net: editors can drop a PDF, get past the route validation, and hit a generic 400 "Unsupported type" from the storage layer.
- **Why it matters:** Mismatched contract between two layers. The advertised "PNG, JPG, GIF, WebP, SVG" UI text in `CmsMediaLibrary.tsx:177` matches the storage layer; persistMediaAssetUpload's wider acceptance is unreachable noise.
- **Suggested fix:** Either expand `storageUpload.ALLOWED_MIME` to include the doc/video types persistMediaAssetUpload claims to handle, or trim `persistMediaAssetUpload` down to images only and remove `DOCUMENT_MIME_TYPES`.
- **Risk if changed:** low

### CR-020 [P2] `CMS_MEDIA_UPLOAD_MAX_BYTES = 50 MB` but UI says 25 MB

- **File:** `src/lib/cms/persistMediaAssetUpload.ts:6`, `src/components/cms/admin/CmsMediaLibrary.tsx:177`
- **Observation:** Backend enforces 50 MB, dropzone hint says "max 25 MB per file". Files between 25–50 MB upload successfully, file >50 MB fails with a clear message — only the hint is wrong.
- **Why it matters:** Editor confusion; mostly cosmetic.
- **Suggested fix:** Pick one limit and surface the constant from `persistMediaAssetUpload` to the UI text.
- **Risk if changed:** low

### CR-021 [P2] Boolean `defaultChecked` cast in `FieldRenderer` accepts only the string `'true'|'1'|'on'|'yes'`, but the source value could be a literal `true` boolean from Firestore

- **File:** `src/app/admin/cms/page.tsx:548-562`
- **Observation:** `value` arrives as a string from `stringifyFieldValue` so this works in practice. But if a future code path passes through (e.g. when the field comes from `buildDefaultDocumentValues` which sets `indexable: true` boolean), `value.toLowerCase()` would crash on a non-string. Defensive only.
- **Why it matters:** Latent crash if defaults flow change.
- **Suggested fix:** Coerce with `String(value)` first, or accept `boolean | string` cleanly.
- **Risk if changed:** low

#### Performance

### CR-022 [P1] Editor open performs an unbounded N+1 read over media assets just to populate URL `<datalist>`

- **File:** `src/app/admin/cms/page.tsx:1039-1047`
- **Observation:** On every editor open (`isEditorView`), the page first lists 150 media documents (`listCmsDocuments('media_assets', 'title', 'slug')`), then runs `await Promise.all(mediaAssets.slice(0, 120).map(async (asset) => getCmsDocument('media_assets', asset.id)))` — that is 120 individual document reads, just to extract `assetUrl` from each. The list step already returns `id, slug, title, status, updatedAt` but not `assetUrl`, so the editor *re-reads each document* sequentially.
- **Why it matters:** 120 parallel Firestore reads on every editor open — slow and expensive. With 1k assets this scales linearly because `listCmsMediaLibraryItems` already returns assetUrl in one read.
- **Suggested fix:** Replace the N+1 chain with a single call to `listCmsMediaLibraryItems(120)` (which returns `assetUrl` directly) and map to URLs.
- **Risk if changed:** low

### CR-023 [P1] `listCmsDocuments` and `listReferenceOptions` cap silently at 150–200 with no UI affordance and no pagination

- **File:** `src/lib/cms/collectionRepository.ts:122-153`, `:463-490`
- **Observation:** The list view shows the first 150 items; the reference picker shows 200. Once a collection grows past these numbers, items vanish from pickers and from the table without any "load more" or warning. `listAllPublishedBlogSlugsWithDates` paginates correctly, but admin reads do not.
- **Why it matters:** At 200+ blog posts, the picker silently stops listing them; editors think they were deleted.
- **Suggested fix:** Add cursor pagination with at-least a "showing first N" footer in the table; for pickers, switch to remote search via a route handler (the picker already has a search box).
- **Risk if changed:** medium

### CR-024 [P1] Six independent reference-list queries fan out on every editor open, ignoring whether the document uses them

- **File:** `src/app/admin/cms/page.tsx:1001-1003`, `:1023`
- **Observation:** `BLOCKS_REFERENCED_COLLECTIONS` plus the field-level reference targets are unioned, then every collection in the union is queried. For a glossary term (which never embeds blocks like `logo_wall` referencing `our_customers`) this is 5+ wasted queries.
- **Why it matters:** Cost + latency on every editor open. Cumulatively material for editorial throughput.
- **Suggested fix:** See CR-008. Compute referenced collections from the doc's actual `page_blocks` content, not from a global static union.
- **Risk if changed:** low–medium

### CR-025 [P1] The CMS admin page renders 1,708 lines as one server component re-rendered on every search-param change

- **File:** `src/app/admin/cms/page.tsx` (entire file)
- **Observation:** `export const dynamic = 'force-dynamic'`, so every keystroke that changes a query param (e.g. switching collections) re-runs the full server pipeline: `getCmsCollectionItemCounts()` (count() on every collection in parallel), all reference lists, all media reads (CR-022), revisions, reverse refs.
- **Why it matters:** Cold latency and cost; every navigation rebuilds a 25k+ token render. The shell (sidebar, filters) and the editor are coupled into one render.
- **Suggested fix:** Split into a layout (sidebar + counts, cached with `cacheTag`) plus per-route page; lazy-load reference options on demand. Move long-running queries into `Suspense` boundaries with `loading.tsx`.
- **Risk if changed:** medium–high (architectural)

### CR-026 [P2] `getCmsCollectionItemCounts` does 15 parallel `count()` calls on every page load including the editor view

- **File:** `src/lib/cms/collectionRepository.ts:105-120`, called unconditionally at `page.tsx:1021`
- **Observation:** The sidebar count badges fetch 15 `.count()` aggregations on every render, even when the editor is open and the sidebar isn't visible on small screens.
- **Why it matters:** 15 Firestore aggregations per page nav.
- **Suggested fix:** Cache via `unstable_cache`/`cacheTag` keyed per collection, invalidated by save/delete actions; or move counts into the sidebar-only layout (see CR-025).
- **Risk if changed:** low

### CR-027 [P2] `bulkUpdateCmsDocumentStatus` and `bulkDeleteCmsDocuments` are sequential, not batched

- **File:** `src/lib/cms/collectionRepository.ts:241-271`, `:320-345`
- **Observation:** Each id is processed inside a serial `for` loop with separate `get()` and `set()` per document plus a separate revision write each. A bulk publish of 50 items is ~150 round-trips.
- **Why it matters:** Slow; could time out on large selections.
- **Suggested fix:** Use `db.batch()` with chunks of 500; parallelise revision writes.
- **Risk if changed:** low

#### Accessibility

### CR-028 [P1] CMS settings tabs use the `peer-checked`/`group-has-[#id:checked]` CSS pattern with no ARIA `tablist`/`role=tab`

- **File:** `src/app/admin/cms/page.tsx:1424-1469`
- **Observation:** The four sidebar tabs (Publish/SEO/AEO/GEO) are radio inputs with visually-hidden `sr-only` and labels styled to look like tabs. They have no `role="tablist"`, `role="tab"`, `aria-selected`, or `tabpanel` association — a screen reader hears "radio button group" with cryptic ids.
- **Why it matters:** SR users cannot navigate the editor's right-pane settings.
- **Suggested fix:** Convert to a proper `role="tablist"` with `role="tab"` + `aria-controls`/`aria-selected`. Or commit to the radio model and hide the labels' visual styling instead.
- **Risk if changed:** medium (cross-cuts the tabs UI)

### CR-029 [P1] RichTextField uses `window.prompt` for link/image insertion — fails on touch devices and not screen-reader-friendly

- **File:** `src/components/cms/admin/RichTextField.tsx:153-187`
- **Observation:** "Link", "Image", "Video link" buttons all invoke `window.prompt(message, 'https://')` to ask for the URL. `window.prompt` is unreliable on iOS Safari, blocked by some focus-visible flows, and presents a system dialog with no accessible label.
- **Why it matters:** Editors on iPad cannot insert links; SR users get a system prompt that does not announce the editor's context.
- **Suggested fix:** Replace with an inline modal/popover using `<dialog>` or a Radix-style accessible dialog with proper focus management.
- **Risk if changed:** medium (UI change for editors)

### CR-030 [P1] PageBlocksEditor uses absolute-positioned div as a modal-like picker without `role="dialog"`, focus trap, or ESC-to-close

- **File:** `src/components/cms/admin/PageBlocksEditor.tsx:360-384`
- **Observation:** Clicking "+ Add block" opens an `absolute z-30` div listing block types. No focus trap, ESC does not close, clicking outside does not close, no `role="menu"` / `role="listbox"`.
- **Why it matters:** Keyboard users tab into the document below the floating menu; SR users hear nothing announce the menu.
- **Suggested fix:** Use a Headless UI / Radix Popover or a `<dialog>` with focus trap and outside-click handler.
- **Risk if changed:** low

### CR-031 [P1] CMS sidebar search and reference-pick search lack keyboard shortcut and live region for results count

- **File:** `src/components/cms/admin/CmsMultiReferencePick.tsx:54-91`, `src/components/cms/admin/CmsCollectionItemTable.tsx:282-295`
- **Observation:** No `aria-live="polite"` on the result count; visible result-count exists in `CmsMediaLibrary` but not in others. Filter typing produces no audible feedback for SR users.
- **Why it matters:** Editors using SR get no feedback on whether their query is narrowing results.
- **Suggested fix:** Wrap the result-count `<p>` with `aria-live="polite"`; add `<span class="sr-only">N results</span>`.
- **Risk if changed:** low

### CR-032 [P2] Block-editor reorder controls use only "Move up / Move down" buttons — no drag, no keyboard reorder beyond two single-step buttons

- **File:** `src/components/cms/admin/PageBlocksEditor.tsx:181-198`
- **Observation:** Up/Down work but reordering 12 blocks to swap top/bottom is 11 clicks each direction. Keyboard users cannot drag.
- **Why it matters:** UX/accessibility for editors managing many blocks.
- **Suggested fix:** Add a "Move to position" input or an arrow-key reorder mode within a focused row.
- **Risk if changed:** low

#### Security & input handling

### CR-033 [P1] `sanitizeCmsHtml` whitelists `iframe` for YouTube/Vimeo but Tiptap/RichTextField never inserts iframes — and sanitize-html passes `class`/`id` through on **every** allowed tag

- **File:** `src/lib/cms/sanitize.ts:10-25`
- **Observation:** `sanitize-html` is configured at `src/lib/cms/sanitize.ts:10-25` with `allowedAttributes: { '*': ['class', 'id'] }` plus a global `class`/`id` allowlist that applies to every otherwise-allowed tag. While `<script>`, `<style>`, and other dangerous tags are correctly stripped (they are not in `allowedTags`), the wildcard means an attacker — or a careless paste from elsewhere — can inject arbitrary `class` or `id` values onto every accepted element. Combined with the `iframe` allowlist (lines 21-25), which is dead surface in normal authoring (`RichTextField.insertVideo` inserts a plain `<a>`, not `<iframe>`) but live surface for the raw-HTML source-mode editor, the blast radius is wider than it needs to be.
- **Why it matters:** Arbitrary `class`/`id` injection lets attackers latch onto any global CSS or JS that selects on class names; an injected class could trigger a Tailwind variant, a CSS animation, or a JS event handler that selects by class. The iframe whitelist is rarely exercised for normal editing and should be off unless source-mode authoring is a documented product requirement.
- **Suggested fix:** Tighten `allowedAttributes` to a per-tag map — e.g. `'a': ['href', 'title', 'target', 'rel']`, `'img': ['src', 'alt', 'width', 'height']`, `'td'/'th': ['colspan', 'rowspan']` — and remove the `'*': ['class', 'id']` wildcard, or constrain it to a specific safelisted prefix (e.g. `prose-*` only). Disable the `iframe` whitelist unless source-mode HTML authoring is a confirmed product requirement.
- **Risk if changed:** medium (the wildcard relaxation is safe to remove; the iframe disablement could break authors who currently embed YouTube/Vimeo via raw HTML — confirm with the content team before enabling)

### CR-034 [P1] `storageUpload.uploadCmsMediaBytes` does not verify file content matches the declared MIME

- **File:** `src/lib/cms/storageUpload.ts:55-93`
- **Observation:** The MIME comes straight from `params.contentType` (which the route reads from `file.type`, browser-controlled). A user can rename `evil.exe` to `evil.png` and curl the upload route; the storage SDK accepts any bytes with `Content-Type: image/png`.
- **Why it matters:** Server hosts arbitrary bytes under a token URL with cache-control 1 year. Malicious payloads could be served from the project's Firebase domain.
- **Suggested fix:** Sniff the magic bytes server-side (e.g. `file-type` package) and reject when sniffed type doesn't match declared. At least check the first bytes against PNG/JPEG/WEBP/SVG signatures.
- **Risk if changed:** low

### CR-035 [P1] `storageUpload.uploadCmsMediaBytes` does not validate SVG content for embedded scripts

- **File:** `src/lib/cms/storageUpload.ts:6-12`
- **Observation:** SVG is in the allowlist but unsanitized SVGs can contain `<script>`, `onload`, or external `xlink:href`. Stored at a Firebase URL with `cacheControl: public,max-age=31536000`, served as `image/svg+xml`.
- **Why it matters:** Stored XSS via SVG when the URL is opened directly or embedded with `<img src>` (most renderers don't execute, but iframe/object embeds do).
- **Suggested fix:** Sanitize SVGs server-side (e.g. DOMPurify in Node, or strip scripts/foreignObject) before upload; or remove SVG from the allowlist and link external SVG via URL field.
- **Risk if changed:** low

### CR-036 [P1] No middleware-level admin perimeter — auth is per-page only

- **File:** `src/lib/cms/adminAuth.ts:171-185`; absence of `middleware.ts`
- **Observation:** Every admin page calls `requireAdminAuth` individually. There is no `middleware.ts` enforcing auth at the routing layer. A new admin route added without `requireAdminAuth` would be public by default (existing-route audit may already have gaps; e.g. the `/api/admin/cms/media/upload` route handler does check, but a future contributor could forget).
- **Why it matters:** Defense-in-depth; one missed `requireAdminAuth` call ships unauthenticated.
- **Suggested fix:** Add `middleware.ts` (Next.js 15) with a matcher `'/admin/:path*'` that gates with `getCurrentSession()`. Pages still call `requireAdminAuth` for role enforcement.
- **Risk if changed:** medium

### CR-037 [P1] Legacy env-auth path uses SHA-256 of the password directly — no salt, no PBKDF2 — and is still wired in

- **File:** `src/lib/cms/adminAuth.ts:24-43`, `:220-228`
- **Observation:** When `CMS_ADMIN_PASSWORD` / `CMS_EDITOR_PASSWORD` env vars are set, the action computes `sha256(password)` for comparison. SHA-256 is fast; an attacker who reads any leaked env-var dump can offline-crack low-entropy passwords trivially. The repository has the proper PBKDF2 path already in `usersRepository.ts` for db-backed users — env path remained for first-time bootstrap.
- **Why it matters:** Operationally still a real auth method (`isLegacyEnvAuthEnabled()` returns true whenever the env vars exist), and the bootstrap script may be left enabled in production.
- **Suggested fix:** After the first `cms_users` doc exists, refuse env-auth (already gated indirectly via `isAdminAuthConfigured`, but the gate is "any env var set", not "no users yet"). Alternatively store env-auth password as an already-hashed PBKDF2 string in env.
- **Risk if changed:** medium (deployment-flow change)

### CR-038 [P2] Session cookie HMAC uses `getSessionSalt()` which falls back to a hard-coded string when `CMS_ADMIN_SESSION_SECRET` is unset

- **File:** `src/lib/cms/adminAuth.ts:36-38`
- **Observation:** If the env var is unset, the default `'finanshels-cms-admin'` becomes the HMAC key — well-known if anyone reads this repo, allowing forging of any session cookie with a known userId/tokenVersion.
- **Why it matters:** Critical in development; in production it should refuse to start.
- **Suggested fix:** Throw at startup when `CMS_ADMIN_SESSION_SECRET` is missing in production (`NODE_ENV === 'production'`).
- **Risk if changed:** low

### CR-039 [P2] `revalidatePath('/sitemap.xml', '/llms.txt', ...)` is invoked on every save with no rate limiting

- **File:** `src/app/admin/cms/page.tsx:265-273`, `:349-351`
- **Observation:** Every CMS save fires `revalidatePath` on 3+ static targets including `/sitemap.xml`. A noisy bulk-publish of 50 items triggers 150+ revalidations.
- **Why it matters:** Cost, and a malicious actor with editor credentials can DOS the cache.
- **Suggested fix:** Coalesce sitemap/llms revalidations into a single tag (`revalidateTag('cms-sitemap')`) and revalidate the tag, not the path.
- **Risk if changed:** low

#### Maintainability

### CR-040 [P1] `src/app/admin/cms/page.tsx` is 1,708 lines mixing nine concerns

- **File:** `src/app/admin/cms/page.tsx`
- **Observation:** The single file holds: type adapters (parse/stringify), seven server actions, a sidebar component, a field renderer, three section renderers, status styling, SEO/AEO/GEO checklist computation + rendering, and the page composition. No tests cover it.
- **Why it matters:** Diff readability, merge conflicts, and onboarding time. PR reviewers cannot reason about a single concern in isolation.
- **Suggested fix:** Decompose into `app/admin/cms/_actions.ts` (server actions), `app/admin/cms/_components/FieldRenderer.tsx`, `_components/EditorChecklist.tsx`, `_components/CmsSidebar.tsx`, etc. Co-locate types in `app/admin/cms/_types.ts`.
- **Risk if changed:** medium

### CR-041 [P1] `collectionDefinitions.ts` is 1,508 lines — 15 collection literals plus 9 helper builders, no dedicated tests

- **File:** `src/lib/cms/collectionDefinitions.ts`
- **Observation:** The single file contains every collection's publish fields, every block type, every relationship descriptor, the universal field builders, the field-merge logic, and the legacy-strip lists. Edits routinely touch unrelated lines.
- **Why it matters:** Same risks as CR-040; plus the "Frontend-vs-admin gap" findings below show fields are added here without ever being read on the frontend, suggesting no review coupling between them.
- **Suggested fix:** Split into `cms/definitions/blocks.ts`, `cms/definitions/relationships.ts`, `cms/definitions/sections.ts` (universal sections), one file per collection's publish fields. Add a small JSON snapshot test that pins the field list per collection so accidental drift surfaces in PR review.
- **Risk if changed:** low

### CR-042 [P2] Dead exports leak into the public surface of `lib/cms`

- **File:** `src/lib/cms/persistMediaAssetUpload.ts:66-68` (`inferUploadedImageMime` — only declares same return as `inferUploadedMediaMime`, no caller); `src/lib/cms/adminAuth.ts:166-169` (`getAdminRole` — no caller anywhere)
- **Observation:** Unused exports drift over time; they signal "supported APIs" to readers and make refactors heavier.
- **Suggested fix:** Delete `inferUploadedImageMime` and `getAdminRole`. Add a CI check (e.g. `ts-prune`) to flag dead exports.
- **Risk if changed:** low

### CR-043 [P2] Inconsistent naming: `seo_title` vs `seoTitle`, `og_image` vs `ogImageUrl`, `definition_full` vs `bodyHtml`, `companyName` vs `company_name`

- **File:** `src/lib/cms/collectionDefinitions.ts:467-505`, `:421-431`, plus collection-level fields throughout
- **Observation:** The universal SEO section uses snake_case (`seo_title`, `og_image`); the AEO section adds camelCase (`focusKeyword`, `seoTitle`, `ogImageUrl`); blog publish has `seo_title` and `seoTitle` both. The render code (`content/[collection]/[slug]/page.tsx:18-50`) reads both. There is no single style guide.
- **Why it matters:** Editors guess which key they're filling; future contributors don't know which to add when introducing a new SEO field.
- **Suggested fix:** Pick snake_case (the dominant style), rename camelCase fields, and write a one-shot Firestore migration to rename keys.
- **Risk if changed:** medium

### CR-044 [P2] `CmsCollectionItemTable.statusStyle` and `editorStatusStyle` (in page.tsx) and `statusDot` (in ReverseReferencesPanel) are three separate maps of the same data

- **File:** `src/components/cms/admin/CmsCollectionItemTable.tsx:37-44`, `src/app/admin/cms/page.tsx:235-242`, `src/components/cms/admin/ReverseReferencesPanel.tsx:9-16`
- **Observation:** Three slightly-different status→color mappings, with subtly different label casing.
- **Why it matters:** Visual drift; adding a new status (e.g. `archived`) means three edits.
- **Suggested fix:** Centralize in `cms/admin/statusStyle.ts` with one helper returning `{ dot, box, label }` for any status.
- **Risk if changed:** low

### CR-045 [P2] `LEGACY_FIELDS_BY_COLLECTION` and `STRIP_PUBLISH_FIELDS_BY_COLLECTION` are two adjacent maps with overlapping intent

- **File:** `src/lib/cms/collectionDefinitions.ts:1405-1424`
- **Observation:** Both lists hide fields from the publish section. `LEGACY_FIELDS_BY_COLLECTION` also feeds title fallbacks (theoretically, see CR-018) and `STRIP_PUBLISH_FIELDS_BY_COLLECTION` is a dedicated UI-strip list. Confusing dual-purpose.
- **Why it matters:** Understanding "why is this field hidden?" requires reading both maps; future contributors edit the wrong one.
- **Suggested fix:** Merge into `HIDDEN_FIELDS_BY_COLLECTION: { strip: string[]; legacyAliases: string[] }` with explicit roles.
- **Risk if changed:** low

#### Frontend-vs-admin gap

> Verified by `grep -rln "<field>" src/app src/components` excluding `admin/`. A field is flagged only when no public reader is found.

### CR-046 [P1] All Open Graph admin fields (`ogTitle`, `ogDescription`, `twitterCardType`, `twitterCreatorHandle`, `robotsMeta`) are unread on the public site

- **File:** `src/lib/cms/collectionDefinitions.ts:421-432` (defined); verified absent in `src/app`/`src/components` (excluding admin).
- **Observation:** The seo subsection contributes camelCase OG fields. The actual content render path at `src/app/content/[collection]/[slug]/page.tsx:200-219` reads only `og_image`/`ogImageUrl` and `noindex`/`indexable`/`robotsMeta`. `ogTitle`, `ogDescription`, `twitterCardType`, `twitterCreatorHandle` and the `robots` `robots.meta` flag never reach `<meta>` tags.
- **Why it matters:** Editors fill these believing they affect social previews. They don't.
- **Suggested fix:** Either wire them into `generateMetadata` (`og:title`, `og:description`, `twitter:card`, `twitter:creator`) or remove them from the admin to reduce noise.
- **Risk if changed:** low

### CR-047 [P1] All AEO fields (`directAnswer`, `answerSnippet`, `howToSteps`, `speakableContent`) are unread

- **File:** `src/lib/cms/collectionDefinitions.ts:537-569` (defined); only `faqItems` is read at `content/[collection]/[slug]/page.tsx:237-254`.
- **Observation:** `directAnswer`, `answerSnippet`, `howToSteps`, `speakableContent` have no consumer. They are stored in Firestore but never emitted to JSON-LD or visible content.
- **Why it matters:** AEO score in the editor sidebar awards points for fields that have zero SEO/AEO impact.
- **Suggested fix:** Wire `directAnswer`/`answerSnippet` into `<meta name="description">` fallback or a Schema.org `Question`/`Answer`; render `howToSteps` as `HowTo` JSON-LD; render `speakableContent` as `Speakable` schema. Or remove if unused.
- **Risk if changed:** low

### CR-048 [P1] All GEO fields (`geoSummary`, `sourceUrls`, `geoContentType`, `lastUpdatedDate`, `citations`, `keyStatistics`, `expertQuotes`, `relatedEntities`) are unread

- **File:** `src/lib/cms/collectionDefinitions.ts:572-622` (defined); zero results in non-admin grep.
- **Observation:** A whole GEO section worth of editor labor with no rendering.
- **Why it matters:** Same issue as CR-047 — editors are graded on data that never ships.
- **Suggested fix:** Render `citations` as Article/CreativeWork `citation` schema; emit `keyStatistics` and `expertQuotes` as visible cards; or remove the GEO section entirely until consumers exist.
- **Risk if changed:** low

### CR-049 [P1] Universal Card section (`card_title`, `card_description`, `card_image`, `card_label`, `card_cta_label`, `card_cta_link`, `card_icon`) — five of seven fields have zero public consumers

- **File:** `src/lib/cms/collectionDefinitions.ts:629-641` (defined); used at `src/components/cms/admin/CardPreview.tsx:59-65`. Listing pages `src/app/blog/page.tsx`, `src/app/glossary/page.tsx`, and the listing renders inside `BlogCard.tsx`/`GlossaryCard.tsx` use `post.title`/`post.excerpt`/`featured_image` directly.
- **Observation:** The `card_*` fields (defined in the universal Card section of `collectionDefinitions.ts`) are mostly orphan editor inputs. The listing components `BlogCard.tsx` and `GlossaryCard.tsx` and the `/blog`, `/glossary` index pages do not read any `card_*` field. The generic content route at `src/app/content/[collection]/[slug]/page.tsx` reads `card_description` (line 56, as a description fallback for `<meta>`) and `card_image` (line 202, as the OpenGraph image fallback) — but `card_title`, `card_label`, `card_cta_label`, `card_cta_link`, and `card_icon` have **zero** public consumers anywhere in `src/app` or `src/components`.
- **Why it matters:** Editors invest in card data expecting it to appear on listing pages, but only the generic-route metadata fallbacks consume two of the seven fields (`card_description` and `card_image`). The remaining five fields (`card_title`, `card_label`, `card_cta_label`, `card_cta_link`, `card_icon`) are fully dead — the editorial labor never ships.
- **Suggested fix:** For `card_description` and `card_image`: keep, and (separately, in a Pass-2 backlog item) wire `BlogCard.tsx` / `GlossaryCard.tsx` / the dedicated route templates to prefer them over `excerpt` / `featured_image_url`. For `card_title`, `card_label`, `card_cta_label`, `card_cta_link`, `card_icon`: remove them, OR commit to wiring them into listing components in a follow-up. Document the chosen path in Part 4.
- **Risk if changed:** low (the five removed fields are not consumed anywhere; the two kept fields preserve current behavior)

### CR-050 [P1] Universal Listing section (16 fields including `listing_hero_heading`, `listing_search_enabled`, `listing_filter_facets`, `listing_layout`, `listing_pagination_style`, `listing_sticky_cta_*`, etc.) is unread

- **File:** `src/lib/cms/collectionDefinitions.ts:647-690` (defined); zero results in non-admin grep.
- **Observation:** None of the listing-page configuration is consumed. `/blog`, `/glossary` and the future `/[collection]` listings hard-code their hero, search, and layout in their `page.tsx`.
- **Why it matters:** 16 admin fields × 15 collections = 240 form inputs of dead config.
- **Suggested fix:** Either implement a generic listing renderer that reads these fields from the collection's *settings* doc (currently per-doc, which is conceptually wrong — these are collection-wide fields), or remove the section. Recommend: hoist listing config to a per-collection settings doc, not per-document.
- **Risk if changed:** medium

### CR-051 [P1] Universal Detail section (12 fields including `detail_breadcrumbs_enabled`, `detail_metadata_row_enabled`, `detail_social_share_*`, `detail_sticky_side_cta_*`, `detail_lead_capture_*`, `detail_template_variant`) is unread

- **File:** `src/lib/cms/collectionDefinitions.ts:698-734` (defined); zero results in non-admin grep.
- **Observation:** Same shape as CR-050. Detail pages at `/blog/[slug]`, `/glossary/[slug]`, `/content/[collection]/[slug]` do not branch on these flags.
- **Why it matters:** "Should this detail page show breadcrumbs?" controlled by `detail_breadcrumbs_enabled` is ignored — every detail page renders identically regardless.
- **Suggested fix:** Implement these in the generic detail renderer (`src/app/content/[collection]/[slug]/page.tsx`) and the bespoke `/blog/[slug]`, `/glossary/[slug]` routes; or remove from the admin.
- **Risk if changed:** medium

### CR-052 [P1] Blog publish fields `blog_tags`, `blog_category`, `reading_time`, `table_of_contents_enabled`, `featured_post`, `lead_magnet_cta` are unread

- **File:** `src/lib/cms/collectionDefinitions.ts:976-983` (defined); verified zero non-admin readers.
- **Observation:** None of the blog-specific structural fields are consumed by `/blog/[slug]/page.tsx` or `BlogCard.tsx`. The blog post page renders `title`, `excerpt`, `body`, `author`, `publishedAt`, `featured_image` only.
- **Why it matters:** Editors believe `featured_post` flags it for the home page; it does not. `reading_time` is hand-entered with no public render.
- **Suggested fix:** Either render them (e.g. `featured_post` filters the home highlight, `reading_time` shows in the header, `table_of_contents_enabled` toggles a TOC component) or remove them.
- **Risk if changed:** low

### CR-053 [P1] Glossary publish fields `term_category`, `alphabet_letter`, `synonyms`, `example_usage`, `applicability_region`, `featured` are unread

- **File:** `src/lib/cms/collectionDefinitions.ts:1003-1012` (defined); verified zero non-admin readers.
- **Observation:** The glossary detail page (`/glossary/[slug]/page.tsx`) reads only `term`, `definition`, `bodyHtml`. The listing reads only `term`, `slug`, `definition`. Six fields are unrendered.
- **Why it matters:** Same pattern as CR-052 — editorial labor without rendering.
- **Suggested fix:** Render `synonyms` near the term heading, `example_usage` as a styled block, `applicability_region` as a tag chip; or remove.
- **Risk if changed:** low

### CR-054 [P1] Relationship multi-references (`relatedFaqRefs`, `relatedToolRefs`, `relatedVideoRefs`, `relatedPodcastRefs`, `relatedEbookRefs`, `relatedWebinarRefs`, `relatedPostRefs`, `relatedGlossaryRefs`, `heroImageAssetRef`) are written by the admin but unread on the public site

- **File:** `src/lib/cms/collectionDefinitions.ts:810-924` (defined); verified zero non-admin readers.
- **Observation:** The admin's reverse-references panel (`ReverseReferencesPanel.tsx`) shows them in the editor, but no public template renders related-content blocks driven by these fields. The `related_content` block (`PageBlocksRenderer.tsx:312`) returns `null`.
- **Why it matters:** "Related posts" and "related glossary" exist as data but never appear on rendered pages.
- **Suggested fix:** Implement a `RelatedContent` component consumed by the detail render that follows these refs and renders cards (using the universal Card section once CR-049 is wired). Until then, the data is dark.
- **Risk if changed:** medium

### CR-055 [P2] `breadcrumbs_title`, `faq_schema_enabled`, `schema_type`, `schema_type_override` — only `schema_type[_override]` is read; `breadcrumbs_title` and `faq_schema_enabled` are unread

- **File:** `src/lib/cms/collectionDefinitions.ts:500-503`, `:741-779` (schema_type_override is read at `content/[collection]/[slug]/page.tsx:67`)
- **Observation:** Schema type override flows correctly. `breadcrumbs_title` and `faq_schema_enabled` are not consumed (FAQPage schema is gated only on `faqItems.length > 0`, ignoring the boolean toggle).
- **Why it matters:** The toggle implies "enable FAQ schema rendering" but it has no effect — schema renders whenever `faqItems` has content.
- **Suggested fix:** Either wire `faq_schema_enabled` as a guard, or remove it. Render `breadcrumbs_title` when present.
- **Risk if changed:** low

### CR-056 [P2] `tags`, `categories`, `cta_label`, `cta_link`, `sort_order`, `published_at`, `updated_at`, `short_description` from the universal core are mostly unread on the public site

- **File:** `src/lib/cms/collectionDefinitions.ts:436-462` (defined); searched for non-admin readers — `short_description` is read in `content/[collection]/[slug]/page.tsx:58-64` for description fallback, others not.
- **Observation:** `cta_label`/`cta_link`, `published_at`/`updated_at` (the snake_case ones), `tags`, `categories`, `sort_order` are not read in the public render. Note `published_at` distinct from `publishedAt` (camelCase, written by `upsertCmsDocument` at line 417 server-side); the snake_case admin field is therefore decorative.
- **Why it matters:** Editors fill `published_at` thinking it controls the live publish timestamp — but `upsertCmsDocument` overwrites with server `now` when status flips to published.
- **Suggested fix:** Drop `published_at`/`updated_at` from the user-editable core fields; document that `publishedAt` is server-controlled. Wire `tags`/`categories` into listing filters or remove.
- **Risk if changed:** low

#### Part 1 summary

| Severity | Count |
|----------|-------|
| P0 | 2 |
| P1 | 38 |
| P2 | 16 |
| **Total** | **56** |

---

## Part 2 — Field-type & section model review

### Field-type review

The CMS meta-model declares 16 `CmsFieldType` values. Counting every field definition across all collection publish sections, the 7 universal section functions (card, listing, detail, blocks, seo, aeo, geo), and the 15 `CMS_BLOCK_TYPES` reveals a heavily skewed distribution.

**Types that pull their weight.** `text` (100 instances total), `textarea` (54), `select` (41), `url` (33), `boolean` (31), `tags` (29), `number` (19), `json` (18), `multi_reference` (18), `image` (16), and `reference` (14) all appear across many collections and serve distinct purposes that justify their places in the type system.

**Types with overlap or identity ambiguity.** `image` and `url` carry semantic tension: `og_image` (type `image`) and `ogImageUrl` (type `url`) exist in the same merged SEO section storing what is conceptually the same datum — a URL to an image. The `image` type is UI-differentiated (triggers an image picker with `<datalist>`) while `url` is plain text input; but three OG/card image pairs now store duplicate data. Similarly, `email` (1 instance: `team_members.email`) is behaviorally identical to `text` in the current renderer — it renders as `<input type="text">` with no email-specific validation (see the `FieldRenderer` in `page.tsx`). Unless the renderer is updated to emit `<input type="email">` with browser validation, `email` adds a type that looks distinctive but behaves identically to `text`.

**Types used zero or once.** `file` appears once (`ebooks.file_upload`, `collectionDefinitions.ts:1308`) and `email` appears once (`team_members.email`, line 1377). Neither has special handling in `parseFieldValue` beyond a text fallback. `blocks` appears exactly once (`page_blocks`) and is correct — it should remain a singleton. `icon` appears 4 times (2 collection publish fields + 1 card field + 1 relations block field) and currently has a dedicated picker path in the renderer, making it narrowly justified.

**The `json` problem.** 18 json-typed fields across collection sections (plus 6 more in block definitions, totalling 24) represent the most editorial-friction type in the model. Editors must hand-author structured arrays — `faqItems`, `howToSteps`, `key_takeaways`, `metrics_highlights`, `agenda_items`, `citations`, `keyStatistics`, `expertQuotes`, `primary_inputs`, `benefits`, `manualRefs`, `data` (table), `items` (stats, faq_accordion, timeline) — with no schema validation, no form UI, and silent data-loss on parse failure (see CR-002). This is not a type problem per se but it is the type with the worst editor experience / data-reliability ratio in the model.

#### Field-type usage matrix

| Type | # fields (all contexts) | # fields (publish sections only) | Example fields | Verdict |
|------|------------------------|----------------------------------|----------------|---------|
| text | 100 | 54 | `title`, `slug`, `blog_category`, `full_name`, `question` | keep |
| textarea | 54 | 31 | `excerpt`, `body`, `definition_full`, `episode_summary` | keep |
| select | 41 | 24 | `status`, `language`, `tool_type`, `schema_type` | keep |
| url | 33 | 13 | `website_url`, `audio_url`, `cta_link`, `ogImageUrl` | keep-but-rework — consolidate duplicate OG/card image url vs image pairs (see MM-001) |
| boolean | 31 | 17 | `featured`, `gated`, `indexable`, `display_as_author` | keep |
| tags | 29 | 18 | `blog_tags`, `synonyms`, `key_topics`, `seoKeywords` | keep |
| number | 19 | 13 | `rating`, `sort_order`, `episode_number`, `byteSize` | keep |
| json | 18 | 6 | `faqItems`, `metrics_highlights`, `agenda_items`, `citations` | keep-but-rework — introduce `repeatable` type for known-shape arrays (see MM-002) |
| multi_reference | 18 | 15 | `relatedPostRefs`, `speakers`, `relatedGlossaryRefs` | keep |
| image | 16 | 12 | `featured_image`, `logo`, `cover_image`, `og_image` | keep-but-rework — consolidate OG/card image duplicates (see MM-001) |
| reference | 14 | 11 | `author`, `faq_topic`, `customerRef`, `company` | keep |
| datetime | 9 | 7 | `publish_date`, `start_datetime`, `last_synced_at` | keep |
| icon | 4 | 2 | `icon` (tools), `icon` (faq_topics), `card_icon` | keep — narrowly used but picker behavior is distinct |
| file | 1 | 1 | `ebooks.file_upload` | keep — only one use; renderer needs dedicated handling (see MM-003) |
| email | 1 | 1 | `team_members.email` | consolidate-with-text — no renderer differentiation today (see MM-004) |
| blocks | 1 | 1 | `page_blocks` | keep — correctly a singleton |

---

### Section review

The 9 `CmsSectionKey` values divide editor concerns into: core publishing (`publish`), listing-page card appearance (`card`), collection-index configuration (`listing`), detail-page configuration (`detail`), page-builder (`blocks`), cross-collection relationships (`relations`), search-engine metadata (`seo`), answer-engine optimisation (`aeo`), and generative-engine optimisation (`geo`).

**The section taxonomy has three structural problems.**

First, the `aeo` section mislabels its content. The `seo` section is the merge of `globalSeoFields` (12 fields) and `commonSeoFields` (12 more, all camelCase duplicates — see CR-043 and MM-005), producing 24 fields. The `aeo` section is the merge of `globalContentLayoutFields` (7 fields: `hero_heading`, `hero_subheading`, `body`, `sections`, `sidebar_cta_enabled`, `primary_cta_variant`, `template_variant`) with `commonAeoFields` (5 fields: `directAnswer`, `faqItems`, `answerSnippet`, `howToSteps`, `speakableContent`). The first 7 fields are content-layout controls with no AEO relationship; shipping them under the "AEO" tab teaches editors to associate hero heading with answer-engine optimisation, which is incorrect.

Second, the `listing` and `detail` sections are 100% dead across all 15 collections (see CR-050, CR-051). The 16-field `listing` section and the 14-field `detail` section are universally applied but have zero public consumers, inflating every editor session by 30 unread fields. Together they account for 450 form inputs (30 fields × 15 collections) that do nothing.

Third, the `seo` section is bloated by the snake_case vs. camelCase duplication. `seo_title`/`seoTitle`, `canonical_url`/`canonicalUrl`, `og_image`/`ogImageUrl` (with differing types: `image` vs. `url`) all coexist in the same section, giving editors two inputs for each concept with no guidance on which to fill (see CR-043 and MM-005). Effective unique concepts in the SEO section: 18, not 24.

**AEO and GEO sections.** Cross-referencing Part 1 (CR-047, CR-048): `directAnswer`, `answerSnippet`, `howToSteps`, `speakableContent`, `geoSummary`, `sourceUrls`, `geoContentType`, `lastUpdatedDate`, `citations`, `keyStatistics`, `expertQuotes`, and `relatedEntities` are all unread on the public site. The checklists and scores shown in the editor sidebar are calculated from fields that have zero rendering effect. Until consumers exist, both sections should be hidden or collapsed by default (see MM-006, MM-007).

**The `relations` section** is appropriately scoped — 0 to 5 relation fields per collection — and serves a clear purpose (the reverse-reference picker panel). Its fields are technically unread on the public site today (CR-054) but the infrastructure is correct; the gap is in the rendering layer, not the meta-model.

#### Section utilization

| Section | Fields per collection | Collections with 6+ fields | Public consumers exist? | Verdict |
|---------|----------------------|---------------------------|------------------------|---------|
| publish | 21–33 (varies) | 15 / 15 | Yes — core content fields | keep |
| card | 9 (universal) | 15 / 15 | Partial — 2/9 fields read (see CR-049) | keep-but-shrink — remove 5 unread fields (card_title, card_label, card_cta_label, card_cta_link, card_icon) until listing components consume them |
| listing | 16 (universal) | 15 / 15 | No — 0/16 fields read (CR-050) | flag-for-product — hide from editor or implement generic listing renderer |
| detail | 14 (universal) | 15 / 15 | No — 0/14 fields read (CR-051) | flag-for-product — hide from editor or implement in detail routes |
| blocks | 2 (universal) | 15 / 15 | Yes — `page_blocks` rendered by `PageBlocksRenderer`, `schema_type_override` read | keep |
| relations | 0–5 (varies) | 5 / 15 | No (data written, rendering unimplemented — CR-054) | keep — model is correct; rendering is the gap |
| seo | 24 (universal) | 15 / 15 | Partial — indexable/noindex/og_image/canonical_url consumed; OG camelCase fields not (CR-046) | keep-but-shrink — collapse to 12 canonical fields by removing duplicate camelCase set (see MM-005) |
| aeo | 12 (universal) | 15 / 15 | Partial — faqItems only (CR-047) | keep-but-rework — split content-layout fields into publish; rename remaining 5 fields section (see MM-006) |
| geo | 8 (universal) | 15 / 15 | No — 0/8 fields read (CR-048) | flag-for-product — hide until GEO rendering is implemented (see MM-007) |

---

### Block catalogue review

All 15 blocks defined in `CMS_BLOCK_TYPES` (`collectionDefinitions.ts:89-336`) have a `case` branch in `PageBlocksRenderer.tsx`. However, "having a case" does not mean "properly rendered." The switch at `PageBlocksRenderer.tsx:275-319` reveals three quality tiers:

**Tier 1 — Fully implemented (dedicated component, uses block-specific fields):** `hero` (HeroBlock, 10 fields rendered), `rich_text` (ArticleBody with sanitize, 1 field), `cta` (CtaBlock, 4 fields), `testimonial` (TestimonialBlock, 3 fields), `faq_accordion` (FaqAccordionBlock, items+heading), `stats` (StatsBlock, items+heading), `logo_wall` (LogoWallBlock, logos+heading), `video_embed` (VideoEmbedBlock, iframe embed), `download` (DownloadBlock, 5 fields), `table` (TableBlock, headers+rows), `timeline` (TimelineBlock, items). **11 of 15 blocks are properly implemented.**

**Tier 2 — Stub (CtaBlock used as a stand-in, most fields silently ignored):** `tool_embed` (line 299) extracts only `toolUrl` and passes it as `primaryUrl` to `CtaBlock` — the `heading`, `description`, and `toolRef` fields are discarded. `form` (line 301) passes the block directly to `CtaBlock` — `formId`, `submitLabel`, and `embedUrl` are never read. `speaker` (lines 304-309) renders `CtaBlock` with a hardcoded heading "Featured speakers", discarding `memberRefs` entirely. **3 blocks render as generic CTAs regardless of their content.**

**Tier 3 — Null (block present in the editor but renders nothing):** `related_content` (line 312) returns `null`. Its 5 fields (`heading`, `mode`, `maxItems`, `sourceCollections`, `manualRefs`) are stored in Firestore but produce no output. This corroborates CR-054.

#### Block utilization

| Block | Renderer tier | Key fields rendered | Fields ignored by renderer | Verdict |
|-------|--------------|---------------------|---------------------------|---------|
| hero | Tier 1 — full | eyebrow, heading, subheading, imageUrl, ctaLabel, ctaUrl | secondaryCtaLabel, secondaryCtaUrl, variant | keep — add secondary CTA and variant support |
| rich_text | Tier 1 — full | html (sanitized) | — | keep |
| cta | Tier 1 — full | heading, subheading, primaryLabel, primaryUrl | secondaryLabel, secondaryUrl, tone | keep — add secondary + tone |
| testimonial | Tier 1 — full | quote, authorName, authorRole, companyName | authorImageUrl, logoUrl, reviewRef | keep — add image/logo support |
| faq_accordion | Tier 1 — full | heading, items (JSON) | subheading, questionRefs | keep — add questionRefs fallback |
| stats | Tier 1 — full | heading, items (JSON) | — | keep |
| logo_wall | Tier 1 — full | heading, logos (JSON) | customerRefs | keep — add customerRefs fallback |
| video_embed | Tier 1 — full | videoUrl, caption | videoRef | keep |
| download | Tier 1 — full | heading, description, fileUrl, coverImageUrl | gated, formId | keep — add gate logic |
| table | Tier 1 — full | heading, data (JSON headers+rows) | — | keep |
| timeline | Tier 1 — full | heading, items (JSON) | — | keep |
| tool_embed | Tier 2 — stub | toolUrl → CtaBlock primaryUrl only | heading, description, toolRef | keep-but-rework — implement ToolEmbedBlock (see MM-008) |
| form | Tier 2 — stub | block passed as CtaBlock | formId, submitLabel, embedUrl | keep-but-rework — implement FormBlock (see MM-008) |
| speaker | Tier 2 — stub | hardcoded heading only | memberRefs, heading | keep-but-rework — implement SpeakerBlock (see MM-008) |
| related_content | Tier 3 — null | nothing | all 5 fields | flag-for-product — implement or remove (see MM-009; corroborates CR-054) |

---

### MM-001 [P1] `image` and `url` types both represent image URLs, creating duplicate fields in the SEO section

- **File:** `src/lib/cms/collectionDefinitions.ts:423` (`ogImageUrl`, type `url`) and `:473` (`og_image`, type `image`) — both in the merged SEO section served to all 15 collections.
- **Observation:** The SEO section contains `og_image` (type `image`, snake_case, in `globalSeoFields`) and `ogImageUrl` (type `url`, camelCase, in `commonSeoFields`). Similarly `card_image` (type `image`) and `card_cta_link` (type `url`) exist alongside each other in the card section. Editors see two OG image inputs with different UI controls (image picker vs. plain URL box); downstream `generateMetadata` reads `og_image` from the snake_case path only. `ogImageUrl` stores a URL that is never consumed.
- **Why it matters:** Editorial confusion about which input is canonical; potential for `og_image` and `ogImageUrl` to diverge silently across documents. The public site reads `og_image` only (`content/[collection]/[slug]/page.tsx:202`) so any data in `ogImageUrl` is already dead.
- **Suggested fix:** Remove `ogImageUrl` from `commonSeoFields`; keep `og_image` (type `image`) as the single OG image field. Apply the same dedup logic to the canonical-URL pair (`canonical_url` / `canonicalUrl`) and the SEO-title pair (`seo_title` / `seoTitle`) — see MM-005 for the full SEO dedup.
- **Risk if changed:** low — `ogImageUrl` is unread; removing it from the form only.

### MM-002 [P1] The `json` type is overloaded for typed arrays and should be replaced by a `repeatable` sub-type for known-shape items

- **File:** `src/lib/cms/collectionDefinitions.ts:18-34` (type declaration) and fields at lines 549, 558, 575, 599, 606, 612, 982, 1039, 1101, 1103, 1280, 1349.
- **Observation:** 12 of the 18 `json`-typed fields in collection sections (plus 6 in block definitions) store arrays of typed objects with fixed schemas: `faqItems` (question+answer), `howToSteps` (title+description), `key_takeaways` (string[]), `metrics_highlights` (label+value), `agenda_items` (string[]), `citations` (title+url+publisher), `keyStatistics` (stat+source), `expertQuotes` (quote+name+role), `primary_inputs` (tool-schema), `benefits` (string[]), `manualRefs` (collection+id), and the block-level `items` fields (stats, faq_accordion, timeline). Editors must hand-author JSON with no validation and are silently cleared on parse error (CR-002).
- **Why it matters:** The `json` type is the highest-friction, highest-data-loss-risk type in the model. Every one of these arrays has a known item shape that could be captured in a typed sub-schema.
- **Suggested fix:** Add `repeatable` to `CmsFieldType` (or a `itemSchema` property on `CmsFieldDefinition`) so the editor renders a form-based repeater UI. Migrate the 12 known-shape json fields to `repeatable` with inline item field definitions. Keep bare `json` only for truly freeform cases (the `sections` legacy field at line 512, if retained).
- **Risk if changed:** medium — requires a new editor component and data migration path; existing documents' JSON values remain valid as the backing data format.

### MM-003 [P1] The `file` type (1 instance) has no dedicated renderer in `FieldRenderer`, falling back to text

- **File:** `src/lib/cms/collectionDefinitions.ts:1308` (`ebooks.file_upload`, type `file`); `src/app/admin/cms/page.tsx` `FieldRenderer` (no `file` case found).
- **Observation:** `file` is a declared `CmsFieldType` used once for `ebooks.file_upload`. The `FieldRenderer` switch in `page.tsx` does not have a dedicated `case 'file'` — it falls to the default `<input type="text">`. Editors cannot browse or upload a file; they must paste a URL. Meanwhile the media library (`CmsMediaLibrary.tsx`) handles file uploads correctly but is only accessible via the `image` type picker.
- **Why it matters:** The `file` type advertises file-upload semantics but delivers a plain text box. The ebook download URL is a critical field — an editor who clicks this expecting a file picker sees only a text box with no affordance.
- **Suggested fix:** Either (a) add a `case 'file'` in `FieldRenderer` that opens the media library picker filtered to documents/PDFs, or (b) change `file_upload` to type `url` with a description pointing editors to the media library, and remove `file` from `CmsFieldType` until a real file-picker component exists.
- **Risk if changed:** low — currently falls back to text, so behavior after fix is strictly better.

### MM-004 [P2] The `email` type (1 instance) renders identically to `text` and provides no validation signal to editors

- **File:** `src/lib/cms/collectionDefinitions.ts:1377` (`team_members.email`, type `email`); `src/app/admin/cms/page.tsx` `FieldRenderer` — no `email` case.
- **Observation:** `email` is declared in the type union and used once. The `FieldRenderer` has no `case 'email'`; the field renders as `<input type="text">`. No format validation, no `type="email"` attribute, no `inputmode="email"`. The type signal exists in the schema but is invisible to both the renderer and the editor.
- **Why it matters:** Editors can save malformed email addresses with no warning. The team_member email is likely used in contact or authorship pages.
- **Suggested fix:** Option A — add `case 'email'` to `FieldRenderer` to emit `<input type="email" inputMode="email">` with client-side validation. Option B — consolidate `email` into `text` with a `validate: 'email'` annotation on the field definition and enforce it in the save action. Either way, the type should behave differently from `text`.
- **Risk if changed:** low.

### MM-005 [P1] The SEO section is inflated to 24 fields by duplicate snake_case + camelCase field pairs — editors face 3 paired inputs for the same concepts

- **File:** `src/lib/cms/collectionDefinitions.ts:414-504` (`globalSeoFields` + `commonSeoFields`); merged at line 1448 (`seo: mergeFieldSets(globalSeoFields(), commonSeoFields())`).
- **Observation:** The merged SEO section contains `seo_title` and `seoTitle` (same concept), `canonical_url` and `canonicalUrl` (same concept), `og_image` (type `image`) and `ogImageUrl` (type `url`) (same concept, different types). Six of the 24 SEO fields are duplicates. In addition `meta_description`/`seoDescription` and `og_title`/`ogTitle` and `og_description`/`ogDescription` are near-duplicates (same concept, different casing style). The public site reads only the snake_case variants.
- **Why it matters:** Editors fill either the snake_case or camelCase version — whichever appears first in the UI — and the other silently diverges. With 15 collections × 24 fields = 360 SEO editor inputs, roughly half are redundant. This is the single largest source of editor-visible noise in the model.
- **Suggested fix:** Delete `commonSeoFields()` as a standalone function. Fold the genuinely additive fields (`focusKeyword`, `secondaryKeywords`, `seoKeywords`, `twitterCardType`, `twitterCreatorHandle`, `robotsMeta`) into `globalSeoFields()` as new canonical snake_case entries. Remove the duplicates (`seoTitle`, `seoDescription`, `ogTitle`, `ogDescription`, `ogImageUrl`, `canonicalUrl`). Run a one-time Firestore migration to copy camelCase values to their snake_case keys where snake_case is null. Result: 18 SEO fields (down from 24), all snake_case.
- **Risk if changed:** medium — requires Firestore migration; any document with only the camelCase key set would temporarily lose its SEO data until migrated. Back up before running.

### MM-006 [P1] The `aeo` section mixes content-layout controls (7 fields) with AEO signals (5 fields) under a single mislabeled tab

- **File:** `src/lib/cms/collectionDefinitions.ts:507-569`; rendered at `src/app/admin/cms/page.tsx:1658-1659` as `'aeo'` / `'AEO Fields'`.
- **Observation:** `globalContentLayoutFields()` returns 7 fields (`hero_heading`, `hero_subheading`, `body`, `sections`, `sidebar_cta_enabled`, `primary_cta_variant`, `template_variant`) that control page layout and content. These are placed in the AEO section via `mergeFieldSets(globalContentLayoutFields(), commonAeoFields())`. None of these 7 fields have any relationship to answer-engine optimisation. Editors who fill them under the "AEO" tab believe they are affecting AEO signals; they are actually just setting hero content and template choices.
- **Why it matters:** Semantic mislabelling confuses the editor's mental model. AEO score/checklist in the sidebar does not reference any of the 7 content-layout fields (`page.tsx:1180-1186`), so editors could legitimately fill `directAnswer` in the AEO tab while `hero_heading` sits invisibly in the same tab and doesn't contribute to any checklist.
- **Suggested fix:** Move `globalContentLayoutFields()` to the `publish` section (or a new `content` section key). Keep the `aeo` section for the 5 genuine AEO signals only. Rename the tab label from "AEO Fields" to "AEO" (already done in the UI at line 1456) but align the data to match. If a `content` section is added as a new `CmsSectionKey`, it will require `getAllFields()` and the admin renderer to be updated.
- **Risk if changed:** medium — the section merge means existing documents have data stored against field names that would just move sections; no renaming required, only the admin grouping changes.

### MM-007 [P1] GEO section (8 fields) has zero public consumers — it should be hidden from editors until rendering exists

- **File:** `src/lib/cms/collectionDefinitions.ts:572-622`; rendered at `src/app/admin/cms/page.tsx:1690-1692`; zero non-admin readers (CR-048).
- **Observation:** All 8 GEO fields (`geoSummary`, `sourceUrls`, `geoContentType`, `lastUpdatedDate`, `citations`, `keyStatistics`, `expertQuotes`, `relatedEntities`) are stored in Firestore but never emitted to the public site. The GEO score/checklist shown in the editor sidebar at lines 1188-1199 rewards editors for filling fields that have no impact. Across 15 collections this is 120 form inputs (8 × 15) with no effect.
- **Why it matters:** Editors invest time in GEO content expecting LLM-optimization; the data is dark. The GEO checklist score is decorative noise. This is the exact same pattern as CR-048 (Part 1) but viewed from the meta-model perspective: the section exists, the fields are defined, the tab is rendered, but the consumer is missing.
- **Suggested fix:** Short-term: hide the GEO tab behind a feature flag (`NEXT_PUBLIC_CMS_GEO_ENABLED=false`) so editors do not fill data that does nothing. Medium-term: implement `citations` as `citation` JSON-LD on `Article` schema, `keyStatistics` and `expertQuotes` as visible body components, then re-enable the tab. If the product decision is to not pursue GEO, remove the section and drop the 8 fields from the schema.
- **Risk if changed:** low — hiding the tab does not affect Firestore data; any previously stored GEO values persist and become visible again when the tab is re-enabled.

### MM-008 [P1] Three block types (`tool_embed`, `form`, `speaker`) render as generic `CtaBlock` stubs, silently discarding all their unique fields

- **File:** `src/components/cms/PageBlocksRenderer.tsx:299-309` (the three stub cases).
- **Observation:** `tool_embed` (case line 299) extracts only `toolUrl` and passes it to `CtaBlock` as `primaryUrl`. The block's `heading`, `description`, and `toolRef` fields are discarded. `form` (line 301) passes the raw block to `CtaBlock`; `formId`, `submitLabel`, and `embedUrl` are never read by `CtaBlock`. `speaker` (lines 304-309) constructs a `CtaBlock` with a hardcoded heading `'Featured speakers'`, ignoring the block's own `heading` and discarding `memberRefs` entirely — no team member data appears. All three blocks are editable in the admin (editors fill unique fields) but the renderer ignores those fields.
- **Why it matters:** Editors who build tool-embed or speaker blocks are creating data that is not only unrendered but actively masked by a generic CTA. The output is misleading: the page appears to have a CTA where the editor intended a tool or a team-member card.
- **Suggested fix:** Implement `ToolEmbedBlock`, `FormBlock`, and `SpeakerBlock` components in `PageBlocksRenderer.tsx`. `ToolEmbedBlock` should render an iframe or link with heading/description. `FormBlock` should render the `embedUrl` in an iframe or `formId` as a hook. `SpeakerBlock` should follow `memberRefs` to render team-member cards (requires a data-fetch which may need a Server Component wrapper). Until proper implementations exist, consider rendering `null` rather than a misleading CTA stub — at least `null` signals an implementation gap rather than false content.
- **Risk if changed:** low for `null` path; medium for full implementation (SpeakerBlock requires async data fetch).

### MM-009 [P2] The `related_content` block returns `null` — 5 editor fields are stored but the block renders nothing on the public site

- **File:** `src/components/cms/PageBlocksRenderer.tsx:312` (`case 'related_content': return null`); block defined at `src/lib/cms/collectionDefinitions.ts:279-305`.
- **Observation:** The `related_content` block has 5 fields (`heading`, `mode`, `maxItems`, `sourceCollections`, `manualRefs`) and is the block-layer analogue of the relations section's multi-reference fields. Both are unimplemented on the public side (CR-054). The block case exists, the editor allows editors to configure it, but `null` is returned at render time — no output.
- **Why it matters:** Any page with a `related_content` block has an invisible hole where related cards should appear. It is the only block that guarantees a render gap regardless of content quality.
- **Suggested fix:** Either (a) implement a `RelatedContentBlock` server component that resolves `manualRefs` or auto-queries collections; or (b) remove the block type from `CMS_BLOCK_TYPES` so editors cannot add it until the renderer exists. Returning `null` is the worst outcome — it looks fine in the admin preview but silently produces no HTML.
- **Risk if changed:** low — removing it prevents future data entry; existing blocks stored in Firestore would need a migration to remove them or keep rendering null.

### MM-010 [P2] The `listing` and `detail` sections are universally applied to `media_assets`, which cannot have a listing or detail page in the conventional sense

- **File:** `src/lib/cms/collectionDefinitions.ts:1426-1453` (final assembly loop); `media_assets` definition at lines 931-955.
- **Observation:** `media_assets` is a utility collection (reusable image/video/document records). It has no `routePattern` or `listingRoute`. The final assembly loop at line 1426 applies `universalListingFields()` (16 fields) and `universalDetailFields()` (14 fields) to it identically to content collections like `blog_posts`. The media library admin renders these sections in the editor sidebar even though no `/media_assets` listing or `/media_assets/[slug]` detail page exists or is planned.
- **Why it matters:** 30 dead fields on every media asset editor open; the listing/detail sections in the sidebar are pure noise for the media library use case. This also means `buildDefaultDocumentValues()` seeds `detail_breadcrumbs_enabled: true` and `listing_search_enabled: true` on every new media asset — values that will never be read.
- **Suggested fix:** Add an `excludeSections?: CmsSectionKey[]` property to `BaseCollectionDefinition`, and set `excludeSections: ['listing', 'detail', 'card', 'blocks', 'aeo', 'geo']` for `media_assets`. The assembly loop skips those sections for excluded collections. Alternatively, give `media_assets` its own bespoke definition builder that does not call `universalListingFields`.
- **Risk if changed:** low — media_assets currently has listing/detail fields silently; removing them from the editor has no public-site impact.

### MM-011 [P2] The `blocks` section universally applies to all 15 collections including utility collections that will never use page blocks

- **File:** `src/lib/cms/collectionDefinitions.ts:1430` (`const blocksFields = universalBlocksFields(definition.defaultSchemaType)`); applies to `review_sources`, `customer_reviews`, `faq_questions`, `faq_topics`, `media_assets`.
- **Observation:** Collections like `review_sources` (a lookup table for G2/Clutch/Google review platforms), `customer_reviews` (testimonial snippets), `faq_questions` (Q&A pairs), and `faq_topics` (topic groups) are primarily used as reference targets in other collections or as data sources for blocks. They are unlikely to ever have page-builder blocks. Yet every document in these collections shows the full PageBlocksEditor and the `schema_type_override` select in the admin.
- **Why it matters:** Editor cognitive overhead; the PageBlocksEditor is the most complex component in the admin and adds visual weight to every editor for collections where blocks will never be used. The `schema_type_override` select for a `customer_review` (which already has a hardcoded `defaultSchemaType: 'Review'`) is particularly noisy.
- **Suggested fix:** As with MM-010, introduce `excludeSections` per collection. Collections whose sole purpose is as reference data (`review_sources`, `customer_reviews`, `faq_questions`, `faq_topics`) should exclude `blocks` (and likely `listing`, `detail`, `aeo`, `geo`) from their editor UI.
- **Risk if changed:** low — any page_blocks values in Firestore would persist; only the editor UI changes.

---

## Part 3 — Per-collection deep dive (per-module documentation)

<!-- TASK-4A -->
<!-- TASK-4B -->
<!-- TASK-4C -->

---

## Part 4 — Prioritized fix backlog

<!-- TASK-5 -->
