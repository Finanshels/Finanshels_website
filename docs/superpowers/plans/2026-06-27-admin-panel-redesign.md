# Admin Panel Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Finanshels CMS admin panel into a polished, non-technical-user-friendly interface with design system primitives, autosave, AI content generation, and improved UX throughout.

**Architecture:** Build a shared UI primitive layer first (`src/components/ui/`), then progressively replace inline Tailwind in admin components. Extract the inline CmsSidebar from cms/page.tsx into its own component. Add autosave via a dedicated API route (JSON response, no redirect). Add AI generation via a streaming route using `@ai-sdk/anthropic` + the already-installed `ai@5` package.

**Tech Stack:** Next.js 15 App Router, React 18, Tailwind CSS v3, TypeScript, Lucide React, clsx + tailwind-merge (already installed), ai v5 (already installed), @ai-sdk/react (already installed), @ai-sdk/anthropic (to install in Task 3)

**Spec:** `docs/superpowers/specs/2026-06-27-admin-panel-redesign-design.md`

---

## Phase 1 — Foundation

### Task 1: cn utility + Tailwind tokens

**Files:**
- Create: `src/lib/cn.ts`
- Modify: `tailwind.config.js`

- [ ] **Step 1: Create cn utility**

```ts
// src/lib/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 2: Add admin color tokens to tailwind.config.js**

In `tailwind.config.js`, inside `theme.extend.colors`, add an `admin` key alongside the existing `brand` and `cms` keys:

```js
admin: {
  'text-primary':   '#111827',
  'text-secondary': '#6B7280',
  'text-tertiary':  '#9CA3AF',
  'brand-hover':    '#D4550C',
  'pub-bg':         '#D1FAE5',
  'pub-text':       '#065F46',
  'pub-dot':        '#059669',
  'rev-bg':         '#DBEAFE',
  'rev-text':       '#1E3A8A',
  'rev-dot':        '#2563EB',
  'draft-bg':       '#FEF3C7',
  'draft-text':     '#92400E',
  'draft-dot':      '#D97706',
},
```

- [ ] **Step 3: Verify build compiles**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/cn.ts tailwind.config.js
git commit -m "feat(admin): add cn utility and admin color tokens"
```

---

### Task 2: UI Primitive Components

**Files:**
- Overwrite: `src/components/ui/Button.jsx` → `src/components/ui/Button.tsx`
- Overwrite: `src/components/ui/Input.jsx` → `src/components/ui/Input.tsx`
- Overwrite: `src/components/ui/Card.jsx` → `src/components/ui/Card.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Alert.tsx`
- Create: `src/components/ui/SectionHeading.tsx`
- Create: `src/components/ui/index.ts`

- [ ] **Step 1: Write Button.tsx**

Delete `src/components/ui/Button.jsx`, then create `src/components/ui/Button.tsx`:

```tsx
// src/components/ui/Button.tsx
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variants: Record<ButtonVariant, string> = {
  primary:   'bg-brand-primary text-white hover:bg-admin-brand-hover shadow-sm',
  secondary: 'bg-white border border-cms-rule text-slate-900 hover:bg-gray-50',
  ghost:     'text-slate-500 hover:bg-gray-100 hover:text-slate-700',
  danger:    'bg-red-600 text-white hover:bg-red-700',
  icon:      'w-9 h-9 border border-cms-rule bg-white text-slate-500 hover:bg-cms-hover flex items-center justify-center',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-[12px]',
  md: 'px-4 py-2 text-[13px]',
  lg: 'px-5 py-2.5 text-sm',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        variant !== 'icon' && sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
)
Button.displayName = 'Button'
```

- [ ] **Step 2: Write Input.tsx**

Delete `src/components/ui/Input.jsx`, then create `src/components/ui/Input.tsx`:

```tsx
// src/components/ui/Input.tsx
import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, className, id, required, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-[13px] font-medium text-slate-800">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          className={cn(
            'w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900',
            'placeholder:text-slate-400 outline-none transition',
            error
              ? 'border-red-400 focus:ring-2 focus:ring-red-200'
              : 'border-cms-rule focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary',
            props.disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
            className,
          )}
          {...props}
        />
        {error     && <p className="text-[12px] text-red-600">{error}</p>}
        {helperText && !error && <p className="text-[12px] text-slate-500">{helperText}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'
```

- [ ] **Step 3: Write Card.tsx**

Delete `src/components/ui/Card.jsx`, then create `src/components/ui/Card.tsx`:

```tsx
// src/components/ui/Card.tsx
import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('bg-white border border-cms-rule rounded-xl p-5 shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 4: Write Badge.tsx**

```tsx
// src/components/ui/Badge.tsx
import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type BadgeVariant = 'published' | 'in_review' | 'draft' | 'default'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  published: 'bg-admin-pub-bg text-admin-pub-text border-admin-pub-dot/30',
  in_review: 'bg-admin-rev-bg text-admin-rev-text border-admin-rev-dot/30',
  draft:     'bg-admin-draft-bg text-admin-draft-text border-admin-draft-dot/30',
  default:   'bg-gray-100 text-gray-700 border-gray-300/30',
}

const dotClasses: Record<BadgeVariant, string> = {
  published: 'text-admin-pub-dot',
  in_review: 'text-admin-rev-dot',
  draft:     'text-admin-draft-dot',
  default:   'text-gray-500',
}

const labels: Record<BadgeVariant, string> = {
  published: 'Live',
  in_review: 'In Review',
  draft:     'Draft',
  default:   'Unknown',
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5',
        'text-[11px] font-semibold uppercase tracking-wider',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      <span className={cn('text-[8px]', dotClasses[variant])} aria-hidden>●</span>
      {children ?? labels[variant]}
    </span>
  )
}
```

- [ ] **Step 5: Write Alert.tsx**

```tsx
// src/components/ui/Alert.tsx
import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type AlertVariant = 'success' | 'error' | 'info' | 'warning'

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
}

const variantClasses: Record<AlertVariant, string> = {
  success: 'border-l-emerald-500 bg-emerald-50 text-emerald-800',
  error:   'border-l-red-500 bg-red-50 text-red-800',
  info:    'border-l-blue-500 bg-blue-50 text-blue-800',
  warning: 'border-l-amber-500 bg-amber-50 text-amber-800',
}

