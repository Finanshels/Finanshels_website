import 'server-only'
import { generateText } from 'ai'
import { z } from 'zod'
import { resolveModel } from '@/lib/cms/ai/models'
import {
  SECTION_CATALOG,
  createDefaultSection,
  getSectionCatalogEntry,
  type SectionFieldDef,
} from './sectionCatalog'
import { DEFAULT_ICON_NAME, isKnownIconName } from './iconSet'
import type { HeroVariant, LandingPageSection, LandingPageSeo, LandingPageTheme } from './types'

/**
 * AI drafting for the Landing Page Studio.
 *
 * The model PICKS sections and writes COPY into structured props — it never emits
 * HTML. Output is validated against a permissive shape, then normalised against
 * the catalog (the source of truth): unknown sections/fields are dropped, types
 * coerced, icons constrained to the allow-list, images left blank for the
 * marketer to fill. Rendering therefore stays deterministic and safe.
 */

export type AiBrief = {
  goal: string
  service?: string
  audience?: string
  offer?: string
  tone?: string
  language?: string
}

export type AiDraftResult = {
  sections: LandingPageSection[]
  theme: Partial<LandingPageTheme>
  seo: Partial<LandingPageSeo>
}

const HERO_VARIANTS: HeroVariant[] = ['split-form', 'centered-form', 'video-form', 'urgency-banner']
const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
const DRAFT_MAX_OUTPUT_TOKENS = 4096

const draftSchema = z.object({
  sections: z
    .array(
      z.object({
        type: z.string(),
        props: z.record(z.unknown()).optional(),
      }),
    )
    .min(1),
  theme: z
    .object({
      hero_variant: z.string().optional(),
      accent_color: z.string().optional(),
      badge_text: z.string().optional(),
    })
    .optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
})

type RawDraft = z.infer<typeof draftSchema>

/** Compact, model-facing description of the section catalog. */
function catalogReference(): string {
  return SECTION_CATALOG.map((entry) => {
    const fields = entry.fields
      .map((f) => describeField(f))
      .filter(Boolean)
      .join(', ')
    return `- "${entry.type}" (${entry.label}, group: ${entry.group}): ${entry.description} Fields: ${fields}`
  }).join('\n')
}

function describeField(f: SectionFieldDef): string {
  if (f.type === 'repeater') {
    if (f.itemPrimitive === 'string') return `${f.name} (list of strings)`
    if (f.itemPrimitive === 'boolean') return `${f.name} (list of booleans)`
    const sub = (f.itemFields ?? []).map((s) => s.name).join('/')
    return `${f.name} (list of {${sub}})`
  }
  if (f.type === 'image') return `${f.name} (leave blank)`
  return `${f.name} (${f.type})`
}

function buildPrompt(brief: AiBrief): string {
  const lines = [
    'You are a senior conversion copywriter for Finanshels, a UAE finance, tax and compliance firm.',
    'Design a high-converting landing page by selecting sections from the catalog and writing concise, specific, on-brand copy.',
    '',
    'Rules:',
    '- Choose 5 to 8 sections in a logical conversion order. Always start with a "hero".',
    '- Write British-English copy aimed at UAE business owners. Be concrete; avoid fluff and emoji.',
    '- Fill list fields (testimonials, features, FAQ, etc.) with 3–5 realistic items.',
    '- For icon fields, use short kebab-case names like "shield-check", "clock", "banknote".',
    '- Leave every image field blank ("").',
    '- Output ONLY a JSON object. No markdown, no commentary, no code fences.',
    '',
    'JSON shape:',
    '{ "sections": [ { "type": "<catalog type>", "props": { ...field values } } ], "theme": { "hero_variant": "split-form|centered-form|video-form|urgency-banner", "badge_text": "" }, "seo": { "title": "", "description": "" } }',
    '',
    'Section catalog:',
    catalogReference(),
    '',
    'Campaign brief:',
    `- Goal: ${brief.goal}`,
  ]
  if (brief.service) lines.push(`- Service: ${brief.service}`)
  if (brief.audience) lines.push(`- Audience: ${brief.audience}`)
  if (brief.offer) lines.push(`- Key offer / hook: ${brief.offer}`)
  if (brief.tone) lines.push(`- Tone: ${brief.tone}`)
  if (brief.language) lines.push(`- Language: ${brief.language}`)
  return lines.join('\n')
}

