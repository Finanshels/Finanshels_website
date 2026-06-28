import { cn } from '@/lib/cn'
import { initialsOf } from '@/lib/cms/initials'
import { ROLE_LABEL, type CmsUserRole, type CmsUserStatus } from '@/lib/cms/roles'

// Server-safe presentational badges shared by the server page (role reference)
// and the client roster/drawer. No hooks here — keep it importable from both
// sides of the RSC boundary.

const ROLE_PILL: Record<CmsUserRole, string> = {
  owner: 'border-brand-primary/40 bg-brand-primary/10 text-brand-primary',
  admin: 'border-violet-300 bg-violet-50 text-violet-700',
  editor: 'border-sky-300 bg-sky-50 text-sky-700',
  viewer: 'border-slate-300 bg-slate-100 text-slate-700',
}

export function RolePill({ role, className }: { role: CmsUserRole; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider',
        ROLE_PILL[role],
        className,
      )}
    >
      {ROLE_LABEL[role]}
    </span>
  )
}

const STATUS_PILL: Record<CmsUserStatus, { box: string; dot: string; label: string }> = {
  active: { box: 'border-emerald-300 bg-emerald-50 text-emerald-700', dot: 'text-emerald-600', label: 'active' },
  invited: { box: 'border-amber-300 bg-amber-50 text-amber-800', dot: 'text-amber-600', label: 'invited' },
  disabled: { box: 'border-slate-300 bg-slate-100 text-slate-600', dot: 'text-slate-400', label: 'disabled' },
}

export function StatusPill({ status, className }: { status: CmsUserStatus; className?: string }) {
  const s = STATUS_PILL[status]
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

const AVATAR_TINT: Record<CmsUserRole, string> = {
  owner: 'bg-brand-primary/15 text-brand-primary',
  admin: 'bg-violet-100 text-violet-700',
  editor: 'bg-sky-100 text-sky-700',
  viewer: 'bg-slate-200 text-slate-700',
}

const AVATAR_SIZE = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
} as const

export function InitialsAvatar({
  name,
  email,
  role,
  size = 'md',
  className,
}: {
  name: string
  email: string
  role: CmsUserRole
  size?: keyof typeof AVATAR_SIZE
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold',
        AVATAR_TINT[role],
        AVATAR_SIZE[size],
        className,
      )}
      aria-hidden
    >
      {initialsOf(name, email)}
    </span>
  )
}
