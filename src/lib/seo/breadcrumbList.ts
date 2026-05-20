import { getSiteUrl } from '@/lib/cms/config'

export interface BreadcrumbItem {
  name: string
  /** Absolute or root-relative path; do not pass query strings. */
  path: string
}

/**
 * Build a schema.org BreadcrumbList JSON-LD object.
 * Pass the breadcrumb trail in display order (e.g. Home -> Section -> Page).
 * The home entry is added automatically.
 */
export function buildBreadcrumbList(trail: ReadonlyArray<BreadcrumbItem>): Record<string, unknown> {
  const site = getSiteUrl()
  const fullTrail: BreadcrumbItem[] = [{ name: 'Home', path: '/' }, ...trail]
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: fullTrail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path.startsWith('http') ? item.path : `${site}${item.path}`,
    })),
  }
}
