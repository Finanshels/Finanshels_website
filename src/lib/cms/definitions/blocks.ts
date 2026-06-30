// FIX-033: page-builder block catalogue extracted from collectionDefinitions.ts.
// Pure data — used by the admin block-type picker and by PageBlocksRenderer.
import type { CmsCollectionKey, CmsFieldDefinition } from '../collectionDefinitions'
import { CONTENT_CATEGORY_OPTIONS, CONTENT_CATEGORY_LABELS } from '../contentCategoryOptions'

export type CmsBlockField = CmsFieldDefinition

export type CmsBlockType = {
  type: string
  label: string
  description: string
  icon: string
  fields: CmsBlockField[]
}

const RAW_CMS_BLOCK_TYPES: CmsBlockType[] = [
  {
    type: 'hero',
    label: 'Hero',
    description: 'Headline + subhead + image + CTA at the top of a page.',
    icon: 'flag',
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { name: 'heading', label: 'Heading', type: 'text', required: true },
      { name: 'subheading', label: 'Subheading', type: 'textarea' },
      { name: 'imageUrl', label: 'Image URL', type: 'url' },
      // FIX-074: optional art-directed mobile crop. Falls back to imageUrl.
      {
        name: 'imageMobileUrl',
        label: 'Mobile image URL (optional)',
        type: 'url',
        description: 'Phone-optimised crop shown ≤640px. Leave blank to reuse the main image.',
      },
      { name: 'imageAlt', label: 'Image alt text', type: 'text' },
      { name: 'ctaLabel', label: 'CTA label', type: 'text' },
      { name: 'ctaUrl', label: 'CTA URL', type: 'url' },
      { name: 'secondaryCtaLabel', label: 'Secondary CTA label', type: 'text' },
      { name: 'secondaryCtaUrl', label: 'Secondary CTA URL', type: 'url' },
      {
        name: 'variant',
        label: 'Variant',
        type: 'select',
        options: ['default', 'minimal', 'split', 'gradient', 'video-bg'],
      },
    ],
  },
  {
    type: 'rich_text',
    label: 'Rich text',
    description: 'A long-form HTML/markdown content block.',
    icon: 'text',
    fields: [{ name: 'html', label: 'HTML body', type: 'textarea', required: true }],
  },
  {
    type: 'cta',
    label: 'CTA',
    description: 'A call-to-action banner with primary + secondary buttons.',
    icon: 'send',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text', required: true },
      { name: 'subheading', label: 'Subheading', type: 'textarea' },
      { name: 'primaryLabel', label: 'Primary button label', type: 'text' },
      { name: 'primaryUrl', label: 'Primary button URL', type: 'url' },
      { name: 'secondaryLabel', label: 'Secondary button label', type: 'text' },
      { name: 'secondaryUrl', label: 'Secondary button URL', type: 'url' },
      {
        name: 'tone',
        label: 'Tone',
        type: 'select',
        options: ['brand', 'soft', 'dark', 'minimal'],
      },
    ],
  },
  {
    type: 'testimonial',
    label: 'Testimonial',
    description: 'A pull quote with attribution and optional logo.',
    icon: 'quote',
    fields: [
      { name: 'quote', label: 'Quote', type: 'textarea', required: true },
      { name: 'authorName', label: 'Author name', type: 'text' },
      { name: 'authorRole', label: 'Author role', type: 'text' },
      { name: 'companyName', label: 'Company', type: 'text' },
      { name: 'authorImageUrl', label: 'Author image URL', type: 'url' },
      { name: 'logoUrl', label: 'Company logo URL', type: 'url' },
      { name: 'reviewRef', label: 'Linked customer review', type: 'reference', referenceCollection: 'customer_reviews' },
    ],
  },
  {
    type: 'faq_accordion',
    label: 'FAQ accordion',
    description: 'Expandable Q&A — auto-pull FAQs by service, or hand-write them.',
    icon: 'list',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'subheading', label: 'Subheading', type: 'textarea' },
      {
        name: 'service',
        label: 'Pull FAQs for service',
        type: 'select',
        options: ['', ...CONTENT_CATEGORY_OPTIONS],
        optionLabels: CONTENT_CATEGORY_LABELS,
        description:
          'Auto-list published FAQs tagged with this service. Leave blank to use the manual Items JSON below.',
      },
      {
        name: 'items',
        label: 'Items JSON (manual fallback)',
        type: 'json',
        placeholder: '[{"question":"...","answer":"..."}]',
      },
    ],
  },
  {
    type: 'stats',
    label: 'Stats',
    description: 'A row of impact numbers / KPIs.',
    icon: 'bar-chart',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      {
        name: 'items',
        label: 'Stats JSON',
        type: 'json',
        placeholder: '[{"value":"500+","label":"customers"}]',
      },
    ],
  },
  {
    type: 'logo_wall',
    label: 'Logo wall',
    description: 'A grid of customer logos for trust.',
    icon: 'grid',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      {
        name: 'logos',
        label: 'Logos JSON',
        type: 'json',
        placeholder: '[{"src":"https://...","alt":"Acme"}]',
      },
      // FIX-048: `customerRefs` (multi_reference → our_customers) was defined
      // here but never resolved by LogoWallBlock — same reason as above.
    ],
  },
  {
    type: 'video_embed',
    label: 'Video embed',
    description: 'A YouTube / Vimeo / Loom embed.',
    icon: 'video',
    fields: [
      { name: 'videoUrl', label: 'Video URL', type: 'url', required: true },
      { name: 'caption', label: 'Caption', type: 'text' },
    ],
  },
  {
    type: 'tool_embed',
    label: 'Tool embed',
    description: 'Embed an interactive tool or calculator.',
    icon: 'wrench',
    fields: [
      { name: 'toolUrl', label: 'Tool URL', type: 'url' },
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'toolRef', label: 'Linked tool record', type: 'reference', referenceCollection: 'tools' },
    ],
  },
  {
    type: 'form',
    label: 'Form',
    description: 'A lead-capture / contact form embed.',
    icon: 'form',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'subheading', label: 'Subheading', type: 'textarea' },
      { name: 'formId', label: 'Form ID', type: 'text', placeholder: 'newsletter-2026' },
      { name: 'submitLabel', label: 'Submit label', type: 'text' },
      { name: 'embedUrl', label: 'Embed URL', type: 'url' },
    ],
  },
  {
    type: 'download',
    label: 'Download',
    description: 'A downloadable asset gate (ebook, whitepaper, template).',
    icon: 'download',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'fileUrl', label: 'File URL', type: 'url', required: true },
      { name: 'coverImageUrl', label: 'Cover image URL', type: 'url' },
      { name: 'gated', label: 'Gated download', type: 'boolean' },
      { name: 'formId', label: 'Form ID (when gated)', type: 'text' },
    ],
  },
  {
    type: 'speaker',
    label: 'Speaker / Author',
    description: 'Speaker or author bio block, references team_members.',
    icon: 'user',
    fields: [
      { name: 'heading', label: 'Section heading', type: 'text' },
      {
        name: 'memberRefs',
        label: 'Team members',
        type: 'multi_reference',
        referenceCollection: 'team_members',
      },
    ],
  },
  {
    type: 'related_content',
    label: 'Related content',
    description: 'A grid of related cards (manual + auto fallback).',
    icon: 'link',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      {
        name: 'mode',
        label: 'Mode',
        type: 'select',
        options: ['manual', 'auto', 'manual+auto'],
      },
      { name: 'maxItems', label: 'Max items', type: 'number' },
      {
        name: 'sourceCollections',
        label: 'Auto source collections',
        type: 'tags',
        // FIX-048: placeholder previously suggested `videos` which has been
        // removed from CmsCollectionKey.
        placeholder: 'blog_posts, glossary_terms, ebooks',
      },
      {
        name: 'manualRefs',
        label: 'Manual references (slug:collection per line)',
        type: 'json',
        placeholder: '[{"collection":"blog_posts","id":"my-slug"}]',
      },
    ],
  },
  {
    type: 'table',
    label: 'Table',
    description: 'A structured table with header row.',
    icon: 'table',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      {
        name: 'data',
        label: 'Table JSON',
        type: 'json',
        placeholder: '{"headers":["A","B"],"rows":[["1","2"]]}',
      },
    ],
  },
  {
    type: 'timeline',
    label: 'Timeline',
    description: 'A vertical timeline of milestones or steps.',
    icon: 'milestone',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      {
        name: 'items',
        label: 'Timeline JSON',
        type: 'json',
        placeholder: '[{"date":"2025-01","title":"...","description":"..."}]',
      },
    ],
  },
]

