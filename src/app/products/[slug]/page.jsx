import { notFound } from 'next/navigation'
import { PRODUCT_PAGES } from '@/content/products'
import ProductDetailPage from '../../../screens/products/ProductDetailPage'
import { buildProductMetadata } from '@/lib/seo/serviceMetadata'
import { ProductJsonLd } from '@/components/seo/StructuredData'

// FIX-064: server component so each product gets real metadata + SoftwareApplication
// JSON-LD; notFound() replaces the soft-404 "coming soon" placeholder for bad slugs.
export async function generateMetadata({ params }) {
  const { slug } = await params
  return buildProductMetadata(PRODUCT_PAGES[slug], `/products/${slug}`)
}

export default async function ProductRoute({ params }) {
  const { slug } = await params
  const product = PRODUCT_PAGES[slug]
  if (!product) notFound()
  return (
    <>
      <ProductJsonLd product={product} path={`/products/${slug}`} />
      <ProductDetailPage product={product} />
    </>
  )
}
