import { cn } from '../../lib/utils'

export function Button({ 
  className, 
  variant = 'default', 
  size = 'default', 
  children, 
  as: Component = 'button',
  ...props 
}) {
  const composedClassName = cn(
    'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f16610]/30',
    'disabled:pointer-events-none disabled:opacity-50',
    {
      'bg-gradient-to-r from-[#f16610] to-[#ff8a3c] text-white hover:from-[#e45c09] hover:to-[#ff7a1f] shadow-xl hover:shadow-2xl hover:scale-[1.02]': variant === 'default' || variant === 'primary',
      'border-2 border-[#f16610] text-[#f16610] hover:bg-[#f16610] hover:text-white shadow-lg hover:shadow-xl': variant === 'outline',
      'text-slate-700 hover:bg-slate-100': variant === 'ghost',
    },
    {
      'h-12 px-8 text-base': size === 'default',
      'h-14 px-10 text-lg': size === 'lg',
      'h-10 px-6 text-sm': size === 'sm',
    },
    className
  )

  const componentProps = {
    className: composedClassName,
    ...props,
  }

  if (typeof Component === 'string' && Component === 'button' && !('type' in componentProps)) {
    componentProps.type = 'button'
  }

  return (
    <Component {...componentProps}>
      {children}
    </Component>
  )
}
