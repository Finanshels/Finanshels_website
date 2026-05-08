# CMS Admin Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a four-part CMS admin audit at `docs/cms/admin-audit.md` (cross-cutting code review, field-type/section model review, per-collection deep dive that doubles as per-module documentation, prioritized fix backlog) backed by a Firestore population-stats sampling script.

**Architecture:** Audit-only. No production code modified. One `.mjs` script samples real Firestore documents and writes `docs/cms/admin-audit.data.json`. The audit doc is built incrementally — one Part per task — with each task ending in a typecheck/commit checkpoint. Per-collection coverage in Part 3 is split into three subtasks chunked by editorial volume.

**Tech Stack:** Node `.mjs` scripts (matches existing `scripts/check-firestore.mjs` precedent — no new dev deps), `firebase-admin`, plain Markdown for the audit doc.

**Spec:** `docs/superpowers/specs/2026-05-08-cms-admin-audit-design.md`

**Branch policy:** Changes are isolated to `scripts/cms-audit/` and `docs/cms/`, plus this plan and the spec. Continue on `main` unless the user requests a worktree.

---

## File structure

```
scripts/cms-audit/
  sample-firestore.mjs          # NEW — read-only Firestore sampler

docs/cms/
  admin-audit.md                # NEW — the audit deliverable, built incrementally
  admin-audit.data.json         # NEW — population stats from the script

docs/superpowers/
  specs/2026-05-08-cms-admin-audit-design.md   # already committed
  plans/2026-05-08-cms-admin-audit.md          # this file
```

No source files under `src/` are modified. `docs/cms-field-guide.md` is left untouched.

---

## Task 1: Firestore sampling script

**Files:**
- Create: `scripts/cms-audit/sample-firestore.mjs`
- Create (output): `docs/cms/admin-audit.data.json`
- Reference: `scripts/check-firestore.mjs` (env-loading style), `src/lib/cms/firestore.ts` (auth normalization), `src/lib/cms/collectionDefinitions.ts` (collection keys)

The script samples up to 200 documents per collection, computes population fractions for every defined field, and lists any *extra* keys present in stored documents that are not in the field definitions. Read-only.

- [ ] **Step 1: Scaffold the script with env loading and auth**

Create `scripts/cms-audit/sample-firestore.mjs`:

```js
// Read-only Firestore sampler for the CMS audit.
// Outputs docs/cms/admin-audit.data.json with population stats per field per collection.
// Run with: node scripts/cms-audit/sample-firestore.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const SAMPLE_LIMIT = 200
const OUTPUT_PATH = new URL('../../docs/cms/admin-audit.data.json', import.meta.url)

function loadEnvLocal() {
  try {
    const txt = readFileSync(new URL('../../.env.local', import.meta.url), 'utf8')
    for (const rawLine of txt.split(/\r?\n/)) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const eq = line.indexOf('=')
      if (eq === -1) continue
      const key = line.slice(0, eq).trim()
      let value = line.slice(eq + 1).trim()
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      if (!process.env[key]) process.env[key] = value
    }
  } catch (err) {
    console.warn('[warn] could not read .env.local:', err.message)
  }
}

function normalizePrivateKey(input) {
  if (!input) return ''
  let key = input
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1)
  }
  if (!key.includes('-----BEGIN')) {
    try {
      const decoded = Buffer.from(key, 'base64').toString('utf8')
      if (decoded.includes('-----BEGIN')) key = decoded
    } catch {}
  }
  key = key.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\r\n/g, '\n')
  return key.trim() + '\n'
}

function getDb() {
  if (!process.env.FIREBASE_ADMIN_PROJECT_ID || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    throw new Error('CMS env not configured (FIREBASE_ADMIN_* missing)')
  }
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: normalizePrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY),
      }),
    })
  }
  return getFirestore()
}

loadEnvLocal()
const db = getDb()
console.log('[ok] firestore initialized for project', process.env.FIREBASE_ADMIN_PROJECT_ID)
```

