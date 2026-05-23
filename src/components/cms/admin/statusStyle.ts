// FIX-008: single source of truth for status-driven Tailwind classes.
// Every admin surface that paints a status pill / dot reads from here so adding
// a new status (or recoloring an existing one) is exactly one edit.

// FIX-047: collapsed from 6 to 3. STATUS_STYLES keeps the 3 supported keys;
// getStatusStyle() falls back to the draft style for any unrecognized value
// (defensive for stray legacy values that survive the readStatus() coercion).
export type CmsStatusKey = 'published' | 'in_review' | 'draft'

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
  in_review: {
    dot: 'bg-blue-500',
    dotText: 'text-blue-600',
    box: 'border-blue-300 bg-blue-50 text-blue-700',
    label: 'IN REVIEW',
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
