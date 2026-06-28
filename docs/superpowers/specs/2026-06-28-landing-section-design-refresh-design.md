# Landing-page section design refresh — "brand-aligned premium"

**Date:** 2026-06-28
**Status:** Approved (design) — pending implementation plan
**Scope:** Public output of the Landing Page Studio (all 17 section types). The admin editor is unchanged.

## Context

The Landing Page Studio renders 17 section types via [LandingPageRenderer.tsx](../../../src/components/landing-pages/sections/Sections.tsx). The output is clean but generic: flat `rounded-2xl` cards with hairline borders and faint shadows, a hardcoded **amber** accent (+ emerald for ticks), and no motion. Meanwhile the rest of the site (blog, webinars, recent work) moved to **Inter + a blue/slate** language, so landing pages read as a different product. Crucially, landing pages already carry a per-page `theme.accent_color`, but the sections ignore it — every campaign looks identical.

**Goal:** Make the rendered sections feel like a premium, cohesive part of the site, driven by a **per-page accent color** (blue default), with subtle motion — without hurting conversion or adding heavy dependencies.

## Decisions (confirmed)

| Fork | Choice |
|---|---|
| Direction | **B — brand-aligned premium** (re-skin to Inter/blue-slate, richer cards + depth, tasteful motion) |
| Accent | **Per-page accent, blue default** — thread `theme.accent_color` through every section; default brand blue when unset |
| Motion | **Subtle scroll-reveal + hover**, `prefers-reduced-motion` respected, no CLS |
| Scope | **All 17 sections** in one pass |

## What exists today (build on, don't reinvent)

