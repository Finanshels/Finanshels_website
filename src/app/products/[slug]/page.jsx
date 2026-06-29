import { notFound } from 'next/navigation'
import { PRODUCT_PAGES } from '@/content/products'
import ProductDetailPage from '../../../screens/products/ProductDetailPage'
import { serviceRouteMetadata } from '@/lib/seo/servicePageMetadata'
import { ProductJsonLd } from '@/components/seo/StructuredData'

// Server component so each product gets a unique title + self-referential
// canonical (FIX-062) plus SoftwareApplication JSON-LD (FIX-064). (Previously
// 'use client', which inherited the root layout's `canonical: '/'` and the
// homepage <title>.) These six are linked from the homepage, so they're
// statically generated and unknown slugs 404.

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
  // FIX-069: PRODUCT_PAGES stores a lucide component in `icon`. Passing that
  // function across the server→client boundary to ProductDetailPage ('use
  // client') throws "Functions cannot be passed directly to Client Components"
  // at prerender (regression from FIX-062, which made this a Server Component).
  // ProductDetailPage never renders the icon, so drop it before passing.
  // ProductJsonLd is a Server Component, so it can keep the full product.
  const productForClient = { ...product, icon: undefined }
  return (
    <>
      <ProductJsonLd product={product} path={`/products/${slug}`} />
      <ProductDetailPage product={productForClient} />
    </>
  )
}
