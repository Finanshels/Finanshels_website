# CMS rules

Project-specific invariants for the CMS layer. Read together with [docs/cms-firestore.md](../../docs/cms-firestore.md) and [docs/cms-field-guide.md](../../docs/cms-field-guide.md).

## Single source of truth

| Concern | File | Don't duplicate elsewhere |
|---|---|---|
| Collection shape | `src/lib/cms/collectionDefinitions.ts` | Don't inline field schemas in admin pages. |
| Field encode/decode | `src/lib/cms/fieldCodec.ts` | Don't `JSON.parse` form values directly. |
| Repository writes | `src/lib/cms/collectionRepository.ts` | Don't `getFirestore().collection(...).set(...)` elsewhere. |
| Block catalog | `CMS_BLOCK_TYPES` (in `collectionDefinitions.ts`) + `PageBlocksRenderer.tsx` | These two must stay in sync. |
| Incoming references | `src/lib/cms/definitions/incomingReferences.ts` (`CMS_INCOMING_REFERENCES`) | Reverse-reference panel reads from here. |
| Schemas (Zod) | `src/lib/cms/schemas/` (per collection) | Validation lives next to the schema. |

## Adding a CMS field type

Three places change **atomically**:

1. Add to the `CmsFieldType` union in `collectionDefinitions.ts`.
2. Add an entry in `FIELD_CODECS` inside `fieldCodec.ts` (both `encode` and `decode`).
3. Add a render branch in the admin form (if it has a UI different from `text`/`textarea`).

The decode function MUST throw `InvalidFieldValueError(fieldName, reason)` on bad input. Never return `undefined` for malformed data — that silently drops user input (FIX-001 precedent).

## Adding a CMS collection

1. Add the key to the `CmsCollectionKey` union.
2. Append a `CmsCollectionDefinition` with all 9 sections (`publish`, `card`, `listing`, `detail`, `blocks`, `relations`, `seo`, `aeo`, `geo`).
3. Set `routePattern` (e.g. `/<collection>/[slug]`) and `listingRoute` (e.g. `/<collection>`) — without these, revalidation silently misses.
4. Set `defaultSchemaType` (JSON-LD, e.g. `Article`, `DefinedTerm`).
5. Add Firestore composite indexes if you'll query `status` + ordering field. Update `firestore.indexes.json`.
6. If routed, the generic detail page at `src/app/content/[collection]/[slug]/page.tsx` already resolves it. No new page needed unless the layout differs.
7. Add cross-collection relationships via `CMS_INCOMING_REFERENCES` so reverse-reference panel works.

## Adding a page-builder block

1. Append to `CMS_BLOCK_TYPES` with the block's field schema.
2. Add a renderer branch in `src/components/cms/PageBlocksRenderer.tsx`.
3. If the block fetches data (e.g. `related_content`), the resolver lives in the renderer — keep it server-side.

## Workflow & status

Order: `draft → in_review → approved → scheduled → published`.

- `published` is the only status that renders on public routes.
- `draft` is admin-preview-only via the preview link.
- `scheduled` requires `scheduledAt` timestamp.
- `editor` role submits to `in_review`; `admin`/`owner` can approve/publish.

## Revisions

Every save to a CMS doc writes a snapshot to `/_revisions` subcollection. Rollback lives in the admin panel. Don't bypass `collectionRepository` for writes or you lose the revision trail.

## Sanitization

All HTML-bearing fields go through `sanitize-html` (see `src/lib/cms/sanitize.ts`). Adding a new HTML-bearing field type requires plugging into that sanitizer; raw HTML never reaches Firestore.

## Sort & filter

Universal listing fields handle this:

- `featured: boolean` + `sort_order: number` for hand-curated ordering.
- `tags`, `categories` arrays on every collection.
- Listing-page toggles: `enable_search`, `enable_filters`, `default_sort`, `items_per_page`.

Don't invent new sort fields — extend the universal ones.

## Card / listing / detail symmetry

Every collection ships with `card_*` / `listing_*` / `detail_*` fields. The frontend reads these directly — **don't reach into `title`/`excerpt` to invent card copy**. If you need a fallback, do it in the renderer, not by leaking title into a card slot.

## When you're done

1. `npm run typecheck`
2. If you added composite-index requirements: `npm run firebase:deploy`
3. Manual smoke: load `/admin/cms`, open the collection, save a doc, verify revalidation in dev.
