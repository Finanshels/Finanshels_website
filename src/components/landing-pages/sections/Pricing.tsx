'use client'

import * as Lucide from 'lucide-react'
import { b, jsonArray, s } from '@/lib/landing-pages/safeProps'
import { FormScrollButton } from '../CtaButtons'
import type { CtaConfig } from '../CtaButtons'
import { Container, SectionWrap, SectionHeading, normalizeHeadingLevel } from './primitives'

type Common = { props: Record<string, unknown> }
type WithCta = Common & { cta: CtaConfig }

export function Pricing({ props, cta }: WithCta) {
  const heading = s(props.heading)
  const subheading = s(props.subheading)
  const tiers = jsonArray(props.tiers) as Array<{
    name?: string
    price?: string
    priceSuffix?: string
    description?: string
    features?: unknown[]
    ctaLabel?: string
    highlighted?: boolean
  }>

  return (
    <SectionWrap bg="white">
      <Container>
        <SectionHeading heading={heading} subheading={subheading} level={normalizeHeadingLevel(props.heading_level)} />
        <div className={`grid gap-5 ${tiers.length === 1 ? 'max-w-md mx-auto' : tiers.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3'}`}>
          {tiers.map((tier, i) => {
            const highlighted = b(tier.highlighted)
            return (
              <div
                key={i}
                className={`rounded-2xl border p-6 sm:p-7 ${highlighted ? 'border-amber-300 ring-2 ring-amber-200 bg-amber-50/40 relative' : 'border-slate-200 bg-white'}`}
              >
                {highlighted ? (
                  <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-amber-400 text-slate-900 text-[11px] font-semibold px-2 py-0.5">
                    Most popular
                  </span>
                ) : null}
                <h3 className="text-lg font-semibold text-slate-900">{s(tier.name)}</h3>
                {tier.description ? <p className="mt-1 text-sm text-slate-600">{s(tier.description)}</p> : null}
                <p className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-display font-semibold text-slate-900">{s(tier.price)}</span>
                  {tier.priceSuffix ? <span className="text-sm text-slate-500">{s(tier.priceSuffix)}</span> : null}
                </p>
                <ul className="mt-5 space-y-2.5 text-sm text-slate-800">
                  {(tier.features ?? []).map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-2">
                      <Lucide.Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{s(feat)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <FormScrollButton cta={cta} label={s(tier.ctaLabel) || 'Get started'} className="w-full" />
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </SectionWrap>
  )
}
