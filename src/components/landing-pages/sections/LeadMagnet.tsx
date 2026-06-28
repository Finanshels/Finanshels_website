'use client'

import Image from 'next/image'
import * as Lucide from 'lucide-react'
import { s, jsonArray } from '@/lib/landing-pages/safeProps'
import LeadForm from '../LeadForm'
import { Container, SectionWrap } from './primitives'

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

export function LeadMagnet({ props, ...formProps }: WithLeadForm) {
  const heading = s(props.heading)
  const subheading = s(props.subheading)
  const fileUrl = s(props.fileUrl)
  const coverImageUrl = s(props.coverImageUrl)
  const submitLabel = s(props.submitLabel) || 'Send me the checklist'

  return (
    <SectionWrap bg="slate">
      <Container>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
          <div className="flex justify-center">
            {coverImageUrl ? (
              <Image
                src={coverImageUrl}
                alt=""
                width={640}
                height={480}
                className="max-h-80 w-auto rounded-xl shadow-lg"
              />
            ) : (
              <div className="size-48 rounded-xl bg-amber-100 flex items-center justify-center">
                <Lucide.FileDown className="size-16 text-amber-700" />
              </div>
            )}
          </div>
          <div>
            <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1">Free download</span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold tracking-tight text-slate-900">{heading}</h2>
            {subheading ? <p className="mt-3 text-base text-slate-600">{subheading}</p> : null}
            <div className="mt-6">
              <LeadForm
                landingPageId={formProps.landingPageId}
                landingPageSlug={formProps.landingPageSlug}
                serviceInterest={formProps.serviceInterest}
                conversionId={formProps.conversionId}
                conversionLabel={formProps.conversionLabel}
                thankYouRedirectUrl={fileUrl || formProps.thankYouRedirectUrl}
                submitLabel={submitLabel}
                variant="card"
              />
            </div>
          </div>
        </div>
      </Container>
    </SectionWrap>
  )
}
