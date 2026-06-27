# Landing Page Studio — Design Spec

**Date:** 2026-06-27
**Status:** Draft for review
**Owner:** meet@finanshels.com
**Supersedes/extends:** [2026-05-14-landing-pages-design.md](./2026-05-14-landing-pages-design.md) (the original landing-page system this builds on)

---

## 1. North star

> A Finanshels marketer goes from blank to a **published, on-brand, conversion-ready** landing page in **under 10 minutes** — never seeing JSON, never pasting a raw URL, never writing copy from a blank box.

This spec turns the existing, functional-but-technical landing-page editor into the **Landing Page Studio**: a no-code, visual builder for the internal marketing team.

### Primary user

The **internal Finanshels marketing team** — brand-fluent, not engineers. Optimise for speed and polish. We are **not** building a multi-tenant builder for external clients in this scope (no per-tenant sandboxing).

### Success criteria

1. A marketer can build a complete page without ever editing JSON or pasting an image URL.
2. The marketer can **see** the page change as they edit (live preview), not in a separate tab.
3. A new page starts from a template or an AI draft — never an empty canvas.
4. Median build time for a standard lead-gen page drops to ≤ 10 minutes.
5. Zero regressions to the existing render, lead-capture, Zoho sync, conversion tracking, or SEO behaviour.

### Non-goals (YAGNI)

- External/client-facing multi-tenant builder.
- A full Webflow-style free-form canvas (arbitrary element nesting, custom CSS). We compose **fixed, on-brand section components** — that is a feature, not a limitation: it keeps every page on-brand and accessible.
- A/B testing UI (future).
- "Save as template" to Firestore (future; v1 templates are code-defined).
- Migrating the CMS `page_blocks` system. The Studio is the **landing-page** system only; the two stay separate (see §3).

---

## 2. Current state (what exists today)

The landing-page system is mature. We are upgrading the **authoring experience**, not the data model or the renderer.

| Layer | Location | State |
|---|---|---|
| Data model | [src/lib/landing-pages/types.ts](../../../src/lib/landing-pages/types.ts) | `LandingPageDoc` with `sections: LandingPageSection[]`, `theme`, `seo`, conversion + contact config. Solid. Keep. |
| Section catalog (SoT) | [src/lib/landing-pages/sectionCatalog.ts](../../../src/lib/landing-pages/sectionCatalog.ts) | 17 section types, each with `group`, `icon`, `defaultProps`, `fields: SectionFieldDef[]`. Repeatable content is `type: 'json'`. |
| Renderer | [src/components/landing-pages/LandingPageRenderer.tsx](../../../src/components/landing-pages/LandingPageRenderer.tsx) | **Pure, prop-driven, no `'use client'`, no async, no server-only data.** Maps `section.type` → component. Keep; one additive change in P2. |
| Section components | [src/components/landing-pages/sections/](../../../src/components/landing-pages/sections/) | Presentational; forms are client. Unchanged. |
| Editor | [src/components/cms/admin/landing-pages/LandingPageEditor.tsx](../../../src/components/cms/admin/landing-pages/LandingPageEditor.tsx) | Client component. `Content / Settings / SEO` tabs. Holds `EditorState`, posts `payload` JSON to a server action. Section list already supports drag-reorder, move ↑↓, duplicate, enable/disable. **This is what we rebuild.** |
| Repository | [src/lib/landing-pages/repository.ts](../../../src/lib/landing-pages/repository.ts) | `create/update/duplicate/listLandingPages`, `writeLead`, `listLeads`. Keep; small additions. |
| Media | [src/components/cms/admin/CmsMediaLibrary.tsx](../../../src/components/cms/admin/CmsMediaLibrary.tsx), [src/lib/cms/persistMediaAssetUpload.ts](../../../src/lib/cms/persistMediaAssetUpload.ts), `/api/admin/cms/media/upload`, `media_assets` collection | Working upload + library. Wrap into a picker. |
| AI router | [src/lib/cms/ai/models.ts](../../../src/lib/cms/ai/models.ts) | AI SDK v5, Vercel Gateway + Anthropic fallback, tiers `nano/standard/quality`, `resolveModel`, `isAiConfigured`. Reuse for drafting. |