- [ ] **Step 2: Run the scaffold to verify auth**

Run: `node scripts/cms-audit/sample-firestore.mjs`
Expected output: `[ok] firestore initialized for project <project-id>` and exit 0. If it errors with an env or PEM message, fix `.env.local` before continuing.

- [ ] **Step 3: Add the field-definition catalogue**

The script must know which fields are defined per collection. To avoid importing TypeScript, we mirror the keys statically from `src/lib/cms/collectionDefinitions.ts`. Append to the script:

```js
// Mirror of CMS collection keys from src/lib/cms/collectionDefinitions.ts.
// We intentionally do NOT mirror the field list here — the script discovers
// stored keys empirically and the audit doc cross-references the source file.
const COLLECTIONS = [
  'media_assets',
  'videos',
  'our_customers',
  'tools',
  'review_sources',
  'customer_reviews',
  'podcasts',
  'faq_questions',
  'faq_topics',
  'customer_stories',
  'ebooks',
  'webinars',
  'glossary_terms',
  'blog_posts',
  'team_members',
]
```

- [ ] **Step 4: Add the sampling + population logic**

Append to the script:

```js
function isPopulated(value) {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  if (value && typeof value === 'object') {
    // Firestore Timestamp instances have toDate; treat as populated.
    if (typeof value.toDate === 'function') return true
    return Object.keys(value).length > 0
  }
  if (typeof value === 'number') return Number.isFinite(value)
  return Boolean(value)
}

async function sampleCollection(collectionId) {
  let snapshot
  try {
    snapshot = await db.collection(collectionId).limit(SAMPLE_LIMIT).get()
  } catch (err) {
    return { error: err.message }
  }
  const totalSampled = snapshot.size
  const keyCounts = new Map()
  for (const doc of snapshot.docs) {
    const data = doc.data()
    for (const key of Object.keys(data)) {
      if (isPopulated(data[key])) {
        keyCounts.set(key, (keyCounts.get(key) ?? 0) + 1)
      } else {
        // Track presence even when empty so we can distinguish
        // "always present but blank" from "not in any doc".
        keyCounts.set(key, keyCounts.get(key) ?? 0)
      }
    }
  }
  const populationByKey = {}
  for (const [key, count] of keyCounts.entries()) {
    populationByKey[key] = totalSampled === 0 ? 0 : Number((count / totalSampled).toFixed(3))
  }
  return { totalSampled, populationByKey }
}

async function main() {
  const sampledAt = new Date().toISOString()
  const collections = {}
  for (const id of COLLECTIONS) {
    process.stdout.write(`[..] ${id} `)
    const result = await sampleCollection(id)
    collections[id] = result
    if (result.error) console.log(`error: ${result.error}`)
    else console.log(`sampled ${result.totalSampled}, ${Object.keys(result.populationByKey).length} distinct keys`)
  }
  const outFile = fileURLToPath(OUTPUT_PATH)
  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, JSON.stringify({ sampledAt, sampleLimit: SAMPLE_LIMIT, collections }, null, 2) + '\n')
  console.log(`[ok] wrote ${outFile}`)
}

main().catch((err) => {
  console.error('[fail]', err)
  process.exit(1)
})
```

- [ ] **Step 5: Run the full sampler**

Run: `node scripts/cms-audit/sample-firestore.mjs`
Expected output:
```
[..] media_assets sampled N, K distinct keys
[..] videos sampled N, K distinct keys
... (15 lines)
[ok] wrote .../docs/cms/admin-audit.data.json
```
Exit code 0. If any collection errors, the script continues — that's intentional, errors are recorded in the JSON.

- [ ] **Step 6: Sanity-check the JSON output**

Run: `node -e "const d=require('./docs/cms/admin-audit.data.json'); console.log(Object.keys(d.collections).length, 'collections'); for (const [k,v] of Object.entries(d.collections)) console.log(k, v.totalSampled ?? v.error)"`
Expected: `15 collections` then 15 lines with sample sizes (or per-collection error messages). No JSON parse error.

