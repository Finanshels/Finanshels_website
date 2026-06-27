# Tools Hub + CMS-Driven Tool Pages — Design

**Date:** 2026-06-28
**Status:** Approved for planning
**Author:** meet@finanshels.com (with Claude)

## 1. Problem & context

Finanshels' navbar promises **7 interactive tools** (calculators + benchmarks/checks) as lead magnets, but **all 7 URLs 404 today**. There is **no tools hub**. Three overlapping systems each partially model "a tool" but none renders one publicly:

| System | Where | State |
|---|---|---|
| `tools` CMS collection | `src/lib/cms/collectionDefinitions.ts:750` | Full calculator field schema, but **admin-only** — blocklisted from the generic `/content/[collection]/[slug]` route (FIX-048) because it has no dedicated route or renderer. No `routePattern`/`listingRoute`. |
| Landing-pages | `src/lib/landing-pages/`, `src/components/landing-pages/` | Firestore block-based pages with a complete lead pipeline (`writeLead` → Zoho + Ads conversion + email notify + Turnstile). Not tools. |
| Products | `src/content/products.ts` | 6 hardcoded marketing pages at `/products/[slug]` — marketing copy, **not interactive tools**. |

The navbar tool links and their (currently dead) hrefs (`src/components/layout/Navbar.jsx`):

| Label | Current href | Group |
|---|---|---|
| Cash Flow | `/cash-flow-management-calculator` | Calculators |
| Gratuity | `/gratuity-calculator` | Calculators |
| VAT | `/vat-calculator` | Calculators |
| E-Invoicing | `/einvoicing-tax-calculator` | Calculators |
| Salary Benchmark | `/accounting-finance-salary-benchmark` | Benchmarks & Checks |
| Finance Health Check | `/business-finance-health-checker` | Benchmarks & Checks |
| CT Deadline Check | `/corporate-tax-deadline-checker` | Benchmarks & Checks |

## 2. Goals & non-goals

**Goals**
1. Build a **repeatable factory**: a `/tools` hub + `/tools/[slug]` template + widget registry + lead capture so each new tool = "code one widget + fill one CMS doc."
2. Ship **4 flagship tools** end-to-end: VAT Calculator, Gratuity Calculator, CT Deadline Checker, Finance Health Check.
3. **Kill all 7 navbar 404s.**
4. Maximize lead gen via a **soft-gate-at-the-result** default with a per-tool intensity knob.

**Non-goals (this iteration)**
- The 3 remaining tools (Cash Flow, E-Invoicing, Salary Benchmark) — their navbar links point at the `/tools` hub for now (no 404). Salary Benchmark additionally needs a sourced dataset first.
- Migrating `products.ts` or landing-pages into the tools system.
- A bespoke per-tool visual identity (home4-style). Tools use the standard Inter brand, conversion-focused.

## 3. Locked decisions

| Decision | Choice | Rationale |
|---|---|---|
| Lead mechanic | **Soft-gate at the result**, per-tool intensity via `gated` + `lead_capture_enabled` | Free tool = SEO/trust/reach magnet; full report/breakdown = the conversion, captured at peak intent with a **work email**. Always-on secondary CTA → matching service. Utility tools stay open; data/report tools gate harder. |
| Architecture | **A: CMS-wrapped, code-powered** | The `tools` collection owns the marketing shell + SEO + gate config; a code registry keyed by `tool_route_key` owns the interactive widget. Marketing edits copy/SEO; devs code widget logic once. |
| v1 scope | **Framework + hub + 4 flagship widgets** | Prove the pattern end-to-end, then fan out. |
| Canonical URL | **`/tools/[slug]`** | Clean hub IA + breadcrumbs; `routePattern`/`listingRoute` auto-wire revalidation, sitemap, llms.txt — exactly like `glossary`. Stays blocklisted from the generic `/content` route. |

## 4. Architecture

```
CMS `tools` doc  ──────────►  marketing shell (hero, benefits, FAQ, SEO, gate config, related service, card_*)
registry[tool_route_key] ──►  the interactive widget (coded React component, lazy-loaded)
/api/tools/lead ──────────►  lead capture (wraps existing writeLead → Zoho + Ads conversion + notify + Turnstile)

Routes (App Router):
  src/app/tools/page.tsx           → /tools         hub (server component)
  src/app/tools/[slug]/page.tsx    → /tools/[slug]  tool page (server shell + lazy client widget)
```

Specific `/tools` and `/tools/[slug]` segments take precedence over the marketing `[...slug]` catch-all, so no collision. The `tools` collection definition gains `routePattern: '/tools/[slug]'` + `listingRoute: '/tools'` (revalidation/sitemap/llms.txt) while **remaining in `SENSITIVE_GENERIC_ROUTE_BLOCKLIST`** so the generic `/content` route still refuses it (no raw-JSON leak of `tool_embed_code`). This is the established glossary pattern.

### 4.1 Tool page anatomy (`/tools/[slug]`)

Server component reads the published doc, renders the shell, and mounts the widget via the registry:

