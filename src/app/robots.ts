import type { MetadataRoute } from 'next'
import { getSiteUrl, isProductionSite } from '@/lib/cms/config'

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl()

  // FIX-076: staging/preview deploys must never be crawled. Block everything so
  // a non-production URL (e.g. staging.finanshels.com or a Vercel preview) can't
  // be indexed and outrank/duplicate production during the Webflow migration.
  if (!isProductionSite()) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
