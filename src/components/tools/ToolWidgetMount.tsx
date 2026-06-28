'use client'

import type { ToolRouteKey, ToolWidgetProps } from '@/lib/tools/types'
import { getToolWidget } from './registry'

interface ToolWidgetMountProps extends ToolWidgetProps {
  toolRouteKey: ToolRouteKey
}

/**
 * Client boundary for the widget registry. A server component cannot CALL
 * getToolWidget() (it lives in a `'use client'` module) — it can only render a
 * client component. So the server tool page renders THIS, and the registry
 * lookup + widget render happen on the client. Falls back to a "launching soon"
 * notice when no widget is registered for the tool's route key.
 */
export function ToolWidgetMount({ toolRouteKey, ...props }: ToolWidgetMountProps) {
  const Widget = getToolWidget(toolRouteKey)
  if (!Widget) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        This tool is launching soon.
      </div>
    )
  }
  return <Widget {...props} />
}
