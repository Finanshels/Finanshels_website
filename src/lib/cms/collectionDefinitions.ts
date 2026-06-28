// Pure-data registry (no React/lucide) — safe to import here (this module is
// shared by server + admin client). Industry verticals are a single source of
// truth reused by blog_industry and the customer collections' `industry` field.
import { INDUSTRY_VALUES, INDUSTRY_LABELS } from './industryOptions'
import { CONTENT_CATEGORY_OPTIONS, CONTENT_CATEGORY_LABELS } from './contentCategoryOptions'

export type CmsCollectionKey =
  | 'media_assets'
  | 'tools'
  | 'customer_reviews'
  | 'podcasts'
  | 'faqs'
  | 'customer_stories'
  | 'ebooks'
  | 'webinars'
  | 'glossary_terms'
  | 'blog_posts'
  | 'team_members'

export type CmsFieldType =
  | 'text'
  | 'textarea'
  | 'boolean'
  | 'datetime'
  | 'email'
  | 'image'
  | 'file'
  | 'icon'
  | 'tags'
  | 'url'
  | 'number'
  | 'select'
  // Constrained multi-pick: stores string[] of slugs chosen from `options`.
  // The editor renders a chip picker (max `maxItems`); codec joins/splits on ','.
  | 'multi_select'
  | 'json'
  | 'reference'
  | 'multi_reference'
  | 'blocks'
  // Structured rows: stored as an array of objects (typed by `rowFormat`), but
  // the editor sees a single textarea with one row per line and `|` between
  // attributes. Codec in fieldCodec.ts converts in both directions. Used for
  // GEO citations/statistics/quotes so content writers never type raw JSON.
  | 'rows'

export type CmsFieldDefinition = {
  name: string
  label: string
  type: CmsFieldType
  placeholder?: string
  required?: boolean
  options?: string[]
  // Used by `select` and `multi_select`. Optional value→display-name map so the
  // picker can show "Small Business" while still storing the slug
  // `small-business`. Falls back to the raw option value when absent.
  optionLabels?: Record<string, string>
  // Only used when `type === 'multi_select'`. Caps how many options can be
  // selected; enforced in the editor (chips disable at the cap) and in the codec
  // (decode throws above it).
  maxItems?: number
  // Only used when `type === 'number'`. Enforced both in the HTML input and in
  // the number codec (decode throws below `min`). Used to forbid negative
  // sort_order values.
  min?: number
  referenceCollection?: CmsCollectionKey
  // FIX-031: widened to `unknown` so future field types (e.g. blocks/json) can
  // carry typed defaults without casting. Callers must narrow before use.
  defaultValue?: unknown
  description?: string
  // Only used when `type === 'rows'`. The ordered list of attribute names
  // produced by splitting each line on `|`. Example for citations:
  // `rowFormat: ['title', 'url', 'publisher']` produces rows like
  // `{ title: 'X', url: 'Y', publisher: 'Z' }`.
  rowFormat?: string[]
}

export type CmsSectionKey =
  | 'publish'
  | 'card'
  | 'listing'
  | 'detail'
  | 'blocks'
  | 'relations'
  | 'seo'
  | 'aeo'
  | 'geo'

export type CmsCollectionDefinition = {
  key: CmsCollectionKey
  label: string
  singularLabel: string
  description: string
  template: string
  routePattern?: string
  listingRoute?: string
  titleField: string
  slugField: string
  defaultSchemaType?: string
  sections: Record<CmsSectionKey, CmsFieldDefinition[]>
}

/**
 * Catalog of CMS page-builder blocks. Used by the structured editor in admin
 * and by the frontend renderer in `/content/[collection]/[slug]`.
 *
 * Every block stores `{ type, id?, ...fields }` in the `page_blocks` JSON array.
 */
// FIX-033: block catalogue extracted to definitions/blocks.ts.
export type { CmsBlockField, CmsBlockType } from "./definitions/blocks"
export { CMS_BLOCK_TYPES, CMS_BLOCK_TYPE_MAP } from "./definitions/blocks"

/**
 * FIX-025: `commonSeoFields()` deleted. The six camelCase duplicates
 * (`seoTitle`, `seoDescription`, `ogTitle`, `ogDescription`, `ogImageUrl`,
 * `canonicalUrl`) collapsed into the snake_case canonicals in
 * `globalSeoFields()` below. The unique non-duplicated entries
 * (`focus_keyword`, `seo_keywords`, `secondary_keywords`, `twitter_card_type`,
 * `twitter_creator_handle`, `robots_meta`) were folded into `globalSeoFields()`
 * as snake_case names. Net: 24 SEO fields per collection → 18 (× 15 collections
 * = 90 form inputs removed).
 */

