'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Quote,
  Sparkles,
  Send,
  MessageSquare,
  Wallet,
  Activity,
  Target,
  Users,
  Layers,
  MapPin,
} from 'lucide-react'
import AnimatedSection from '../../components/marketing/AnimatedSection'
import TestimonialsCarousel from '@/components/marketing/TestimonialsCarousel'
import { TESTIMONIALS } from '@/content/team'

const DEFAULT_DELIVERABLES = [
  'Weekly leadership memo covering wins, blockers, and next moves.',
  'Compliance + finance calendar synced with WhatsApp/Slack reminders.',
  'Board-ready reporting pack with commentary and supporting evidence.',
]

const DEFAULT_TRIGGERS = [
  'Regulations across the GCC are evolving faster than internal teams can keep up.',
  'Investors expect board-ready numbers every month.',
  'Better controls unlock smoother cash cycles and valuation uplifts.',
]

// Brand-level trust facts surfaced under the hero (reused site-wide — confirm numbers).
const HERO_TRUST = [
  { value: '7,000+', label: 'businesses served' },
  { value: '135+', label: 'finance experts' },
]

// UAE coverage shown in the "Where we operate" band.
const UAE_COVERAGE = ['Dubai Mainland', 'JAFZA', 'DMCC', 'DIFC', 'ADGM', 'IFZA', 'SHAMS', 'RAKEZ', 'Meydan']

