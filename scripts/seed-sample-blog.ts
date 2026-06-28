// One-off seed: writes a single, fully-populated published blog post so the
// CMS admin editor and the public /blog/[slug] route can be tested end to end.
//
// Run with:
//   npm run seed:blog
//   (or)  node --conditions=react-server --import tsx scripts/seed-sample-blog.ts
//
// The `--conditions=react-server` flag makes `import 'server-only'` resolve to a
// no-op so the repository/firestore modules import cleanly in a plain Node run —
// same trick the Webflow importer uses.
//
// Re-running is safe: the document id == slug, so it upserts in place.

import { readFileSync } from 'node:fs'

/**
 * Load .env.local into process.env the same way scripts/check-firestore.mjs
 * does — must happen before we touch any Firebase-Admin-backed module.
 */
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

const SLUG = 'uae-corporate-tax-checklist-for-founders'

/** Next/Image only renders remote hosts whitelisted in next.config.mjs. */
const ALLOWED_IMAGE_HOSTS = new Set(['firebasestorage.googleapis.com', 'storage.googleapis.com'])

function isRenderableImageUrl(value: unknown): value is string {
  if (typeof value !== 'string' || !value.startsWith('https://')) return false
  try {
    return ALLOWED_IMAGE_HOSTS.has(new URL(value).hostname)
  } catch {
    return false
  }
}

/** Pull a value off a Firestore doc that may store images as a string or {url}. */
function readImageUrl(value: unknown): string | null {
  if (isRenderableImageUrl(value)) return value
  if (value && typeof value === 'object') {
    const url = (value as Record<string, unknown>).url
    if (isRenderableImageUrl(url)) return url
  }
  return null
}