function globalCoreFields(): CmsFieldDefinition[] {
  return [
    { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Main display title' },
    { name: 'slug', label: 'Slug', type: 'text', required: true, placeholder: 'url-friendly-slug' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      // FIX-047: collapsed from 6 values to 3. Per-collection status overrides
      // have been removed — every collection inherits this single set.
      options: ['draft', 'in_review', 'published'],
      required: true,
    },
    { name: 'language', label: 'Language', type: 'select', options: ['en', 'ar'], required: true },
    { name: 'excerpt', label: 'Excerpt', type: 'textarea', placeholder: 'Short summary / preview' },
    { name: 'short_description', label: 'Short description', type: 'textarea', placeholder: 'Compact description' },
    { name: 'featured_image', label: 'Featured image', type: 'image', placeholder: 'https://...' },
    { name: 'thumbnail_image', label: 'Thumbnail image', type: 'image', placeholder: 'https://...' },
    { name: 'icon', label: 'Icon', type: 'icon', placeholder: 'Icon name or image URL' },
    { name: 'author', label: 'Author', type: 'reference', referenceCollection: 'team_members' },
    { name: 'published_at', label: 'Published at', type: 'datetime' },
    // updated_at is server-managed: collectionRepository overwrites it with
    // Timestamp.now() on every write (and deletes any form value), so the form
    // input is ignored. It must NOT be required — a required+empty `updated_at`
    // blocked saves with "Updated at is required". (title-required fix, 2026-06-28)
    { name: 'updated_at', label: 'Updated at', type: 'datetime' },
    { name: 'sort_order', label: 'Sort order', type: 'number', min: 0 },
    { name: 'tags', label: 'Tags', type: 'tags', placeholder: 'tag-a, tag-b' },
    { name: 'categories', label: 'Categories', type: 'tags', placeholder: 'category-a, category-b' },
    { name: 'related_content', label: 'Related content', type: 'multi_reference', referenceCollection: 'blog_posts' },
    { name: 'cta_label', label: 'CTA label', type: 'text', placeholder: 'Book consultation' },
    { name: 'cta_link', label: 'CTA link', type: 'url', placeholder: 'https://...' },
  ]
}

function globalSeoFields(): CmsFieldDefinition[] {
  return [
    { name: 'focus_keyword', label: 'Focus keyword', type: 'text', placeholder: 'founder decision making framework' },
    { name: 'seo_title', label: 'SEO title', type: 'text', placeholder: 'Search title' },
    { name: 'meta_description', label: 'Meta description', type: 'textarea', placeholder: 'Search snippet' },
    { name: 'meta_keywords', label: 'Meta keywords', type: 'tags', placeholder: 'keyword-a, keyword-b' },
    { name: 'secondary_keywords', label: 'Secondary keywords (LSI)', type: 'tags', placeholder: 'long-tail keyword one, keyword two' },
    { name: 'canonical_url', label: 'Canonical URL', type: 'url', placeholder: 'https://...' },
    { name: 'og_title', label: 'OG title', type: 'text', placeholder: 'Social title' },
    { name: 'og_description', label: 'OG description', type: 'textarea', placeholder: 'Social description' },
    { name: 'og_image', label: 'OG image', type: 'image', placeholder: 'https://...' },
    // schema-options-trim (2026-06-28): `twitter_card_type` removed — it's an
    // org-wide setting (always `summary_large_image`; the routes hardcode/default
    // to it) masquerading as a per-post field, and the blog route never read it.
    { name: 'twitter_creator_handle', label: 'Twitter creator handle', type: 'text', placeholder: '@finanshels' },
    {
      name: 'robots_meta',
      label: 'Robots meta',
      type: 'select',
      options: ['index,follow', 'noindex,follow', 'index,nofollow', 'noindex,nofollow'],
    },
    // schema-options-trim (2026-06-28): the SEO `schema_type` field was removed as
    // a duplicate. Per-doc schema type is now set via the curated
    // `schema_type_override` (Blocks tab) → collection `defaultSchemaType`.
    // Legacy stored `schema_type` values are still honored as a read fallback in
    // resolveSchemaType / the blog route.
    // FIX-047: `indexable` + `noindex` booleans removed — they contradicted each
    // other (both ON → noindex silently won) and duplicated `robots_meta` above.
    // `robots_meta` is now the single control for index/follow directives.
    { name: 'faq_schema_enabled', label: 'FAQ schema enabled', type: 'boolean' },
    { name: 'breadcrumbs_title', label: 'Breadcrumbs title', type: 'text' },
  ]
}

/**
 * FIX-026: content-layout fields are NOT AEO signals. They were sitting under
 * the `aeo` tab because of a historical mis-bucketing. They now live in the
 * `publish` section. The `aeo` section is restricted to the five genuine
 * answer-engine fields in `commonAeoFields()`.
 */
function globalContentLayoutFields(): CmsFieldDefinition[] {
  return [
    { name: 'hero_heading', label: 'Hero heading', type: 'text' },
    { name: 'hero_subheading', label: 'Hero subheading', type: 'textarea' },
    { name: 'body', label: 'Body', type: 'textarea' },
    { name: 'sections', label: 'Sections (legacy JSON)', type: 'json', placeholder: '[{...}]' },
    { name: 'sidebar_cta_enabled', label: 'Sidebar CTA enabled', type: 'boolean' },
    {
      name: 'primary_cta_variant',
      label: 'Primary CTA variant',
      type: 'select',
      options: ['default', 'minimal', 'contrast', 'soft'],
    },
    {
      name: 'template_variant',
      label: 'Template variant',
      type: 'select',
      options: ['default', 'compact', 'feature', 'story', 'landing'],
    },
  ]
}

function mergeFieldSets(base: CmsFieldDefinition[], overrides: CmsFieldDefinition[]): CmsFieldDefinition[] {
  const overrideMap = new Map(overrides.map((field) => [field.name, field]))
  const mergedBase = base.map((field) => overrideMap.get(field.name) ?? field)
  const baseNames = new Set(base.map((field) => field.name))
  const additional = overrides.filter((field) => !baseNames.has(field.name))
  return [...mergedBase, ...additional]
}

function commonAeoFields(): CmsFieldDefinition[] {
  return [
    {
      name: 'directAnswer',
      label: 'Direct answer (AI summary)',
      type: 'textarea',
      placeholder: 'A concise answer that LLMs and snippets can reuse directly',
    },
    {
      name: 'faqItems',
      label: 'FAQ items JSON',
      type: 'json',
      placeholder: '[{"question":"...","answer":"..."}]',
    },
    {
      name: 'answerSnippet',
      label: 'Direct answer snippet',
      type: 'textarea',
      placeholder: 'One concise answer block for answer engines',
    },
    {
      name: 'howToSteps',
      label: 'HowTo steps JSON',
      type: 'json',
      placeholder: '[{"title":"Step 1","description":"..."}]',
    },
    {
      name: 'speakableContent',
      label: 'Speakable content',
      type: 'textarea',
      placeholder: 'Section optimized for voice assistants and spoken responses',
    },
  ]
}

function commonGeoFields(): CmsFieldDefinition[] {
  return [
    {
      name: 'geoSummary',
      label: 'GEO summary',
      type: 'textarea',
      placeholder: 'Factual summary for AI and generative search systems',
    },
    {
      name: 'sourceUrls',
      label: 'Source URLs',
      type: 'tags',
      placeholder: 'https://source1, https://source2',
    },
    {
      name: 'geoContentType',
      label: 'Content type',
      type: 'select',
      options: ['evergreen', 'news', 'guide', 'comparison', 'analysis'],
    },
    {
      name: 'lastUpdatedDate',
      label: 'Last updated date',
      type: 'text',
      placeholder: 'YYYY-MM-DD',
    },
    // CMO-redesign: was `type: 'json'` — editors had to write JSON by hand.
    // Now `type: 'rows'` with a `rowFormat`. The editor writes one row per
    // line with attributes separated by `|`. Backend serializes to an array
    // of objects on save. See src/lib/cms/fieldCodec.ts.
    {
      name: 'citations',
      label: 'Citations / sources',
      type: 'rows',
      rowFormat: ['title', 'url', 'publisher'],
      placeholder: 'The State of UAE Tax | https://example.com/report | EY',
      description: 'One per line. Format: Title | URL | Publisher',
    },
    {
      name: 'keyStatistics',
      label: 'Key statistics',
      type: 'rows',
      rowFormat: ['stat', 'source'],
      placeholder: '94% of UAE SMEs miss VAT deadlines | https://example.com/research',
      description: 'One per line. Format: Stat | Source URL',
    },
    {
      name: 'expertQuotes',
      label: 'Expert quotes',
      type: 'rows',
      rowFormat: ['quote', 'name', 'role'],
      placeholder: 'Compliance is a feature, not a tax. | Jane Doe | CFO, Acme',
      description: 'One per line. Format: Quote | Name | Role',
    },
    {
      name: 'relatedEntities',
      label: 'Related entities',
      type: 'tags',
      placeholder: 'Elon Musk, OpenAI, SaaS',
    },
  ]
}

/**
 * Universal card fields. Every collection inherits these so listing pages
 * can render uniform cards without bespoke per-collection title/excerpt logic.
 */
/**
 * FIX-027: card_title, card_icon, card_label, card_cta_label, card_cta_link
 * removed — no public reader consumes them anywhere in src/app or
 * src/components (verified by grep). card_description and card_image are
 * retained because the generic /content/[collection]/[slug] route reads them
 * as <meta> description / OG image fallbacks. Existing Firestore documents
 * with values in the removed fields are unaffected; the admin no longer
 * surfaces inputs for them. If reinstated, the field names below are still
 * available — they are stored as-is by Firestore's merge semantics.
 *
 * DEPRECATED_CARD_FIELDS = ['card_title', 'card_icon', 'card_label',
 *   'card_cta_label', 'card_cta_link']
 */
function universalCardFields(): CmsFieldDefinition[] {
  return [
    { name: 'card_description', label: 'Card description', type: 'textarea', placeholder: 'Falls back to the excerpt. Used as <meta> description fallback on /content/[collection]/[slug].' },
    { name: 'card_image', label: 'Card image', type: 'image', placeholder: 'https://... Used as OG image fallback on /content/[collection]/[slug].' },
    { name: 'featured', label: 'Featured', type: 'boolean' },
    { name: 'sort_order', label: 'Sort order', type: 'number', min: 0 },
  ]
}

/**
 * Universal listing-page configuration. Editors set how the /[collection]
 * index renders for end users (hero, search, filters, sort, featured, sticky CTA).
 */
function universalListingFields(): CmsFieldDefinition[] {
  return [
    { name: 'listing_hero_heading', label: 'Listing hero heading', type: 'text' },
    { name: 'listing_hero_subheading', label: 'Listing hero subheading', type: 'textarea' },
    { name: 'listing_hero_image', label: 'Listing hero image', type: 'url' },
    { name: 'listing_intro_html', label: 'Listing intro HTML', type: 'textarea' },
    { name: 'listing_search_enabled', label: 'Search bar enabled', type: 'boolean' },
    { name: 'listing_search_placeholder', label: 'Search placeholder', type: 'text' },
    {
      name: 'listing_filter_facets',
      label: 'Filter facets',
      type: 'tags',
      placeholder: 'category, tag, region, industry',
    },
    {
      name: 'listing_sort_options',
      label: 'Sort options',
      type: 'tags',
      placeholder: 'newest, oldest, alphabetical, popular, featured',
    },
    {
      name: 'listing_default_sort',
      label: 'Default sort',
      type: 'select',
      options: ['newest', 'oldest', 'alphabetical', 'popular', 'featured', 'sort_order'],
    },
    { name: 'listing_featured_count', label: 'Featured count', type: 'number', placeholder: '3' },
    {
      name: 'listing_layout',
      label: 'Layout',
      type: 'select',
      options: ['grid', 'list', 'magazine', 'masonry'],
    },
    { name: 'listing_page_size', label: 'Page size', type: 'number', placeholder: '12' },
    {
      name: 'listing_pagination_style',
      label: 'Pagination style',
      type: 'select',
      options: ['paged', 'load_more', 'infinite'],
    },
    { name: 'listing_sticky_cta_enabled', label: 'Sticky CTA enabled', type: 'boolean' },
    { name: 'listing_sticky_cta_label', label: 'Sticky CTA label', type: 'text' },
    { name: 'listing_sticky_cta_link', label: 'Sticky CTA link', type: 'url' },
  ]
}

/**
 * Universal detail-page configuration. Editors set the shared blocks every
 * detail page renders: breadcrumbs, related content, lead capture, social share,
 * sticky side CTA, schema markup, and which blocks render where.
 */
function universalDetailFields(): CmsFieldDefinition[] {
  return [
    { name: 'detail_breadcrumbs_enabled', label: 'Breadcrumbs enabled', type: 'boolean' },
    { name: 'detail_breadcrumbs_title', label: 'Breadcrumbs title override', type: 'text' },
    { name: 'detail_metadata_row_enabled', label: 'Metadata row enabled', type: 'boolean' },
    { name: 'detail_social_share_enabled', label: 'Social share enabled', type: 'boolean' },
    {
      name: 'detail_social_share_networks',
      label: 'Social networks',
      type: 'tags',
      placeholder: 'twitter, linkedin, facebook, whatsapp',
    },
    { name: 'detail_sticky_side_cta_enabled', label: 'Sticky side CTA enabled', type: 'boolean' },
    { name: 'detail_sticky_side_cta_label', label: 'Sticky side CTA label', type: 'text' },
    { name: 'detail_sticky_side_cta_link', label: 'Sticky side CTA link', type: 'url' },
    { name: 'detail_lead_capture_enabled', label: 'Lead capture enabled', type: 'boolean' },
    { name: 'detail_lead_capture_form_id', label: 'Lead capture form ID', type: 'text' },
    { name: 'detail_related_content_enabled', label: 'Related content block enabled', type: 'boolean' },
    {
      name: 'detail_related_content_mode',
      label: 'Related content mode',
      type: 'select',
      options: ['manual', 'auto', 'manual+auto'],
    },
    {
      name: 'detail_related_content_max',
      label: 'Related content max items',
      type: 'number',
      placeholder: '3',
    },
    {
      name: 'detail_template_variant',
      label: 'Detail template variant',
      type: 'select',
      options: ['default', 'compact', 'feature', 'story', 'landing'],
    },
  ]
}

/**
 * Full schema.org type catalogue offered by the schema-type override when a
 * collection doesn't narrow it. Most collections curate this down to the handful
 * that fit their content type via SCHEMA_OVERRIDE_OPTIONS_BY_COLLECTION.
 */
const ALL_SCHEMA_TYPES = [
  'Article',
  'BlogPosting',
  'NewsArticle',
  'DefinedTerm',
  'FAQPage',
  'HowTo',
  'WebPage',
  'CollectionPage',
  'ItemList',
  'VideoObject',
  'PodcastEpisode',
  'Event',
  'Course',
  'SoftwareApplication',
  'Product',
  'Person',
  'Organization',
  'Review',
  'Book',
]

/**
 * Page-builder JSON storage. The structured editor compiles to this shape:
 * `[{ type: "hero", id, ...fields }, ...]`. Schema type override sits next to it.
 * `schemaOptions` narrows the override dropdown to the types relevant for the
 * collection; falls back to the full catalogue when omitted.
 */
function universalBlocksFields(defaultSchemaType?: string, schemaOptions?: string[]): CmsFieldDefinition[] {
  const types = schemaOptions && schemaOptions.length > 0 ? schemaOptions : ALL_SCHEMA_TYPES
  return [
    {
      name: 'page_blocks',
      label: 'Page blocks',
      type: 'blocks',
      placeholder: '[]',
      description: 'Reusable blocks composed top-to-bottom on the detail page.',
    },
    {
      name: 'schema_type_override',
      label: 'Schema type (override)',
      type: 'select',
      options: ['', ...types],
      defaultValue: defaultSchemaType ?? '',
      description: 'Defaults to the collection-level schema type when blank.',
    },
  ]
}

type CollectionRelationshipDescriptor = {
  /** Outgoing single references (this doc -> one other doc). */
  references?: Array<{ name: string; label: string; target: CmsCollectionKey }>
  /** Outgoing multi references (this doc -> many other docs). */
  multiReferences?: Array<{ name: string; label: string; target: CmsCollectionKey }>
}

function relationshipFields(rel: CollectionRelationshipDescriptor): CmsFieldDefinition[] {
  const out: CmsFieldDefinition[] = []
  for (const ref of rel.references ?? []) {
    out.push({
      name: ref.name,
      label: ref.label,
      type: 'reference',
      referenceCollection: ref.target,
    })
  }
  for (const ref of rel.multiReferences ?? []) {
    out.push({
      name: ref.name,
      label: ref.label,
      type: 'multi_reference',
      referenceCollection: ref.target,
    })
  }
  return out
}

/**
 * FIX-024 / FIX-036: canonical-vs-legacy decisions per collection. Per the
 * audit (BLOG-001 / GLOSS-004 / STORY-002 / WEBINAR-001), the relations-side
 * camelCase Refs name is canonical because (a) it is consistent across
 * sibling fields (`relatedGlossaryRefs`, `relatedFaqRefs`) and (b) it does not
 * collide with global-core fields that share snake_case names.
 *
 *   blog_posts:        canonical `relatedPostRefs` (relations) — `related_posts` stripped from publish
 *   glossary_terms:    canonical `relatedTermRefs` (relations) — `related_terms` stripped from publish
 *   customer_stories:  canonical `related_blog_posts` (publish) — `relatedBlogRefs` not present here
 *   webinars:          canonical `speakerRefs`     (relations) — `speakers` stripped via legacyAliases
 *
 * Anything still appearing in both publish and RELATIONSHIPS targeting the same
 * collection is intentional (different semantic role, not a duplicate).
 */
const RELATIONSHIPS: Record<CmsCollectionKey, CollectionRelationshipDescriptor> = {
  blog_posts: {
    /**
     * CMO-redesign: relations for blog_posts shows ONLY non-blog content-cluster
     * links. `relatedPostRefs` removed in favor of the publish-section
     * `related_posts` (one canonical multi-ref for "blog-to-blog"). The hero
     * image asset ref is stripped via HIDDEN_FIELDS_BY_COLLECTION (duplicates
     * featured_image).
     */
    multiReferences: [
      { name: 'relatedGlossaryRefs', label: 'Related glossary terms', target: 'glossary_terms' },
      { name: 'relatedFaqRefs', label: 'Related FAQs', target: 'faqs' },
    ],
  },
  glossary_terms: {
    multiReferences: [
      { name: 'relatedTermRefs', label: 'Related glossary terms', target: 'glossary_terms' },
      { name: 'relatedFaqRefs', label: 'Related FAQs', target: 'faqs' },
      { name: 'relatedBlogRefs', label: 'Related blog posts', target: 'blog_posts' },
      { name: 'relatedToolRefs', label: 'Related tools', target: 'tools' },
    ],
  },
  podcasts: {
    multiReferences: [
      // Hosts/guests/related-blogs are canonical in the publish section
      // (`hosts` → team_members, `guests` tags, `related_resources` → blog_posts).
      // Relations keeps only the podcast-to-podcast link to avoid duplicates.
      { name: 'relatedPodcastRefs', label: 'Related episodes', target: 'podcasts' },
    ],
  },
  ebooks: {
    // ebook-trim (2026-06-28): keep Authors only — the related-content cross-links
    // had no public surface to render into (ebooks have no public route, FIX-048).
    multiReferences: [
      { name: 'authorRefs', label: 'Authors', target: 'team_members' },
    ],
  },
  webinars: {
    multiReferences: [
      { name: 'speakerRefs', label: 'Speakers', target: 'team_members' },
      { name: 'relatedBlogRefs', label: 'Related blog posts', target: 'blog_posts' },
      { name: 'relatedWebinarRefs', label: 'Related webinars', target: 'webinars' },
    ],
  },
  tools: {
    multiReferences: [
      { name: 'relatedBlogRefs', label: 'Related blog posts', target: 'blog_posts' },
      { name: 'relatedGlossaryRefs', label: 'Related glossary terms', target: 'glossary_terms' },
      { name: 'relatedToolRefs', label: 'Related tools', target: 'tools' },
    ],
  },
  faqs: {
    multiReferences: [
      { name: 'relatedFaqRefs', label: 'Related FAQs', target: 'faqs' },
      { name: 'relatedGlossaryRefs', label: 'Related glossary terms', target: 'glossary_terms' },
      { name: 'relatedBlogRefs', label: 'Related blog posts', target: 'blog_posts' },
    ],
  },
  customer_reviews: {
    multiReferences: [
      { name: 'relatedStoryRefs', label: 'Related customer stories', target: 'customer_stories' },
    ],
  },
  customer_stories: {
    references: [
      { name: 'leadAuthorRef', label: 'Lead author', target: 'team_members' },
    ],
    multiReferences: [
      // `relatedBlogRefs` REMOVED — canonical is publish `related_blog_posts` (FIX-024).
      // `reviewRefs` REMOVED — duplicate of the publish `testimonial_reference`
      // (both multi-ref → customer_reviews). The publish field is canonical.
      { name: 'relatedStoryRefs', label: 'Related customer stories', target: 'customer_stories' },
    ],
  },
  team_members: {
    multiReferences: [
      { name: 'authoredBlogRefs', label: 'Authored blog posts', target: 'blog_posts' },
    ],
  },
  media_assets: {},
}

type BaseCollectionDefinition = Omit<CmsCollectionDefinition, 'sections'> & {
  sections: Partial<Record<CmsSectionKey, CmsFieldDefinition[]>>
}

const CMS_COLLECTION_DEFINITIONS_BASE: BaseCollectionDefinition[] = [
  {
    key: 'media_assets',
    label: 'Media',
    singularLabel: 'Media Asset',
    description: 'Reusable image/video/document assets for all collections.',
    template: 'Media library asset',
    titleField: 'title',
    slugField: 'slug',
    defaultSchemaType: 'MediaObject',
    sections: {
      publish: [
        { name: 'slug', label: 'Asset slug', type: 'text', required: true, placeholder: 'founder-decision-framework-cover' },
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'assetType', label: 'Asset type', type: 'select', options: ['image', 'video', 'document', 'other'], required: true },
        {
          // FIX-021: replace free-text category with a controlled dropdown so all
          // assets fall into a known bucket and folder filtering stays meaningful.
          name: 'category',
          label: 'Category',
          type: 'select',
          options: ['Blog covers', 'Ebook covers', 'Team photos', 'Customer logos', 'Social media', 'Infographics', 'Other'],
        },
        { name: 'folder', label: 'Folder', type: 'text', placeholder: 'blog/covers' },
        { name: 'assetUrl', label: 'Asset URL', type: 'url', required: true, placeholder: 'https://...' },
        { name: 'altText', label: 'Alt text', type: 'text', placeholder: 'Describe the visual for accessibility' },
        { name: 'mimeType', label: 'MIME type', type: 'text', placeholder: 'image/webp' },
        { name: 'byteSize', label: 'File size (bytes)', type: 'number', description: 'Set automatically when uploading from the media library.' },
        { name: 'width', label: 'Width', type: 'number' },
        { name: 'height', label: 'Height', type: 'number' },
      ],
    },
  },
  {
    key: 'blog_posts',
    label: 'Blog Posts',
    singularLabel: 'Blog Post',
    description: 'Long-form articles with authoring and publishing controls.',
    template: 'Article template',
    routePattern: '/blog/[slug]',
    listingRoute: '/blog',
    titleField: 'title',
    slugField: 'slug',
    defaultSchemaType: 'BlogPosting',
    sections: {
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true, placeholder: '10-percent-decision-framework' },
        { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
        { name: 'body', label: 'Body', type: 'textarea', required: true },
        { name: 'author', label: 'Author', type: 'reference', referenceCollection: 'team_members', required: true },
        { name: 'publish_date', label: 'Publish date', type: 'datetime', required: true },
        // a11y companion to the universal featured_image. Required when featured_image is set
        // (enforced in saveCmsDocumentAction).
        { name: 'featured_image_alt', label: 'Featured image alt text', type: 'text', placeholder: 'Describe the image for screen readers' },
        // CMO-redesign: blog_category is a curated dropdown (services + content types).
        {
          name: 'blog_category',
          label: 'Blog category',
          type: 'select',
          required: true,
          options: CONTENT_CATEGORY_OPTIONS,
          optionLabels: CONTENT_CATEGORY_LABELS,
        },
        // industry vertical the post serves (optional). Options are the shared
        // INDUSTRY_OPTIONS registry; the dropdown shows display names while the
        // stored value stays the slug. Icons live in the registry for the /blog
        // industry filter + card badge.
        {
          name: 'blog_industry',
          label: 'Blog industry',
          // Multi-select (max 3): an article often serves a few related
          // verticals. Stored as string[]; surfaces under each industry facet on
          // /blog. Leave empty for horizontal/all-industry content.
          type: 'multi_select',
          options: INDUSTRY_VALUES,
          optionLabels: INDUSTRY_LABELS,
          maxItems: 3,
        },
        { name: 'blog_tags', label: 'Blog tags', type: 'tags' },
        { name: 'featured_post', label: 'Featured post', type: 'boolean' },
        { name: 'related_posts', label: 'Related posts', type: 'multi_reference', referenceCollection: 'blog_posts' },
        // blog-field-trim (2026-06-28): removed `series_ref`, the `lead_magnet_*`
        // trio, `target_persona`, `table_of_contents_enabled`, and the
        // `detail_*` CTA trio (`detail_lead_capture_form_id`,
        // `detail_sticky_side_cta_label`, `detail_sticky_side_cta_link`) — all dead
        // fields (no renderer, schema, or listing read them). Per-post CTAs are
        // handled by a CTA page-block (Blocks tab), which renders and is fully
        // editable; an always-on CTA collided with that block in the layout.
        // FIX-047: removed `indexable` + `noindex` per-post booleans — use the
        // `robots_meta` select in the SEO tab (single source of truth).
        // reading_time is auto-computed at save time (~200 wpm) and stored back into the doc;
        // editors do not see this field — it is added to legacyAliases below.
      ],
    },
  },
  {
    key: 'glossary_terms',
    label: 'Glossaries',
    singularLabel: 'Glossary Term',
    description: 'Definitions, related concepts, and explanatory content.',
    template: 'Glossary term template',
    routePattern: '/glossary/[slug]',
    listingRoute: '/glossary',
    titleField: 'term',
    slugField: 'slug',
    defaultSchemaType: 'DefinedTerm',
    sections: {
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true, placeholder: 'corporate-tax' },
        { name: 'term', label: 'Term', type: 'text', required: true },
        { name: 'definition_short', label: 'Description', type: 'textarea', required: true },
        { name: 'term_category', label: 'Category', type: 'select', options: CONTENT_CATEGORY_OPTIONS, optionLabels: CONTENT_CATEGORY_LABELS },
        // glossary-trim (2026-06-28): removed alphabet_letter, synonyms, faq_items,
        // example_usage, applicability_region, featured — all dead. parseGlossaryTerm
        // strips them and no renderer/listing reads them. The live FAQ field is the
        // AEO `faqItems` JSON; the live category filter is `term_category`.
        { name: 'related_terms', label: 'Related terms', type: 'multi_reference', referenceCollection: 'glossary_terms' },
      ],
    },
  },
  {
    key: 'tools',
    label: 'Tools',
    singularLabel: 'Tool',
    description: 'Interactive tools, calculators, and checkers.',
    template: 'Tool landing + CTA template',
    // FIX-048: dedicated `/tools/[slug]` route does not exist and the generic
    // /content/ route would dump raw Firestore JSON (no renderTemplate
    // branch); collection is now blocklisted. Admin-editable only.
    titleField: 'tool_name',
    slugField: 'slug',
    defaultSchemaType: 'SoftwareApplication',
    routePattern: '/tools/[slug]',
    listingRoute: '/tools',
    sections: {
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'tool_name', label: 'Tool name', type: 'text', required: true },
        { name: 'tool_type', label: 'Tool type', type: 'select', options: ['calculator', 'checker', 'estimator', 'generator', 'quiz'], required: true },
        { name: 'short_description', label: 'Short description', type: 'textarea', required: true },
        { name: 'full_description', label: 'Full description', type: 'textarea' },
        { name: 'icon', label: 'Icon', type: 'icon' },
        { name: 'hero_image', label: 'Hero image', type: 'image' },
        { name: 'tool_embed_type', label: 'Embed type', type: 'select', options: ['custom_component', 'iframe', 'script'], required: true },
        { name: 'tool_embed_code', label: 'Embed code', type: 'textarea' },
        { name: 'tool_route_key', label: 'Tool route key', type: 'text', required: true },
        { name: 'primary_inputs', label: 'Primary inputs', type: 'json', placeholder: '[{...}]' },
        { name: 'output_description', label: 'Output description', type: 'textarea' },
        { name: 'benefits', label: 'Benefits', type: 'json', placeholder: '["..."]' },
        { name: 'faq_items', label: 'FAQ items', type: 'multi_reference', referenceCollection: 'faqs' },
        { name: 'related_services', label: 'Related services', type: 'tags' },
        { name: 'gated', label: 'Gated', type: 'boolean' },
        { name: 'lead_capture_enabled', label: 'Lead capture enabled', type: 'boolean' },
        { name: 'hub_group', label: 'Hub group', type: 'select', options: ['Calculators', 'Benchmarks & Checks'], required: true },
        { name: 'cta_headline', label: 'CTA headline', type: 'text', placeholder: 'We will file it for you' },
        { name: 'gated_output_label', label: 'Gated output button label', type: 'text', placeholder: 'Email me the full breakdown' },
        { name: 'lead_magnet_description', label: 'Lead magnet description', type: 'textarea', placeholder: 'What the gated result delivers.' },
        { name: 'related_service_url', label: 'Related service URL', type: 'url', placeholder: '/vat-filing-uae' },
        { name: 'related_service_label', label: 'Related service label', type: 'text', placeholder: 'Get VAT filing done' },
      ],
    },
  },
  {
    key: 'customer_reviews',
    label: 'Customer Reviews',
    singularLabel: 'Customer Review',
    description: 'Testimonials and social proof snippets.',
    template: 'Review quote template',
    // reviews-trim (2026-06-28): embedded-testimonials only. Blocklisted from the
    // generic /content route (no standalone page). titleField is the customer name.
    titleField: 'customer_name',
    slugField: 'slug',
    defaultSchemaType: 'Review',
    sections: {
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'customer_name', label: 'Customer name', type: 'text', required: true },
        { name: 'customer_designation', label: 'Customer designation', type: 'text' },
        { name: 'company', label: 'Company', type: 'text' },
        { name: 'rating', label: 'Rating (1-5)', type: 'number' },
        { name: 'review_text', label: 'Review text', type: 'textarea', required: true },
        { name: 'video_review_url', label: 'Video review URL', type: 'url' },
        { name: 'customer_photo', label: 'Customer photo', type: 'image' },
        { name: 'company_logo_override', label: 'Company logo', type: 'image' },
        // reviews-trim (2026-06-28): controlled multi-select so testimonial sections
        // can be filtered by service. Shares the blog/glossary service taxonomy.
        { name: 'service_category', label: 'Services', type: 'multi_select', options: CONTENT_CATEGORY_OPTIONS, optionLabels: CONTENT_CATEGORY_LABELS },
        { name: 'approved_for_publication', label: 'Approved for publication', type: 'boolean', required: true },
        { name: 'featured', label: 'Featured', type: 'boolean' },
      ],
    },
  },
  {
    key: 'podcasts',
    label: 'Podcasts',
    singularLabel: 'Podcast Episode',
    description: 'Podcast episodes with streaming links.',
    template: 'Podcast episode template',
    // FIX-048: dedicated `/podcasts/[slug]` route does not exist. Doc is
    // renderable via the generic `/content/podcasts/[slug]` route.
    titleField: 'episode_title',
    slugField: 'slug',
    defaultSchemaType: 'PodcastEpisode',
    sections: {
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'episode_title', label: 'Episode title', type: 'text', required: true },
        { name: 'episode_number', label: 'Episode number', type: 'number' },
        { name: 'podcast_name', label: 'Podcast name', type: 'text', required: true },
        { name: 'audio_url', label: 'Audio URL', type: 'url', required: true },
        { name: 'embed_code', label: 'Embed code', type: 'textarea' },
        { name: 'thumbnail_image', label: 'Thumbnail image', type: 'image' },
        { name: 'duration', label: 'Duration', type: 'text' },
        { name: 'publish_date', label: 'Publish date', type: 'datetime', required: true },
        { name: 'hosts', label: 'Hosts', type: 'multi_reference', referenceCollection: 'team_members' },
        { name: 'guests', label: 'Guests', type: 'tags' },
        { name: 'episode_summary', label: 'Episode summary', type: 'textarea', required: true },
        { name: 'show_notes', label: 'Show notes', type: 'textarea' },
        { name: 'transcript', label: 'Transcript', type: 'textarea' },
        { name: 'key_topics', label: 'Key topics', type: 'tags' },
        { name: 'related_resources', label: 'Related resources', type: 'multi_reference', referenceCollection: 'blog_posts' },
      ],
    },
  },
  {
    key: 'faqs',
    label: 'FAQs',
    singularLabel: 'FAQ',
    description: 'Question/answer entries grouped by topic.',
    template: 'FAQ accordion item template',
    // FIX-048: dedicated `/faq/[slug]` route does not exist. Doc is renderable
    // via the generic `/content/faqs/[slug]` route; FAQs are typically
    // embedded as accordion blocks on other pages rather than as standalone
    // detail pages.
    titleField: 'question',
    slugField: 'slug',
    defaultSchemaType: 'Question',
    sections: {
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'question', label: 'Question', type: 'text', required: true },
        { name: 'answer', label: 'Answer', type: 'textarea', required: true },
        // FAQ categorization axis — pick one or more services, or "General" for
        // FAQs not tied to a service. Shares the blog/glossary/reviews taxonomy
        // (CONTENT_CATEGORY_OPTIONS); drives /faq filtering + the service-filtered
        // FAQ block. (Replaced free-text `topic` + `related_service`, 2026-06-28.)
        { name: 'service_category', label: 'Services', type: 'multi_select', options: CONTENT_CATEGORY_OPTIONS, optionLabels: CONTENT_CATEGORY_LABELS },
        { name: 'featured', label: 'Featured', type: 'boolean' },
        { name: 'sort_order', label: 'Sort order', type: 'number', min: 0 },
      ],
    },
  },
  {
    key: 'customer_stories',
    label: 'Customer Stories',
    singularLabel: 'Customer Story',
    description: 'Detailed case studies and customer outcomes.',
    template: 'Story/case-study template',
    // FIX-048: dedicated `/stories/[slug]` route does not exist. Doc is
    // renderable via the generic `/content/customer_stories/[slug]` route.
    titleField: 'story_title',
    slugField: 'slug',
    defaultSchemaType: 'Article',
    sections: {
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'story_title', label: 'Story title', type: 'text', required: true },
        { name: 'customer', label: 'Customer', type: 'text', required: true },
        { name: 'industry', label: 'Industry', type: 'select', options: INDUSTRY_VALUES, optionLabels: INDUSTRY_LABELS, required: true },
        { name: 'region', label: 'Region', type: 'text' },
        { name: 'hero_image', label: 'Hero image', type: 'image' },
        { name: 'challenge_summary', label: 'Challenge summary', type: 'textarea', required: true },
        { name: 'solution_summary', label: 'Solution summary', type: 'textarea', required: true },
        { name: 'results_summary', label: 'Results summary', type: 'textarea', required: true },
        { name: 'metrics_highlights', label: 'Metrics highlights', type: 'json', placeholder: '[{"label":"...","value":"..."}]' },
        { name: 'full_story_body', label: 'Full story body', type: 'textarea', required: true },
        { name: 'services_used', label: 'Services used', type: 'tags' },
        { name: 'testimonial_reference', label: 'Testimonial reference', type: 'multi_reference', referenceCollection: 'customer_reviews' },
        { name: 'featured', label: 'Featured', type: 'boolean' },
        { name: 'publish_date', label: 'Publish date', type: 'datetime', required: true },
      ],
    },
  },
  {
    key: 'ebooks',
    label: 'Ebooks',
    singularLabel: 'Ebook',
    description: 'Downloadable long-form guides and lead magnets.',
    template: 'Ebook listing + download template',
    // ebook-landing (2026-06-28): ebooks publish to a dedicated public route at
    // `/guides/[slug]` (hub at `/guides`) — NOT the generic `/content`
    // route, which stays blocklisted (SENSITIVE_GENERIC_ROUTE_BLOCKLIST) so the
    // raw doc (incl. download URLs) is never dumped. routePattern/listingRoute
    // below auto-wire revalidation + sitemap + llms.txt + the admin preview link.
    // Gated download URLs are delivered only by `/api/guides/lead` after a
    // lead capture; the public read model omits them (see ebooksRepository.ts).
    titleField: 'ebook_title',
    slugField: 'slug',
    routePattern: '/guides/[slug]',
    listingRoute: '/guides',
    defaultSchemaType: 'Book',
    sections: {
      // ebook-trim (2026-06-28): admin-only lead-magnet catalog — only the fields
      // an editor needs to catalog a downloadable. Removed: `short_description`
      // (required + stripped — the D.3 required-but-hidden bug), `file_size`
      // (low-value download metadata), `author` (→ `authorRefs` relation),
      // `form_embed` + `thank_you_page_url` (gating is owned by the Download
      // page-block's formId, not the catalog record), and `related_content`
      // (→ `relatedBlogRefs` relation).
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'ebook_title', label: 'Ebook title', type: 'text', required: true },
        { name: 'cover_image', label: 'Cover image', type: 'image', required: true },
        { name: 'full_description', label: 'Full description', type: 'textarea' },
        { name: 'file_upload', label: 'File upload', type: 'file', required: true },
        { name: 'page_count', label: 'Page count', type: 'number' },
        { name: 'format', label: 'Format', type: 'select', options: ['pdf', 'ebook', 'guide'], required: true },
        { name: 'topics', label: 'Topics', type: 'tags' },
        { name: 'gated', label: 'Gated download', type: 'boolean' },
        { name: 'featured', label: 'Featured', type: 'boolean' },
      ],
    },
  },
  {
    key: 'webinars',
    label: 'Webinars',
    singularLabel: 'Webinar',
    description: 'Promote-then-replay webinar pages. One URL, two lifecycle states.',
    template: 'Webinar registration + replay template',
    // webinar-revamp (2026-06-28): dedicated state-driven route at `/webinars/[slug]`
    // (hub at `/webinars`). The page renders registration when `webinar_status` is
    // upcoming/live and the on-demand replay + gated downloads when completed — the
    // editor "converts" the page by flipping the status on the same doc. routePattern
    // + listingRoute auto-wire revalidation + sitemap + llms.txt + the preview link.
    titleField: 'webinar_title',
    slugField: 'slug',
    routePattern: '/webinars/[slug]',
    listingRoute: '/webinars',
    defaultSchemaType: 'Event',
    sections: {
      // Grouped for the editor: identity → schedule → platform/host →
      // registration → post-event → content. `speakers` lives in the Relations
      // tab as `speakerRefs` (canonical); related blogs/webinars too.
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        {
          name: 'webinar_status',
          label: 'Webinar status',
          type: 'select',
          options: ['upcoming', 'live', 'completed'],
          required: true,
          defaultValue: 'upcoming',
          description: 'Drives the page. upcoming/live → promo + registration; completed → on-demand replay + downloads on the SAME URL.',
        },
        { name: 'webinar_title', label: 'Webinar title', type: 'text', required: true },
        { name: 'banner_image', label: 'Banner image', type: 'image' },
        { name: 'summary', label: 'Summary', type: 'textarea', placeholder: 'One-line hook for the hub card and hero subheading.' },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'What attendees will learn. Basic HTML allowed (sanitized).' },
        { name: 'start_datetime', label: 'Start datetime', type: 'datetime', required: true },
        { name: 'end_datetime', label: 'End datetime', type: 'datetime' },
        {
          name: 'timezone',
          label: 'Timezone',
          type: 'select',
          required: true,
          defaultValue: 'Asia/Dubai',
          // IANA zone ids — the value drives `formatWebinarDate()` so the public
          // page shows the start/end time in the right zone (real offsets, not
          // free text). UAE/GCC first, then common attendee zones.
          options: [
            'Asia/Dubai',
            'Asia/Riyadh',
            'Asia/Qatar',
            'Asia/Kuwait',
            'Asia/Bahrain',
            'Asia/Muscat',
            'Asia/Kolkata',
            'Asia/Karachi',
            'Asia/Singapore',
            'Europe/London',
            'Europe/Paris',
            'America/New_York',
            'America/Los_Angeles',
            'UTC',
          ],
          optionLabels: {
            'Asia/Dubai': 'Dubai — GST (UTC+4)',
            'Asia/Riyadh': 'Riyadh — AST (UTC+3)',
            'Asia/Qatar': 'Doha — AST (UTC+3)',
            'Asia/Kuwait': 'Kuwait — AST (UTC+3)',
            'Asia/Bahrain': 'Manama — AST (UTC+3)',
            'Asia/Muscat': 'Muscat — GST (UTC+4)',
            'Asia/Kolkata': 'India — IST (UTC+5:30)',
            'Asia/Karachi': 'Pakistan — PKT (UTC+5)',
            'Asia/Singapore': 'Singapore — SGT (UTC+8)',
            'Europe/London': 'London — GMT/BST',
            'Europe/Paris': 'Central Europe — CET/CEST',
            'America/New_York': 'US Eastern — ET',
            'America/Los_Angeles': 'US Pacific — PT',
            UTC: 'UTC',
          },
          description: 'Drives how the start/end time is displayed to visitors.',
        },
        { name: 'platform', label: 'Platform', type: 'select', options: ['zoho', 'zoom', 'meet', 'teams', 'other'] },
        { name: 'host_partner_name', label: 'Co-host / partner name', type: 'text', placeholder: 'Only for collab webinars' },
        { name: 'host_partner_logo', label: 'Co-host / partner logo', type: 'image' },
        // Registration
        {
          name: 'registration_mode',
          label: 'Registration mode',
          type: 'select',
          options: ['native', 'external'],
          defaultValue: 'native',
          description: 'native = capture the lead on our page (Zoho CRM + confirmation email). external = send visitors to a partner-hosted registration URL.',
        },
        { name: 'registration_url', label: 'External registration URL', type: 'url', placeholder: 'Used only when registration mode is External' },
        { name: 'join_url', label: 'Join link', type: 'url', placeholder: 'Emailed to registrants on native registration' },
        {
          name: 'service_interest',
          label: 'Service interest (CRM)',
          type: 'select',
          options: CONTENT_CATEGORY_OPTIONS,
          optionLabels: CONTENT_CATEGORY_LABELS,
          description: 'Tags the Zoho CRM lead created on registration.',
        },
        // Post-event
        { name: 'recording_url', label: 'Recording URL', type: 'url', placeholder: 'On-demand replay (shown when Completed). Plays openly.' },
        {
          name: 'downloadable_resources',
          label: 'Downloadable resources',
          type: 'multi_reference',
          referenceCollection: 'ebooks',
          description: 'Gated slides/templates — reuses the resources download gate (email required). Add them as Resources first.',
        },
        // Content
        { name: 'agenda_items', label: 'Agenda items', type: 'json', placeholder: '["09:00 — Intro", "09:15 — UAE CT basics"]' },
        { name: 'key_topics', label: 'Key topics', type: 'tags' },
        { name: 'featured', label: 'Featured', type: 'boolean' },
      ],
    },
  },
  {
    key: 'team_members',
    label: 'Team Members',
    singularLabel: 'Team Member',
    description: 'People profiles for leadership and team pages.',
    template: 'Team card/profile template',
    // FIX-048: dedicated `/team/[slug]` route does not exist; collection is
    // blocklisted from the generic /content/ route to avoid leaking
    // contact PII. Admin-editable only.
    titleField: 'full_name',
    slugField: 'slug',
    defaultSchemaType: 'Person',
    sections: {
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        // FIX-047: removed status override. Inherits the global 3-state set.
        { name: 'full_name', label: 'Full name', type: 'text', required: true },
        { name: 'photo', label: 'Photo', type: 'image' },
        { name: 'job_title', label: 'Job title', type: 'text', required: true },
        {
          name: 'department',
          label: 'Department',
          type: 'select',
          options: [
            'Management',
            'Centre of Excellence',
            'Marketing',
            'Sales',
            'Partnerships',
            'HR',
            'Tech and Product',
            'FinOps',
            'Taxation',
            'Compliance',
            'Legal',
            'Internal Finance',
          ],
        },
        { name: 'short_bio', label: 'Short bio', type: 'textarea' },
        { name: 'full_bio', label: 'Full bio', type: 'textarea' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone', label: 'Phone', type: 'text' },
        { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
        { name: 'twitter_url', label: 'Twitter URL', type: 'url' },
        { name: 'instagram_url', label: 'Instagram URL', type: 'url' },
        { name: 'website_url', label: 'Website URL', type: 'url' },
        { name: 'expertise_tags', label: 'Expertise tags', type: 'tags' },
        { name: 'sort_order', label: 'Sort order', type: 'number', min: 0 },
      ],
    },
  },
]

