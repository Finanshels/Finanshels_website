'use client'

import { b, s } from '@/lib/landing-pages/safeProps'
import { CallButton, FormScrollButton, WhatsappButton } from '../CtaButtons'
import type { CtaConfig } from '../CtaButtons'
import { Container } from './primitives'

type Common = { props: Record<string, unknown> }
type WithCta = Common & { cta: CtaConfig }

export function CtaBanner({ props, cta }: WithCta) {
  const heading = s(props.heading) || 'Talk to a tax expert today.'
  const subheading = s(props.subheading)
  const tone = s(props.tone, 'brand') as 'brand' | 'dark' | 'soft'
  const showForm = b(props.showFormButton, true)
  const showCall = b(props.showCallButton, true)
  const showWa = b(props.showWhatsAppButton, true)
  const bg = tone === 'dark' ? 'bg-slate-900 text-white' : tone === 'brand' ? 'bg-amber-400 text-slate-900' : 'bg-slate-50 text-slate-900'
  const buttonTone: 'light' | 'dark' = tone === 'dark' ? 'dark' : 'light'

  return (
    <section className={`${bg} py-12 sm:py-16`}>
      <Container>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-3xl font-display font-semibold leading-tight">{heading}</h2>
            {subheading ? <p className="mt-2 text-sm sm:text-base opacity-80">{subheading}</p> : null}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {showForm ? <FormScrollButton cta={cta} tone={buttonTone} /> : null}
            {showCall ? <CallButton cta={cta} tone={buttonTone} /> : null}
            {showWa ? <WhatsappButton cta={cta} tone={buttonTone} /> : null}
          </div>
        </div>
      </Container>
    </section>
  )
}