async function main(): Promise<void> {
  loadEnvLocal()

  // Dynamic-import AFTER env is loaded so getDb()/upsert see the credentials.
  const { getDb } = await import('../src/lib/cms/firestore')
  const { upsertCmsDocument } = await import('../src/lib/cms/collectionRepository')

  const db = getDb()
  if (!db) throw new Error('CMS is not configured — check FIREBASE_ADMIN_* env vars in .env.local')

  // --- Resolve an author (existing team member) so the byline renders a name ---
  let author = ''
  const teamSnap = await db.collection('team_members').limit(1).get()
  if (!teamSnap.empty) {
    author = teamSnap.docs[0]!.id // resolveAuthorDisplayName() maps this id -> full_name
    process.stdout.write(`  author -> team_members/${author}\n`)
  } else {
    process.stdout.write('  no team_members found — byline will be blank\n')
  }

  // --- Resolve a whitelisted image URL from existing media so Next/Image loads ---
  let imageUrl: string | null = null
  const mediaSnap = await db.collection('media_assets').limit(10).get()
  for (const doc of mediaSnap.docs) {
    const found = readImageUrl((doc.data() as Record<string, unknown>).url) ??
      readImageUrl((doc.data() as Record<string, unknown>).asset_url)
    if (found) { imageUrl = found; break }
  }
  if (!imageUrl && !teamSnap.empty) {
    const td = teamSnap.docs[0]!.data() as Record<string, unknown>
    imageUrl = readImageUrl(td.photo) ?? readImageUrl(td.featured_image) ?? readImageUrl(td.thumbnail_image)
  }
  process.stdout.write(imageUrl ? `  image  -> ${imageUrl}\n` : '  no whitelisted image found — post renders without a hero image\n')

  const publishDate = new Date('2026-06-20T09:00:00.000Z')

  // Real, sanitizer-safe article HTML. h2/h3 headings feed the table of contents.
  const body = `
<p>The UAE's federal corporate tax went live for financial years starting on or after 1 June 2023, and most founders are now filing for the first time. This checklist walks you through every deadline, registration step, and record you need so you can stay compliant without a panic-driven scramble in the final week.</p>

<h2>1. Confirm whether you're in scope</h2>
<p>Almost every mainland and free-zone business is in scope, even if your effective tax rate ends up at <strong>0%</strong>. Being "in scope" means you must register and file — it does not always mean you owe tax.</p>
<ul>
  <li><strong>Standard rate:</strong> 9% on taxable income above AED 375,000.</li>
  <li><strong>Small Business Relief:</strong> available where revenue stays under the published threshold.</li>
  <li><strong>Qualifying Free Zone Persons:</strong> may keep a 0% rate on qualifying income if conditions are met.</li>
</ul>

<h2>2. Register before your deadline</h2>
<p>Registration deadlines are staggered by the month your licence was issued. Missing the window triggers an administrative penalty, so treat this as the first thing to close out.</p>
<h3>What you'll need to register</h3>
<ol>
  <li>Trade licence and Emirates ID of the authorised signatory.</li>
  <li>Memorandum of Association (or equivalent) and ownership structure.</li>
  <li>Contact details and the financial year you've adopted.</li>
</ol>

<h2>3. Get your books to a filing-ready standard</h2>
<p>Corporate tax is calculated on accounting profit, adjusted for specific add-backs. If your bookkeeping is months behind, that's the real work — the filing itself is the easy part.</p>
<blockquote>Compliance is cheaper than a penalty. The founders who sleep well are the ones whose books are reconciled every month, not every June.</blockquote>

<h3>Records to keep for seven years</h3>
<ul>
  <li>Invoices, contracts, and bank statements.</li>
  <li>Transfer pricing documentation for related-party transactions.</li>
  <li>Working papers behind every adjustment on the return.</li>
</ul>

<h2>4. File and pay within nine months</h2>
<p>Your return and any payment are due <strong>nine months after the end of your financial year</strong>. For a calendar-year business, that means a 30 September deadline. File early — the portal is far calmer in month seven than in month nine.</p>

<h2>Quick-reference deadlines</h2>
<table>
  <thead>
    <tr><th>Financial year end</th><th>Filing &amp; payment deadline</th></tr>
  </thead>
  <tbody>
    <tr><td>31 December 2024</td><td>30 September 2025</td></tr>
    <tr><td>31 March 2025</td><td>31 December 2025</td></tr>
    <tr><td>30 June 2025</td><td>31 March 2026</td></tr>
  </tbody>
</table>

<p>Need a hand? <a href="https://www.finanshels.com/contact">Talk to a Finanshels accountant</a> and we'll map your exact deadlines to your licence and financial year.</p>
`.trim()

  const payload: Record<string, unknown> = {
    // ---------- Publish tab ----------
    title: 'The UAE Corporate Tax Checklist Every Founder Needs in 2026',
    slug: SLUG,
    status: 'published',
    language: 'en',
    excerpt:
      'Registration deadlines, the 9% threshold, Small Business Relief, the records to keep, and the nine-month filing rule — the complete UAE corporate tax checklist for founders, in plain English.',
    body,
    author,
    publish_date: publishDate,
    publishedAt: publishDate, // upsert converts a Date -> Firestore Timestamp
    featured_image: imageUrl ?? '',
    featured_image_alt: 'Founder reviewing a UAE corporate tax checklist at a desk',
    thumbnail_image: imageUrl ?? '',
    icon: 'book-open',
    blog_category: 'corporate-tax',
    blog_industry: 'technology',
    blog_tags: ['corporate-tax', 'uae', 'sme', 'compliance', 'deadlines'],
    target_persona: 'founder',
    table_of_contents_enabled: true,
    featured_post: true,
    reading_time: 7,
    tags: ['corporate-tax', 'uae', 'founders'],
    categories: ['Tax', 'Compliance'],
    cta_label: 'Book a free tax consultation',
    cta_link: 'https://www.finanshels.com/contact',
    lead_magnet_label: 'Download the founder tax checklist (PDF)',
    lead_magnet_url: 'https://www.finanshels.com/resources/corporate-tax-checklist',
    lead_magnet_form_id: 'corporate-tax-checklist-2026',
    detail_lead_capture_form_id: 'blog-inline-lead-2026',
    detail_sticky_side_cta_label: 'Get your tax deadlines mapped',
    detail_sticky_side_cta_link: 'https://www.finanshels.com/contact',

    // ---------- SEO tab ----------
    focus_keyword: 'uae corporate tax checklist',
    seo_title: 'UAE Corporate Tax Checklist for Founders (2026) | Finanshels',
    meta_description:
      'A founder-friendly UAE corporate tax checklist: registration deadlines, the 9% rate, Small Business Relief, records to keep, and the nine-month filing rule.',
    meta_keywords: ['uae corporate tax', 'corporate tax registration', 'small business relief', 'tax filing deadline'],
    secondary_keywords: ['corporate tax uae 9 percent', 'free zone qualifying income', 'corporate tax penalty uae'],
    canonical_url: `https://www.finanshels.com/blog/${SLUG}`,
    og_title: 'The UAE Corporate Tax Checklist Every Founder Needs in 2026',
    og_description: 'Deadlines, thresholds, reliefs, and records — everything a UAE founder must do for corporate tax, in one checklist.',
    og_image: imageUrl ?? '',
    twitter_card_type: 'summary_large_image',
    twitter_creator_handle: '@finanshels',
    robots_meta: 'index,follow',
    schema_type: 'BlogPosting',
    faq_schema_enabled: true,
    breadcrumbs_title: 'UAE Corporate Tax Checklist',

    // ---------- AEO tab (answer engines) ----------
    directAnswer:
      'UAE corporate tax is 9% on taxable income above AED 375,000. Founders must register by a licence-based deadline, keep records for seven years, and file within nine months of their financial year-end. Small Business Relief and a 0% Qualifying Free Zone rate may apply.',
    faqItems: [
      { question: 'When is the UAE corporate tax registration deadline?', answer: 'Registration deadlines are staggered by the month your trade licence was issued. Missing your window triggers an administrative penalty, so register as early as possible.' },
      { question: 'What is the UAE corporate tax rate?', answer: 'The standard rate is 9% on taxable income above AED 375,000. Income up to that threshold is taxed at 0%.' },
      { question: 'When do I have to file and pay?', answer: 'Your return and payment are due nine months after the end of your financial year — for a calendar-year business, that is 30 September.' },
    ],
    answerSnippet:
      'UAE corporate tax: 9% above AED 375,000, register by your licence-based deadline, file within nine months of year-end, keep records for seven years.',
    howToSteps: [
      { title: 'Confirm scope', description: 'Check whether your mainland or free-zone entity is in scope and which rate or relief applies.' },
      { title: 'Register on time', description: 'Register through the FTA portal before your licence-based deadline to avoid penalties.' },
      { title: 'Ready your books', description: 'Reconcile your accounts and prepare the adjustments that turn accounting profit into taxable income.' },
      { title: 'File and pay', description: 'Submit your return and pay any tax due within nine months of your financial year-end.' },
    ],
    speakableContent:
      'The UAE corporate tax rate is nine percent on taxable income above three hundred seventy-five thousand dirhams. Register before your deadline and file within nine months of your financial year end.',

    // ---------- GEO tab (generative search signals) ----------
    geoSummary:
      'Finanshels checklist summarizing UAE corporate tax obligations for founders: a 9% rate above AED 375,000, staggered registration deadlines, Small Business Relief, a 0% Qualifying Free Zone rate, seven-year record-keeping, and a nine-month filing window.',
    sourceUrls: ['https://tax.gov.ae', 'https://mof.gov.ae'],
    geoContentType: 'guide',
    lastUpdatedDate: '2026-06-20',
    // `rows` fields store as arrays of objects keyed by their rowFormat.
    citations: [
      { title: 'Federal Decree-Law No. 47 of 2022 on Corporate Tax', url: 'https://tax.gov.ae', publisher: 'UAE Federal Tax Authority' },
      { title: 'Small Business Relief — Ministerial Decision', url: 'https://mof.gov.ae', publisher: 'UAE Ministry of Finance' },
    ],
    keyStatistics: [
      { stat: 'Standard corporate tax rate of 9% above AED 375,000', source: 'https://tax.gov.ae' },
      { stat: 'Returns due within 9 months of financial year-end', source: 'https://tax.gov.ae' },
    ],
    expertQuotes: [
      { quote: 'The founders who sleep well are the ones whose books are reconciled every month, not every June.', name: 'Finanshels Tax Team', role: 'Corporate Tax Advisory' },
    ],
    relatedEntities: ['UAE Federal Tax Authority', 'Ministry of Finance', 'Corporate Tax', 'Free Zone'],

    // ---------- Blocks tab (rendered below the body on /blog/[slug]) ----------
    page_blocks: [
      {
        type: 'stats',
        id: 'stats-1',
        heading: 'UAE corporate tax at a glance',
        items: [
          { value: '9%', label: 'Rate above AED 375,000' },
          { value: '0%', label: 'Up to AED 375,000' },
          { value: '9 months', label: 'To file after year-end' },
          { value: '7 years', label: 'To keep records' },
        ],
      },
      {
        type: 'faq_accordion',
        id: 'faq-1',
        heading: 'Corporate tax FAQs',
        subheading: 'The questions founders ask us most.',
        items: [
          { question: 'Do free-zone companies pay corporate tax?', answer: 'A Qualifying Free Zone Person can keep a 0% rate on qualifying income if it meets the conditions, but must still register and file.' },
          { question: 'What happens if I register late?', answer: 'Late registration triggers a fixed administrative penalty. Register as soon as your licence-based deadline is known.' },
        ],
      },
      {
        type: 'rich_text',
        id: 'rt-1',
        html: '<h3>Still unsure where you stand?</h3><p>Send us your trade licence and financial year and we\'ll confirm your exact registration and filing deadlines within one business day.</p>',
      },
      {
        type: 'cta',
        id: 'cta-1',
        heading: 'Get your corporate tax handled by Finanshels',
        subheading: 'Registration, bookkeeping, and filing — done for you, on deadline.',
        primaryLabel: 'Book a free consultation',
        primaryUrl: 'https://www.finanshels.com/contact',
        secondaryLabel: 'See pricing',
        secondaryUrl: 'https://www.finanshels.com/pricing',
        tone: 'brand',
      },
    ],
    schema_type_override: '',
  }

  await upsertCmsDocument('blog_posts' as never, SLUG, payload, 'seed-sample-blog')

  process.stdout.write('\n✓ Seeded blog post\n')
  process.stdout.write(`  Admin : /admin/cms?collection=blog_posts&slug=${SLUG}\n`)
  process.stdout.write(`  Public: /blog/${SLUG}\n`)
}

main().catch((err) => {
  process.stderr.write(`Seed failed: ${(err as Error).stack ?? (err as Error).message}\n`)
  process.exit(1)
})
