import { notFound } from 'next/navigation'
import { SERVICE_PAGES } from '@/content/service-pages'
import ServiceDetailPage from '../../../screens/services/ServiceDetailPage'
import { buildPageMetadata } from '@/lib/seo/servicePageMetadata'
import { ServiceJsonLd } from '@/components/seo/StructuredData'

// Server component so each solution gets a unique title + self-referential
// canonical (FIX-062) plus Service/FAQ/Breadcrumb JSON-LD (FIX-064). (Previously
// 'use client', which inherited the root layout's `canonical: '/'` and the
// homepage <title>.) Left dynamic on purpose — these share data with the
// top-level /<service>-uae routes, so we don't generateStaticParams them into
// competing static URLs.

export async function generateMetadata({ params }) {
  const { slug } = await params
  const page = SERVICE_PAGES[slug]
  if (!page) return {}
  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: `/solutions/${slug}`,
  })
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
