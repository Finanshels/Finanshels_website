'use client'

import { useEffect, useState } from 'react'
import { Play, Star } from 'lucide-react'

/**
 * Live testimonial preview for the customer_reviews editor. Reviews are
 * embedded-only (no public page / "View" link), so this shows editors how the
 * review renders in the site's "Trusted By Entrepreneurs" testimonial carousel
 * (see src/screens/Home4.jsx). Two variants, matched to that template:
 *   - video card (when a Video review URL is set): full-bleed photo + play +
 *     duration badge, company / name / role at the bottom.
 *   - text card: stars + quote + avatar / name / role.
 * Mirrors CardPreview's form-watching: reads field values by `name` and
 * re-renders on input.
 */

type Props = {
  /** DOM id of the editor form to observe. */
  formId?: string
}

function readField(form: HTMLFormElement | null, name: string): string {
  if (!form) return ''
  const el = form.elements.namedItem(name)
  if (!el) return ''
  if (el instanceof HTMLInputElement) return el.value.trim()
  if (el instanceof HTMLTextAreaElement) return el.value.trim()
  if (el instanceof HTMLSelectElement) return el.value.trim()
  if (el instanceof RadioNodeList) {
    return Array.from(el).map((n) => (n as HTMLInputElement).value).filter(Boolean)[0] ?? ''
  }
  return ''
}

/** Extract a YouTube video id from the common URL shapes (youtu.be, watch?v=, /embed/). */
function youTubeId(url: string): string | null {
  const m =
    url.match(/youtu\.be\/([\w-]{11})/) ||
    url.match(/[?&]v=([\w-]{11})/) ||
    url.match(/youtube\.com\/embed\/([\w-]{11})/)
  return m?.[1] ?? null
}

export default function TestimonialPreview({ formId = 'cms-editor-form' }: Props) {
  const [name, setName] = useState('')
  const [designation, setDesignation] = useState('')
  const [company, setCompany] = useState('')
  const [quote, setQuote] = useState('')
  const [photo, setPhoto] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [ratingRaw, setRatingRaw] = useState('')

  useEffect(() => {
    let form: HTMLFormElement | null =
      (document.getElementById(formId) as HTMLFormElement | null) ??
      (document.querySelector('form[data-cms-editor]') as HTMLFormElement | null) ??
      (document.querySelector('form') as HTMLFormElement | null)
    if (!form) return

    const refresh = () => {
      setName(readField(form, 'customer_name'))
      setDesignation(readField(form, 'customer_designation'))
      setCompany(readField(form, 'company'))
      setQuote(readField(form, 'review_text'))
      setPhoto(readField(form, 'customer_photo'))
      setVideoUrl(readField(form, 'video_review_url'))
      setRatingRaw(readField(form, 'rating'))
    }
    refresh()
    form.addEventListener('input', refresh)
    form.addEventListener('change', refresh)
    return () => {
      form?.removeEventListener('input', refresh)
      form?.removeEventListener('change', refresh)
    }
  }, [formId])

  const isVideo = videoUrl.length > 0
  const displayName = name || 'Customer name'
  const initial = (name || '?').charAt(0).toUpperCase()
  // Default to 5 (the carousel's all-5-star look) when rating is unset.
  const rating = Math.max(0, Math.min(5, Math.round(Number(ratingRaw) || 5)))
  // Video poster: the customer photo (matches the template's full-bleed portrait),
  // falling back to the YouTube thumbnail when no photo is set.
  const ytId = youTubeId(videoUrl)
  const poster = photo || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '')

  return (
    <div className="rounded-2xl border border-dashed border-cms-rule bg-cms-soft p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Testimonial preview</p>
      <p className="mt-1 text-xs text-slate-500">
        How this review renders in the “Trusted By Entrepreneurs” carousel. Reviews have no public page — they appear in
        testimonial sections.
      </p>

      <div className="mt-3">
        {isVideo ? (
          <div className="group relative h-[440px] w-[300px] overflow-hidden rounded-[24px] bg-slate-800 shadow-sm">
            {poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-slate-700" aria-hidden />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/25" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 ring-1 ring-white/50 backdrop-blur-sm">
              <Play size={24} className="ml-0.5 fill-white text-white" />
            </span>
            <div className="absolute inset-x-0 bottom-0 p-5">
              {company ? (
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/70">{company}</p>
              ) : null}
              <p className="mt-1 text-lg font-bold text-white">{displayName}</p>
              {designation ? <p className="text-xs text-white/80">{designation}</p> : null}
            </div>
          </div>
        ) : (
          <div className="flex h-[440px] w-[300px] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} className={i <= rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'} />
              ))}
            </div>
            <p className="mt-4 flex-1 overflow-hidden text-sm leading-relaxed text-slate-700">
              {quote || <span className="italic text-slate-400">The review text will appear here…</span>}
            </p>
            <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt={displayName} className="h-11 w-11 rounded-full bg-[#fff4ec] object-cover" />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff4ec] text-sm font-semibold text-[#f16610]">
                  {initial}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#0b1224]">{displayName}</p>
                {designation ? <p className="truncate text-xs text-slate-500">{designation}</p> : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
