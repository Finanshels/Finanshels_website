// Plain-language helper text shown under CMS fields for non-technical editors.
// Keyed by exact field name; falls back to a small set of suffix heuristics.

const EXACT: Record<string, string> = {
  title: 'The main headline shown on the page and in search results.',
  slug: 'The URL for this page. Auto-fills from the title — change carefully, it can break existing links.',
  body: 'The main content of this page.',
  content: 'The main content of this page.',
  article: 'The article body.',
  definition_full: 'The full definition or explanation.',
  definition_short: 'A one-line definition shown in previews and search.',
  answer: 'The direct answer shown in search and AI assistants. Lead with the answer.',
  direct_answer: 'A concise 2–3 sentence answer used by AI assistants and answer engines.',
  question: 'The question, phrased the way a customer would ask it.',
  faq_items: 'Question-and-answer pairs shown in an FAQ accordion.',

  excerpt: 'A short summary shown on listing cards and previews (2–3 sentences).',
  summary: 'A short summary shown on listing cards and previews (2–3 sentences).',
  short_description: 'A brief description shown in previews and cards.',
  full_description: 'The full, long-form description.',
  short_bio: 'A one or two sentence bio for cards and bylines.',
  full_bio: 'The complete biography shown on the profile page.',

  featured_image: 'Shown at the top of the page and on listing cards. Use a high-quality image.',
  featured_image_alt: 'Describes the image for screen readers and SEO. Required whenever an image is set.',
  hero_image: 'The large banner image at the top of the page.',
  cover_image: 'The cover image used on cards and social shares.',
  thumbnail_image: 'A small image used in compact listings.',

  card_title: 'Overrides the title on listing cards. Leave blank to use the main title.',
  card_description: 'The summary shown on this item’s listing card.',
  card_image: 'The image shown on this item’s listing card.',
  cta_label: 'The text on the call-to-action button.',
  card_cta_label: 'The text on the card’s call-to-action button.',

  seo_title: 'The title Google shows in search results. Aim for 50–60 characters.',
  meta_description: 'The description Google shows under the title in search. Aim for 120–160 characters.',
  og_description: 'The description shown when this page is shared on social media.',
  focus_keyword: 'The main keyword this page targets. Use it in the title and opening paragraph.',
  secondary_keywords: 'Extra keywords to target. Separate with commas.',
  meta_keywords: 'Keywords for this page. Separate with commas.',
  canonical_url: 'Leave blank unless this content is duplicated at another URL.',
  og_image: 'The image shown when this page is shared on social media. 1200×630px works best.',
  robots_meta: 'Controls search-engine indexing. Leave default unless you intend to hide this page.',

  tags: 'Comma-separated tags used for filtering and related content.',
  categories: 'Comma-separated categories used to group content.',
  sort_order: 'Lower numbers appear first. Leave blank for default ordering.',
  featured: 'Featured items are highlighted at the top of listing pages.',
  publish_date: 'When this content was (or will be) published.',
  scheduled_at: 'Schedule a future publish time. Leave blank to publish immediately.',
  author: 'The person credited as the author.',
}

export function getFieldHelperText(fieldName: string): string | undefined {
  const exact = EXACT[fieldName]
  if (exact) return exact
  const n = fieldName.toLowerCase()
  if (n.endsWith('_alt')) return 'Describes the image for screen readers and SEO.'
  if (n.endsWith('meta_description')) return 'Shown under the title in search results. Aim for 120–160 characters.'
  if (n.endsWith('_summary') || n.endsWith('excerpt')) return 'A short summary shown in previews and cards.'
  if (n.endsWith('_url') || n.endsWith('_link')) return 'Use a full URL including https://'
  return undefined
}