### The four pains (user-confirmed, all in scope)

| Pain | Root cause | Fixed in |
|---|---|---|
| **Raw JSON fields** | Repeatable content (`bullets`, `items`, `logos`, `tiers`, `rows`) is `type: 'json'`, hand-edited as a JSON textarea | P1 |
| **No live preview** | Editor is a form; preview is a separate `/landing-pages/[slug]` tab | P2 |
| **Blank-page problem** | New pages start `sections: []` | P3 |
| **Image handling** | `image`/`url` fields render as plain text inputs | P1 |

---

## 3. Scope boundary: Studio vs. CMS page-blocks

There are **two** block systems and they remain independent:

- **Landing Page Studio** — `landing_pages` collection, `sectionCatalog.ts`, `LandingPageRenderer`. Conversion-optimised, noindex by default, lead capture + Zoho. **This spec.**
- **CMS page-blocks** — `CMS_BLOCK_TYPES` in `collectionDefinitions.ts`, `PageBlocksRenderer.tsx`, used inside blog/glossary/etc. detail pages. **Out of scope.**

We will **not** merge them. The structured-field primitives built in P1 (`repeater`, `image` picker, `icon` picker) are written to be reusable, so the CMS page-blocks editor *could* adopt them later — but that is a separate future effort, explicitly not in this plan.

---

## 4. The experience — a two-pane Studio

```
┌────────────────────────────────────────────────┬───────────────────────────┐
│ TOPBAR  ◀ Pages   "Corp Tax — Q3"   ● Draft     │  INSPECTOR                │
│         [💻 📱] width   ⤺ undo  ⤻ redo           │                           │
│         ✨ Draft with AI    Preview   Save  ▾Publish                         │
├────────────────────────────────────────────────┤  · no selection →         │
│ ┌────────────────────────────────────────────┐ │    Page: theme, contact,  │
│ │                                            │ │    section OUTLINE list   │
│ │   LIVE RENDERED PAGE  (iframe, real CSS)   │ │  · section selected →     │
│ │                                            │ │    structured fields:     │
│ │   ┌── hover: + Add section ──┐             │ │    repeaters, media,      │
│ │   │  Hero ........ [click] ──┼───────────► │ │    icon, color pickers,   │
│ │   └──────────────────────────┘             │ │    friendly validation    │
│ │   Trust bar                                │ │                           │
│ │   Feature grid  ← selected (outline+toolbar)│ │  [✨ Improve · per field] │
│ └────────────────────────────────────────────┘ │                           │
└────────────────────────────────────────────────┴───────────────────────────┘
```

### Core interactions

- **Click-to-edit**: click a section in the preview → inspector opens that section's fields; the section shows a selection outline + a floating toolbar (move ↑/↓, duplicate, hide, delete).
- **Hover sync** (both directions): hovering a row in the outline highlights it in the preview; hovering a section in the preview highlights its outline row.
- **Add section**: a `+` appears between sections in the preview on hover, and an **Add section** button opens a **visual catalog** — a thumbnail per section, grouped by the existing `group` field (`Hero / Trust / Value / Conversion / Objection`). Insert at the chosen position.
- **Reorder**: drag in the preview *or* the outline; keep existing keyboard move ↑/↓.
- **Live & debounced** (~150 ms) preview updates on every edit.
- **Undo/redo** via a bounded history stack (state is already immutable, so this is cheap).
- **Device frames**: desktop / tablet / mobile = iframe width presets.

### What stays the same

- The `Settings` and `SEO` tabs (contact, conversion labels, theme toggles, SEO) — moved into the inspector's "Page" (no-selection) view + a settings drawer, same fields.
- Save model: in-memory `EditorState` → `payload` JSON → existing server action → repository. Cmd/Ctrl+S, dirty/unsaved indicator, unload warning. All preserved.

