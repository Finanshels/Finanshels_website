import ServiceDetailPage from '../../screens/services/ServiceDetailPage'
import { SERVICE_PAGES } from '@/content/service-pages'
import { getTestimonials } from '@/lib/cms/reviewsRepository'
import { serviceRouteMetadata } from '@/lib/seo/servicePageMetadata'
import { ServiceJsonLd } from '@/components/seo/StructuredData'

const PATH = '/corporate-tax-registration-uae'
const page = SERVICE_PAGES['corporate-tax-registration-uae']

// Reviews change rarely; revalidate hourly (customer_reviews has no auto-revalidation route).
export const revalidate = 3600

export const metadata = serviceRouteMetadata(PATH, page)

export default async function Page() {
  const cmsTestimonials = await getTestimonials({ service: 'corporate-tax', limit: 12 })
  return (
    <>
      <ServiceJsonLd page={page} path={PATH} />
      <ServiceDetailPage page={page} cmsTestimonials={cmsTestimonials} />
    </>
  )
}
