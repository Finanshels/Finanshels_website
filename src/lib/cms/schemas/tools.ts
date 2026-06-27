import { z } from 'zod'
import type { ToolGate, ToolRouteKey } from '@/lib/tools/types'

const statusSchema = z.enum(['draft', 'in_review', 'approved', 'scheduled', 'published'])

/** Shape consumed by the tool page shell + hub. Only fields the public surface reads. */
export interface Tool {
  id: string
  slug: string
  status: z.infer<typeof statusSchema>
  toolName: string
  shortDescription: string
  fullDescription?: string
  toolRouteKey: ToolRouteKey
  hubGroup: 'Calculators' | 'Benchmarks & Checks'
  gate: ToolGate
  leadCaptureEnabled: boolean
  ctaHeadline?: string
  gatedOutputLabel: string
  leadMagnetDescription: string
  relatedServiceUrl?: string
  relatedServiceLabel?: string
  serviceInterest: string
  benefits: string[]
  faqRefs: string[]
  icon?: string
  seoTitle?: string
  metaDescription?: string
  canonicalUrl?: string
  ogImage?: string
  cardDescription?: string
  featured: boolean
  sortOrder: number
}

function strArr(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string')
  return []
}

const rawSchema = z.object({
  slug: z.string().min(1),
  status: statusSchema.default('draft'),
  tool_name: z.string().min(1),
  short_description: z.string().min(1),
  full_description: z.string().optional(),
  tool_route_key: z.string().min(1),
  hub_group: z.enum(['Calculators', 'Benchmarks & Checks']).default('Calculators'),
  gated: z.boolean().default(false),
  lead_capture_enabled: z.boolean().default(false),
  cta_headline: z.string().optional(),
  gated_output_label: z.string().optional(),
  lead_magnet_description: z.string().optional(),
  related_service_url: z.string().optional(),
  related_service_label: z.string().optional(),
  related_services: z.unknown().optional(),
  benefits: z.unknown().optional(),
  faq_items: z.unknown().optional(),
  icon: z.string().optional(),
  seo_title: z.string().optional(),
  meta_description: z.string().optional(),
  canonical_url: z.string().optional(),
  og_image: z.string().optional(),
  card_description: z.string().optional(),
  featured: z.boolean().default(false),
  sort_order: z.coerce.number().default(0),
})

/** Parse a raw Firestore tool doc. Returns null on invalid/insufficient data (never throws). */
export function parseTool(raw: unknown, id: string): Tool | null {
  const parsed = rawSchema.safeParse(raw)
  if (!parsed.success) return null
  const d = parsed.data
  const services = strArr(d.related_services)
  return {
    id,
    slug: d.slug,
    status: d.status,
    toolName: d.tool_name,
    shortDescription: d.short_description,
    fullDescription: d.full_description,
    toolRouteKey: d.tool_route_key as ToolRouteKey,
    hubGroup: d.hub_group,
    gate: d.gated ? 'soft' : ('open' as ToolGate),
    leadCaptureEnabled: d.lead_capture_enabled,
    ctaHeadline: d.cta_headline,
    gatedOutputLabel: d.gated_output_label || 'Email me the full breakdown',
    leadMagnetDescription:
      d.lead_magnet_description || 'Get the detailed breakdown and a filing checklist.',
    relatedServiceUrl: d.related_service_url,
    relatedServiceLabel: d.related_service_label,
    serviceInterest: services[0] || 'general',
    benefits: strArr(d.benefits),
    faqRefs: strArr(d.faq_items),
    icon: d.icon,
    seoTitle: d.seo_title,
    metaDescription: d.meta_description,
    canonicalUrl: d.canonical_url,
    ogImage: d.og_image,
    cardDescription: d.card_description,
    featured: d.featured,
    sortOrder: d.sort_order,
  }
}
