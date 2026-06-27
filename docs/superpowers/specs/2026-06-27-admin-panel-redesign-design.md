# Admin Panel Redesign — Design Spec

**Date:** 2026-06-27
**Status:** Approved
**Primary users:** Non-technical marketing team
**Approach:** Approach 3 — Refined evolution of 3-column layout with design system, autosave, AI generation, and progressive disclosure

---

## 1. Goals

1. Make the admin immediately usable by non-technical marketing team members with no onboarding.
2. Reduce cognitive load — show only what matters for the current task, hide advanced config.
3. Introduce autosave so no work is ever lost.
4. Add AI generation on every eligible field to accelerate content creation.
5. Replace inline Tailwind copy-paste with a proper component primitive layer.
6. Fix field validation UX — inline errors, no page redirects.
7. Remove Chat section entirely (being replaced by external bot).

## 2. Scope

### In scope
- Navigation sidebar
- Document list view (all collections)
- Document editor (center panel + right sidebar)
- Login page (aligned to new design system)
- Settings / Users page (aligned to new design system)
- AI generation API route + per-field prompts
- Component primitive library (Button, Input, Card, Badge, Alert)
- Autosave behaviour

### Out of scope
- Chat routes (`/admin/chat`, `/admin/chat/[sessionId]`) — to be removed
- Marketing site pages (no change)
- Firestore rules (no change)
- CMS collection definitions (no change)
- Mobile app (web only)

---

## 3. Design System

### 3.1 Color Tokens

```
--color-canvas:          #F8F5F1   /* page background */
--color-surface:         #FFFFFF   /* white panels */
--color-surface-subtle:  #FDFBF8   /* nested surfaces */
--color-border:          #E8DDD0   /* dividers, input borders */

--color-brand:           #F16610   /* orange — CTAs, active states */
--color-brand-hover:     #D4550C   /* darker orange on hover */
--color-brand-soft:      rgba(241,102,16,0.08) /* tinted bg for active nav */

--color-text-primary:    #111827
--color-text-secondary:  #6B7280
--color-text-tertiary:   #9CA3AF   /* placeholders, timestamps */

/* Status */
--color-published-bg:    #D1FAE5
--color-published-text:  #065F46
--color-published-dot:   #059669

--color-review-bg:       #DBEAFE
--color-review-text:     #1E3A8A
--color-review-dot:      #2563EB

--color-draft-bg:        #FEF3C7
--color-draft-text:      #92400E
--color-draft-dot:       #D97706

/* Feedback */
--color-error:           #DC2626
--color-error-bg:        #FEE2E2
--color-success:         #059669
--color-success-bg:      #D1FAE5
```

Map these to Tailwind custom tokens in `tailwind.config.js` under the existing `cms` key. Do not replace brand tokens — extend them.

### 3.2 Typography Scale

| Use | Size | Weight | Color |
|-----|------|--------|-------|
| Doc title in header | 20px | semibold | text-primary |
| Section heading | 11px | semibold uppercase tracking-wide | text-secondary |
| Field label | 13px | medium | text-primary |
| Field helper text | 12px | regular | text-secondary |
| Table header | 11px | semibold uppercase | text-secondary |
| Table body | 14px | regular | text-primary |
| Status badge | 11px | semibold uppercase tracking-wider | per status |
| Button | 13px | semibold | varies |
| Autosave / timestamp | 12px | regular | text-tertiary |

Fonts unchanged: `Plus Jakarta Sans` (UI), `Fraunces` (display — not used in admin).

### 3.3 Component Primitives

Extract these into `src/components/ui/` (new folder). All admin UI uses these — no one-off Tailwind button/input strings.

#### Button

```tsx
// variants: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon'
// sizes: 'sm' | 'md' (default) | 'lg'

primary:    bg-brand text-white rounded-lg px-4 py-2 text-[13px] font-semibold hover:bg-brand-hover
secondary:  bg-white border border-border text-primary rounded-lg px-4 py-2 text-[13px] font-medium hover:bg-gray-50
ghost:      transparent text-secondary rounded-lg px-3 py-1.5 text-[13px] hover:bg-gray-100
danger:     bg-red-600 text-white rounded-lg px-4 py-2 text-[13px] font-semibold hover:bg-red-700
icon:       w-9 h-9 rounded-lg border border-border bg-white text-secondary hover:bg-gray-50 flex items-center justify-center
```

