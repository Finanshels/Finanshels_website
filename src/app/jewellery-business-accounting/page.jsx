import ServiceDetailPage from '../../screens/services/ServiceDetailPage'
import { SECTOR_PAGES } from '@/content/sectors'
import { getTestimonials } from '@/lib/cms/reviewsRepository'
import { serviceRouteMetadata } from '@/lib/seo/servicePageMetadata'
import { ServiceJsonLd } from '@/components/seo/StructuredData'

const PATH = '/jewellery-business-accounting'
const page = SECTOR_PAGES['jewellery-business-accounting']

// Reviews change rarely; revalidate hourly (customer_reviews has no auto-revalidation route).
export const revalidate = 3600

export const metadata = serviceRouteMetadata(PATH, page)

export default async function Page() {
  const cmsTestimonials = await getTestimonials({ limit: 12 })
  return (
    <>
      <ServiceJsonLd page={page} path={PATH} />
      <ServiceDetailPage page={page} cmsTestimonials={cmsTestimonials} />
    </>
  )
}
