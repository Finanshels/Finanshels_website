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
