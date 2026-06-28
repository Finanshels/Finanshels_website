import type { Metadata } from 'next'
import type { ServicePage } from '@/content/service-pages'
import type { Product } from '@/content/products'

// FIX-064: service/sector/solution detail pages were client wrappers with no
// metadata, so every one inherited the root layout's generic title/description
// (duplicate-title SEO penalty, wrong canonical). This builds per-page metadata
// from the page's own content. The root layout's `%s | Finanshels` template
// appends the brand to `title`.
function clip(text: string, max = 160): string {
  const t = (text || '').replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return t.slice(0, max - 1).replace(/\s+\S*$/, '').trim() + '…'
}

export function buildServiceMetadata(
  page: ServicePage | undefined,
  canonicalPath: string
): Metadata {
  if (!page) return {}
  const title = page.title
  const description = clip(page.subtitle || page.description || '')
  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: `${title} | Finanshels`,
      description,
      url: canonicalPath,
      type: 'website',
    },
  }
}

export function buildProductMetadata(
  product: Product | undefined,
  canonicalPath: string
): Metadata {
  if (!product) return {}
  const title = product.name
  const description = clip(product.summary || product.subtitle || product.description || '')
  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: `${title} | Finanshels`,
      description,
      url: canonicalPath,
      type: 'website',
    },
  }
}
