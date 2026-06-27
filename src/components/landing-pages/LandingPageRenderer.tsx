import { buildCtaLinks } from '@/lib/landing-pages/buildCtaLinks'
import type { LandingPageDoc, LandingPageSection } from '@/lib/landing-pages/types'
import HeroSection from './sections/HeroSection'
import {
  AwardsPress,
  ComparisonTable,
  CtaBanner,
  Faq,
  FeatureGrid,
  FinalCta,
  Guarantee,
  InlineForm,
  LeadMagnet,
  Pricing,
  ProcessSteps,
  RiskReversal,
  StatsRow,
  TestimonialsCarousel,
  TrustBar,
  VideoTestimonial,
} from './sections/Sections'
import LandingHeader from './LandingHeader'
import LandingFooter from './LandingFooter'
import StickyCtaBar from './StickyCtaBar'
import FloatingWhatsAppButton from './FloatingWhatsAppButton'
import GtagScripts from './GtagScripts'
import type { CtaConfig } from './CtaButtons'

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

function normalizeAccent(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const v = input.trim()
  return HEX_COLOR.test(v) ? v : null
}

export default function LandingPageRenderer({
  page,
  isPreview = false,
}: {
  page: LandingPageDoc
  isPreview?: boolean
}) {
  const baseCta = buildCtaLinks(page)
  const cta: CtaConfig = {
    ...baseCta,
    conversionId: page.google_ads_conversion_id,
    conversionLabels: page.conversion_labels,
  }

  const formProps = {
    landingPageId: page.id,
    landingPageSlug: page.slug,
    serviceInterest: page.service_interest,
    conversionId: page.google_ads_conversion_id,
    conversionLabel: page.conversion_labels.form_submit,
    thankYouRedirectUrl: page.thank_you_redirect_url,
  }

  const sections = page.sections.filter((s) => s.enabled !== false)
  const hasHero = sections.some((s) => s.type === 'hero')
  const hasAnyForm = sections.some((s) => ['hero', 'inline-form', 'final-cta', 'lead-magnet'].includes(s.type))
  const accent = normalizeAccent(page.theme.accent_color)
  const rootStyle = accent
    ? ({ '--lp-accent': accent, '--lp-accent-contrast': '#0f172a' } as React.CSSProperties)
    : undefined

  return (
    <div style={rootStyle} className={accent ? 'lp-themed' : undefined}>
      {page.google_ads_conversion_id ? <GtagScripts conversionId={page.google_ads_conversion_id} /> : null}
      {isPreview ? (
        <div className="bg-amber-500 text-slate-900 text-center text-xs font-semibold py-1.5 px-4">
          PREVIEW · this landing page is unpublished
        </div>
      ) : null}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-slate-900 focus:text-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>
      <LandingHeader badgeText={page.theme.badge_text} cta={cta} />
      <main id="main">
        {!hasHero ? (
          // If editor forgot a hero, inject a minimal form-led intro so above-the-fold conversion still works
          <HeroSection
            variant={page.theme.hero_variant}
            props={{ heading: page.internal_name }}
            cta={cta}
            {...formProps}
            conversionLabel={page.conversion_labels.form_submit}
          />
        ) : null}

        {sections.map((sec) => renderSection(sec, page, cta, formProps))}

        {/* If no form section anywhere, append a final-cta automatically */}
        {!hasAnyForm ? (
          <FinalCta
            props={{ heading: 'Ready to get started?' }}
            {...formProps}
          />
        ) : null}
      </main>
      <LandingFooter />
      {page.theme.show_sticky_mobile_cta_bar ? <StickyCtaBar cta={cta} /> : null}
      {page.theme.show_floating_whatsapp_button ? <FloatingWhatsAppButton cta={cta} /> : null}
    </div>
  )
}

function renderSection(
  sec: LandingPageSection,
  page: LandingPageDoc,
  cta: CtaConfig,
  formProps: {
    landingPageId: string
    landingPageSlug: string
    serviceInterest: string
    conversionId: string
    conversionLabel: string
    thankYouRedirectUrl?: string
  }
) {
  const key = sec.id
  switch (sec.type) {
    case 'hero':
      return (
        <HeroSection
          key={key}
          variant={page.theme.hero_variant}
          props={sec.props}
          cta={cta}
          {...formProps}
        />
      )
    case 'trust-bar':
      return <TrustBar key={key} props={sec.props} />
    case 'stats-row':
      return <StatsRow key={key} props={sec.props} />
    case 'testimonials-carousel':
      return <TestimonialsCarousel key={key} props={sec.props} />
    case 'video-testimonial':
      return <VideoTestimonial key={key} props={sec.props} />
    case 'awards-press':
      return <AwardsPress key={key} props={sec.props} />
    case 'feature-grid':
      return <FeatureGrid key={key} props={sec.props} />
    case 'process-steps':
      return <ProcessSteps key={key} props={sec.props} />
    case 'comparison-table':
      return <ComparisonTable key={key} props={sec.props} />
    case 'pricing':
      return <Pricing key={key} props={sec.props} cta={cta} />
    case 'inline-form':
      return <InlineForm key={key} props={sec.props} {...formProps} />
    case 'cta-banner':
      return <CtaBanner key={key} props={sec.props} cta={cta} />
    case 'lead-magnet':
      return <LeadMagnet key={key} props={sec.props} {...formProps} />
    case 'final-cta':
      return <FinalCta key={key} props={sec.props} {...formProps} />
    case 'faq':
      return <Faq key={key} props={sec.props} />
    case 'guarantee':
      return <Guarantee key={key} props={sec.props} />
    case 'risk-reversal':
      return <RiskReversal key={key} props={sec.props} />
    default:
      return null
  }
}
