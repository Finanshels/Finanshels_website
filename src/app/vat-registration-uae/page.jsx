import ServiceDetailPage from '../../screens/services/ServiceDetailPage'
import { SERVICE_PAGES } from '@/content/service-pages'
import { buildServiceMetadata } from '@/lib/seo/serviceMetadata'
import { ServiceJsonLd } from '@/components/seo/StructuredData'

const PATH = '/vat-registration-uae'
const page = SERVICE_PAGES['vat-registration-uae']

export const metadata = buildServiceMetadata(page, PATH)

export default function Page() {
  return (
    <>
      <ServiceJsonLd page={page} path={PATH} />
      <ServiceDetailPage page={page} />
    </>
  )
}