```
Breadcrumb: Tools › VAT Calculator
HERO         tool_name + short_description + trust strip
WIDGET       interactive; instant headline result shown FREE
  result     headline result (free)
  soft gate  full breakdown / report → ToolLeadForm (work email)   [if gated + lead_capture_enabled]
  CTA        secondary: related_service_label → related_service_url ("Book a call")
BENEFITS     from benefits[]
FAQ          from faq_items refs → FAQPage JSON-LD
RELATED      related tools + related service CTA
JSON-LD:     SoftwareApplication (defaultSchemaType) + FAQPage
```

### 4.2 Widget layer (clean separation, testable)

```
src/lib/tools/                ← PURE logic, no React, unit-tested first (TDD)
  vat.ts            calcVat(amount, ratePct, direction)        → { vat, net, gross }
  gratuity.ts       calcGratuity(basicSalaryMonthly, years, reason) → breakdown
  ctDeadline.ts     ctDeadlines(input)                         → { registrationDueBy, firstFilingDueBy, notes }
  financeHealth.ts  scoreHealth(answers)                       → { score, band, factors[] }
  types.ts          shared ToolWidgetProps, gate types

src/components/tools/
  registry.tsx      ToolRouteKey → dynamic(() => import('./widgets/...'))   (one map; the ONLY place keys are wired)
  ToolShell.tsx     server-rendered shell pieces (hero, benefits, faq, related)
  ToolLeadForm.tsx  client form → POST /api/tools/lead (models LeadForm.tsx; Turnstile + result snapshot)
  ToolResult.tsx    shared result + soft-gate wrapper (reads gate config)
  widgets/
    VatCalculator.tsx
    GratuityCalculator.tsx
    CtDeadlineChecker.tsx
    FinanceHealthCheck.tsx
```

Every widget is a focused client component (target <300 lines). All arithmetic/date/scoring logic lives in `src/lib/tools/*` (no React) so it is unit-testable without rendering and reusable server-side. Adding tool #5 = one `src/lib/tools/x.ts` + one widget + one registry line + one CMS doc.

> **⚠ Regulatory accuracy gate (CRITICAL).** Gratuity, Corporate Tax, and VAT logic carry legal/financial liability — wrong numbers damage trust and create exposure. The pure-logic modules MUST be implemented from **current official UAE sources** (MOHRE end-of-service rules; FTA Corporate Tax registration & filing timelines incl. FTA Decision No. 3 of 2024; FTA VAT 5% standard/zero-rated/exempt guidance), researched during implementation (research-first workflow) — **not** hand-coded from model memory — and the formulas/thresholds reviewed by the Finanshels finance team before publish. Each module carries inline source citations + an "as-of" date constant.

### 4.3 Lead capture (reuse, don't rebuild)