---

## 5. Architecture

### 5.1 Structured-field system (P1) — the foundation

Extend the field-type vocabulary and the field renderer. **Critical invariant: the value shape a field produces is identical to today**, so `LandingPageRenderer` and every section component are untouched.

Add to `SectionFieldType` and `SectionFieldDef` in `sectionCatalog.ts`:

```ts
export type SectionFieldType =
  | 'text' | 'textarea' | 'rich_text' | 'boolean' | 'url' | 'number'
  | 'select' | 'image' | 'color'
  | 'repeater'  // NEW: array of objects/strings, edited as cards
  | 'icon'      // NEW: Lucide icon picker
  | 'json'      // RETAINED as a hidden legacy escape hatch only (malformed-value fallback); never assigned to new catalog fields

export type SectionFieldDef = {
  name: string
  label: string
  type: SectionFieldType
  required?: boolean
  options?: string[]
  placeholder?: string
  description?: string
  defaultValue?: string | number | boolean
  // NEW (repeater only):
  itemLabel?: string                 // e.g. "Testimonial"
  itemFields?: SectionFieldDef[]      // sub-schema; omit for array-of-string repeaters
  itemPrimitive?: 'string'            // when set, repeater edits a string[] (e.g. hero bullets)
  min?: number
  max?: number
  // NEW (text/textarea guidance):
  recommendedRange?: [number, number] // word/char budget hint, e.g. [6, 9]
  guidance?: string                   // "6–9 words converts best"
}
```

**New field renderers** (in a dedicated module, e.g. `src/components/cms/admin/landing-pages/fields/`, one small file per type — KISS/many-small-files):

| Type | Component | Produces | Notes |
|---|---|---|---|
| `repeater` (objects) | `RepeaterField` | `Array<Record<string, unknown>>` | list of collapsible item cards; add/remove/reorder/duplicate; each card renders `itemFields` recursively through the same `FieldEditor` |
| `repeater` (`itemPrimitive: 'string'`) | `RepeaterField` | `string[]` | single-input rows (hero bullets, risk-reversal text) |
| `image` | `ImageField` | `string` (URL) | opens `MediaPickerModal`; thumbnail preview; clear button |
| `icon` | `IconField` | `string` (Lucide name) | searchable grid of allow-listed icons |
| `color` | `ColorField` | `string` (hex) | swatch + hex input + brand presets |
| `text`/`textarea` | enhanced | `string` | optional live word/char counter vs `recommendedRange` |

`FieldEditor` becomes a dispatcher: `type → component`. It must support **recursion** (repeater item fields use `FieldEditor` for each sub-field).

**Catalog rewrite**: convert every `type: 'json'` array field to a `repeater` with a typed `itemFields` (or `itemPrimitive: 'string'`). Convert image-bearing URL fields to `image`. Convert icon-name fields to `icon`. The 17 sections and their exact field maps are enumerated in §6 (P1 deliverable).

Example — testimonials:

```ts
// before
{ name: 'items', label: 'Testimonials (JSON)', type: 'json' }
// after
{
  name: 'items', label: 'Testimonials', type: 'repeater', itemLabel: 'Testimonial',
  min: 1, max: 12,
  itemFields: [
    { name: 'quote', label: 'Quote', type: 'textarea', required: true },
    { name: 'author', label: 'Author', type: 'text', required: true },
    { name: 'role', label: 'Role', type: 'text' },
    { name: 'company', label: 'Company', type: 'text' },
    { name: 'imageUrl', label: 'Avatar', type: 'image' },
  ],
}
```

The produced value (`[{quote, author, role, company, imageUrl}]`) is byte-for-byte what `TestimonialsCarousel` already reads. **No renderer change.**

**Backward-compatibility / migration**: existing pages store these as arrays already (the JSON textarea parsed to arrays). `RepeaterField` initialises from the stored array; if a value is malformed (legacy hand-edited), it falls back to a read-only "raw JSON" escape hatch so no data is lost — never silently drops input (mirrors the FIX-001 codec rule).

