'use client'

import * as Lucide from 'lucide-react'
import { s } from '@/lib/landing-pages/safeProps'
import { Container, SectionWrap } from './primitives'

type Common = { props: Record<string, unknown> }

export function VideoTestimonial({ props }: Common) {
  const videoUrl = s(props.videoUrl)
  const quote = s(props.quote)
  const author = s(props.author)
  const role = s(props.role)
  const company = s(props.company)
  if (!videoUrl) return null

  return (
    <SectionWrap bg="slate">
      <Container>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="rounded-xl overflow-hidden aspect-video bg-slate-900">
            <iframe
              src={videoUrl.replace('watch?v=', 'embed/')}
              title="Customer testimonial"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <div>
            <Lucide.Quote className="size-8 text-amber-400" />
            <blockquote className="mt-3 text-xl sm:text-2xl font-display text-slate-900 leading-snug">
              "{quote}"
            </blockquote>
            <p className="mt-4 text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{author}</span>
              {role || company ? <> · {[role, company].filter(Boolean).join(', ')}</> : null}
            </p>
          </div>
        </div>
      </Container>
    </SectionWrap>
  )
}
