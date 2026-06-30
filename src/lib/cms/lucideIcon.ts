import * as Lucide from 'lucide-react'
import type { ComponentType } from 'react'

type IconComponent = ComponentType<{ className?: string }>

/**
 * Resolve a kebab/snake/space-cased lucide icon name to its React component.
 * Server-side only by convention (it pulls the full lucide namespace) — render
 * dynamic icons inside Server Components. Falls back to a neutral circle.
 *
 * NOTE: do not import this from a `'use client'` module — it would pull the
 * entire lucide icon set into the client bundle. Client components should import
 * the specific icons they need directly.
 */
export function getLucideIcon(name: unknown): IconComponent {
  const raw = typeof name === 'string' ? name.trim() : ''
  if (!raw) return Lucide.Circle
  const pascal = raw
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
  const map = Lucide as unknown as Record<string, IconComponent>
  return map[pascal] ?? Lucide.Circle
}
