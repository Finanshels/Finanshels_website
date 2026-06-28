'use client'

import { useRef } from 'react'
import { Play, Star, ChevronLeft, ChevronRight } from 'lucide-react'

const avatarUrl = (seed) =>
  `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&radius=50&backgroundColor=fff4ec`

const unsplash = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`

// Photo source for a card: a full URL (CMS customer_photo) or an Unsplash id
// (demo fallback data); '' when absent so the card shows its dark background.
const photoSrc = (img) =>
  typeof img === 'string' && /^https?:\/\//.test(img) ? img : img ? unsplash(img) : ''

function ScrollRow({ children, ariaLabel = 'items' }) {
  const ref = useRef(null)
  const nudge = (dir) => {
    const el = ref.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }
  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex snap-x gap-5 overflow-x-auto px-5 pb-4 sm:px-8 lg:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <button
        type="button"
        onClick={() => nudge(-1)}
        aria-label={`Scroll ${ariaLabel} left`}
        className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0b1224] shadow-md transition hover:bg-slate-50 md:flex"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => nudge(1)}
        aria-label={`Scroll ${ariaLabel} right`}
        className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0b1224] shadow-md transition hover:bg-slate-50 md:flex"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}

/**
 * Reusable "Trusted By Entrepreneurs" testimonial carousel — video + text card
 * variants. Fed by CMS reviews (reviewsRepository.getTestimonials) or any array
 * of the same shape: { id?, type: 'video'|'text', name, role, company, quote,
 * rating, img, videoUrl }. Presentational client component — renders nothing
 * when `items` is empty (callers provide their own fallback).
 */
export default function TestimonialsCarousel({ items = [], ariaLabel = 'reviews' }) {
  if (!items.length) return null
  return (
    <ScrollRow ariaLabel={ariaLabel}>
      {items.map((r) =>
        r.type === 'video' ? (
          <div
            key={r.id ?? r.name}
            className="relative h-[440px] w-[300px] shrink-0 snap-start overflow-hidden rounded-[24px] bg-slate-800 shadow-sm"
          >
            {photoSrc(r.img) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoSrc(r.img)} alt={r.name} className="h-full w-full object-cover" loading="lazy" />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/25" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 ring-1 ring-white/50 backdrop-blur-sm">
              <Play size={24} className="ml-0.5 fill-white text-white" />
            </span>
            <div className="absolute inset-x-0 bottom-0 p-5">
              {r.company ? (
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/70">{r.company}</p>
              ) : null}
              <p className="mt-1 text-lg font-bold text-white">{r.name}</p>
              {r.role ? <p className="text-xs text-white/80">{r.role}</p> : null}
            </div>
          </div>
        ) : (
          <div
            key={r.id ?? r.name}
            className="flex h-[440px] w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} className={(r.rating ?? 5) >= i ? 'fill-amber-500 text-amber-500' : 'text-slate-200'} />
              ))}
            </div>
            <p className="mt-4 flex-1 overflow-hidden text-sm leading-relaxed text-slate-700">{r.quote}</p>
            <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoSrc(r.img) || avatarUrl(r.name)}
                alt={r.name}
                className="h-11 w-11 rounded-full bg-[#fff4ec] object-cover"
                loading="lazy"
              />
              <div>
                <p className="text-sm font-bold text-[#0b1224]">{r.name}</p>
                {r.role ? <p className="text-xs text-slate-500">{r.role}</p> : null}
              </div>
            </div>
          </div>
        )
      )}
    </ScrollRow>
  )
}