/**
 * FIX-009: single map governs per-collection field hiding. Two sub-keys:
 *   - `legacyAliases`: deprecated field names that may still exist in older docs
 *     but should never render in the admin form. Used by the publish merger to
 *     strip them after `globalCoreFields()` is unioned with the per-collection
 *     publish fields. Distinct from `strip` because legacy aliases are typically
 *     CAMEL-cased duplicates of currently-canonical snake_case fields.
 *   - `strip`: globally-defined publish fields that are inapplicable for this
 *     collection (e.g. `updated_at` is server-managed; `categories` is replaced
 *     by `blog_category` for blogs).
 */
type CmsHiddenFields = { legacyAliases: string[]; strip: string[] }

// Marketing page-layout fields injected into every collection by
// globalContentLayoutFields(). Profile/label collections that have no public
// route never render a hero or long-form body, so they strip the whole set.
const PROFILE_LAYOUT_STRIP = [
  'hero_heading',
  'hero_subheading',
  'body',
  'sections',
  'sidebar_cta_enabled',
  'primary_cta_variant',
  'template_variant',
]

const HIDDEN_FIELDS_BY_COLLECTION: Partial<Record<CmsCollectionKey, CmsHiddenFields>> = {
  blog_posts: {
    legacyAliases: ['authorName', 'heroImageUrl', 'bodyHtml', 'category'],
    // CMO-redesign: strip list applies across ALL sections.
    strip: [
      // FIX-028 publish duplicates
      'updated_at',
      'published_at',
      'categories',
      'tags',
      'short_description',
      'related_content',
      // blog-field-trim (2026-06-28): redundant with featured_image / no icon
      // concept for an article. Global fields, so stripped (not deleted).
      'thumbnail_image',
      'icon',
      // Status is owned by the header workflow buttons (EditorStatusControls);
      // the sidebar select is a phantom input the server ignores (see the status
      // precedence block in saveCmsDocumentAction). Strip the duplicate.
      'status',
      // FIX-036: canonical relation is `relatedPostRefs` (relations); `related_posts` in publish is stripped.
      // NOTE: we keep the new blog_posts `related_posts` in publish (which is the canonical
      // editor-facing field) — the strip removes the *global-core* `related_content` only.
      // SEO trim: twitter handle is org-wide.
      'twitter_creator_handle',
      // AEO trim: keep only directAnswer + faqItems for blog_posts.
      'answerSnippet',
      'howToSteps',
      'speakableContent',
      // GEO trim: keep citations / keyStatistics / expertQuotes only; drop the rest.
      'relatedEntities',
      'regionsCovered',
      'languagesCovered',
      // Universal CTA duplicates — blog lead capture uses the detail_* sticky-CTA group.
      'cta_label',
      'cta_link',
      // Universal "featured" boolean is a duplicate of the publish-section `featured_post`.
      'featured',
      // sort_order is publish_date for blog_posts; manual override is misleading.
      'sort_order',
      // Universal globalContentLayoutFields fields that aren't useful for editorial posts.
      'hero_heading',
      'hero_subheading',
      'sections',
      'sidebar_cta_enabled',
      'primary_cta_variant',
      'template_variant',
      // Universal relations: hero image asset ref duplicates featured_image.
      'heroImageAssetRef',
      // Card section disappears via SUPPRESSED_SECTIONS_BY_COLLECTION; card_* names
      // listed here as a belt-and-braces guard if suppression is ever toggled off.
      'card_description',
      'card_image',
    ],
  },
  glossary_terms: {
    legacyAliases: ['definition', 'bodyHtml', 'relatedSlugs'],
    // FIX-036: `related_terms` moves to strip so `relatedTermRefs` (relations) is canonical.
    // `body` is stripped — glossary long-form renders from imported `bodyHtml`; the
    // editor `definition_full` field was removed (glossary-trim 2026-06-28).
    // glossary-trim (2026-06-28): AEO keeps only `faqItems` (→ FAQPage JSON-LD); the
    // other AEO signals and the unused SEO fields are stripped. Wired SEO fields
    // (seo_title / meta_description / og_*) + canonical_url + robots_meta stay.
    strip: [
      'related_terms',
      'body',
      // AEO: keep faqItems only
      'directAnswer',
      'answerSnippet',
      'howToSteps',
      'speakableContent',
      // SEO: not consumed by the glossary route
      'focus_keyword',
      'meta_keywords',
      'secondary_keywords',
      'twitter_creator_handle',
      'faq_schema_enabled',
      'breadcrumbs_title',
      // glossary-trim (2026-06-28): global bloat irrelevant to a definition page.
      'status',            // header Save/Publish buttons own status
      'short_description', // duplicate of the Description (definition_short) field
      'categories',        // duplicate of term_category
      'cta_label',
      'cta_link',
      'hero_heading',
      'hero_subheading',
      'sections',
      'sidebar_cta_enabled',
      'primary_cta_variant',
      'template_variant',
      // minimal glossary (2026-06-28): a definition page has no excerpt / image /
      // author / CTA; `updated_at` is a server-managed automated field; `icon`,
      // `sort_order`, `tags`, `related_content` are unused. Fully minimal editor.
      'excerpt',
      'featured_image',
      'thumbnail_image',
      'icon',
      'author',
      'published_at',
      'updated_at',
      'sort_order',
      'tags',
      'related_content',
    ],
  },
  // FIX-028 strip lists below come from the per-collection findings (STORY-003, TOOL-005, etc.).
  tools: {
    legacyAliases: ['name', 'description', 'toolUrl', 'iconUrl'],
    strip: ['title', 'excerpt', 'thumbnail_image', 'author', 'published_at', 'sort_order', 'tags', 'categories', 'related_content', 'cta_label', 'cta_link'],
  },
  customer_reviews: {
    legacyAliases: ['title', 'quote', 'reviewerName', 'reviewerRole', 'companyName'],
    // reviews-trim (2026-06-28): embedded-testimonials only — strip everything that
    // isn't part of the testimonial card. status is the header control; `title` is
    // dropped via the custom titleField (customer_name).
    strip: [
      'excerpt',
      'short_description',
      'featured_image',
      'thumbnail_image',
      'icon',
      'author',
      'published_at',
      'updated_at',
      'sort_order',
      'tags',
      'categories',
      'related_content',
      'cta_label',
      'cta_link',
      'status',
      'hero_heading',
      'hero_subheading',
      'body',
      'sections',
      'sidebar_cta_enabled',
      'primary_cta_variant',
      'template_variant',
    ],
  },
  podcasts: {
    legacyAliases: ['title', 'summary', 'audioUrl', 'platformUrls'],
    // podcast-trim (2026-06-28): keeps the episode fields (audio_url / embed_code,
    // episode_summary, show_notes, transcript, hosts, guests, duration,
    // episode_number, key_topics, related_resources, featured_image). Strips
    // generic bloat: `status` is header-owned; server timestamps; `sort_order` +
    // generic `tags` (key_topics is the episode tag field and there's no podcast
    // listing to sort); the dead marketing page-layout fields; `body`
    // (episode_summary + show_notes + page_blocks carry the content); the org-wide
    // twitter handle. card/listing/detail/aeo/geo are dropped via
    // SUPPRESSED_SECTIONS_BY_COLLECTION below.
    strip: [
      'excerpt', 'short_description', 'thumbnail_image', 'icon', 'author', 'categories', 'related_content', 'cta_label', 'cta_link',
      'status', 'published_at', 'updated_at', 'sort_order', 'tags',
      'hero_heading', 'hero_subheading', 'body', 'sections', 'sidebar_cta_enabled', 'primary_cta_variant', 'template_variant',
      'twitter_creator_handle',
    ],
  },
  faqs: {
    legacyAliases: [],
    // faq-trim (2026-06-28): FAQs are embed-only Q&A units — indexed via the
    // /faq page's auto FAQPage schema (built from question+answer) and embedded
    // on service pages via the FAQ block. `body` duplicates `answer`; `status`
    // is the header control; `tags` is superseded by `service_category`;
    // `updated_at` is server-managed. The marketing-layout block + every
    // non-publish section (card/listing/detail/blocks/relations/SEO/AEO/GEO) are
    // dead config — sections dropped via SUPPRESSED_SECTIONS_BY_COLLECTION.
    strip: [
      'title', 'excerpt', 'short_description', 'featured_image', 'thumbnail_image',
      'icon', 'author', 'published_at', 'updated_at', 'categories', 'related_content',
      'cta_label', 'cta_link', 'status', 'tags',
      ...PROFILE_LAYOUT_STRIP,
    ],
  },
  customer_stories: {
    legacyAliases: ['title', 'companyName', 'challenge', 'solution', 'results'],
    // Keeps the case-study fields the detail renderer surfaces: story_title / customer /
    // industry / region / challenge|solution|results / metrics_highlights /
    // full_story_body / services_used / testimonial_reference / hero_image / publish_date.
    // case-study-trim (2026-06-28): `status` is owned by the header Save/Publish controls
    // (the select is a phantom input); no thumbnail/icon concept (hero_image is the
    // visual); the marketing page-layout fields and the org-wide twitter handle are dead.
    // card/listing/detail/aeo/geo are dropped via SUPPRESSED_SECTIONS_BY_COLLECTION below.
    strip: [
      'excerpt', 'short_description', 'featured_image', 'body', 'published_at', 'tags', 'categories', 'related_content', 'cta_label', 'cta_link', 'author', 'sort_order', 'updated_at',
      'status', 'thumbnail_image', 'icon',
      'hero_heading', 'hero_subheading', 'sections', 'sidebar_cta_enabled', 'primary_cta_variant', 'template_variant',
      'twitter_creator_handle',
    ],
  },
  ebooks: {
    legacyAliases: ['title', 'summary', 'downloadUrl', 'coverImageUrl'],
    // ebook-trim (2026-06-28): ebooks are a catalog of downloadable lead magnets,
    // published to a gated landing page (/guides/[slug]). The record keeps the
    // catalog fields (cover_image, full_description, file_upload, page_count,
    // format, topics, gated, featured) + Authors (relations) + the SEO tab (the
    // landing page ranks/converts). `status` is the header Save/Publish control;
    // `cover_image` is the only visual (no featured_image / thumbnail / icon);
    // `topics` is the taxonomy (no categories / tags); the single `author` ref +
    // global `related_content` defer to the relations tab (`authorRefs` /
    // `relatedBlogRefs`). Server timestamps, sort_order, the universal CTAs, the
    // marketing page-layout fields, and the org-wide `twitter_creator_handle` are
    // dead here. card/listing/detail/blocks/AEO/GEO are dropped via
    // SUPPRESSED_SECTIONS_BY_COLLECTION below (SEO stays).
    strip: [
      'excerpt', 'short_description', 'featured_image', 'thumbnail_image', 'icon',
      'author', 'published_at', 'updated_at', 'categories', 'related_content',
      'cta_label', 'cta_link', 'sort_order', 'tags', 'status',
      'twitter_creator_handle',
      ...PROFILE_LAYOUT_STRIP,
    ],
  },
  webinars: {
    // `speakers` (publish) is a legacy alias of the canonical `speakerRefs` (relations);
    // `related_resources` superseded by relations `relatedBlogRefs`.
    legacyAliases: ['title', 'registrationUrl', 'hostName', 'speakers', 'related_resources'],
    // webinar-revamp (2026-06-28): the bespoke /webinars/[slug] template reads the
    // publish fields + relations + SEO directly. Strip the global editorial noise
    // (excerpt/author/CTA/marketing-layout) so the editor only sees webinar fields.
    // `status` is the header Save/Publish control; `updated_at` is server-managed;
    // `banner_image` is the only visual (no featured/thumbnail/icon); `key_topics`
    // is the tag axis (no generic tags); order is start_datetime + featured.
    strip: [
      'excerpt', 'short_description', 'featured_image', 'thumbnail_image', 'icon',
      'author', 'published_at', 'updated_at', 'categories', 'related_content',
      'cta_label', 'cta_link', 'tags', 'sort_order', 'status',
      'twitter_creator_handle',
      ...PROFILE_LAYOUT_STRIP,
    ],
  },
  team_members: {
    legacyAliases: ['name', 'role', 'bio', 'photoUrl', 'linkedinUrl', 'twitterUrl'],
    // From TEAM-003: keeps full_name / short_bio / photo / linkedin_url etc.
    // CLEANUP: team_members has no public route (FIX-048), so the marketing
    // page-layout fields (hero/body/CTA) and the generic `tags` (replaced by
    // `expertise_tags`) are pure noise. The SEO/AEO/GEO/blocks/card/listing/
    // detail/relations sections are suppressed in SUPPRESSED_SECTIONS_BY_COLLECTION.
    // `status` is driven by the header workflow control (not this select), and
    // `language` is meaningless for an internal profile — both are stripped.
    strip: ['title', 'excerpt', 'short_description', 'featured_image', 'thumbnail_image', 'icon', 'author', 'published_at', 'categories', 'related_content', 'cta_label', 'cta_link', 'updated_at', 'tags', 'status', 'language', ...PROFILE_LAYOUT_STRIP],
  },
  // FIX-022: media_assets is a utility (library), not editorial content. Strip
  // global publish fields that are meaningless here: locale/excerpt/featured-image
  // and the SEO/AEO/GEO/card/listing/detail/blocks/relations sections (handled
  // separately below).
  media_assets: {
    legacyAliases: [],
    strip: [
      'language',
      'excerpt',
      'short_description',
      'featured_image',
      'featured_image_url',
      'thumbnail_image',
      'icon',
      'author',
      'published_at',
      'updated_at',
      'sort_order',
      'categories',
      'tags',
      'related_content',
      'cta_label',
      'cta_link',
      'publish_date',
      'publish_at',
    ],
  },
}

