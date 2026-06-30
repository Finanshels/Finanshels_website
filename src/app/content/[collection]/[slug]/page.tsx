import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { ArticleBody } from '@/components/cms/ArticleBody'
import { PageBlocksRenderer } from '@/components/cms/PageBlocksRenderer'
import { FaqSection } from '@/components/cms/FaqSection'
import { htmlDirFromLanguage, htmlLangFromLanguage } from '@/lib/cms/textDirection'
import { getSiteUrl } from '@/lib/cms/config'
import {
  CMS_COLLECTION_DEFINITION_MAP,
  getCmsCollectionDefinition,
  type CmsCollectionKey,
} from '@/lib/cms/collectionDefinitions'
import { getCmsDocument } from '@/lib/cms/collectionRepository'
import { sanitizeCmsHtml } from '@/lib/cms/sanitize'
import { buildBreadcrumbList } from '@/lib/seo/breadcrumbList'
import { safeJsonLd } from '@/lib/seo/safeJsonLd'

type Props = {
  params: Promise<{ collection: string; slug: string }>
}

function resolveTitle(doc: Record<string, unknown>, fallback: string): string {
  return (typeof doc.seo_title === 'string' && doc.seo_title) ||
    (typeof doc.seoTitle === 'string' && doc.seoTitle) ||
    (typeof doc.title === 'string' && doc.title) ||
    (typeof doc.story_title === 'string' && doc.story_title) ||
    (typeof doc.webinar_title === 'string' && doc.webinar_title) ||
    (typeof doc.event_title === 'string' && doc.event_title) ||
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
          doc.event_title ??
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

type StoryTestimonial = { quote: string; name: string; role: string }

// Customer stories link testimonials via `testimonial_reference` (ids of
// customer_reviews docs). Resolve the first few to render real quotes inline.
async function resolveStoryTestimonials(doc: Record<string, unknown>): Promise<StoryTestimonial[]> {
  const refs = Array.isArray(doc.testimonial_reference) ? doc.testimonial_reference : []
  const out: StoryTestimonial[] = []
  for (const ref of refs.slice(0, 3)) {
    if (typeof ref !== 'string' || !ref) continue
    const review = await getCmsDocument('customer_reviews', ref)
    if (!review) continue
    const quote = String(review.review_text ?? review.quote ?? '').trim()
    if (!quote) continue
    out.push({
      quote,
      name: String(review.customer_name ?? review.reviewer_name ?? review.reviewerName ?? '').trim(),
      role: String(review.customer_designation ?? '').trim(),
    })
  }
  return out
}

function renderTemplate(
  collection: CmsCollectionKey,
  doc: Record<string, unknown>,
  extras: { storyTestimonials?: StoryTestimonial[] } = {}
) {
  const title = resolveTitle(doc, 'Untitled')
  if (collection === 'blog_posts') {
    const body = sanitizeCmsHtml(String(doc.body ?? doc.bodyHtml ?? ''))
    return (
      <article className="mx-auto max-w-3xl px-6 pb-16 pt-28 sm:px-10 sm:pt-32">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {doc.excerpt ? <p className="mt-4 text-lg text-slate-600">{String(doc.excerpt)}</p> : null}
        <div className="mt-8">
          <ArticleBody html={body} />
        </div>
      </article>
    )
  }

  if (collection === 'podcasts') {
    const art = typeof doc.featured_image === 'string' ? doc.featured_image.trim() : ''
    const podcastName = typeof doc.podcast_name === 'string' ? doc.podcast_name.trim() : ''
    const epNum = typeof doc.episode_number === 'number' ? doc.episode_number : Number(doc.episode_number)
    const duration = typeof doc.duration === 'string' ? doc.duration.trim() : ''
    const audioUrl = typeof doc.audio_url === 'string' ? doc.audio_url.trim() : ''
    const summary = typeof doc.episode_summary === 'string' ? doc.episode_summary.trim() : ''
    const showNotes = sanitizeCmsHtml(String(doc.show_notes ?? ''))
    const transcript = sanitizeCmsHtml(String(doc.transcript ?? ''))
    const topics = (Array.isArray(doc.key_topics) ? doc.key_topics : []).filter(
      (t): t is string => typeof t === 'string' && t.trim().length > 0
    )
    const meta = [podcastName, Number.isFinite(epNum) && epNum > 0 ? `Episode ${epNum}` : '', duration]
      .filter(Boolean)
      .join('  ·  ')
    return (
      <article className="mx-auto max-w-3xl px-6 pb-16 pt-28 sm:px-10 sm:pt-32">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {art ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={art} alt={title} className="h-32 w-32 shrink-0 rounded-2xl border border-slate-200 object-cover" />
          ) : null}
          <div>
            {meta ? <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#b3470a]">{meta}</p> : null}
            <h1 className="mt-2 text-balance text-4xl font-bold tracking-tight text-slate-900">{title}</h1>
          </div>
        </div>

        {summary ? <p className="mt-6 text-lg text-slate-600">{summary}</p> : null}

        {audioUrl ? (
          <audio controls preload="none" src={audioUrl} className="mt-8 w-full">
            Your browser does not support the audio element.
          </audio>
        ) : null}

        {topics.length ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {topics.map((t) => (
              <span key={t} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {showNotes ? (
          <div className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Show notes</h2>
            <div className="mt-4">
              <ArticleBody html={showNotes} />
            </div>
          </div>
        ) : null}

        {transcript ? (
          <details className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
            <summary className="cursor-pointer text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Transcript
            </summary>
            <div className="mt-4">
              <ArticleBody html={transcript} />
            </div>
          </details>
        ) : null}
      </article>
    )
  }

  // webinar-revamp (2026-06-28): the webinars branch is gone — webinars render on
  // the dedicated `/webinars/[slug]` route and the page component redirects there
  // before this helper runs.

  if (collection === 'faqs') {
    // FIX-048: title already shows the question (titleField=question on faqs).
    // Previously the branch re-printed `doc.question` under a "Question"
    // label, doubling the heading. The trailing topic_description /
    // description blocks read fields that don't exist on the faqs schema —
    // dead code, removed.
    return (
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-28 sm:px-10 sm:pt-32">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {doc.answer ? (
          <>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Answer</p>
            <p className="mt-2 whitespace-pre-wrap text-slate-700">{String(doc.answer)}</p>
          </>
        ) : null}
      </section>
    )
  }

  if (collection === 'customer_stories') {
    const heroImage = typeof doc.hero_image === 'string' ? doc.hero_image.trim() : ''
    const customer = typeof doc.customer === 'string' ? doc.customer.trim() : ''
    const industry = typeof doc.industry === 'string' ? doc.industry.trim() : ''
    const region = typeof doc.region === 'string' ? doc.region.trim() : ''
    const eyebrow = [customer, industry, region].filter(Boolean).join('  ·  ')
    const metrics = (Array.isArray(doc.metrics_highlights) ? doc.metrics_highlights : []).filter(
      (m): m is Record<string, unknown> => !!m && typeof m === 'object'
    )
    const services = (Array.isArray(doc.services_used) ? doc.services_used : []).filter(
      (s): s is string => typeof s === 'string' && s.trim().length > 0
    )
    const storyBody = sanitizeCmsHtml(String(doc.full_story_body ?? ''))
    const summaryCards: Array<[string, unknown]> = [
      ['Challenge', doc.challenge_summary ?? doc.challenge],
      ['Solution', doc.solution_summary ?? doc.solution],
      ['Results', doc.results_summary ?? doc.results],
    ]
    const testimonials = extras.storyTestimonials ?? []
    return (
      <article className="mx-auto max-w-4xl px-6 pb-16 pt-28 sm:px-10 sm:pt-32">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{eyebrow}</p> : null}
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {heroImage ? (
          // Reserve a 16:9 box so the hero doesn't shift layout as it loads
          // (CLS). Kept as a raw <img>, not next/image — heroImage is an
          // arbitrary CMS URL and next/image 500s on non-allowlisted hosts.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImage}
            alt={title}
            width={1200}
            height={675}
            className="mt-8 aspect-[16/9] w-full rounded-2xl border border-slate-200 object-cover"
          />
        ) : null}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {summaryCards.map(([label, value]) =>
            value ? (
              <div key={label} className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
                <p className="mt-2 text-sm text-slate-700">{String(value)}</p>
              </div>
            ) : null
          )}
        </div>
        {metrics.length ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {metrics.map((m, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
                <p className="text-3xl font-semibold tracking-tight text-slate-900">{String(m.value ?? '')}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{String(m.label ?? '')}</p>
              </div>
            ))}
          </div>
        ) : null}
        {storyBody ? <div className="mt-10"><ArticleBody html={storyBody} /></div> : null}
        {services.length ? (
          <div className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Services used</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {services.map((s) => (
                <span key={s} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">{s}</span>
              ))}
            </div>
          </div>
        ) : null}
        {testimonials.length ? (
          <div className="mt-10 space-y-4">
            {testimonials.map((t, i) => (
              <blockquote key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-lg text-slate-700">“{t.quote}”</p>
                {(t.name || t.role) ? (
                  <footer className="mt-3 text-sm font-medium text-slate-500">{[t.name, t.role].filter(Boolean).join(', ')}</footer>
                ) : null}
              </blockquote>
            ))}
          </div>
        ) : null}
      </article>
    )
  }

  if (collection === 'customer_reviews') {
    return (
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-28 sm:px-10 sm:pt-32">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {(doc.review_text || doc.quote) ? (
          <blockquote className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-lg text-slate-700">
            “{String(doc.review_text ?? doc.quote)}”
          </blockquote>
        ) : null}
      </section>
    )
  }

  // events (2026-06-30): MVP physical-event page. Renders the structured event
  // fields directly (NO <pre>JSON dump — that would leak every field, FIX-037).
  // A richer page (map embed, register form) is a follow-up; this is read-only.
  if (collection === 'events') {
    const banner = typeof doc.banner_image === 'string' ? doc.banner_image.trim() : ''
    const summary = typeof doc.summary === 'string' ? doc.summary.trim() : ''
    const description = sanitizeCmsHtml(String(doc.description ?? ''))
    const postRecap = sanitizeCmsHtml(String(doc.post_event_summary ?? ''))
    const venueName = typeof doc.venue_name === 'string' ? doc.venue_name.trim() : ''
    const venueAddress = typeof doc.venue_address === 'string' ? doc.venue_address.trim() : ''
    const venueMapUrl = typeof doc.venue_map_url === 'string' ? doc.venue_map_url.trim() : ''
    const city = typeof doc.city === 'string' ? doc.city.trim() : ''
    const recordingUrl = typeof doc.recording_url === 'string' ? doc.recording_url.trim() : ''
    const startRaw = typeof doc.start_datetime === 'string' ? doc.start_datetime.trim() : ''
    const locationLine = [venueName, city].filter(Boolean).join('  ·  ')
    const topics = (Array.isArray(doc.key_topics) ? doc.key_topics : []).filter(
      (t): t is string => typeof t === 'string' && t.trim().length > 0
    )
    return (
      <article className="mx-auto max-w-3xl px-6 pb-16 pt-28 sm:px-10 sm:pt-32">
        {banner ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={banner} alt={title} className="mb-8 w-full rounded-2xl border border-slate-200 object-cover" />
        ) : null}
        <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900">{title}</h1>
        {summary ? <p className="mt-4 text-lg text-slate-600">{summary}</p> : null}

        <dl className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700 sm:grid-cols-2">
          {startRaw ? (
            <div>
              <dt className="font-semibold uppercase tracking-[0.18em] text-slate-500">When</dt>
              <dd className="mt-1">{startRaw}</dd>
            </div>
          ) : null}
          {locationLine || venueAddress ? (
            <div>
              <dt className="font-semibold uppercase tracking-[0.18em] text-slate-500">Where</dt>
              <dd className="mt-1">
                {locationLine ? <span className="block">{locationLine}</span> : null}
                {venueAddress ? <span className="block whitespace-pre-wrap text-slate-600">{venueAddress}</span> : null}
                {venueMapUrl ? (
                  <a href={venueMapUrl} className="mt-1 inline-block font-medium text-[#b3470a] underline" target="_blank" rel="noopener noreferrer">
                    View on map
                  </a>
                ) : null}
              </dd>
            </div>
          ) : null}
        </dl>

        {description ? (
          <div className="mt-10">
            <ArticleBody html={description} />
          </div>
        ) : null}

        {topics.length ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {topics.map((t) => (
              <span key={t} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {recordingUrl ? (
          <p className="mt-10">
            <a href={recordingUrl} className="font-medium text-[#b3470a] underline" target="_blank" rel="noopener noreferrer">
              Watch the recap
            </a>
          </p>
        ) : null}

        {postRecap ? (
          <div className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Recap</h2>
            <div className="mt-4">
              <ArticleBody html={postRecap} />
            </div>
          </div>
        ) : null}
      </article>
    )
  }

  return (
    <section className="mx-auto max-w-4xl px-6 pb-16 pt-28 sm:px-10 sm:pt-32">
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
  // FIX-047: `robots_meta` is the canonical control. The legacy `noindex` /
  // `indexable` booleans are kept in the OR for pre-FIX-047 Firestore docs only.
  const noindex =
    (robotsMetaRaw && robotsMetaRaw.toLowerCase().includes('noindex')) ||
    doc.noindex === true ||
    doc.indexable === false ||
    // faq-trim (2026-06-28): FAQs are embed-only — the canonical surface is the
    // /faq hub (auto FAQPage schema) + service-page blocks. This generic page
    // exists only for admin preview, so keep individual thin FAQ URLs out of the
    // index rather than competing with the hub.
    collection === 'faqs'
  const ogImage =
    (typeof doc.og_image === 'string' && doc.og_image) ||
    (typeof doc.ogImageUrl === 'string' && doc.ogImageUrl) ||
    (typeof doc.card_image === 'string' && doc.card_image) ||
    (typeof doc.featured_image === 'string' && doc.featured_image) ||
    (typeof doc.hero_image === 'string' && doc.hero_image) ||
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

  // webinar-revamp (2026-06-28): webinars have a dedicated state-driven route at
  // `/webinars/[slug]`. Redirect the generic URL to the canonical one so there's
  // no duplicate-content page (and no bare JSON-ish fallback).
  if (collection === 'webinars') redirect(`/webinars/${slug}`)

  const doc = await getCmsDocument(definition.key, slug)
  if (!doc) notFound()
  // FIX-047: collapsed 6-state enum to 3. Only `published` renders publicly.
  // The `scheduled` time-windowed visibility branch is gone — scheduled
  // publishing has been removed from the workflow.
  const status = String(doc.status ?? 'draft')
  if (status !== 'published') notFound()

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
    'media_assets',
    // FIX-048: `tools` has no `renderTemplate` branch and no dedicated
    // `/tools/[slug]` route. Without this entry the generic content page
    // falls through to `<pre>JSON.stringify(doc)</pre>` and leaks the
    // entire Firestore document (including `tool_embed_code`).
    'tools',
    // glossary-trim (2026-06-28): glossary has a dedicated `/glossary/[slug]`
    // route — serving it here too was a duplicate-content URL. Refuse it here.
    'glossary_terms',
    // reviews-trim (2026-06-28): reviews are embedded testimonials only — no
    // standalone page. (The consent gate + Review JSON-LD above are kept as a
    // defense-in-depth safety net if a review page is ever re-enabled.)
    'customer_reviews',
  ])
  if (SENSITIVE_GENERIC_ROUTE_BLOCKLIST.has(collection)) {
    notFound()
  }

  // FIX-071: normalise the FAQ list once, then drive BOTH the visible accordion
  // and the FAQPage schema from it — no hidden-FAQ schema (black-hat SEO risk).
  const faqSectionItems = (Array.isArray(doc.faqItems) ? doc.faqItems : [])
    .filter(
      (item): item is { question: string; answer: string } =>
        Boolean(item) &&
        typeof item === 'object' &&
        typeof (item as Record<string, unknown>).question === 'string' &&
        typeof (item as Record<string, unknown>).answer === 'string' &&
        ((item as Record<string, unknown>).question as string).trim().length > 0
    )
    .map((item) => ({ question: item.question, answer: item.answer }))
  const faqSchema =
    faqSectionItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqSectionItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }
      : null

  const schemaType = resolveSchemaType(definition.key, doc)
  const canonical = resolveCanonical(definition.key, doc, slug)
  const baseSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: resolveTitle(doc, definition.singularLabel),
    description: resolveDescription(doc) || undefined,
    url: canonical,
  }

  // FIX-038: customer_reviews emit `Review` JSON-LD with datePublished + reviewRating.
  if (collection === 'customer_reviews') {
    baseSchema['@type'] = 'Review'
    const reviewDateRaw =
      (doc.review_date instanceof Date && doc.review_date) ||
      (typeof doc.review_date === 'string' && doc.review_date) ||
      (doc.publishedAt instanceof Date && doc.publishedAt) ||
      null
    if (reviewDateRaw) {
      baseSchema.datePublished =
        reviewDateRaw instanceof Date ? reviewDateRaw.toISOString().slice(0, 10) : String(reviewDateRaw).slice(0, 10)
    }
    const rating = typeof doc.rating === 'number' ? doc.rating : Number(doc.rating)
    if (Number.isFinite(rating) && rating > 0) {
      baseSchema.reviewRating = {
        '@type': 'Rating',
        ratingValue: rating,
        bestRating: 5,
      }
    }
    const reviewerName =
      (typeof doc.reviewer_name === 'string' && doc.reviewer_name) ||
      (typeof doc.reviewerName === 'string' && doc.reviewerName) ||
      ''
    if (reviewerName) {
      baseSchema.author = { '@type': 'Person', name: reviewerName }
    }
  }

  const blocks = Array.isArray(doc.page_blocks) ? doc.page_blocks : []

  const storyTestimonials =
    definition.key === 'customer_stories' ? await resolveStoryTestimonials(doc) : []

  const listingTrail = definition.listingRoute
    ? [{ name: definition.singularLabel, path: definition.listingRoute }]
    : []
  const breadcrumbLd = buildBreadcrumbList([
    ...listingTrail,
    { name: resolveTitle(doc, definition.singularLabel), path: canonical },
  ])

  // FIX-077: Arabic documents render right-to-left.
  const dir = htmlDirFromLanguage(doc.language)
  const lang = htmlLangFromLanguage(doc.language)

  return (
    <>
      <div dir={dir} lang={lang}>
        {renderTemplate(definition.key, doc, { storyTestimonials })}
        {blocks.length > 0 ? <PageBlocksRenderer blocks={blocks} /> : null}
        {/* FIX-071: render the FAQs that back the FAQPage schema below. */}
        {faqSectionItems.length > 0 ? (
          <div className="mx-auto max-w-3xl px-6 py-14 sm:px-10 lg:px-16">
            <FaqSection items={faqSectionItems} />
          </div>
        ) : null}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(baseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }} />
      {faqSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }} /> : null}
    </>
  )
}
