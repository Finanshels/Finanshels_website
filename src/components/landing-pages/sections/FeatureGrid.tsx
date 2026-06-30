'use client'

import { jsonArray, n, s } from '@/lib/landing-pages/safeProps'
import { Container, SectionWrap, SectionHeading, getLucideIcon, normalizeHeadingLevel } from './primitives'

type Common = { props: Record<string, unknown> }

export function FeatureGrid({ props }: Common) {
  const heading = s(props.heading)
  const subheading = s(props.subheading)
  const columns = Math.min(Math.max(n(props.columns, 4), 2), 4)
  const items = jsonArray(props.items) as Array<{ icon?: string; title?: string; description?: string }>
  const gridCols = columns === 2 ? 'md:grid-cols-2' : columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'

  return (
    <SectionWrap bg="white">
      <Container>
        <SectionHeading heading={heading} subheading={subheading} level={normalizeHeadingLevel(props.heading_level)} />
        <div className={`grid grid-cols-1 ${gridCols} gap-5`}>
          {items.map((item, i) => {
            const Icon = getLucideIcon(item.icon)
            return (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-sm transition">
                <div className="size-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{s(item.title)}</h3>
                {item.description ? <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{s(item.description)}</p> : null}
              </div>
            )
          })}
        </div>
      </Container>
    </SectionWrap>
  )
}