/**
 * FIX-022: per-collection section suppression. Sections listed here are NOT
 * merged into the final `CmsCollectionDefinition.sections` for the given
 * collection. `media_assets` is a utility/library — SEO/AEO/GEO/card/listing/
 * detail/blocks/relations are all meaningless there.
 */
const SUPPRESSED_SECTIONS_BY_COLLECTION: Partial<Record<CmsCollectionKey, CmsSectionKey[]>> = {
  media_assets: ['card', 'listing', 'detail', 'blocks', 'relations', 'seo', 'aeo', 'geo'],
  // CLEANUP: profile/label collections have no public route, so card/listing/
  // detail/blocks/relations and the SEO/AEO/GEO answer-engine tabs never render
  // anywhere — drop them so the editor only sees the real fields.
  team_members: ['card', 'listing', 'detail', 'blocks', 'relations', 'seo', 'aeo', 'geo'],
  // CMO-redesign: card/listing duplicate publish + index settings respectively;
  // detail keeps only the three knobs promoted into publish above.
  blog_posts: ['card', 'listing', 'detail'],
  // glossary-trim (2026-06-28): the glossary detail route + custom listing read
  // none of these (parseGlossaryTerm strips them). SEO stays (wired below) and
  // AEO stays for `faqItems`; the rest are dead for a definition page.
  glossary_terms: ['card', 'listing', 'detail', 'blocks', 'relations', 'geo'],
  // reviews-trim (2026-06-28): embedded-testimonials only (blocklisted from
  // /content) — no standalone page, so every non-publish section is dead.
  customer_reviews: ['card', 'listing', 'detail', 'blocks', 'relations', 'seo', 'aeo', 'geo'],
  // case-study-trim (2026-06-28): the case-study renderer reads the publish fields
  // directly + page_blocks; there is no case-studies listing route (so `listing` is
  // dead config) and the generic detail route ignores the `detail_*` chrome. AEO/GEO
  // answer-engine signals add nothing to a case study. SEO + blocks + relations stay.
  customer_stories: ['card', 'listing', 'detail', 'aeo', 'geo'],
  // faq-trim (2026-06-28): embed-only Q&A — indexed via the /faq page's auto
  // FAQPage schema (from question+answer) and embedded on service pages via the
  // FAQ block. No standalone FAQ page is an SEO surface, so every non-publish
  // section (incl. SEO/AEO/GEO) is dead config.
  faqs: ['card', 'listing', 'detail', 'blocks', 'relations', 'seo', 'aeo', 'geo'],
  // podcast-trim (2026-06-28): no podcast listing route (so `listing` is dead
  // config) and the generic detail route ignores the `detail_*` chrome + `card`.
  // AEO/GEO answer-engine signals add nothing to an episode. SEO + blocks +
  // relations (related episodes) stay.
  podcasts: ['card', 'listing', 'detail', 'aeo', 'geo'],
  // ebook-trim (2026-06-28): lead-magnet catalog. The card/listing chrome,
  // detail_* knobs, page_blocks and the AEO/GEO answer-engine tabs add nothing to
  // a gated download. SEO STAYS — ebooks get a public gated landing page
  // (/guides/[slug]) that ranks + converts, so seo_title/meta/OG/canonical are
  // live. Publish catalog fields + Authors (relations) carry the content.
  ebooks: ['card', 'listing', 'detail', 'blocks', 'aeo', 'geo'],
  // webinar-revamp (2026-06-28): bespoke state-driven landing page (/webinars/[slug]).
  // Publish fields + relations (speakers / related) carry the content; SEO STAYS
  // (the page is an Event/VideoObject SEO surface). card/listing chrome, detail_*
  // knobs and the AEO/GEO tabs add nothing.
  // blocks-on-webinars (2026-06-28): page-builder ENABLED so editors can append
  // custom sections below the structured webinar content (rendered by
  // PageBlocksRenderer at the foot of /webinars/[slug]).
  webinars: ['card', 'listing', 'detail', 'aeo', 'geo'],
}

