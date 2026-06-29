import AmlPage from '../../screens/AmlPage'
import { serviceRouteMetadata } from '@/lib/seo/servicePageMetadata'
import { ServiceJsonLd } from '@/components/seo/StructuredData'

// Server component (was 'use client' for no reason — AmlPage uses no hooks) so it
// gets a unique title + self-referential canonical (FIX-062) instead of inheriting
// the root layout's `canonical: '/'`. Also emits Service/Breadcrumb JSON-LD
// (FIX-064) for AEO/GEO — AML is bespoke (not a SERVICE_PAGES entry).
const PATH = '/aml-uae'

const AML_SEO = {
  title: 'AML Compliance UAE',
  subtitle:
    'goAML registration and ongoing AML compliance for UAE businesses — DNFBPs, real estate, and precious-metals dealers.',
}

export const metadata = serviceRouteMetadata(PATH)

export default function Page() {
  return (
    <>
      <ServiceJsonLd page={AML_SEO} path={PATH} />
      <AmlPage />
    </>
  )
}
