# Two-Version Draft/Publish Workflow — Design

**Date:** 2026-06-28
**Status:** Awaiting review
**Author:** meet@finanshels.com (with Claude)

## 1. Problem

The two admin editors have inconsistent and unsafe publishing workflows:

- **Landing Page editor** (`LandingPageEditor.tsx`): manual save only, **no autosave**; status is a plain dropdown (Draft/Published/Archived) — publishing is just "set status=published and save"; **no draft↔live separation** (every save to a published page goes live); no preview of unpublished changes; no revisions.
- **CMS collection editor** (`/admin/cms`): has autosave + explicit Publish/Republish/Unpublish buttons (FIX-056) + `_revisions`/rollback, but **no preview of unpublished drafts**, and "save ≠ revalidate" is only a *deferred-revalidation* trick — edits to a published doc still surface on the next ISR cycle (~10 min), so it is not true isolation.

A UAE marketing team wants Webflow-like ease: **edit a live page freely, preview the changes, and push live only when ready — without ever risking the live page.** That requires genuine draft/published separation.

## 2. Goals & non-goals

**Goals**
1. One **shared** two-version publish model + UI used by **both** editors (landing pages + the 12 CMS collections).
2. **True draft↔live separation:** editing never changes the live page until Publish/Republish.
3. **Admin-only Preview** of the working draft for any editable doc.
4. Bring **autosave** to the landing editor and **Preview** to the CMS editor in one shared component.
5. A one-time **backfill** so existing published docs keep rendering unchanged.

**Non-goals (this effort)**
- Scheduled publish.
- Shareable tokenized preview links (admin-only chosen for v1; documented fast-follow).
- New approval roles beyond the existing editor/admin model.

## 3. Decisions (locked in brainstorming)

| Decision | Choice |
|---|---|
| Surface | **Both** editors via a shared model + `<PublishControls>` component |
| Separation | **True two-version** — working draft + a separate published snapshot |
| Preview access | **Admin-only** (`?preview=1` + non-throwing admin-cookie check) |
| Snapshot storage | A **`/_published/current` subdocument** per doc (separate Firestore doc → avoids the 1 MB/doc limit and field doubling) |

## 4. The model

Each editable doc has two representations:

- **Draft** — the existing top-level doc fields (what the editor edits, what autosave persists).
- **Published snapshot** — a subdocument at `<collection>/<id>/_published/current` holding the fields as they were at the last publish.

Plus meta on the parent doc:
- `status` — existing field. `published` ⇒ a snapshot is live; `draft` ⇒ not live (landing also `archived`; CMS also `in_review`).
- `published_at`, `published_by`.
- `has_unpublished_changes: boolean` — the draft differs from the published snapshot (drives the Republish affordance).

**Public routes render the snapshot; the editor and Preview render the draft.** Editing the draft cannot affect the live page.

### 4.1 Reconciling with existing `status==='published'` gating

Public reads today filter on `status==='published'` and render the live doc fields. New rule: a doc renders publicly iff `status==='published'` **and** a `_published/current` snapshot exists; rendering uses the **snapshot fields** (not the live draft fields). This keeps the existing status gate as the on/off switch and changes only *which fields* are rendered (snapshot vs draft).

## 5. Repository contract

A shared contract both repositories (`landing-pages/repository.ts` and `cms/collectionRepository.ts`) implement. Implemented as shared helpers in a new `src/lib/cms/publishWorkflow.ts` (pure where possible) + thin per-repository wiring.

```
saveDraft(collection, id, fields, userId):
  - write draft fields to the parent doc
  - recompute has_unpublished_changes (draft vs snapshot) — see 5.1
  - write a _revisions entry (existing CMS behaviour; add to landing)
  - NO revalidate

publish(collection, id, userId):           // serves both Publish and Republish
  - copy current draft (public-facing fields) -> <id>/_published/current
  - set status='published', published_at (first time), published_by,
    has_unpublished_changes=false
  - denormalise the card subset onto the parent (see 6, listing perf)
  - write a publish-marked _revisions entry
  - revalidate the doc route + listing + sitemap + llms (existing path)

unpublish(collection, id, userId):
  - set status='draft' (landing may use 'archived'); leave the snapshot in place
  - revalidate so the live URL 404s

getPublished(collection, slug):             // public render + sitemap + llms
  - resolve id by slug; if status!=='published' -> null
  - read <id>/_published/current; return its fields (null if missing)

getDraft(collection, slug):                 // editor + admin preview
  - return the parent draft fields (current behaviour)
```

### 5.1 `has_unpublished_changes`

Computed by comparing a **stable serialization** of the publish-facing draft fields against the snapshot (ignoring volatile meta like `updated_at`, autosave bookkeeping). Pure function `diffExceedsPublished(draftFields, snapshotFields): boolean` — unit-tested. Set on every `saveDraft`; cleared by `publish`.

## 6. Listing/hub performance (handled risk)

Listings (blog hub, glossary hub, tools hub, customers, sitemap, llms) must show **published** card data without an N+1 read of every snapshot subdoc. Resolution: on `publish()`, **denormalise a small published-card subset** (title, slug, card_description, card_image, featured, sort_order, published_at, status) onto the **parent** doc under a `published_card` map. Listings read `published_card` from the parent (one query, no subdoc reads); detail pages read the full snapshot subdoc. The draft's own card fields are what the editor edits; `published_card` is only updated on publish.

## 7. Preview (admin-only)