**Media picker** (`MediaPickerModal`): wraps the existing `CmsMediaLibrary` + upload route. Two tabs — *Upload* (drag-drop) and *Library* (browse `media_assets`). Returns the selected asset URL. Reusable across the admin.

**Icon set**: an allow-listed subset of `lucide-react` (the icons section components already use). Exported as a typed list so the picker, AI drafting, and renderers agree on valid names.

### 5.2 Live preview bridge (P2)

- New **client** route: `src/app/admin/cms/landing-pages/[id]/preview/page.tsx`. Guarded by `requireAdminAuth()` (middleware + page, per project invariant). It renders `LandingPageRenderer` and subscribes to `postMessage`. **It receives the page object via postMessage — it does not read Firestore** (keeps `firebase-admin` out of this client path and reflects *unsaved* edits).
- The editor embeds it in an `<iframe>` and pushes the current `EditorState`-derived `LandingPageDoc` on every (debounced) change.
- A small bridge hook `useLivePreview` on both sides handles a typed message protocol:

```ts
// editor → preview
{ type: 'lp:render', page: LandingPageDoc }
{ type: 'lp:highlight', sectionId: string | null }
// preview → editor
{ type: 'lp:ready' }
{ type: 'lp:select', sectionId: string }
{ type: 'lp:hover', sectionId: string | null }
```

- `LandingPageRenderer` gets two **optional** props — `editMode?: boolean`, `selectedId?: string`, `onSelectSection?(id)`, `onHoverSection?(id|null)`. When `editMode`, each rendered section is wrapped in a thin clickable/hoverable layer keyed by `section.id`. In production (no props) behaviour is identical. This is the single additive change to the renderer.
- **Device frames** = iframe width presets (e.g. 1280 / 768 / 390). Origin is same-origin, so `postMessage` targets `window.location.origin`.

### 5.3 Templates (P3)

- Code-defined starters in `src/lib/landing-pages/templates.ts`:

```ts
export type LandingPageTemplate = {
  id: string
  name: string
  description: string
  thumbnail: string          // static asset path
  recommendedService?: string
  build(): { sections: LandingPageSection[]; theme: Partial<LandingPageTheme>; seo?: Partial<LandingPageSeo> }
}
```

- Starters (initial): **Corporate Tax Lead-Gen, Bookkeeping Demo Booking, Free-Tool Lead Magnet, Webinar Registration, VAT Consultation.** Each composes existing sections with on-brand default copy (reuse the `*_DEFAULT` arrays already in the catalog).
- The **create flow** ([src/app/admin/cms/landing-pages/page.tsx](../../../src/app/admin/cms/landing-pages/page.tsx)) becomes a chooser: **Pick a template · Start blank · Draft with AI · Duplicate existing**. Template choice seeds `sections/theme` at create time via `createLandingPage`.
- **Visual section catalog** (also P3): replace the text list in "Add section" with a thumbnail grid grouped by `group`. Thumbnails are static SVG/PNG renders per section type stored under `public/landing-studio/`.

### 5.4 AI drafting (P4)

- **Entry points**: "Draft with AI" in the create chooser and in the Studio topbar.
- **Brief form** (modal): goal (required), service (prefilled from `service_interest`), audience, key offer/hook, tone, language. 6 fields, 5 optional.
- **Server action** (`src/app/admin/cms/landing-pages/ai/draftAction.ts`, `import 'server-only'`): calls `generateObject` (AI SDK) with `resolveModel('quality')`, constrained to a **Zod schema derived from the section catalog**. The model returns an ordered list of `{ type, props }` (props validated per section) + `theme` + `seo`. It **never emits HTML**; copy lands in the structured props, so rendering stays deterministic and sanitised.
- **Schema generation**: a helper builds a Zod schema from `SECTION_CATALOG` so the AI's allowed sections/fields always match the catalog (single source of truth). Unknown sections/fields are dropped; required fields enforced; `icon` values constrained to the allow-list; `image` URLs allowed empty (marketer fills via picker).
- **Apply**: the validated draft loads into the Studio as a normal **draft** page for review/edit. **Never auto-publishes.** If `isAiConfigured()` is false, the action returns a friendly "AI not configured" state and the button is hidden/disabled.
- **Inline assists**: per-field "✨ Improve" on text/textarea (rewrite headline, generate N testimonials, suggest FAQ) reuse the existing field-level AI tier mapping (`nano`/`standard`).
- **Cost/guardrails**: `quality` tier with the router's `MAX_OUTPUT_TOKENS`; one draft per click; show the result before applying; all output is a draft.