#### Input

```tsx
// States: default | focus | error | disabled
base:    border border-border rounded-lg px-3 py-2.5 text-sm text-primary placeholder:text-tertiary outline-none transition
focus:   focus:ring-2 focus:ring-brand/20 focus:border-brand
error:   border-red-400 focus:ring-red-200
disabled: opacity-50 cursor-not-allowed bg-gray-50
```

Always paired with:
- `<label>` above (13px medium)
- Helper text below (12px text-secondary) — every field has one
- Error message below in red when invalid

#### Card / Section Panel

```tsx
bg-white border border-border rounded-xl p-5 shadow-sm
```

#### Badge / Status Pill

```tsx
rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider
// color class injected from statusStyle.ts
```

#### Alert (inline, not redirect)

```tsx
rounded-lg px-4 py-3 text-sm border-l-4 flex items-start gap-2
// success: border-l-green-500 bg-green-50 text-green-800
// error:   border-l-red-500   bg-red-50   text-red-800
// info:    border-l-blue-500  bg-blue-50  text-blue-800
```

#### SectionHeading

```tsx
text-[11px] font-semibold uppercase tracking-wide text-secondary mb-3
```

---

## 4. Navigation Sidebar

**File to update:** `src/components/cms/admin/CmsSidebar.tsx` (or extract new `src/components/cms/admin/AdminSidebar.tsx`)

### Structure

```
┌─────────────────────────────┐
│  🔶  Finanshels             │  logo mark + "Content Studio" subtitle
│      Content Studio         │
│                             │
│  ┄ CONTENT ┄┄┄┄┄┄┄┄┄┄┄┄┄   │
│  ▪ Blog Posts          12   │  human-readable name, count badge
│  ▪ Glossary            48   │
│  ▪ Guides               6   │
│  ▪ FAQs                31   │
│  ▪ Team Members         8   │
│  ▪ Case Studies         4   │
│  ▪ Testimonials        19   │
│  ▪ Tools                9   │
│  ▪ Landing Pages        3   │
│                             │
│  ┄ LEADS ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄   │
│  ▪ Lead Inbox           2 🔴│  red dot for unread
│                             │
│  ┄ SETTINGS ┄┄┄┄┄┄┄┄┄┄┄┄   │
│  ▪ Team & Users             │
│  ▪ My Profile               │
│                             │
│  ─────────────────────────  │
│  ◉  Meet Patel              │  avatar initial (brand orange)
│     meet@finanshels.com     │
│     Admin  ·  Sign out →    │
└─────────────────────────────┘
```

### States

- **Active:** 3px left border in brand-primary, bg brand-soft, text text-primary, count badge highlighted
- **Hover:** bg gray-50, text text-primary
- **Default:** text text-secondary, count in text-tertiary

### Responsive

- **Desktop (≥1280px):** 260px fixed sidebar
- **Tablet (768–1279px):** 52px icon-rail; hover shows label tooltip; hamburger toggle
- **Mobile (<768px):** Hidden by default; hamburger in top-left opens as drawer overlay with backdrop

### Removals

- Remove all Chat routes from nav (`/admin/chat`, `/admin/chat/[sessionId]`)
- Remove "View Site" / "View Blog" quick links (accessible from editor header instead)

---

## 5. Document List View

**File to update:** `src/components/cms/admin/CmsCollectionItemTable.tsx`

### Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  Blog Posts                              [+ New Blog Post]       │
│  12 posts                                                        │
├──────────────────────────────────────────────────────────────────┤
│  [🔍 Search posts...]     [Status ▾]  [Date ▾]                  │
│                                                                  │
│  ● All (12)  ● Published (7)  ○ In Review (3)  ○ Draft (2)     │
│                                                                  │
├───────────────────────────────────────────┬───────┬──────┬──────┤
│  Title                                    │Status │Upd.  │      │
├───────────────────────────────────────────┼───────┼──────┼──────┤
│  □  UAE VAT Filing Guide 2025             │● Live │ 2d   │ Edit │
│     /blog/uae-vat-filing-guide-2025       │       │      │  ··· │
├───────────────────────────────────────────┼───────┼──────┼──────┤
│  □  Corporate Tax for Startups            │◐ Rev  │ 5d   │ Edit │
└───────────────────────────────────────────┴───────┴──────┴──────┘
```

### Key changes

- `+ New [Collection Singular]` — uses human label from collection definition
- Status labels: "Live" (published), "In Review", "Draft" — not raw enum values
- Slug shown below title in text-tertiary — editors can see the live URL
- `Edit` as visible text button (Button secondary, sm)
- `···` overflow menu: "View live · Duplicate · Delete" — no mystery icons
- Checkbox appears on row hover only — keeps default view uncluttered
- Status filter tabs always visible above table
- Empty state: icon + friendly message + primary CTA button

### Empty state

```
         📝

    No blog posts yet
    Create your first post to get started.

         [+ Create Blog Post]
```

---

## 6. Document Editor

### 6.1 Header (sticky)

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Blog Posts   UAE VAT Filing Guide 2025   ● Live  [View ↗]   │
│                                              ✓ Autosaved 2m ago  │
└──────────────────────────────────────────────────────────────────┘
```

- Back arrow (Button icon) warns if unsaved changes before navigating away
- Doc title truncated (`truncate`) — always know where you are
- Status badge (read-only display in header, changed via right sidebar dropdown)
- Autosave indicator: "Saving..." → "Autosaved 2 min ago" → error state if save fails
- "View live ↗" only shown when status = published

### 6.2 Autosave

- Debounce: 3 seconds after last keystroke / field blur
- Saves via existing `saveCmsDocumentAction` server action with `requestedStatus` = current status (no status change on autosave)
- Visual states:
  - Idle: "Autosaved 2 min ago" (text-tertiary)
  - Saving: "Saving..." with subtle spinner (text-tertiary)
  - Saved: "Saved" with green checkmark, fades to timestamp after 2s
  - Error: "Save failed — check your connection" (text-red, retry link)
- Manual save still available via keyboard shortcut ⌘S

### 6.3 Center Panel — Section Order

Sections appear in this order. First two are always expanded. The rest collapsed by default.

1. **CONTENT** (always open)
   - Title (required)
   - URL slug (auto-generated, editable with warning)
   - Content / body (rich text editor)

2. **FEATURED IMAGE** (always open)
   - Image upload + URL input side-by-side
   - Alt text (required when image set)

3. **CARD PREVIEW** (collapsed by default)
   - Live card mockup shown first — visual before fields
   - "Edit card details" expands: card_title, card_description, card_label, card_cta_label, card_cta_link, featured toggle

4. **PAGE SECTIONS** (collapsed by default)
   - Page blocks editor (drag-drop, add, reorder, delete)
   - `+ Add section` primary CTA

5. **ADVANCED** (collapsed by default)
   - Listing page config
   - Detail page config
   - Relationships / cross-references
   - AEO fields (direct_answer, faqItems, howToSteps)
   - GEO fields (citations, keyStatistics, expertQuotes, geoContentType, relatedEntities)

### 6.4 Field Labels & Helper Text

Every field uses a human-readable label and helper text below the input. No snake_case labels exposed to users.