- Public routes accept `?preview=1`.
- When present, the route calls a new **non-throwing** `isAdminRequest()` (reads the `finanshels_admin_v2` cookie and HMAC-verifies it via `adminAuth.ts`; returns boolean, never redirects). The public route is NOT under `/admin`, so middleware does not guard it — this inline check is the gate.
- If admin: render `getDraft(...)` instead of the snapshot, wrap with a fixed **"Draft preview — not live"** banner, and emit `<meta name="robots" content="noindex,nofollow">`.
- If not admin: ignore `?preview` and serve the normal published page (or 404 if unpublished).
- The editor's **"Preview ↗"** opens `<publicRoute>?preview=1` in a new tab.

## 8. Shared `<PublishControls>` component

One client component (`src/components/cms/admin/PublishControls.tsx`) driven by props; both editors render it. Server actions are passed in as props (per the repo's server-action-in-props pattern).

Props: `{ status, hasUnpublishedChanges, isDirty, savingState, publishedAt, previewUrl, liveUrl, canPublish (role), actions: { saveDraft, publish, unpublish } }`.

> Two distinct flags, do not conflate: **`isDirty`** = the editor has in-memory edits not yet persisted to the draft (drives "Saving…/Saved"); **`hasUnpublishedChanges`** = the *persisted draft* differs from the published snapshot (drives "Republish"). A doc can be `isDirty=false` (everything saved) yet `hasUnpublishedChanges=true` (saved, but not published).

State → controls:
```
Draft (never published):     [● Saving…/Saved]   [ Publish ]                         [ Preview ↗ ]
Published, in sync:          [ Saved ✓ ]                          [ Unpublish ]      [ Preview ↗ ] [ View live ↗ ]
Published, draft ahead:      [● Saving… ]   [ Republish ◀primary ] [ Unpublish ]     [ Preview ↗ ] [ View live ↗ ]
In review (CMS, editor role):[ Awaiting approval ]                                   [ Preview ↗ ]
```

- Autosave (debounced) drives the `savingState` and calls `saveDraft`; **landing editor gains autosave** by adopting the existing `AutosaveManager` against the new `saveDraft` action.
- "Publish" and "Republish" are the same `publish` action; the label is `Republish` when `hasUnpublishedChanges` on a published doc.
- Reuses `EditorStatusControls`' role logic (editor → submit-for-review; admin → publish) where applicable.

## 9. Migration / backfill

One idempotent script (`scripts/backfill-published-snapshots.mts`): for `landing_pages` and every CMS collection, for each doc with `status==='published'`, copy its current public-facing fields → `<id>/_published/current`, set `published_at` if missing, write the `published_card` subset onto the parent, set `has_unpublished_changes=false`. Re-runnable. Run once before the new public-read path goes live (otherwise published pages with no snapshot would 404).

**Sequencing safety:** the public read path must tolerate a missing snapshot during rollout — if `status==='published'` but no snapshot yet, fall back to rendering the draft fields (current behaviour) and log a warning. This makes the deploy safe regardless of backfill timing.

## 10. Rollout (phased plans — each its own implementation plan)

1. **Core model + repository ops + backfill** — `publishWorkflow.ts` helpers, wire `saveDraft`/`publish`/`unpublish`/`getPublished`/`getDraft` into both repositories, the `published_card` denormalisation, the `diffExceedsPublished` unit tests, the backfill script, and the snapshot-fallback read path. No UI change yet (editors keep working via `saveDraft`+`publish` under the hood).
2. **Preview routing** — `isAdminRequest()` + `?preview=1` branch + banner + noindex across the public routes (blog, glossary, tools, content, landing-pages).
3. **Shared `<PublishControls>`** — the component + autosave wiring, behind the editors (no behaviour change until step 4/5 mount it).
4. **Wire CMS editor** — replace `EditorStatusControls` usage with `<PublishControls>`; add Preview. (Uncontended — do first.)
5. **Wire landing editor** — replace the status dropdown + save button with `<PublishControls>`; add autosave + Preview. **Done after the parallel `LandingPageEditor.tsx` rebuild lands, in an isolated worktree, reconciled with their changes.**

## 11. Testing

- **Unit:** `diffExceedsPublished` (draft == snapshot → false; any public field differs → true; ignores volatile meta); `published_card` extraction.
- **Integration:** `publish()` writes the snapshot + card + revalidates; `saveDraft()` leaves snapshot untouched + does not revalidate; `getPublished` returns snapshot, `getDraft` returns draft; `unpublish` makes `getPublished` null.
- **E2E (Playwright):** edit a published page → live URL unchanged → `?preview=1` (as admin) shows the draft with the banner → Republish → live URL now reflects the change. Non-admin `?preview=1` shows the live page.
- **Manual:** run the backfill on a dev copy; confirm every published page still renders identically.

## 12. Risks & open items

- **Doc size / cost:** snapshot in a subdoc avoids parent-doc bloat; the extra detail-page read is one `get`. Accept.
- **Backfill timing:** mitigated by the snapshot-fallback read path (§9).
- **Two write surfaces drift:** the shared `publishWorkflow.ts` contract is the guard — both repositories must route through it; a follow-up reviewer checks no editor bypasses it.
- **Landing editor contention:** step 5 is explicitly sequenced after the parallel rebuild; do not touch `LandingPageEditor.tsx` while it is mid-rebuild.
- **Status semantics:** `in_review` (CMS) and `archived` (landing) remain surface-specific labels layered on the shared draft/published core; `getPublished` keys off `status==='published'` only.
