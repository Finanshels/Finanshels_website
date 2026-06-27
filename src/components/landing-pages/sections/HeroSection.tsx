'use client'

import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import LeadForm from '../LeadForm'
import type { CtaConfig } from '../CtaButtons'
import type { HeroVariant } from '@/lib/landingPages/types'
import { asObject, b, jsonArray, n, s, splitLines } from '@/lib/landingPages/safeProps'

export type HeroSectionProps = {
  variant: HeroVariant
  props: Record<string, unknown>
  cta: CtaConfig
  landingPageId: string
  landingPageSlug: string
  serviceInterest: string
  conversionId: string
  conversionLabel: string
  thankYouRedirectUrl?: string
}

function readBullets(value: unknown): string[] {
  const arr = jsonArray(value)
  if (arr.length) return arr.filter((v): v is string => typeof v === 'string')
  return splitLines(value)
}

export default function HeroSection({
  variant,
  props,
  cta,
  landingPageId,
  landingPageSlug,
  serviceInterest,
  conversionId,
  conversionLabel,
  thankYouRedirectUrl,
}: HeroSectionProps) {
  const eyebrow = s(props.eyebrow)
  const heading = s(props.heading)
  const subheading = s(props.subheading)
  const bullets = readBullets(props.bullets)
  const imageUrl = s(props.imageUrl)
  const videoUrl = s(props.videoUrl)
  const formHeading = s(props.formHeading) || 'Get a free quote in 24 hours'
  const formSubheading = s(props.formSubheading)
  const submitLabel = s(props.submitLabel) || 'Get my free quote'
  const urgencyText = s(props.urgencyText)
  const urgencyDeadline = s(props.urgencyDeadline)

  const formElement = (
    <div className="space-y-1.5">
      <div className="px-1">
        <h2 className="text-lg font-semibold text-slate-900">{formHeading}</h2>
        {formSubheading ? <p className="text-sm text-slate-600 mt-1">{formSubheading}</p> : null}
      </div>
      <LeadForm
        landingPageId={landingPageId}
        landingPageSlug={landingPageSlug}
        serviceInterest={serviceInterest}
        conversionId={conversionId}
        conversionLabel={conversionLabel}
        submitLabel={submitLabel}
        thankYouRedirectUrl={thankYouRedirectUrl}
        variant="card"
        anchorId="lead-form"
      />
    </div>
  )

  if (variant === 'urgency-banner') {
    return (
      <section className="relative bg-gradient-to-b from-amber-50 to-white">
        {urgencyText || urgencyDeadline ? (
          <div className="bg-amber-500 text-slate-900 text-center text-sm font-semibold px-4 py-2.5">
            <UrgencyContent text={urgencyText} deadline={urgencyDeadline} />
          </div>
        ) : null}
        <Split
          eyebrow={eyebrow}
          heading={heading}
          subheading={subheading}
          bullets={bullets}
          imageUrl={imageUrl}
          formElement={formElement}
        />
      </section>
    )
  }

  if (variant === 'centered-form') {
    return (
      <section className="relative bg-gradient-to-b from-slate-50 to-white pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          {eyebrow ? <p className="text-xs font-semibold tracking-wider text-amber-700 uppercase">{eyebrow}</p> : null}
          <h1 className="mt-3 text-3xl sm:text-5xl font-display font-semibold tracking-tight text-slate-900 leading-[1.05]">
            {heading}
          </h1>
          {subheading ? <p className="mt-4 text-base sm:text-lg text-slate-600">{subheading}</p> : null}
          {bullets.length ? (
            <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-slate-700">
              {bullets.map((bullet, i) => (
                <li key={i} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  {bullet}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-8 max-w-md mx-auto">{formElement}</div>
        </div>
      </section>
    )
  }

  if (variant === 'video-form') {
    return (
      <section className="relative bg-gradient-to-b from-slate-50 to-white">
        <Split
          eyebrow={eyebrow}
          heading={heading}
          subheading={subheading}
          bullets={bullets}
          videoUrl={videoUrl}
          imageUrl={imageUrl}
          formElement={formElement}
        />
      </section>
    )
  }

  // split-form (default)
  return (
    <section className="relative bg-gradient-to-b from-slate-50 to-white">
      <Split
        eyebrow={eyebrow}
        heading={heading}
        subheading={subheading}
        bullets={bullets}
        imageUrl={imageUrl}
        formElement={formElement}
      />
    </section>
  )
}

function Split({
  eyebrow,
  heading,
  subheading,
  bullets,
  imageUrl,
  videoUrl,
  formElement,
}: {
  eyebrow: string
  heading: string
  subheading: string
  bullets: string[]
  imageUrl?: string
  videoUrl?: string
  formElement: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-16 sm:pb-20">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
        <div className="order-2 lg:order-1">
          {eyebrow ? <p className="text-xs font-semibold tracking-wider text-amber-700 uppercase">{eyebrow}</p> : null}
          <h1 className="mt-3 text-3xl sm:text-5xl lg:text-[3.25rem] font-display font-semibold tracking-tight text-slate-900 leading-[1.05]">
            {heading}
          </h1>
          {subheading ? <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl">{subheading}</p> : null}
          {bullets.length ? (
            <ul className="mt-5 space-y-2">
              {bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-800">
                  <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {videoUrl ? (
            <div className="mt-6 rounded-xl overflow-hidden aspect-video bg-slate-100 max-w-lg">
              <VideoEmbed url={videoUrl} />
            </div>
          ) : imageUrl ? (
            <div className="mt-6 relative aspect-[4/3] max-w-lg rounded-xl overflow-hidden bg-slate-100">
              <Image src={imageUrl} alt="" fill className="object-cover" sizes="(min-width: 1024px) 480px, 100vw" priority />
            </div>
          ) : null}
        </div>
        <div className="order-1 lg:order-2">{formElement}</div>
      </div>
    </div>
  )
}

function VideoEmbed({ url }: { url: string }) {
  const youtubeId = extractYoutubeId(url)
  if (youtubeId) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title="Hero video"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    )
  }
  const vimeoId = extractVimeoId(url)
  if (vimeoId) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}`}
        title="Hero video"
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    )
  }
  return (
    <video controls className="w-full h-full object-cover">
      <source src={url} />
    </video>
  )
}

function extractYoutubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=)([\w-]{6,})/)
  return m?.[1] ?? null
}

function extractVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(\d+)/)
  return m?.[1] ?? null
}

function UrgencyContent({ text, deadline }: { text: string; deadline: string }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const target = deadline ? new Date(deadline).getTime() : 0
  if (!target || Number.isNaN(target)) return <span>{text}</span>
  const diff = Math.max(0, target - now)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return (
    <span>
      {text || 'Deadline'} —{' '}
      <span className="tabular-nums font-bold">
        {days}d {hours}h {minutes}m {seconds}s
      </span>
    </span>
  )
}
