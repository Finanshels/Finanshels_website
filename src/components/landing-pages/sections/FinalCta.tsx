'use client'

import { s } from '@/lib/landing-pages/safeProps'
import LeadForm from '../LeadForm'
import { Container } from './primitives'

type Common = { props: Record<string, unknown> }
type LeadFormBaseProps = {
  landingPageId: string
  landingPageSlug: string
  serviceInterest: string
  conversionId: string
  conversionLabel: string
  thankYouRedirectUrl?: string
}
type WithLeadForm = Common & LeadFormBaseProps

export function FinalCta({ props, ...formProps }: WithLeadForm) {
  const heading = s(props.heading) || 'Stop worrying about tax.'
  const subheading = s(props.subheading)
  const submitLabel = s(props.submitLabel) || 'Get my free quote'
  const tone = s(props.tone, 'dark') as 'dark' | 'brand' | 'soft'
  const bg = tone === 'dark' ? 'bg-slate-900 text-white' : tone === 'brand' ? 'bg-amber-50' : 'bg-slate-50'

  return (
    <section className={`${bg} py-16 sm:py-24`}>
      <Container>
        <div className="grid lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
          <div>
            <h2 className={`text-3xl sm:text-5xl font-display font-semibold tracking-tight ${tone === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {heading}
            </h2>
            {subheading ? <p className={`mt-4 text-base sm:text-lg ${tone === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{subheading}</p> : null}
          </div>
          <div>
            <LeadForm
              landingPageId={formProps.landingPageId}
              landingPageSlug={formProps.landingPageSlug}
              serviceInterest={formProps.serviceInterest}
              conversionId={formProps.conversionId}
              conversionLabel={formProps.conversionLabel}
              thankYouRedirectUrl={formProps.thankYouRedirectUrl}
              submitLabel={submitLabel}
              variant="card"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
