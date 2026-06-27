// Client-safe AI field map. No `server-only` — imported by both the admin UI
// (to decide which fields get an ✨ button and how the popover behaves) and the
// API route (to validate the requested field kind and derive its cost tier).
// Prompt text lives in the server-only `prompts.ts`; model wiring lives in the
// server-only `models.ts`. This file holds only client-safe metadata.

export type AiGenerateField =
  | 'title'
  | 'body'
  | 'summary'
  | 'direct_answer'
  | 'faq_question'
  | 'faq_items'
  | 'alt_text'
  | 'meta_title'
  | 'meta_description'
  | 'focus_keyword'
  | 'keywords'
  | 'cta_label'

export const AI_GENERATE_FIELDS: readonly AiGenerateField[] = [
  'title',
  'body',
  'summary',
  'direct_answer',
  'faq_question',
  'faq_items',
  'alt_text',
  'meta_title',
  'meta_description',
  'focus_keyword',
  'keywords',
  'cta_label',
] as const

export function isAiGenerateField(value: string): value is AiGenerateField {
  return (AI_GENERATE_FIELDS as readonly string[]).includes(value)
}

/**
 * Cost tier for a generation. The server maps each tier to a concrete model
 * (see `models.ts`), so the UI never picks a model directly — it only knows the
 * field kind, and the tier follows from that.
 *
 * - `nano`     — ultra-short, high-volume suggestions (titles, keywords, CTAs).
 * - `standard` — short prose (summaries, meta descriptions, answers, FAQs).
 * - `quality`  — long-form output where quality matters most (article bodies).
 */
export type AiTier = 'nano' | 'standard' | 'quality'

const TIER_BY_FIELD: Record<AiGenerateField, AiTier> = {
  title: 'nano',
  focus_keyword: 'nano',
  keywords: 'nano',
  cta_label: 'nano',
  alt_text: 'nano',

  summary: 'standard',
  meta_title: 'standard',
  meta_description: 'standard',
  direct_answer: 'standard',
  faq_question: 'standard',

  body: 'quality',
  faq_items: 'quality',
}

/** Derive the cost tier from the field kind. Single source of truth. */
export function tierForField(kind: AiGenerateField): AiTier {
  return TIER_BY_FIELD[kind]
}

export interface AiFieldConfig {
  /** Which prompt template to run. */
  kind: AiGenerateField
  /** Button label shown next to the field. */
  label: string
  /** Render generated output as a pick-one list of options. */
  multiChoice?: boolean
  /** Soft character-count target shown in the popover footer. */
  charLimit?: { min: number; max: number }
  /** Long-form rich text — handled inside the editor toolbar, not the label row. */
  longForm?: boolean
}

// Exact field-name → config. Matched first.
const EXACT: Record<string, AiFieldConfig> = {
  title:        { kind: 'title', label: 'Suggest', multiChoice: true },
  webinar_title:{ kind: 'title', label: 'Suggest', multiChoice: true },
  video_title:  { kind: 'title', label: 'Suggest', multiChoice: true },
  story_title:  { kind: 'title', label: 'Suggest', multiChoice: true },
  tool_name:    { kind: 'title', label: 'Suggest', multiChoice: true },
  term:         { kind: 'title', label: 'Suggest', multiChoice: true },

  body:            { kind: 'body', label: 'Write', longForm: true },
  content:         { kind: 'body', label: 'Write', longForm: true },
  article:         { kind: 'body', label: 'Write', longForm: true },
  definition_full: { kind: 'body', label: 'Write', longForm: true },
  full_description:{ kind: 'body', label: 'Write', longForm: true },
  full_bio:        { kind: 'body', label: 'Write', longForm: true },

  answer:        { kind: 'direct_answer', label: 'Generate' },
  direct_answer: { kind: 'direct_answer', label: 'Generate' },
  question:      { kind: 'faq_question', label: 'Suggest', multiChoice: true },
  faq_items:     { kind: 'faq_items', label: 'Generate' },

  excerpt:           { kind: 'summary', label: 'Generate' },
  summary:           { kind: 'summary', label: 'Generate' },
  description:       { kind: 'summary', label: 'Generate' },
  short_description: { kind: 'summary', label: 'Generate' },
  definition_short:  { kind: 'summary', label: 'Generate' },
  short_bio:         { kind: 'summary', label: 'Generate' },
  card_description:  { kind: 'summary', label: 'Generate' },
  episode_summary:   { kind: 'summary', label: 'Generate' },
  challenge_summary: { kind: 'summary', label: 'Generate' },
  solution_summary:  { kind: 'summary', label: 'Generate' },
  results_summary:   { kind: 'summary', label: 'Generate' },
  output_description:{ kind: 'summary', label: 'Generate' },

  seo_title:        { kind: 'meta_title', label: 'Generate', charLimit: { min: 50, max: 60 } },
  meta_description: { kind: 'meta_description', label: 'Generate', charLimit: { min: 120, max: 160 } },
  og_description:   { kind: 'meta_description', label: 'Generate', charLimit: { min: 120, max: 160 } },

  focus_keyword:     { kind: 'focus_keyword', label: 'Suggest', multiChoice: true },
  secondary_keywords:{ kind: 'keywords', label: 'Suggest' },
  meta_keywords:     { kind: 'keywords', label: 'Suggest' },
  search_keywords:   { kind: 'keywords', label: 'Suggest' },

  featured_image_alt: { kind: 'alt_text', label: 'Generate' },

  cta_label:                    { kind: 'cta_label', label: 'Suggest', multiChoice: true },
  card_cta_label:               { kind: 'cta_label', label: 'Suggest', multiChoice: true },
  listing_sticky_cta_label:     { kind: 'cta_label', label: 'Suggest', multiChoice: true },
  detail_sticky_side_cta_label: { kind: 'cta_label', label: 'Suggest', multiChoice: true },
}

/**
 * Resolve the AI config for a CMS field. Returns null when the field is not a
 * good fit for generation (URLs, booleans, references, dates, ids, etc.).
 */
export function resolveAiField(fieldName: string, fieldType: string): AiFieldConfig | null {
  const exact = EXACT[fieldName]
  if (exact) return exact

  // Heuristic fallbacks for collection-specific aliases not in the exact map.
  const n = fieldName.toLowerCase()
  if (fieldType === 'text' || fieldType === 'textarea') {
    if (n.endsWith('meta_description') || (n.endsWith('_description') && n.includes('meta')))
      return { kind: 'meta_description', label: 'Generate', charLimit: { min: 120, max: 160 } }
    if (n.endsWith('summary') || n.endsWith('excerpt'))
      return { kind: 'summary', label: 'Generate' }
    if (n.endsWith('_alt') || n.endsWith('image_alt'))
      return { kind: 'alt_text', label: 'Generate' }
  }
  return null
}

export interface AiContext {
  titleField?: string
  bodyField?: string
  collection?: string
}
