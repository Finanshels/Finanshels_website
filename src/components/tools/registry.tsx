'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import type { ToolRouteKey, ToolWidgetProps } from '@/lib/tools/types'

export function ToolWidgetSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-8">
      <div className="h-6 w-1/3 rounded bg-slate-200" />
      <div className="mt-4 h-10 w-full rounded bg-slate-200" />
      <div className="mt-3 h-10 w-full rounded bg-slate-200" />
    </div>
  )
}

/**
 * The ONLY place a tool_route_key is wired to a widget. Adding a tool = add one
 * line here + the widget file. Widgets are client-only and code-split per tool.
 */
const REGISTRY: Partial<Record<ToolRouteKey, ComponentType<ToolWidgetProps>>> = {
  'vat-calculator': dynamic(() => import('./widgets/VatCalculator'), {
    loading: () => <ToolWidgetSkeleton />,
  }),
}

export function getToolWidget(
  key: ToolRouteKey
): ComponentType<ToolWidgetProps> | null {
  return REGISTRY[key] ?? null
}
