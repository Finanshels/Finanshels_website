/**
 * FIX-080: deterministic SEO/AEO/GEO backfill for the Webflow import.
 *
 * Webflow content rarely carries our SEO/AEO/GEO fields, so imported docs land
 * with empty metadata. This derives sensible values from the content that DOES
 * exist (title + excerpt + body) — no AI, no API cost, fully repeatable. The
 * marketing team can refine with the in-CMS AI writer afterwards; this just
 * ensures every imported doc ships with non-empty, on-topic metadata.
 *
 * Returns ONLY the fields it can populate; callers should spread it BEFORE their
 * explicit fields so any author-provided value wins.
 */
function stripHtml(input: string): string {
  return input.replace(/<[^>]+>/g, ' ')
}

function clip(input: string, max: number): string {
  const text = stripHtml(input).replace(/\s+/g, ' ').trim()
  if (text.length <= max) return text
  return `${text.slice(0, max - 1).trimEnd()}…`
}

function firstSentence(input: string): string {
  const text = stripHtml(input).replace(/\s+/g, ' ').trim()
  const match = text.match(/^.*?[.!?](\s|$)/)
  return (match ? match[0] : text).trim()
}

export type SeoBackfillInput = {
  title?: string
  excerpt?: string
  body?: string
}

export function backfillSeoAeoGeo(input: SeoBackfillInput): Record<string, unknown> {
  const title = (input.title ?? '').trim()
  const excerpt = (input.excerpt ?? '').trim()
  const summarySource = excerpt || (input.body ?? '').trim()
  const out: Record<string, unknown> = {}

  if (title) {
    out.seo_title = clip(title, 60)
    out.og_title = title
  }

  const meta = clip(summarySource, 155)
  if (meta) {
    out.meta_description = meta
    out.og_description = meta
  }

  // AEO: a concise direct answer for answer engines.
  const directAnswer = firstSentence(summarySource)
  if (directAnswer) out.directAnswer = clip(directAnswer, 300)

  // GEO: a short, citable summary block.
  if (summarySource) out.geoSummary = clip(summarySource, 300)

  return out
}