/** Pull the first balanced JSON object out of a model response. */
function extractJson(text: string): unknown {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No JSON object found in AI response')
  }
  return JSON.parse(text.slice(start, end + 1))
}

function coerceField(field: SectionFieldDef, value: unknown): unknown {
  switch (field.type) {
    case 'boolean':
      return Boolean(value)
    case 'number': {
      const n = Number(value)
      return Number.isFinite(n) ? n : undefined
    }
    case 'icon':
      return isKnownIconName(value) ? value : DEFAULT_ICON_NAME
    case 'image':
      // Never trust AI-invented image URLs — marketer fills via the picker.
      return ''
    case 'color':
      return typeof value === 'string' && HEX.test(value) ? value : undefined
    case 'select':
      return typeof value === 'string' && (field.options ?? []).includes(value) ? value : undefined
    case 'repeater':
      return coerceRepeater(field, value)
    default:
      if (typeof value === 'string') return value
      return value == null ? undefined : String(value)
  }
}

function coerceRepeater(field: SectionFieldDef, value: unknown): unknown[] | undefined {
  if (!Array.isArray(value)) return undefined
  if (field.itemPrimitive === 'string') return value.filter((v): v is string => typeof v === 'string')
  if (field.itemPrimitive === 'boolean') return value.map((v) => Boolean(v))
  const itemFields = field.itemFields ?? []
  return value.map((item) => {
    const rec = item && typeof item === 'object' ? (item as Record<string, unknown>) : {}
    const out: Record<string, unknown> = {}
    for (const sub of itemFields) {
      const coerced = coerceField(sub, rec[sub.name])
      out[sub.name] = coerced === undefined ? (sub.type === 'repeater' ? [] : '') : coerced
    }
    return out
  })
}

function normalizeSection(raw: { type: string; props?: Record<string, unknown> }): LandingPageSection | null {
  const entry = getSectionCatalogEntry(raw.type)
  if (!entry) return null
  const base = createDefaultSection(entry.type)
  const props: Record<string, unknown> = { ...base.props }
  const input = raw.props && typeof raw.props === 'object' ? raw.props : {}
  for (const field of entry.fields) {
    if (!(field.name in input)) continue
    const coerced = coerceField(field, input[field.name])
    if (coerced !== undefined) props[field.name] = coerced
  }
  return { ...base, props }
}

export function normalizeDraft(raw: RawDraft): AiDraftResult {
  const sections = raw.sections
    .map((s) => normalizeSection({ type: s.type, props: s.props as Record<string, unknown> | undefined }))
    .filter((s): s is LandingPageSection => s !== null)

  const theme: Partial<LandingPageTheme> = {}
  const rawVariant = raw.theme?.hero_variant
  if (rawVariant && HERO_VARIANTS.includes(rawVariant as HeroVariant)) {
    theme.hero_variant = rawVariant as HeroVariant
  }
  if (typeof raw.theme?.badge_text === 'string' && raw.theme.badge_text.trim()) {
    theme.badge_text = raw.theme.badge_text.trim()
  }
  if (typeof raw.theme?.accent_color === 'string' && HEX.test(raw.theme.accent_color)) {
    theme.accent_color = raw.theme.accent_color
  }

  const seo: Partial<LandingPageSeo> = {}
  if (typeof raw.seo?.title === 'string' && raw.seo.title.trim()) seo.title = raw.seo.title.trim()
  if (typeof raw.seo?.description === 'string' && raw.seo.description.trim()) {
    seo.description = raw.seo.description.trim()
  }

  return { sections, theme, seo }
}

/**
 * Generate a normalised landing-page draft from a brief. Throws on AI failure or
 * unparseable output — the caller maps that to a friendly error.
 */
export async function draftLandingPage(brief: AiBrief): Promise<AiDraftResult> {
  const { model } = resolveModel('quality')
  const { text } = await generateText({
    model,
    prompt: buildPrompt(brief),
    temperature: 0.7,
    maxOutputTokens: DRAFT_MAX_OUTPUT_TOKENS,
  })

  const parsed = draftSchema.safeParse(extractJson(text))
  if (!parsed.success) {
    throw new Error('AI returned an unexpected shape')
  }
  const result = normalizeDraft(parsed.data)
  if (result.sections.length === 0) {
    throw new Error('AI draft contained no usable sections')
  }
  return result
}