export function Alert({ variant = 'info', className, children, ...props }: AlertProps) {
  return (
    <div
      className={cn(
        'rounded-lg border-l-4 px-4 py-3 text-sm flex items-start gap-2',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 6: Write SectionHeading.tsx**

```tsx
// src/components/ui/SectionHeading.tsx
import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface SectionHeadingProps extends HTMLAttributes<HTMLParagraphElement> {}

export function SectionHeading({ className, children, ...props }: SectionHeadingProps) {
  return (
    <p
      className={cn(
        'text-[11px] font-semibold uppercase tracking-wide text-slate-500',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  )
}
```

- [ ] **Step 7: Write barrel export**

```ts
// src/components/ui/index.ts
export { Button } from './Button'
export { Input } from './Input'
export { Card } from './Card'
export { Badge } from './Badge'
export { Alert } from './Alert'
export { SectionHeading } from './SectionHeading'
export type { ButtonVariant, ButtonSize } from './Button'
```

- [ ] **Step 8: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add src/components/ui/ src/lib/cn.ts
git commit -m "feat(ui): add design system primitives (Button, Input, Card, Badge, Alert, SectionHeading)"
```

---

### Task 3: Install AI generation dependencies

**Files:**
- Modify: `package.json` (via npm)
- Create: `.env.local` addition (documented, not committed)

- [ ] **Step 1: Install @ai-sdk/anthropic**

```bash
npm install @ai-sdk/anthropic
```

- [ ] **Step 2: Add ANTHROPIC_API_KEY to .env.local**

Add to `.env.local` (create if doesn't exist — this file is gitignored):

```
ANTHROPIC_API_KEY=sk-ant-...your-key-here...
```

Also add to Vercel environment variables via `vercel env add ANTHROPIC_API_KEY`.

- [ ] **Step 3: Verify install**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit package files only**

```bash
git add package.json package-lock.json
git commit -m "feat(ai): install @ai-sdk/anthropic for content generation"
```

---

## Phase 2 — Chat Removal

### Task 4: Remove chat routes and navigation entry

**Files:**
- Delete: `src/app/admin/chat/page.tsx`
- Delete: `src/app/admin/chat/[sessionId]/page.tsx`
- Modify: `src/app/admin/cms/page.tsx` (remove chat nav links from inline sidebar)

- [ ] **Step 1: Delete chat page files**

```bash
rm src/app/admin/chat/page.tsx
rm -rf "src/app/admin/chat/[sessionId]"
```

Verify the directories are gone:
```bash
ls src/app/admin/
```

Expected: no `chat` directory.

- [ ] **Step 2: Search for chat references in the codebase**

```bash
grep -r "admin/chat" src/ --include="*.tsx" --include="*.ts" -l
```

For each file found, remove any link or nav entry pointing to `/admin/chat`.

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Build check**

```bash
npm run build
```

Expected: successful build with no reference to removed chat routes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(admin): remove chat routes (replaced by external bot)"
```

---

## Phase 3 — Navigation Sidebar

### Task 5: Extract and redesign AdminSidebar

The current sidebar is defined inline inside `src/app/admin/cms/page.tsx`. Extract it to its own component with the new design.

**Files:**
- Create: `src/components/cms/admin/AdminSidebar.tsx`
- Modify: `src/app/admin/cms/page.tsx` (replace inline sidebar with `<AdminSidebar />`)

- [ ] **Step 1: Create AdminSidebar.tsx**

```tsx
// src/components/cms/admin/AdminSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/cn'
import { SectionHeading } from '@/components/ui'
import type { CmsSession } from '@/lib/cms/adminAuth'
import type { CmsCollectionKey } from '@/lib/cms/collectionDefinitions'
import { CMS_COLLECTION_DEFINITIONS } from '@/lib/cms/collectionDefinitions'

interface AdminSidebarProps {
  activeCollection?: CmsCollectionKey
  collectionCounts: Partial<Record<CmsCollectionKey, number>>
  session: CmsSession
  leadInboxCount?: number
}

const CONTENT_COLLECTIONS: CmsCollectionKey[] = [
  'blog_posts',
  'glossary_terms',
  'guides',
  'faqs',
  'team_members',
  'case_studies',
  'testimonials',
  'tools',
  'landing_pages',
]

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase()
}

function getRole(session: CmsSession): string {
  // session.role is a string like 'admin', 'editor', 'owner'
  const r = (session as unknown as { role?: string }).role
  return r ? r.charAt(0).toUpperCase() + r.slice(1) : 'User'
}

export function AdminSidebar({
  activeCollection,
  collectionCounts,
  session,
  leadInboxCount = 0,
}: AdminSidebarProps) {
  const pathname = usePathname()

  const displayName =
    (session as unknown as { name?: string }).name ??
    (session as unknown as { email?: string }).email ??
    'User'
  const email = (session as unknown as { email?: string }).email ?? ''
  const role = getRole(session)
  const initial = getInitial(displayName)

  function navItem(
    key: CmsCollectionKey,
    count: number | undefined,
    badge?: React.ReactNode,
  ) {
    const def = CMS_COLLECTION_DEFINITIONS.find((d) => d.key === key)
    if (!def) return null
    const isActive = activeCollection === key
    return (
      <Link
        key={key}
        href={`/admin/cms?collection=${key}`}
        className={cn(
          'flex items-center justify-between rounded-lg px-3 py-2 text-[13px] transition',
          isActive
            ? 'border-l-[3px] border-brand-primary bg-brand-primary/8 font-semibold text-slate-900 pl-[9px]'
            : 'font-medium text-slate-500 hover:bg-gray-50 hover:text-slate-900',
        )}
      >
        <span className="truncate">{def.label}</span>
        <span className="flex items-center gap-1.5 shrink-0">
          {badge}
          {count !== undefined && (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums',
                isActive ? 'bg-brand-primary/15 text-brand-primary' : 'bg-gray-100 text-slate-500',
              )}
            >
              {count}
            </span>
          )}
        </span>
      </Link>
    )
  }

  const isSettings = pathname.startsWith('/admin/settings')

  return (
    <aside className="flex h-full flex-col overflow-y-auto rounded-2xl border border-cms-rule bg-white px-3 py-4 shadow-sm">
      {/* Branding */}
      <div className="mb-5 px-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary">
            <span className="text-sm font-bold text-white">F</span>
          </div>
          <div>
            <p className="text-[13px] font-bold leading-none text-slate-900">Finanshels</p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-slate-400">
              Content Studio
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-1 px-2">
        <SectionHeading>Content</SectionHeading>
      </div>
      <nav className="mb-4 space-y-0.5">
        {CONTENT_COLLECTIONS.map((key) =>
          navItem(key, collectionCounts[key]),
        )}
      </nav>

      {/* Leads */}
      <div className="mb-1 px-2">
        <SectionHeading>Leads</SectionHeading>
      </div>
      <nav className="mb-4 space-y-0.5">
        {navItem(
          'landing_pages',
          undefined,
          leadInboxCount > 0 ? (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {leadInboxCount > 9 ? '9+' : leadInboxCount}
            </span>
          ) : undefined,
        )}
        <Link
          href="/admin/cms/landing-page-leads"
          className={cn(
            'flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium transition',
            pathname === '/admin/cms/landing-page-leads'
              ? 'border-l-[3px] border-brand-primary bg-brand-primary/8 font-semibold text-slate-900 pl-[9px]'
              : 'text-slate-500 hover:bg-gray-50 hover:text-slate-900',
          )}
        >
          <span>Lead Inbox</span>
          {leadInboxCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {leadInboxCount > 9 ? '9+' : leadInboxCount}
            </span>
          )}
        </Link>
      </nav>

      {/* Settings */}
      <div className="mb-1 px-2">
        <SectionHeading>Settings</SectionHeading>
      </div>
      <nav className="mb-4 space-y-0.5">
        <Link
          href="/admin/settings/users"
          className={cn(
            'flex items-center rounded-lg px-3 py-2 text-[13px] font-medium transition',
            isSettings
              ? 'border-l-[3px] border-brand-primary bg-brand-primary/8 font-semibold text-slate-900 pl-[9px]'
              : 'text-slate-500 hover:bg-gray-50 hover:text-slate-900',
          )}
        >
          Team &amp; Users
        </Link>
        <Link
          href="/admin/settings/profile"
          className="flex items-center rounded-lg px-3 py-2 text-[13px] font-medium text-slate-500 transition hover:bg-gray-50 hover:text-slate-900"
        >
          My Profile
        </Link>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User card */}
      <div className="border-t border-cms-rule pt-3 mt-3">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-slate-900">{displayName}</p>
            <p className="truncate text-[11px] text-slate-400">{email}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between px-2">
          <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-primary">
            {role}
          </span>
          <form action="/admin/logout" method="post">
            <button
              type="submit"
              className="text-[12px] text-slate-400 hover:text-slate-700 transition"
            >
              Sign out →
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Find where the inline sidebar is rendered in cms/page.tsx**

```bash
grep -n "CmsSidebar\|cms-sidebar\|collection.*nav\|sidebar" src/app/admin/cms/page.tsx | head -30
```

Identify the exact JSX block (around lines 741-852 per the audit). Replace the inline sidebar JSX with:

```tsx
import { AdminSidebar } from '@/components/cms/admin/AdminSidebar'

// Replace the inline sidebar block with:
<AdminSidebar
  activeCollection={params.collection as CmsCollectionKey | undefined}
  collectionCounts={collectionCounts}
  session={session}
/>
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Fix any type errors that arise (session type shape, CmsCollectionKey mismatches).

- [ ] **Step 4: Dev smoke test**

```bash
npm run dev
```

Navigate to `http://localhost:3000/admin/cms`. Verify the sidebar renders with:
- "Finanshels / Content Studio" header
- Collection list with counts
- Lead Inbox section
- Settings section
- User card at bottom

- [ ] **Step 5: Commit**

```bash
git add src/components/cms/admin/AdminSidebar.tsx src/app/admin/cms/page.tsx
git commit -m "feat(admin): extract and redesign AdminSidebar with new visual language"
```

---

## Phase 4 — Document List View

### Task 6: Redesign CmsCollectionItemTable

**Files:**
- Modify: `src/components/cms/admin/CmsCollectionItemTable.tsx`

- [ ] **Step 1: Find and update the table status labels**

In `CmsCollectionItemTable.tsx`, find where `status` values are displayed in table cells. Replace raw status strings with human-readable labels using this helper. Add near the top of the file:

```tsx
import { Badge } from '@/components/ui'
import type { CmsDocumentStatus } from '@/lib/cms/collectionRepository'

function statusVariant(status: CmsDocumentStatus): 'published' | 'in_review' | 'draft' {
  if (status === 'published') return 'published'
  if (status === 'in_review') return 'in_review'
  return 'draft'
}
```

Replace every instance of inline status rendering (the colored span with the raw status string) with:

```tsx
<Badge variant={statusVariant(item.status)} />
```

- [ ] **Step 2: Update the "New document" button to use collection singular label**

Find the "+ New" button (or link) in the table header. Replace its label:

```tsx
// Before (approximate):
<Link href={`/admin/cms/new/${collectionKey}`}>+ New</Link>

// After:
<Link
  href={`/admin/cms/new/${collectionKey}`}
  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-primary px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-admin-brand-hover transition"
>
  + New {singularLabel}
</Link>
```

The `singularLabel` prop should already be available (check the component's props — if it's not passed in, find where the component is rendered in `cms/page.tsx` and pass `definition.singularLabel`).

- [ ] **Step 3: Replace icon-only action buttons with a text "Edit" button + overflow menu**

Find the action cell in the table row. Replace mystery icon buttons:

```tsx
// Action cell replacement
<td className="px-4 py-3 text-right">
  <div className="flex items-center justify-end gap-2">
    <Link
      href={`/admin/cms?collection=${item.collection}&slug=${encodeURIComponent(item.slug)}`}
      className="rounded-lg border border-cms-rule bg-white px-3 py-1.5 text-[12px] font-medium text-slate-700 hover:bg-gray-50 transition"
    >
      Edit
    </Link>
    <div className="relative group/actions">
      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-cms-rule bg-white text-slate-500 hover:bg-gray-50 transition"
        aria-label="More actions"
      >
        ···
      </button>
      <div className="absolute right-0 top-full z-10 mt-1 hidden min-w-[140px] rounded-xl border border-cms-rule bg-white py-1 shadow-lg group-hover/actions:block">
        {item.liveUrl && (
          <a
            href={item.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center px-4 py-2 text-[13px] text-slate-700 hover:bg-gray-50"
          >
            View live ↗
          </a>
        )}
        <button
          type="button"
          onClick={() => onDuplicate(item.id)}
          className="flex w-full items-center px-4 py-2 text-[13px] text-slate-700 hover:bg-gray-50"
        >
          Duplicate
        </button>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="flex w-full items-center px-4 py-2 text-[13px] text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</td>
```

- [ ] **Step 4: Update table header and row styles**

Replace existing table styles with the new design:

```tsx
// Table wrapper
<div className="overflow-hidden rounded-xl border border-cms-rule bg-white shadow-sm">
  <table className="w-full text-left">
    <thead className="border-b border-cms-rule bg-gray-50">
      <tr>
        <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Title
        </th>
        <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Status
        </th>
        <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Updated
        </th>
        <th className="px-4 py-3" />
      </tr>
    </thead>
    <tbody className="divide-y divide-cms-rule">
      {items.map((item) => (
        <tr key={item.id} className="group hover:bg-gray-50 transition">
          <td className="px-4 py-3">
            <p className="font-semibold text-[14px] text-slate-900">{item.title}</p>
            <p className="mt-0.5 font-mono text-[11px] text-slate-400">/{item.slug}</p>
          </td>
          <td className="px-4 py-3">
            <Badge variant={statusVariant(item.status)} />
          </td>
          <td className="px-4 py-3 text-[13px] text-slate-500 whitespace-nowrap">
            {formatRelativeDate(item.updatedAt)}
          </td>
          {/* action cell from Step 3 */}
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

Add `formatRelativeDate` helper near the top of the file:

```tsx
function formatRelativeDate(date: Date | undefined): string {
  if (!date) return '—'
  const diff = Date.now() - date.getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
```

- [ ] **Step 5: Add empty state**

Find the conditional that renders when `items.length === 0`. Replace with:

```tsx
{items.length === 0 && (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
      📝
    </div>
    <p className="text-[15px] font-semibold text-slate-700">No {label.toLowerCase()} yet</p>
    <p className="mt-1 text-[13px] text-slate-400">
      Create your first {singularLabel.toLowerCase()} to get started.
    </p>
    <Link
      href={`/admin/cms/new/${collectionKey}`}
      className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-brand-primary px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-admin-brand-hover transition"
    >
      + Create {singularLabel}
    </Link>
  </div>
)}
```

- [ ] **Step 6: Update status filter tabs**

Find the status filter tab row. Replace with:

```tsx
<div className="flex items-center gap-1 border-b border-cms-rule px-4 py-3">
  {(['all', 'published', 'in_review', 'draft'] as const).map((s) => {
    const labels = { all: 'All', published: 'Live', in_review: 'In Review', draft: 'Draft' }
    const counts = {
      all: items.length,
      published: items.filter(i => i.status === 'published').length,
      in_review: items.filter(i => i.status === 'in_review').length,
      draft: items.filter(i => i.status === 'draft').length,
    }
    const isActive = activeFilter === s
    return (
      <button
        key={s}
        type="button"
        onClick={() => setActiveFilter(s)}
        className={cn(
          'rounded-lg px-3 py-1.5 text-[12px] font-medium transition',
          isActive
            ? 'bg-slate-900 text-white'
            : 'text-slate-500 hover:bg-gray-100 hover:text-slate-700',
        )}
      >
        {labels[s]} ({counts[s]})
      </button>
    )
  })}
</div>
```

- [ ] **Step 7: Typecheck**

```bash
npm run typecheck
```

Fix type errors.

- [ ] **Step 8: Dev smoke test**

Navigate to `/admin/cms?collection=blog_posts`. Verify:
- "Live" / "In Review" / "Draft" status badges
- "Edit" text button per row
- "···" overflow with "View live · Duplicate · Delete"
- Status filter tabs above table
- Empty state when no items

- [ ] **Step 9: Commit**

```bash
git add src/components/cms/admin/CmsCollectionItemTable.tsx
git commit -m "feat(admin): redesign list view with badges, overflow menu, and empty state"
```

---

## Phase 5 — Autosave

### Task 7: Autosave API route

**Files:**
- Create: `src/app/api/admin/cms/autosave/route.ts`

- [ ] **Step 1: Create autosave route**

```ts
// src/app/api/admin/cms/autosave/route.ts
import 'server-only'
import { NextResponse } from 'next/server'
import { requireAdminAuth, sessionRole } from '@/lib/cms/adminAuth'
import { getCmsCollectionDefinition, getAllFields } from '@/lib/cms/collectionDefinitions'
import { upsertCmsDocument } from '@/lib/cms/collectionRepository'
import { decodeFieldValue, InvalidFieldValueError } from '@/lib/cms/fieldCodec'
import type { CmsCollectionKey } from '@/lib/cms/collectionDefinitions'

export async function POST(request: Request) {
  let session
  try {
    session = await requireAdminAuth()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const collectionRaw = String(body.collection ?? '')
  const slug = String(body.slug ?? '').trim()
  const currentStatus = String(body.currentStatus ?? 'draft')

  const definition = getCmsCollectionDefinition(collectionRaw)
  if (!definition || !slug) {
    return NextResponse.json({ error: 'Invalid collection or slug' }, { status: 400 })
  }

  const role = sessionRole(session)
  const fields = getAllFields(definition)
  const parsed: Record<string, unknown> = {}

  try {
    for (const field of fields) {
      const raw = body[field.name]
      if (raw === undefined) continue
      if (field.type === 'multi_reference') {
        const parts = Array.isArray(raw) ? raw.map(String) : String(raw).split(',').map(s => s.trim())
        parsed[field.name] = [...new Set(parts.filter(Boolean))]
        continue
      }
      parsed[field.name] = decodeFieldValue(field, String(raw))
    }
  } catch (err) {
    if (err instanceof InvalidFieldValueError) {
      return NextResponse.json({ error: `Invalid field: ${err.fieldName}` }, { status: 422 })
    }
    throw err
  }

  parsed.status = currentStatus

  try {
    await upsertCmsDocument(definition.key as CmsCollectionKey, slug, parsed, role)
  } catch (err) {
    console.error('[autosave] upsert failed', err)
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, savedAt: new Date().toISOString() })
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/cms/autosave/route.ts
git commit -m "feat(admin): add autosave API route (JSON response, no redirect)"
```

---

### Task 8: AutosaveManager + AutosaveIndicator components

**Files:**
- Create: `src/components/cms/admin/AutosaveIndicator.tsx`
- Create: `src/components/cms/admin/AutosaveManager.tsx`
- Modify: `src/app/admin/cms/page.tsx` (mount both components in editor)

- [ ] **Step 1: Create AutosaveIndicator**

```tsx
// src/components/cms/admin/AutosaveIndicator.tsx
'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

export type AutosaveState = 'idle' | 'saving' | 'saved' | 'error'

interface AutosaveIndicatorProps {
  state: AutosaveState
  savedAt?: Date
}

export function AutosaveIndicator({ state, savedAt }: AutosaveIndicatorProps) {
  const [label, setLabel] = useState<string>('')

  useEffect(() => {
    if (state === 'idle' && savedAt) {
      const diff = Math.round((Date.now() - savedAt.getTime()) / 60_000)
      setLabel(diff < 1 ? 'Autosaved just now' : `Autosaved ${diff}m ago`)
    } else if (state === 'saving') {
      setLabel('Saving...')
    } else if (state === 'saved') {
      setLabel('Saved')
      const t = setTimeout(() => setLabel(
        savedAt ? `Autosaved just now` : ''
      ), 2000)
      return () => clearTimeout(t)
    } else if (state === 'error') {
      setLabel('Save failed — check connection')
    }
  }, [state, savedAt])

  if (!label) return null

  return (
    <span
      className={cn(
        'text-[12px] transition-all',
        state === 'error' ? 'text-red-500' : 'text-slate-400',
      )}
      role="status"
      aria-live="polite"
    >
      {state === 'saving' && (
        <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-slate-400" />
      )}
      {state === 'saved' && <span className="mr-1 text-emerald-500">✓</span>}
      {label}
    </span>
  )
}
```

- [ ] **Step 2: Create AutosaveManager**

```tsx
// src/components/cms/admin/AutosaveManager.tsx
'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { AutosaveState } from './AutosaveIndicator'

interface AutosaveManagerProps {
  formId: string
  collection: string
  slug: string
  currentStatus: string
  onStateChange: (state: AutosaveState, savedAt?: Date) => void
  delayMs?: number
}

export function AutosaveManager({
  formId,
  collection,
  slug,
  currentStatus,
  onStateChange,
  delayMs = 3000,
}: AutosaveManagerProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDirtyRef = useRef(false)

  const doSave = useCallback(async () => {
    const form = document.getElementById(formId) as HTMLFormElement | null
    if (!form) return

    onStateChange('saving')

    const formData = new FormData(form)
    const body: Record<string, unknown> = { collection, slug, currentStatus }
    formData.forEach((val, key) => {
      body[key] = val
    })

    try {
      const res = await fetch('/api/admin/cms/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(await res.text())
      onStateChange('saved', new Date())
    } catch {
      onStateChange('error')
    }
    isDirtyRef.current = false
  }, [formId, collection, slug, currentStatus, onStateChange])

  useEffect(() => {
    const form = document.getElementById(formId) as HTMLFormElement | null
    if (!form) return

    const schedule = () => {
      isDirtyRef.current = true
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(doSave, delayMs)
    }

    form.addEventListener('input', schedule)
    form.addEventListener('change', schedule)

    return () => {
      form.removeEventListener('input', schedule)
      form.removeEventListener('change', schedule)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [formId, delayMs, doSave])

  // Save on ⌘S / Ctrl+S
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        if (isDirtyRef.current) doSave()
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [doSave])

  return null
}
```

- [ ] **Step 3: Create a client wrapper that holds autosave state**

```tsx
// src/components/cms/admin/AutosaveShell.tsx
'use client'

import { useState, useCallback } from 'react'
import { AutosaveManager } from './AutosaveManager'
import { AutosaveIndicator, type AutosaveState } from './AutosaveIndicator'

interface AutosaveShellProps {
  formId: string
  collection: string
  slug: string
  currentStatus: string
}

export function AutosaveShell({ formId, collection, slug, currentStatus }: AutosaveShellProps) {
  const [state, setState] = useState<AutosaveState>('idle')
  const [savedAt, setSavedAt] = useState<Date | undefined>()

  const handleStateChange = useCallback((s: AutosaveState, at?: Date) => {
    setState(s)
    if (at) setSavedAt(at)
  }, [])

  return (
    <>
      <AutosaveManager
        formId={formId}
        collection={collection}
        slug={slug}
        currentStatus={currentStatus}
        onStateChange={handleStateChange}
      />
      <AutosaveIndicator state={state} savedAt={savedAt} />
    </>
  )
}
```

- [ ] **Step 4: Mount AutosaveShell in editor header (cms/page.tsx)**

In `src/app/admin/cms/page.tsx`, import and add `AutosaveShell` inside the sticky editor header, next to the title:

```tsx
import { AutosaveShell } from '@/components/cms/admin/AutosaveShell'

// Inside the sticky header div, after the title + status badge:
{params.slug ? (
  <AutosaveShell
    formId="cms-editor-form"
    collection={definition.key}
    slug={params.slug}
    currentStatus={currentStatus}
  />
) : null}
```

- [ ] **Step 5: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 6: Dev smoke test**

Open an existing document, type in a field, wait 3 seconds. Verify "Saving..." then "Saved" appear in the header. Press ⌘S — verify same behavior.

- [ ] **Step 7: Commit**

```bash
git add src/components/cms/admin/AutosaveIndicator.tsx src/components/cms/admin/AutosaveManager.tsx src/components/cms/admin/AutosaveShell.tsx src/app/admin/cms/page.tsx
git commit -m "feat(admin): add autosave with 3s debounce and Cmd+S shortcut"
```

---

## Phase 6 — Editor UX

### Task 9: Redesign editor sticky header

**Files:**
- Modify: `src/app/admin/cms/page.tsx` (the sticky header block, lines ~1109–1232)

- [ ] **Step 1: Replace the sticky header block**

Find the `<div className="sticky top-0 z-20 ...">` block in `cms/page.tsx` (around lines 1109–1232). Replace it with:

```tsx
<div className="sticky top-0 z-20 flex items-center gap-3 border-b border-cms-rule bg-white/95 px-4 py-2.5 backdrop-blur">
  {/* Back button */}
  <Link
    href={`/admin/cms?collection=${definition.key}`}
    aria-label={`Back to ${definition.label}`}
    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cms-rule bg-white text-slate-500 hover:bg-cms-hover hover:text-slate-900 transition"
  >
    <span aria-hidden className="text-base leading-none">←</span>
  </Link>

  {/* Title + status */}
  <div className="min-w-0 flex-1">
    <div className="flex items-center gap-2">
      <h1 className="truncate text-[15px] font-semibold text-slate-900">
        {params.slug
          ? (readText(formValues[definition.titleField]) || `Untitled ${definition.singularLabel}`)
          : `New ${definition.singularLabel}`}
      </h1>
      {(() => {
        const st = getStatusStyle(currentStatus)
        return (
          <Badge variant={currentStatus === 'published' ? 'published' : currentStatus === 'in_review' ? 'in_review' : 'draft'} />
        )
      })()}
    </div>
  </div>

  {/* Autosave indicator */}
  {params.slug ? (
    <AutosaveShell
      formId="cms-editor-form"
      collection={definition.key}
      slug={params.slug}
      currentStatus={currentStatus}
    />
  ) : null}

  {/* View live link */}
  {definition.routePattern && publicSlug && currentStatus === 'published' ? (
    <a
      href={definition.routePattern.replace('[slug]', publicSlug)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 rounded-lg border border-cms-rule bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:bg-cms-hover transition"
    >
      View live ↗
    </a>
  ) : null}

  {/* Save / status controls */}
  <div className="flex items-center gap-2 shrink-0">
    {/* Status dropdown */}
    <select
      name="requestedStatus"
      form="cms-editor-form-status"
      defaultValue={currentStatus}
      className="rounded-lg border border-cms-rule bg-white px-3 py-1.5 text-[12px] font-medium text-slate-700 outline-none focus:ring-2 focus:ring-brand-primary/20"
    >
      <option value="draft">◌ Draft</option>
      <option value="in_review">◐ In Review</option>
      <option value="published" disabled={ROLE_RANK[role] < ROLE_RANK['admin']}>
        ● Live
      </option>
    </select>

    {/* Primary CTA */}
    <button
      type="submit"
      name="requestedStatus"
      value={
        ROLE_RANK[role] >= ROLE_RANK['admin']
          ? 'published'
          : currentStatus === 'draft'
          ? 'in_review'
          : currentStatus
      }
      form="cms-editor-form"
      className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition ${
        ROLE_RANK[role] >= ROLE_RANK['admin']
          ? 'bg-emerald-600 hover:bg-emerald-700'
          : 'bg-brand-primary hover:bg-admin-brand-hover'
      }`}
    >
      {ROLE_RANK[role] >= ROLE_RANK['admin']
        ? (currentStatus === 'published' ? '✓ Save changes' : '✓ Publish live')
        : (currentStatus === 'draft' ? 'Submit for review' : 'Save changes')}
    </button>
  </div>
</div>
```

Also add `import { Badge } from '@/components/ui'` at the top of the file.

- [ ] **Step 2: Typecheck + dev test**

```bash
npm run typecheck
npm run dev
```

Open a document — verify the new header shows title, status badge, autosave indicator, "View live" (when published), and the primary CTA button.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/cms/page.tsx
git commit -m "feat(admin): redesign editor header with clear publish CTA and autosave indicator"
```

---

### Task 10: Section ordering + field helper text

**Files:**
- Modify: `src/app/admin/cms/page.tsx` (section render order + section headings)
- Modify: `src/components/cms/admin/FieldEditor.tsx` (add helperText prop)
- Create: `src/lib/cms/fieldHelperText.ts`

- [ ] **Step 1: Create fieldHelperText map**

```ts
// src/lib/cms/fieldHelperText.ts

export const FIELD_HELPER_TEXT: Record<string, string> = {
  title:                 'The main headline shown on the article page and in search.',
  slug:                  'Auto-generated from title. Change carefully — updates the live URL and can break links.',
  body:                  'The main content of this post.',
  content:               'The main content of this page.',
  definition:            'The full definition or explanation.',
  article:               'The article body content.',
  answer:                'The direct answer shown in search and AI results.',
  story:                 'The narrative story content.',
  featured_image:        'Shown at the top of the page and on listing cards. Use a high-quality image.',
  featured_image_alt:    'Describe the image for screen readers and SEO (required when image is set).',
  card_title:            'Overrides the title on listing pages. Leave blank to use the main title.',
  card_description:      'Short summary shown on listing pages (2–3 sentences).',
  card_label:            'Small label shown above the title on cards (e.g. "Guide", "Case Study").',
  card_cta_label:        'Text on the card\'s call-to-action button.',
  card_cta_link:         'Link for the card button. Leave blank to link to the full article.',
  meta_title:            'The title Google shows in search results. Aim for 50–60 characters.',
  seo_title:             'The title Google shows in search results. Aim for 50–60 characters.',
  meta_description:      'The description Google shows in search results. Aim for 120–160 characters.',
  focus_keyword:         'The primary keyword this page targets. Use it naturally in the title and first paragraph.',
  secondary_keywords:    'Additional keywords to target. Separate with commas.',
  og_image:              'Image shown when this page is shared on social media. 1200×630px recommended.',
  canonical_url:         'Leave blank unless this content is duplicated elsewhere.',
  direct_answer:         'A concise, 1–2 sentence answer to the article\'s main question. Used by AI assistants.',
  tags:                  'Comma-separated tags. Used for filtering and related content.',
  categories:            'Comma-separated categories for grouping content.',
  sort_order:            'Lower numbers appear first in listings. Leave blank for default ordering.',
  featured:              'Featured items are highlighted at the top of listing pages.',
  publish_date:          'When this content was or will be published.',
  scheduled_at:          'Schedule a future publish time. Leave blank to publish immediately.',
}

export function getFieldHelperText(fieldName: string): string | undefined {
  return FIELD_HELPER_TEXT[fieldName]
}
```

- [ ] **Step 2: Add helperText prop to FieldEditor**

In `src/components/cms/admin/FieldEditor.tsx`, add a `helperText` optional prop to the component's props interface:

```tsx
interface FieldEditorProps {
  field: CmsFieldDefinition
  value: string
  referenceOptions?: Record<string, Array<{ id: string; label: string }>>
  mediaAssetUrls?: string[]
  documentHydrationKey?: string
  helperText?: string  // ← add this
  error?: string       // ← add this
}
```

Then at the bottom of the rendered output (after the input/textarea/etc.), add:

```tsx
{/* Helper text and error — added below every field */}
{error && (
  <p className="mt-1 text-[12px] text-red-600">{error}</p>
)}
{helperText && !error && (
  <p className="mt-1 text-[12px] text-slate-500">{helperText}</p>
)}
```

- [ ] **Step 3: Pass helperText from cms/page.tsx to FieldRenderer**

In `src/app/admin/cms/page.tsx`, import `getFieldHelperText`:

```tsx
import { getFieldHelperText } from '@/lib/cms/fieldHelperText'
```

In `renderMainEditorSection` and `renderCollapsibleSection`, wherever `<FieldRenderer>` is rendered, add the helperText prop:

```tsx
<FieldRenderer
  field={field}
  value={value}
  referenceOptions={referenceOptions}
  mediaAssetUrls={mediaAssetUrls}
  documentHydrationKey={documentHydrationKey}
  helperText={getFieldHelperText(field.name)}
/>
```

- [ ] **Step 4: Update section default collapse states**

In `cms/page.tsx`, find where `renderCollapsibleSection` is called for each section. Update `defaultOpen` values:

```tsx
// CONTENT section — always open (renderMainEditorSection, no collapse)

// CARD section
{renderCollapsibleSection('card-section', 'Card preview', cardFields, formValues, ..., { defaultOpen: false })}

// LISTING section  
{renderCollapsibleSection('listing-section', 'Listing page', listingFields, formValues, ..., { defaultOpen: false })}

// DETAIL section
{renderCollapsibleSection('detail-section', 'Detail page', detailFields, formValues, ..., { defaultOpen: false })}

// BLOCKS section
{renderCollapsibleSection('blocks-section', 'Page sections', blocksFields, formValues, ..., { defaultOpen: false })}

// RELATIONS section
{renderCollapsibleSection('relations-section', 'Relationships', relationFields, formValues, ..., { defaultOpen: false })}
```

- [ ] **Step 5: Rename section headings to human language**

In `renderCollapsibleSection`, the section heading `<h3>` displays the `titleText` argument. Update the calls in the page to use friendly names (e.g. "Card preview" → already above). Also rename the section heading for main editor:

```tsx
// Find the <h3> in renderMainEditorSection and update:
<h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-3">
  {titleText || 'Content'}
</h3>
```

- [ ] **Step 6: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 7: Dev smoke test**

Open any CMS document. Verify:
- Every field shows a grey helper text below it
- Card/Listing/Detail/Blocks/Relations sections are collapsed by default
- Content section is open

- [ ] **Step 8: Commit**

```bash
git add src/lib/cms/fieldHelperText.ts src/components/cms/admin/FieldEditor.tsx src/app/admin/cms/page.tsx
git commit -m "feat(admin): add field helper text and set progressive disclosure defaults for sections"
```

---

### Task 11: Inline field validation (no page redirect)

**Files:**
- Create: `src/components/cms/admin/CmsFormValidator.tsx`
- Modify: `src/app/admin/cms/page.tsx` (mount validator, handle `?error=` display inline)

- [ ] **Step 1: Create CmsFormValidator**

```tsx
// src/components/cms/admin/CmsFormValidator.tsx
'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const ERROR_FIELD_MAP: Record<string, string> = {
  'missing-slug':       'slug',
  'missing-title':      'title',
  'slug-taken':         'slug',
}

export function CmsFormValidator() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  useEffect(() => {
    if (!error) return

    // Map error code to a field name
    const fieldName = ERROR_FIELD_MAP[error] ??
      (error.startsWith('invalid-') ? error.replace('invalid-', '') : null)

    if (!fieldName) return

    // Find the input with this name and scroll to it + focus
    const el = document.querySelector<HTMLElement>(`[name="${fieldName}"]`)
    if (!el) return

    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.focus()

    // Add error styling
    el.classList.add('border-red-400', 'ring-2', 'ring-red-200')

    // Add error message below the input if not already present
    const existingMsg = el.nextElementSibling
    if (!existingMsg || !existingMsg.classList.contains('cms-field-error')) {
      const msg = document.createElement('p')
      msg.className = 'cms-field-error mt-1 text-[12px] text-red-600'
      msg.textContent = friendlyError(error)
      el.parentNode?.insertBefore(msg, el.nextSibling)
    }
  }, [error])

  return null
}

function friendlyError(code: string): string {
  const messages: Record<string, string> = {
    'missing-slug':  'A URL slug is required. It will be auto-generated from the title.',
    'missing-title': 'A title is required before saving.',
    'slug-taken':    'This URL slug is already in use. Please choose a different one.',
  }
  return messages[code] ?? `Please check this field (${code}).`
}
```

- [ ] **Step 2: Mount CmsFormValidator in the editor**

In `cms/page.tsx`, import and add near the top of the form:

```tsx
import { CmsFormValidator } from '@/components/cms/admin/CmsFormValidator'

// Inside the <form> element, just after the hidden inputs:
<CmsFormValidator />
```

- [ ] **Step 3: Suppress the ?error= banner in the header**

In the sticky header, the current code renders:
```tsx
{error ? (
  <span role="alert" ...>{error}</span>
) : null}
```

Remove or comment out this block — the error is now shown inline by `CmsFormValidator`.

- [ ] **Step 4: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 5: Dev smoke test**

Open a new document, leave title blank, try to save. Verify:
- Page does not scroll to top or flash a banner
- The slug/title field gets a red border and error message below
- The page scrolls to and focuses the problematic field

- [ ] **Step 6: Commit**

```bash
git add src/components/cms/admin/CmsFormValidator.tsx src/app/admin/cms/page.tsx
git commit -m "feat(admin): inline field validation — replace redirect errors with field highlight and scroll"
```

---

## Phase 7 — Right Sidebar

### Task 12: Extract CmsPublishSidebar

**Files:**
- Create: `src/components/cms/admin/CmsPublishSidebar.tsx`
- Modify: `src/app/admin/cms/page.tsx` (replace inline aside with component)

- [ ] **Step 1: Create CmsPublishSidebar**

```tsx
// src/components/cms/admin/CmsPublishSidebar.tsx
import { SectionHeading, Card } from '@/components/ui'
import type { CmsDocumentStatus } from '@/lib/cms/collectionRepository'
import type { CmsAdminRole } from '@/lib/cms/adminAuth'
import { ROLE_RANK } from '@/lib/cms/usersRepository'
import type { CmsRevision } from '@/lib/cms/collectionRepository'
import type { CmsCollectionDefinition, CmsFieldDefinition } from '@/lib/cms/collectionDefinitions'

interface CmsPublishSidebarProps {
  definition: CmsCollectionDefinition
  currentStatus: CmsDocumentStatus
  role: CmsAdminRole
  publishFields: CmsFieldDefinition[]
  seoFields: CmsFieldDefinition[]
  aeoFields: CmsFieldDefinition[]
  geoFields: CmsFieldDefinition[]
  seoScore: number
  aeoScore: number
  geoScore: number
  revisions: CmsRevision[]
  publicSlug?: string
  fieldRenderer: (field: CmsFieldDefinition) => React.ReactNode
  rollbackAction: (revisionId: string) => Promise<void>
}

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = Math.round((score / max) * 100)
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-14 text-right text-[12px] font-semibold text-slate-700">
        {score}/{max}
      </span>
    </div>
  )
}

export function CmsPublishSidebar({
  definition,
  currentStatus,
  role,
  publishFields,
  seoFields,
  aeoFields,
  geoFields,
  seoScore,
  aeoScore,
  geoScore,
  revisions,
  publicSlug,
  fieldRenderer,
  rollbackAction,
}: CmsPublishSidebarProps) {
  const isAdmin = ROLE_RANK[role] >= ROLE_RANK['admin']

  return (
    <aside className="flex min-h-0 flex-col gap-3 overflow-y-auto px-1 pb-4">

      {/* Publish card */}
      <Card className="space-y-3">
        <SectionHeading>Publish</SectionHeading>

        {/* Status select */}
        <div>
          <label className="text-[13px] font-medium text-slate-800 block mb-1">Status</label>
          <select
            name="requestedStatus"
            defaultValue={currentStatus}
            className="w-full rounded-lg border border-cms-rule bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="draft">◌ Draft</option>
            <option value="in_review">◐ In Review</option>
            <option value="published" disabled={!isAdmin}>● Live</option>
          </select>
          {!isAdmin && (
            <p className="mt-1 text-[12px] text-slate-400">Only admins can publish live.</p>
          )}
        </div>

        {/* Publish fields (scheduleAt, etc.) */}
        {publishFields.map((f) => (
          <div key={f.name}>{fieldRenderer(f)}</div>
        ))}

        {/* Primary CTA */}
        <button
          type="submit"
          name="requestedStatus"
          value={isAdmin ? 'published' : 'in_review'}
          className={`w-full rounded-lg px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition ${
            isAdmin ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-brand-primary hover:bg-admin-brand-hover'
          }`}
        >
          {isAdmin
            ? currentStatus === 'published' ? '✓ Save changes' : '✓ Publish live'
            : currentStatus === 'draft' ? 'Submit for review →' : 'Save changes'}
        </button>

        {/* View live */}
        {definition.routePattern && publicSlug && currentStatus === 'published' && (
          <a
            href={definition.routePattern.replace('[slug]', publicSlug)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1 text-[12px] text-slate-500 hover:text-slate-700 transition"
          >
            View live ↗
          </a>
        )}
      </Card>

      {/* Content scores */}
      <Card className="space-y-3">
        <SectionHeading>Content score</SectionHeading>

        <details className="group">
          <summary className="flex cursor-pointer items-center justify-between py-1 text-[13px] font-medium text-slate-700 list-none">
            <span>SEO</span>
            <span className="flex items-center gap-2 flex-1 ml-3">
              <ScoreBar score={seoScore} max={56} />
            </span>
          </summary>
          <div className="mt-3 space-y-3 border-t border-cms-rule pt-3">
            {seoFields.map((f) => <div key={f.name}>{fieldRenderer(f)}</div>)}
          </div>
        </details>

        <details className="group border-t border-cms-rule pt-3">
          <summary className="flex cursor-pointer items-center justify-between py-1 text-[13px] font-medium text-slate-700 list-none">
            <span>AEO</span>
            <span className="flex items-center gap-2 flex-1 ml-3">
              <ScoreBar score={aeoScore} max={42} />
            </span>
          </summary>
          <div className="mt-3 space-y-3 border-t border-cms-rule pt-3">
            {aeoFields.map((f) => <div key={f.name}>{fieldRenderer(f)}</div>)}
          </div>
        </details>

        <details className="group border-t border-cms-rule pt-3">
          <summary className="flex cursor-pointer items-center justify-between py-1 text-[13px] font-medium text-slate-700 list-none">
            <span>GEO</span>
            <span className="flex items-center gap-2 flex-1 ml-3">
              <ScoreBar score={geoScore} max={55} />
            </span>
          </summary>
          <div className="mt-3 space-y-3 border-t border-cms-rule pt-3">
            {geoFields.map((f) => <div key={f.name}>{fieldRenderer(f)}</div>)}
          </div>
        </details>
      </Card>

      {/* Version history */}
      {revisions.length > 0 && (
        <Card className="space-y-2">
          <SectionHeading>Version history</SectionHeading>
          <ul className="space-y-1">
            {revisions.slice(0, 5).map((rev, i) => (
              <li key={rev.id} className="flex items-center justify-between py-1.5 text-[12px]">
                <span className="text-slate-600">
                  {i === 0 ? '(current) ' : ''}
                  {rev.createdAt
                    ? rev.createdAt.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                    : 'Unknown date'}
                </span>
                {i > 0 && (
                  <form action={rollbackAction.bind(null, rev.id)}>
                    <button
                      type="submit"
                      className="rounded px-2 py-0.5 text-[11px] font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
                    >
                      Revert
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </aside>
  )
}
```

- [ ] **Step 2: Replace the inline `<aside>` in cms/page.tsx**

Find the `<aside className="group/cms-aside ...">` block in `cms/page.tsx` (around lines 1342–1580). Replace it with:

```tsx
import { CmsPublishSidebar } from '@/components/cms/admin/CmsPublishSidebar'

<CmsPublishSidebar
  definition={definition}
  currentStatus={currentStatus}
  role={role}
  publishFields={publishSectionFields}
  seoFields={seoSectionFields}
  aeoFields={aeoSectionFields}
  geoFields={geoSectionFields}
  seoScore={seoScore}
  aeoScore={aeoScore}
  geoScore={geoScore}
  revisions={revisions}
  publicSlug={publicSlug}
  fieldRenderer={(field) => (
    <FieldRenderer
      field={field}
      value={stringifyFieldValue(field, formValues[field.name])}
      referenceOptions={referenceOptions}
      mediaAssetUrls={mediaAssetUrls}
      documentHydrationKey={documentHydrationKey}
      helperText={getFieldHelperText(field.name)}
    />
  )}
  rollbackAction={rollbackCmsDocumentToRevisionAction}
/>
```

The section field groupings (`publishSectionFields`, `seoSectionFields`, etc.) are already computed in the page — use the existing filtering logic.

- [ ] **Step 3: Typecheck + dev smoke test**

```bash
npm run typecheck
npm run dev
```

Open a document, verify right sidebar shows:
- Status dropdown
- Clear "Publish live" or "Submit for review" button
- SEO / AEO / GEO collapsible score sections
- Version history

- [ ] **Step 4: Commit**

```bash
git add src/components/cms/admin/CmsPublishSidebar.tsx src/app/admin/cms/page.tsx
git commit -m "feat(admin): extract right sidebar into CmsPublishSidebar with scores and clear publish CTA"
```

---

## Phase 8 — AI Generation

### Task 13: AI prompts + generate API route

**Files:**
- Create: `src/lib/cms/ai/prompts.ts`
- Create: `src/app/api/admin/ai/generate/route.ts`

- [ ] **Step 1: Create AI prompts**

```ts
// src/lib/cms/ai/prompts.ts
import 'server-only'

export type AiGenerateField =
  | 'title'
  | 'body'
  | 'body_improve'
  | 'body_expand'
  | 'alt_text'
  | 'card_description'
  | 'card_cta_label'
  | 'meta_title'
  | 'meta_description'
  | 'focus_keyword'
  | 'direct_answer'
  | 'faq_items'
  | 'key_statistics'

interface PromptContext {
  title?: string
  body?: string
  selection?: string  // selected text for improve/expand
  collection?: string
}

export function buildPrompt(field: AiGenerateField, ctx: PromptContext): string {
  const { title = '', body = '', selection = '', collection = '' } = ctx

  const systemNote = `You are a professional content writer for Finanshels, a UAE-based financial services company (bookkeeping, VAT filing, corporate tax, payroll, CFO advisory). Write in clear, professional British English. Be concise and accurate.`

  const prompts: Record<AiGenerateField, string> = {
    title: `${systemNote}

The article is about: "${title || body.slice(0, 200)}"
Collection: ${collection}

Suggest 3 compelling article titles. Return ONLY a numbered list of 3 titles, nothing else. Example:
1. First title option
2. Second title option
3. Third title option`,

    body: `${systemNote}

Write a comprehensive, well-structured article with this title: "${title}"
Collection: ${collection}

Include:
- An engaging introduction
- 3-5 clear sections with subheadings
- Practical, actionable information relevant to UAE businesses
- A concise conclusion

Write the full article in markdown format.`,

    body_improve: `${systemNote}

Rewrite the following text to be clearer, more engaging, and more professional. Keep the same meaning and length. Return ONLY the rewritten text:

${selection}`,

    body_expand: `${systemNote}

Expand the following paragraph with more detail, examples, or explanation. Double the length while keeping the same tone. Return ONLY the expanded text:

${selection}`,

    alt_text: `${systemNote}

Write a concise, descriptive alt text for an image used in an article titled "${title}". The alt text should describe what is visually in the image in 1 sentence for accessibility. Return ONLY the alt text, no quotes.`,

    card_description: `${systemNote}

Write a 2-sentence summary of this article for a listing card:
Title: ${title}
${body ? `Content preview: ${body.slice(0, 500)}` : ''}

Return ONLY the 2-sentence summary, no quotes.`,

    card_cta_label: `${systemNote}

Suggest 3 short call-to-action button labels for an article titled "${title}". Each should be 2-4 words. Return ONLY a numbered list:
1. First option
2. Second option
3. Third option`,

    meta_title: `${systemNote}

Write an SEO title tag for this article. Requirements:
- 50-60 characters maximum
- Include the main keyword naturally
- Be compelling for search results
- Article title: "${title}"

Return ONLY the title tag text, no quotes.`,

    meta_description: `${systemNote}

Write a meta description for this article. Requirements:
- 120-160 characters maximum
- Summarise what the reader will learn
- Include a subtle call-to-action
- Article: "${title}"
${body ? `Content preview: ${body.slice(0, 300)}` : ''}

Return ONLY the meta description text, no quotes.`,

    focus_keyword: `${systemNote}

Suggest the single best SEO focus keyword for this article:
Title: ${title}
${body ? `Content preview: ${body.slice(0, 300)}` : ''}

Consider what UAE business owners would search for. Return ONLY 3 keyword options as a numbered list:
1. First keyword
2. Second keyword
3. Third keyword`,

    direct_answer: `${systemNote}

Write a direct, concise answer to the main question implied by this article title: "${title}"
${body ? `Based on this content: ${body.slice(0, 500)}` : ''}

The answer should be 2-3 sentences maximum, factual, and suitable for use in AI search results. Return ONLY the answer text.`,

    faq_items: `${systemNote}

Generate 5 frequently asked questions and concise answers based on this article:
Title: ${title}
${body ? `Content: ${body.slice(0, 800)}` : ''}

Return ONLY a JSON array in this exact format:
[
  {"question": "Question 1?", "answer": "Answer 1."},
  {"question": "Question 2?", "answer": "Answer 2."},
  {"question": "Question 3?", "answer": "Answer 3."},
  {"question": "Question 4?", "answer": "Answer 4."},
  {"question": "Question 5?", "answer": "Answer 5."}
]`,

    key_statistics: `${systemNote}

Suggest 3-5 relevant statistics or facts that would strengthen this article:
Title: ${title}
${body ? `Content: ${body.slice(0, 400)}` : ''}

Return ONLY a numbered list of statistics with their context. Format:
1. [Statistic or fact] — [brief context]`,
  }

  return prompts[field]
}
```

- [ ] **Step 2: Create the generate route**

```ts
// src/app/api/admin/ai/generate/route.ts
import 'server-only'
import { createAnthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'
import { NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/cms/adminAuth'
import { buildPrompt, type AiGenerateField } from '@/lib/cms/ai/prompts'

const VALID_FIELDS = new Set<AiGenerateField>([
  'title', 'body', 'body_improve', 'body_expand', 'alt_text',
  'card_description', 'card_cta_label', 'meta_title', 'meta_description',
  'focus_keyword', 'direct_answer', 'faq_items', 'key_statistics',
])

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  // Auth check
  try {
    await requireAdminAuth()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const field = String(body.field ?? '') as AiGenerateField
  if (!VALID_FIELDS.has(field)) {
    return NextResponse.json({ error: 'Unknown field type' }, { status: 400 })
  }

  const context = {
    title:      String(body.title ?? '').slice(0, 500),
    body:       String(body.body ?? '').slice(0, 2000),
    selection:  String(body.selection ?? '').slice(0, 1000),
    collection: String(body.collection ?? ''),
  }

  const prompt = buildPrompt(field, context)

  try {
    const result = streamText({
      model: anthropic('claude-haiku-4-5-20251001'),
      prompt,
      maxTokens: 1024,
    })

    return result.toDataStreamResponse()
  } catch (err) {
    console.error('[ai/generate] stream error', err)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 4: Test the route manually**

Start the dev server and test with curl (replace cookie with a real admin session cookie):

```bash
npm run dev
# In a second terminal:
curl -X POST http://localhost:3000/api/admin/ai/generate \
  -H "Content-Type: application/json" \
  -H "Cookie: finanshels_admin_v2=<your-session-cookie>" \
  -d '{"field":"meta_description","title":"UAE VAT Filing Guide 2025","collection":"blog_posts"}'
```

Expected: streaming text response.

- [ ] **Step 5: Commit**

```bash
git add src/lib/cms/ai/prompts.ts src/app/api/admin/ai/generate/route.ts
git commit -m "feat(ai): add AI prompts module and streaming generate API route"
```

---

### Task 14: AiGenerateButton + AiGeneratePopover

**Files:**
- Create: `src/components/cms/admin/AiGenerateButton.tsx`
- Create: `src/components/cms/admin/AiGeneratePopover.tsx`

- [ ] **Step 1: Create AiGenerateButton**

```tsx
// src/components/cms/admin/AiGenerateButton.tsx
'use client'

import { type MouseEvent } from 'react'
import { cn } from '@/lib/cn'

interface AiGenerateButtonProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
  label?: string
  className?: string
}

export function AiGenerateButton({ onClick, label = 'AI', className }: AiGenerateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 rounded-md border border-brand-primary/30 bg-brand-primary/5',
        'px-2 py-0.5 text-[11px] font-medium text-brand-primary transition',
        'hover:bg-brand-primary/10 hover:border-brand-primary/50',
        className,
      )}
    >
      <span aria-hidden>✨</span>
      {label}
    </button>
  )
}
```

- [ ] **Step 2: Create AiGeneratePopover**

```tsx
// src/components/cms/admin/AiGeneratePopover.tsx
'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'
import { useCompletion } from '@ai-sdk/react'
import { cn } from '@/lib/cn'
import type { AiGenerateField } from '@/lib/cms/ai/prompts'

interface AiGeneratePopoverProps {
  field: AiGenerateField
  context: { title?: string; body?: string; selection?: string; collection?: string }
  onUse: (text: string) => void
  onClose: () => void
  multiChoice?: boolean   // true for title/keyword/cta — returns numbered list for radio selection
  characterLimit?: { ideal: [number, number]; label: string }
  children?: ReactNode
}

export function AiGeneratePopover({
  field,
  context,
  onUse,
  onClose,
  multiChoice = false,
  characterLimit,
  children,
}: AiGeneratePopoverProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<string>('')

  const { completion, complete, isLoading, error, stop } = useCompletion({
    api: '/api/admin/ai/generate',
    body: { field, ...context },
  })

  // Auto-start on mount
  useEffect(() => {
    complete('')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler as EventListener)
    return () => document.removeEventListener('mousedown', handler as EventListener)
  }, [onClose])

  // Parse numbered list for multi-choice fields
  const options = multiChoice && completion
    ? completion
        .split('\n')
        .filter((l) => /^\d+\./.test(l.trim()))
        .map((l) => l.replace(/^\d+\.\s*/, '').trim())
        .filter(Boolean)
    : []

  const displayText = multiChoice ? (selected || '') : completion
  const charCount = displayText.length

  function getCharColor() {
    if (!characterLimit) return 'text-slate-400'
    const [min, max] = characterLimit.ideal
    if (charCount >= min && charCount <= max) return 'text-emerald-600'
    return 'text-amber-600'
  }

  return (
    <div
      ref={ref}
      className="absolute z-50 mt-2 w-[420px] max-w-[calc(100vw-2rem)] rounded-xl border border-cms-rule bg-white shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cms-rule px-4 py-3">
        <span className="text-[13px] font-semibold text-slate-700">
          <span className="mr-1">✨</span>
          AI {isLoading ? 'writing...' : 'suggestion'}
        </span>
        <button
          type="button"
          onClick={() => { stop(); onClose() }}
          className="text-slate-400 hover:text-slate-700 transition text-lg leading-none"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="max-h-64 overflow-y-auto px-4 py-3">
        {error && (
          <p className="text-[13px] text-red-600">
            Generation failed. Check your connection and try again.
          </p>
        )}

        {!error && multiChoice && options.length > 0 && (
          <div className="space-y-2">
            {options.map((opt) => (
              <label key={opt} className="flex items-start gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="ai-choice"
                  value={opt}
                  checked={selected === opt}
                  onChange={() => setSelected(opt)}
                  className="mt-0.5 accent-brand-primary"
                />
                <span className="text-[13px] text-slate-700 group-hover:text-slate-900 transition">
                  {opt}
                </span>
              </label>
            ))}
            {isLoading && options.length < 3 && (
              <p className="text-[12px] text-slate-400 animate-pulse">Generating more options...</p>
            )}
          </div>
        )}

        {!error && !multiChoice && (
          <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-slate-700">
            {completion || (isLoading ? <span className="animate-pulse text-slate-400">Writing...</span> : '')}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-cms-rule px-4 py-3">
        <div className="flex items-center gap-1.5">
          {characterLimit && displayText && (
            <span className={cn('text-[11px] font-medium', getCharColor())}>
              {charCount} chars · Ideal: {characterLimit.ideal[0]}–{characterLimit.ideal[1]}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { stop(); complete('') }}
            disabled={isLoading}
            className="rounded-lg border border-cms-rule px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Regenerate
          </button>
          <button
            type="button"
            onClick={() => onClose()}
            className="rounded-lg border border-cms-rule px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:bg-gray-50 transition"
          >
            Discard
          </button>
          <button
            type="button"
            disabled={!completion || isLoading || (multiChoice && !selected)}
            onClick={() => {
              const text = multiChoice ? selected : completion
              if (text) { onUse(text); onClose() }
            }}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-slate-800 transition disabled:opacity-50"
          >
            Use this
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add src/components/cms/admin/AiGenerateButton.tsx src/components/cms/admin/AiGeneratePopover.tsx
git commit -m "feat(ai): add AiGenerateButton and AiGeneratePopover streaming components"
```

---

### Task 15: Wire AI buttons into FieldEditor

**Files:**
- Modify: `src/components/cms/admin/FieldEditor.tsx`

- [ ] **Step 1: Add AI wiring to FieldEditor**

At the top of `FieldEditor.tsx`, add imports:

```tsx
'use client'   // FieldEditor already needs to be a client component for this

import { useState, useRef } from 'react'
import { AiGenerateButton } from './AiGenerateButton'
import { AiGeneratePopover } from './AiGeneratePopover'
import type { AiGenerateField } from '@/lib/cms/ai/prompts'
```

Add `aiField` and `documentTitle` to the `FieldEditorProps` interface:

```tsx
interface FieldEditorProps {
  field: CmsFieldDefinition
  value: string
  referenceOptions?: Record<string, Array<{ id: string; label: string }>>
  mediaAssetUrls?: string[]
  documentHydrationKey?: string
  helperText?: string
  error?: string
  aiField?: AiGenerateField           // ← new
  documentTitle?: string              // ← new (for AI context)
  documentBody?: string               // ← new (for AI context)
  collection?: string                 // ← new
}
```

Add a map from field name to `AiGenerateField` near the top of the file:

```tsx
const AI_FIELD_MAP: Record<string, AiGenerateField> = {
  title:             'title',
  body:              'body',
  content:           'body',
  article:           'body',
  definition:        'body',
  featured_image_alt:'alt_text',
  card_description:  'card_description',
  card_cta_label:    'card_cta_label',
  meta_title:        'meta_title',
  seo_title:         'meta_title',
  meta_description:  'meta_description',
  focus_keyword:     'focus_keyword',
  direct_answer:     'direct_answer',
  faq_items:         'faq_items',
  key_statistics:    'key_statistics',
}

const AI_CHAR_LIMITS: Partial<Record<AiGenerateField, { ideal: [number, number]; label: string }>> = {
  meta_title:        { ideal: [50, 60],   label: 'SEO title' },
  meta_description:  { ideal: [120, 160], label: 'Meta description' },
}

const AI_MULTI_CHOICE: Set<AiGenerateField> = new Set([
  'title', 'card_cta_label', 'focus_keyword',
])
```

In the component body, add state for popover:

```tsx
const [showAi, setShowAi] = useState(false)
const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

const aiFieldType = AI_FIELD_MAP[field.name]

function handleAiUse(text: string) {
  // Inject the generated text into the controlled/uncontrolled input
  const el = inputRef.current ?? document.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${field.name}"]`)
  if (!el) return
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
    ?? Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set
  nativeInputValueSetter?.call(el, text)
  el.dispatchEvent(new Event('input', { bubbles: true }))
  el.dispatchEvent(new Event('change', { bubbles: true }))
}
```

In the field label JSX (the `<span>` that wraps `field.label`), add the AI button when `aiFieldType` exists:

```tsx
<span className="flex items-center gap-2">
  {field.label}
  {field.required && (
    <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-brand-primary">
      Required
    </span>
  )}
  {aiFieldType && (
    <div className="relative ml-auto">
      <AiGenerateButton
        label={aiFieldType === 'title' ? 'Suggest' : aiFieldType === 'body' ? 'Write' : 'Generate'}
        onClick={() => setShowAi((v) => !v)}
      />
      {showAi && (
        <AiGeneratePopover
          field={aiFieldType}
          context={{
            title:      documentTitle,
            body:       documentBody,
            collection: collection,
          }}
          onUse={handleAiUse}
          onClose={() => setShowAi(false)}
          multiChoice={AI_MULTI_CHOICE.has(aiFieldType)}
          characterLimit={AI_CHAR_LIMITS[aiFieldType]}
        />
      )}
    </div>
  )}
</span>
```

- [ ] **Step 2: Pass documentTitle + documentBody + collection from cms/page.tsx to FieldRenderer**

In `cms/page.tsx`, wherever `<FieldRenderer>` is used, pass the extra props:

```tsx
<FieldRenderer
  field={field}
  value={value}
  referenceOptions={referenceOptions}
  mediaAssetUrls={mediaAssetUrls}
  documentHydrationKey={documentHydrationKey}
  helperText={getFieldHelperText(field.name)}
  documentTitle={readText(formValues[definition.titleField])}
  documentBody={readText(formValues['body'] ?? formValues['content'] ?? formValues['article'])}
  collection={definition.key}
/>
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 4: Dev smoke test**

Open a blog post in the editor. Click the "✨ Generate" button next to "Search description". Verify:
- Popover opens
- Streaming text appears word-by-word
- Character count shows and turns green in range
- "Use this" inserts text into the field
- "Discard" closes without changing the field

- [ ] **Step 5: Commit**

```bash
git add src/components/cms/admin/FieldEditor.tsx src/app/admin/cms/page.tsx
git commit -m "feat(ai): wire AI generation buttons into FieldEditor for all eligible fields"
```

---

## Phase 9 — Visual Refresh

### Task 16: Login page visual refresh

**Files:**
- Modify: `src/app/admin/login/page.tsx`

- [ ] **Step 1: Update the login page JSX**

Replace the page content (keeping all server-side logic intact) with the new visual design:

```tsx
// Key section to replace (the card div and its contents):
<section className="flex min-h-screen items-center justify-center bg-cms-canvas px-4">
  <div className="w-full max-w-md">

    {/* Logo */}
    <div className="mb-8 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary">
        <span className="text-lg font-bold text-white">F</span>
      </div>
      <div>
        <p className="text-[15px] font-bold text-slate-900">Finanshels</p>
        <p className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Content Studio</p>
      </div>
    </div>

    <div className="rounded-2xl border border-cms-rule bg-white p-8 shadow-sm">
      <h1 className="text-[22px] font-semibold text-slate-900">Sign in</h1>
      <p className="mt-1 text-[13px] text-slate-500">Enter your credentials to continue.</p>

      {/* Inline error (from ?error= param or server error) */}
      {error && (
        <div className="mt-4 rounded-lg border-l-4 border-l-red-500 bg-red-50 px-4 py-3 text-[13px] text-red-800">
          {friendlyLoginError(error)}
        </div>
      )}

      <form method="POST" action="/admin/login" className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-[13px] font-medium text-slate-800">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-cms-rule px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition"
            placeholder="you@finanshels.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-[13px] font-medium text-slate-800">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-cms-rule px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-brand-primary px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-admin-brand-hover"
        >
          Sign in
        </button>
      </form>

      <div className="mt-4 text-center">
        <a href="/admin/forgot" className="text-[12px] text-slate-400 hover:text-slate-700 transition">
          Forgot password?
        </a>
      </div>
    </div>
  </div>
</section>
```

Keep all existing server-side logic (auth checks, redirect, `isCmsConfigured`, etc.) unchanged above the return statement. Only replace the JSX.

- [ ] **Step 2: Typecheck + dev test**

```bash
npm run typecheck
npm run dev
```

Navigate to `http://localhost:3000/admin/login`. Verify the new design renders with logo, heading, email/password fields, sign in button.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/login/page.tsx
git commit -m "feat(admin): visual refresh — login page aligned to new design system"
```

---

### Task 17: Settings / Users visual refresh

**Files:**
- Modify: `src/app/admin/settings/users/page.tsx`

- [ ] **Step 1: Update imports**

Add to the top of the file:

```tsx
import { Badge, Button, Card, SectionHeading } from '@/components/ui'
```

- [ ] **Step 2: Update the users table**

Find the `<table>` in the file. Replace `<thead>` styling:

```tsx
<thead className="border-b border-cms-rule bg-gray-50">
  <tr>
    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 text-left">
      Name / Email
    </th>
    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 text-left">
      Role
    </th>
    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 text-left">
      Status
    </th>
    <th className="px-4 py-3" />
  </tr>
</thead>
```

Replace `<tbody>` rows to use `Badge` and `Button`:

```tsx
<tbody className="divide-y divide-cms-rule">
  {users.map((user) => (
    <tr key={user.uid} className="hover:bg-gray-50 transition align-top">
      <td className="px-4 py-3">
        <p className="text-[14px] font-semibold text-slate-900">{user.name}</p>
        <p className="text-[12px] text-slate-400">{user.email}</p>
      </td>
      <td className="px-4 py-3">
        <span className="rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-brand-primary">
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3">
        <Badge variant={user.status === 'active' ? 'published' : 'draft'}>
          {user.status === 'active' ? 'Active' : user.status}
        </Badge>
      </td>
      <td className="px-4 py-3 text-right">
        {/* Keep existing action buttons but wrapped with Button component */}
      </td>
    </tr>
  ))}
</tbody>
```

- [ ] **Step 3: Wrap page sections in Card**

Find the main content sections (invite form, user table). Wrap each in `<Card>`.

- [ ] **Step 4: Typecheck + dev test**

```bash
npm run typecheck
npm run dev
```

Navigate to `/admin/settings/users`. Verify new table styling and Badge/Button usage.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/settings/users/page.tsx
git commit -m "feat(admin): visual refresh — settings users page aligned to new design system"
```

---

## Final Verification

- [ ] **Full typecheck**

```bash
npm run typecheck
```

Expected: 0 errors.

- [ ] **Production build**

```bash
npm run build
```

Expected: successful build. Note any warnings and resolve.

- [ ] **Dev smoke test — full flow**

```bash
npm run dev
```

Run through the full editing flow:
1. `/admin/login` — sign in
2. Sidebar — verify no Chat items, human collection names, user card
3. Click "Blog Posts" — verify list view with "Live/In Review/Draft" badges
4. Click "+ New Blog Post" — verify create form works
5. Click "Edit" on a post — verify editor opens with:
   - New sticky header (title + status badge + autosave + publish CTA)
   - Content section open, Card/Listing/Detail/Blocks collapsed
   - Helper text below every field
   - "✨ Generate" buttons next to eligible fields
   - Right sidebar with publish card + content scores + version history
6. Type in a field — wait 3 seconds — verify "Saving..." then "Autosaved just now"
7. Press ⌘S — verify immediate save
8. Click "✨ Generate" on meta description — verify AI popover streams text
9. Click "Use this" — verify text inserted into field
10. Try to save with empty title — verify inline error (not page redirect)
11. `/admin/settings/users` — verify refreshed table design

- [ ] **Final commit**

```bash
git add -A
git commit -m "feat(admin): complete admin panel redesign — design system, autosave, AI generation, UX improvements"
```

---

## Environment Variables Required

Add these to Vercel and `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

All other environment variables are unchanged.
