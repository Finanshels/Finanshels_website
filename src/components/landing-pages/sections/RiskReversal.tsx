'use client'

import { jsonArray, s } from '@/lib/landing-pages/safeProps'
import { Container, getLucideIcon } from './primitives'

type Common = { props: Record<string, unknown> }

export function RiskReversal({ props }: Common) {
  const items = jsonArray(props.items) as Array<{ icon?: string; text?: string }>
  return (
    <section className="bg-white py-6">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-slate-600">
          {items.map((item, i) => {
            const Icon = getLucideIcon(item.icon)
            return (
              <span key={i} className="inline-flex items-center gap-1.5">
                <Icon className="size-4 text-emerald-600" />
                {s(item.text)}
              </span>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
