'use client'

import Image from 'next/image'
import * as Lucide from 'lucide-react'
import { useState } from 'react'
import LeadForm from '../LeadForm'
import { CallButton, FormScrollButton, WhatsappButton, type CtaConfig } from '../CtaButtons'
import { asObject, b, jsonArray, n, s, splitLines } from '@/lib/landingPages/safeProps'

type Common = {
  props: Record<string, unknown>
}

type LeadFormBaseProps = {
  landingPageId: string
  landingPageSlug: string
  serviceInterest: string
  conversionId: string
  conversionLabel: string
  thankYouRedirectUrl?: string
}

type WithLeadForm = Common & LeadFormBaseProps

type WithCta = Common & { cta: CtaConfig }

function getLucideIcon(name: unknown): React.ComponentType<{ className?: string }> {
  const raw = s(name) || 'circle-check'
  const pascal = raw
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
  const Comp = (Lucide as unknown as Record<string, React.ComponentType<{ className?: string }>>)[pascal]
  return Comp ?? Lucide.CheckCircle
}

function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className ?? ''}`}>{children}</div>
}

function SectionWrap({
  children,
  bg = 'white',
  pad = 'lg',
}: {
  children: React.ReactNode
  bg?: 'white' | 'slate' | 'brand' | 'dark'
  pad?: 'sm' | 'md' | 'lg'
}) {
  const bgClass = bg === 'slate' ? 'bg-slate-50' : bg === 'brand' ? 'bg-amber-50' : bg === 'dark' ? 'bg-slate-900 text-white' : 'bg-white'
  const padClass = pad === 'sm' ? 'py-10' : pad === 'md' ? 'py-14' : 'py-16 sm:py-20'
  return <section className={`${bgClass} ${padClass}`}>{children}</section>
}

function SectionHeading({ heading, subheading, dark }: { heading?: string; subheading?: string; dark?: boolean }) {
  if (!heading && !subheading) return null
  return (
    <div className="text-center mb-10 max-w-3xl mx-auto">
      {heading ? (
        <h2 className={`text-2xl sm:text-4xl font-display font-semibold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>{heading}</h2>
      ) : null}
      {subheading ? (
        <p className={`mt-3 text-base sm:text-lg ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{subheading}</p>
      ) : null}
    </div>
  )
}

// ---------- Trust bar ----------

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

// ---------- Stats row ----------

export function StatsRow({ props }: Common) {
  const heading = s(props.heading)
  const items = jsonArray(props.items) as Array<{ value?: string; label?: string }>

  return (
    <SectionWrap bg="slate" pad="md">
      <Container>
        <SectionHeading heading={heading} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
          {items.map((item, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl sm:text-5xl font-display font-semibold text-slate-900 tabular-nums">
                {s(item.value)}
              </p>
              <p className="mt-1 text-sm text-slate-600">{s(item.label)}</p>
            </div>
          ))}
        </div>
      </Container>
    </SectionWrap>
  )
}

// ---------- Testimonials carousel ----------

export function TestimonialsCarousel({ props }: Common) {
  const heading = s(props.heading)
  const subheading = s(props.subheading)
  const items = jsonArray(props.items) as Array<{ quote?: string; author?: string; role?: string; company?: string }>

  return (
    <SectionWrap>
      <Container>
        <SectionHeading heading={heading} subheading={subheading} />
        <div className="grid md:grid-cols-2 gap-5">
          {items.slice(0, 4).map((item, i) => (
            <figure key={i} className="rounded-2xl border border-slate-200 bg-white p-6">
              <Lucide.Quote className="size-6 text-amber-400" />
              <blockquote className="mt-3 text-slate-800 leading-relaxed">“{s(item.quote)}”</blockquote>
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

// ---------- Video testimonial ----------

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
              “{quote}”
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

// ---------- Awards / press ----------

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

// ---------- Feature grid ----------

export function FeatureGrid({ props }: Common) {
  const heading = s(props.heading)
  const subheading = s(props.subheading)
  const columns = Math.min(Math.max(n(props.columns, 4), 2), 4)
  const items = jsonArray(props.items) as Array<{ icon?: string; title?: string; description?: string }>
  const gridCols = columns === 2 ? 'md:grid-cols-2' : columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'

  return (
    <SectionWrap bg="white">
      <Container>
        <SectionHeading heading={heading} subheading={subheading} />
        <div className={`grid grid-cols-1 ${gridCols} gap-5`}>
          {items.map((item, i) => {
            const Icon = getLucideIcon(item.icon)
            return (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-sm transition">
                <div className="size-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{s(item.title)}</h3>
                {item.description ? <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{s(item.description)}</p> : null}
              </div>
            )
          })}
        </div>
      </Container>
    </SectionWrap>
  )
}

// ---------- Process steps ----------

export function ProcessSteps({ props }: Common) {
  const heading = s(props.heading)
  const subheading = s(props.subheading)
  const items = jsonArray(props.items) as Array<{ number?: string; icon?: string; title?: string; description?: string }>

  return (
    <SectionWrap bg="slate">
      <Container>
        <SectionHeading heading={heading} subheading={subheading} />
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const Icon = getLucideIcon(item.icon)
            return (
              <li key={i} className="relative rounded-2xl bg-white border border-slate-200 p-6">
                <div className="absolute -top-3 left-6 inline-flex items-center justify-center size-7 rounded-full bg-slate-900 text-white text-xs font-semibold">
                  {s(item.number) || String(i + 1)}
                </div>
                <Icon className="size-5 text-slate-400" />
                <h3 className="mt-3 text-base font-semibold text-slate-900">{s(item.title)}</h3>
                {item.description ? <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{s(item.description)}</p> : null}
              </li>
            )
          })}
        </ol>
      </Container>
    </SectionWrap>
  )
}

// ---------- Comparison table ----------

export function ComparisonTable({ props }: Common) {
  const heading = s(props.heading)
  const subheading = s(props.subheading)
  const columns = jsonArray(props.columns).map((v) => s(v))
  const highlightColumn = n(props.highlightColumn, 0)
  const rows = jsonArray(props.rows) as Array<{ label?: string; values?: unknown[] }>

  return (
    <SectionWrap bg="white">
      <Container>
        <SectionHeading heading={heading} subheading={subheading} />
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left p-4 text-slate-500 font-medium"></th>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={`text-center p-4 font-semibold ${i === highlightColumn ? 'text-slate-900 bg-amber-50' : 'text-slate-700'}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b last:border-0 border-slate-100">
                  <td className="p-4 text-slate-800 font-medium">{s(row.label)}</td>
                  {columns.map((_col, ci) => {
                    const val = row.values?.[ci]
                    const isYes = val === true || val === 'true' || val === '✓' || val === 'yes'
                    return (
                      <td key={ci} className={`p-4 text-center ${ci === highlightColumn ? 'bg-amber-50/50' : ''}`}>
                        {typeof val === 'string' && !['true', 'false', '✓', '✗', 'yes', 'no'].includes(val)
                          ? val
                          : isYes
                          ? <Lucide.Check className="inline size-5 text-emerald-600" />
                          : <Lucide.X className="inline size-5 text-slate-300" />}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </SectionWrap>
  )
}

// ---------- Pricing ----------

export function Pricing({ props, cta }: WithCta) {
  const heading = s(props.heading)
  const subheading = s(props.subheading)
  const tiers = jsonArray(props.tiers) as Array<{
    name?: string
    price?: string
    priceSuffix?: string
    description?: string
    features?: unknown[]
    ctaLabel?: string
    highlighted?: boolean
  }>

  return (
    <SectionWrap bg="white">
      <Container>
        <SectionHeading heading={heading} subheading={subheading} />
        <div className={`grid gap-5 ${tiers.length === 1 ? 'max-w-md mx-auto' : tiers.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3'}`}>
          {tiers.map((tier, i) => {
            const highlighted = b(tier.highlighted)
            return (
              <div
                key={i}
                className={`rounded-2xl border p-6 sm:p-7 ${highlighted ? 'border-amber-300 ring-2 ring-amber-200 bg-amber-50/40 relative' : 'border-slate-200 bg-white'}`}
              >
                {highlighted ? (
                  <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-amber-400 text-slate-900 text-[11px] font-semibold px-2 py-0.5">
                    Most popular
                  </span>
                ) : null}
                <h3 className="text-lg font-semibold text-slate-900">{s(tier.name)}</h3>
                {tier.description ? <p className="mt-1 text-sm text-slate-600">{s(tier.description)}</p> : null}
                <p className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-display font-semibold text-slate-900">{s(tier.price)}</span>
                  {tier.priceSuffix ? <span className="text-sm text-slate-500">{s(tier.priceSuffix)}</span> : null}
                </p>
                <ul className="mt-5 space-y-2.5 text-sm text-slate-800">
                  {(tier.features ?? []).map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-2">
                      <Lucide.Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{s(feat)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <FormScrollButton cta={cta} label={s(tier.ctaLabel) || 'Get started'} className="w-full" />
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </SectionWrap>
  )
}

// ---------- Inline form ----------

export function InlineForm({ props, ...formProps }: WithLeadForm) {
  const heading = s(props.heading) || 'Ready to get started?'
  const subheading = s(props.subheading)
  const submitLabel = s(props.submitLabel) || 'Get my free quote'
  const tone = s(props.backgroundTone, 'soft')
  const bg = tone === 'brand' ? 'bg-amber-50' : tone === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50'

  return (
    <section className={`${bg} py-16 sm:py-20`}>
      <Container>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center max-w-5xl mx-auto">
          <div>
            <h2 className={`text-2xl sm:text-4xl font-display font-semibold tracking-tight ${tone === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {heading}
            </h2>
            {subheading ? <p className={`mt-3 text-base sm:text-lg ${tone === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{subheading}</p> : null}
          </div>
          <LeadForm
            landingPageId={formProps.landingPageId}
            landingPageSlug={formProps.landingPageSlug}
            serviceInterest={formProps.serviceInterest}
            conversionId={formProps.conversionId}
            conversionLabel={formProps.conversionLabel}
            thankYouRedirectUrl={formProps.thankYouRedirectUrl}
            submitLabel={submitLabel}
            variant="inline"
          />
        </div>
      </Container>
    </section>
  )
}

// ---------- CTA banner ----------

export function CtaBanner({ props, cta }: WithCta) {
  const heading = s(props.heading) || 'Talk to a tax expert today.'
  const subheading = s(props.subheading)
  const tone = s(props.tone, 'brand') as 'brand' | 'dark' | 'soft'
  const showForm = b(props.showFormButton, true)
  const showCall = b(props.showCallButton, true)
  const showWa = b(props.showWhatsAppButton, true)
  const bg = tone === 'dark' ? 'bg-slate-900 text-white' : tone === 'brand' ? 'bg-amber-400 text-slate-900' : 'bg-slate-50 text-slate-900'
  const buttonTone: 'light' | 'dark' = tone === 'dark' ? 'dark' : 'light'

  return (
    <section className={`${bg} py-12 sm:py-16`}>
      <Container>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-3xl font-display font-semibold leading-tight">{heading}</h2>
            {subheading ? <p className="mt-2 text-sm sm:text-base opacity-80">{subheading}</p> : null}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {showForm ? <FormScrollButton cta={cta} tone={buttonTone} /> : null}
            {showCall ? <CallButton cta={cta} tone={buttonTone} /> : null}
            {showWa ? <WhatsappButton cta={cta} tone={buttonTone} /> : null}
          </div>
        </div>
      </Container>
    </section>
  )
}

// ---------- Lead magnet ----------

export function LeadMagnet({ props, ...formProps }: WithLeadForm) {
  const heading = s(props.heading)
  const subheading = s(props.subheading)
  const fileUrl = s(props.fileUrl)
  const coverImageUrl = s(props.coverImageUrl)
  const submitLabel = s(props.submitLabel) || 'Send me the checklist'

  return (
    <SectionWrap bg="slate">
      <Container>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
          <div className="flex justify-center">
            {coverImageUrl ? (
              <Image
                src={coverImageUrl}
                alt=""
                width={640}
                height={480}
                className="max-h-80 w-auto rounded-xl shadow-lg"
              />
            ) : (
              <div className="size-48 rounded-xl bg-amber-100 flex items-center justify-center">
                <Lucide.FileDown className="size-16 text-amber-700" />
              </div>
            )}
          </div>
          <div>
            <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1">Free download</span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold tracking-tight text-slate-900">{heading}</h2>
            {subheading ? <p className="mt-3 text-base text-slate-600">{subheading}</p> : null}
            <div className="mt-6">
              <LeadForm
                landingPageId={formProps.landingPageId}
                landingPageSlug={formProps.landingPageSlug}
                serviceInterest={formProps.serviceInterest}
                conversionId={formProps.conversionId}
                conversionLabel={formProps.conversionLabel}
                thankYouRedirectUrl={fileUrl || formProps.thankYouRedirectUrl}
                submitLabel={submitLabel}
                variant="card"
              />
            </div>
          </div>
        </div>
      </Container>
    </SectionWrap>
  )
}

// ---------- Final CTA ----------

export function FinalCta({ props, ...formProps }: WithLeadForm) {
  const heading = s(props.heading) || 'Stop worrying about tax.'
  const subheading = s(props.subheading)
  const submitLabel = s(props.submitLabel) || 'Get my free quote'
  const tone = s(props.tone, 'dark') as 'dark' | 'brand' | 'soft'
  const bg = tone === 'dark' ? 'bg-slate-900 text-white' : tone === 'brand' ? 'bg-amber-50' : 'bg-slate-50'

  return (
    <section className={`${bg} py-16 sm:py-24`}>
      <Container>
        <div className="grid lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
          <div>
            <h2 className={`text-3xl sm:text-5xl font-display font-semibold tracking-tight ${tone === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {heading}
            </h2>
            {subheading ? <p className={`mt-4 text-base sm:text-lg ${tone === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{subheading}</p> : null}
          </div>
          <div>
            <LeadForm
              landingPageId={formProps.landingPageId}
              landingPageSlug={formProps.landingPageSlug}
              serviceInterest={formProps.serviceInterest}
              conversionId={formProps.conversionId}
              conversionLabel={formProps.conversionLabel}
              thankYouRedirectUrl={formProps.thankYouRedirectUrl}
              submitLabel={submitLabel}
              variant="card"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}

// ---------- FAQ ----------

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

// ---------- Guarantee ----------

export function Guarantee({ props }: Common) {
  const heading = s(props.heading)
  const body = s(props.body)
  const Icon = getLucideIcon(props.iconName || 'shield-check')
  return (
    <SectionWrap bg="slate" pad="md">
      <Container>
        <div className="max-w-3xl mx-auto rounded-2xl border border-emerald-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row gap-5 items-start">
          <div className="size-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Icon className="size-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{heading}</h3>
            <p className="mt-2 text-slate-700 leading-relaxed">{body}</p>
          </div>
        </div>
      </Container>
    </SectionWrap>
  )
}

// ---------- Risk reversal ----------

export function RiskReversal({ props }: Common) {
  const items = jsonArray(props.items) as Array<{ icon?: string; text?: string }>
  return (
    <section className="bg-white py-6">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-slate-600">
          {items.map((item, i) => {
            const Icon = getLucideIcon(item.icon)
            return (
              <span key={i} className="inline-flex items-center gap-1.5">
                <Icon className="size-4 text-emerald-600" />
                {s(item.text)}
              </span>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
