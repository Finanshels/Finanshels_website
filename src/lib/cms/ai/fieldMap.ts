// Client-safe AI field map. No `server-only` — imported by both the admin UI
// (to decide which fields get an ✨ button and how the popover behaves) and the
// API route (to validate the requested field kind). Prompt text lives in the
// server-only `prompts.ts`; this file holds only metadata.

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
  /** Model tier: haiku (fast, short fields) | sonnet (long-form quality). */
  model: 'haiku' | 'sonnet'
}

// Exact field-name → config. Matched first.
const EXACT: Record<string, AiFieldConfig> = {
  title:        { kind: 'title', label: 'Suggest', multiChoice: true, model: 'haiku' },
  webinar_title:{ kind: 'title', label: 'Suggest', multiChoice: true, model: 'haiku' },
  video_title:  { kind: 'title', label: 'Suggest', multiChoice: true, model: 'haiku' },
  story_title:  { kind: 'title', label: 'Suggest', multiChoice: true, model: 'haiku' },
  tool_name:    { kind: 'title', label: 'Suggest', multiChoice: true, model: 'haiku' },
  term:         { kind: 'title', label: 'Suggest', multiChoice: true, model: 'haiku' },

  body:            { kind: 'body', label: 'Write', longForm: true, model: 'sonnet' },
  content:         { kind: 'body', label: 'Write', longForm: true, model: 'sonnet' },
  article:         { kind: 'body', label: 'Write', longForm: true, model: 'sonnet' },
  definition_full: { kind: 'body', label: 'Write', longForm: true, model: 'sonnet' },
  full_description:{ kind: 'body', label: 'Write', longForm: true, model: 'sonnet' },
  full_bio:        { kind: 'body', label: 'Write', longForm: true, model: 'sonnet' },

  answer:        { kind: 'direct_answer', label: 'Generate', model: 'haiku' },
  direct_answer: { kind: 'direct_answer', label: 'Generate', model: 'haiku' },
  question:      { kind: 'faq_question', label: 'Suggest', multiChoice: true, model: 'haiku' },
  faq_items:     { kind: 'faq_items', label: 'Generate', model: 'sonnet' },

  excerpt:           { kind: 'summary', label: 'Generate', model: 'haiku' },
  summary:           { kind: 'summary', label: 'Generate', model: 'haiku' },
  description:       { kind: 'summary', label: 'Generate', model: 'haiku' },
  short_description: { kind: 'summary', label: 'Generate', model: 'haiku' },
  definition_short:  { kind: 'summary', label: 'Generate', model: 'haiku' },
  short_bio:         { kind: 'summary', label: 'Generate', model: 'haiku' },
  card_description:  { kind: 'summary', label: 'Generate', model: 'haiku' },
  episode_summary:   { kind: 'summary', label: 'Generate', model: 'haiku' },
  challenge_summary: { kind: 'summary', label: 'Generate', model: 'haiku' },
  solution_summary:  { kind: 'summary', label: 'Generate', model: 'haiku' },
  results_summary:   { kind: 'summary', label: 'Generate', model: 'haiku' },
  output_description:{ kind: 'summary', label: 'Generate', model: 'haiku' },

  seo_title:        { kind: 'meta_title', label: 'Generate', charLimit: { min: 50, max: 60 }, model: 'haiku' },
  meta_description: { kind: 'meta_description', label: 'Generate', charLimit: { min: 120, max: 160 }, model: 'haiku' },
  og_description:   { kind: 'meta_description', label: 'Generate', charLimit: { min: 120, max: 160 }, model: 'haiku' },

  focus_keyword:     { kind: 'focus_keyword', label: 'Suggest', multiChoice: true, model: 'haiku' },
  secondary_keywords:{ kind: 'keywords', label: 'Suggest', model: 'haiku' },
  meta_keywords:     { kind: 'keywords', label: 'Suggest', model: 'haiku' },
  search_keywords:   { kind: 'keywords', label: 'Suggest', model: 'haiku' },

  featured_image_alt: { kind: 'alt_text', label: 'Generate', model: 'haiku' },

  cta_label:                    { kind: 'cta_label', label: 'Suggest', multiChoice: true, model: 'haiku' },
  card_cta_label:               { kind: 'cta_label', label: 'Suggest', multiChoice: true, model: 'haiku' },
  listing_sticky_cta_label:     { kind: 'cta_label', label: 'Suggest', multiChoice: true, model: 'haiku' },
  detail_sticky_side_cta_label: { kind: 'cta_label', label: 'Suggest', multiChoice: true, model: 'haiku' },
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
    if (n.endsWith('meta_description') || n.endsWith('_description') && n.includes('meta'))
      return { kind: 'meta_description', label: 'Generate', charLimit: { min: 120, max: 160 }, model: 'haiku' }
    if (n.endsWith('summary') || n.endsWith('excerpt'))
      return { kind: 'summary', label: 'Generate', model: 'haiku' }
    if (n.endsWith('_alt') || n.endsWith('image_alt'))
      return { kind: 'alt_text', label: 'Generate', model: 'haiku' }
  }
  return null
}

export interface AiContext {
  titleField?: string
  bodyField?: string
  collection?: string
}
