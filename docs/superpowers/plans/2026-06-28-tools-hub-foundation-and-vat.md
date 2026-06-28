# Tools Hub Foundation + VAT Calculator — Implementation Plan (Plan A)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the reusable tools framework (CMS-wrapped, code-powered) plus the `/tools` hub and one live reference tool — the VAT Calculator — end-to-end with soft-gate lead capture.

**Architecture:** The `tools` CMS collection owns each tool's marketing shell + SEO + gate config (source of truth). A code registry keyed by `tool_route_key` owns the interactive widget. A dedicated `/tools/[slug]` server route renders the shell and lazy-mounts the widget; `/tools` is the hub. Lead capture reuses the existing landing-pages pipeline (`writeLead` → Zoho + Resend + Turnstile) via a thin `/api/tools/lead` wrapper. `tools` stays blocklisted from the generic `/content` route (renders via its own route, exactly like `glossary`).

**Tech Stack:** Next.js 15 App Router, React 18, TypeScript, Firestore (firebase-admin, server-only), Zod, Tailwind, `node:test` + `tsx` for unit tests.

**Spec:** [docs/superpowers/specs/2026-06-28-tools-hub-and-tool-pages-design.md](../specs/2026-06-28-tools-hub-and-tool-pages-design.md). This plan covers the framework + hub + VAT only (spec §10 Phase 1–2). Gratuity, CT Deadline, and Finance Health Check are separate plans (each needs official-source research per spec §4.2).

---

## File structure

**Create:**
- `src/lib/tools/types.ts` — shared widget/gate types (no React, no server-only).
- `src/lib/tools/vat.ts` — pure VAT math.
- `src/lib/tools/__tests__/vat.test.ts` — unit tests.
- `src/lib/cms/schemas/tools.ts` — Zod `parseTool` + `Tool` type.
- `src/lib/cms/toolsRepository.ts` — `getToolBySlug`, `listPublishedTools`, sitemap slugs (server-only).
- `src/components/tools/registry.tsx` — `tool_route_key` → lazy widget.
- `src/components/tools/ToolLeadForm.tsx` — client lead form → `/api/tools/lead`.
- `src/components/tools/ToolResult.tsx` — free-result + soft-gate wrapper (client).
- `src/components/tools/widgets/VatCalculator.tsx` — VAT widget (client).
- `src/components/tools/ToolsHubGrid.tsx` — client hub grid with search.
- `src/app/tools/page.tsx` — hub (server).
- `src/app/tools/[slug]/page.tsx` — tool page (server).
- `src/app/api/tools/lead/route.ts` — lead endpoint.

**Modify:**
- `src/lib/cms/collectionDefinitions.ts` — extend `tools` publish fields + `routePattern`/`listingRoute`.
- `src/lib/cms/firestore.ts` — ensure `COLLECTIONS.tools` exists.
- `src/lib/landing-pages/repository.ts` — extend `LeadWriteInput`/`writeLead` with optional `source` + `extra`.
- `src/components/layout/Navbar.jsx` — repoint the 7 tool hrefs.
- `firestore.indexes.json` — add `tools` (`status` + `sort_order`) composite index.
- `package.json` — add `test:unit` script.

---

## Task 1: VAT pure-logic module (TDD)

**Files:**
- Create: `src/lib/tools/types.ts`
- Create: `src/lib/tools/vat.ts`
- Test: `src/lib/tools/__tests__/vat.test.ts`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Add the unit-test script**

In `package.json`, add to `"scripts"` (next to the existing `webflow:test`):

```json
"test:unit": "node --import tsx --test \"src/lib/tools/__tests__/*.test.ts\""
```

- [ ] **Step 2: Create the shared tool types**

Create `src/lib/tools/types.ts`:

```typescript
/** Shared, framework-level types for interactive tools. Pure — no React, no server-only. */

/** Gate intensity for a tool's result. */
export type ToolGate = 'open' | 'soft'

/** Stable identifier used to wire a CMS tool doc to its coded widget. */
export type ToolRouteKey =
  | 'vat-calculator'
  | 'gratuity-calculator'
  | 'corporate-tax-deadline-checker'
  | 'business-finance-health-check'

/** Props every widget receives from the tool page shell. */
export interface ToolWidgetProps {
  slug: string
  gate: ToolGate
  /** CMS toggle — when false the full result is shown without a lead form. */
  leadCaptureEnabled: boolean
  /** CTA text shown on the gated panel, e.g. "Email me the full breakdown". */
  gatedOutputLabel: string
  /** Short sentence describing the gated lead magnet. */
  leadMagnetDescription: string
  /** Zoho service routing key from the tool's related_services. */
  serviceInterest: string
}
```

- [ ] **Step 3: Write the failing test**

Create `src/lib/tools/__tests__/vat.test.ts`:

```typescript
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calcVat, VAT_STANDARD_RATE } from '../vat'

test('standard UAE VAT rate is 5 percent', () => {
  assert.equal(VAT_STANDARD_RATE, 5)
})

test('add: VAT on a net amount at 5%', () => {
  const r = calcVat({ amount: 1000, ratePct: 5, direction: 'add' })
  assert.equal(r.net, 1000)
  assert.equal(r.vat, 50)
  assert.equal(r.gross, 1050)
})

test('remove: extract VAT from a gross amount at 5%', () => {
  const r = calcVat({ amount: 1050, ratePct: 5, direction: 'remove' })
  assert.equal(r.net, 1000)
  assert.equal(r.vat, 50)
  assert.equal(r.gross, 1050)
})

test('rounds to 2 decimals', () => {
  const r = calcVat({ amount: 99.99, ratePct: 5, direction: 'add' })
  assert.equal(r.vat, 5)
  assert.equal(r.gross, 104.99)
})

test('zero rate yields zero VAT', () => {
  const r = calcVat({ amount: 500, ratePct: 0, direction: 'add' })
  assert.equal(r.vat, 0)
  assert.equal(r.gross, 500)
})

test('negative amount throws', () => {
  assert.throws(() => calcVat({ amount: -1, ratePct: 5, direction: 'add' }))
})

test('rate outside 0–100 throws', () => {
  assert.throws(() => calcVat({ amount: 100, ratePct: 101, direction: 'add' }))
})
```