### 5.5 State, undo/redo, save

- Keep `EditorState` and `stateToPayload`/`pageToState`. The save path (`payload` → server action → `updateLandingPage`) is unchanged.
- Add a bounded **history stack** (e.g. last 50 states) with undo/redo; integrate with the existing dirty-tracking and Cmd/Ctrl+S.
- Live preview derives a `LandingPageDoc` from `EditorState` on each change (the same shape `stateToPayload` builds, plus `id`).

---

## 6. Phasing

Each phase is independently shippable and delivers value alone. Build order is chosen so each phase's output feeds the next (structured data → preview → templates → AI).

### Phase 1 — Structured fields + media/icon/color pickers  *(foundation)*

**Goal:** No JSON, no URL-pasting, anywhere in the landing-page editor.

**Deliverables**
1. Extend `SectionFieldType`/`SectionFieldDef` (`repeater`, `icon`, guidance fields).
2. Field renderer modules: `RepeaterField`, `ImageField`, `IconField`, `ColorField`, enhanced text/textarea with counters; recursive `FieldEditor` dispatcher.
3. `MediaPickerModal` wrapping `CmsMediaLibrary` + upload route.
4. Allow-listed Lucide icon set module.
5. **Rewrite `sectionCatalog.ts`**: every `json` array → `repeater`; image fields → `image`; icon fields → `icon`. (All 17 sections.)
6. Legacy-value fallback (malformed array → raw-JSON escape hatch, no data loss).

**Acceptance**
- Every field in all 17 sections is editable without typing JSON or a URL.
- Saved documents are byte-compatible with existing `LandingPageRenderer` output (verified by rendering an existing page before/after).
- `npm run typecheck` clean.

**Files**: `sectionCatalog.ts`; new `src/components/cms/admin/landing-pages/fields/*`; new `MediaPickerModal`; new icon set; `LandingPageEditor.tsx` (swap inline `FieldEditor` for the new dispatcher).

### Phase 2 — Live two-pane preview + click-to-edit

**Goal:** See the page change as you edit; click the page to edit it.

**Deliverables**
1. Preview route `[id]/preview/page.tsx` (client, `requireAdminAuth`, postMessage-driven).
2. `useLivePreview` bridge + typed message protocol.
3. `LandingPageRenderer` optional `editMode/selectedId/onSelectSection/onHoverSection` props + section wrapper layer.
4. Studio shell: two-pane layout, device-frame toggle, selection toolbar, outline rail with hover sync, undo/redo.
5. Settings/SEO relocated into inspector page-view + drawer (no field changes).

**Acceptance**
- Editing any field updates the preview within ~200 ms.
- Clicking a section selects it and opens its fields; the floating toolbar moves/dupes/hides/deletes it.
- Device toggle re-widths the preview.
- Production landing-page render is unchanged (renderer used without the new props).

### Phase 3 — Templates + visual section catalog

**Goal:** Never start from an empty page; pick sections by sight.

**Deliverables**
1. `templates.ts` + 5 starter templates.
2. Create-flow chooser (template / blank / AI / duplicate); seed sections+theme at create.
3. Visual "Add section" catalog (thumbnail grid grouped by `group`); thumbnails under `public/landing-studio/`.

**Acceptance**
- New page can be created from each template and renders correctly.
- Add-section shows thumbnails grouped by category and inserts at the chosen position.

### Phase 4 — AI drafting + inline assists

**Goal:** Describe a campaign → get an editable, on-brand draft.

