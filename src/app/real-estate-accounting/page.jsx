import ServiceDetailPage from '../../screens/services/ServiceDetailPage'
import { SECTOR_PAGES } from '@/content/sectors'
import { getTestimonials } from '@/lib/cms/reviewsRepository'
import { serviceRouteMetadata } from '@/lib/seo/servicePageMetadata'

// Reviews change rarely; revalidate hourly (customer_reviews has no auto-revalidation route).
export const revalidate = 3600

export const metadata = serviceRouteMetadata('/real-estate-accounting', SECTOR_PAGES['real-estate-accounting'])

export default async function Page() {
  const cmsTestimonials = await getTestimonials({ limit: 12 })
  return <ServiceDetailPage page={SECTOR_PAGES['real-estate-accounting']} cmsTestimonials={cmsTestimonials} />
}
