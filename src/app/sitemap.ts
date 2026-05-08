import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/cms/config'
import { NON_RESOURCE_STATIC_PAGE_PATHS } from '@/lib/staticPageRoutes'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()

  const staticRoutes: MetadataRoute.Sitemap = NON_RESOURCE_STATIC_PAGE_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }))

  return staticRoutes
}
