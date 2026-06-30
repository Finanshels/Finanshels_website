'use client'

import { jsonArray, s } from '@/lib/landing-pages/safeProps'
import { Container, SectionWrap, SectionHeading, getLucideIcon, normalizeHeadingLevel } from './primitives'

type Common = { props: Record<string, unknown> }

export function ProcessSteps({ props }: Common) {
  const heading = s(props.heading)
  const subheading = s(props.subheading)
  const items = jsonArray(props.items) as Array<{ number?: string; icon?: string; title?: string; description?: string }>

  return (
    <SectionWrap bg="slate">
      <Container>
        <SectionHeading heading={heading} subheading={subheading} level={normalizeHeadingLevel(props.heading_level)} />
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const Icon = getLucideIcon(item.icon)
            return (
              <li key={i} className="relative rounded-2xl bg-white border border-slate-200 p-6">
                <div className="absolute -top-3 left-6 inline-flex items-center justify-center size-7 rounded-full bg-slate-900 text-white text-xs font-semibold">
                  {s(item.number) || String(i + 1)}
                </div>
                <Icon className="size-5 text-slate-400" />
                <h3 className="mt-3 text-base font-semibold text-slate-900">{s(item.title)}</h3>
                {item.description ? <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{s(item.description)}</p> : null}
              </li>
            )
          })}
        </ol>
      </Container>
    </SectionWrap>
  )
}
