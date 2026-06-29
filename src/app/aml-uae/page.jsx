import AmlPage from '../../screens/AmlPage'
import { ServiceJsonLd } from '@/components/seo/StructuredData'

// FIX-064: AML page is bespoke (not a SERVICE_PAGES entry). SEO metadata comes
// from the colocated layout.tsx (hand-tuned copy); this page adds the
// Service/Breadcrumb JSON-LD for AEO/GEO.
const PATH = '/aml-uae'

const AML_SEO = {
  title: 'AML Compliance UAE',
  subtitle:
    'goAML registration and ongoing AML compliance for UAE businesses — DNFBPs, real estate, and precious-metals dealers.',
}

export default function Page() {
  return (
    <>
      <ServiceJsonLd page={AML_SEO} path={PATH} />
      <AmlPage />
    </>
  )
}
