/**
 * Curated, allow-listed Lucide icon names for the Landing Page Studio.
 *
 * Single source of truth shared by:
 *   - the IconField picker (admin),
 *   - AI drafting (constrains `icon` props to this set),
 *   - section renderers (via getLucideIcon, which tolerates any name but we keep
 *     to this set so pickers and AI never produce a missing icon).
 *
 * Names are kebab-case. `getLucideIcon()` (see sections/Sections.tsx) converts
 * them to PascalCase and looks them up in `lucide-react`, falling back to a
 * check icon if absent — so an unknown name degrades gracefully, but everything
 * here is known-good in lucide-react ^1.x.
 *
 * Pure data only — no React, no lucide import — so this stays server-safe and
 * can be imported by the AI schema builder.
 */

export type IconGroup = {
  label: string
  icons: string[]
}

export const LANDING_ICON_GROUPS: IconGroup[] = [
  {
    label: 'Trust & compliance',
    icons: [
      'shield',
      'shield-check',
      'badge-check',
      'check-circle',
      'circle-check',
      'lock',
      'fingerprint',
      'scale',
      'gavel',
      'landmark',
      'file-check',
      'verified',
    ],
  },
  {
    label: 'Speed & process',
    icons: [
      'clock',
      'timer',
      'hourglass',
      'zap',
      'rocket',
      'refresh-cw',
      'repeat',
      'list-checks',
      'workflow',
      'gauge',
    ],
  },
  {
    label: 'Money & finance',
    icons: [
      'banknote',
      'coins',
      'wallet',
      'credit-card',
      'receipt',
      'calculator',
      'percent',
      'piggy-bank',
      'trending-up',
      'trending-down',
      'bar-chart',
      'tag',
    ],
  },
  {
    label: 'People & support',
    icons: [
      'users',
      'user-check',
      'handshake',
      'headphones',
      'message-circle',
      'message-square',
      'phone',
      'mail',
      'life-buoy',
      'smile',
      'heart',
      'thumbs-up',
    ],
  },
  {
    label: 'Documents & data',
    icons: [
      'file-text',
      'file-check',
      'clipboard-check',
      'calendar',
      'calendar-check',
      'database',
      'server',
      'cloud',
      'folder',
      'book-open',
      'bookmark',
      'pencil',
    ],
  },
  {
    label: 'Value & highlights',
    icons: [
      'star',
      'award',
      'sparkles',
      'lightbulb',
      'target',
      'gift',
      'flag',
      'megaphone',
      'eye',
      'globe',
      'building',
      'briefcase',
    ],
  },
  {
    label: 'Status & navigation',
    icons: [
      'check',
      'x',
      'plus',
      'minus',
      'arrow-right',
      'chevron-right',
      'alert-circle',
      'info',
      'help-circle',
      'download',
      'upload',
      'send',
    ],
  },
]

/** Flat list of every allow-listed icon name (deduped, order-preserving). */
export const LANDING_ICON_NAMES: string[] = Array.from(
  new Set(LANDING_ICON_GROUPS.flatMap((g) => g.icons)),
)

const ICON_NAME_SET = new Set(LANDING_ICON_NAMES)

export function isKnownIconName(name: unknown): name is string {
  return typeof name === 'string' && ICON_NAME_SET.has(name)
}

export const DEFAULT_ICON_NAME = 'check-circle'