New thin endpoint `src/app/api/tools/lead/route.ts` wraps the **existing** pipeline:
- `writeLead()` → `landing_page_leads` with `source: 'tool:<slug>'` + a **result snapshot** (the user's inputs + computed result) stored for sales context.
- Zoho sync, Google Ads/Meta conversion (`gtag.ts`), email notify (`leadNotification.ts`), Turnstile bot-check (`turnstile.ts`) — all reused.
- `service_interest` set from the tool's `related_services` so the lead routes correctly in Zoho.

No new lead infrastructure; one wrapper route + one `ToolLeadForm` client component.

## 5. CMS field changes to `tools`

Existing fields kept. Additions follow CMS invariants (atomic changes; reuse existing field types so `fieldCodec.ts` needs no new codec — to be confirmed during build):

- **`hub_group`** — `select`: `Calculators` | `Benchmarks & Checks` (drives hub grouping to match the navbar).
- **SEO / AEO / GEO sections** + **card_* fields** (`card_title`, `card_description`, `card_eyebrow`) — per the card/listing/detail symmetry rule; the hub cards and `<head>` read these, never `tool_name`/`short_description` directly (renderer fallback only).
- **Lead/CTA config:** `cta_headline`, `gated_output_label`, `lead_magnet_description`, `related_service_url`, `related_service_label`.
- **Ordering:** `featured` + `sort_order` — verify whether these are already appended by the global listing fields before adding (do not duplicate).

`routePattern: '/tools/[slug]'` and `listingRoute: '/tools'` added to the definition. `defaultSchemaType` stays `SoftwareApplication`.

## 6. The 4 flagship tools (logic specs)

> All thresholds/rules below are **indicative** and MUST be verified against current official sources during build (§4.2 gate).

> **Gate terminology:** *soft-gate* = headline result free, the detailed breakdown/report is the gated lead magnet. *open* = full result free, lead capture is an optional CTA only.

### 6.1 VAT Calculator — `tool_route_key: vat-calculator`, `tool_type: calculator`, **gate: soft-gate the breakdown**
- Inputs: amount, VAT rate (default 5%), direction (`add` net→gross / `remove` gross→net), optional treatment (standard / zero-rated / exempt).
- Output (free): VAT amount, net, gross.
- Gated: downloadable breakdown + VAT filing checklist.
- Secondary CTA → VAT filing/registration service.

### 6.2 Gratuity Calculator — `tool_route_key: gratuity-calculator`, `tool_type: calculator`, **gate: soft-gate the breakdown**
- Inputs: basic monthly salary, total service (years/months), separation reason (resignation / termination), contract context per current UAE law.
- Output (free): total end-of-service gratuity headline.
- Gated: itemized breakdown (per-period days, daily-wage basis, caps).
- Logic indicative: daily wage = basic/30; ≥1yr → 21 days/yr for first 5 yrs, 30 days/yr thereafter; <1yr → none; capped at 2 years' total salary. **Verify against current MOHRE rules.**

### 6.3 CT Deadline Checker — `tool_route_key: corporate-tax-deadline-checker`, `tool_type: checker`, **gate: open** (utility/trust play; lead via "remind me / we'll file it" CTA)
- Inputs: trade-license issue date (or month) and/or financial-year end; resident/free-zone context.
- Output (free): corporate-tax registration deadline + first tax return filing deadline.
- Gated/CTA: "Set a reminder" + "We'll handle your CT filing → book a call".
- Logic indicative: registration deadline per FTA Decision No. 3 of 2024 (by license-issue month for existing licensees); first filing due 9 months after the first tax period ends. **Verify against current FTA guidance.**

### 6.4 Finance Health Check — `tool_route_key: business-finance-health-check`, `tool_type: quiz`, **gate: soft-gate the diagnosis**
- Inputs: 8–12 weighted questions across liquidity, profitability, cash runway, receivables discipline, compliance posture.
- Output (free): overall score (0–100) + band (At risk / Needs attention / Healthy / Strong).
- Gated: full diagnosis + prioritized recommendations + benchmark context (the lead magnet).
- Secondary CTA → CFO/accounting service.

**Slugs (doc IDs):** `vat-calculator`, `gratuity-calculator`, `corporate-tax-deadline-checker`, `business-finance-health-check`.

## 7. Hub (`/tools`)

Server component. Lists **published** tools (`listCmsDocuments`), grouped by `hub_group` (Calculators / Benchmarks & Checks), ordered by `featured` then `sort_order`. Client-side search/filter. Cards render from `card_*`. `ItemList` JSON-LD + listing metadata. Optionally shows the 3 not-yet-built tools as "Coming soon" (non-clickable) — decided at build.

## 8. Navbar, SEO surfaces, redirects

- **Navbar** (`src/components/layout/Navbar.jsx`): repoint the 4 built links to `/tools/<slug>`; point the 3 unbuilt (Cash Flow, E-Invoicing, Salary Benchmark) at `/tools`. All 7 404s gone.
- **Sitemap + llms.txt:** auto-include via `routePattern`/`listingRoute` (verify `tools` is picked up by `src/app/sitemap.ts` and `llms.txt`).
- **Firestore index:** add composite (`status` ASC + `sort_order` ASC) for the hub query to `firestore.indexes.json`; `npm run firebase:deploy`.
- **Redirects:** legacy `/tools/<long-slug>` paths in `src/lib/staticPageRoutes.ts` 301 → new canonical `/tools/<slug>` where they map; otherwise leave to catch-all.

## 9. Testing

- **Unit (TDD, first):** `src/lib/tools/*` — VAT math, gratuity tiers/caps/edge cases (<1yr, exactly 5yr, cap hit), CT deadline date logic, health-check scoring bands. Target ≥80% on these modules.
- **Integration:** `/api/tools/lead` writes a lead with correct `source` + snapshot and triggers Zoho/conversion (mocked).
- **E2E (Playwright):** load `/tools` → open VAT calculator → compute → submit gated form → lead recorded. Smoke the other 3.
- **Manual:** `/admin/cms` → create/edit a tool doc → publish → verify `/tools` + `/tools/[slug]` render and revalidate (per CMS "when you're done" checklist).

## 10. Sequencing (phases)

1. **Framework:** CMS field changes + `routePattern`/`listingRoute` + un-leak guard; `/tools/[slug]` server shell; `registry.tsx`; `ToolShell`/`ToolResult`/`ToolLeadForm`; `/api/tools/lead`; Firestore index.
2. **Hub:** `/tools` page + cards + grouping/search + JSON-LD; navbar repoint; sitemap/llms.txt verify.
3. **Widgets (TDD per tool):** VAT → Gratuity → CT Deadline → Finance Health (logic module + tests first, then widget, then CMS doc, then finance-team accuracy review).
4. **Polish & verify:** redirects, E2E, `/deploy-check`.

## 11. Risks & open items

- **Regulatory accuracy** (§4.2) — highest risk; gated behind finance-team review before publish.
- **`fieldCodec.ts`** — confirm no new field *type* is introduced (expected: none). If any is, update codec atomically.
- **Result snapshot privacy** — the lead snapshot stores user inputs (salary, financials). Confirm this is acceptable for sales use and within the privacy policy; do not store more than needed.
- **Finance Health Check question set** — exact questions/weights need a short content pass with the finance team.
