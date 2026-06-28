import { safeJsonLd } from '@/lib/seo/safeJsonLd'
import type { ServicePage } from '@/content/service-pages'
import type { Product } from '@/content/products'

// FIX-064: service/sector/solution/product pages shipped with no structured data.
// Service + FAQPage + BreadcrumbList markup is the core AEO/GEO lever — answer
// engines (Google AI Overviews, Perplexity, ChatGPT) extract the Q&A and entity
// graph directly. Rendered server-side via the same safeJsonLd sanitizer the
// root layout uses.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.finanshels.com'

function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }} />
}

export function ServiceJsonLd({ page, path }: { page?: Partial<ServicePage>; path: string }) {
  if (!page?.title) return null
  const url = `${SITE_URL}${path}`
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Service',
      name: page.title,
      description: page.subtitle || page.description,
      serviceType: page.title,
      provider: { '@type': 'Organization', name: 'Finanshels', url: SITE_URL },
      areaServed: { '@type': 'Country', name: 'United Arab Emirates' },
      url,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: page.title, item: url },
      ],
    },
  ]
  if (page.faqs?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: page.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    })
  }
  return <JsonLd data={{ '@context': 'https://schema.org', '@graph': graph }} />
}

export function ProductJsonLd({ product, path }: { product?: Product; path: string }) {
  if (!product?.name) return null
  const url = `${SITE_URL}${path}`
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'SoftwareApplication',
      name: product.name,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: product.summary || product.subtitle || product.description,
      publisher: { '@type': 'Organization', name: 'Finanshels', url: SITE_URL },
      url,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
        { '@type': 'ListItem', position: 3, name: product.name, item: url },
      ],
    },
  ]
  return <JsonLd data={{ '@context': 'https://schema.org', '@graph': graph }} />
}