/**
 * schema-options-trim (2026-06-28): the schema-type override defaulted to all 19
 * schema.org types on every collection — most are nonsense for a given content
 * type (a blog post is never a `PodcastEpisode`). Each collection here narrows
 * the override dropdown to the types that actually apply; the leading "— none —"
 * (use the collection default) is added automatically. Collections absent from
 * this map fall back to the full catalogue. `media_assets`/`team_members`
 * suppress the blocks section entirely, so they're omitted.
 */
const SCHEMA_OVERRIDE_OPTIONS_BY_COLLECTION: Partial<Record<CmsCollectionKey, string[]>> = {
  blog_posts: ['Article', 'BlogPosting', 'NewsArticle', 'HowTo', 'FAQPage'],
  glossary_terms: ['DefinedTerm', 'Article', 'FAQPage'],
  faqs: ['Question', 'FAQPage', 'HowTo'],
  customer_stories: ['Article', 'NewsArticle', 'Review'],
  customer_reviews: ['Review'],
  tools: ['SoftwareApplication', 'Product', 'WebPage'],
  podcasts: ['PodcastEpisode', 'VideoObject', 'Article'],
  webinars: ['Event', 'VideoObject', 'Course'],
  // ebook-trim (2026-06-28): ebooks suppress the blocks section (no public page),
  // so the schema-type override never renders — omitted like media_assets/team_members.
  team_members: ['Person'],
}

