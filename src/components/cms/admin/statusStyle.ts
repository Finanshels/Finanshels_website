// FIX-008: single source of truth for status-driven Tailwind classes.
// Every admin surface that paints a status pill / dot reads from here so adding
// a new status (or recoloring an existing one) is exactly one edit.

export type CmsStatusKey = 'published' | 'scheduled' | 'approved' | 'in_review' | 'archived' | 'draft'

export type CmsStatusStyle = {
  /** Tailwind classes for the status dot (background swatch). */
  dot: string
  /** Tailwind classes for the status pill (border + bg + text). */
  box: string
  /** Tailwind text-color-only variant of `dot`, used where the dot is rendered as text-colored icon. */
  dotText: string
  /** UPPERCASE label suitable for compact pills. */
  label: string
}

const STATUS_STYLES: Record<string, CmsStatusStyle> = {
  published: {
    dot: 'bg-emerald-500',
    dotText: 'text-emerald-600',
    box: 'border-emerald-300 bg-emerald-50 text-emerald-700',
    label: 'PUBLISHED',
  },
  scheduled: {
    dot: 'bg-sky-500',
    dotText: 'text-sky-600',
    box: 'border-sky-300 bg-sky-50 text-sky-700',
    label: 'SCHEDULED',
  },
  approved: {
    dot: 'bg-violet-500',
    dotText: 'text-violet-600',
    box: 'border-violet-300 bg-violet-50 text-violet-700',
    label: 'APPROVED',
  },
  in_review: {
    dot: 'bg-blue-500',
    dotText: 'text-blue-600',
    box: 'border-blue-300 bg-blue-50 text-blue-700',
    label: 'IN REVIEW',
  },
  archived: {
    dot: 'bg-slate-400',
    dotText: 'text-slate-400',
    box: 'border-slate-300 bg-slate-100 text-slate-600',
    label: 'ARCHIVED',
  },
  draft: {
    dot: 'bg-amber-500',
    dotText: 'text-amber-500',
    box: 'border-amber-300 bg-amber-50 text-amber-700',
    label: 'DRAFT',
  },
}

const FALLBACK = STATUS_STYLES.draft

export function getStatusStyle(status: string): CmsStatusStyle {
  return STATUS_STYLES[status] ?? FALLBACK
}
