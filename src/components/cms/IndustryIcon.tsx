import {
  Store,
  Sparkles,
  Building2,
  Utensils,
  HeartPulse,
  Scale,
  ShoppingCart,
  Gem,
  Wallet,
  BriefcaseBusiness,
  HardHat,
  Layers,
  type LucideIcon,
} from 'lucide-react'

/**
 * Maps the kebab-case icon names in `INDUSTRY_OPTIONS` (industryOptions.ts) to
 * lucide-react components. Kept here, out of the pure-data registry, so the
 * registry stays icon-library agnostic and importable from server code.
 */
const INDUSTRY_ICONS: Record<string, LucideIcon> = {
  store: Store,
  sparkles: Sparkles,
  'building-2': Building2,
  utensils: Utensils,
  'heart-pulse': HeartPulse,
  scale: Scale,
  'shopping-cart': ShoppingCart,
  gem: Gem,
  wallet: Wallet,
  'briefcase-business': BriefcaseBusiness,
  'hard-hat': HardHat,
  layers: Layers,
}

export function IndustryIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = INDUSTRY_ICONS[icon] ?? Layers
  return <Icon className={className} aria-hidden />
}
