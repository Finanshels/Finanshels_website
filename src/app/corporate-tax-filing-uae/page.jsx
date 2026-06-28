import ServiceDetailPage from '../../screens/services/ServiceDetailPage'
import { SERVICE_PAGES } from '@/content/service-pages'
import { getTestimonials } from '@/lib/cms/reviewsRepository'

// Reviews change rarely; revalidate hourly (customer_reviews has no auto-revalidation route).
export const revalidate = 3600

export default async function Page() {
  const cmsTestimonials = await getTestimonials({ service: 'corporate-tax', limit: 12 })
  return <ServiceDetailPage page={SERVICE_PAGES['corporate-tax-filing-uae']} cmsTestimonials={cmsTestimonials} />
}