| Old label | New label | Helper text |
|-----------|-----------|-------------|
| `body` / `content` | Content | The main article body. |
| `slug` | URL slug | Auto-generated from title. Change carefully — updates the live URL. |
| `featured_image` | Featured image | Shown at the top of the article and on listing pages. |
| `featured_image_alt` | Image description | Describe the image for visually impaired readers (required). |
| `card_title` | Card title | Overrides the title on listing pages. Leave blank to use the title. |
| `card_description` | Card description | Short summary shown on listing pages (2-3 sentences). |
| `card_cta_label` | Button label | Text on the card's call-to-action button. |
| `meta_title` / `seo_title` | Search title | The title Google shows in search results (50-60 characters ideal). |
| `meta_description` | Search description | The description Google shows in search results (120-160 characters ideal). |
| `focus_keyword` | Main keyword | The primary keyword this article targets. |
| `direct_answer` | Direct answer | A concise answer to the article's main question (for AI assistants). |

### 6.5 Inline Validation

- Required fields validated on submit and on blur
- Error state: red border on input + red helper text below ("Title is required before saving.")
- First invalid field receives focus automatically on submit attempt
- No page redirect on validation error — stay on page, highlight fields
- Remove current `?error=missing-slug` redirect pattern

---

## 7. Right Sidebar — Publish & SEO

### 7.1 Publish section

```
Status
┌──────────────────┐
│ ◌ Draft      ▾  │   ← single <select> or custom dropdown
└──────────────────┘
Only admins can publish live.   ← shown if role = editor

[  Submit for review  ]   ← primary CTA for editors (Button primary)
[  ✓  Publish live   ]   ← primary CTA for admins (Button green / brand)

Schedule (optional)
[📅 Pick date & time]
Leave blank to publish now.
```

