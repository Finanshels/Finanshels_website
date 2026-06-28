/**
 * Estimate reading time in minutes from an HTML (or plain-text) string.
 *
 * Strips tags + entities, counts words, divides by an average adult reading
 * speed. Pure and dependency-free so it is safe to import from any server
 * component — both the article header and the listing cards use it. No new CMS
 * field: read time is always derived from `body` at render time.
 */
const WORDS_PER_MINUTE = 220

export function estimateReadingMinutes(html: string | undefined | null): number {
  if (!html) return 1
  const text = html
    .replace(/<[^>]+>/g, ' ') // strip tags
    .replace(/&[a-z]+;/gi, ' ') // strip named entities
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) return 1
  const words = text.split(' ').filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}
