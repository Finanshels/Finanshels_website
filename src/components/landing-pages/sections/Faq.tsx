'use client'

import { useState } from 'react'
import * as Lucide from 'lucide-react'
import { jsonArray, s } from '@/lib/landing-pages/safeProps'
import { Container, SectionWrap, SectionHeading } from './primitives'

type Common = { props: Record<string, unknown> }

export function Faq({ props }: Common) {
  const heading = s(props.heading) || 'Frequently asked questions'
  const subheading = s(props.subheading)
  const items = jsonArray(props.items) as Array<{ question?: string; answer?: string }>
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <SectionWrap bg="white">
      <Container>
        <SectionHeading heading={heading} subheading={subheading} />
        <div className="max-w-3xl mx-auto divide-y divide-slate-200 border-y border-slate-200">
          {items.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <details
                key={i}
                open={isOpen}
                onToggle={(e) => {
                  if ((e.target as HTMLDetailsElement).open) setOpenIndex(i)
                  else if (openIndex === i) setOpenIndex(null)
                }}
                className="group py-5"
              >
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                  <span className="text-base font-semibold text-slate-900">{s(item.question)}</span>
                  <Lucide.ChevronDown className="size-5 text-slate-500 shrink-0 mt-0.5 transition group-open:rotate-180" />
                </summary>
                <div className="mt-3 text-slate-700 leading-relaxed">{s(item.answer)}</div>
              </details>
            )
          })}
        </div>
      </Container>
    </SectionWrap>
  )
}