- [ ] **Step 7: Commit**

```bash
git add scripts/cms-audit/sample-firestore.mjs docs/cms/admin-audit.data.json
git -c commit.gpgsign=false commit -m "chore(cms-audit): add Firestore sampler and population stats

Read-only sampler over all 15 CMS collections. Writes population fractions
per stored key plus extra-key discovery into docs/cms/admin-audit.data.json.
Used by the CMS admin audit to back 'remove' verdicts with real data.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Audit doc skeleton + Part 1 (cross-cutting code review)

**Files:**
- Create: `docs/cms/admin-audit.md`
- Read: `src/lib/cms/collectionDefinitions.ts`, `src/lib/cms/blogRepository.ts`, `src/lib/cms/glossaryRepository.ts`, `src/lib/cms/collectionRepository.ts`, `src/lib/cms/usersRepository.ts`, `src/lib/cms/normalizeDoc.ts`, `src/lib/cms/sanitize.ts`, `src/lib/cms/slugify.ts`, `src/lib/cms/storageUpload.ts`, `src/lib/cms/adminAuth.ts`, `src/lib/cms/schemas/blog.ts`, `src/lib/cms/schemas/glossary.ts`, `src/app/admin/cms/page.tsx`, every file under `src/components/cms/admin/`, every file under `src/components/cms/`

- [ ] **Step 1: Create the audit doc skeleton**

Create `docs/cms/admin-audit.md` with this exact skeleton (sections will be filled in by subsequent tasks). Use `<!-- TASK-N -->` markers so later tasks can grep for their insertion point.

```markdown
# CMS Admin — Audit, Code Review & Module Documentation

**Generated:** 2026-05-08
**Spec:** [`docs/superpowers/specs/2026-05-08-cms-admin-audit-design.md`](../superpowers/specs/2026-05-08-cms-admin-audit-design.md)
**Population data:** [`admin-audit.data.json`](./admin-audit.data.json)

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

<!-- TASK-2 -->

---

## Part 2 — Field-type & section model review

<!-- TASK-3 -->

---

## Part 3 — Per-collection deep dive (per-module documentation)

<!-- TASK-4A -->
<!-- TASK-4B -->
<!-- TASK-4C -->

---

## Part 4 — Prioritized fix backlog

<!-- TASK-5 -->
```

- [ ] **Step 2: Read the cross-cutting target files**

Read in this order, taking notes:

1. `src/lib/cms/collectionDefinitions.ts` (full file — 1,503 lines).
2. `src/lib/cms/schemas/blog.ts`, `src/lib/cms/schemas/glossary.ts`.
3. Each repository: `blogRepository.ts`, `glossaryRepository.ts`, `collectionRepository.ts`, `usersRepository.ts`.
4. `normalizeDoc.ts`, `sanitize.ts`, `slugify.ts`, `storageUpload.ts`, `adminAuth.ts`, `firestore.ts`, `config.ts`.
5. `src/app/admin/cms/page.tsx` (full file — 1,676 lines).
6. Every file under `src/components/cms/admin/`.
7. Every file under `src/components/cms/` (public render).

For each finding, record:
- Finding id (`CR-001` and up — increment per finding).
- Severity (`P0` / `P1` / `P2`).
- File path and line(s).
- Observation, why it matters, suggested fix, risk if changed (low/medium/high).

Categories to cover (each finding belongs to one):
- **Type safety & contract drift** — does code agree with `CmsFieldDefinition`, schemas, runtime validators?
- **Duplication** — repeated logic across repositories, the field-hiding logic, normalization helpers.
- **Correctness** — slug uniqueness, save flow, error surfacing, datetime normalization, boolean coercion, JSON parse failures, reference resolution.
- **Performance** — N+1 reads in reference resolution, missing pagination, oversized client bundles, the single 1,676-line component re-render surface.
- **Accessibility** — labels, focus management in dialogs, keyboard handling in custom controls (RichText, MultiReference, Blocks).
- **Security & input handling** — sanitize.ts coverage, HTML injection in rich text, file URL validation in storageUpload, admin auth perimeter.
- **Maintainability** — file size and decomposition candidates, dead exports, inconsistent naming.
- **Frontend-vs-admin gap** — fields the admin lets editors set that the public render path never reads (this is the primary "remove candidate" signal alongside population stats).

- [ ] **Step 3: Write Part 1 findings into the doc**

Replace `<!-- TASK-2 -->` in `docs/cms/admin-audit.md` with the findings, grouped by category in the order above. Each finding follows this exact format:

```markdown
### CR-007 [P1] page.tsx state model couples slug-sync to title-edit