- The renderer already sets `--lp-accent` (+ `--lp-accent-contrast: #0f172a`) on a wrapper and adds class `.lp-themed` **only when** a page sets `accent_color` ([LandingPageRenderer.tsx:73-79](../../../src/components/landing-pages/LandingPageRenderer.tsx#L73)).
- `CtaButtons` already overrides amber with the accent via `[.lp-themed_&]:bg-[var(--lp-accent)]` ([CtaButtons.tsx:62](../../../src/components/landing-pages/CtaButtons.tsx#L62)). This is the exact pattern to generalize.
- `font-display` already maps to Inter (`tailwind.config.js` → `display: var(--font-sans)`), so headings are on-brand; only scale/tracking need refining.
- No animation library is installed — motion must be dependency-free.
- `safeProps` helpers (`s`, `n`, `b`, `jsonArray`, `splitLines`, `asObject`) are the prop-reading layer; keep using them.

## 1. Foundation — accent token system

**Always define the accent tokens** so sections can rely on them whether or not a page sets a color.

- `globals.css`:
  ```css
  :root { --lp-accent: #2563eb; --lp-accent-contrast: #ffffff; }
  .lp-themed {
    --lp-accent-soft:   color-mix(in srgb, var(--lp-accent) 10%, white);
    --lp-accent-tint:   color-mix(in srgb, var(--lp-accent) 16%, white);
    --lp-accent-ring:   color-mix(in srgb, var(--lp-accent) 35%, white);
    --lp-accent-strong: color-mix(in srgb, var(--lp-accent) 88%, black);
  }
  ```
- **Renderer change:** always render the wrapper with class `.lp-themed`. Set `--lp-accent` to the normalized page accent **or** the blue default, and compute `--lp-accent-contrast` from the accent's relative luminance (light accent → `#0f172a`, dark → `#ffffff`) so accent buttons/badges stay legible for any color. Add a small pure `accentContrast(hex)` helper (sRGB luminance; threshold ≈ 0.6).
- **Re-skin:** replace every hardcoded `amber-*` "brand" usage in the sections with the accent tokens (`bg-[var(--lp-accent)]`, `text-[var(--lp-accent)]`, soft/tint/ring for chips, highlights, gradients). Keep **emerald strictly for success semantics** (feature ticks, guarantee, comparison ✓).

**Depth & shape:** introduce a shared elevated-card treatment — layered soft shadow (replacing flat `shadow-sm`), `border-slate-200/70`, `rounded-2xl`/`rounded-3xl`, hover lift (`-translate-y-0.5` + shadow). **Type & rhythm:** tighten heading scale/tracking; standardize section vertical rhythm and `max-w` via the shared wrapper.

## 2. Motion (dependency-free)

- **`Reveal`** (`'use client'`, IntersectionObserver): fades + rises children on first scroll-in (`opacity-0 translate-y-3` → `opacity-100 translate-y-0`, ~500ms ease-out), unobserves after firing. Optional `delay` prop for **stagger** in grids. When `matchMedia('(prefers-reduced-motion: reduce)')` matches, render children immediately with no transform (no observer). No reserved height → no CLS (initial state only translates, never collapses).
- **`StatCounter`** (`'use client'`): counts a numeric value up on reveal (parses the numeric part, preserves prefix/suffix like `+`, `%`, `AED`); static under reduced-motion.
- **Hover:** card lift + shadow + accent edge; button active/press states. CSS-only.

## 3. Per-section changes (all 17)

- **Hero** (4 variants — split-form, centered-form, video-form, urgency-banner): accent eyebrow chip; accent-tinted spotlight/gradient backdrop (not amber); elevated form card; trust ticks; urgency banner + `urgency-banner` gradient use the accent.
- **TrustBar:** refined logo rail, grayscale→full-color on hover, accent rating pill.
- **AwardsPress:** consistent logo sizing/treatment, accent label.
- **StatsRow:** `StatCounter` numerals in accent, divider rhythm, reveal stagger.
- **TestimonialsCarousel:** richer quote cards (accent quote mark, avatar/initial monogram, subtle gradient top-edge), horizontal scroll-snap on mobile, reveal stagger.
- **VideoTestimonial:** framed player, play affordance, accent quote.
- **FeatureGrid:** accent-tinted icon chips (`bg-[var(--lp-accent-soft)] text-[var(--lp-accent)]`), hover lift, 2/3/4-col, stagger.
- **ProcessSteps:** connected timeline line, accent step badges, stagger.
- **ComparisonTable:** accent-highlighted recommended column (header + cells), sticky first column on mobile scroll, cleaner ✓ (emerald) / ✗ (slate).
- **Pricing:** highlighted tier = accent ring + soft gradient + "Most popular" ribbon in accent; refined feature list and full-width CTA.
- **InlineForm:** accent-tinted panel, stronger split hierarchy, elevated form.
- **LeadMagnet:** premium cover treatment + "Free download" badge in accent, elevated form card.
- **FinalCta:** strong closing — accent/dark gradient panel, large heading, elevated form.
- **CtaBanner:** accent gradient background (replaces amber-400), refined button group, readable on any accent via `--lp-accent-contrast`.
- **Faq:** smooth height/opacity expand, accent active state on the open item, hover affordance.
- **Guarantee:** premium emerald/accent badge callout with layered card.
- **RiskReversal:** polished badge row (chips with accent/emerald icons).

## 4. File structure

`Sections.tsx` is 643 lines / 16 components in one file. Since every section is being rewritten, **split into a `sections/` folder, one file per section**, plus a shared **`primitives.tsx`** exporting the cross-section building blocks: `Container`, `SectionWrap`, `SectionHeading`, `Reveal`, `StatCounter`, `getLucideIcon`, and the elevated-card/accent class helpers.

- A barrel `sections/index.ts` re-exports all section components under their current names, so `LandingPageRenderer.tsx`'s import block and its section-`type` → component switch are **unchanged**. (`HeroSection.tsx` keeps its own default export.)
- Each section file stays small and independently readable. `'use client'` only where needed (sections using state/motion/forms).

## 5. Guardrails

- **Conversion first:** forms and primary CTAs never lose prominence; accent makes them *more* salient. No change to lead-capture wiring (`LeadForm`, conversion IDs, anchors).
- **Accessibility:** `prefers-reduced-motion` disables all entrance/counter motion; accent-contrast token guarantees legible text on any accent; focus states preserved.
- **No CLS:** reveal uses transform/opacity only; counters reserve final width.
- **Studio parity:** the admin live-preview uses this same renderer (`editMode`) — verify sections still render and remain click-selectable; the `SectionFrame` edit wrapper must be unaffected.
- **Safe props:** continue reading all props through `safeProps`; tolerate missing/partial props (every section already guards empties).

## 6. Verification

1. `npm run typecheck` → `npm run build` (sections are client components; no server-only leakage).
2. Visual pass on a seeded landing page (e.g. `/landing-pages/corporate-tax`) at desktop/tablet/mobile: default (blue) accent, then set a page `accent_color` (e.g. a non-blue hex) and confirm every section recolors and text stays legible.
3. Toggle OS reduced-motion → confirm no entrance animation / counters render final values.
4. Open the Studio editor live-preview → confirm sections render and stay selectable/editable.
5. Quick Lighthouse/CLS sanity check on a built page.

## Out of scope

- No new section *types*, no admin-editor/field changes, no template changes (existing `templates.ts` keeps working).
- No new fonts; no animation library.
- Hero copy/field semantics unchanged — visual treatment only.