- [ ] **Step 4: Run the test, verify it fails**

Run: `npm run test:unit`
Expected: FAIL — `Cannot find module '../vat'`.

- [ ] **Step 5: Implement the VAT module**

Create `src/lib/tools/vat.ts`:

```typescript
/**
 * UAE VAT math. The standard rate (5%) is the FTA standard-rated supply rate
 * as of 2026-06. Zero-rated / exempt supplies are modelled by passing ratePct: 0.
 * Source: FTA VAT (Federal Decree-Law No. 8 of 2017). Verify rate if FTA changes it.
 */
export const VAT_STANDARD_RATE = 5 as const

export type VatDirection = 'add' | 'remove'

export interface VatInput {
  /** When direction='add' this is the NET amount; when 'remove' it is the GROSS amount. */
  amount: number
  ratePct: number
  direction: VatDirection
}

export interface VatResult {
  net: number
  vat: number
  gross: number
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

export function calcVat(input: VatInput): VatResult {
  const { amount, ratePct, direction } = input
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error('amount must be a non-negative number')
  }
  if (!Number.isFinite(ratePct) || ratePct < 0 || ratePct > 100) {
    throw new Error('ratePct must be between 0 and 100')
  }

  const rate = ratePct / 100
  if (direction === 'add') {
    const net = round2(amount)
    const vat = round2(amount * rate)
    return { net, vat, gross: round2(net + vat) }
  }

  // remove: amount is gross, back out the net and VAT
  const net = round2(amount / (1 + rate))
  const gross = round2(amount)
  return { net, vat: round2(gross - net), gross }
}
```

- [ ] **Step 6: Run the test, verify it passes**

Run: `npm run test:unit`
Expected: PASS — all 7 tests green.

- [ ] **Step 7: Commit**

```bash
git add src/lib/tools/types.ts src/lib/tools/vat.ts src/lib/tools/__tests__/vat.test.ts package.json
git commit -m "feat(tools): VAT pure-logic module + unit test harness"
```

---

## Task 2: Tools Zod schema + repository

**Files:**
- Create: `src/lib/cms/schemas/tools.ts`
- Create: `src/lib/cms/toolsRepository.ts`
- Modify: `src/lib/cms/firestore.ts` (confirm `COLLECTIONS.tools`)
- Test: `src/lib/tools/__tests__/toolSchema.test.ts`

- [ ] **Step 1: Confirm the Firestore collection key exists**

Run: `grep -n "tools" src/lib/cms/firestore.ts`
If `COLLECTIONS` has no `tools` entry, add it to the `COLLECTIONS` object (match the existing style, e.g. alongside `glossaryTerms`):

```typescript
  tools: 'tools',
```

Expected end state: `COLLECTIONS.tools === 'tools'`.

- [ ] **Step 2: Write the failing schema test**

Create `src/lib/tools/__tests__/toolSchema.test.ts`:

```typescript
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseTool } from '../../cms/schemas/tools'

const RAW = {
  slug: 'vat-calculator',
  status: 'published',
  tool_name: 'UAE VAT Calculator',
  short_description: 'Add or remove 5% VAT in seconds.',
  tool_route_key: 'vat-calculator',
  hub_group: 'Calculators',
  gated: true,
  lead_capture_enabled: true,
  related_services: ['vat'],
  benefits: ['Instant 5% VAT', 'Filing checklist'],
}

test('parses a valid published tool', () => {
  const t = parseTool(RAW, 'vat-calculator')
  assert.ok(t)
  assert.equal(t!.slug, 'vat-calculator')
  assert.equal(t!.toolRouteKey, 'vat-calculator')
  assert.equal(t!.hubGroup, 'Calculators')
  assert.equal(t!.gate, 'soft')
  assert.deepEqual(t!.benefits, ['Instant 5% VAT', 'Filing checklist'])
})

test('gate is "open" when gated is false', () => {
  const t = parseTool({ ...RAW, gated: false }, 'vat-calculator')
  assert.equal(t!.gate, 'open')
})

test('returns null when required fields missing', () => {
  const t = parseTool({ status: 'published' }, 'broken')
  assert.equal(t, null)
})
```

- [ ] **Step 3: Run the test, verify it fails**

Run: `npm run test:unit`
Expected: FAIL — `Cannot find module '../../cms/schemas/tools'`.

- [ ] **Step 4: Implement the schema**

Create `src/lib/cms/schemas/tools.ts`:

```typescript
import { z } from 'zod'
import type { ToolGate, ToolRouteKey } from '@/lib/tools/types'

const statusSchema = z.enum(['draft', 'in_review', 'approved', 'scheduled', 'published'])

/** Shape consumed by the tool page shell + hub. Only fields the public surface reads. */
export interface Tool {
  id: string
  slug: string
  status: z.infer<typeof statusSchema>
  toolName: string
  shortDescription: string
  fullDescription?: string
  toolRouteKey: ToolRouteKey
  hubGroup: 'Calculators' | 'Benchmarks & Checks'
  gate: ToolGate
  leadCaptureEnabled: boolean
  ctaHeadline?: string
  gatedOutputLabel: string
  leadMagnetDescription: string
  relatedServiceUrl?: string
  relatedServiceLabel?: string
  serviceInterest: string
  benefits: string[]
  faqRefs: string[]
  icon?: string
  // SEO (globally-appended CMS fields)
  seoTitle?: string
  metaDescription?: string
  canonicalUrl?: string
  ogImage?: string
  // Hub card (globally-appended CMS fields)
  cardDescription?: string
  featured: boolean
  sortOrder: number
}

function strArr(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string')
  return []
}

const rawSchema = z.object({
  slug: z.string().min(1),
  status: statusSchema.default('draft'),
  tool_name: z.string().min(1),
  short_description: z.string().min(1),
  full_description: z.string().optional(),
  tool_route_key: z.string().min(1),
  hub_group: z.enum(['Calculators', 'Benchmarks & Checks']).default('Calculators'),
  gated: z.boolean().default(false),
  lead_capture_enabled: z.boolean().default(false),
  cta_headline: z.string().optional(),
  gated_output_label: z.string().optional(),
  lead_magnet_description: z.string().optional(),
  related_service_url: z.string().optional(),
  related_service_label: z.string().optional(),
  related_services: z.unknown().optional(),
  benefits: z.unknown().optional(),
  faq_items: z.unknown().optional(),
  icon: z.string().optional(),
  seo_title: z.string().optional(),
  meta_description: z.string().optional(),
  canonical_url: z.string().optional(),
  og_image: z.string().optional(),
  card_description: z.string().optional(),
  featured: z.boolean().default(false),
  sort_order: z.coerce.number().default(0),
})

/** Parse a raw Firestore tool doc. Returns null on invalid/insufficient data (never throws). */
export function parseTool(raw: unknown, id: string): Tool | null {
  const parsed = rawSchema.safeParse(raw)
  if (!parsed.success) return null
  const d = parsed.data
  const services = strArr(d.related_services)
  return {
    id,
    slug: d.slug,
    status: d.status,
    toolName: d.tool_name,
    shortDescription: d.short_description,
    fullDescription: d.full_description,
    toolRouteKey: d.tool_route_key as ToolRouteKey,
    hubGroup: d.hub_group,
    gate: d.gated ? 'soft' : 'open',
    leadCaptureEnabled: d.lead_capture_enabled,
    ctaHeadline: d.cta_headline,
    gatedOutputLabel: d.gated_output_label || 'Email me the full breakdown',
    leadMagnetDescription:
      d.lead_magnet_description || 'Get the detailed breakdown and a filing checklist.',
    relatedServiceUrl: d.related_service_url,
    relatedServiceLabel: d.related_service_label,
    serviceInterest: services[0] || 'general',
    benefits: strArr(d.benefits),
    faqRefs: strArr(d.faq_items),
    icon: d.icon,
    seoTitle: d.seo_title,
    metaDescription: d.meta_description,
    canonicalUrl: d.canonical_url,
    ogImage: d.og_image,
    cardDescription: d.card_description,
    featured: d.featured,
    sortOrder: d.sort_order,
  }
}
```

- [ ] **Step 5: Run the test, verify it passes**

Run: `npm run test:unit`
Expected: PASS — VAT tests + 3 schema tests green.

- [ ] **Step 6: Implement the repository (mirrors glossaryRepository)**

Create `src/lib/cms/toolsRepository.ts`:

```typescript
import 'server-only'
import { COLLECTIONS, getDb } from './firestore'
import { normalizeFirestoreTimestamps } from './normalizeDoc'
import { parseTool, type Tool } from './schemas/tools'

/** Tools are few; one page is plenty. Add pagination only past ~150. */
const LIST_LIMIT = 150

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const db = getDb()
  if (!db) return null

  const doc = await db.collection(COLLECTIONS.tools).doc(slug).get()
  if (!doc.exists) return null

  const tool = parseTool(
    normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>),
    doc.id
  )
  if (!tool || tool.status !== 'published') return null
  return tool
}

export async function listPublishedTools(): Promise<Tool[]> {
  const db = getDb()
  if (!db) return []

  const snap = await db
    .collection(COLLECTIONS.tools)
    .where('status', '==', 'published')
    .orderBy('sort_order')
    .limit(LIST_LIMIT)
    .get()

  const tools: Tool[] = []
  for (const doc of snap.docs) {
    const tool = parseTool(
      normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>),
      doc.id
    )
    if (tool) tools.push(tool)
  }
  // featured first, then sort_order (stable from query), then name
  return tools.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder
    return a.toolName.localeCompare(b.toolName)
  })
}
```

> Note: the `status == published` + `orderBy(sort_order)` query needs the composite index added in Task 9. Until then dev will throw an index-required link — that's expected; Task 9 adds it.

- [ ] **Step 7: Typecheck + commit**

Run: `npm run typecheck`
Expected: no new errors.

```bash
git add src/lib/cms/schemas/tools.ts src/lib/cms/toolsRepository.ts src/lib/cms/firestore.ts src/lib/tools/__tests__/toolSchema.test.ts
git commit -m "feat(tools): tool schema + repository (mirrors glossary)"
```

---

## Task 3: Extend the `tools` CMS collection definition

**Files:**
- Modify: `src/lib/cms/collectionDefinitions.ts` (the `tools` block, lines ~749-782)

- [ ] **Step 1: Verify SEO/card sections are not suppressed for tools**

Run: `grep -n "SUPPRESSED_SECTIONS_BY_COLLECTION" src/lib/cms/collectionDefinitions.ts`
Open the map. Ensure the `tools` entry (if present) does NOT suppress `'seo'` or `'card'` (the tool page + hub read `seo_title`, `meta_description`, `card_description`). If it suppresses them, remove those two from the `tools` array. If there is no `tools` entry, no change needed.

- [ ] **Step 2: Add routePattern + listingRoute and the new publish fields**

In `src/lib/cms/collectionDefinitions.ts`, edit the `tools` definition. Add the two route properties right after `defaultSchemaType: 'SoftwareApplication',`:

```typescript
    routePattern: '/tools/[slug]',
    listingRoute: '/tools',
```

Then, inside `sections.publish`, after the existing `{ name: 'lead_capture_enabled', ... }` line, add:

```typescript
        { name: 'hub_group', label: 'Hub group', type: 'select', options: ['Calculators', 'Benchmarks & Checks'], required: true },
        { name: 'cta_headline', label: 'CTA headline', type: 'text', placeholder: 'We will file it for you' },
        { name: 'gated_output_label', label: 'Gated output button label', type: 'text', placeholder: 'Email me the full breakdown' },
        { name: 'lead_magnet_description', label: 'Lead magnet description', type: 'textarea', placeholder: 'What the gated result delivers.' },
        { name: 'related_service_url', label: 'Related service URL', type: 'url', placeholder: '/vat-filing-uae' },
        { name: 'related_service_label', label: 'Related service label', type: 'text', placeholder: 'Get VAT filing done' },
```

- [ ] **Step 3: Keep tools in the generic-route blocklist (no change, verify)**

Run: `grep -n "'tools'" "src/app/content/[collection]/[slug]/page.tsx"`
Expected: `tools` is still present in `SENSITIVE_GENERIC_ROUTE_BLOCKLIST`. Do NOT remove it — we render via the dedicated `/tools/[slug]` route. (Same pattern as `glossary_terms`.)

- [ ] **Step 4: Typecheck + commit**

Run: `npm run typecheck`
Expected: no new errors. (All field types reused — `fieldCodec.ts` needs no change.)

```bash
git add src/lib/cms/collectionDefinitions.ts
git commit -m "feat(tools): public route wiring + hub/CTA/gate fields on tools collection"
```

---

## Task 4: Widget registry

**Files:**
- Create: `src/components/tools/registry.tsx`

- [ ] **Step 1: Create the registry**

Create `src/components/tools/registry.tsx`:

```tsx
'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import type { ToolRouteKey, ToolWidgetProps } from '@/lib/tools/types'

/**
 * The ONLY place a tool_route_key is wired to a widget. Adding a tool = add one
 * line here + the widget file. Widgets are client-only and code-split per tool.
 */
const REGISTRY: Partial<Record<ToolRouteKey, ComponentType<ToolWidgetProps>>> = {
  'vat-calculator': dynamic(() => import('./widgets/VatCalculator'), {
    loading: () => <ToolWidgetSkeleton />,
  }),
}

export function ToolWidgetSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-8">
      <div className="h-6 w-1/3 rounded bg-slate-200" />
      <div className="mt-4 h-10 w-full rounded bg-slate-200" />
      <div className="mt-3 h-10 w-full rounded bg-slate-200" />
    </div>
  )
}

export function getToolWidget(
  key: ToolRouteKey
): ComponentType<ToolWidgetProps> | null {
  return REGISTRY[key] ?? null
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npm run typecheck`
Expected: error that `./widgets/VatCalculator` does not exist yet — that is expected; Task 7 creates it. If you want a green typecheck between tasks, do Task 7 before re-running. Otherwise commit now:

```bash
git add src/components/tools/registry.tsx
git commit -m "feat(tools): widget registry keyed by tool_route_key"
```

---

## Task 5: ToolResult (soft-gate) + ToolLeadForm

**Files:**
- Create: `src/components/tools/ToolLeadForm.tsx`
- Create: `src/components/tools/ToolResult.tsx`

- [ ] **Step 1: Create ToolLeadForm (models LeadForm.tsx, posts /api/tools/lead)**

Create `src/components/tools/ToolLeadForm.tsx`:

```tsx
'use client'

import { useState } from 'react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface ToolLeadFormProps {
  slug: string
  serviceInterest: string
  submitLabel: string
  /** A JSON-serializable snapshot of the user's inputs + computed result. */
  resultSnapshot: Record<string, unknown>
  onSuccess?: () => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ToolLeadForm({
  slug,
  serviceInterest,
  submitLabel,
  resultSnapshot,
  onSuccess,
}: ToolLeadFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (name.trim().length < 2) return setError('Please enter your name.')
    if (!EMAIL_RE.test(email)) return setError('Please enter a valid work email.')
    const digits = phone.replace(/[^0-9]/g, '')
    if (digits.length < 7 || digits.length > 15) return setError('Please enter a valid phone number.')

    setState('submitting')
    try {
      const res = await fetch('/api/tools/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          tool_slug: slug,
          service_interest: serviceInterest,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          result_snapshot: resultSnapshot,
        }),
      })
      if (!res.ok) {
        setState('error')
        setError('Something went wrong. Please try again in a moment.')
        return
      }
      setState('success')
      onSuccess?.()
    } catch {
      setState('error')
      setError('Network error. Please try again.')
    }
  }

  if (state === 'success') {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
        <p className="font-semibold">Done — check your inbox.</p>
        <p className="mt-1 text-sm">Your full breakdown is on its way.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-6">
      <input
        type="text"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2"
        autoComplete="name"
      />
      <input
        type="email"
        placeholder="Work email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2"
        autoComplete="email"
      />
      <input
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2"
        autoComplete="tel"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={state === 'submitting'}
        className="rounded-lg bg-[#f16610] px-4 py-2.5 font-semibold text-white disabled:opacity-60"
      >
        {state === 'submitting' ? 'Sending…' : submitLabel}
      </button>
    </form>
  )
}
```

> Note: Turnstile is bypassed server-side when unconfigured (see `turnstile.ts`), so the v1 tool form omits the widget. If you later enable Turnstile for tools, mirror the dynamic-render block from `LeadForm.tsx` and include `turnstile_token` in the POST body.

- [ ] **Step 2: Create ToolResult (free headline + soft-gate slot)**

Create `src/components/tools/ToolResult.tsx`:

```tsx
'use client'

import { useState } from 'react'
import type { ToolGate } from '@/lib/tools/types'
import { ToolLeadForm } from './ToolLeadForm'

interface ToolResultProps {
  gate: ToolGate
  leadCaptureEnabled: boolean
  slug: string
  serviceInterest: string
  gatedOutputLabel: string
  leadMagnetDescription: string
  resultSnapshot: Record<string, unknown>
  /** Always-visible free headline result. */
  headline: React.ReactNode
  /** The detailed breakdown — revealed when open, or after lead capture when soft-gated. */
  detail: React.ReactNode
}

export function ToolResult({
  gate,
  leadCaptureEnabled,
  slug,
  serviceInterest,
  gatedOutputLabel,
  leadMagnetDescription,
  resultSnapshot,
  headline,
  detail,
}: ToolResultProps) {
  const [unlocked, setUnlocked] = useState(false)
  const showDetail = gate === 'open' || !leadCaptureEnabled || unlocked

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="text-2xl font-bold text-slate-900">{headline}</div>

      {showDetail ? (
        <div className="mt-4">{detail}</div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-[#f16610]/40 bg-[#f16610]/5 p-5">
          <p className="font-semibold text-slate-900">{leadMagnetDescription}</p>
          <div className="mt-3">
            <ToolLeadForm
              slug={slug}
              serviceInterest={serviceInterest}
              submitLabel={gatedOutputLabel}
              resultSnapshot={resultSnapshot}
              onSuccess={() => setUnlocked(true)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Typecheck + commit**

Run: `npm run typecheck`
Expected: no new errors from these two files.

```bash
git add src/components/tools/ToolLeadForm.tsx src/components/tools/ToolResult.tsx
git commit -m "feat(tools): soft-gate ToolResult + ToolLeadForm"
```

---

## Task 6: Lead endpoint + writeLead extension

**Files:**
- Modify: `src/lib/landing-pages/repository.ts` (`LeadWriteInput` + `writeLead`)
- Create: `src/app/api/tools/lead/route.ts`

- [ ] **Step 1: Extend LeadWriteInput with optional source + extra**

In `src/lib/landing-pages/repository.ts`, change the `LeadWriteInput` type (currently lines ~344-355) to add two optional fields:

```typescript
export type LeadWriteInput = {
  name: string
  phone: string
  email: string
  company_name?: string
  landing_page_id: string
  landing_page_slug: string
  service_interest: string
  attribution: LeadAttribution
  user_agent: string
  ip_hash: string
  /** Capture surface, e.g. "tool:vat-calculator". Defaults to "landing_page". */
  source?: string
  /** Arbitrary serialisable context (e.g. a tool result snapshot). */
  extra?: Record<string, unknown>
}
```

Then in `writeLead()`, in the object written to Firestore (the `payload` built before `.add(payload)`), add these two lines so they persist when present:

```typescript
    source: input.source ?? 'landing_page',
    extra: input.extra ?? null,
```

- [ ] **Step 2: Create the tools lead route**

Create `src/app/api/tools/lead/route.ts`:

```typescript
import { createHash } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import {
  checkAndIncrementRateLimit,
  getLead,
  updateLeadSyncState,
  writeLead,
} from '@/lib/landing-pages/repository'
import { verifyTurnstile } from '@/lib/landing-pages/turnstile'
import { leadToZohoPayload, pushLeadToZoho } from '@/lib/landing-pages/zohoClient'
import { getToolBySlug } from '@/lib/cms/toolsRepository'

export const runtime = 'nodejs'

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 10

const leadSchema = z.object({
  tool_slug: z.string().min(1).max(256),
  service_interest: z.string().min(1).max(64),
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  phone: z
    .string()
    .min(5)
    .max(40)
    .refine((v) => {
      const d = v.replace(/[^0-9]/g, '')
      return d.length >= 7 && d.length <= 15
    }, 'Phone must have 7–15 digits'),
  result_snapshot: z.record(z.string(), z.unknown()).optional(),
  turnstile_token: z.string().optional(),
})

function ipFromRequest(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for') ?? ''
  const first = fwd.split(',')[0]?.trim()
  if (first) return first
  return req.headers.get('x-real-ip') ?? '0.0.0.0'
}

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? 'finanshels-landing'
  return createHash('sha256').update(`${salt}::${ip}`).digest('hex')
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_payload', details: parsed.error.flatten() },
      { status: 400 }
    )
  }
  const input = parsed.data

  const tool = await getToolBySlug(input.tool_slug)
  if (!tool) {
    return NextResponse.json({ error: 'unknown_tool' }, { status: 404 })
  }

  const ip = ipFromRequest(req)
  const ipHash = hashIp(ip)

  const rate = await checkAndIncrementRateLimit(ipHash, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX)
  if (!rate.allowed) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  const turnstile = await verifyTurnstile(input.turnstile_token, ip)
  if (!turnstile.ok) {
    return NextResponse.json({ error: 'turnstile_failed', reason: turnstile.reason }, { status: 400 })
  }

  const userAgent = req.headers.get('user-agent')?.slice(0, 512) ?? ''

  let leadId: string
  try {
    leadId = await writeLead({
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email.trim().toLowerCase(),
      landing_page_id: `tool:${tool.slug}`,
      landing_page_slug: tool.slug,
      service_interest: tool.serviceInterest || input.service_interest,
      attribution: { landing_url: `/tools/${tool.slug}` },
      user_agent: userAgent,
      ip_hash: ipHash,
      source: `tool:${tool.slug}`,
      extra: input.result_snapshot ?? undefined,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'persist_failed', message: err instanceof Error ? err.message : 'unknown' },
      { status: 500 }
    )
  }

  // Zoho push — leadToZohoPayload takes only the lead doc (no landing page needed).
  try {
    const lead = await getLead(leadId)
    if (lead) {
      const result = await pushLeadToZoho(leadToZohoPayload(lead))
      if (result.ok) {
        await updateLeadSyncState(leadId, {
          zoho_lead_id: result.zoho_lead_id,
          zoho_synced_at: new Date(),
          zoho_sync_error: null,
        })
      } else {
        await updateLeadSyncState(leadId, {
          zoho_sync_error: result.error,
          increment_zoho_retry: true,
        })
      }
    }
  } catch (err) {
    await updateLeadSyncState(leadId, {
      zoho_sync_error: err instanceof Error ? err.message : 'unknown_zoho_error',
      increment_zoho_retry: true,
    })
  }

  return NextResponse.json({ ok: true, lead_id: leadId })
}