**Deliverables**
1. Catalog-derived Zod schema builder.
2. `draftAction.ts` server action via `resolveModel('quality')` + `generateObject`.
3. Brief modal + "Draft with AI" entry points; apply-as-draft flow.
4. Per-field "✨ Improve" assists (reuse existing tiers).
5. Graceful degradation when `isAiConfigured()` is false.

**Acceptance**
- A brief produces a validated multi-section draft that loads into the Studio and renders.
- Malformed/unknown AI output is rejected/repaired by schema validation; never crashes the editor; never auto-publishes.
- With no AI provider configured, AI entry points are hidden and manual building is unaffected.

---

## 7. Invariants & constraints (must hold)

1. **`firebase-admin` never reaches client.** Preview route is client + presentational; data arrives via `postMessage`. AI/save stay in server actions. Run `npm run build` (not just typecheck) before claiming any firebase-adjacent change done.
2. **Renderer & section components unchanged in shape.** Structured fields must emit the exact value shapes the sections already consume. P2 adds only optional props.
3. **No client writes to Firestore.** All writes via `landing-pages/repository.ts` server-side.
4. **Admin double-guard.** Every new admin route (preview, AI) calls `requireAdminAuth()`; middleware already matches `/admin/:path*`.
5. **Sanitisation preserved.** Any HTML-bearing field stays routed through existing sanitisation; AI emits structured copy, not HTML.
6. **AI is a draft generator only.** Schema-validated, never auto-publish, degrades gracefully when unconfigured.
7. **No new `console.log` in admin/credential paths.**

---

## 8. Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Repeater value drift breaks an existing page | Med | Snapshot-test render of representative pages before/after P1; legacy raw-JSON fallback |
| postMessage perf jank on large pages | Low/Med | Debounce 150 ms; send the page object only on change; structuredClone-safe payload |
| Preview/edit wrapper changes production layout | Low | Wrapper layer only renders when `editMode` prop is set |
| AI output invalid or off-brand | Med | Catalog-derived Zod schema; required-field enforcement; review-before-apply; brand defaults in prompt |
| Icon/color pickers diverge from what renderers support | Low | Single allow-list module shared by picker, AI schema, and renderers |
| Scope creep toward full canvas | Med | Explicit non-goal in §1; fixed section set |

---

## 9. Testing strategy

- **P1**: unit tests for each field renderer (value in/out shape), repeater add/remove/reorder immutability, legacy-fallback; a render-equivalence check (existing doc → renderer output identical pre/post catalog rewrite).
- **P2**: bridge protocol unit tests; manual smoke of click-to-edit + device frames; assert production renderer output unchanged when new props absent.
- **P3**: each template builds a doc that passes `LandingPageDoc` validation and renders; create-flow integration.
- **P4**: schema-builder unit tests (valid/invalid/unknown fields); `draftAction` with a mocked model returning good/garbled output; unconfigured-AI path.
- Throughout: `npm run typecheck` gate; `npm run build` for any firebase-adjacent change; manual `/admin/cms/landing-pages` smoke + revalidation check in dev.

---

## 10. Open questions (resolve during planning, not blocking)

1. **Inspector vs. tabs for Settings/SEO** — drawer or a persistent "Page" inspector view? (Lean: page-level inspector view when nothing is selected, with a "More settings" drawer for conversion/tracking.)
2. **Template thumbnails** — hand-made SVGs vs. screenshot captures? (Lean: start with simple labelled SVG placeholders; upgrade later.)
3. **AI tiers for drafting** — `quality` for full-page draft confirmed; which tier for inline assists per field? (Lean: reuse existing `fieldMap.ts` tiering.)
4. **Undo/redo depth** — 50 states default; confirm acceptable memory.

---

## 11. Out of scope (future)

- "Save as template" → Firestore team templates.
- A/B testing & traffic split.
- External/multi-tenant builder.
- Adopting the structured-field primitives into the CMS `page_blocks` editor.
- Free-form canvas / custom CSS.
