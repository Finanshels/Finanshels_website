'use client'

import * as Lucide from 'lucide-react'
import { s } from '@/lib/landing-pages/safeProps'

export const CARD = 'rounded-2xl border border-slate-200 bg-white'
export const CARD_HOVER = 'hover:border-slate-300 hover:shadow-sm transition'
export const ACCENT_CHIP = 'inline-flex items-center rounded-full bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1'

export function getLucideIcon(name: unknown): React.ComponentType<{ className?: string }> {
  const raw = s(name) || 'circle-check'
  const pascal = raw
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
  const Comp = (Lucide as unknown as Record<string, React.ComponentType<{ className?: string }>>)[pascal]
  return Comp ?? Lucide.CheckCircle
}

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className ?? ''}`}>{children}</div>
}

export function SectionWrap({
  children,
  bg = 'white',
  pad = 'lg',
}: {
  children: React.ReactNode
  bg?: 'white' | 'slate' | 'accent' | 'dark'
  pad?: 'sm' | 'md' | 'lg'
}) {
  const bgClass = bg === 'slate' ? 'bg-slate-50' : bg === 'accent' ? 'bg-amber-50' : bg === 'dark' ? 'bg-slate-900 text-white' : 'bg-white'
  const padClass = pad === 'sm' ? 'py-10' : pad === 'md' ? 'py-14' : 'py-16 sm:py-20'
  return <section className={`${bgClass} ${padClass}`}>{children}</section>
}

export function SectionHeading({ heading, subheading, dark }: { heading?: string; subheading?: string; dark?: boolean }) {
  if (!heading && !subheading) return null
  return (
    <div className="text-center mb-10 max-w-3xl mx-auto">
      {heading ? (
        <h2 className={`text-2xl sm:text-4xl font-display font-semibold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>{heading}</h2>
      ) : null}
      {subheading ? (
        <p className={`mt-3 text-base sm:text-lg ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{subheading}</p>
      ) : null}
    </div>
  )
}
