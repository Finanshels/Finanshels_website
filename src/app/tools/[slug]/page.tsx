import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowRight, Check, ChevronRight, Wrench } from 'lucide-react'
import { getSiteUrl } from '@/lib/cms/config'
import { getToolBySlug, resolveToolFaqs } from '@/lib/cms/toolsRepository'
import { sanitizeCmsHtml } from '@/lib/cms/sanitize'
import { buildBreadcrumbList } from '@/lib/seo/breadcrumbList'
import { safeJsonLd } from '@/lib/seo/safeJsonLd'
import { ToolWidgetMount } from '@/components/tools/ToolWidgetMount'
import { ToolFaqs } from '@/components/tools/ToolFaqs'
import type { Tool } from '@/lib/cms/schemas/tools'

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
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: tool.ogImage ? [tool.ogImage] : undefined,
    },
  }
}

/** Hero glyph: image URL, an emoji/short label, or a default branded icon. */
function ToolGlyph({ icon }: { icon?: string }) {
  const base =
    'flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-brand-primary ring-1 ring-brand-primary/15'
  if (icon && /^https?:\/\//.test(icon)) {
    return (
      <span className={base}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={icon} alt="" className="size-8 object-contain" />
      </span>
    )
  }
  if (icon && icon.trim().length > 0 && icon.trim().length <= 4) {
    return <span className={`${base} text-2xl`}>{icon.trim()}</span>
  }
  return (
    <span className={base}>
      <Wrench className="size-7" />
    </span>
  )
}

function buildJsonLd(tool: Tool, faqs: { question: string; answer: string }[]) {
  const site = getSiteUrl()
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'SoftwareApplication',
      name: tool.toolName,
      description: tool.shortDescription,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      url: `${site}/tools/${tool.slug}`,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'AED' },
    },
    buildBreadcrumbList([
      { name: 'Tools', path: '/tools' },
      { name: tool.toolName, path: `/tools/${tool.slug}` },
    ]),
  ]
  if (faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const tool = await getToolBySlug(slug)
  if (!tool) notFound()

  const faqs = await resolveToolFaqs(tool.faqRefs)
  const fullDescriptionHtml = tool.fullDescription ? sanitizeCmsHtml(tool.fullDescription) : ''
  const benefits = tool.benefits.slice(0, 6)
  const jsonLd = buildJsonLd(tool, faqs)

  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-brand-light via-white to-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-secondary/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-5xl px-4 pb-12 pt-28 sm:pb-16 sm:pt-32">
          <nav className="flex items-center gap-1.5 text-sm text-slate-500" aria-label="Breadcrumb">
            <Link href="/tools" className="transition hover:text-brand-primary">
              Tools
            </Link>
            <ChevronRight className="size-3.5 text-slate-400" />
            <span className="truncate text-slate-700">{tool.toolName}</span>
          </nav>

          <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-start">
            <ToolGlyph icon={tool.icon} />
            <div className="min-w-0 animate-fade-in">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">
                {tool.hubGroup} · Free tool
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                {tool.toolName}
              </h1>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate-600">
                {tool.shortDescription}
              </p>
            </div>
          </div>

          {benefits.length > 0 ? (
            <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                    <Check className="size-3.5" />
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      {/* Workbench — the interactive tool (or the launching-soon capture). */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
        <ToolWidgetMount
          toolRouteKey={tool.toolRouteKey}
          slug={tool.slug}
          gate={tool.gate}
          leadCaptureEnabled={tool.leadCaptureEnabled}
          gatedOutputLabel={tool.gatedOutputLabel}
          leadMagnetDescription={tool.leadMagnetDescription}
          serviceInterest={tool.serviceInterest}
        />
      </section>

      {/* About this tool */}
      {fullDescriptionHtml ? (
        <section className="mx-auto max-w-3xl px-4 pb-4">
          <h2 className="text-xl font-semibold text-slate-900">About this tool</h2>
          <div
            className="prose prose-slate mt-4 max-w-none prose-headings:font-semibold prose-a:text-brand-primary"
            dangerouslySetInnerHTML={{ __html: fullDescriptionHtml }}
          />
        </section>
      ) : null}

      {/* Service CTA */}
      {tool.relatedServiceUrl && tool.relatedServiceLabel ? (
        <section className="mx-auto max-w-5xl px-4 py-10">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-dark p-8 text-white sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-primary/20 blur-3xl"
            />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {tool.ctaHeadline || 'Want us to handle it for you?'}
                </h2>
                <p className="mt-2 max-w-md text-slate-300">
                  Our team manages this end-to-end so you can stay focused on growth.
                </p>
              </div>
              <Link
                href={tool.relatedServiceUrl}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white shadow-lg shadow-brand-primary/20 transition hover:bg-admin-brand-hover"
              >
                {tool.relatedServiceLabel}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      {faqs.length > 0 ? (
        <section className="mx-auto max-w-3xl px-4 py-10 sm:py-12">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Frequently asked questions
          </h2>
          <div className="mt-6">
            <ToolFaqs faqs={faqs} />
          </div>
        </section>
      ) : null}
    </main>
  )
}