// FIX-072: editor-controllable heading level (SEO). Appended once to every
// block that renders a real heading tag (via <BlockHeading> in
// PageBlocksRenderer), so the field surfaces in the block editor automatically.
// `logo_wall` renders its heading as a label <p>, so it is excluded.
const HEADING_LEVEL_BLOCK_FIELD: CmsBlockField = {
  name: 'heading_level',
  label: 'Heading level (SEO)',
  type: 'select',
  options: ['h2', 'h3', 'h4'],
  defaultValue: 'h2',
  description: 'Semantic tag for this block heading. The page owns the H1 — keep blocks at H2 and nest with H3/H4.',
}

const HEADING_LEVEL_BLOCKS = new Set<string>([
  'hero',
  'cta',
  'faq_accordion',
  'stats',
  'tool_embed',
  'form',
  'download',
  'speaker',
  'related_content',
  'table',
  'timeline',
])

export const CMS_BLOCK_TYPES: CmsBlockType[] = RAW_CMS_BLOCK_TYPES.map((block) =>
  HEADING_LEVEL_BLOCKS.has(block.type)
    ? { ...block, fields: [...block.fields, HEADING_LEVEL_BLOCK_FIELD] }
    : block
)

export const CMS_BLOCK_TYPE_MAP: Record<string, CmsBlockType> = Object.fromEntries(
  CMS_BLOCK_TYPES.map((b) => [b.type, b])
)
