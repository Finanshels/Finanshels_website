import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/cms/config'
import { getToolBySlug } from '@/lib/cms/toolsRepository'
import { safeJsonLd } from '@/lib/seo/safeJsonLd'
import { getToolWidget } from '@/components/tools/registry'

export const revalidate = 600

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = await getToolBySlug(slug)
  if (!tool) return { title: 'Tools' }

  const title = tool.seoTitle || `${tool.toolName} | Finanshels`
  const description = tool.metaDescription || tool.shortDescription
  const url = tool.canonicalUrl || `${getSiteUrl()}/tools/${tool.slug}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: tool.ogImage ? [tool.ogImage] : undefined,
    },
  }
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const tool = await getToolBySlug(slug)
  if (!tool) notFound()

  const Widget = getToolWidget(tool.toolRouteKey)
  const site = getSiteUrl()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.toolName,
    description: tool.shortDescription,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: `${site}/tools/${tool.slug}`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'AED' },
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <nav className="text-sm text-slate-500">
        <Link href="/tools" className="hover:text-[#f16610]">Tools</Link>
        <span className="mx-2">›</span>
        <span className="text-slate-700">{tool.toolName}</span>
      </nav>

      <header className="mt-4">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{tool.toolName}</h1>
        <p className="mt-2 max-w-2xl text-lg text-slate-600">{tool.shortDescription}</p>
      </header>

      <section className="mt-8">
        {Widget ? (
          <Widget
            slug={tool.slug}
            gate={tool.gate}
            leadCaptureEnabled={tool.leadCaptureEnabled}
            gatedOutputLabel={tool.gatedOutputLabel}
            leadMagnetDescription={tool.leadMagnetDescription}
            serviceInterest={tool.serviceInterest}
          />
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            This tool is launching soon.
          </div>
        )}
      </section>

      {tool.relatedServiceUrl && tool.relatedServiceLabel ? (
        <section className="mt-8 rounded-2xl bg-slate-900 p-6 text-white">
          <p className="text-lg font-semibold">{tool.ctaHeadline || 'Want us to handle it?'}</p>
          <Link
            href={tool.relatedServiceUrl}
            className="mt-3 inline-block rounded-lg bg-[#f16610] px-5 py-2.5 font-semibold"
          >
            {tool.relatedServiceLabel}
          </Link>
        </section>
      ) : null}

      {tool.benefits.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900">Why use this</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {tool.benefits.map((b, i) => (
              <li key={i} className="rounded-xl border border-slate-200 bg-white p-4 text-slate-700">{b}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  )
}
