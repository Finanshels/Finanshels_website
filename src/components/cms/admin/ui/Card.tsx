import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('bg-white border border-cms-rule rounded-xl p-5 shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  )
}
