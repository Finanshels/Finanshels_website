import ServiceDetailPage from '../../screens/services/ServiceDetailPage'
import { SERVICE_PAGES } from '@/content/service-pages'
import { ServiceJsonLd } from '@/components/seo/StructuredData'

const PATH = '/vat-registration-uae'
const page = SERVICE_PAGES['vat-registration-uae']

// SEO metadata comes from the colocated layout.tsx; this page adds JSON-LD only.

export default function Page() {
  return (
    <>
      <ServiceJsonLd page={page} path={PATH} />
      <ServiceDetailPage page={page} />
    </>
  )
}