export async function GET() {
  return NextResponse.json({ error: 'method_not_allowed' }, { status: 405 })
}
```

> Decision: v1 reuses the `landing_page_leads` collection (one lead inbox) tagged with `source: 'tool:<slug>'` + the result snapshot in `extra`. Internal Resend notification is intentionally omitted for tools in v1 (the landing-pages `sendLeadNotification` requires a full landing-page object). Leads still land in Firestore + Zoho. A tool-aware notification is a follow-up.

- [ ] **Step 3: Verify `attribution` accepts a partial object**

Run: `grep -n "LeadAttribution" src/lib/landing-pages/repository.ts src/lib/landing-pages/types.ts`
Confirm `LeadAttribution`'s only required field is `landing_url` (all others optional — matches the landing route's `attributionSchema`). If other fields are required, pass them as empty strings in the `attribution` object above.

- [ ] **Step 4: Typecheck + commit**

Run: `npm run typecheck`
Expected: no new errors.

```bash
git add src/lib/landing-pages/repository.ts src/app/api/tools/lead/route.ts
git commit -m "feat(tools): /api/tools/lead reusing writeLead + Zoho; lead source/extra fields"
```

---

## Task 7: VAT Calculator widget

**Files:**
- Create: `src/components/tools/widgets/VatCalculator.tsx`

- [ ] **Step 1: Create the widget**

Create `src/components/tools/widgets/VatCalculator.tsx`:

```tsx
'use client'

import { useMemo, useState } from 'react'
import { calcVat, VAT_STANDARD_RATE, type VatDirection } from '@/lib/tools/vat'
import type { ToolWidgetProps } from '@/lib/tools/types'
import { ToolResult } from '../ToolResult'

function aed(n: number): string {
  return `AED ${n.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function VatCalculator({
  slug,
  gate,
  leadCaptureEnabled,
  gatedOutputLabel,
  leadMagnetDescription,
  serviceInterest,
}: ToolWidgetProps) {
  const [amount, setAmount] = useState('1000')
  const [direction, setDirection] = useState<VatDirection>('add')

  const result = useMemo(() => {
    const parsed = Number(amount)
    if (!Number.isFinite(parsed) || parsed < 0) return null
    try {
      return calcVat({ amount: parsed, ratePct: VAT_STANDARD_RATE, direction })
    } catch {
      return null
    }
  }, [amount, direction])

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <label className="block text-sm font-medium text-slate-700">
          {direction === 'add' ? 'Amount excluding VAT' : 'Amount including VAT'}
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <div className="mt-4 inline-flex rounded-lg border border-slate-300 p-1">
          <button
            type="button"
            onClick={() => setDirection('add')}
            className={`rounded px-3 py-1.5 text-sm ${direction === 'add' ? 'bg-[#f16610] text-white' : 'text-slate-700'}`}
          >
            Add VAT
          </button>
          <button
            type="button"
            onClick={() => setDirection('remove')}
            className={`rounded px-3 py-1.5 text-sm ${direction === 'remove' ? 'bg-[#f16610] text-white' : 'text-slate-700'}`}
          >
            Remove VAT
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500">UAE standard rate: {VAT_STANDARD_RATE}%</p>
      </div>

      {result ? (
        <ToolResult
          gate={gate}
          leadCaptureEnabled={leadCaptureEnabled}
          slug={slug}
          serviceInterest={serviceInterest}
          gatedOutputLabel={gatedOutputLabel}
          leadMagnetDescription={leadMagnetDescription}
          resultSnapshot={{ amount: Number(amount), direction, ...result }}
          headline={<span>VAT: {aed(result.vat)}</span>}
          detail={
            <dl className="grid gap-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Net</dt><dd className="font-medium">{aed(result.net)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">VAT ({VAT_STANDARD_RATE}%)</dt><dd className="font-medium">{aed(result.vat)}</dd></div>
              <div className="flex justify-between border-t border-slate-200 pt-2"><dt className="text-slate-700">Gross</dt><dd className="font-semibold">{aed(result.gross)}</dd></div>
            </dl>
          }
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-500">
          Enter a valid amount to see the result.
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npm run typecheck`
Expected: no new errors (registry import now resolves).

```bash
git add src/components/tools/widgets/VatCalculator.tsx
git commit -m "feat(tools): VAT calculator widget"
```

---

## Task 8: Tool page route `/tools/[slug]`

**Files:**
- Create: `src/app/tools/[slug]/page.tsx`

- [ ] **Step 1: Create the tool page**

Create `src/app/tools/[slug]/page.tsx`:

```tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/cms/config'
import { getToolBySlug } from '@/lib/cms/toolsRepository'
import { safeJsonLd } from '@/lib/seo/safeJsonLd'
import { getToolWidget } from '@/components/tools/registry'

export const revalidate = 600

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = await getToolBySlug(slug)
  if (!tool) return { title: 'Tools' }

  const title = tool.seoTitle || `${tool.toolName} | Finanshels`
  const description = tool.metaDescription || tool.shortDescription
  const url = tool.canonicalUrl || `${getSiteUrl()}/tools/${tool.slug}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: tool.ogImage ? [tool.ogImage] : undefined,
    },
  }
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const tool = await getToolBySlug(slug)
  if (!tool) notFound()

  const Widget = getToolWidget(tool.toolRouteKey)
  const site = getSiteUrl()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.toolName,
    description: tool.shortDescription,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: `${site}/tools/${tool.slug}`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'AED' },
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <nav className="text-sm text-slate-500">
        <Link href="/tools" className="hover:text-[#f16610]">Tools</Link>
        <span className="mx-2">›</span>
        <span className="text-slate-700">{tool.toolName}</span>
      </nav>

      <header className="mt-4">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{tool.toolName}</h1>
        <p className="mt-2 max-w-2xl text-lg text-slate-600">{tool.shortDescription}</p>
      </header>

      <section className="mt-8">
        {Widget ? (
          <Widget
            slug={tool.slug}
            gate={tool.gate}
            leadCaptureEnabled={tool.leadCaptureEnabled}
            gatedOutputLabel={tool.gatedOutputLabel}
            leadMagnetDescription={tool.leadMagnetDescription}
            serviceInterest={tool.serviceInterest}
          />
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            This tool is launching soon.
          </div>
        )}
      </section>

      {tool.relatedServiceUrl && tool.relatedServiceLabel ? (
        <section className="mt-8 rounded-2xl bg-slate-900 p-6 text-white">
          <p className="text-lg font-semibold">{tool.ctaHeadline || 'Want us to handle it?'}</p>
          <Link
            href={tool.relatedServiceUrl}
            className="mt-3 inline-block rounded-lg bg-[#f16610] px-5 py-2.5 font-semibold"
          >
            {tool.relatedServiceLabel}
          </Link>
        </section>
      ) : null}

      {tool.benefits.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900">Why use this</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {tool.benefits.map((b, i) => (
              <li key={i} className="rounded-xl border border-slate-200 bg-white p-4 text-slate-700">{b}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  )
}
```

> Note on FAQ: `tool.faqRefs` holds FAQ document IDs. Rendering them + emitting FAQPage JSON-LD requires resolving the refs via the faqs repository. To keep Task 8 focused, FAQ rendering is deferred to a follow-up (the field is parsed and ready). If you add it now, resolve refs server-side and mirror the FAQPage JSON-LD block from `src/app/glossary/[slug]/page.tsx`.

- [ ] **Step 2: Verify the helper imports exist**

Run: `grep -rn "export function safeJsonLd" src/lib/seo/safeJsonLd.ts && grep -rn "export function getSiteUrl" src/lib/cms/config.ts`
Expected: both exist (used by the glossary page). If `safeJsonLd` is named differently, match the glossary page's import.

- [ ] **Step 3: Typecheck + commit**

Run: `npm run typecheck`
Expected: no new errors.

```bash
git add "src/app/tools/[slug]/page.tsx"
git commit -m "feat(tools): /tools/[slug] page shell + widget mount + SoftwareApplication JSON-LD"
```

---

## Task 9: Hub page `/tools` + Firestore index

**Files:**
- Create: `src/components/tools/ToolsHubGrid.tsx`
- Create: `src/app/tools/page.tsx`
- Modify: `firestore.indexes.json`

- [ ] **Step 1: Add the composite index**

In `firestore.indexes.json`, add to the `indexes` array:

```json
{
  "collectionGroup": "tools",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "sort_order", "order": "ASCENDING" }
  ]
}
```

Then deploy: `npm run firebase:deploy`
Expected: indexes deploy without error.

- [ ] **Step 2: Create the client hub grid (search + grouping)**

Create `src/components/tools/ToolsHubGrid.tsx`:

```tsx
'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

