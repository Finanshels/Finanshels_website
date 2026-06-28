import Image from 'next/image'
import { Star } from 'lucide-react'
import type { CustomerReviewCardData } from '@/lib/cms/collectionRepository'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '★'
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase()
}

/** Inline testimonial card — reviews have no detail page, so they render in place. */
export function CustomerReviewCard({ review }: { review: CustomerReviewCardData }) {
  const meta = [review.designation, review.company].filter(Boolean).join(', ')

  return (
    <figure className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 transition hover:border-[#f16610]/40 hover:shadow-lg hover:shadow-slate-900/5">
      {review.rating ? (
        <div className="flex gap-0.5" aria-label={`${review.rating} out of 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < review.rating! ? 'fill-[#f16610] text-[#f16610]' : 'text-slate-200'}`}
              aria-hidden
            />
          ))}
        </div>
      ) : null}

      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-700">
        “{review.quote}”
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3">
        {review.photo ? (
          <Image
            src={review.photo}
            alt={review.customerName || 'Customer'}
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ffe9d8] text-sm font-bold text-[#b3470a]">
            {initials(review.customerName)}
          </span>
        )}
        <div className="min-w-0">
          <div className="truncate font-semibold text-slate-900">
            {review.customerName || 'Finanshels customer'}
          </div>
          {meta ? <div className="truncate text-xs text-slate-500">{meta}</div> : null}
        </div>
      </figcaption>

      {review.videoUrl ? (
        <a
          href={review.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#f16610] hover:text-[#b3470a]"
        >
          Watch the video
        </a>
      ) : null}
    </figure>
  )
}
