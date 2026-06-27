import { createDefaultSection } from './sectionCatalog'
import type { LandingPageSectionType } from './sectionCatalog'
import type { HeroVariant, LandingPageSection, LandingPageSeo, LandingPageTheme } from './types'

/**
 * Code-defined starter templates for the Landing Page Studio.
 *
 * Each template composes existing catalog sections (with their on-brand default
 * copy) into a proven conversion layout, so a marketer never starts from an
 * empty page. `build()` runs server-side at create time and returns ready-to-edit
 * sections + theme/SEO seed values.
 *
 * Metadata (id/name/description/sectionTypes) is safe to surface in the client
 * create-flow gallery; `build()` stays server-side.
 */

export type LandingPageTemplateMeta = {
  id: string
  name: string
  description: string
  recommendedService?: string
  /** Ordered section types — used to render a lightweight visual preview. */
  sectionTypes: LandingPageSectionType[]
}

export type LandingPageTemplate = LandingPageTemplateMeta & {
  build: () => {
    sections: LandingPageSection[]
    theme?: Partial<LandingPageTheme>
    seo?: Partial<LandingPageSeo>
  }
}

/** Build a section with default props, optionally overriding a few props. */
function mk(type: LandingPageSectionType, propsOverride?: Record<string, unknown>): LandingPageSection {
  const base = createDefaultSection(type)
  return propsOverride ? { ...base, props: { ...base.props, ...propsOverride } } : base
}

function sectionsFrom(
  spec: Array<LandingPageSectionType | [LandingPageSectionType, Record<string, unknown>]>,
): LandingPageSection[] {
  return spec.map((entry) => (Array.isArray(entry) ? mk(entry[0], entry[1]) : mk(entry)))
}

const HERO: Record<string, HeroVariant> = {
  split: 'split-form',
  centered: 'centered-form',
  video: 'video-form',
  urgency: 'urgency-banner',
}

export const LANDING_PAGE_TEMPLATES: LandingPageTemplate[] = [
  {
    id: 'corporate-tax-leadgen',
    name: 'Corporate Tax — Lead-gen',
    description: 'Classic high-intent lead form, proof, process, FAQ. The workhorse.',
    recommendedService: 'corporate_tax',
    sectionTypes: ['hero', 'trust-bar', 'feature-grid', 'process-steps', 'testimonials-carousel', 'faq', 'final-cta'],
    build: () => ({
      theme: { hero_variant: HERO.split, show_sticky_mobile_cta_bar: true },
      sections: sectionsFrom([
        'hero',
        'trust-bar',
        'feature-grid',
        'process-steps',
        'testimonials-carousel',
        'faq',
        'final-cta',
      ]),
    }),
  },
  {
    id: 'bookkeeping-demo',
    name: 'Bookkeeping — Book a demo',
    description: 'Value + comparison + pricing, aimed at booking a demo call.',
    recommendedService: 'bookkeeping',
    sectionTypes: ['hero', 'trust-bar', 'feature-grid', 'comparison-table', 'pricing', 'testimonials-carousel', 'final-cta'],
    build: () => ({
      theme: { hero_variant: HERO.split, show_floating_whatsapp_button: true },
      sections: sectionsFrom([
        ['hero', { heading: 'Books that close themselves — every month, on time.' }],
        'trust-bar',
        'feature-grid',
        'comparison-table',
        'pricing',
        'testimonials-carousel',
        'final-cta',
      ]),
    }),
  },
  {
    id: 'lead-magnet',
    name: 'Free tool / Lead magnet',
    description: 'Gated download with a centered hero — collect emails for a checklist or guide.',
    recommendedService: 'vat',
    sectionTypes: ['hero', 'lead-magnet', 'stats-row', 'testimonials-carousel', 'faq', 'final-cta'],
    build: () => ({
      theme: { hero_variant: HERO.centered },
      sections: sectionsFrom([
        ['hero', { heading: 'The free checklist every UAE business needs before filing.' }],
        'lead-magnet',
        'stats-row',
        'testimonials-carousel',
        'faq',
        'final-cta',
      ]),
    }),
  },
  {
    id: 'webinar-registration',
    name: 'Webinar registration',
    description: 'Register-for-event layout: hero form, agenda steps, inline form, FAQ.',
    recommendedService: 'corporate_tax',
    sectionTypes: ['hero', 'stats-row', 'process-steps', 'inline-form', 'faq', 'final-cta'],
    build: () => ({
      theme: { hero_variant: HERO.split, badge_text: 'Live webinar' },
      sections: sectionsFrom([
        ['hero', { heading: 'Live webinar: UAE Corporate Tax, explained in 45 minutes.', formHeading: 'Save my seat' }],
        'stats-row',
        ['process-steps', { heading: "What we'll cover" }],
        'inline-form',
        'faq',
        'final-cta',
      ]),
    }),
  },
  {
    id: 'vat-consultation',
    name: 'VAT — Free consultation',
    description: 'Objection-handling heavy: risk-reversal, guarantees, FAQ, strong CTA band.',
    recommendedService: 'vat',
    sectionTypes: ['hero', 'trust-bar', 'risk-reversal', 'feature-grid', 'faq', 'cta-banner', 'final-cta'],
    build: () => ({
      theme: { hero_variant: HERO.split, show_sticky_mobile_cta_bar: true },
      sections: sectionsFrom([
        ['hero', { heading: 'Free VAT consultation with an FTA-approved expert — in 24 hours.' }],
        'trust-bar',
        'risk-reversal',
        'feature-grid',
        'faq',
        'cta-banner',
        'final-cta',
      ]),
    }),
  },
]

const TEMPLATE_MAP = new Map<string, LandingPageTemplate>(LANDING_PAGE_TEMPLATES.map((t) => [t.id, t]))

export function getLandingPageTemplate(id: string): LandingPageTemplate | null {
  return TEMPLATE_MAP.get(id) ?? null
}

/** Client-safe metadata for the create-flow gallery (no build closures). */
export function landingPageTemplateMetas(): LandingPageTemplateMeta[] {
  return LANDING_PAGE_TEMPLATES.map(({ id, name, description, recommendedService, sectionTypes }) => ({
    id,
    name,
    description,
    recommendedService,
    sectionTypes,
  }))
}
