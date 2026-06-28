'use client'

import type { ToolRouteKey, ToolWidgetProps } from '@/lib/tools/types'
import { getToolWidget } from './registry'
import { ToolComingSoon } from './ToolComingSoon'

interface ToolWidgetMountProps extends ToolWidgetProps {
  toolRouteKey: ToolRouteKey
}

/**
 * Client boundary for the widget registry. A server component cannot CALL
 * getToolWidget() (it lives in a `'use client'` module) — it can only render a
 * client component. So the server tool page renders THIS, and the registry
 * lookup + widget render happen on the client. Falls back to the ToolComingSoon
 * interest-capture state when no widget is registered for the tool's route key.
 */
export function ToolWidgetMount({ toolRouteKey, ...props }: ToolWidgetMountProps) {
  const Widget = getToolWidget(toolRouteKey)
  if (!Widget) {
    return <ToolComingSoon slug={props.slug} serviceInterest={props.serviceInterest} />
  }
  return <Widget {...props} />
}
