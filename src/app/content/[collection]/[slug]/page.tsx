import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleBody } from '@/components/cms/ArticleBody'
import { PageBlocksRenderer } from '@/components/cms/PageBlocksRenderer'
import { getSiteUrl } from '@/lib/cms/config'
import {
  CMS_COLLECTION_DEFINITION_MAP,
  getCmsCollectionDefinition,
  type CmsCollectionKey,
} from '@/lib/cms/collectionDefinitions'
import { getCmsDocument } from '@/lib/cms/collectionRepository'
import { sanitizeCmsHtml } from '@/lib/cms/sanitize'

type Props = {
  params: Promise<{ collection: string; slug: string }>
}

function resolveTitle(doc: Record<string, unknown>, fallback: string): string {
  return (typeof doc.seo_title === 'string' && doc.seo_title) ||
    (typeof doc.seoTitle === 'string' && doc.seoTitle) ||
    (typeof doc.title === 'string' && doc.title) ||
    (typeof doc.story_title === 'string' && doc.story_title) ||
    (typeof doc.webinar_title === 'string' && doc.webinar_title) ||
    (typeof doc.ebook_title === 'string' && doc.ebook_title) ||
    (typeof doc.episode_title === 'string' && doc.episode_title) ||
    (typeof doc.topic_name === 'string' && doc.topic_name) ||
    (typeof doc.tool_name === 'string' && doc.tool_name) ||
    (typeof doc.company_name === 'string' && doc.company_name) ||
    (typeof doc.review_title === 'string' && doc.review_title) ||
    (typeof doc.full_name === 'string' && doc.full_name) ||
    (typeof doc.term === 'string' && doc.term) ||
    (typeof doc.question === 'string' && doc.question)
    ? String(
        doc.seo_title ??
          doc.seoTitle ??
          doc.title ??
          doc.story_title ??
          doc.webinar_title ??
          doc.ebook_title ??
          doc.episode_title ??
          doc.topic_name ??
          doc.tool_name ??
          doc.company_name ??
          doc.review_title ??
          doc.full_name ??
          doc.term ??
          doc.question
      )
    : fallback
}

function resolveDescription(doc: Record<string, unknown>): string {
  // Snake_case canonicals first; legacy camelCase fallbacks for unmigrated docs.
  const source =
    (typeof doc.meta_description === 'string' && doc.meta_description) ||
    (typeof doc.seoDescription === 'string' && doc.seoDescription) ||
    (typeof doc.card_description === 'string' && doc.card_description) ||
    (typeof doc.excerpt === 'string' && doc.excerpt) ||
    (typeof doc.short_description === 'string' && doc.short_description) ||
    (typeof doc.summary === 'string' && doc.summary) ||
    (typeof doc.definition_short === 'string' && doc.definition_short) ||
    (typeof doc.definition === 'string' && doc.definition) ||
    ''
  return source ? String(source).replace(/<[^>]+>/g, '').slice(0, 170) : ''
}

function resolveSchemaType(collection: CmsCollectionKey, doc: Record<string, unknown>): string {
  const override = typeof doc.schema_type_override === 'string' ? doc.schema_type_override.trim() : ''
  if (override) return override
  const explicit = typeof doc.schema_type === 'string' ? doc.schema_type.trim() : ''
  if (explicit) return explicit
  return CMS_COLLECTION_DEFINITION_MAP[collection]?.defaultSchemaType ?? 'WebPage'
}

function resolveCanonical(collection: CmsCollectionKey, doc: Record<string, unknown>, slug: string): string {
  const explicit =
    (typeof doc.canonicalUrl === 'string' && doc.canonicalUrl.trim()) ||
    (typeof doc.canonical_url === 'string' && doc.canonical_url.trim()) ||
    ''
  if (explicit) return explicit
  const def = CMS_COLLECTION_DEFINITION_MAP[collection]
  const site = getSiteUrl()
  if (def?.routePattern) return `${site}${def.routePattern.replace('[slug]', slug)}`
  return `${site}/content/${collection}/${slug}`
}

