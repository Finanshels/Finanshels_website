import { cn } from '@/lib/cn'
import { initialsOf } from '@/lib/cms/initials'
import type { ZohoStatus } from './leadTypes'

// Server-safe presentational badges shared by the lead roster + drawer.

const ZOHO_PILL: Record<ZohoStatus, { box: string; dot: string; label: string }> = {
  synced: { box: 'border-emerald-300 bg-emerald-50 text-emerald-700', dot: 'text-emerald-600', label: 'synced' },
  failed: { box: 'border-red-300 bg-red-50 text-red-700', dot: 'text-red-500', label: 'failed' },
  pending: { box: 'border-amber-300 bg-amber-50 text-amber-800', dot: 'text-amber-600', label: 'pending' },
}

export function ZohoStatusPill({ status, className }: { status: ZohoStatus; className?: string }) {
  const s = ZOHO_PILL[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-wider',
        s.box,
        className,
      )}
    >
      <span className={s.dot} aria-hidden>
        ●
      </span>
      {s.label}
    </span>
  )
}

const LEAD_AVATAR_SIZE = {
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
} as const

/** Brand-tinted initials avatar for a lead (no role tinting — leads have no role). */
export function LeadAvatar({
  name,
  email,
  size = 'md',
  className,
}: {
  name: string
  email: string
  size?: keyof typeof LEAD_AVATAR_SIZE
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-brand-primary/10 font-semibold text-brand-primary',
        LEAD_AVATAR_SIZE[size],
        className,
      )}
      aria-hidden
    >
      {initialsOf(name, email)}
    </span>
  )
}
