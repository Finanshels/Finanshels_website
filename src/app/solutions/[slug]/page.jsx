import { notFound } from 'next/navigation'
import { SERVICE_PAGES } from '@/content/service-pages'
import ServiceDetailPage from '../../../screens/services/ServiceDetailPage'
import { buildServiceMetadata } from '@/lib/seo/serviceMetadata'
import { ServiceJsonLd } from '@/components/seo/StructuredData'

// FIX-064: server component so each solution gets real metadata + Service/FAQ
// JSON-LD; notFound() replaces the soft-404 placeholder for unknown slugs.
export async function generateMetadata({ params }) {
  const { slug } = await params
  return buildServiceMetadata(SERVICE_PAGES[slug], `/solutions/${slug}`)
}

export default async function SolutionRoute({ params }) {
  const { slug } = await params
  const page = SERVICE_PAGES[slug]
  if (!page) notFound()
  return (
    <>
      <ServiceJsonLd page={page} path={`/solutions/${slug}`} />
      <ServiceDetailPage page={page} />
    </>
  )
}
