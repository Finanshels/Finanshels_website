'use client'

import * as Lucide from 'lucide-react'

type IconComponent = React.ComponentType<{ className?: string }>

/**
 * Resolve a kebab/snake/space-separated icon name to a lucide-react component.
 * Mirrors getLucideIcon() in sections/Sections.tsx so the admin picker renders
 * exactly what the public page will render. Falls back to CheckCircle.
 */
export function resolveLucide(name: unknown): IconComponent {
  const raw = typeof name === 'string' && name.trim() ? name.trim() : 'check-circle'
  const pascal = raw
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
  const lookup = Lucide as unknown as Record<string, IconComponent>
  return lookup[pascal] ?? Lucide.CheckCircle
}

export function LucideIcon({ name, className }: { name: unknown; className?: string }) {
  const Comp = resolveLucide(name)
  return <Comp className={className} />
}
