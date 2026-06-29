import ServiceDetailPage from '../../screens/services/ServiceDetailPage'
import { SERVICE_PAGES } from '@/content/service-pages'
import { getTestimonials } from '@/lib/cms/reviewsRepository'
import { serviceRouteMetadata } from '@/lib/seo/servicePageMetadata'

// Reviews change rarely; revalidate hourly (customer_reviews has no auto-revalidation route).
export const revalidate = 3600

export const metadata = serviceRouteMetadata('/vat-registration-uae', SERVICE_PAGES['vat-registration-uae'])

export default async function Page() {
  const cmsTestimonials = await getTestimonials({ service: 'vat', limit: 12 })
  return <ServiceDetailPage page={SERVICE_PAGES['vat-registration-uae']} cmsTestimonials={cmsTestimonials} />
}
