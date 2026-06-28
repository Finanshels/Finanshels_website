'use client'

import { jsonArray, s } from '@/lib/landing-pages/safeProps'
import { Container, SectionWrap, SectionHeading } from './primitives'

type Common = { props: Record<string, unknown> }

export function StatsRow({ props }: Common) {
  const heading = s(props.heading)
  const items = jsonArray(props.items) as Array<{ value?: string; label?: string }>

  return (
    <SectionWrap bg="slate" pad="md">
      <Container>
        <SectionHeading heading={heading} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
          {items.map((item, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl sm:text-5xl font-display font-semibold text-slate-900 tabular-nums">
                {s(item.value)}
              </p>
              <p className="mt-1 text-sm text-slate-600">{s(item.label)}</p>
            </div>
          ))}
        </div>
      </Container>
    </SectionWrap>
  )
}
