import type { PublishedCard } from './types'

function str(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

/**
 * Pull the listing/hub card subset from a doc's published fields. Denormalised
 * onto the parent doc by `publish()` so listing queries read one doc per item
 * instead of fetching every `/_published/current` snapshot subdoc (no N+1).
 */
export function extractPublishedCard(fields: Record<string, unknown>): PublishedCard {
  return {
    title: str(fields.title),
    slug: str(fields.slug),
    card_description: str(fields.card_description),
    card_image: str(fields.card_image),
    featured: fields.featured === true,
    sort_order: typeof fields.sort_order === 'number' ? fields.sort_order : 0,
  }
}
