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
