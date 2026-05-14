export type CmsCollectionKey =
  | 'media_assets'
  | 'videos'
  | 'our_customers'
  | 'tools'
  | 'review_sources'
  | 'customer_reviews'
  | 'podcasts'
  | 'faq_questions'
  | 'faq_topics'
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
  | 'json'
  | 'reference'
  | 'multi_reference'
  | 'blocks'

export type CmsFieldDefinition = {
  name: string
  label: string
  type: CmsFieldType
  placeholder?: string
  required?: boolean
  options?: string[]
  referenceCollection?: CmsCollectionKey
  // FIX-031: widened to `unknown` so future field types (e.g. blocks/json) can
  // carry typed defaults without casting. Callers must narrow before use.
  defaultValue?: unknown
  description?: string
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

// FIX-033: incoming references extracted to definitions/incomingReferences.ts.
export type { IncomingReferenceSpec } from "./definitions/incomingReferences"
export { CMS_INCOMING_REFERENCES } from "./definitions/incomingReferences"

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
      options: ['draft', 'scheduled', 'published', 'archived', 'in_review', 'approved'],
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
    { name: 'updated_at', label: 'Updated at', type: 'datetime', required: true },
    { name: 'sort_order', label: 'Sort order', type: 'number' },
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
    {
      name: 'twitter_card_type',
      label: 'Twitter card type',
      type: 'select',
      options: ['summary_large_image', 'summary', 'app', 'player'],
    },
    { name: 'twitter_creator_handle', label: 'Twitter creator handle', type: 'text', placeholder: '@finanshels' },
    {
      name: 'robots_meta',
      label: 'Robots meta',
      type: 'select',
      options: ['index,follow', 'noindex,follow', 'index,nofollow', 'noindex,nofollow'],
    },
    {
      name: 'schema_type',
      label: 'Schema type',
      type: 'select',
      options: [
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
      ],
    },
    { name: 'indexable', label: 'Indexable', type: 'boolean', required: true },
    { name: 'noindex', label: 'Noindex', type: 'boolean', required: true },
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
    {
      name: 'citations',
      label: 'Citations / sources JSON',
      type: 'json',
      placeholder: '[{"title":"...","url":"...","publisher":"..."}]',
    },
    {
      name: 'keyStatistics',
      label: 'Key statistics JSON',
      type: 'json',
      placeholder: '[{"stat":"...","source":"..."}]',
    },
    {
      name: 'expertQuotes',
      label: 'Expert quotes JSON',
      type: 'json',
      placeholder: '[{"quote":"...","name":"...","role":"..."}]',
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
    { name: 'sort_order', label: 'Sort order', type: 'number' },
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
 * Page-builder JSON storage. The structured editor compiles to this shape:
 * `[{ type: "hero", id, ...fields }, ...]`. Schema type override sits next to it.
 */
function universalBlocksFields(defaultSchemaType?: string): CmsFieldDefinition[] {
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
      options: [
        '',
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
      ],
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
    /** Author lives on the publish section as `author`; keep media + content-cluster links only here. */
    references: [{ name: 'heroImageAssetRef', label: 'Hero media asset', target: 'media_assets' }],
    multiReferences: [
      { name: 'relatedPostRefs', label: 'Related blog posts', target: 'blog_posts' },
      { name: 'relatedGlossaryRefs', label: 'Related glossary terms', target: 'glossary_terms' },
      { name: 'relatedFaqRefs', label: 'Related FAQ questions', target: 'faq_questions' },
    ],
  },
  glossary_terms: {
    multiReferences: [
      { name: 'relatedTermRefs', label: 'Related glossary terms', target: 'glossary_terms' },
      { name: 'relatedFaqRefs', label: 'Related FAQ questions', target: 'faq_questions' },
      { name: 'relatedBlogRefs', label: 'Related blog posts', target: 'blog_posts' },
      { name: 'relatedToolRefs', label: 'Related tools', target: 'tools' },
      { name: 'relatedVideoRefs', label: 'Related videos', target: 'videos' },
    ],
  },
  videos: {
    multiReferences: [
      { name: 'speakerRefs', label: 'Speakers / hosts', target: 'team_members' },
      { name: 'relatedBlogRefs', label: 'Related blog posts', target: 'blog_posts' },
      { name: 'relatedVideoRefs', label: 'Related videos', target: 'videos' },
      { name: 'relatedToolRefs', label: 'Related tools', target: 'tools' },
    ],
  },
  podcasts: {
    multiReferences: [
      { name: 'hostRefs', label: 'Hosts', target: 'team_members' },
      { name: 'guestRefs', label: 'Guests', target: 'team_members' },
      { name: 'relatedBlogRefs', label: 'Related blog posts', target: 'blog_posts' },
      { name: 'relatedPodcastRefs', label: 'Related episodes', target: 'podcasts' },
    ],
  },
  ebooks: {
    multiReferences: [
      { name: 'authorRefs', label: 'Authors', target: 'team_members' },
      { name: 'relatedBlogRefs', label: 'Related blog posts', target: 'blog_posts' },
      { name: 'relatedEbookRefs', label: 'Related ebooks', target: 'ebooks' },
      { name: 'relatedWebinarRefs', label: 'Related webinars', target: 'webinars' },
    ],
  },
  webinars: {
    references: [
      { name: 'recordingRef', label: 'Recording', target: 'videos' },
    ],
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
  faq_topics: {
    multiReferences: [
      { name: 'featuredQuestionRefs', label: 'Featured questions', target: 'faq_questions' },
      { name: 'relatedTopicRefs', label: 'Related topics', target: 'faq_topics' },
    ],
  },
  faq_questions: {
    references: [
      { name: 'topicRef', label: 'Topic', target: 'faq_topics' },
    ],
    multiReferences: [
      { name: 'relatedQuestionRefs', label: 'Related questions', target: 'faq_questions' },
      { name: 'relatedGlossaryRefs', label: 'Related glossary terms', target: 'glossary_terms' },
      { name: 'relatedBlogRefs', label: 'Related blog posts', target: 'blog_posts' },
    ],
  },
  customer_reviews: {
    references: [
      { name: 'customerRef', label: 'Customer', target: 'our_customers' },
      { name: 'sourceRef', label: 'Source', target: 'review_sources' },
    ],
    multiReferences: [
      { name: 'relatedStoryRefs', label: 'Related customer stories', target: 'customer_stories' },
    ],
  },
  customer_stories: {
    references: [
      { name: 'customerRef', label: 'Customer', target: 'our_customers' },
      { name: 'leadAuthorRef', label: 'Lead author', target: 'team_members' },
    ],
    multiReferences: [
      // `relatedBlogRefs` REMOVED — canonical is publish `related_blog_posts` (FIX-024).
      { name: 'reviewRefs', label: 'Related customer reviews', target: 'customer_reviews' },
      { name: 'relatedStoryRefs', label: 'Related customer stories', target: 'customer_stories' },
    ],
  },
  our_customers: {
    multiReferences: [
      { name: 'storyRefs', label: 'Customer stories', target: 'customer_stories' },
      { name: 'reviewRefs', label: 'Customer reviews', target: 'customer_reviews' },
    ],
  },
  review_sources: {
    multiReferences: [
      { name: 'reviewRefs', label: 'Reviews surfaced from this source', target: 'customer_reviews' },
    ],
  },
  team_members: {
    multiReferences: [
      { name: 'authoredBlogRefs', label: 'Authored blog posts', target: 'blog_posts' },
      { name: 'speakingVideoRefs', label: 'Speaking videos', target: 'videos' },
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
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published'], required: true },
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
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published'], required: true },
        { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
        { name: 'body', label: 'Body', type: 'textarea', required: true },
        { name: 'author', label: 'Author', type: 'reference', referenceCollection: 'team_members', required: true },
        { name: 'publish_date', label: 'Publish date', type: 'datetime', required: true },
        { name: 'reading_time', label: 'Reading time', type: 'number' },
        { name: 'blog_category', label: 'Blog category', type: 'text', required: true },
        { name: 'blog_tags', label: 'Blog tags', type: 'tags' },
        { name: 'table_of_contents_enabled', label: 'TOC enabled', type: 'boolean' },
        { name: 'featured_post', label: 'Featured post', type: 'boolean' },
        { name: 'related_posts', label: 'Related posts', type: 'multi_reference', referenceCollection: 'blog_posts' },
        { name: 'lead_magnet_cta', label: 'Lead magnet CTA', type: 'json', placeholder: '{"label":"...","href":"..."}' },
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
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published'], required: true },
        { name: 'term', label: 'Term', type: 'text', required: true },
        { name: 'definition_short', label: 'Definition short', type: 'textarea', required: true },
        { name: 'definition_full', label: 'Definition full', type: 'textarea', required: true },
        { name: 'term_category', label: 'Term category', type: 'text', required: true },
        { name: 'alphabet_letter', label: 'Alphabet letter', type: 'text', required: true, placeholder: 'A' },
        { name: 'synonyms', label: 'Synonyms', type: 'tags' },
        { name: 'related_terms', label: 'Related terms', type: 'multi_reference', referenceCollection: 'glossary_terms' },
        { name: 'faq_items', label: 'Related FAQs', type: 'multi_reference', referenceCollection: 'faq_questions' },
        { name: 'example_usage', label: 'Example usage', type: 'textarea' },
        { name: 'applicability_region', label: 'Applicability region', type: 'tags' },
        { name: 'featured', label: 'Featured', type: 'boolean' },
      ],
    },
  },
  {
    key: 'videos',
    label: 'Videos',
    singularLabel: 'Video',
    description: 'Video library content for landing pages and hubs.',
    template: 'Video card + detail template',
    routePattern: '/videos/[slug]',
    listingRoute: '/videos',
    titleField: 'title',
    slugField: 'slug',
    defaultSchemaType: 'VideoObject',
    sections: {
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published'], required: true },
        { name: 'video_platform', label: 'Video platform', type: 'select', options: ['youtube', 'vimeo', 'wistia', 'self_hosted'], required: true },
        { name: 'video_url', label: 'Video URL', type: 'url', required: true },
        { name: 'embed_code', label: 'Embed code', type: 'textarea' },
        { name: 'thumbnail_image', label: 'Thumbnail image', type: 'image', required: true },
        { name: 'duration', label: 'Duration', type: 'text' },
        { name: 'video_category', label: 'Video category', type: 'text', required: true },
        { name: 'speaker', label: 'Speaker', type: 'reference', referenceCollection: 'team_members' },
        { name: 'transcript', label: 'Transcript', type: 'textarea' },
        { name: 'summary', label: 'Summary', type: 'textarea' },
        { name: 'key_takeaways', label: 'Key takeaways', type: 'json', placeholder: '["..."]' },
        { name: 'related_resources', label: 'Related resources', type: 'multi_reference', referenceCollection: 'blog_posts' },
        { name: 'cta_link', label: 'CTA link', type: 'url' },
      ],
    },
  },
  {
    key: 'our_customers',
    label: 'Our Customers',
    singularLabel: 'Customer Profile',
    description: 'Company profiles and logos for trust sections.',
    template: 'Customer logo + profile template',
    routePattern: '/customers/[slug]',
    listingRoute: '/customers',
    titleField: 'company_name',
    slugField: 'slug',
    defaultSchemaType: 'Organization',
    sections: {
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published'], required: true },
        { name: 'company_name', label: 'Company name', type: 'text', required: true },
        { name: 'logo', label: 'Logo', type: 'image', required: true },
        { name: 'cover_image', label: 'Cover image', type: 'image' },
        { name: 'website_url', label: 'Website URL', type: 'url' },
        { name: 'industry', label: 'Industry', type: 'text' },
        { name: 'company_size', label: 'Company size', type: 'text' },
        { name: 'hq_location', label: 'HQ location', type: 'text' },
        { name: 'region', label: 'Region', type: 'tags' },
        { name: 'service_used', label: 'Service used', type: 'tags' },
        { name: 'relationship_type', label: 'Relationship type', type: 'select', options: ['customer', 'partner', 'featured_customer'], required: true },
        { name: 'summary', label: 'Summary', type: 'textarea' },
        { name: 'testimonial_reference', label: 'Testimonial reference', type: 'reference', referenceCollection: 'customer_reviews' },
        { name: 'story_reference', label: 'Story reference', type: 'reference', referenceCollection: 'customer_stories' },
        { name: 'is_featured', label: 'Is featured', type: 'boolean' },
      ],
    },
  },
  {
    key: 'tools',
    label: 'Tools',
    singularLabel: 'Tool',
    description: 'Interactive tools, calculators, and checkers.',
    template: 'Tool landing + CTA template',
    routePattern: '/tools/[slug]',
    listingRoute: '/tools',
    titleField: 'tool_name',
    slugField: 'slug',
    defaultSchemaType: 'SoftwareApplication',
    sections: {
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published'], required: true },
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
        { name: 'faq_items', label: 'FAQ items', type: 'multi_reference', referenceCollection: 'faq_questions' },
        { name: 'related_services', label: 'Related services', type: 'tags' },
        { name: 'gated', label: 'Gated', type: 'boolean' },
        { name: 'lead_capture_enabled', label: 'Lead capture enabled', type: 'boolean' },
      ],
    },
  },
  {
    key: 'review_sources',
    label: 'Reviews Sources',
    singularLabel: 'Review Source',
    description: 'Sources where public customer reviews are collected.',
    template: 'Review source list template',
    routePattern: '/reviews/sources/[slug]',
    listingRoute: '/reviews/sources',
    titleField: 'source_name',
    slugField: 'slug',
    defaultSchemaType: 'Organization',
    sections: {
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published'], required: true },
        { name: 'source_name', label: 'Source name', type: 'text', required: true },
        { name: 'source_logo', label: 'Source logo', type: 'image' },
        { name: 'source_url', label: 'Source URL', type: 'url', required: true },
        { name: 'source_type', label: 'Source type', type: 'select', options: ['google', 'clutch', 'trustpilot', 'g2', 'facebook', 'manual'], required: true },
        { name: 'average_rating', label: 'Average rating', type: 'number' },
        { name: 'review_count', label: 'Review count', type: 'number' },
        { name: 'rating_scale', label: 'Rating scale', type: 'number' },
        { name: 'display_label', label: 'Display label', type: 'text' },
        { name: 'is_featured', label: 'Is featured', type: 'boolean' },
        { name: 'last_synced_at', label: 'Last synced at', type: 'datetime' },
      ],
    },
  },
  {
    key: 'customer_reviews',
    label: 'Customer Reviews',
    singularLabel: 'Customer Review',
    description: 'Testimonials and social proof snippets.',
    template: 'Review quote template',
    routePattern: '/reviews/[slug]',
    listingRoute: '/reviews',
    titleField: 'review_title',
    slugField: 'slug',
    defaultSchemaType: 'Review',
    sections: {
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published'], required: true },
        { name: 'review_title', label: 'Review title', type: 'text' },
        { name: 'customer_name', label: 'Customer name', type: 'text', required: true },
        { name: 'customer_designation', label: 'Customer designation', type: 'text' },
        { name: 'company', label: 'Company', type: 'reference', referenceCollection: 'our_customers' },
        { name: 'review_source', label: 'Review source', type: 'reference', referenceCollection: 'review_sources' },
        { name: 'rating', label: 'Rating (1-5)', type: 'number' },
        { name: 'review_text', label: 'Review text', type: 'textarea', required: true },
        { name: 'video_review_url', label: 'Video review URL', type: 'url' },
        { name: 'customer_photo', label: 'Customer photo', type: 'image' },
        { name: 'company_logo_override', label: 'Company logo override', type: 'image' },
        { name: 'service_category', label: 'Service category', type: 'tags' },
        { name: 'industry', label: 'Industry', type: 'tags' },
        { name: 'location', label: 'Location', type: 'text' },
        { name: 'review_date', label: 'Review date', type: 'datetime' },
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
    routePattern: '/podcasts/[slug]',
    listingRoute: '/podcasts',
    titleField: 'episode_title',
    slugField: 'slug',
    defaultSchemaType: 'PodcastEpisode',
    sections: {
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published'], required: true },
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
    key: 'faq_questions',
    label: 'FAQ Questions',
    singularLabel: 'FAQ Question',
    description: 'Question/answer entries linked to FAQ topics.',
    template: 'FAQ accordion item template',
    routePattern: '/faq/[topic]/[slug]',
    listingRoute: '/faq',
    titleField: 'question',
    slugField: 'slug',
    defaultSchemaType: 'Question',
    sections: {
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published'], required: true },
        { name: 'question', label: 'Question', type: 'text', required: true },
        { name: 'answer', label: 'Answer', type: 'textarea', required: true },
        { name: 'faq_topic', label: 'FAQ topic', type: 'reference', referenceCollection: 'faq_topics', required: true },
        { name: 'related_service', label: 'Related service', type: 'tags' },
        { name: 'related_blog_posts', label: 'Related blog posts', type: 'multi_reference', referenceCollection: 'blog_posts' },
        { name: 'related_tools', label: 'Related tools', type: 'multi_reference', referenceCollection: 'tools' },
        { name: 'search_keywords', label: 'Search keywords', type: 'tags' },
        { name: 'featured', label: 'Featured', type: 'boolean' },
        { name: 'sort_order', label: 'Sort order', type: 'number' },
      ],
    },
  },
  {
    key: 'faq_topics',
    label: 'FAQ Topics',
    singularLabel: 'FAQ Topic',
    description: 'Topic groups for FAQ pages and internal linking.',
    template: 'FAQ topic template',
    routePattern: '/faq/[slug]',
    listingRoute: '/faq',
    titleField: 'topic_name',
    slugField: 'slug',
    defaultSchemaType: 'CollectionPage',
    sections: {
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published'], required: true },
        { name: 'topic_name', label: 'Topic name', type: 'text', required: true },
        { name: 'topic_description', label: 'Topic description', type: 'textarea' },
        { name: 'icon', label: 'Icon', type: 'icon' },
        { name: 'sort_order', label: 'Sort order', type: 'number' },
        { name: 'featured', label: 'Featured', type: 'boolean' },
        { name: 'related_services', label: 'Related services', type: 'tags' },
      ],
    },
  },
  {
    key: 'customer_stories',
    label: 'Customer Stories',
    singularLabel: 'Customer Story',
    description: 'Detailed case studies and customer outcomes.',
    template: 'Story/case-study template',
    routePattern: '/stories/[slug]',
    listingRoute: '/stories',
    titleField: 'story_title',
    slugField: 'slug',
    defaultSchemaType: 'Article',
    sections: {
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published'], required: true },
        { name: 'story_title', label: 'Story title', type: 'text', required: true },
        { name: 'customer', label: 'Customer', type: 'reference', referenceCollection: 'our_customers', required: true },
        { name: 'industry', label: 'Industry', type: 'tags', required: true },
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
    routePattern: '/ebooks/[slug]',
    listingRoute: '/ebooks',
    titleField: 'ebook_title',
    slugField: 'slug',
    defaultSchemaType: 'Book',
    sections: {
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published'], required: true },
        { name: 'ebook_title', label: 'Ebook title', type: 'text', required: true },
        { name: 'cover_image', label: 'Cover image', type: 'image', required: true },
        { name: 'short_description', label: 'Short description', type: 'textarea', required: true },
        { name: 'full_description', label: 'Full description', type: 'textarea' },
        { name: 'file_upload', label: 'File upload', type: 'file', required: true },
        { name: 'file_size', label: 'File size', type: 'text' },
        { name: 'page_count', label: 'Page count', type: 'number' },
        { name: 'format', label: 'Format', type: 'select', options: ['pdf', 'ebook', 'guide'], required: true },
        { name: 'topics', label: 'Topics', type: 'tags' },
        { name: 'author', label: 'Author', type: 'reference', referenceCollection: 'team_members' },
        { name: 'gated', label: 'Gated download', type: 'boolean' },
        { name: 'form_embed', label: 'Form embed', type: 'textarea' },
        { name: 'thank_you_page_url', label: 'Thank-you page URL', type: 'url' },
        { name: 'related_content', label: 'Related content', type: 'multi_reference', referenceCollection: 'blog_posts' },
        { name: 'featured', label: 'Featured', type: 'boolean' },
      ],
    },
  },
  {
    key: 'webinars',
    label: 'Webinars',
    singularLabel: 'Webinar',
    description: 'Live and on-demand webinar sessions.',
    template: 'Webinar listing template',
    routePattern: '/webinars/[slug]',
    listingRoute: '/webinars',
    titleField: 'webinar_title',
    slugField: 'slug',
    defaultSchemaType: 'Event',
    sections: {
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'scheduled', 'published', 'archived'], required: true },
        { name: 'webinar_status', label: 'Webinar status', type: 'select', options: ['upcoming', 'live', 'completed'], required: true },
        { name: 'webinar_title', label: 'Webinar title', type: 'text', required: true },
        { name: 'banner_image', label: 'Banner image', type: 'image' },
        { name: 'summary', label: 'Summary', type: 'textarea' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'start_datetime', label: 'Start datetime', type: 'datetime', required: true },
        { name: 'end_datetime', label: 'End datetime', type: 'datetime' },
        { name: 'timezone', label: 'Timezone', type: 'text', required: true },
        { name: 'registration_url', label: 'Registration URL', type: 'url' },
        { name: 'recording_url', label: 'Recording URL', type: 'url' },
        { name: 'platform', label: 'Platform', type: 'select', options: ['zoom', 'meet', 'teams', 'other'] },
        { name: 'speakers', label: 'Speakers', type: 'multi_reference', referenceCollection: 'team_members' },
        { name: 'agenda_items', label: 'Agenda items', type: 'json', placeholder: '["..."]' },
        { name: 'key_topics', label: 'Key topics', type: 'tags' },
        { name: 'related_resources', label: 'Related resources', type: 'multi_reference', referenceCollection: 'blog_posts' },
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
    routePattern: '/team/[slug]',
    listingRoute: '/team',
    titleField: 'full_name',
    slugField: 'slug',
    defaultSchemaType: 'Person',
    sections: {
      publish: [
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published'], required: true },
        { name: 'full_name', label: 'Full name', type: 'text', required: true },
        { name: 'photo', label: 'Photo', type: 'image', required: true },
        { name: 'job_title', label: 'Job title', type: 'text', required: true },
        { name: 'department', label: 'Department', type: 'text' },
        { name: 'short_bio', label: 'Short bio', type: 'textarea', required: true },
        { name: 'full_bio', label: 'Full bio', type: 'textarea' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone', label: 'Phone', type: 'text' },
        { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
        { name: 'twitter_url', label: 'Twitter URL', type: 'url' },
        { name: 'website_url', label: 'Website URL', type: 'url' },
        { name: 'location', label: 'Location', type: 'text' },
        { name: 'expertise_tags', label: 'Expertise tags', type: 'tags' },
        { name: 'display_on_team_page', label: 'Display on team page', type: 'boolean', required: true },
        { name: 'display_as_author', label: 'Display as author', type: 'boolean', required: true },
        { name: 'sort_order', label: 'Sort order', type: 'number' },
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

const HIDDEN_FIELDS_BY_COLLECTION: Partial<Record<CmsCollectionKey, CmsHiddenFields>> = {
  blog_posts: {
    legacyAliases: ['authorName', 'heroImageUrl', 'bodyHtml', 'category'],
    // FIX-028: removes per-author server-managed and duplicate fields.
    // FIX-036: `related_posts` moves to legacyAliases so `relatedPostRefs` (relations) becomes canonical.
    strip: ['updated_at', 'published_at', 'categories', 'tags', 'short_description', 'related_content', 'related_posts'],
  },
  glossary_terms: {
    legacyAliases: ['definition', 'bodyHtml', 'relatedSlugs'],
    // FIX-036: `related_terms` moves to strip so `relatedTermRefs` (relations) is canonical.
    // FIX-036: `body` is stripped because the canonical long-form glossary field is `definition_full`.
    strip: ['related_terms', 'body'],
  },
  // FIX-028 strip lists below come from the per-collection findings (STORY-003, TOOL-005, etc.).
  videos: {
    legacyAliases: ['videoUrl', 'thumbnailUrl', 'durationMinutes'],
    strip: ['title', 'excerpt', 'short_description', 'thumbnail_image', 'icon', 'author', 'published_at', 'categories', 'related_content', 'cta_label', 'cta_link'],
  },
  our_customers: { legacyAliases: ['companyName', 'logoUrl'], strip: ['title', 'excerpt', 'short_description', 'thumbnail_image', 'icon', 'author', 'published_at', 'categories', 'related_content'] },
  tools: {
    legacyAliases: ['name', 'description', 'toolUrl', 'iconUrl'],
    strip: ['title', 'excerpt', 'thumbnail_image', 'author', 'published_at', 'sort_order', 'tags', 'categories', 'related_content', 'cta_label', 'cta_link'],
  },
  review_sources: { legacyAliases: ['sourceName', 'sourceUrl', 'rating'], strip: ['title', 'excerpt', 'short_description', 'featured_image', 'thumbnail_image', 'icon', 'author', 'published_at', 'tags', 'categories', 'related_content', 'cta_label', 'cta_link'] },
  customer_reviews: { legacyAliases: ['title', 'quote', 'reviewerName', 'reviewerRole', 'companyName'], strip: ['excerpt', 'short_description', 'thumbnail_image', 'icon', 'published_at', 'categories', 'related_content', 'cta_label', 'cta_link'] },
  podcasts: { legacyAliases: ['title', 'summary', 'audioUrl', 'platformUrls'], strip: ['excerpt', 'short_description', 'thumbnail_image', 'icon', 'author', 'categories', 'related_content', 'cta_label', 'cta_link'] },
  faq_topics: { legacyAliases: ['name', 'description'], strip: ['title', 'excerpt', 'short_description', 'featured_image', 'thumbnail_image', 'icon', 'author', 'published_at', 'sort_order', 'tags', 'categories', 'related_content', 'cta_label', 'cta_link'] },
  customer_stories: {
    legacyAliases: ['title', 'companyName', 'challenge', 'solution', 'results'],
    // From STORY-003: keeps story_title / challenge_summary / full_story_body / publish_date / hero_image instead of the global duplicates.
    strip: ['excerpt', 'short_description', 'featured_image', 'body', 'published_at', 'tags', 'categories', 'related_content', 'cta_label', 'cta_link', 'author', 'sort_order', 'updated_at'],
  },
  ebooks: { legacyAliases: ['title', 'summary', 'downloadUrl', 'coverImageUrl'], strip: ['excerpt', 'short_description', 'thumbnail_image', 'icon', 'author', 'published_at', 'categories', 'related_content'] },
  webinars: { legacyAliases: ['title', 'registrationUrl', 'hostName', 'speakers'], strip: ['excerpt', 'short_description', 'thumbnail_image', 'icon', 'author', 'published_at', 'categories', 'related_content'] },
  team_members: {
    legacyAliases: ['name', 'role', 'bio', 'photoUrl', 'linkedinUrl', 'twitterUrl'],
    // From TEAM-003: keeps full_name / short_bio / photo / linkedin_url etc.
    strip: ['title', 'excerpt', 'short_description', 'featured_image', 'thumbnail_image', 'icon', 'author', 'published_at', 'categories', 'related_content', 'cta_label', 'cta_link', 'updated_at'],
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
}

export const CMS_COLLECTION_DEFINITIONS: CmsCollectionDefinition[] = CMS_COLLECTION_DEFINITIONS_BASE.map((definition) => {
  const cardFields = universalCardFields()
  const listingFields = universalListingFields()
  const detailFields = universalDetailFields()
  const blocksFields = universalBlocksFields(definition.defaultSchemaType)
  const relations = relationshipFields(RELATIONSHIPS[definition.key] ?? {})

  // FIX-026: content-layout fields are merged into publish (not aeo).
  const mergedPublish = mergeFieldSets(
    mergeFieldSets(globalCoreFields(), globalContentLayoutFields()),
    definition.sections.publish ?? []
  )
  const hidden = HIDDEN_FIELDS_BY_COLLECTION[definition.key] ?? { legacyAliases: [], strip: [] }
  const hiddenNames = new Set<string>([...hidden.legacyAliases, ...hidden.strip])
  const normalizedPublish = mergedPublish.filter((field) => !hiddenNames.has(field.name))

  const suppressed = new Set<CmsSectionKey>(SUPPRESSED_SECTIONS_BY_COLLECTION[definition.key] ?? [])
  const empty: CmsFieldDefinition[] = []

  return {
    ...definition,
    sections: {
      publish: normalizedPublish,
      card: suppressed.has('card') ? empty : cardFields,
      listing: suppressed.has('listing') ? empty : listingFields,
      detail: suppressed.has('detail') ? empty : detailFields,
      blocks: suppressed.has('blocks') ? empty : blocksFields,
      relations: suppressed.has('relations') ? empty : relations,
      seo: suppressed.has('seo') ? empty : globalSeoFields(),
      // FIX-026: aeo now contains only the five genuine AEO signals.
      aeo: suppressed.has('aeo') ? empty : commonAeoFields(),
      geo: suppressed.has('geo') ? empty : commonGeoFields(),
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
 * sensible starting state (schema_type, indexable, listing layout, etc.).
 */
export function buildDefaultDocumentValues(definition: CmsCollectionDefinition): Record<string, unknown> {
  return {
    status: 'draft',
    language: 'en',
    indexable: true,
    noindex: false,
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
