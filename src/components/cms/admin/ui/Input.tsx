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
        {error      && <p className="text-[12px] text-red-600">{error}</p>}
        {helperText && !error && <p className="text-[12px] text-slate-500">{helperText}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'
