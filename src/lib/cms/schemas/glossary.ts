import { z } from 'zod'

/** Firestore collection: `glossary_terms` — document ID should equal `slug`. */
export const glossaryTermSchema = z.object({
  slug: z.string().min(1),
  term: z.string().min(1),
  /** Short definition (plain text or single paragraph HTML). */
  definition_short: z.string().optional(),
  definition: z.string().min(1),
  /** Optional long-form HTML from CMS. */
  definition_full: z.string().optional(),
  bodyHtml: z.string().optional(),
  relatedSlugs: z.array(z.string()).optional(),
  updatedAt: z.coerce.date().optional(),
  status: z.enum(['draft', 'published']).default('published'),
})

export type GlossaryTerm = z.infer<typeof glossaryTermSchema>

export function parseGlossaryTerm(raw: Record<string, unknown>, slug: string): GlossaryTerm | null {
  const merged = {
    ...raw,
    slug: (raw.slug as string) || slug,
    definition_short: (raw.definition_short ?? raw.definition ?? raw.shortDefinition ?? '') as string,
    definition: (raw.definition ?? raw.shortDefinition ?? '') as string,
    definition_full: (raw.definition_full ?? raw.bodyHtml ?? raw.body ?? raw.longHtml) as string | undefined,
    bodyHtml: (raw.bodyHtml ?? raw.body ?? raw.longHtml) as string | undefined,
  }
  const parsed = glossaryTermSchema.safeParse(merged)
  return parsed.success ? parsed.data : null
}
