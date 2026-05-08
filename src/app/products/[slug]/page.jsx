'use client'

import { use } from 'react'
import { PRODUCT_PAGES } from '../../../data/products'
import ProductDetailPage from '../../../screens/products/ProductDetailPage'

export default function ProductRoute({ params }) {
  const { slug } = use(params)
  return <ProductDetailPage product={PRODUCT_PAGES[slug]} />
}
