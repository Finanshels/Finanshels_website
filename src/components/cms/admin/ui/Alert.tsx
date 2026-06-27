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
