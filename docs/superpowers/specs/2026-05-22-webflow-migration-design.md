# Webflow → finanshels.com Next.js Migration

**Date:** 2026-05-22
**Status:** Draft — pending user review
**Owner:** meet@finanshels.com
**Related:** [docs/cms-firestore.md](../../cms-firestore.md), `scripts/import-webflow-redirects.mjs`, `src/lib/cms/collectionDefinitions.ts`

## Context

The current production `finanshels.com` is hosted on Webflow. The Next.js 15 + Firestore CMS in this repository is the redesigned replacement, already feature-complete for marketing surfaces and equipped with a full admin (15 collections, revisions, role-based auth, sanitize-html, automatic per-route revalidation). What it lacks is **content**: Firestore is effectively empty.

The job is a net-new migration of 300+ items across ~14 Webflow collections (exact set confirmed during Phase 1 discovery), plus SEO preservation, asset migration, and a safe DNS cutover.

## Goals

1. Migrate all live Webflow content into Firestore (blog, glossary, customer stories, FAQ, team, tools, ebooks, webinars).
2. Migrate all referenced assets from the Webflow CDN to Firebase Storage so we can decommission Webflow.
3. Preserve SEO equity via 301 redirects from every indexed legacy URL and per-item SEO meta.
4. Stand up a staging environment for stakeholder review before DNS cutover.
5. Cut over `finanshels.com` from Webflow to Vercel with a fast, reversible rollback path.
6. Decommission the Webflow subscription within 30 days post-cutover.

## Non-goals

- A pixel-perfect port of the Webflow visual design — the Next.js design is the intentional new direction.
- Migrating Webflow custom code, embed snippets, or third-party widgets that aren't already represented in the new design.
- Onboarding collections that don't exist on Webflow today (e.g. `landing_pages` stays empty until the lead-gen team uses it).
- `media_assets` (internal admin asset tracking, not user-facing content) — populated by editorial uploads, not by migration.
- HubSpot/CRM integrations beyond what `src/app/api/contact/route.ts` and `src/app/api/landing-pages/lead/route.ts` already cover.

## Approach (chosen)

**Phased per-collection importer + staged subdomain cutover.**

One importer module per Webflow collection runs against production Firestore (writes are idempotent by slug; admin-driven). Stage on Vercel preview / `staging.finanshels.com` for stakeholder review. Cut over DNS with a short TTL and a 5-minute rollback path.

### Approaches considered and rejected

- **Big-bang single-pipeline import.** Faster wiring but every failure mode surfaces simultaneously; debugging mixes concerns. Rejected.
- **Curated re-publish (human-in-the-loop on every item).** Best for pruning low-quality content but multi-week editorial cost. Optional opt-in via `--status=draft` import flag for collections where editorial pruning is desired (e.g. blog).

## Architecture

```
┌────────────────────┐    ┌──────────────────────────────┐    ┌──────────────────┐
│ Webflow Data API v2│ →  │ scripts/import/<collection>  │ →  │ collectionRepo   │ → Firestore
└────────────────────┘    │ (rate-limited, idempotent)   │    │ (revisions,      │
                          └──────────────┬───────────────┘    │  revalidation)   │
                                         ↓                    └──────────────────┘
                          ┌──────────────────────────┐
                          │ scripts/import/lib/      │
                          │  - webflowClient         │
                          │  - assetMigrator         │
                          │  - referenceMap          │
                          │  - reportWriter          │
                          └──────────┬───────────────┘
                                     ↓
                          ┌──────────────────────────┐
                          │ Firebase Storage         │
                          │ cms-media/<col>/<slug>/  │
                          └──────────────────────────┘
```

### Components

| File | Responsibility |
|---|---|
| `scripts/import/lib/webflowClient.mjs` | Webflow Data API v2 wrapper: list/get items, rate-limit handling (60 req/min default), pagination. |
| `scripts/import/lib/assetMigrator.mjs` | Download from Webflow CDN, upload to Firebase Storage. Idempotent by hash. Returns new URL. |
| `scripts/import/lib/referenceMap.mjs` | In-memory `webflowItemId → firestoreSlug` map populated during the session. Resolves reference fields. |
| `scripts/import/lib/transform.mjs` | Shared field transformers: `slug`, `richText` (cheerio + sanitize-html), `image`, `reference`, `option`. |
| `scripts/import/lib/writer.mjs` | Idempotent upsert via `collectionRepository`. Honors `--dry-run`. |
| `scripts/import/lib/report.mjs` | Per-collection JSON report to `tmp/import-reports/<col>-<ts>.json`. |
| `scripts/import/<collection>.mjs` | Per-collection driver: declares `WebflowFieldMapping[]`, calls shared infra. |
| `scripts/import/index.mjs` | Orchestrator. Reads `--collection=<name>` or `--all`. Enforces topological order on `--all`. |

### Schema mapping

Each importer declares a declarative mapping table:

```js
// scripts/import/blog_posts.mjs (illustrative)
export const mapping = [
  { from: 'name',            to: 'title',           type: 'direct' },
  { from: 'slug',            to: 'slug',            type: 'slug' },
  { from: 'post-summary',    to: 'excerpt',         type: 'direct' },
  { from: 'post-body',       to: 'body',            type: 'richText' },
  { from: 'main-image',      to: 'cover_image',     type: 'image' },
  { from: 'thumbnail-image', to: 'card_image',      type: 'image' },
  { from: 'author',          to: 'author_ref',      type: 'reference', target: 'team_members' },
  { from: 'category',        to: 'category',        type: 'option', table: { /* webflow option id -> firestore enum */ } },
  { from: 'seo-title',       to: 'seoTitle',        type: 'direct' },
  { from: 'seo-description', to: 'seoDescription',  type: 'direct' },
  { from: 'published-on',    to: 'publishedAt',     type: 'date' },
]
```

Mapping types:

| Type | Behavior |
|---|---|
| `direct` | 1:1 string copy |
| `slug` | normalize: lowercase, dash, transliterate, strip non-URL chars |
| `richText` | parse HTML with cheerio → rewrite `<img>` via assetMigrator → run through existing `src/lib/cms/sanitize.ts` |
| `image` | assetMigrator → Firebase Storage URL |
| `reference` | resolve via referenceMap; warn if unresolved |
| `multiReference` | array of references |
| `option` | explicit Webflow enum → Firestore enum lookup |
| `date` | ISO 8601 string → Firestore Timestamp |
| `boolean` / `number` | typed coercion |

### Topological import order

```
Pass 1 (no refs):
  team_members → our_customers → review_sources → faq_topics →
  glossary_terms → tools → ebooks → webinars → videos → podcasts

Pass 2 (with refs, resolved via referenceMap):
  blog_posts → customer_stories → customer_reviews → faq_questions
```

`scripts/import/index.mjs --all` enforces this order. Per-collection runs are allowed but will warn if dependencies haven't been imported in the current Firestore.

## Asset migration

- **Storage path:** `cms-media/<collection>/<slug>/<original-filename>`. Matches the existing CMS upload convention; reuses Firebase Storage permissions.
- **Idempotency:** before upload, check destination object existence + size + content hash. Skip if matching.
- **Rich-text body images:** during `richText` transform, cheerio walks the document, identifies every `<img>` and `<source>`, downloads via assetMigrator, rewrites `src` / `srcset` to the new Firebase Storage URL. `sanitize-html` runs **after** rewrite so the new URLs are allowlisted.
- **Why not proxy Webflow CDN long-term:** when the Webflow subscription ends, those URLs 404. Full migration removes the dependency.
- **Cost estimate:** measured after Phase 3 (independent collections imported, no rich-text body images yet). Phase 5 reruns blog + customer_stories importers with `--rewrite-body-images` to do the sweep. Firebase Storage budget alert configured before Phase 5.

## SEO preservation

### Redirects

- Run `node scripts/import-webflow-redirects.mjs <gsc-export.csv>` to generate candidate redirect entries.
- Hand-curate the output against these rules:
  - `/blog/<slug>` → `/blog/<slug>` (slug preserved unless Webflow had non-conforming chars)
  - `/glossary/<slug>` → `/glossary/<slug>`
  - Marketing routes: explicit table (e.g. `/about-us` → `/about`)
  - Unmatched: `/?from=webflow&path=<encoded>` — guarantees no legacy URL ever 404s.
- Paste the result into `legacyRedirects()` in `next.config.mjs`. Commit.

### Meta

- Importer copies `seo-title` / `seo-description` per Webflow item → Firestore `seoTitle` / `seoDescription`.
- `defaultSchemaType` on each collection definition + optional `schema_type_override` per doc covers JSON-LD. No code change.

### Sitemap & `llms.txt`

- `src/app/sitemap.ts` and `src/app/llms.txt/` already pick up Firestore content via the existing repository layer. Once content lands, both surfaces populate automatically.
- Verify: after Phase 3, hit `/sitemap.xml` on staging and confirm the new entries appear.

### Search Console

- Add the Vercel production domain as a Search Console property pre-cutover.
- Submit the new `/sitemap.xml` URL.
- On T+0, request URL inspection of the top-20 GSC pages (smoke check).
- "Change of address" tool is **not** needed (hostname stays `finanshels.com`).
- Monitor old property for 30 days; 301s should redirect crawlers cleanly.

## Staging

- Deploy to `staging.finanshels.com` (preferred) or rely on Vercel preview URLs.
- **Noindex enforcement:** gated by hostname in `src/app/robots.ts` and via `X-Robots-Tag: noindex` header. Hostname check is the safety net — if production accidentally points at the wrong env, robots still says noindex on `staging.*`.
- **Single Firestore project** for staging + production. Draft-status content is admin-only and not rendered on public routes — that's the existing isolation mechanism.

## Cutover plan