- **File:** `src/app/admin/cms/page.tsx:421-455`
- **Observation:** [what the code does and why it's a problem]
- **Why it matters:** [user/editor/maintenance impact]
- **Suggested fix:** [concrete change]
- **Risk if changed:** low | medium | high
```

End Part 1 with a brief summary table:

```markdown
#### Part 1 summary

| Severity | Count |
|----------|-------|
| P0 | N |
| P1 | N |
| P2 | N |
```

- [ ] **Step 4: Verify Part 1 has no placeholders**

Run: `grep -nE "TBD|TODO|FIXME|\\[ ?fill|XXX" docs/cms/admin-audit.md`
Expected: empty output.

Run: `grep -c "^### CR-" docs/cms/admin-audit.md`
Expected: a number equal to the total finding count, matching the summary table.

- [ ] **Step 5: Commit Part 1**

```bash
git add docs/cms/admin-audit.md
git -c commit.gpgsign=false commit -m "docs(cms-audit): add Part 1 cross-cutting code review

Findings across collectionDefinitions, schemas, repositories, admin page,
field components, and public render paths. Severity-tagged with concrete
file:line references and suggested fixes.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Part 2 — field-type & section model review

**Files:**
- Modify: `docs/cms/admin-audit.md` (replace `<!-- TASK-3 -->`)
- Read: `src/lib/cms/collectionDefinitions.ts` (focus on `CmsFieldType`, `CmsSectionKey`, `CMS_BLOCK_TYPES`), `docs/cms/admin-audit.data.json`, `src/components/cms/PageBlocksRenderer.tsx`

- [ ] **Step 1: Inventory the meta-model**

Build three internal tables before writing prose:

A. **Field-type usage matrix.** For each of the 16 `CmsFieldType` values, count how many fields across all collections use it (grep `type: '<value>'` in `collectionDefinitions.ts`). Record any type used by zero or one field — those are consolidation candidates.

B. **Section utilization matrix.** For each of the 9 `CmsSectionKey` values, list per collection whether the section has 0, 1–2, 3–5, or 6+ fields. Sections that are nearly empty across most collections are flag candidates.

C. **Block usage data.** For each block in `CMS_BLOCK_TYPES`, look up usage in `admin-audit.data.json` — specifically, scan the `populationByKey` for `page_blocks` across collections. (If population data doesn't break down by block type, note the limitation and propose a follow-up script tweak.) Mark blocks with no observed instances as candidates for removal.

- [ ] **Step 2: Write Part 2**

Replace `<!-- TASK-3 -->` with these subsections (use finding ids `MM-001` and up):

```markdown
### Field-type review

[Prose covering: which types pull weight, which overlap (e.g. `image` vs `url`,
`email` vs `text`), which are unused. End with finding entries for each
recommendation in the format from Part 1.]

#### Field-type usage matrix

| Type | # fields using it | Example fields | Verdict |
|------|-------------------|----------------|---------|
| text | N | … | keep |
| icon | N | … | … |

### Section review

[Prose: is publish/card/listing/detail/blocks/relations/seo/aeo/geo the right
split? Are AEO and GEO actually used (cross-reference data)?]

#### Section utilization

| Section | Collections with content | Avg fields | Verdict |
|---------|--------------------------|-----------|---------|

### Block catalogue review

[Prose: which of the 15 blocks appear in real data, which don't.]

#### Block utilization

| Block | Observed in data | Verdict | Notes |
|-------|------------------|---------|-------|
```

End Part 2 with a `MM-NNN` finding for every actionable recommendation, in the same format as `CR-NNN` findings.

- [ ] **Step 3: Verify and commit**

Run: `grep -nE "TBD|TODO|FIXME" docs/cms/admin-audit.md` → expected: empty.
Run: `grep -c "^### MM-" docs/cms/admin-audit.md` → expected: > 0.

```bash
git add docs/cms/admin-audit.md
git -c commit.gpgsign=false commit -m "docs(cms-audit): add Part 2 field-type and section model review

Audit of the 16 CmsFieldTypes, 9 CmsSectionKeys, and 15 CMS_BLOCK_TYPES with
usage matrices and consolidation recommendations backed by population data.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4A: Part 3 — high-volume collections (blog_posts, glossary_terms, customer_stories)

**Files:**
- Modify: `docs/cms/admin-audit.md` (replace `<!-- TASK-4A -->`)
- Read: `src/lib/cms/collectionDefinitions.ts` (the relevant blocks of `CMS_COLLECTION_DEFINITIONS_BASE` for these three collections), `src/lib/cms/blogRepository.ts`, `src/lib/cms/glossaryRepository.ts`, `src/lib/cms/schemas/blog.ts`, `src/lib/cms/schemas/glossary.ts`, `docs/cms/admin-audit.data.json`, `src/components/cms/ArticleBody.tsx`, `src/components/cms/BlogCard.tsx`, `src/components/cms/GlossaryCard.tsx`, `src/components/cms/GlossarySearch.tsx`, public routes that render these collections (`src/app/blog/**/*.tsx`, `src/app/glossary/**/*.tsx`, customer-stories routes — locate via `grep -rln "customer_stories\|customer-stories" src/app`).

For each of the three collections write a section using this exact template (replace `<COLL>` with the uppercase collection slug for finding ids — `BLOG`, `GLOSS`, `STORY`):

````markdown
### Collection: `<collection_key>`

**Purpose.** [1–3 sentences: what this content type is for, who edits it.]

**Public surfaces.** [Bulleted list of pages/components on the public site that read this collection, with file paths.]

**Sample size:** N documents (from `admin-audit.data.json`).

**Field table.**

| Section | Field | Type | Required | Pop. % | Verdict | Move/Rename | Notes |
|---------|-------|------|----------|--------|---------|-------------|-------|
| publish | `title` | text | yes | 100% | keep | — | canonical title |
| publish | `categories` | tags | — | 4% | merge-with-blog_category | — | duplicate; legacy |

**Per-field documentation (kept fields only).**

#### `<field_name>`
- **Section:** publish
- **Type:** text
- **Format:** [what the editor should type — concrete examples]
- **Good example:** `…`
- **Bad example:** `…`
- **Surfaces on:** [where this shows up on the public site]

[…repeat for every kept field…]

**Findings.**

#### <COLL>-001 [P1] [short finding title]
- **File:** [path:line]
- **Observation:** …
- **Why it matters:** …
- **Suggested fix:** …
- **Risk if changed:** low | medium | high

[…repeat per finding…]

---
````

- [ ] **Step 1: Map public surfaces**

Run for each collection:
```bash
grep -rln "blog_posts\|getBlogPost\|listBlogPosts" src/app src/components | sort
grep -rln "glossary_terms\|getGlossary\|listGlossary" src/app src/components | sort
grep -rln "customer_stories" src/app src/components | sort
```
Use the results to fill the **Public surfaces** bullet for each collection.

- [ ] **Step 2: Build the field tables for each collection**

For each of the three collections:
1. List every field in every section by reading the collection's entry in `CMS_COLLECTION_DEFINITIONS_BASE` PLUS the merged-in core fields (`STRIP_PUBLISH_FIELDS_BY_COLLECTION`, `LEGACY_FIELDS_BY_COLLECTION` apply — exclude stripped fields, include legacy ones marked clearly).
2. Look up each field's population percentage in `admin-audit.data.json`. Use `n/a` if the field key isn't present in the sampled data.
3. Apply CMO judgment for the verdict, using:
   - **Population < 5%** AND **not read by any public surface** → strong `remove` candidate.
   - **Field semantically duplicates another** in the same collection → `merge-with-<other>`.
   - **Field is in the wrong section** (e.g. card-only data sitting in publish) → `move-to-<section>`.
   - **Field is heavily used and clear** → `keep`.
   - **Field is heavily used but has issues** (label, type, placeholder) → `keep-but-rework`.
   - **Editorially ambiguous** → `flag-for-product` with a one-line question for the user.

- [ ] **Step 3: Write the per-field documentation**

Only for fields with verdict `keep` or `keep-but-rework`. Skip `remove`/`merge` fields. The documentation paragraph must include a real "good example" and a real "bad example" — these become the editor's reference card.

- [ ] **Step 4: Write findings for the section**

Use ids `BLOG-001`, `GLOSS-001`, `STORY-001` etc. Findings here are collection-specific (e.g. "blog_posts has both `categories` and `blog_category`"). Cross-cutting issues already in Part 1 should not be duplicated — link to them by id instead.

- [ ] **Step 5: Insert and verify**

Replace `<!-- TASK-4A -->` with the three completed collection sections.

Run: `grep -c "^### Collection: " docs/cms/admin-audit.md` → expected: 3.
Run: `grep -nE "TBD|TODO|FIXME" docs/cms/admin-audit.md` → expected: empty.

- [ ] **Step 6: Commit**

```bash
git add docs/cms/admin-audit.md
git -c commit.gpgsign=false commit -m "docs(cms-audit): per-collection deep dive — blog, glossary, customer_stories

CMO-grade field audit and per-module documentation for the three highest-
editorial-volume collections, backed by Firestore population stats.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4B: Part 3 — mid-volume collections (tools, team_members, webinars, ebooks)

**Files:**
- Modify: `docs/cms/admin-audit.md` (replace `<!-- TASK-4B -->`)
- Read: `src/lib/cms/collectionDefinitions.ts` (relevant blocks), `src/lib/cms/usersRepository.ts`, `docs/cms/admin-audit.data.json`, public surfaces located via grep (see step 1)

Apply the **same template, rules, and verdict criteria as Task 4A** to these four collections. Use ids `TOOL-`, `TEAM-`, `WEBINAR-`, `EBOOK-` for findings.

- [ ] **Step 1: Map public surfaces**

```bash
grep -rln "\\btools\\b\\|tools_repo\\|getTool" src/app src/components | sort
grep -rln "team_members\\|getTeamMember\\|listTeamMembers" src/app src/components | sort
grep -rln "webinars" src/app src/components | sort
grep -rln "ebooks" src/app src/components | sort
```

- [ ] **Step 2: Build field tables, per-field docs, findings — for each of the four collections**

Follow exactly Task 4A steps 2-4.

- [ ] **Step 3: Insert and verify**

Replace `<!-- TASK-4B -->` with the four completed sections.

Run: `grep -c "^### Collection: " docs/cms/admin-audit.md` → expected: 7 (3 from 4A + 4 from 4B).

- [ ] **Step 4: Commit**

```bash
git add docs/cms/admin-audit.md
git -c commit.gpgsign=false commit -m "docs(cms-audit): per-collection deep dive — tools, team, webinars, ebooks

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4C: Part 3 — remaining collections (videos, podcasts, faq_topics, faq_questions, customer_reviews, our_customers, review_sources, media_assets)

**Files:**
- Modify: `docs/cms/admin-audit.md` (replace `<!-- TASK-4C -->`)
- Read: `src/lib/cms/collectionDefinitions.ts` (relevant blocks), `docs/cms/admin-audit.data.json`, public surfaces located via grep

Apply the **same template, rules, and verdict criteria as Task 4A** to all eight remaining collections. Use ids `VID-`, `POD-`, `FAQT-`, `FAQQ-`, `REV-`, `OURC-`, `REVSRC-`, `MEDIA-`.

These are smaller and may share patterns — for any field that's identical to a field already documented in 4A/4B (e.g. core SEO fields), the per-field documentation entry may say `See <COLL>.<field> in section above.` to avoid duplication. The verdict and population row in the table is still required per collection.

- [ ] **Step 1: Map public surfaces for all eight**

```bash
for c in videos podcasts faq_topics faq_questions customer_reviews our_customers review_sources media_assets; do
  echo "== $c =="; grep -rln "$c" src/app src/components 2>/dev/null | sort
done
```

- [ ] **Step 2: Build field tables, per-field docs, findings — for each of the eight collections**

Follow Task 4A steps 2-4.

- [ ] **Step 3: Insert and verify**

Replace `<!-- TASK-4C -->`.

Run: `grep -c "^### Collection: " docs/cms/admin-audit.md` → expected: 15.
Run: `grep -nE "TBD|TODO|FIXME" docs/cms/admin-audit.md` → expected: empty.

- [ ] **Step 4: Commit**

```bash
git add docs/cms/admin-audit.md
git -c commit.gpgsign=false commit -m "docs(cms-audit): per-collection deep dive — remaining 8 collections

Completes Part 3: videos, podcasts, faq_topics, faq_questions,
customer_reviews, our_customers, review_sources, media_assets. All 15
collections now have field tables, per-field documentation, and findings.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Part 4 — prioritized fix backlog

**Files:**
- Modify: `docs/cms/admin-audit.md` (replace `<!-- TASK-5 -->`)

Build the executable backlog by walking every finding (`CR-`, `MM-`, and per-collection ids) recorded in Parts 1–3 and assigning each a pass.

- [ ] **Step 1: Classify every finding into a pass**

Rules:
- **Pass 1 — Low-risk now:** label/placeholder fixes, hidden fields, blocking validation that's missing, dead helpers/exports, accessibility nits, doc fixes, removing fields with **0% population AND not referenced anywhere**. Each item is one PR-sized chunk.
- **Pass 2 — Medium-risk next:** field renames or merges (need data backfill scripts), section reshuffles, decomposition of `page.tsx` if Part 1 calls for it, schema changes that don't break consumers. Each item lists its data-migration plan as a precondition.
- **Pass 3 — Needs discussion:** whole-section removal (e.g. AEO/GEO if data confirms zero use), changes that need a content team coordination plan, anything tagged `flag-for-product` in any verdict. Items here become inputs to follow-up brainstorming/spec cycles — they do NOT auto-execute.

- [ ] **Step 2: Write Part 4**

Replace `<!-- TASK-5 -->` with:

````markdown
### Pass 1 — Low-risk now (one PR)

- [ ] **FIX-001 — [short title]**
  - Refs: CR-007, BLOG-014
  - Acceptance: [single concrete observable outcome — e.g. "field `twitterCreatorHandle` no longer rendered in admin publish form"]
  - Migration: none

[…repeat per item…]

### Pass 2 — Medium-risk next (2–3 PRs)

- [ ] **FIX-020 — [short title]**
  - Refs: BLOG-003, GLOSS-002
  - Acceptance: …
  - Migration: [migration script summary, e.g. "for each blog_post, copy `categories` → `blog_category` if blog_category empty, then drop `categories`"]

[…repeat…]

### Pass 3 — Needs discussion (each becomes its own brainstorming cycle)

- [ ] **FIX-040 — [short title]**
  - Refs: MM-005
  - Open question(s): [the decisions that block execution]

[…repeat…]
````

- [ ] **Step 3: Verify cross-references**

Run: `grep -oE "\\b(CR|MM|BLOG|GLOSS|STORY|TOOL|TEAM|WEBINAR|EBOOK|VID|POD|FAQT|FAQQ|REV|OURC|REVSRC|MEDIA)-[0-9]+" docs/cms/admin-audit.md | sort -u > /tmp/audit-ids.txt && grep -oE "Refs: .*" docs/cms/admin-audit.md | grep -oE "\\b(CR|MM|BLOG|GLOSS|STORY|TOOL|TEAM|WEBINAR|EBOOK|VID|POD|FAQT|FAQQ|REV|OURC|REVSRC|MEDIA)-[0-9]+" | sort -u > /tmp/refs-ids.txt && comm -23 /tmp/refs-ids.txt /tmp/audit-ids.txt`

Expected: empty output (every Refs id resolves to a finding heading).

- [ ] **Step 4: Verify no placeholders**

Run: `grep -nE "TBD|TODO|FIXME|\\[fill" docs/cms/admin-audit.md` → expected: empty.

- [ ] **Step 5: Commit**

```bash
git add docs/cms/admin-audit.md
git -c commit.gpgsign=false commit -m "docs(cms-audit): add Part 4 prioritized fix backlog

Three passes (low-risk now, medium-risk next, needs-discussion). Every
backlog item references the originating findings and lists acceptance
criteria plus migration plan when applicable.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Final review and handoff

- [ ] **Step 1: Whole-doc consistency check**

Run: `wc -l docs/cms/admin-audit.md` and confirm reasonable size (expected: 800–2,500 lines depending on finding density).

Run: `grep -c "^### Collection: " docs/cms/admin-audit.md` → expected: 15.
Run: `grep -c "^### CR-" docs/cms/admin-audit.md` → expected: > 0.
Run: `grep -c "^### MM-" docs/cms/admin-audit.md` → expected: > 0.
Run: `grep -nE "<!-- TASK-" docs/cms/admin-audit.md` → expected: empty (all markers replaced).
Run: `grep -nE "TBD|TODO|FIXME" docs/cms/admin-audit.md` → expected: empty.

- [ ] **Step 2: Reading-level pass**

Read the document end to end. Fix any:
- Internal contradictions (a field marked `keep` in the table but `remove` in the verdict prose).
- Findings whose suggested fix references a function/file that doesn't exist.
- Verdicts that conflict with the population data (e.g. `keep` for a field with 0% population unless explicitly justified).

- [ ] **Step 3: Hand back to user**

Print a summary message:
- Path to the audit doc.
- Counts: total findings (per severity), total backlog items per pass.
- Highest-impact recommendations (top 3).
- Next-step prompt: "Audit complete. Want to start Pass 1 (low-risk fixes) — should I open a brainstorming cycle on it?"

---

## Self-review checklist (run before handing off)

- Spec coverage: every Part of the spec has at least one task; every collection in the spec's enumeration appears in 4A/4B/4C.
- Placeholder scan: no TBD/TODO in this plan.
- Type consistency: finding-id prefixes (`CR`, `MM`, `BLOG`, `GLOSS`, `STORY`, `TOOL`, `TEAM`, `WEBINAR`, `EBOOK`, `VID`, `POD`, `FAQT`, `FAQQ`, `REV`, `OURC`, `REVSRC`, `MEDIA`) are used consistently across Tasks 2–5 and the Task-5 grep validator.
- Verdict vocabulary matches spec exactly.
- All bash commands shown are runnable as written.
- No source code under `src/` is modified by any task. Only `docs/cms/` and `scripts/cms-audit/` are touched.