export const CMS_COLLECTION_DEFINITIONS: CmsCollectionDefinition[] = CMS_COLLECTION_DEFINITIONS_BASE.map((definition) => {
  const cardFields = universalCardFields()
  const listingFields = universalListingFields()
  const detailFields = universalDetailFields()
  const blocksFields = universalBlocksFields(
    definition.defaultSchemaType,
    SCHEMA_OVERRIDE_OPTIONS_BY_COLLECTION[definition.key]
  )
  const relations = relationshipFields(RELATIONSHIPS[definition.key] ?? {})

  // FIX-026: content-layout fields are merged into publish (not aeo).
  const mergedPublish = mergeFieldSets(
    mergeFieldSets(globalCoreFields(), globalContentLayoutFields()),
    definition.sections.publish ?? []
  )
  const hidden = HIDDEN_FIELDS_BY_COLLECTION[definition.key] ?? { legacyAliases: [], strip: [] }
  // Strip list now applies to EVERY section, not just publish. This lets a
  // collection say "twitter_creator_handle isn't relevant for me" once and
  // have it removed from SEO; same pattern for AEO/GEO fields that only some
  // collections care about.
  const stripped = new Set<string>([...hidden.legacyAliases, ...hidden.strip])
  // title-required fix (2026-06-28): collections with a custom titleField (e.g.
  // glossary `term`, webinars `webinar_title`) don't render the global `title`, but
  // it stayed in the field set as `required` — so save validation demanded a value
  // the form never collected ("Title is required — fill it in, then publish"). The
  // titleField is the real title here; drop the redundant global `title`.
  if (definition.titleField !== 'title') stripped.add('title')
  const filter = (fields: CmsFieldDefinition[]) => fields.filter((f) => !stripped.has(f.name))

  const suppressed = new Set<CmsSectionKey>(SUPPRESSED_SECTIONS_BY_COLLECTION[definition.key] ?? [])
  const empty: CmsFieldDefinition[] = []

  return {
    ...definition,
    sections: {
      publish: filter(mergedPublish),
      card: suppressed.has('card') ? empty : filter(cardFields),
      listing: suppressed.has('listing') ? empty : filter(listingFields),
      detail: suppressed.has('detail') ? empty : filter(detailFields),
      blocks: suppressed.has('blocks') ? empty : filter(blocksFields),
      relations: suppressed.has('relations') ? empty : filter(relations),
      seo: suppressed.has('seo') ? empty : filter(globalSeoFields()),
      // FIX-026: aeo now contains only the five genuine AEO signals.
      aeo: suppressed.has('aeo') ? empty : filter(commonAeoFields()),
      geo: suppressed.has('geo') ? empty : filter(commonGeoFields()),
    },
  } satisfies CmsCollectionDefinition
})

