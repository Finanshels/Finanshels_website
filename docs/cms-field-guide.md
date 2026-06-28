# CMS field guide (engineer reference)

How CMS fields are defined, typed, encoded, and assembled into the editor. The authoritative field list per collection is **auto-generated**: see [cms/field-inventory.md](./cms/field-inventory.md). This guide explains the *system* behind it.

Source of truth: `src/lib/cms/collectionDefinitions.ts` (shapes) and `src/lib/cms/fieldCodec.ts` (encode/decode).

Related: [cms-firestore.md](./cms-firestore.md) (operations) · [cms/hidden-fields-audit.md](./cms/hidden-fields-audit.md) (what's hidden/dead).

---

## Field types

Every `CmsFieldType` has exactly one codec in `FIELD_CODECS` (`fieldCodec.ts`). Decode throws `InvalidFieldValueError(field, reason)` on bad input — it never silently drops a value.

| Type | UI | Stored in Firestore |
|---|---|---|
| `text` | Single-line input | string |
| `textarea` | Plain textarea, or **rich text** (Tiptap) when the field is a long-form body | string (sanitized HTML for rich text) |
| `number` | Number input (`min` enforced) | number |
| `boolean` | Checkbox | boolean |
| `datetime` | `datetime-local` | normalized timestamp |
| `email` | Email input | string |
| `url` | URL input | string |
| `image` / `file` | URL input with inline upload to `/api/admin/cms/media/upload`; datalist suggestions from Media | string (URL) |
| `icon` | Text input | string — a **Lucide** key (kebab-case, e.g. `arrow-right`) **or** an `https://` image URL |
| `tags` | Comma-separated text | string[] (split on save) |
| `select` | Dropdown | string (one of `options`) |
| `multi_select` | Chip picker (capped by `maxItems`) | string[] of slugs from `options`; `optionLabels` maps slug → display name |
| `json` | Monospace textarea | parsed JSON object/array |
| `reference` | Dropdown of target document IDs | string (referenced doc id) |
| `multi_reference` | Searchable checkbox list | string[] of ids |
| `blocks` | Visual block editor | JSON array of block objects (`page_blocks`) |
| `rows` | One row per line, attributes split on `\|` | object[] typed by `rowFormat` (used by GEO citations/stats/quotes so writers never type JSON) |

HTML-bearing fields pass through `sanitize-html` (`src/lib/cms/sanitize.ts`) before storage — raw HTML never reaches Firestore.

---

## Editor layout

`src/app/admin/cms/page.tsx` splits each collection's fields into two columns:

- **Main editor (center):** the title + slug, any required / long-form rich-text bodies (the "primary" fields), then collapsible **Card / Listing / Detail / Page blocks / Relationships** groups.
- **Sidebar (right rail):** a **Publish** tab (metadata, references, flags, collection-specific fields) plus **SEO / AEO / GEO** tabs. A tab only appears when the collection actually has fields for it.

Status lives in the header **Save / Publish** controls (`EditorStatusControls`), not in any tab.

---

## Sections

A collection definition has nine sections (`CmsSectionKey`):

| Section | Purpose |
|---|---|
| `publish` | Identity, scheduling, references, flags, and collection-specific metadata |
| `card` | Listing-card overrides (`card_description`, `card_image`, `featured`, `sort_order`) |
| `listing` | Index-page config: hero, search, filters, sort, layout, pagination, sticky CTA |
| `detail` | Detail-page chrome: breadcrumbs, related-content, social share, template variant |
| `blocks` | `page_blocks` page builder + `schema_type_override` |
| `relations` | Typed outbound links to other collections |
| `seo` | Meta/OG/canonical/robots + schema hints |
| `aeo` | Answer-engine extras: direct answer, FAQ JSON, HowTo, speakable |
| `geo` | Generative-search signals: GEO summary, citations, statistics, quotes |

---

## How a collection's fields are assembled

Per collection, `collectionDefinitions.ts` builds the final sections by:

1. **Merge globals + override.** `publish` = `globalCoreFields()` ∪ `globalContentLayoutFields()` ∪ the collection's `publish` override (override wins by field name; new names are appended). The other sections come from the universal helpers (`universalCardFields`, `universalListingFields`, `universalDetailFields`, `universalBlocksFields`, `globalSeoFields`, `commonAeoFields`, `commonGeoFields`) and `relationshipFields`.
2. **Strip.** `HIDDEN_FIELDS_BY_COLLECTION[key]` lists `legacyAliases` (old field names from pre-migration docs) and `strip` (global fields that don't apply here). Both are removed from **every** section.
3. **Suppress sections.** `SUPPRESSED_SECTIONS_BY_COLLECTION[key]` drops whole sections (e.g. `media_assets` and `team_members` keep only `publish`; `blog_posts` drops `card`/`listing`/`detail`).
4. **Curate schema options.** `SCHEMA_OVERRIDE_OPTIONS_BY_COLLECTION[key]` narrows the `schema_type_override` dropdown to the types that fit; absent collections fall back to the full catalogue.

> A field can therefore be **hidden in one collection but live in another**. Removing a globally-defined field affects every collection that still shows it — see [cms/hidden-fields-audit.md](./cms/hidden-fields-audit.md) before deleting one.

`getAllFields(definition)` returns every surviving field in stable section order; the save action uses it to know which keys to read from the form.

---

## Adding a field type

Three changes, atomic:

1. Add the literal to the `CmsFieldType` union in `collectionDefinitions.ts`.
2. Add a `FIELD_CODECS` entry in `fieldCodec.ts` (both `encode` and `decode`; decode must throw `InvalidFieldValueError` on bad input).
3. Add a render branch in the admin form if the UI differs from `text` / `textarea`.

Then run `npm run typecheck` and regenerate the inventory:

```bash
npx tsx scripts/gen-field-inventory.mts > docs/cms/field-inventory.md
```

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Author dropdown only shows "Select reference" | No `team_members` documents, or Firestore not configured locally. Add a team member with `full_name`. |
| "Save does nothing" | Look for the **Saved · cache refreshed** pill in the header; errors surface there and in a red banner. Publishing is the green header button, not a tab. |
| Slug doesn't follow title | Slug auto-sync runs only when **creating** (`?intent=create`); editing keeps the slug until you change it. |
| A field I expected is missing from the form | It's stripped or its section is suppressed for that collection — check the two maps above, or [cms/field-inventory.md](./cms/field-inventory.md). |

---

## Code map

| Concern | File |
|---|---|
| Collection shapes & assembly | `src/lib/cms/collectionDefinitions.ts` |
| Field encode/decode | `src/lib/cms/fieldCodec.ts` |
| Admin layout & save | `src/app/admin/cms/page.tsx` |
| Header status controls | `src/components/cms/admin/EditorStatusControls.tsx` |
| Repository writes / revisions | `src/lib/cms/collectionRepository.ts` |
| Block catalog ↔ renderer | `CMS_BLOCK_TYPES` ↔ `src/components/cms/PageBlocksRenderer.tsx` |
| Incoming references | `src/lib/cms/definitions/incomingReferences.ts` |
| HTML sanitization | `src/lib/cms/sanitize.ts` |
| Field inventory generator | `scripts/gen-field-inventory.mts` |
