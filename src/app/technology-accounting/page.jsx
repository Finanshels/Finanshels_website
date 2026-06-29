import ServiceDetailPage from '../../screens/services/ServiceDetailPage'
import { SECTOR_PAGES } from '@/content/sectors'
import { ServiceJsonLd } from '@/components/seo/StructuredData'

const PATH = '/technology-accounting'
const page = SECTOR_PAGES['technology-accounting']

// SEO metadata comes from the colocated layout.tsx; this page adds JSON-LD only.

export default function Page() {
  return (
    <>
      <ServiceJsonLd page={page} path={PATH} />
      <ServiceDetailPage page={page} />
    </>
  )
}
