import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/cms/config'
import { listPublishedTools } from '@/lib/cms/toolsRepository'
import { safeJsonLd } from '@/lib/seo/safeJsonLd'
import { ToolsHubGrid, type HubTool } from '@/components/tools/ToolsHubGrid'

export const revalidate = 600

const HUB_TITLE = 'Free Finance & Tax Tools | Finanshels'
const HUB_DESCRIPTION =
  'Free UAE finance and tax tools — VAT calculator, gratuity calculator, corporate tax deadline checker, and more.'

export const metadata: Metadata = {
  title: HUB_TITLE,
  description: HUB_DESCRIPTION,
  alternates: { canonical: `${getSiteUrl()}/tools` },
  openGraph: {
    title: HUB_TITLE,
    description: HUB_DESCRIPTION,
    url: `${getSiteUrl()}/tools`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: HUB_TITLE,
    description: HUB_DESCRIPTION,
  },
}

export default async function ToolsHubPage() {
  const tools = await listPublishedTools()
  const site = getSiteUrl()

  const hubTools: HubTool[] = tools.map((t) => ({
    slug: t.slug,
    toolName: t.toolName,
    cardDescription: t.cardDescription || t.shortDescription,
    hubGroup: t.hubGroup,
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: tools.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.toolName,
      url: `${site}/tools/${t.slug}`,
    })),
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <header>
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Free finance & tax tools</h1>
        <p className="mt-2 max-w-2xl text-lg text-slate-600">
          Run the numbers in seconds. Built for UAE businesses by Finanshels.
        </p>
      </header>
      <div className="mt-8">
        {hubTools.length > 0 ? (
          <ToolsHubGrid tools={hubTools} />
        ) : (
          <p className="text-slate-500">Tools are coming soon.</p>
        )}
      </div>
    </main>
  )
}
