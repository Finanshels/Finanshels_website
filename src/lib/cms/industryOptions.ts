/**
 * Single source of truth for the industry verticals used by `blog_posts`
 * (`blog_industry`) and the customer collections (`industry`).
 *
 * Pure data — NO React / lucide imports — so it is safe to import from
 * `collectionDefinitions.ts` (shared by server + admin client) and from server
 * components. The kebab-case `icon` maps to a lucide-react component in
 * `IndustryIcon.tsx`; the registry itself stays icon-library agnostic.
 */

export type IndustryOption = {
  /** Stored slug — the CMS field value. */
  value: string
  /** Human display name for dropdowns, chips, and badges. */
  label: string
  /** kebab-case lucide-react icon name (see IndustryIcon for the mapping). */
  icon: string
}

export const INDUSTRY_OPTIONS: readonly IndustryOption[] = [
  { value: 'small-business', label: 'Small Business', icon: 'store' },
  { value: 'technology-startups', label: 'Technology & Startups', icon: 'sparkles' },
  { value: 'real-estate', label: 'Real Estate', icon: 'building-2' },
  { value: 'restaurants-fb', label: 'Restaurants & F&B', icon: 'utensils' },
  { value: 'healthcare', label: 'Healthcare', icon: 'heart-pulse' },
  { value: 'trading-business', label: 'Trading Businesses', icon: 'scale' },
  { value: 'ecommerce', label: 'E-commerce', icon: 'shopping-cart' },
  { value: 'jewellers-precious-metals', label: 'Jewellers & Precious Metals', icon: 'gem' },
  { value: 'vc-funds-investment-firms', label: 'VC Funds & Investment Firms', icon: 'wallet' },
  { value: 'professional-services', label: 'Professional Services', icon: 'briefcase-business' },
  { value: 'construction-contracting', label: 'Construction & Contracting', icon: 'hard-hat' },
  { value: 'general', label: 'General / All Industries', icon: 'layers' },
] as const

/** Ordered slug list — feeds a `select` field's `options`. */
export const INDUSTRY_VALUES: string[] = INDUSTRY_OPTIONS.map((o) => o.value)

/** value → display name — feeds a `select` field's `optionLabels`. */
export const INDUSTRY_LABELS: Record<string, string> = Object.fromEntries(
  INDUSTRY_OPTIONS.map((o) => [o.value, o.label])
)

/** value → full option (label + icon) for renderers. */
export const INDUSTRY_OPTION_MAP: Record<string, IndustryOption> = Object.fromEntries(
  INDUSTRY_OPTIONS.map((o) => [o.value, o])
)
