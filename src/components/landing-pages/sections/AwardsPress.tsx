'use client'

import Image from 'next/image'
import { jsonArray, s } from '@/lib/landing-pages/safeProps'
import { Container, SectionWrap } from './primitives'

type Common = { props: Record<string, unknown> }

export function AwardsPress({ props }: Common) {
  const heading = s(props.heading) || 'Recognised by'
  const logos = jsonArray(props.logos).filter((x): x is { src: string; alt?: string } => Boolean(x && typeof x === 'object' && 'src' in (x as Record<string, unknown>)))
  return (
    <SectionWrap bg="white" pad="sm">
      <Container>
        <div className="flex flex-col items-center gap-5">
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-500">{heading}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-80">
            {logos.map((logo, i) => (
              <Image
                key={i}
                src={logo.src}
                alt={logo.alt ?? ''}
                width={140}
                height={40}
                className="h-8 sm:h-10 w-auto object-contain grayscale"
              />
            ))}
          </div>
        </div>
      </Container>
    </SectionWrap>
  )
}