| T | Action | Owner | Verification |
|---|---|---|---|
| T-14d | Final feature freeze on Next.js side | eng | git tag `migration-freeze-<date>` |
| T-7d | Drop DNS TTL on `finanshels.com` A/AAAA records to 300s | infra | `dig finanshels.com` shows TTL ≤ 300 |
| T-3d | Final importer dry-run + production run | eng | per-collection report files clean |
| T-2d | Content QA pass on staging | content + design | sign-off in shared doc |
| T-1d | Webflow custom-code freeze; Search Console URL inspection pre-baselined | eng + SEO | screenshot top-20 ranking |
| T-0 | DNS A/AAAA flip to Vercel (Vercel-provided records); `www` CNAME to `cname.vercel-dns.com` | infra | `curl -I https://finanshels.com` returns `server: Vercel` |
| T+1h | Lighthouse mobile + structured-data validator on top-20 URLs | eng | scores recorded, no JSON-LD errors |
| T+6h | Vercel log review: 4xx/5xx baseline | eng | error rate < 0.5% |
| T+24h | Broken-link sweep across `/sitemap.xml` | eng | zero internal 404s |
| T+7d | Archive Webflow site (don't cancel) | ops | screenshot, asset export downloaded |
| T+30d | Cancel Webflow subscription | ops | confirm Search Console reindex complete |

### Rollback

- **Trigger:** sustained 5xx > 5% over 5 min, or stakeholder rollback call.
- **Action:** revert A/AAAA records to Webflow IPs. TTL is 300s → propagation ≤ 5 min.
- **State preserved:** Webflow site untouched until T+7d. Firestore content unaffected.
- **Post-rollback:** root-cause review, fix forward, schedule new cutover window.

## Testing

| Layer | What | Where |
|---|---|---|
| Unit | Transform functions (slug, richText, option, image, reference) | `scripts/import/lib/__tests__/` |
| Integration | Per-collection import on a sample of 5 Webflow items, write to a `finanshels-test` Firestore project | `scripts/import/<col>.test.mjs` |
| Dry-run | `--dry-run` flag on every importer prints diff without writing | every importer |
| Smoke | Post-cutover script hits every route group + 5 random items per collection | `scripts/smoke-test.mjs` (new) |
| Visual | Stakeholder QA on staging — per-collection checklist | manual, signed in shared doc |
| Link | Crawl `/sitemap.xml` for internal 404s | `scripts/link-check.mjs` (new) |

Coverage target on `scripts/import/lib/`: ≥ 80% per project standard.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Webflow rich-text contains malformed HTML breaking sanitize-html | Med | Med | per-item error logged, item written with empty body + warning; manual triage from report |
| Reference resolution misses (Webflow author deleted but post still references) | Med | Low | unresolved refs logged; post imports with null author; report flags for review |
| Asset migration balloons Firebase Storage cost | Med | Med | budget alert before Phase 5; measure post-Phase 3 |
| Webflow API rate limit during full pull | Low | Low | rate-limited client with exponential backoff |
| DNS TTL not actually 300s at cutover (cached at registrar) | Low | High | verify TTL drop 24h before T-0; if not honored, push cutover 24h |
| SEO ranking dip post-cutover | Med | Med | comprehensive 301 map; submit sitemap + URL inspection; monitor 30 days; keep Webflow as fallback rollback target |
| `firebase-admin` accidentally pulled into client bundle by importer changes | Low | High | importer lives under `scripts/` (Node-only); standard `npm run build` catches if it leaks |

## Phases & ownership

| Phase | Work | Elapsed | Exit criteria |
|---|---|---|---|
| 1 | Webflow discovery — schema + counts dump | 1–2 d | `tmp/import-reports/discovery.json` shows every collection + field + count |
| 2 | Importer infra — client, assets, writer, report | 3 d | unit tests pass; dry-run on one collection works end-to-end |
| 3 | Independent collections (10 collections, no refs) | 3–5 d | all 10 collections imported on staging; admin renders correctly |
| 4 | Dependent collections (4 collections, with refs) | 3–5 d | references resolved ≥ 95%; unresolved logged for review |
| 5 | Asset sweep + rich-text body image rewrite | 2–3 d | zero remaining Webflow CDN references in Firestore docs |
| 6 | Redirects + staging deploy + noindex enforcement | 2 d | `legacyRedirects()` populated; `staging.finanshels.com` live with `noindex` |
| 7 | Stakeholder review + content QA | ~1 wk | sign-off doc complete |
| 8 | Cutover + monitoring | 1 d exec + 1 wk watch | cutover plan table all green |
| 9 | Webflow decom | T+30d | subscription cancelled, assets archived |

**Total elapsed:** ~4–5 weeks.

## Open questions

- Webflow API token scope and ownership: who provisions the read-only API token, and where does it live (1Password? Vercel env)? **Decision needed before Phase 2.**
- Staging hostname: `staging.finanshels.com` vs Vercel preview URL — convenience vs. cost. Recommendation: `staging.finanshels.com` because stakeholder review is the main use case and a memorable URL helps.
- Webflow forms: are there any active Webflow forms beyond what `/api/contact` and `/api/landing-pages/lead` already cover? **Audit during Phase 1.**

## Out-of-scope follow-ups

- Long-term Webflow asset archival (export, S3 cold-storage) — track separately if compliance requires.
- Editorial content audit of imported blog archive — can run anytime post-launch using the existing `draft → published` workflow.
- Migration of analytics events from any Webflow-specific tracking to the consolidated Vercel/PostHog setup.