function renderTemplate(collection: CmsCollectionKey, doc: Record<string, unknown>) {
  const title = resolveTitle(doc, 'Untitled')
  if (collection === 'blog_posts') {
    const body = sanitizeCmsHtml(String(doc.body ?? doc.bodyHtml ?? ''))
    return (
      <article className="mx-auto max-w-3xl px-6 py-16 sm:px-10">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {doc.excerpt ? <p className="mt-4 text-lg text-slate-600">{String(doc.excerpt)}</p> : null}
        <div className="mt-8">
          <ArticleBody html={body} />
        </div>
      </article>
    )
  }

  if (collection === 'glossary_terms') {
    const definition = sanitizeCmsHtml(String(doc.definition_short ?? doc.definition ?? ''))
    const body = sanitizeCmsHtml(String(doc.definition_full ?? doc.body ?? doc.bodyHtml ?? ''))
    return (
      <article className="mx-auto max-w-3xl px-6 py-16 sm:px-10">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-[#fffaf6] p-5">
          <ArticleBody html={definition} className="prose-base" />
        </div>
        {body ? (
          <div className="mt-8">
            <ArticleBody html={body} />
          </div>
        ) : null}
      </article>
    )
  }

  if (collection === 'videos' || collection === 'podcasts' || collection === 'webinars') {
    return (
      <section className="mx-auto max-w-4xl px-6 py-16 sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">{collection.replace('_', ' ')}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {(doc.summary || doc.episode_summary || doc.short_description) ? (
          <p className="mt-4 text-lg text-slate-600">{String(doc.summary ?? doc.episode_summary ?? doc.short_description)}</p>
        ) : null}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          {(doc.video_url || doc.videoUrl) ? <p className="text-sm text-slate-700">Video URL: {String(doc.video_url ?? doc.videoUrl)}</p> : null}
          {(doc.audio_url || doc.audioUrl) ? <p className="text-sm text-slate-700">Audio URL: {String(doc.audio_url ?? doc.audioUrl)}</p> : null}
          {(doc.registration_url || doc.registrationUrl) ? <p className="text-sm text-slate-700">Registration: {String(doc.registration_url ?? doc.registrationUrl)}</p> : null}
        </div>
      </section>
    )
  }

  if (collection === 'faq_questions' || collection === 'faq_topics') {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16 sm:px-10">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {doc.question ? <p className="mt-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Question</p> : null}
        {doc.question ? <p className="mt-2 text-lg text-slate-800">{String(doc.question)}</p> : null}
        {doc.answer ? (
          <>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Answer</p>
            <p className="mt-2 whitespace-pre-wrap text-slate-700">{String(doc.answer)}</p>
          </>
        ) : null}
        {(doc.topic_description || doc.description) ? (
          <p className="mt-6 whitespace-pre-wrap text-slate-700">{String(doc.topic_description ?? doc.description)}</p>
        ) : null}
      </section>
    )
  }

  if (collection === 'customer_stories' || collection === 'customer_reviews') {
    return (
      <section className="mx-auto max-w-4xl px-6 py-16 sm:px-10">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {(doc.review_text || doc.quote) ? (
          <blockquote className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-lg text-slate-700">
            “{String(doc.review_text ?? doc.quote)}”
          </blockquote>
        ) : null}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {(doc.challenge_summary || doc.challenge) ? <div className="rounded-xl border border-slate-200 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Challenge</p><p className="mt-2 text-sm text-slate-700">{String(doc.challenge_summary ?? doc.challenge)}</p></div> : null}
          {(doc.solution_summary || doc.solution) ? <div className="rounded-xl border border-slate-200 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Solution</p><p className="mt-2 text-sm text-slate-700">{String(doc.solution_summary ?? doc.solution)}</p></div> : null}
          {(doc.results_summary || doc.results) ? <div className="rounded-xl border border-slate-200 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Results</p><p className="mt-2 text-sm text-slate-700">{String(doc.results_summary ?? doc.results)}</p></div> : null}
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 sm:px-10">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900">{title}</h1>
      {resolveDescription(doc) ? <p className="mt-4 text-lg text-slate-600">{resolveDescription(doc)}</p> : null}
      <pre className="mt-8 overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
        {JSON.stringify(doc, null, 2)}
      </pre>
    </section>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection, slug } = await params
  const definition = getCmsCollectionDefinition(collection)
  if (!definition) return { title: 'Content' }

  const doc = await getCmsDocument(definition.key, slug)
  if (!doc) return { title: 'Content' }

  const title = resolveTitle(doc, `${definition.singularLabel} | Finanshels`)
  const description = resolveDescription(doc)
  const canonical = resolveCanonical(definition.key, doc, slug)
  // FIX-025 + FIX-004: read snake_case canonicals; legacy camelCase fallbacks
  // remain in place for any pre-migration documents in Firestore.
  const robotsMetaRaw =
    (typeof doc.robots_meta === 'string' && doc.robots_meta) ||
    (typeof doc.robotsMeta === 'string' && doc.robotsMeta) ||
    ''
  const noindex =
    doc.noindex === true ||
    (robotsMetaRaw && robotsMetaRaw.toLowerCase().includes('noindex')) ||
    doc.indexable === false
  const ogImage =
    (typeof doc.og_image === 'string' && doc.og_image) ||
    (typeof doc.ogImageUrl === 'string' && doc.ogImageUrl) ||
    (typeof doc.card_image === 'string' && doc.card_image) ||
    (typeof doc.featured_image === 'string' && doc.featured_image) ||
    (typeof doc.heroImageUrl === 'string' && doc.heroImageUrl) ||
    null

  // FIX-004: prefer the editor-supplied OG/Twitter overrides when set; fall back
  // to page title/description.
  const ogTitle =
    (typeof doc.og_title === 'string' && doc.og_title.trim()) ||
    (typeof doc.ogTitle === 'string' && doc.ogTitle.trim()) ||
    title
  const ogDescription =
    (typeof doc.og_description === 'string' && doc.og_description.trim()) ||
    (typeof doc.ogDescription === 'string' && doc.ogDescription.trim()) ||
    description ||
    undefined
  const twitterCard =
    (typeof doc.twitter_card_type === 'string' && doc.twitter_card_type) ||
    (typeof doc.twitterCardType === 'string' && doc.twitterCardType) ||
    'summary_large_image'
  const twitterCreator =
    (typeof doc.twitter_creator_handle === 'string' && doc.twitter_creator_handle) ||
    (typeof doc.twitterCreatorHandle === 'string' && doc.twitterCreatorHandle) ||
    undefined

  return {
    title,
    description: description || undefined,
    alternates: { canonical },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      type: 'article',
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: (twitterCard as 'summary_large_image' | 'summary' | 'app' | 'player') || 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
      creator: twitterCreator,
    },
  }
}

export default async function CmsCollectionContentPage({ params }: Props) {
  const { collection, slug } = await params
  const definition = getCmsCollectionDefinition(collection)
  if (!definition) notFound()

  const doc = await getCmsDocument(definition.key, slug)
  if (!doc) notFound()
  const status = String(doc.status ?? 'draft')
  const scheduledAt = doc.scheduledAt instanceof Date ? doc.scheduledAt : null
  const now = new Date()
  const isVisible =
    status === 'published' ||
    (status === 'scheduled' && scheduledAt !== null && Number.isFinite(scheduledAt.getTime()) && scheduledAt <= now)
  if (!isVisible) notFound()

  // FIX-003: customer_reviews require explicit signed consent before going
  // public. Without this gate, status=published alone bypasses approval —
  // compliance risk (PDPL/GDPR for testimonials with attributable PII).
  if (collection === 'customer_reviews' && doc.approved_for_publication !== true) {
    notFound()
  }

  // FIX-037: collections that have NO dedicated render branch on this generic
  // route would otherwise fall through to the <pre>JSON.stringify(doc)</pre>
  // fallback below, dumping every field — including ebook download URLs,
  // team-member email/phone PII, raw customer records, and review-source
  // backlinks. These collections must be served from dedicated routes (or not
  // at all on the public site); the generic route refuses them entirely.
  const SENSITIVE_GENERIC_ROUTE_BLOCKLIST = new Set([
    'ebooks',
    'team_members',
    'our_customers',
    'review_sources',
    'media_assets',
  ])
  if (SENSITIVE_GENERIC_ROUTE_BLOCKLIST.has(collection)) {
    notFound()
  }

  const faqItems = Array.isArray(doc.faqItems) ? doc.faqItems : []
  const faqSchema =
    faqItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems
            .filter((item) => item && typeof item === 'object')
            .map((item) => ({
              '@type': 'Question',
              name: String((item as Record<string, unknown>).question ?? ''),
              acceptedAnswer: {
                '@type': 'Answer',
                text: String((item as Record<string, unknown>).answer ?? ''),
              },
            })),
        }
      : null

  const schemaType = resolveSchemaType(definition.key, doc)
  const canonical = resolveCanonical(definition.key, doc, slug)
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: resolveTitle(doc, definition.singularLabel),
    description: resolveDescription(doc) || undefined,
    url: canonical,
  }

  const blocks = Array.isArray(doc.page_blocks) ? doc.page_blocks : []

  return (
    <>
      {renderTemplate(definition.key, doc)}
      {blocks.length > 0 ? <PageBlocksRenderer blocks={blocks} /> : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(baseSchema) }} />
      {faqSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /> : null}
    </>
  )
}
