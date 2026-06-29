import AmlPage from '../../screens/AmlPage'
import { serviceRouteMetadata } from '@/lib/seo/servicePageMetadata'

// Server component (was 'use client' for no reason — AmlPage uses no hooks) so
// it gets a unique title + self-referential canonical instead of inheriting
// the root layout's `canonical: '/'`.
export const metadata = serviceRouteMetadata('/aml-uae')

export default function Page() {
  return <AmlPage />
}