export const CMS_COLLECTION_DEFINITION_MAP: Record<CmsCollectionKey, CmsCollectionDefinition> =
  Object.fromEntries(CMS_COLLECTION_DEFINITIONS.map((entry) => [entry.key, entry])) as Record<
    CmsCollectionKey,
    CmsCollectionDefinition
  >

export function getCmsCollectionDefinition(collection: string): CmsCollectionDefinition | null {
  return CMS_COLLECTION_DEFINITION_MAP[collection as CmsCollectionKey] ?? null
}

/**
 * FIX-029: single title-resolution helper for any CMS document.
 *
 * Reads the title field declared on the collection definition (now the source
 * of truth — `NORMALIZED_TITLE_FIELD_BY_COLLECTION` is deleted). Falls back
 * through a small set of well-known legacy aliases (`title`, `name`) so
 * pre-migration documents still produce a readable title in admin lists. The
 * final fallback is supplied by the caller (e.g. 'Untitled').
 */
export function resolveDocumentTitle(
  definition: Pick<CmsCollectionDefinition, 'titleField'>,
  doc: Record<string, unknown> | null | undefined,
  fallback = 'Untitled'
): string {
  if (!doc) return fallback
  const primary = doc[definition.titleField]
  if (typeof primary === 'string' && primary.trim()) return primary
  // Legacy aliases that some pre-migration docs still carry as the title.
  for (const alias of ['title', 'name'] as const) {
    if (alias === definition.titleField) continue
    const v = doc[alias]
    if (typeof v === 'string' && v.trim()) return v
  }
  return fallback
}

