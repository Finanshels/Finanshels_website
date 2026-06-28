import ServiceDetailPage from '../../screens/services/ServiceDetailPage'
import { SECTOR_PAGES } from '@/content/sectors'
import { buildServiceMetadata } from '@/lib/seo/serviceMetadata'
import { ServiceJsonLd } from '@/components/seo/StructuredData'

const PATH = '/ecommerce-accounting'
const page = SECTOR_PAGES['ecommerce-accounting']

export const metadata = buildServiceMetadata(page, PATH)

export default function Page() {
  return (
    <>
      <ServiceJsonLd page={page} path={PATH} />
      <ServiceDetailPage page={page} />
    </>
  )
}
