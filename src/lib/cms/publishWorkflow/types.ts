/**
 * Shared types for the two-version draft/publish workflow. Pure — no React, no
 * server-only, no firebase-admin — so the diff/card logic stays unit-testable.
 */

/** The small published subset denormalised onto the parent doc for listing/hub queries. */
export interface PublishedCard {
  title: string | null
  slug: string | null
  card_description: string | null
  card_image: string | null
  featured: boolean
  sort_order: number
}

/** Publish meta carried on the parent doc. */
export interface PublishMeta {
  status: string
  published_at: Date | null
  published_by: string | null
  has_unpublished_changes: boolean
}
