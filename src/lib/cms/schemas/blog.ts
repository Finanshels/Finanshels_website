import { z } from 'zod'

/** Firestore collection: `blog_posts` — document ID should equal `slug` for predictable URLs. */
export const blogPostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().optional(),
  body: z.string().optional(),
  /** Sanitized HTML body (stored as trusted CMS output after import pipeline). */
  bodyHtml: z.string().default(''),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  author: z.string().optional(),
  authorName: z.string().optional(),
  // FIX-077: drives RTL rendering for Arabic posts.
  language: z.string().optional(),
  featured_image: z.string().optional(),
  // FIX-048: editors set `featured_image_alt` in admin (a11y/SEO); thread it
  // through so the public blog page can render a descriptive alt text.
  featured_image_alt: z.string().optional(),
  heroImageUrl: z.string().optional(),
  seo_title: z.string().optional(),
  seoTitle: z.string().optional(),
  meta_description: z.string().optional(),
  seoDescription: z.string().optional(),
  // FIX-034: SEO/index controls + page_blocks + OG fields surfaced through the
  // typed BlogPost so the canonical /blog/[slug] route can honour them.
  og_title: z.string().optional(),
  og_description: z.string().optional(),
  og_image: z.string().optional(),
  card_image: z.string().optional(),
  card_description: z.string().optional(),
  canonical_url: z.string().optional(),
  // Per-doc JSON-LD type. `schema_type_override` (curated Blocks-tab dropdown) is
  // canonical; legacy `schema_type` is kept as a read fallback for old docs.
  schema_type_override: z.string().optional(),
  schema_type: z.string().optional(),
  // FIX-047: `robots_meta` is the single SEO indexing control. The legacy
  // `noindex`/`indexable` booleans remain in the schema as optional so
  // pre-FIX-047 Firestore docs continue to parse; they are no longer editable.
  robots_meta: z.string().optional(),
  noindex: z.boolean().optional(),
  indexable: z.boolean().optional(),
  page_blocks: z.array(z.record(z.unknown())).optional(),
  // FIX-048: include `in_review` so the parser does not silently drop docs
  // mid-workflow. Public routes still gate on `status === 'published'`
  // separately. Default stays `'published'` so pre-status legacy docs
  // imported from Webflow without a `status` field continue to render
  // publicly (collectionRepository defaults to `'draft'` for new writes —
  // the asymmetry is intentional: public-read fallback vs. admin-write
  // safety).
  blog_category: z.string().optional(),
  // Industry vertical slugs (see industryOptions.ts). Multi-select, surfaced so
  // the /blog listing can render the industry filter + card badge. Legacy docs
  // stored a single string; parseBlogPost normalizes those to an array.
  blog_industry: z.array(z.string()).optional(),
  blog_tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'in_review', 'published']).default('published'),
})

export type BlogPost = z.infer<typeof blogPostSchema>

export function parseBlogPost(raw: Record<string, unknown>, slug: string): BlogPost | null {
  const merged = {
    ...raw,
    slug: (raw.slug as string) || slug,
    body: (raw.body ?? raw.bodyHtml ?? '') as string,
    bodyHtml: (raw.bodyHtml ?? raw.body ?? '') as string,
    author: (raw.author ?? raw.authorName) as string | undefined,
    featured_image: (raw.featured_image ?? raw.heroImageUrl) as string | undefined,
    seo_title: (raw.seo_title ?? raw.seoTitle) as string | undefined,
    meta_description: (raw.meta_description ?? raw.seoDescription) as string | undefined,
    // Normalize legacy single-string industry values to the new array shape so
    // pre-multi_select docs still parse (and aren't dropped from the listing).
    blog_industry: Array.isArray(raw.blog_industry)
      ? raw.blog_industry
      : raw.blog_industry
      ? [raw.blog_industry]
      : undefined,
    publishedAt:
      raw.publishedAt ?? raw.publish_date ?? raw.published_at ?? raw.updatedAt ?? raw.updated_at,
  }
  const parsed = blogPostSchema.safeParse(merged)
  return parsed.success ? parsed.data : null
}
