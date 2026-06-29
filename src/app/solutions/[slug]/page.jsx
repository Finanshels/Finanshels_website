import { notFound } from 'next/navigation'
import { SERVICE_PAGES } from '@/content/service-pages'
import ServiceDetailPage from '../../../screens/services/ServiceDetailPage'
import { buildPageMetadata } from '@/lib/seo/servicePageMetadata'

// Server component so each solution gets a unique title + self-referential
// canonical. (Previously 'use client', which inherited the root layout's
// `canonical: '/'` and the homepage <title>.) Left dynamic on purpose — these
// share data with the top-level /<service>-uae routes, so we don't
// generateStaticParams them into competing static URLs.

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

export default async function ServiceRoute({ params }) {
  const { slug } = await params
  const page = SERVICE_PAGES[slug]
  if (!page) notFound()
  return <ServiceDetailPage page={page} />
}
