# Landing-page Section Design Refresh — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin all 17 Landing Page Studio section components to a brand-aligned premium look — driven by a per-page accent color (blue default), with dependency-free scroll-reveal motion — without changing the admin editor, fields, or lead-capture wiring.

**Architecture:** A single accent-token system (`--lp-accent` + derived `color-mix` tokens + luminance-computed contrast) is defined once and threaded through every section. `Sections.tsx` (643-line monolith) is split into one file per section under `sections/`, sharing `primitives.tsx` (layout/heading/card helpers) and two motion primitives (`Reveal`, `StatCounter`). A barrel keeps `LandingPageRenderer.tsx` imports unchanged.

**Tech Stack:** Next.js 15 App Router, React 18, Tailwind, lucide-react. No new dependencies. Tests via Node's built-in runner (`node --import tsx --test`).

**Spec:** [docs/superpowers/specs/2026-06-28-landing-section-design-refresh-design.md](../specs/2026-06-28-landing-section-design-refresh-design.md)

---

## File Structure

**Create:**
- `src/lib/landing-pages/accentColor.ts` — `normalizeAccent` (moved from renderer) + `accentContrast` (new, tested).
- `src/lib/landing-pages/__tests__/accentColor.test.ts` — unit tests for `accentContrast`.
- `src/components/landing-pages/sections/primitives.tsx` — `Container`, `SectionWrap`, `SectionHeading`, `getLucideIcon`, card/accent class constants.
- `src/components/landing-pages/sections/Reveal.tsx` — IntersectionObserver scroll-reveal (`'use client'`).
- `src/components/landing-pages/sections/StatCounter.tsx` — count-up numeral (`'use client'`).
- `src/components/landing-pages/sections/TrustBar.tsx`, `StatsRow.tsx`, `TestimonialsCarousel.tsx`, `VideoTestimonial.tsx`, `AwardsPress.tsx`, `FeatureGrid.tsx`, `ProcessSteps.tsx`, `ComparisonTable.tsx`, `Pricing.tsx`, `InlineForm.tsx`, `CtaBanner.tsx`, `LeadMagnet.tsx`, `FinalCta.tsx`, `Faq.tsx`, `Guarantee.tsx`, `RiskReversal.tsx` — one component per file.
- `src/components/landing-pages/sections/index.ts` — barrel re-exporting all of the above under their current names.

**Modify:**
- `src/styles/globals.css` — add accent tokens.
- `src/components/landing-pages/LandingPageRenderer.tsx` — always `.lp-themed`, set accent vars + computed contrast; import section barrel.
- `src/components/landing-pages/sections/HeroSection.tsx` — restyle (keeps its own default export).

**Delete:**
- `src/components/landing-pages/sections/Sections.tsx` — after all components are extracted.

---

## Task 1: Accent helpers (`accentColor.ts`) — TDD

**Files:**
- Create: `src/lib/landing-pages/accentColor.ts`
- Test: `src/lib/landing-pages/__tests__/accentColor.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/landing-pages/__tests__/accentColor.test.ts
import test from 'node:test'
import assert from 'node:assert/strict'
import { accentContrast, normalizeAccent } from '../accentColor'

test('dark accent → white text', () => {
  assert.equal(accentContrast('#2563eb'), '#ffffff')
  assert.equal(accentContrast('#0f766e'), '#ffffff')
})

test('light accent → dark text', () => {
  assert.equal(accentContrast('#fde047'), '#0f172a') // yellow
  assert.equal(accentContrast('#ffffff'), '#0f172a')
})

test('accepts 3-digit hex', () => {
  assert.equal(accentContrast('#fff'), '#0f172a')
  assert.equal(accentContrast('#00f'), '#ffffff')
})

test('normalizeAccent returns null for non-hex', () => {
  assert.equal(normalizeAccent('not-a-color'), null)
  assert.equal(normalizeAccent(''), null)
  assert.equal(normalizeAccent(undefined), null)
})

test('normalizeAccent passes valid hex', () => {
  assert.equal(normalizeAccent('#2563EB'), '#2563EB')
  assert.equal(normalizeAccent('#abc'), '#abc')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --import tsx --test src/lib/landing-pages/__tests__/accentColor.test.ts`
