'use client'

import { s } from '@/lib/landing-pages/safeProps'
import { Container, SectionWrap, getLucideIcon } from './primitives'

type Common = { props: Record<string, unknown> }

export function Guarantee({ props }: Common) {
  const heading = s(props.heading)
  const body = s(props.body)
  const Icon = getLucideIcon(props.iconName || 'shield-check')
  return (
    <SectionWrap bg="slate" pad="md">
      <Container>
        <div className="max-w-3xl mx-auto rounded-2xl border border-emerald-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row gap-5 items-start">
          <div className="size-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Icon className="size-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{heading}</h3>
            <p className="mt-2 text-slate-700 leading-relaxed">{body}</p>
          </div>
        </div>
      </Container>
    </SectionWrap>
  )
}
