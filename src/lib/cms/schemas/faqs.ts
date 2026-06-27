import { z } from 'zod'

export const faqSchema = z.object({
  slug: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  topic: z.string().optional(),
  topic_slug: z.string().optional(),
  featured: z.boolean().optional(),
  sort_order: z.number().optional(),
  status: z.enum(['draft', 'in_review', 'published']).default('published'),
})

export type CmsFaq = z.infer<typeof faqSchema>

export function parseFaq(raw: Record<string, unknown>, slug: string): CmsFaq | null {
  const merged = { ...raw, slug: (raw.slug as string) || slug }
  const parsed = faqSchema.safeParse(merged)
  return parsed.success ? parsed.data : null
}
