import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type BadgeVariant = 'published' | 'in_review' | 'draft' | 'default'

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

const defaultLabels: Record<BadgeVariant, string> = {
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
      {children ?? defaultLabels[variant]}
    </span>
  )
}
