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
  featured_image: z.string().optional(),
  heroImageUrl: z.string().optional(),
  seo_title: z.string().optional(),
  seoTitle: z.string().optional(),
  meta_description: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(['draft', 'published']).default('published'),
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
  }
  const parsed = blogPostSchema.safeParse(merged)
  return parsed.success ? parsed.data : null
}