- Status changed via dropdown (not segmented control)
- CTA button context-aware by role:
  - Editor + draft → "Submit for review"
  - Editor + in_review → "Update draft" (can't publish)
  - Admin/owner + any → "Publish live" (green)
  - Admin/owner + published → "Save changes"
- Publish button is large, prominent, satisfying — the clear end goal

### 7.2 Content Scores

Collapsed by default. Shows score bar + number at a glance.

```
Content score
SEO   ████████░░  76/100  ▾
AEO   ██████░░░░  58/100  ▾
GEO   ███████░░░  65/100  ▾
```

Expanding SEO shows:
- Search title field + live character counter ("52 chars · Ideal: 50-60" — green/orange)
- Search description field + live character counter
- Live SERP preview (updates as user types)
- Focus keyword field
- SEO checklist (✓/○ items with point values)

AEO and GEO expand to show their fields and checklists.

Rename tabs label from "AEO / GEO" to plain "Content score" — no jargon exposed.

### 7.3 Version History

Visible to all roles (currently admin-only — change this).

```
Version history
Today, 2:14pm   (current)
Yesterday, 9:05am   [Revert]
Mon Jun 23, 4:32pm  [Revert]
```

Revert shows confirmation dialog before restoring.

---

## 8. AI Generation

### 8.1 API Route

`POST /api/admin/ai/generate` — auth-gated (valid admin session required).

Request body:
```json
{
  "field": "meta_description",
  "collection": "blog_posts",
  "context": {
    "title": "UAE VAT Filing Guide 2025",
    "body": "..."
  }
}
```

Response: streaming text (Server-Sent Events / ReadableStream).

Rate limit: 20 requests per user per hour (stored in session or lightweight in-memory map).

### 8.2 Per-field AI Buttons

Every eligible field has a `[✨ AI]` ghost button next to its label. Placement: right-aligned in the label row.

| Field | Button label | AI action |
|-------|-------------|-----------|
| Title | ✨ Suggest | Returns 3 title options (radio select) |
| Content / body | ✨ Write draft | Generates full article draft from title |
| Content (selection) | ✨ Improve | Rewrites selected text |
| Content (selection) | ✨ Expand | Expands selected paragraph |
| Alt text | ✨ Describe | Generates image description |
| Card description | ✨ Generate | Summarises article in 2 sentences |
| Card CTA label | ✨ Suggest | Returns 3 CTA options |
| Search title | ✨ Generate | Writes SEO title 50-60 chars |
| Search description | ✨ Generate | Writes meta description 120-160 chars |
| Focus keyword | ✨ Suggest | Returns top 3 keyword candidates |
| Direct answer | ✨ Generate | Writes concise 1-paragraph answer |
| FAQ items | ✨ Generate | Generates 5 FAQ pairs from content |
| Key statistics | ✨ Suggest | Suggests statistics to include |

### 8.3 Generation Popover UX

```
┌──────────────────────────────────────────────────┐
│  ✨  Writing SEO description...           ✕      │
│  ─────────────────────────────────────────────   │
│  Learn everything about UAE VAT filing for       │
│  2025, including deadlines, rates, and how       │
│  FTA-registered businesses can stay compliant.▌  │  ← streaming
│                                                  │
│  132 chars · ✓ In range                         │
│  ─────────────────────────────────────────────   │
│  [Use this]    [Regenerate]    [Discard]         │
└──────────────────────────────────────────────────┘
```

- Streams word-by-word via ReadableStream
- Character count / validation updates live during streaming
- "Use this" inserts into field (does not auto-save — autosave picks it up 3s later)
- "Regenerate" calls API again with same context
- "Discard" closes popover, field unchanged
- For "Suggest titles / keywords / CTAs" — shows radio list, user selects one then "Use selected"

### 8.4 System Prompts (server-side, never exposed to client)

Stored in `src/lib/cms/ai/prompts.ts`. Each field type has a template that receives `{title}`, `{body}`, `{collection}`, `{field}` interpolation. Not editable from admin UI (v1).

---

## 9. Login Page

Aligned to design system — no functional changes, visual refresh only.

- Centered card, max-w-md
- Finanshels logo mark at top
- "Sign in to Content Studio" heading (not "Finanshels CMS")
- Email + password using new Input primitive
- Error state inline below the form (not redirect)
- Submit button: Button primary, full width

---

## 10. Settings / Users Page

Aligned to design system. No functional changes in v1.

- User table uses new table styling
- Role badges use new Badge primitive
- Invite flow uses new Input + Button primitives
- SettingsSidebar updated to match AdminSidebar visual language

---

## 11. Removals

| What | Where | Reason |
|------|-------|--------|
| Chat list page | `/admin/chat/page.tsx` | Replaced by external bot |
| Chat detail page | `/admin/chat/[sessionId]/page.tsx` | Replaced by external bot |
| Chat nav item | `CmsSidebar` | Removed from navigation |

Routes should return 404 or redirect to `/admin/cms` after removal.

---

## 12. Files to Create / Modify

### New files
- `src/components/ui/Button.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Alert.tsx`
- `src/components/ui/SectionHeading.tsx`
- `src/components/ui/index.ts` (barrel export)
- `src/components/cms/admin/AutosaveIndicator.tsx`
- `src/components/cms/admin/AiGenerateButton.tsx`
- `src/components/cms/admin/AiGeneratePopover.tsx`
- `src/components/cms/admin/PublishSidebar.tsx`
- `src/components/cms/admin/ContentScores.tsx`
- `src/app/api/admin/ai/generate/route.ts`
- `src/lib/cms/ai/prompts.ts`

### Major modifications
- `src/app/admin/cms/page.tsx` — refactor sections, add autosave, inline validation, section collapse defaults, field label/helper text pass-through
- `src/components/cms/admin/CmsSidebar.tsx` — new visual design, remove Chat, human labels, grouped sections
- `src/components/cms/admin/CmsCollectionItemTable.tsx` — new table design, human status labels, text Edit button, overflow menu
- `src/components/cms/admin/FieldEditor.tsx` — add AI button per field, helper text prop, error prop
- `src/app/admin/login/page.tsx` — visual refresh
- `src/app/admin/settings/users/page.tsx` — visual refresh
- `tailwind.config.js` — add new color tokens

### Deletions
- `src/app/admin/chat/page.tsx`
- `src/app/admin/chat/[sessionId]/page.tsx`

---

## 13. Non-Goals (v1)

- Dark mode
- Mobile-native layout (responsive improvements only)
- Custom AI prompt editing from admin UI
- Bulk AI generation (field-by-field only)
- Real-time collaborative editing
- Notification system
- Advanced media library (no change to CmsMediaLibrary.tsx)
