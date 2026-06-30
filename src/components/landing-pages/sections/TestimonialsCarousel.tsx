'use client'

import * as Lucide from 'lucide-react'
import { jsonArray, s } from '@/lib/landing-pages/safeProps'
import { Container, SectionWrap, SectionHeading, normalizeHeadingLevel } from './primitives'

type Common = { props: Record<string, unknown> }

export function TestimonialsCarousel({ props }: Common) {
  const heading = s(props.heading)
  const subheading = s(props.subheading)
  const items = jsonArray(props.items) as Array<{ quote?: string; author?: string; role?: string; company?: string }>

  return (
    <SectionWrap>
      <Container>
        <SectionHeading heading={heading} subheading={subheading} level={normalizeHeadingLevel(props.heading_level)} />
        <div className="grid md:grid-cols-2 gap-5">
          {items.slice(0, 4).map((item, i) => (
            <figure key={i} className="rounded-2xl border border-slate-200 bg-white p-6">
              <Lucide.Quote className="size-6 text-amber-400" />
              <blockquote className="mt-3 text-slate-800 leading-relaxed">"{s(item.quote)}"</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-slate-900">{s(item.author)}</span>
                {item.role || item.company ? (
                  <span className="text-slate-500"> · {[s(item.role), s(item.company)].filter(Boolean).join(', ')}</span>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </SectionWrap>
  )
}
