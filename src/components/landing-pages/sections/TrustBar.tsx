'use client'

import Image from 'next/image'
import * as Lucide from 'lucide-react'
import { jsonArray, s } from '@/lib/landing-pages/safeProps'
import { Container } from './primitives'

type Common = { props: Record<string, unknown> }

export function TrustBar({ props }: Common) {
  const heading = s(props.heading)
  const ratingLabel = s(props.ratingLabel)
  const logos = jsonArray(props.logos).filter((x): x is { src: string; alt?: string } => Boolean(x && typeof x === 'object' && 'src' in (x as Record<string, unknown>)))

  return (
    <section className="border-y border-slate-100 bg-white py-6 sm:py-8">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 justify-center">
          {heading ? <p className="text-sm font-medium text-slate-600 text-center sm:text-left">{heading}</p> : null}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 opacity-80">
            {logos.map((logo, i) => (
              <Image
                key={i}
                src={logo.src}
                alt={logo.alt ?? ''}
                width={120}
                height={32}
                className="h-7 sm:h-8 w-auto object-contain grayscale"
              />
            ))}
          </div>
          {ratingLabel ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-3 py-1">
              <Lucide.Star className="size-3.5 fill-amber-500 text-amber-500" />
              {ratingLabel}
            </span>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
