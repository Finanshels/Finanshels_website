import { z } from 'zod'

/** Firestore collection: `glossary_terms` — document ID should equal `slug`. */
export const glossaryTermSchema = z.object({
  slug: z.string().min(1),
  term: z.string().min(1),
  /** Short definition (plain text or single paragraph HTML). */
  definition_short: z.string().optional(),
  definition: z.string().min(1),
  bodyHtml: z.string().optional(),
  term_category: z.string().optional(),
  alphabet_letter: z.string().optional(),
  // FIX-077: drives RTL rendering for Arabic terms.
  language: z.string().optional(),
  relatedSlugs: z.array(z.string()).optional(),
  updatedAt: z.coerce.date().optional(),
  // FIX-035: surface SEO/index controls + AEO FAQ items so the canonical
  // glossary route can emit JSON-LD and honour noindex.
  // FIX-047: `robots_meta` is the new single source of truth; `noindex` /
  // `indexable` retained as optional for pre-FIX-047 docs only.
  robots_meta: z.string().optional(),
  noindex: z.boolean().optional(),
  indexable: z.boolean().optional(),
  canonical_url: z.string().optional(),
  // glossary-trim (2026-06-28): per-term SEO overrides, consumed by the glossary
  // route's generateMetadata. When unset, title/description derive from the term.
  seo_title: z.string().optional(),
  meta_description: z.string().optional(),
  og_title: z.string().optional(),
  og_description: z.string().optional(),
  og_image: z.string().optional(),
  faqItems: z
    .array(
      z.object({
        question: z.string().optional(),
        answer: z.string().optional(),
      })
    )
    .optional(),
  // FIX-048: include `in_review` so the parser does not silently drop docs
  // mid-workflow. Public routes still gate on `status === 'published'`
  // separately. Default stays `'published'` for backward-compat with
  // pre-status legacy docs (see schemas/blog.ts for rationale).
  status: z.enum(['draft', 'in_review', 'published']).default('published'),
})

export type GlossaryTerm = z.infer<typeof glossaryTermSchema>

export function parseGlossaryTerm(raw: Record<string, unknown>, slug: string): GlossaryTerm | null {
  const merged = {
    ...raw,
    slug: (raw.slug as string) || slug,
    definition_short: (raw.definition_short ?? raw.definition ?? raw.shortDefinition ?? '') as string,
    definition: (raw.definition ?? raw.shortDefinition ?? '') as string,
    bodyHtml: (raw.bodyHtml ?? raw.body ?? raw.longHtml) as string | undefined,
  }
  const parsed = glossaryTermSchema.safeParse(merged)
  return parsed.success ? parsed.data : null
}
