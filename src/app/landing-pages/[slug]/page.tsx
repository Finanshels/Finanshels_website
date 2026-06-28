import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DraftPreviewBanner } from '@/components/cms/DraftPreviewBanner'
import LandingPageRenderer from '@/components/landing-pages/LandingPageRenderer'
import { getCurrentSession, isAdminAuthenticated } from '@/lib/cms/adminAuth'
import { getLandingPageBySlug, listPublishedSlugs } from '@/lib/landing-pages/repository'

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

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata(
  { params, searchParams }: { params: Promise<{ slug: string }>; searchParams: SearchParams }
): Promise<Metadata> {
  const { slug } = await params
  // noindex preview pages: gate solely on the searchParam (a non-admin's normal
  // page never carries ?preview=1).
  const isPreviewRequest = (await searchParams).preview === '1'
  const page = await getLandingPageBySlug(slug, { preview: isPreviewRequest })
  if (!page) {
    return {
      title: 'Not found',
      robots: { index: false, follow: false },
    }
  }

  // Landing pages already default to noindex unless explicitly opted in, but be
  // explicit in preview mode for parity with the other routes.
  const allowIndexing = !isPreviewRequest && page.status === 'published' && page.seo.allow_indexing

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

function buildJsonLd(page: { seo: { title: string; description: string; allow_indexing: boolean }; internal_name: string; slug: string }, baseUrl: string): string | null {
  if (!page.seo.allow_indexing) return null
  const json = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.seo.title || page.internal_name,
    description: page.seo.description || undefined,
    url: `${baseUrl}/landing-pages/${page.slug}`,
    inLanguage: 'en',
  }
  return JSON.stringify(json)
}

export default async function LandingPagePublic(
  { params, searchParams }: { params: Promise<{ slug: string }>; searchParams: SearchParams }
) {
  const { slug } = await params
  const preview = (await searchParams).preview === '1' && (await isAdminAuthenticated())
  const page = await getLandingPageBySlug(slug, { preview })
  if (!page) notFound()

  // Admin draft preview (?preview=1): render the working draft of any status
  // with the not-live banner. noindex is set in generateMetadata.
  if (preview) {
    return (
      <>
        <DraftPreviewBanner />
        <LandingPageRenderer page={page} isPreview />
      </>
    )
  }

  if (page.status !== 'published') {
    const session = await getCurrentSession()
    if (!session) notFound()
    return <LandingPageRenderer page={page} isPreview />
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://finanshels.com'
  const jsonLd = buildJsonLd(page, baseUrl)

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      ) : null}
      <LandingPageRenderer page={page} />
    </>
  )
}
