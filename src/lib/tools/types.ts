/** Shared, framework-level types for interactive tools. Pure — no React, no server-only. */

/** Gate intensity for a tool's result. */
export type ToolGate = 'open' | 'soft'

/** Stable identifier used to wire a CMS tool doc to its coded widget. */
export type ToolRouteKey =
  | 'vat-calculator'
  | 'gratuity-calculator'
  | 'corporate-tax-deadline-checker'
  | 'business-finance-health-check'

/** Props every widget receives from the tool page shell. */
export interface ToolWidgetProps {
  slug: string
  gate: ToolGate
  /** CMS toggle — when false the full result is shown without a lead form. */
  leadCaptureEnabled: boolean
  /** CTA text shown on the gated panel, e.g. "Email me the full breakdown". */
  gatedOutputLabel: string
  /** Short sentence describing the gated lead magnet. */
  leadMagnetDescription: string
  /** Zoho service routing key from the tool's related_services. */
  serviceInterest: string
}