export default function ServiceDetailPage({ page, cmsTestimonials }) {
  const [lead, setLead] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [showSticky, setShowSticky] = useState(false)

  const testimonials = useMemo(() => TESTIMONIALS.slice(0, 2), [])

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 700)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffdfb] text-slate-600">
        <p>Service coming soon.</p>
      </div>
    )
  }

  const triggers = page.whyNow || DEFAULT_TRIGGERS
  const deliverables = page.deliverables || DEFAULT_DELIVERABLES
  const rituals = page.workflow || [
    'Blueprint the process and controls.',
    'Execute with specialists and automations.',
    'Report outcomes with commentary and next steps.',
  ]
  const blueprint = page.solutions || rituals.map((step, index) => `Phase ${index + 1}: ${step}`)
  const signals =
    page.problems || [
      `No consistent process for ${page.title?.toLowerCase() || 'this workstream'} which causes delays and penalties.`,
      'Too many spreadsheets, not enough signal for leadership.',
      'Compliance pressure from boards, regulators, and investors.',
    ]
  const hasPricingTiers = page.pricingTiers?.length > 0
  const startingPrice = page.price || (hasPricingTiers ? page.pricingTiers[0].price : '$219/mo')
  // Clean service label for headings: strip trailing region tag and keep proper
  // casing so we never render "...registration uae." (FIX: title.toLowerCase bug).
  const serviceLabel =
    (page.title || '').replace(/\s+(UAE|Dubai|Abu Dhabi|Sharjah)$/i, '').trim() || page.title

  const handleChange = (event) => {
    const { name, value } = event.target
    setLead((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return
    setError(null)
    setSubmitting(true)
    try {
      // The shared /api/contact endpoint requires a `reason` enum and a
      // message of at least 10 chars. This template only collects name/email/
      // phone/message, so fold phone + service context into the message and
      // tag the lead as `sales` intent (it's a "book a strategy call" form).
      const composedMessage = [
        lead.message.trim(),
        lead.phone.trim() ? `Phone / WhatsApp: ${lead.phone.trim()}` : '',
        `Service interest: ${page.title || 'General enquiry'}`,
      ]
        .filter(Boolean)
        .join('\n')

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: lead.name.trim(),
          email: lead.email.trim(),
          message: composedMessage,
          reason: 'sales',
          pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || `request_failed_${res.status}`)
      }
      setSubmitted(true)
    } catch {
      setError(
        'Something went wrong sending your request. Please email contact@finanshels.com or try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-[#fffdfb] text-slate-900 overflow-hidden">
      {/* HERO */}
      <section className="relative pt-32 pb-20 px-6 sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-[#fef3eb] via-[#fffaf3] to-transparent" />
          <div className="absolute -top-20 -left-32 w-[420px] h-[420px] rounded-full bg-[#f16610]/15 blur-[120px]" />
          <div className="absolute top-40 -right-20 w-[460px] h-[460px] rounded-full bg-[#7e8bff]/20 blur-[140px] animate-pulse-slow" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        </div>

        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-down">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#f16610]/30 bg-white/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#f16610] backdrop-blur">
                <Sparkles size={13} /> {page.title}
              </span>
              {page.price && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-700">
                  From {page.price}
                  {page.priceUnit ? ` · ${page.priceUnit}` : ''}
                </span>
              )}
            </div>
            <h1 className="mt-6 text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.05] tracking-tight max-w-4xl">
              {page.subtitle}
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-3xl">
              {page.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#book"
                className="group inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#f16610]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                {page.price ? `Get started — from ${page.price}` : 'Talk to a specialist'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://wa.me/971507178156"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-900 bg-white px-6 py-3.5 font-semibold text-slate-900 hover:bg-slate-900 hover:text-white transition"
              >
                <MessageSquare size={18} /> WhatsApp us
              </a>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-500 text-sm">★★★★★</span>
                <span className="text-sm font-semibold text-slate-800">4.9</span>
                <span className="text-sm text-slate-500">Google rating</span>
              </div>
              {HERO_TRUST.map((t) => (
                <div key={t.label} className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-slate-900">{t.value}</span>
                  <span className="text-sm text-slate-500">{t.label}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {page.stats && (
            <AnimatedSection animation="fade-up" delay={120}>
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {page.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl bg-white/80 backdrop-blur border border-slate-100 px-5 py-6 shadow-[0_15px_40px_-25px_rgba(15,23,42,0.18)]"
                  >
                    <p className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-[#f16610] to-[#ff8a3c] bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 mt-1.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      {page.whoFor?.length > 0 && (
        <section className="px-6 sm:px-10 lg:px-16 py-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection animation="fade-up">
              <div className="flex flex-col items-center text-center gap-3 mb-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#f16610]/30 bg-[#fff4ec] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#f16610]">
                  <Users size={12} /> Who this is for
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Built for your situation</h2>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-up">
              <div className="max-w-3xl mx-auto space-y-3">
                {page.whoFor.map((audience, index) => (
                  <details
                    key={audience.segment}
                    open={index === 0}
                    className="group rounded-2xl border border-slate-100 bg-gradient-to-br from-[#fff8f0] to-white transition-all open:shadow-[0_20px_45px_-28px_rgba(241,102,16,0.3)]"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:px-6">
                      <h3 className="text-base font-semibold tracking-tight text-slate-900">{audience.segment}</h3>
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-[#f16610]/30 bg-white text-lg font-light text-[#f16610] transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <div className="px-5 pb-5 sm:px-6">
                      <p className="text-sm leading-relaxed text-slate-600">{audience.description}</p>
                      {audience.points?.length > 0 && (
                        <ul className="mt-4 grid gap-x-5 gap-y-2 sm:grid-cols-2">
                          {audience.points.map((point) => (
                            <li key={point} className="flex items-start gap-2 text-xs leading-relaxed text-slate-600">
                              <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-[#f16610]" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* SIGNALS + TRIGGERS */}
      <section className="px-6 sm:px-10 lg:px-16 py-16 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6 items-start">
          <AnimatedSection animation="fade-right">
            <div className="h-full rounded-[32px] border border-slate-100 bg-gradient-to-br from-[#fff4ec] to-white p-8 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-[#f16610]/15 blur-3xl" />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#f16610]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#f16610]">
                  <Activity size={12} /> Signals you feel
                </span>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight">If any of this sounds familiar…</h2>
                <div className="mt-5 space-y-3">
                  {signals.map((signal, index) => (
                    <div key={signal} className="flex gap-3 rounded-2xl bg-white border border-slate-100 p-4">
                      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-[#f16610] to-[#ff8a3c] text-white text-sm font-bold flex items-center justify-center">
                        {(index + 1).toString().padStart(2, '0')}
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed">{signal}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-left">
            <div className="h-full rounded-[32px] border border-slate-100 bg-gradient-to-br from-[#eef2ff] to-white p-8 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-[#4f46e5]/15 blur-3xl" />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#4f46e5]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#4f46e5]">
                  <Target size={12} /> Why teams call us now
                </span>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight">The forces driving urgency</h2>
                <div className="mt-5 space-y-2.5">
                  {triggers.map((trigger) => (
                    <div key={trigger} className="flex items-start gap-3 rounded-2xl bg-white border border-slate-100 p-4 text-sm text-slate-700">
                      <CheckCircle2 size={16} className="text-[#4f46e5] mt-0.5 flex-shrink-0" />
                      <span>{trigger}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CHALLENGES */}
      {page.challenges?.length > 0 && (
        <section className="px-6 sm:px-10 lg:px-16 py-16">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection animation="fade-up">
              <div className="max-w-3xl mb-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#4f46e5]/30 bg-[#eef2ff] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#4f46e5]">
                  <Layers size={12} /> {page.challengesEyebrow || 'What makes this different'}
                </span>
                <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
                  {page.challengesHeading || 'The accounting challenges this sector faces'}
                </h2>
              </div>
            </AnimatedSection>
            <div className="space-y-5">
              {page.challenges.map((challenge, index) => (
                <AnimatedSection key={challenge.heading} animation="fade-up" delay={index * 60}>
                  <div className="rounded-[28px] border border-slate-100 bg-white p-7 sm:p-8 hover:border-[#4f46e5]/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#7e8bff] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[#4f46e5]/20">
                        {(index + 1).toString().padStart(2, '0')}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold tracking-tight text-slate-900">{challenge.heading}</h3>
                        {challenge.body && (
                          <p className="mt-3 text-sm text-slate-600 leading-relaxed whitespace-pre-line">{challenge.body}</p>
                        )}
                        {challenge.points?.length > 0 && (
                          <ul className="mt-4 space-y-2.5">
                            {challenge.points.map((point) => (
                              <li key={point} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                                <CheckCircle2 size={16} className="text-[#4f46e5] mt-0.5 flex-shrink-0" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WHY FINANSHELS + BLUEPRINT */}
      {(page.valueProps?.length || blueprint?.length) && (
        <section className="px-6 sm:px-10 lg:px-16 py-16 bg-white">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
            {page.valueProps?.length > 0 && (
              <AnimatedSection animation="fade-right">
                <div className="h-full rounded-[32px] border border-slate-100 bg-white p-8 hover:-translate-y-1 hover:shadow-[0_30px_60px_-25px_rgba(15,23,42,0.18)] transition-all">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#f16610]/30 bg-[#fff4ec] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#f16610]">
                    Why Finanshels
                  </span>
                  <h2 className="mt-4 text-2xl font-semibold tracking-tight">What makes us the right fit</h2>
                  <div className="mt-5 space-y-3">
                    {page.valueProps.map((prop) => (
                      <div key={prop} className="flex items-start gap-3 rounded-2xl bg-gradient-to-br from-[#fff8f0] to-white border border-[#ffd7c0] p-4 text-sm text-slate-700">
                        <Sparkles size={16} className="text-[#f16610] mt-0.5 flex-shrink-0" />
                        <span>{prop}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}

            <AnimatedSection animation="fade-left">
              <div className="h-full rounded-[32px] border border-slate-100 bg-gradient-to-br from-[#ecfdf5] to-white p-8 hover:-translate-y-1 hover:shadow-[0_30px_60px_-25px_rgba(15,23,42,0.18)] transition-all">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                  Scope of work
                </span>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight">Everything we handle</h2>
                <div className="mt-5 space-y-3">
                  {blueprint.map((item, idx) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl bg-white border border-slate-100 p-4 text-sm text-slate-700">
                      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* WHAT YOU GET */}
      <section className="px-6 sm:px-10 lg:px-16 py-16">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="rounded-[32px] border border-slate-100 bg-gradient-to-br from-[#eef2ff] to-white p-8 sm:p-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#4f46e5]/30 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#4f46e5]">
                <CheckCircle2 size={12} /> What you get
              </span>
              <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight">What&apos;s delivered</h2>
              <div className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {deliverables.map((d) => (
                  <div key={d} className="flex items-start gap-3 rounded-2xl bg-white border border-slate-100 p-4">
                    <CheckCircle2 size={18} className="text-[#4f46e5] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700 leading-relaxed">{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CASE STUDY */}
      {page.caseStudy && (
        <section className="px-6 sm:px-10 lg:px-16 py-16">
          <AnimatedSection animation="fade-up">
            <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[44px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-10 sm:p-14 text-white">
              <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#f16610]/30 blur-[120px]" />
              <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#7e8bff]/30 blur-[140px]" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
              <div className="relative z-10 grid md:grid-cols-[auto_1fr] gap-8 items-start">
                <div>
                  <Quote size={56} className="text-[#ff8a3c] opacity-40" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/90 backdrop-blur">
                    Case study
                  </span>
                  <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-white/60 font-semibold">{page.caseStudy.logo}</p>
                  <h3 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">{page.caseStudy.headline}</h3>
                  <p className="mt-4 text-slate-300 text-lg leading-relaxed">{page.caseStudy.result}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>
      )}

      {/* TESTIMONIALS — real CMS reviews (service-filtered) when present, else the static fallback */}
      {cmsTestimonials?.length ? (
      <section className="py-16">
        <TestimonialsCarousel items={cmsTestimonials} ariaLabel="reviews" />
      </section>
      ) : (
      <section className="px-6 sm:px-10 lg:px-16 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-5">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={testimonial.name} animation="fade-up" delay={index * 100}>
              <div className="group h-full rounded-[32px] border border-slate-100 bg-white p-8 hover:shadow-[0_25px_50px_-20px_rgba(241,102,16,0.2)] hover:border-[#f16610]/30 hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {'★★★★★'.split('').map((s, j) => (
                    <span key={j}>{s}</span>
                  ))}
                </div>
                <p className="text-lg text-slate-700 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#f16610] to-[#ff8a3c] text-white font-semibold flex items-center justify-center">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
      )}

      {/* FAQ */}
      {page.faqs && page.faqs.length > 0 && (
        <section className="px-6 sm:px-10 lg:px-16 py-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection animation="fade-up">
              <div className="flex flex-col items-center text-center gap-3 mb-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-700">
                  Frequently asked questions
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Common questions answered</h2>
              </div>
            </AnimatedSection>
            <div className="max-w-3xl mx-auto space-y-3">
              {page.faqs.map((faq, index) => (
                <AnimatedSection key={faq.question} animation="fade-up" delay={index * 60}>
                  <details className="group rounded-2xl border border-slate-100 bg-white overflow-hidden hover:border-[#f16610]/30 transition-colors">
                    <summary className="flex items-center justify-between gap-4 cursor-pointer px-6 py-4 font-semibold text-slate-900 list-none select-none">
                      <span>{faq.question}</span>
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-slate-100 group-open:bg-[#fff4ec] text-slate-600 group-open:text-[#f16610] flex items-center justify-center text-sm font-bold transition-colors">
                        <span className="group-open:hidden">+</span>
                        <span className="hidden group-open:inline">−</span>
                      </span>
                    </summary>
                    <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                      {faq.answer}
                    </div>
                  </details>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WHERE WE OPERATE */}
      <section className="px-6 sm:px-10 lg:px-16 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="rounded-[32px] border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-8 sm:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="max-w-md">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-700">
                    <MapPin size={12} /> Where we operate
                  </span>
                  <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight">
                    UAE mainland &amp; every major free zone
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    Onshore and free-zone entities alike — we handle the filing rules specific to each authority.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 lg:max-w-md lg:justify-end">
                  {UAE_COVERAGE.map((zone) => (
                    <span
                      key={zone}
                      className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                    >
                      {zone}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* PRICING — fixed fee */}
      {page.price && (
        <section className="px-6 sm:px-10 lg:px-16 py-16">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection animation="fade-up">
              <div className="flex flex-col items-center text-center gap-3 mb-8">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#f16610]/30 bg-[#fff4ec] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#f16610]">
                  <Wallet size={12} /> Pricing
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Transparent, fixed pricing</h2>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={80}>
              <div className="rounded-[32px] border-2 border-[#f16610]/30 bg-gradient-to-br from-[#fff4ec] to-white p-8 sm:p-10 text-center shadow-[0_30px_60px_-30px_rgba(241,102,16,0.3)]">
                <div className="flex flex-wrap items-end justify-center gap-x-2 gap-y-1">
                  <span className="pb-2 text-sm font-semibold uppercase tracking-widest text-slate-500">From</span>
                  <span className="text-5xl sm:text-6xl font-semibold tracking-tight bg-gradient-to-r from-[#f16610] to-[#ff8a3c] bg-clip-text text-transparent">
                    {page.price}
                  </span>
                  {page.priceUnit && (
                    <span className="pb-2 text-base font-medium text-slate-500">/ {page.priceUnit}</span>
                  )}
                </div>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  Fixed fee, no hidden charges. A Finanshels specialist owns the entire process — you only pay the quoted price plus any government fees, billed at cost.
                </p>
                <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href="#book"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#f16610] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#f16610]/30 hover:-translate-y-0.5 hover:shadow-xl transition-all"
                  >
                    Get started <ArrowRight size={18} />
                  </a>
                  {page.priceInPlans && (
                    <a href="/pricing" className="inline-flex items-center gap-2 font-semibold text-[#f16610]">
                      Also included in monthly plans <ArrowRight size={16} />
                    </a>
                  )}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* PRICING TIERS */}
      {hasPricingTiers && (
        <section className="px-6 sm:px-10 lg:px-16 py-16">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection animation="fade-up">
              <div className="flex flex-col items-center text-center gap-3 mb-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#f16610]/30 bg-[#fff4ec] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#f16610]">
                  <Wallet size={12} /> Pricing
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Specialist knowledge, fixed monthly pricing</h2>
              </div>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
              {page.pricingTiers.map((tier) => (
                <AnimatedSection key={tier.name} animation="fade-up">
                  <div
                    className={`relative h-full rounded-[28px] border p-7 flex flex-col ${
                      tier.highlighted
                        ? 'border-[#f16610] bg-gradient-to-br from-[#fff4ec] to-white shadow-[0_30px_60px_-30px_rgba(241,102,16,0.35)]'
                        : 'border-slate-100 bg-white'
                    }`}
                  >
                    {tier.highlighted && (
                      <span className="absolute -top-3 left-7 inline-flex items-center rounded-full bg-[#f16610] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow">
                        Most popular
                      </span>
                    )}
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900">{tier.name}</h3>
                    <p className="mt-2 text-2xl font-semibold tracking-tight bg-gradient-to-r from-[#f16610] to-[#ff8a3c] bg-clip-text text-transparent">
                      {tier.price}
                    </p>
                    {tier.bestFor && <p className="mt-2 text-xs text-slate-500 leading-relaxed">{tier.bestFor}</p>}
                    <div className="mt-5 space-y-2.5 flex-1">
                      {tier.includes.map((item) => (
                        <div key={item} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                          <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {page.pricingAddOns?.length > 0 && (
              <AnimatedSection animation="fade-up">
                <div className="mt-6 rounded-[28px] border border-slate-100 bg-white p-7">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold">One-time services</p>
                  <div className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
                    {page.pricingAddOns.map((addOn) => (
                      <div key={addOn.name} className="flex items-center justify-between gap-4 border-b border-dashed border-slate-100 pb-2 text-sm">
                        <span className="text-slate-700">{addOn.name}</span>
                        <span className="font-semibold text-slate-900 whitespace-nowrap">{addOn.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}

            {page.pricingNote && (
              <p className="mt-6 text-center text-sm text-slate-500">{page.pricingNote}</p>
            )}
          </div>
        </section>
      )}

      {/* PRICING + LEAD FORM */}
      <section id="book" className="px-6 sm:px-10 lg:px-16 py-16 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
          <AnimatedSection animation="fade-right">
            <div className="h-full rounded-[32px] bg-gradient-to-br from-[#fff4ec] to-white border border-[#ffd7c0] p-8 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-[#f16610]/15 blur-3xl" />
              <div className="relative z-10 flex flex-col h-full">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#f16610]/30 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#f16610]">
                  <Wallet size={12} /> Pricing snapshot
                </span>
                <h3 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
                  From{' '}
                  <span className="bg-gradient-to-r from-[#f16610] to-[#ff8a3c] bg-clip-text text-transparent">{startingPrice}</span>
                </h3>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  Transparent, fixed pricing with no hidden charges — a dedicated Finanshels specialist owns the work from start to finish.
                </p>
                <div className="mt-6 space-y-2 text-sm text-slate-700">
                  {['Fixed fee — no hidden charges', 'FTA-registered specialists', 'WhatsApp + email support'].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="/pricing"
                  className="mt-auto pt-7 inline-flex items-center gap-2 font-semibold text-[#f16610]"
                >
                  View full pricing
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-left">
            <div className="h-full rounded-[32px] border border-slate-100 bg-white p-8 relative overflow-hidden shadow-[0_30px_70px_-30px_rgba(15,23,42,0.2)]">
              <div className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-[#7e8bff]/15 blur-3xl" />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-700">
                  <Send size={11} /> Working session
                </span>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight">Book a 30-min strategy call</h3>

                {submitted ? (
                  <div className="mt-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 p-6 text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-3">
                      <CheckCircle2 size={24} />
                    </div>
                    <p className="font-semibold">Got it — our team will reach out to you directly.</p>
                  </div>
                ) : (
                  <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      required
                      value={lead.name}
                      onChange={handleChange}
                      className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-300 focus:outline-none focus:border-[#f16610] focus:ring-4 focus:ring-[#f16610]/10 transition-all"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Work email"
                      required
                      value={lead.email}
                      onChange={handleChange}
                      className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-300 focus:outline-none focus:border-[#f16610] focus:ring-4 focus:ring-[#f16610]/10 transition-all"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone / WhatsApp"
                      value={lead.phone}
                      onChange={handleChange}
                      className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-300 focus:outline-none focus:border-[#f16610] focus:ring-4 focus:ring-[#f16610]/10 transition-all"
                    />
                    <textarea
                      name="message"
                      rows={3}
                      placeholder="Tell us about your finance challenges"
                      value={lead.message}
                      onChange={handleChange}
                      className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-300 focus:outline-none focus:border-[#f16610] focus:ring-4 focus:ring-[#f16610]/10 transition-all resize-none"
                    />
                    {error && (
                      <p
                        role="alert"
                        className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-700"
                      >
                        {error}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#f16610] px-5 py-3.5 font-semibold text-white shadow-lg shadow-[#f16610]/30 hover:-translate-y-0.5 hover:shadow-xl transition-all disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Book a strategy call <Send size={16} />
                        </>
                      )}
                    </button>
                  </form>
                )}
                <p className="mt-4 text-xs text-slate-500 text-center">
                  Prefer a direct line?{' '}
                  <a href="mailto:contact@finanshels.com" className="text-[#f16610] font-semibold">contact@finanshels.com</a>{' '}
                  ·{' '}
                  <a href="https://wa.me/971507178156" className="text-[#f16610] font-semibold">WhatsApp</a>
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 sm:px-10 lg:px-16 pb-24 pt-10">
        <AnimatedSection animation="fade-up">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[44px] bg-gradient-to-br from-[#b8420a] via-[#e0560c] to-[#f16610] p-10 sm:p-16 text-white">
            <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#ff8a3c]/20 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-xl">
                <p className="text-xs uppercase tracking-[0.4em] text-white/90 font-semibold">Ready when you are</p>
                <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
                  Bring Finanshels in for {serviceLabel}.
                </h2>
                <p className="mt-4 text-white/90 text-lg">
                  Share where your business stands today — our specialists map out exactly what you need, with clear scope and pricing.
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <a
                  href="mailto:contact@finanshels.com"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-semibold text-[#f16610] shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                >
                  Talk to sales <ArrowRight size={18} />
                </a>
                <a
                  href="https://wa.me/971507178156"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/75 bg-white/10 backdrop-blur px-6 py-3.5 font-semibold text-white hover:bg-white/20 transition"
                >
                  <MessageSquare size={18} /> WhatsApp consultants
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* STICKY CTA */}
      {page.price && (
        <div
          className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${
            showSticky ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="mx-auto m-3 flex max-w-3xl items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/95 px-4 py-3 shadow-2xl backdrop-blur">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{serviceLabel}</p>
              <p className="text-xs text-white/70">
                From {page.price}
                {page.priceUnit ? ` · ${page.priceUnit}` : ''}
              </p>
            </div>
            <a
              href="#book"
              className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-[#f16610] px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Get started <ArrowRight size={16} />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
