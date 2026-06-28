import AmlPage from '../../screens/AmlPage'
import { ServiceJsonLd } from '@/components/seo/StructuredData'

// FIX-064: AML page is bespoke (not a SERVICE_PAGES entry). Give it dedicated
// metadata + Service/Breadcrumb JSON-LD for SEO/AEO/GEO.
const PATH = '/aml-uae'

export const metadata = {
  title: 'AML Compliance Services UAE',
  description:
    'goAML registration and end-to-end AML compliance for UAE businesses — DNFBPs, real estate brokers, and dealers in precious metals. FTA/MOE-ready.',
  alternates: { canonical: PATH },
  openGraph: {
    title: 'AML Compliance Services UAE | Finanshels',
    description:
      'goAML registration and ongoing AML compliance for UAE businesses. Fast onboarding, specialist support.',
    url: PATH,
    type: 'website',
  },
}

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
