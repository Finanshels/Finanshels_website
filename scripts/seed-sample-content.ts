// One-off seed: writes one fully-populated published document for EVERY CMS
// collection (except blog_posts, which has its own scripts/seed-sample-blog.ts)
// so the admin editor and the public routes can be tested end to end.
//
// Run with:
//   npm run seed:content
//   (or)  node --conditions=react-server --import tsx scripts/seed-sample-content.ts
//
// `--conditions=react-server` makes `import 'server-only'` a no-op so the
// repository modules import in a plain Node run — same trick the importer uses.
//
// Docs are written in dependency order so cross-collection references resolve:
//   team_members -> faqs -> tools -> customer_reviews ->
//   glossary_terms -> podcasts -> ebooks -> webinars -> customer_stories ->
//   media_assets
//
// Re-running is safe: document id == slug, so every write upserts in place.

import { readFileSync } from 'node:fs'

function loadEnvLocal(): void {
  try {
    const txt = readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    for (const rawLine of txt.split(/\r?\n/)) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const eq = line.indexOf('=')
      if (eq === -1) continue
      const key = line.slice(0, eq).trim()
      let value = line.slice(eq + 1).trim()
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      if (!process.env[key]) process.env[key] = value
    }
  } catch (err) {
    process.stderr.write(`[warn] could not read .env.local: ${(err as Error).message}\n`)
  }
}

// Slugs are referenced across collections — keep them in one place.
const SLUGS = {
  blog: 'uae-corporate-tax-checklist-for-founders', // seeded by seed-sample-blog.ts
  team: 'aisha-rahman',
  faq: 'do-free-zone-companies-pay-corporate-tax',
  tool: 'corporate-tax-estimator',
  review: 'acme-trading-corporate-tax-review',
  glossary: 'corporate-tax',
  podcast: 'ep-12-uae-corporate-tax-explained',
  ebook: 'uae-corporate-tax-starter-guide',
  webinar: 'corporate-tax-readiness-2026',
  story: 'acme-trading-cut-compliance-time-60-percent',
  media: 'sample-blog-cover',
} as const

const ALLOWED_IMAGE_HOSTS = new Set(['firebasestorage.googleapis.com', 'storage.googleapis.com'])

function isRenderableImageUrl(value: unknown): value is string {
  if (typeof value !== 'string' || !value.startsWith('https://')) return false
  try {
    return ALLOWED_IMAGE_HOSTS.has(new URL(value).hostname)
  } catch {
    return false
  }
}

function readImageUrl(value: unknown): string | null {
  if (isRenderableImageUrl(value)) return value
  if (value && typeof value === 'object') {
    const url = (value as Record<string, unknown>).url
    if (isRenderableImageUrl(url)) return url
  }
  return null
}

/** SEO/AEO/GEO signals shared by every routed doc so JSON-LD + snippets work. */
function signals(opts: {
  title: string
  description: string
  keyword: string
  schemaType: string
  directAnswer?: string
  faqItems?: Array<{ question: string; answer: string }>
  geoSummary?: string
  geoContentType?: 'evergreen' | 'news' | 'guide' | 'comparison' | 'analysis'
}): Record<string, unknown> {
  return {
    focus_keyword: opts.keyword,
    seo_title: `${opts.title} | Finanshels`,
    meta_description: opts.description.slice(0, 160),
    og_title: opts.title,
    og_description: opts.description.slice(0, 200),
    twitter_card_type: 'summary_large_image',
    robots_meta: 'index,follow',
    schema_type: opts.schemaType,
    ...(opts.directAnswer ? { directAnswer: opts.directAnswer } : {}),
    ...(opts.faqItems ? { faqItems: opts.faqItems } : {}),
    ...(opts.geoSummary ? { geoSummary: opts.geoSummary } : {}),
    ...(opts.geoContentType ? { geoContentType: opts.geoContentType } : {}),
  }
}

