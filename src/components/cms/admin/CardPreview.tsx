'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, Star } from 'lucide-react'

type Props = {
  /** DOM element ID of the form scope to observe; when omitted, watches the closest <form>. */
  formId?: string
  /** Fallbacks pulled from the publish section (so the card preview never looks empty). */
  fallbackTitle?: string
  fallbackDescription?: string
  fallbackImage?: string
  fallbackCtaUrl?: string
  collectionLabel?: string
}

function readField(form: HTMLFormElement | null, name: string): string {
  if (!form) return ''
  const el = form.elements.namedItem(name)
  if (!el) return ''
  if (el instanceof HTMLInputElement) return el.value.trim()
  if (el instanceof HTMLTextAreaElement) return el.value.trim()
  if (el instanceof HTMLSelectElement) return el.value.trim()
  if (el instanceof RadioNodeList) return Array.from(el).map((n) => (n as HTMLInputElement).value).filter(Boolean)[0] ?? ''
  return ''
}

function readBoolean(form: HTMLFormElement | null, name: string): boolean {
  const v = readField(form, name)
  return v === 'true' || v === 'on' || v === '1'
}

export default function CardPreview({
  formId,
  fallbackTitle = '',
  fallbackDescription = '',
  fallbackImage = '',
  fallbackCtaUrl = '',
  collectionLabel = '',
}: Props) {
  const [cardTitle, setCardTitle] = useState('')
  const [cardDescription, setCardDescription] = useState('')
  const [cardImage, setCardImage] = useState('')
  const [cardLabel, setCardLabel] = useState('')
  const [cardCtaLabel, setCardCtaLabel] = useState('')
  const [cardCtaLink, setCardCtaLink] = useState('')
  const [featured, setFeatured] = useState(false)

  useEffect(() => {
    let form: HTMLFormElement | null = formId
      ? (document.getElementById(formId) as HTMLFormElement | null)
      : (document.querySelector('form[data-cms-editor]') as HTMLFormElement | null)
    if (!form) {
      form = document.querySelector('form') as HTMLFormElement | null
    }
    if (!form) return

    const refresh = () => {
      setCardTitle(readField(form, 'card_title'))
      setCardDescription(readField(form, 'card_description'))
      setCardImage(readField(form, 'card_image'))
      setCardLabel(readField(form, 'card_label'))
      setCardCtaLabel(readField(form, 'card_cta_label'))
      setCardCtaLink(readField(form, 'card_cta_link'))
      setFeatured(readBoolean(form, 'featured'))
    }
    refresh()
    form.addEventListener('input', refresh)
    form.addEventListener('change', refresh)
    return () => {
      form?.removeEventListener('input', refresh)
      form?.removeEventListener('change', refresh)
    }
  }, [formId])

  const title = cardTitle || fallbackTitle || 'Card title'
  const description = cardDescription || fallbackDescription || 'A compelling description appears here when content is added.'
  const image = cardImage || fallbackImage
  const ctaLabel = cardCtaLabel || 'Read more'
  const ctaLink = cardCtaLink || fallbackCtaUrl || '#'

  return (
    <div className="rounded-2xl border border-dashed border-cms-rule bg-cms-soft p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Card preview</p>
      <p className="mt-1 text-xs text-slate-500">
        Live preview of how this entry renders on listing pages. Falls back to publish-section fields.
      </p>

      <article className="mt-3 max-w-sm overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {image ? (
          <div
            className="aspect-[16/9] bg-slate-100 bg-cover bg-center"
            style={{ backgroundImage: `url("${image}")` }}
            aria-hidden
          />
        ) : (
          <div className="aspect-[16/9] bg-gradient-to-br from-[#fff3e8] to-[#ffe1cc]" aria-hidden />
        )}
        <div className="p-5">
          <div className="flex items-center gap-2">
            {collectionLabel ? (
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                {collectionLabel}
              </span>
            ) : null}
            {cardLabel ? (
              <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-primary">
                {cardLabel}
              </span>
            ) : null}
            {featured ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-700">
                <Star className="h-3 w-3" aria-hidden /> Featured
              </span>
            ) : null}
          </div>
          <h3 className="mt-2 line-clamp-2 text-lg font-semibold tracking-tight text-slate-900">{title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{description}</p>
          <a
            href={ctaLink === '#' ? undefined : ctaLink}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#f16610]"
          >
            {ctaLabel}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </article>
    </div>
  )
}
