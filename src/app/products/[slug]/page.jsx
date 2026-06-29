import { notFound } from 'next/navigation'
import { PRODUCT_PAGES } from '@/content/products'
import ProductDetailPage from '../../../screens/products/ProductDetailPage'
import { serviceRouteMetadata } from '@/lib/seo/servicePageMetadata'

// Server component so each product gets a unique title + self-referential
// canonical. (Previously 'use client', which inherited the root layout's
// `canonical: '/'` and the homepage <title>.) These six are linked from the
// homepage, so they're statically generated and unknown slugs 404.

export function generateStaticParams() {
  return Object.keys(PRODUCT_PAGES).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = PRODUCT_PAGES[slug]
  if (!product) return {}
  // Prefers bespoke copy in SERVICE_PAGE_SEO['/products/<slug>'], falling back
  // to the product's own name/summary.
  return serviceRouteMetadata(`/products/${slug}`, {
    title: product.name,
    description: product.summary || product.description,
  })
}

export default async function ProductRoute({ params }) {
  const { slug } = await params
  const product = PRODUCT_PAGES[slug]
  if (!product) notFound()
  return <ProductDetailPage product={product} />
}