async function main(): Promise<void> {
  loadEnvLocal()

  const { getDb } = await import('../src/lib/cms/firestore')
  const { upsertCmsDocument } = await import('../src/lib/cms/collectionRepository')

  const db = getDb()
  if (!db) throw new Error('CMS is not configured — check FIREBASE_ADMIN_* env vars in .env.local')

  // Resolve one whitelisted image URL from existing media/team and reuse it
  // everywhere an image/logo/photo/cover is needed.
  let imageUrl: string | null = null
  for (const col of ['media_assets', 'team_members', 'blog_posts'] as const) {
    if (imageUrl) break
    const snap = await db.collection(col).limit(10).get()
    for (const doc of snap.docs) {
      const d = doc.data() as Record<string, unknown>
      const found =
        readImageUrl(d.url) ?? readImageUrl(d.assetUrl) ?? readImageUrl(d.photo) ??
        readImageUrl(d.featured_image) ?? readImageUrl(d.logo) ?? readImageUrl(d.cover_image)
      if (found) { imageUrl = found; break }
    }
  }
  const IMG = imageUrl ?? ''
  process.stdout.write(IMG ? `  image -> ${IMG}\n` : '  no whitelisted image found — image fields left blank\n\n')

  const now = new Date('2026-06-25T10:00:00.000Z')
  const save = (collection: string, slug: string, data: Record<string, unknown>) =>
    upsertCmsDocument(collection as never, slug, { ...data, slug, status: 'published', language: 'en' }, 'seed-sample-content')

  // ---------------------------------------------------------------- 1. team
  await save('team_members', SLUGS.team, {
    full_name: 'Aisha Rahman',
    photo: IMG,
    job_title: 'Senior Tax Advisor',
    department: 'Taxation',
    short_bio: 'Aisha helps UAE founders register for corporate tax, structure free-zone income, and file on time.',
    full_bio:
      'Aisha Rahman is a Senior Tax Advisor at Finanshels with over a decade of experience in UAE and GCC taxation. She specializes in corporate tax registration, free-zone qualifying income, and transfer pricing for SMEs and high-growth startups.',
    email: 'aisha.rahman@example.com',
    phone: '+971-50-000-0000',
    linkedin_url: 'https://www.linkedin.com/company/finanshels',
    twitter_url: 'https://twitter.com/finanshels',
    website_url: 'https://www.finanshels.com',
    expertise_tags: ['corporate-tax', 'free-zone', 'transfer-pricing', 'vat'],
    sort_order: 1,
  })
  process.stdout.write(`  ✓ team_members/${SLUGS.team}\n`)

  // ----------------------------------------------------------------- 3. faq
  await save('faqs', SLUGS.faq, {
    question: 'Do free-zone companies pay corporate tax in the UAE?',
    answer:
      'A Qualifying Free Zone Person can keep a 0% corporate tax rate on qualifying income if it meets all the conditions, including adequate substance and audited financials. Non-qualifying income is taxed at the standard 9% rate. Every free-zone company must still register for corporate tax and file a return.',
    topic: 'Corporate Tax',
    topic_slug: 'corporate-tax',
    related_service: ['corporate-tax', 'free-zone'],
    related_blog_posts: [SLUGS.blog],
    related_tools: [SLUGS.tool],
    search_keywords: ['free zone corporate tax', 'qualifying income', '0% rate uae'],
    featured: true,
    sort_order: 1,
    ...signals({
      title: 'Do free-zone companies pay UAE corporate tax?',
      description: 'A Qualifying Free Zone Person can keep a 0% rate on qualifying income; non-qualifying income is taxed at 9%. Registration is always required.',
      keyword: 'free zone corporate tax uae',
      schemaType: 'Question',
    }),
  })
  process.stdout.write(`  ✓ faqs/${SLUGS.faq}\n`)

  // ---------------------------------------------------------------- 4. tool
  await save('tools', SLUGS.tool, {
    tool_name: 'UAE Corporate Tax Estimator',
    tool_type: 'estimator',
    short_description: 'Estimate your UAE corporate tax in under a minute based on your taxable income.',
    full_description:
      'The Corporate Tax Estimator applies the 0% rate up to AED 375,000 and 9% above it, factoring in Small Business Relief eligibility, to give founders a quick read on their likely liability.',
    icon: 'calculator',
    hero_image: IMG,
    tool_embed_type: 'custom_component',
    tool_route_key: 'corporate-tax-estimator',
    primary_inputs: [
      { name: 'taxableIncome', label: 'Taxable income (AED)', type: 'number' },
      { name: 'isFreeZone', label: 'Free-zone company?', type: 'boolean' },
    ],
    output_description: 'Estimated annual corporate tax in AED, plus your effective rate.',
    benefits: ['Instant estimate', 'No sign-up required', 'Accounts for Small Business Relief'],
    related_services: ['corporate-tax', 'advisory'],
    faq_items: [SLUGS.faq],
    gated: false,
    lead_capture_enabled: true,
    ...signals({
      title: 'UAE Corporate Tax Estimator',
      description: 'Estimate your UAE corporate tax in under a minute. Applies the 0% threshold, 9% rate, and Small Business Relief.',
      keyword: 'uae corporate tax calculator',
      schemaType: 'SoftwareApplication',
    }),
  })
  process.stdout.write(`  ✓ tools/${SLUGS.tool}\n`)

  // -------------------------------------------------------------- 5. review
  await save('customer_reviews', SLUGS.review, {
    review_title: 'Finanshels made our first corporate tax filing painless',
    customer_name: 'Omar Haddad',
    customer_designation: 'Founder & CEO, Acme Trading LLC',
    company: 'Acme Trading LLC',
    rating: 5,
    review_text:
      'We were dreading our first UAE corporate tax filing. Finanshels handled registration, cleaned up a year of bookkeeping, and filed well ahead of the deadline. We finally have numbers we trust.',
    customer_photo: IMG,
    service_category: ['corporate-tax', 'bookkeeping'],
    industry: ['retail'],
    location: 'Dubai, UAE',
    review_date: new Date('2026-05-30T00:00:00.000Z'),
    approved_for_publication: true, // REQUIRED — public route gates on this
    featured: true,
    reviewer_name: 'Omar Haddad',
    ...signals({
      title: 'Finanshels made our first corporate tax filing painless',
      description: 'Acme Trading LLC on registering, cleaning up bookkeeping, and filing UAE corporate tax ahead of deadline with Finanshels.',
      keyword: 'finanshels review corporate tax',
      schemaType: 'Review',
    }),
  })
  process.stdout.write(`  ✓ customer_reviews/${SLUGS.review}\n`)

  // ------------------------------------------------------------ 6. glossary
  // NOTE: the glossary Zod schema REQUIRES a non-empty `definition` field, but
  // the editor field is `definition_short`. We set `definition` too so the
  // public /glossary/[slug] route parses and renders instead of 404-ing.
  const glossaryShort =
    'Corporate tax is a direct tax on the net income or profit of corporations and other businesses. In the UAE it applies at 9% on taxable income above AED 375,000.'
  await save('glossary_terms', SLUGS.glossary, {
    term: 'Corporate Tax',
    definition_short: glossaryShort,
    definition: glossaryShort, // satisfies required schema field
    definition_full:
      '<p>Corporate tax (also called corporate income tax or business profits tax) is a direct tax levied on the net profit of companies. The UAE introduced a federal corporate tax effective for financial years starting on or after 1 June 2023.</p><p>The headline rate is <strong>9%</strong> on taxable income above <strong>AED 375,000</strong>, with a 0% band below that threshold. Qualifying Free Zone Persons may retain a 0% rate on qualifying income.</p>',
    term_category: 'Taxation',
    alphabet_letter: 'C',
    synonyms: ['corporate income tax', 'business profits tax', 'CIT'],
    faq_items: [SLUGS.faq],
    example_usage: 'After registering, the company calculated its corporate tax on profits above the AED 375,000 threshold.',
    applicability_region: ['UAE'],
    featured: true,
    canonical_url: `https://www.finanshels.com/glossary/${SLUGS.glossary}`,
    ...signals({
      title: 'Corporate Tax — Definition',
      description: glossaryShort,
      keyword: 'corporate tax definition uae',
      schemaType: 'DefinedTerm',
      faqItems: [
        { question: 'What is the UAE corporate tax rate?', answer: '9% on taxable income above AED 375,000; 0% below it.' },
      ],
    }),
  })
  process.stdout.write(`  ✓ glossary_terms/${SLUGS.glossary}\n`)

  // ------------------------------------------------------------- 7. podcast
  await save('podcasts', SLUGS.podcast, {
    episode_title: 'UAE Corporate Tax, Explained for Founders',
    episode_number: 12,
    podcast_name: 'The Finanshels Finance Podcast',
    audio_url: 'https://example.com/audio/ep-12.mp3',
    thumbnail_image: IMG,
    duration: '38:24',
    publish_date: new Date('2026-06-10T00:00:00.000Z'),
    hosts: [SLUGS.team],
    guests: ['Omar Haddad'],
    episode_summary: 'A plain-English walk through UAE corporate tax: who registers, the 9% rate, free-zone income, and the nine-month filing rule.',
    show_notes:
      '<p>In this episode we cover registration deadlines, Small Business Relief, and the most common filing mistakes founders make.</p><ul><li>02:10 — Who is in scope</li><li>14:30 — Free-zone qualifying income</li><li>27:05 — Filing and record-keeping</li></ul>',
    transcript: 'Host: Welcome back to the Finanshels Finance Podcast. Today we are demystifying UAE corporate tax...',
    key_topics: ['corporate-tax', 'free-zone', 'compliance'],
    related_resources: [SLUGS.blog],
    ...signals({
      title: 'UAE Corporate Tax, Explained for Founders',
      description: 'A plain-English walk through UAE corporate tax: registration, the 9% rate, free-zone income, and the nine-month filing rule.',
      keyword: 'uae corporate tax podcast',
      schemaType: 'PodcastEpisode',
    }),
  })
  process.stdout.write(`  ✓ podcasts/${SLUGS.podcast}\n`)

  // -------------------------------------------------------------- 8. ebook
  await save('ebooks', SLUGS.ebook, {
    ebook_title: 'The UAE Corporate Tax Starter Guide',
    cover_image: IMG,
    short_description: 'A 24-page founder’s guide to registering, preparing, and filing UAE corporate tax without the jargon.',
    full_description:
      'This starter guide breaks UAE corporate tax into a simple sequence: confirm scope, register on time, get your books filing-ready, and file within nine months. Includes a deadline cheat-sheet and a record-keeping checklist.',
    file_upload: 'https://example.com/files/uae-corporate-tax-starter-guide.pdf',
    file_size: '2.4 MB',
    page_count: 24,
    format: 'pdf',
    topics: ['corporate-tax', 'compliance', 'startup-finance'],
    author: SLUGS.team,
    gated: true,
    thank_you_page_url: 'https://www.finanshels.com/resources/thank-you',
    related_content: [SLUGS.blog],
    featured: true,
    ...signals({
      title: 'The UAE Corporate Tax Starter Guide',
      description: 'A 24-page founder’s guide to registering, preparing, and filing UAE corporate tax without the jargon.',
      keyword: 'uae corporate tax guide pdf',
      schemaType: 'Book',
    }),
  })
  process.stdout.write(`  ✓ ebooks/${SLUGS.ebook}\n`)

  // ------------------------------------------------------------- 9. webinar
  await save('webinars', SLUGS.webinar, {
    webinar_status: 'completed',
    webinar_title: 'Corporate Tax Readiness 2026: A Founder’s Checklist',
    banner_image: IMG,
    summary: 'A 45-minute live session walking founders through everything due before their corporate tax deadline.',
    description:
      '<p>Join Finanshels tax advisors for a practical, checklist-driven session on getting corporate-tax-ready in 2026 — registration, bookkeeping clean-up, and filing.</p>',
    start_datetime: new Date('2026-04-15T13:00:00.000Z'),
    end_datetime: new Date('2026-04-15T13:45:00.000Z'),
    timezone: 'Asia/Dubai',
    registration_url: 'https://example.com/webinar/register',
    recording_url: 'https://example.com/webinar/recording',
    platform: 'zoom',
    speakers: [SLUGS.team],
    agenda_items: [
      'Who must register and by when',
      'Turning bookkeeping into a filing-ready position',
      'Free-zone qualifying income',
      'Live Q&A',
    ],
    key_topics: ['corporate-tax', 'compliance', 'deadlines'],
    related_resources: [SLUGS.blog],
    featured: true,
    ...signals({
      title: 'Corporate Tax Readiness 2026: A Founder’s Checklist',
      description: 'A 45-minute session walking founders through everything due before their UAE corporate tax deadline.',
      keyword: 'corporate tax webinar uae',
      schemaType: 'Event',
    }),
  })
  process.stdout.write(`  ✓ webinars/${SLUGS.webinar}\n`)

  // --------------------------------------------------------------- 10. story
  await save('customer_stories', SLUGS.story, {
    story_title: 'How Acme Trading Cut Compliance Time by 60%',
    customer: 'Acme Trading LLC', // REQUIRED
    industry: ['retail'],
    region: 'UAE',
    hero_image: IMG,
    challenge_summary: 'Acme’s finance team spent days each month reconciling books and was unprepared for its first corporate tax filing.',
    solution_summary: 'Finanshels took over bookkeeping, set up monthly reconciliations, and handled corporate tax registration and filing.',
    results_summary: 'Acme cut monthly compliance time by 60% and filed its first corporate tax return three months ahead of the deadline.',
    metrics_highlights: [
      { label: 'Compliance time saved', value: '60%' },
      { label: 'Filed ahead of deadline', value: '3 months' },
      { label: 'Months of books cleaned up', value: '12' },
    ],
    full_story_body:
      '<h2>The challenge</h2><p>Acme Trading was growing fast but its books lagged months behind, and corporate tax was looming.</p><h2>What we did</h2><p>We rebuilt a year of bookkeeping, introduced monthly close, and managed registration and filing end to end.</p><h2>The result</h2><p>Acme now closes its books monthly and filed corporate tax with three months to spare.</p>',
    services_used: ['bookkeeping', 'corporate-tax'],
    testimonial_reference: [SLUGS.review],
    featured: true,
    publish_date: new Date('2026-06-12T00:00:00.000Z'),
    ...signals({
      title: 'How Acme Trading Cut Compliance Time by 60%',
      description: 'Acme Trading cut monthly compliance time by 60% and filed corporate tax three months early with Finanshels.',
      keyword: 'uae corporate tax case study',
      schemaType: 'Article',
      geoSummary: 'Case study: Acme Trading LLC reduced compliance time 60% and filed UAE corporate tax three months early after moving bookkeeping and tax to Finanshels.',
      geoContentType: 'analysis',
    }),
  })
  process.stdout.write(`  ✓ customer_stories/${SLUGS.story}\n`)

  // --------------------------------------------------------------- 11. media
  await save('media_assets', SLUGS.media, {
    title: 'Sample Blog Cover',
    assetType: 'image',
    category: 'Blog covers',
    folder: 'blog/covers',
    assetUrl: IMG || 'https://firebasestorage.googleapis.com/placeholder',
    altText: 'Sample blog cover image used across seeded demo content',
    mimeType: 'image/jpeg',
  })
  process.stdout.write(`  ✓ media_assets/${SLUGS.media}\n`)

  process.stdout.write('\n✓ Seeded all collections. Public + admin URLs:\n')
  const lines: Array<[string, string]> = [
    ['glossary_terms', `/glossary/${SLUGS.glossary}`],
    ['faqs', `/content/faqs/${SLUGS.faq}`],
    ['customer_reviews', `/content/customer_reviews/${SLUGS.review}`],
    ['podcasts', `/content/podcasts/${SLUGS.podcast}`],
    ['webinars', `/content/webinars/${SLUGS.webinar}`],
    ['customer_stories', `/content/customer_stories/${SLUGS.story}`],
    ['tools (admin only)', `/admin/cms?collection=tools&slug=${SLUGS.tool}`],
    ['ebooks (admin only)', `/admin/cms?collection=ebooks&slug=${SLUGS.ebook}`],
    ['team_members (admin only)', `/admin/cms?collection=team_members&slug=${SLUGS.team}`],
    ['media_assets (admin only)', `/admin/cms?collection=media_assets&slug=${SLUGS.media}`],
  ]
  for (const [name, url] of lines) process.stdout.write(`  ${name.padEnd(28)} ${url}\n`)
}

main().catch((err) => {
  process.stderr.write(`Seed failed: ${(err as Error).stack ?? (err as Error).message}\n`)
  process.exit(1)
})
