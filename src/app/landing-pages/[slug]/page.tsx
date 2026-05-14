import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LandingPageRenderer from '@/components/landingPages/LandingPageRenderer'
import { getCurrentSession } from '@/lib/cms/adminAuth'
import { getLandingPageBySlug, listPublishedSlugs } from '@/lib/landingPages/repository'

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const slugs = await listPublishedSlugs()
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = await getLandingPageBySlug(slug)
  if (!page) {
    return {
      title: 'Not found',
      robots: { index: false, follow: false },
    }
  }

  const allowIndexing = page.status === 'published' && page.seo.allow_indexing

  return {
    title: page.seo.title || page.internal_name,
    description: page.seo.description || undefined,
    robots: allowIndexing
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
    alternates: page.seo.canonical_url ? { canonical: page.seo.canonical_url } : undefined,
    openGraph: {
      title: page.seo.title || page.internal_name,
      description: page.seo.description || undefined,
      images: page.seo.og_image_url ? [{ url: page.seo.og_image_url }] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.seo.title || page.internal_name,
      description: page.seo.description || undefined,
      images: page.seo.og_image_url ? [page.seo.og_image_url] : undefined,
    },
  }
}

export default async function LandingPagePublic({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getLandingPageBySlug(slug)
  if (!page) notFound()

  if (page.status !== 'published') {
    const session = await getCurrentSession()
    if (!session) notFound()
    return <LandingPageRenderer page={page} isPreview />
  }

  return <LandingPageRenderer page={page} />
}