/**
 * Returns every field from every section in a stable order. Used by the admin
 * save action to know which keys to read from the form.
 */
export function getAllFields(definition: CmsCollectionDefinition): CmsFieldDefinition[] {
  const order: CmsSectionKey[] = ['publish', 'card', 'listing', 'detail', 'blocks', 'relations', 'seo', 'aeo', 'geo']
  const seen = new Set<string>()
  const out: CmsFieldDefinition[] = []
  for (const section of order) {
    for (const field of definition.sections[section] ?? []) {
      if (seen.has(field.name)) continue
      seen.add(field.name)
      out.push(field)
    }
  }
  return out
}

/**
 * Default values to seed when creating a new document. Lets editors land on a
 * sensible starting state (schema_type, robots_meta, listing layout, etc.).
 */
export function buildDefaultDocumentValues(definition: CmsCollectionDefinition): Record<string, unknown> {
  return {
    status: 'draft',
    language: 'en',
    // FIX-047: was `indexable: true, noindex: false` — collapsed into the
    // single `robots_meta` select. Default permits indexing + link following.
    robots_meta: 'index,follow',
    listing_search_enabled: true,
    listing_default_sort: 'newest',
    listing_layout: 'grid',
    listing_pagination_style: 'load_more',
    detail_breadcrumbs_enabled: true,
    detail_metadata_row_enabled: true,
    detail_social_share_enabled: true,
    detail_related_content_enabled: true,
    detail_related_content_mode: 'manual+auto',
    detail_template_variant: 'default',
    schema_type: definition.defaultSchemaType ?? 'WebPage',
    schema_type_override: '',
    page_blocks: [],
  }
}