Expected: FAIL — cannot resolve `../accentColor`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/landing-pages/accentColor.ts
const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export function normalizeAccent(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const v = input.trim()
  return HEX_COLOR.test(v) ? v : null
}

/** WCAG relative-luminance pick: light accents get dark text, dark get white. */
export function accentContrast(hex: string): string {
  const m = hex.replace('#', '')
  const full = m.length === 3 ? m.split('').map((c) => c + c).join('') : m
  const channel = (start: number) => {
    const c = parseInt(full.slice(start, start + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  const luminance = 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4)
  return luminance > 0.6 ? '#0f172a' : '#ffffff'
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --import tsx --test src/lib/landing-pages/__tests__/accentColor.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/landing-pages/accentColor.ts src/lib/landing-pages/__tests__/accentColor.test.ts
git commit -m "feat(landing): add accent color helpers (normalize + WCAG contrast)"
```

---

## Task 2: Accent tokens in globals + always-themed renderer

**Files:**
- Modify: `src/styles/globals.css`
- Modify: `src/components/landing-pages/LandingPageRenderer.tsx:33-79`

- [ ] **Step 1: Add tokens to globals.css**

Append to `src/styles/globals.css`:

```css
@layer base {
  :root {
    --lp-accent: #2563eb;
    --lp-accent-contrast: #ffffff;
  }
  .lp-themed {
    --lp-accent-soft: color-mix(in srgb, var(--lp-accent) 10%, white);
    --lp-accent-tint: color-mix(in srgb, var(--lp-accent) 16%, white);
    --lp-accent-ring: color-mix(in srgb, var(--lp-accent) 35%, white);
    --lp-accent-strong: color-mix(in srgb, var(--lp-accent) 88%, black);
  }
}
```

- [ ] **Step 2: Update the renderer to always theme + compute contrast**

In `LandingPageRenderer.tsx`: delete the local `HEX_COLOR`/`normalizeAccent` (lines ~28-36), import from the helper, and always apply `.lp-themed` with the default-or-page accent:

```tsx
import { normalizeAccent, accentContrast } from '@/lib/landing-pages/accentColor'

const DEFAULT_ACCENT = '#2563eb'
// ...inside the component, replacing the current accent/rootStyle block:
const accent = normalizeAccent(page.theme.accent_color) ?? DEFAULT_ACCENT
const rootStyle = {
  '--lp-accent': accent,
  '--lp-accent-contrast': accentContrast(accent),
} as React.CSSProperties
// wrapper:
return (
  <div style={rootStyle} className="lp-themed">
    {/* ...unchanged... */}
```

- [ ] **Step 3: Typecheck + build**

Run: `npm run typecheck && npm run build`
Expected: PASS. (`CtaButtons` accent override now fires on every page, not only when a color is set.)

- [ ] **Step 4: Commit**

```bash
git add src/styles/globals.css src/components/landing-pages/LandingPageRenderer.tsx
git commit -m "feat(landing): always-on accent tokens (blue default + computed contrast)"
```

---

## Task 3: Shared layout primitives (`primitives.tsx`)

**Files:**
- Create: `src/components/landing-pages/sections/primitives.tsx`

These are the refined versions of the current inline `Container`/`SectionWrap`/`SectionHeading`/`getLucideIcon`, plus reusable class constants for the elevated card + accent treatments.

- [ ] **Step 1: Create the file**

```tsx
// src/components/landing-pages/sections/primitives.tsx
import * as Lucide from 'lucide-react'
import { s } from '@/lib/landing-pages/safeProps'

/** Premium card shell: hairline border, layered soft shadow, hover lift. */
export const CARD =
  'rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)] transition duration-300'
export const CARD_HOVER = 'hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(15,23,42,0.05),0_16px_40px_-16px_rgba(15,23,42,0.20)]'
/** Accent chip for icons/badges. */
export const ACCENT_CHIP =
  'bg-[var(--lp-accent-soft)] text-[var(--lp-accent)]'

export function getLucideIcon(name: unknown): React.ComponentType<{ className?: string }> {
  const raw = s(name) || 'circle-check'
  const pascal = raw.split(/[-_\s]+/).filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('')
  const Comp = (Lucide as unknown as Record<string, React.ComponentType<{ className?: string }>>)[pascal]
  return Comp ?? Lucide.CircleCheck ?? Lucide.Check
}

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className ?? ''}`}>{children}</div>
}

export function SectionWrap({
  children, bg = 'white', pad = 'lg',
}: { children: React.ReactNode; bg?: 'white' | 'slate' | 'accent' | 'dark'; pad?: 'sm' | 'md' | 'lg' }) {
  const bgClass =
    bg === 'slate' ? 'bg-slate-50' :
    bg === 'accent' ? 'bg-[var(--lp-accent-soft)]' :
    bg === 'dark' ? 'bg-slate-900 text-white' : 'bg-white'
  const padClass = pad === 'sm' ? 'py-10' : pad === 'md' ? 'py-14' : 'py-16 sm:py-24'
  return <section className={`${bgClass} ${padClass}`}>{children}</section>
}

export function SectionHeading({
  heading, subheading, dark, eyebrow,
}: { heading?: string; subheading?: string; dark?: boolean; eyebrow?: string }) {
  if (!heading && !subheading && !eyebrow) return null
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      {eyebrow ? (
        <span className="inline-flex items-center rounded-full bg-[var(--lp-accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--lp-accent)]">
          {eyebrow}
        </span>
      ) : null}
      {heading ? (
        <h2 className={`${eyebrow ? 'mt-3 ' : ''}text-2xl font-display font-semibold tracking-tight sm:text-4xl ${dark ? 'text-white' : 'text-slate-900'}`}>{heading}</h2>
      ) : null}
      {subheading ? (
        <p className={`mt-3 text-base sm:text-lg ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{subheading}</p>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing-pages/sections/primitives.tsx
git commit -m "feat(landing): shared section primitives (card/heading/accent helpers)"
```

---

## Task 4: Motion primitives (`Reveal`, `StatCounter`)

**Files:**
- Create: `src/components/landing-pages/sections/Reveal.tsx`
- Create: `src/components/landing-pages/sections/StatCounter.tsx`

- [ ] **Step 1: Create `Reveal.tsx`**

```tsx
// src/components/landing-pages/sections/Reveal.tsx
'use client'

import { useEffect, useRef, useState } from 'react'

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

/** Fade + rise on first scroll-in. No reserved height → no CLS. `delay` staggers grids. */
export function Reveal({
  children, delay = 0, className,
}: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) { setShown(true); return }
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) { setShown(true); obs.disconnect() }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={shown ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transition-all duration-[600ms] ease-out ${
        shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      } ${className ?? ''}`}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Create `StatCounter.tsx`**

```tsx
// src/components/landing-pages/sections/StatCounter.tsx
'use client'

import { useEffect, useRef, useState } from 'react'

/** Splits "+1,200%" into prefix/number/suffix and counts the number up on reveal. */
function parse(value: string): { prefix: string; target: number; suffix: string; decimals: number } | null {
  const m = value.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/)
  if (!m) return null
  const numeric = m[2]!.replace(/,/g, '')
  const decimals = numeric.includes('.') ? numeric.split('.')[1]!.length : 0
  return { prefix: m[1] ?? '', target: parseFloat(numeric), suffix: m[3] ?? '', decimals }
}

export function StatCounter({ value, className }: { value: string; className?: string }) {
  const parsed = parse(value)
  const ref = useRef<HTMLSpanElement | null>(null)
  const [display, setDisplay] = useState(parsed ? 0 : null)

  useEffect(() => {
    if (!parsed) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setDisplay(parsed.target); return }
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting) return
      obs.disconnect()
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1100)
        const eased = 1 - Math.pow(1 - t, 3)
        setDisplay(parsed.target * eased)
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [parsed?.target])

  if (!parsed || display === null) return <span className={className}>{value}</span>
  const shown = display.toLocaleString('en-US', {
    minimumFractionDigits: parsed.decimals, maximumFractionDigits: parsed.decimals,
  })
  return <span ref={ref} className={className}>{parsed.prefix}{shown}{parsed.suffix}</span>
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing-pages/sections/Reveal.tsx src/components/landing-pages/sections/StatCounter.tsx
git commit -m "feat(landing): dependency-free Reveal + StatCounter motion primitives"
```

---

## Task 5: Mechanical split of `Sections.tsx` (no visual change yet)

De-risk by extracting first, restyling after. Move each of the 16 components verbatim into its own file, importing the shared primitives from Task 3 (delete the now-duplicated local `Container`/`SectionWrap`/`SectionHeading`/`getLucideIcon`). Keep markup identical.

**Files:** create the 16 section files + `sections/index.ts`; modify `LandingPageRenderer.tsx` import; delete `Sections.tsx`.

- [ ] **Step 1: Create one file per component**

For each component (`TrustBar`, `StatsRow`, `TestimonialsCarousel`, `VideoTestimonial`, `AwardsPress`, `FeatureGrid`, `ProcessSteps`, `ComparisonTable`, `Pricing`, `InlineForm`, `CtaBanner`, `LeadMagnet`, `FinalCta`, `Faq`, `Guarantee`, `RiskReversal`): create `sections/<Name>.tsx`, paste its body from `Sections.tsx`, add `'use client'` at top, import shared helpers:
```tsx
'use client'
import { Container, SectionWrap, SectionHeading, getLucideIcon } from './primitives'
import { s, n, b, jsonArray } from '@/lib/landing-pages/safeProps'
// ...component-specific imports (Image, Lucide, LeadForm, CtaButtons) as needed
```
Keep the existing `Common`/`WithCta`/`WithLeadForm` prop types — copy the small type aliases into each file that needs them (they're 1-2 lines).

- [ ] **Step 2: Create the barrel**

```ts
// src/components/landing-pages/sections/index.ts
export { TrustBar } from './TrustBar'
export { StatsRow } from './StatsRow'
export { TestimonialsCarousel } from './TestimonialsCarousel'
export { VideoTestimonial } from './VideoTestimonial'
export { AwardsPress } from './AwardsPress'
export { FeatureGrid } from './FeatureGrid'
export { ProcessSteps } from './ProcessSteps'
export { ComparisonTable } from './ComparisonTable'
export { Pricing } from './Pricing'
export { InlineForm } from './InlineForm'
export { CtaBanner } from './CtaBanner'
export { LeadMagnet } from './LeadMagnet'
export { FinalCta } from './FinalCta'
export { Faq } from './Faq'
export { Guarantee } from './Guarantee'
export { RiskReversal } from './RiskReversal'
```

- [ ] **Step 3: Point the renderer at the barrel**

In `LandingPageRenderer.tsx`, change `from './sections/Sections'` to `from './sections'`. Delete `Sections.tsx`.

- [ ] **Step 4: Typecheck + build (pure refactor, output identical)**

Run: `npm run typecheck && npm run build`
Expected: PASS. Visual output unchanged.

- [ ] **Step 5: Commit**

```bash
git add -A src/components/landing-pages/sections
git commit -m "refactor(landing): split Sections.tsx into per-section files + barrel"
```

---

## Tasks 6–14: Restyle each section (brand-aligned premium)

Each task restyles one group of sections using the Task 3 primitives, the accent tokens, and `Reveal`/`StatCounter`. **Pattern for every section:** wrap cards/items in `Reveal` (stagger grids with `delay={i*70}`); swap `amber-*` → accent tokens; apply `CARD`/`CARD_HOVER`; keep emerald for true success ticks; read props via `safeProps` unchanged. After each task: `npm run typecheck && npm run build`, then **visually verify** at `/landing-pages/corporate-tax` (desktop + mobile), then commit `feat(landing): restyle <section(s)>`.

Two **exemplars** show the full target style; the rest follow the same pattern with the per-section notes.

### Task 6 (exemplar — simple): FeatureGrid + ProcessSteps + StatsRow

- [ ] **FeatureGrid.tsx** — final body:

```tsx
export function FeatureGrid({ props }: { props: Record<string, unknown> }) {
  const heading = s(props.heading)
  const subheading = s(props.subheading)
  const columns = Math.min(Math.max(n(props.columns, 4), 2), 4)
  const items = jsonArray(props.items) as Array<{ icon?: string; title?: string; description?: string }>
  const gridCols = columns === 2 ? 'md:grid-cols-2' : columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'
  return (
    <SectionWrap bg="white">
      <Container>
        <SectionHeading heading={heading} subheading={subheading} />
        <div className={`grid grid-cols-1 ${gridCols} gap-5`}>
          {items.map((item, i) => {
            const Icon = getLucideIcon(item.icon)
            return (
              <Reveal key={i} delay={i * 70}>
                <div className={`${CARD} ${CARD_HOVER} h-full p-5`}>
                  <div className={`flex size-11 items-center justify-center rounded-xl ${ACCENT_CHIP}`}>
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{s(item.title)}</h3>
                  {item.description ? <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{s(item.description)}</p> : null}
                </div>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </SectionWrap>
  )
}
```
(imports add `Reveal`, `CARD`, `CARD_HOVER`, `ACCENT_CHIP`.)

- [ ] **ProcessSteps.tsx** — same card + Reveal pattern; the step badge becomes accent: `bg-[var(--lp-accent)] text-[var(--lp-accent-contrast)]`; add a connecting line behind the row on `md+` (`before:` pseudo or a positioned `div`), icons in `text-[var(--lp-accent)]`. Wrap each `<li>` in `Reveal delay={i*80}`.

- [ ] **StatsRow.tsx** — wrap the grid items in `Reveal`; render the value with `<StatCounter value={s(item.value)} className="text-3xl sm:text-5xl font-display font-semibold text-[var(--lp-accent)] tabular-nums" />`; add vertical dividers between columns on `md+` (`md:divide-x md:divide-slate-200`) or `border-l`.

- [ ] Typecheck + build + visual check + commit.

### Task 7 (exemplar — complex): Pricing

- [ ] **Pricing.tsx** — final body:

```tsx
export function Pricing({ props, cta }: { props: Record<string, unknown>; cta: CtaConfig }) {
  const heading = s(props.heading)
  const subheading = s(props.subheading)
  const tiers = jsonArray(props.tiers) as Array<{ name?: string; price?: string; priceSuffix?: string; description?: string; features?: unknown[]; ctaLabel?: string; highlighted?: boolean }>
  const grid = tiers.length === 1 ? 'max-w-md mx-auto' : tiers.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3'
  return (
    <SectionWrap bg="slate">
      <Container>
        <SectionHeading heading={heading} subheading={subheading} />
        <div className={`grid gap-5 ${grid}`}>
          {tiers.map((tier, i) => {
            const highlighted = b(tier.highlighted)
            return (
              <Reveal key={i} delay={i * 80}>
                <div className={`relative h-full p-6 sm:p-7 ${CARD} ${
                  highlighted
                    ? 'border-transparent ring-2 ring-[var(--lp-accent-ring)] bg-gradient-to-b from-[var(--lp-accent-soft)] to-white'
                    : CARD_HOVER
                }`}>
                  {highlighted ? (
                    <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-[var(--lp-accent)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--lp-accent-contrast)]">
                      Most popular
                    </span>
                  ) : null}
                  <h3 className="text-lg font-semibold text-slate-900">{s(tier.name)}</h3>
                  {tier.description ? <p className="mt-1 text-sm text-slate-600">{s(tier.description)}</p> : null}
                  <p className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-display font-semibold text-slate-900 sm:text-4xl">{s(tier.price)}</span>
                    {tier.priceSuffix ? <span className="text-sm text-slate-500">{s(tier.priceSuffix)}</span> : null}
                  </p>
                  <ul className="mt-5 space-y-2.5 text-sm text-slate-800">
                    {(tier.features ?? []).map((feat, fi) => (
                      <li key={fi} className="flex items-start gap-2">
                        <Lucide.Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                        <span>{s(feat)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <FormScrollButton cta={cta} label={s(tier.ctaLabel) || 'Get started'} className="w-full" />
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </SectionWrap>
  )
}
```

- [ ] Typecheck + build + visual check + commit.

### Task 8: Testimonials — TestimonialsCarousel + VideoTestimonial

- [ ] **TestimonialsCarousel.tsx** — cards use `CARD` + a top accent edge (`border-t-2 border-[var(--lp-accent)]` or a gradient bar); `Lucide.Quote` in `text-[var(--lp-accent)]`; add an avatar/initial monogram (`size-9 rounded-full bg-[var(--lp-accent-soft)] text-[var(--lp-accent)]` with first letter of author); on mobile use `flex snap-x overflow-x-auto` instead of stacked grid; wrap each in `Reveal delay={i*70}`.
- [ ] **VideoTestimonial.tsx** — keep `SectionWrap bg="slate"`; frame the iframe in `CARD` with `p-0 overflow-hidden`; quote mark + author accent like above; wrap each column in `Reveal`.
- [ ] Typecheck + build + visual check + commit.

### Task 9: Proof rails — TrustBar + AwardsPress + RiskReversal

- [ ] **TrustBar.tsx** — logos `grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition`; rating pill → `bg-[var(--lp-accent-soft)] text-[var(--lp-accent)] border-[var(--lp-accent-ring)]`, star in accent.
- [ ] **AwardsPress.tsx** — same grayscale→color hover treatment; eyebrow label uses accent.
- [ ] **RiskReversal.tsx** — render each item as a chip: `rounded-full border border-slate-200 bg-white px-3 py-1.5` with icon in `text-emerald-600` (success semantics); wrap row in a single `Reveal`.
- [ ] Typecheck + build + visual check + commit.

### Task 10: ComparisonTable

- [ ] **ComparisonTable.tsx** — highlight column header + cells use `bg-[var(--lp-accent-soft)]` and header text `text-[var(--lp-accent)]`; first column `sticky left-0 bg-white` for mobile scroll; ✓ stays `text-emerald-600`, ✗ `text-slate-300`; wrap the table card in `Reveal`. Table card uses `CARD` shell.

- [ ] Typecheck + build + visual check + commit.

### Task 11: Form sections — InlineForm + LeadMagnet + FinalCta + CtaBanner

- [ ] **InlineForm.tsx** — `backgroundTone` map: `accent` → `bg-[var(--lp-accent-soft)]`, keep `dark`/`soft`; heading keeps `font-display`; wrap copy column in `Reveal`. Keep `LeadForm` wiring unchanged.
- [ ] **LeadMagnet.tsx** — "Free download" badge → `bg-[var(--lp-accent-soft)] text-[var(--lp-accent)]`; cover image in `CARD p-0`; placeholder icon tile uses `ACCENT_CHIP`; wrap columns in `Reveal`.
- [ ] **FinalCta.tsx** — `tone` map: `accent` → `bg-gradient-to-br from-[var(--lp-accent)] to-[var(--lp-accent-strong)] text-[var(--lp-accent-contrast)]`; keep `dark`/`soft`; subheading uses contrast-aware color; `Reveal` the heading column. Keep `LeadForm` card.
- [ ] **CtaBanner.tsx** — `tone` map: `brand` → `bg-[var(--lp-accent)] text-[var(--lp-accent-contrast)]` (replaces `amber-400`); `dark` unchanged; buttons honor `--lp-accent-contrast`. Wrap in `Reveal`.
- [ ] Typecheck + build + visual check + commit.

### Task 12: Faq + Guarantee

- [ ] **Faq.tsx** — open item gets accent affordance: chevron `group-open:text-[var(--lp-accent)]`, optional left accent bar on the open `<details>`; smooth via `transition`; wrap list in `Reveal`. Keep the `useState` open-index behavior.
- [ ] **Guarantee.tsx** — callout card uses `CARD`; icon tile `bg-emerald-100 text-emerald-700` (guarantee = success semantic) OR `ACCENT_CHIP` if `props.tone === 'accent'`; wrap in `Reveal`.
- [ ] Typecheck + build + visual check + commit.

### Task 13: Hero (`HeroSection.tsx`) — all 4 variants

- [ ] **HeroSection.tsx** — restyle without changing fields/variants:
  - Backdrop: replace `from-amber-50` gradients with an accent spotlight — `bg-gradient-to-b from-[var(--lp-accent-soft)] to-white`, optional radial accent glow behind the form.
  - Eyebrow → accent chip (same style as `SectionHeading` eyebrow).
  - Bullets: `CheckCircle2` in `text-[var(--lp-accent)]`.
  - `urgency-banner` bar → `bg-[var(--lp-accent)] text-[var(--lp-accent-contrast)]`.
  - Form card: wrap in `CARD` shell; `Reveal` the copy column (NOT the form — avoid delaying the primary CTA; render form immediately).
  - Keep `LeadForm` props and `anchorId="lead-form"` unchanged.
- [ ] Typecheck + build + visual check (all 4 variants if templates available) + commit.

### Task 14: Accent + reduced-motion + Studio-preview verification pass

- [ ] **Step 1: Per-page accent** — in a seeded landing page doc, set `theme.accent_color` to a non-blue hex (e.g. `#7c3aed` purple and `#fde047` light yellow). Reload `/landing-pages/<slug>`; confirm every section recolors and that on the light-yellow accent, button/badge text flips to dark (contrast token works).
- [ ] **Step 2: Reduced motion** — enable OS "reduce motion"; reload; confirm no entrance animation and `StatCounter` shows final values immediately.
- [ ] **Step 3: Studio preview parity** — open the Studio editor live-preview for a page; confirm all sections render and remain click-selectable (the `SectionFrame` edit wrapper is unaffected), and the accent reflects the page's theme.
- [ ] **Step 4: Final build + commit** — `npm run typecheck && npm run build`; commit any fixes `fix(landing): accent/motion verification fixes`.

---

## Self-Review

**Spec coverage:**
- Accent token system (default blue + override + soft/tint/ring + computed contrast) → Tasks 1, 2. ✓
- Re-skin off amber, emerald for success only → Tasks 6–13 per-section notes. ✓
- Depth/radius/type via shared shell → Task 3 (`CARD`/`CARD_HOVER`/`SectionHeading`). ✓
- Motion (Reveal + stagger + StatCounter, reduced-motion, no CLS) → Tasks 4, 6, 14. ✓
- All 17 sections → Hero (13) + 16 others (6–12). ✓
- File split + barrel, renderer unchanged → Task 5. ✓
- Guardrails: conversion prominence (Hero form not delayed — Task 13), Studio parity + reduced-motion (Task 14), safeProps retained (Tasks 5–13). ✓

**Placeholder scan:** Section restyle tasks give exact tokens/treatments, not "style appropriately"; two full exemplars (FeatureGrid, Pricing) anchor the pattern. No TBD/TODO.

**Type consistency:** `normalizeAccent`/`accentContrast` signatures match across Tasks 1–2; `CARD`/`CARD_HOVER`/`ACCENT_CHIP`/`Reveal`/`StatCounter`/`SectionWrap` bg values (`accent`) are defined in Tasks 3–4 and consumed with the same names in 6–13.

**Note on TDD scope:** Only `accentColor.ts` has meaningful unit tests (pure logic). Visual sections verify via typecheck + build + explicit visual checks — the honest gate for a CSS/design refactor in a repo with no component-test harness.
