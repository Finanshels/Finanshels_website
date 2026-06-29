import ServiceDetailPage from '../../screens/services/ServiceDetailPage'
import { SERVICE_PAGES } from '@/content/service-pages'
import { getTestimonials } from '@/lib/cms/reviewsRepository'
import { serviceRouteMetadata } from '@/lib/seo/servicePageMetadata'

// Reviews change rarely; revalidate hourly (customer_reviews has no auto-revalidation route).
export const revalidate = 3600

export const metadata = serviceRouteMetadata('/corporate-tax-registration-uae', SERVICE_PAGES['corporate-tax-registration-uae'])

export default async function Page() {
  const cmsTestimonials = await getTestimonials({ service: 'corporate-tax', limit: 12 })
  return <ServiceDetailPage page={SERVICE_PAGES['corporate-tax-registration-uae']} cmsTestimonials={cmsTestimonials} />
}