export interface HubTool {
  slug: string
  toolName: string
  cardDescription: string
  hubGroup: 'Calculators' | 'Benchmarks & Checks'
}

const GROUPS: HubTool['hubGroup'][] = ['Calculators', 'Benchmarks & Checks']

export function ToolsHubGrid({ tools }: { tools: HubTool[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return tools
    return tools.filter(
      (t) => t.toolName.toLowerCase().includes(q) || t.cardDescription.toLowerCase().includes(q)
    )
  }, [tools, query])

  return (
    <div>
      <input
        type="search"
        placeholder="Search tools…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-md rounded-lg border border-slate-300 px-4 py-2.5"
      />

      {GROUPS.map((group) => {
        const items = filtered.filter((t) => t.hubGroup === group)
        if (items.length === 0) return null
        return (
          <section key={group} className="mt-10">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#f16610]">{group}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#f16610]/50 hover:shadow-sm"
                >
                  <p className="font-semibold text-slate-900">{t.toolName}</p>
                  <p className="mt-1 text-sm text-slate-600">{t.cardDescription}</p>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Create the hub server page**

Create `src/app/tools/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/cms/config'
import { listPublishedTools } from '@/lib/cms/toolsRepository'
import { safeJsonLd } from '@/lib/seo/safeJsonLd'
import { ToolsHubGrid, type HubTool } from '@/components/tools/ToolsHubGrid'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Free Finance & Tax Tools | Finanshels',
  description:
    'Free UAE finance and tax tools — VAT calculator, gratuity calculator, corporate tax deadline checker, and more.',
  alternates: { canonical: `${getSiteUrl()}/tools` },
}

export default async function ToolsHubPage() {
  const tools = await listPublishedTools()
  const site = getSiteUrl()

  const hubTools: HubTool[] = tools.map((t) => ({
    slug: t.slug,
    toolName: t.toolName,
    cardDescription: t.cardDescription || t.shortDescription,
    hubGroup: t.hubGroup,
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: tools.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.toolName,
      url: `${site}/tools/${t.slug}`,
    })),
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <header>
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Free finance & tax tools</h1>
        <p className="mt-2 max-w-2xl text-lg text-slate-600">
          Run the numbers in seconds. Built for UAE businesses by Finanshels.
        </p>
      </header>
      <div className="mt-8">
        {hubTools.length > 0 ? (
          <ToolsHubGrid tools={hubTools} />
        ) : (
          <p className="text-slate-500">Tools are coming soon.</p>
        )}
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Typecheck + commit**

Run: `npm run typecheck`
Expected: no new errors.

```bash
git add src/components/tools/ToolsHubGrid.tsx src/app/tools/page.tsx firestore.indexes.json
git commit -m "feat(tools): /tools hub with grouping/search + ItemList JSON-LD + Firestore index"
```

---

## Task 10: Navbar repoint + SEO surface verification

**Files:**
- Modify: `src/components/layout/Navbar.jsx`

- [ ] **Step 1: Repoint the Calculators section**

In `src/components/layout/Navbar.jsx`, replace the `Calculators` items array (lines ~112-118) with:

```jsx
{
  title: 'Calculators',
  items: [
    { name: 'Cash Flow', href: '/tools', icon: Wallet },
    { name: 'Gratuity', href: '/tools/gratuity-calculator', icon: Coins },
    { name: 'VAT', href: '/tools/vat-calculator', icon: Percent },
    { name: 'E-Invoicing', href: '/tools', icon: Receipt }
  ]
}
```

- [ ] **Step 2: Repoint the Benchmarks & Checks section**

Replace the `Benchmarks & Checks` items array (lines ~121-127) with:

```jsx
{
  title: 'Benchmarks & Checks',
  items: [
    { name: 'Salary Benchmark', href: '/tools', icon: Scale },
    { name: 'Finance Health Check', href: '/tools/business-finance-health-check', icon: HeartPulse },
    { name: 'CT Deadline Check', href: '/tools/corporate-tax-deadline-checker', icon: CalendarClock }
  ]
}
```

> Cash Flow, E-Invoicing, Salary Benchmark point at `/tools` (no 404) until their plans land. Gratuity / Finance Health / CT Deadline point at their `/tools/[slug]` — those pages render "launching soon" via the registry fallback until their widget plans complete, but the page + lead CTA exist.

- [ ] **Step 3: Verify sitemap + llms.txt auto-include tools (no code change expected)**

Run: `grep -n "skip" src/app/llms.txt/route.ts`
Confirm the `skip` set is `['blog_posts', 'glossary_terms']` and does NOT include `tools`. Tools is auto-included by both `sitemap.ts` and `llms.txt` because it now has `routePattern`/`listingRoute`. No edit needed. (If `tools` is in the skip set, that's intentional content-dedup for hub-only collections — leave as is and note it.)

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Navbar.jsx
git commit -m "fix(nav): repoint tool links to /tools hub + /tools/[slug] (kills 7 dead links)"
```

---

## Task 11: Seed the VAT tool + verify end-to-end

**Files:** none (CMS data + verification)

- [ ] **Step 1: Create the VAT tool doc in the admin CMS**

Start the dev server: `npm run dev`. Go to `http://localhost:3000/admin/cms`, open **Tools**, create a new tool, and set:

| Field | Value |
|---|---|
| Slug | `vat-calculator` |
| Tool name | `UAE VAT Calculator` |
| Tool type | `calculator` |
| Short description | `Add or remove 5% UAE VAT instantly, then get the full breakdown.` |
| Embed type | `custom_component` |
| Tool route key | `vat-calculator` |
| Hub group | `Calculators` |
| Gated | `true` |
| Lead capture enabled | `true` |
| Gated output button label | `Email me the full breakdown` |
| Lead magnet description | `Get the itemized VAT breakdown plus a UAE VAT filing checklist.` |
| Related service URL | `/vat-filing-uae` |
| Related service label | `Get VAT filing done for you` |
| Related services (tags) | `vat` |
| Benefits (json) | `["Instant 5% VAT math", "Add or remove VAT", "UAE filing checklist"]` |
| Card description | `Add or remove 5% UAE VAT in seconds.` |

Set status to **Published** and save.

- [ ] **Step 2: Smoke the hub + tool page**

Open `http://localhost:3000/tools` — the VAT card shows under **Calculators**.
Open `http://localhost:3000/tools/vat-calculator` — the calculator renders; entering `1000` (Add VAT) shows headline **VAT: AED 50.00**; the breakdown is gated behind the email form.

- [ ] **Step 3: Smoke the lead capture**

Submit the gated form with a real-looking name/email/phone. Expected: success state appears and the breakdown unlocks. Verify a lead doc was written (admin leads view or Firestore) with `source: "tool:vat-calculator"` and the `extra` snapshot.

> Per memory [[no-prod-test-writes-when-debugging]]: dev hits PRODUCTION Firestore. This Step writes ONE real lead doc. That's acceptable as the intended smoke; do not loop test submissions. Delete the test lead afterward if desired.

- [ ] **Step 4: Run unit tests + typecheck + deploy-check**

```bash
npm run test:unit
npm run typecheck
```
Then run the `/deploy-check` workflow (typecheck + build + rules + env). Expected: build passes; `firebase-admin` stays server-only (no client-bundle leak).

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore(tools): verify VAT tool end-to-end (hub + page + lead capture)"
```

---

## Self-review notes (addressed)

- **Spec coverage:** Framework (registry, repository, route, lead pipeline, CMS fields) ✓ Tasks 2–8; Hub ✓ Task 9; VAT widget ✓ Tasks 1,7; navbar 404 fix ✓ Task 10; SEO surfaces ✓ Tasks 8–10; Firestore index ✓ Task 9. Gratuity / CT Deadline / Finance Health are explicitly out of scope (separate plans, spec §4.2 research gate) — navbar points their slugs at pages that show "launching soon" until then.
- **Regulatory gate:** VAT 5% is pure arithmetic with a cited `VAT_STANDARD_RATE` constant + as-of note — no external regulatory research blocks it. The three research-dependent tools are deferred.
- **No new field type:** all added CMS fields reuse existing codecs (`select`, `text`, `textarea`, `url`) — `fieldCodec.ts` unchanged (verified in Task 3 Step 4).
- **Deferred (called out, not silently dropped):** FAQ rendering + FAQPage JSON-LD on the tool page (Task 8 note); tool-aware Resend notification (Task 6 note); Turnstile widget on the tool form (Task 5 note). All have parsed fields/hooks ready.
```
