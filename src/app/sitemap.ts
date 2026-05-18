import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/cms/config'
import { NON_RESOURCE_STATIC_PAGE_PATHS } from '@/lib/staticPageRoutes'
import { CMS_COLLECTION_DEFINITIONS } from '@/lib/cms/collectionDefinitions'
import { listCmsDocuments } from '@/lib/cms/collectionRepository'

export const revalidate = 3600

const PER_COLLECTION_LIMIT = 1000

/** Emits a detail URL only for single-parameter `/path/[slug]` patterns. */
function detailUrl(routePattern: string, slug: string): string | null {
  const params = routePattern.match(/\[[^\]]+\]/g) ?? []
  if (params.length !== 1 || params[0] !== '[slug]') return null
  return routePattern.replace('[slug]', encodeURIComponent(slug))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()

  const staticRoutes: MetadataRoute.Sitemap = NON_RESOURCE_STATIC_PAGE_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }))

  const seen = new Set<string>(staticRoutes.map((r) => r.url))
  const dynamicRoutes: MetadataRoute.Sitemap = []

  for (const definition of CMS_COLLECTION_DEFINITIONS) {
    const { routePattern, listingRoute } = definition
    if (!routePattern || !listingRoute) continue

    // Listing route (deduped — several collections share `/faq`).
    const listingUrl = `${base}${listingRoute}`
    if (!seen.has(listingUrl)) {
      seen.add(listingUrl)
      dynamicRoutes.push({
        url: listingUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.6,
      })
    }

    let docs
    try {
      docs = await listCmsDocuments(
        definition.key,
        definition.titleField,
        definition.slugField,
        PER_COLLECTION_LIMIT
      )
    } catch {
      continue
    }

    for (const doc of docs) {
      if (doc.status !== 'published') continue
      const path = detailUrl(routePattern, doc.slug)
      if (!path) continue
      const url = `${base}${path}`
      if (seen.has(url)) continue
      seen.add(url)
      dynamicRoutes.push({
        url,
        lastModified: doc.updatedAt ?? doc.publishedAt ?? new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }

  return [...staticRoutes, ...dynamicRoutes]
}
