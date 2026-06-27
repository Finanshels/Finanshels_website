import { useMemo, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Quote,
  Sparkles,
  Zap,
  Send,
  MessageSquare,
  Wallet,
  Activity,
  Target,
  Compass,
  TrendingUp,
  Users,
  Layers,
} from 'lucide-react'
import AnimatedSection from '../../components/marketing/AnimatedSection'
import { TESTIMONIALS } from '@/content/team'

const createStoryBeats = (title) => [
  {
    phase: 'Sprint 0',
    headline: 'Shadow & diagnose',
    description: `We sit with your leaders and operators to see how ${title.toLowerCase()} runs today, logging every manual hand-off and risk.`,
  },
  {
    phase: 'Sprint 1',
    headline: 'Rebuild the engine',
    description: 'Finanshels squads plug into your stack, clean data, and stand up recurring rituals without derailing BAU.',
  },
  {
    phase: 'Sprint 2+',
    headline: 'Scale & narrate',
    description: 'Weekly memos, dashboards, and compliance proof keep founders, boards, and regulators aligned.',
  },
]

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

const STORY_ICONS = [Compass, Zap, TrendingUp]

export default function ServiceDetailPage({ page }) {
  const [lead, setLead] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const testimonials = useMemo(() => TESTIMONIALS.slice(0, 2), [])

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffdfb] text-slate-600">
        <p>Service coming soon.</p>
      </div>
    )
  }

  const storyBeats = page.storyBeats || createStoryBeats(page.title || 'this workstream')
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
  const startingPrice = hasPricingTiers ? page.pricingTiers[0].price : '$219/mo'

  const handleChange = (event) => {
    const { name, value } = event.target
    setLead((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 600)
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
            <span className="inline-flex items-center gap-2 rounded-full border border-[#f16610]/30 bg-white/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#f16610] backdrop-blur">
              <Sparkles size={13} /> {page.title}
            </span>
            <h1 className="mt-6 text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.05] tracking-tight max-w-4xl">
              {page.subtitle}
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-3xl">
              {page.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:contact@finanshels.com"
                className="group inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#f16610]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Talk to a specialist
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://wa.me/971507178156"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-900 bg-white px-6 py-3.5 font-semibold text-slate-900 hover:bg-slate-900 hover:text-white transition"
              >
                <MessageSquare size={18} /> WhatsApp us
              </a>
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {page.whoFor.map((audience) => (
                <AnimatedSection key={audience.segment} animation="fade-up">
                  <div className="h-full rounded-[28px] border border-slate-100 bg-gradient-to-br from-[#fff8f0] to-white p-6 hover:-translate-y-1 hover:shadow-[0_25px_50px_-25px_rgba(241,102,16,0.25)] transition-all">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900">{audience.segment}</h3>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">{audience.description}</p>
                    {audience.points?.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {audience.points.map((point) => (
                          <li key={point} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                            <CheckCircle2 size={14} className="text-[#f16610] mt-0.5 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
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

      {/* STORY ARC — DARK */}
      <section className="px-6 sm:px-10 lg:px-16 py-20">
        <AnimatedSection animation="fade-up">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[44px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-10 sm:p-14 text-white">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#f16610]/30 blur-[120px]" />
            <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#7e8bff]/30 blur-[140px]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
            <div className="relative z-10 space-y-10">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/90 backdrop-blur">
                  <Zap size={12} /> Story arc
                </span>
                <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
                  How the engagement{' '}
                  <span className="bg-gradient-to-r from-white to-[#ff8a3c] bg-clip-text text-transparent">unfolds</span>.
                </h2>
                <p className="mt-4 text-slate-300 text-lg">
                  Operators, controllers, and CFOs act as one team. Every sprint produces clear decisions for founders, boards, and regulators.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-5 relative">
                <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-[#f16610]/30 via-[#ff8a3c] to-[#f16610]/30">
                  <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-marquee" />
                </div>
                {storyBeats.map((beat, index) => {
                  const Icon = STORY_ICONS[index] || Sparkles
                  return (
                    <AnimatedSection key={beat.phase} animation="fade-up" delay={index * 100}>
                      <div className="relative rounded-[28px] bg-white/5 border border-white/15 backdrop-blur p-6 hover:bg-white/10 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <div className="relative inline-flex">
                            <div className="absolute inset-0 rounded-full bg-[#f16610]/40 blur-md" />
                            <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-[#f16610] to-[#ff8a3c] flex items-center justify-center text-white shadow-lg shadow-[#f16610]/30">
                              <Icon size={20} />
                            </div>
                          </div>
                          <span className="text-[10px] uppercase tracking-[0.3em] text-[#ff8a3c] font-bold">{beat.phase}</span>
                        </div>
                        <h3 className="text-xl font-semibold tracking-tight">{beat.headline}</h3>
                        <p className="mt-2 text-sm text-white/75 leading-relaxed">{beat.description}</p>
                      </div>
                    </AnimatedSection>
                  )
                })}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

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
                  Solution blueprint
                </span>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight">How we deliver, step by step</h2>
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

      {/* RITUALS + DELIVERABLES */}
      <section className="px-6 sm:px-10 lg:px-16 py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
          <AnimatedSection animation="fade-right">
            <div className="h-full rounded-[32px] border border-slate-100 bg-white p-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-700">
                <Zap size={11} /> Execution rituals
              </span>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">What happens every sprint</h2>
              <div className="mt-5 space-y-3">
                {rituals.map((step, index) => (
                  <div key={step} className="flex items-start gap-4 rounded-2xl border border-slate-100 p-4 hover:border-[#f16610]/30 transition">
                    <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-[#f16610] to-[#ff8a3c] text-white flex items-center justify-center font-bold shadow-md shadow-[#f16610]/20">
                      {(index + 1).toString().padStart(2, '0')}
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed pt-1.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-left">
            <div className="h-full rounded-[32px] border border-slate-100 bg-gradient-to-br from-[#eef2ff] to-white p-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#4f46e5]/30 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#4f46e5]">
                Leadership receives
              </span>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">Tangible deliverables</h2>
              <div className="mt-5 space-y-3">
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

      {/* TESTIMONIALS */}
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
      <section className="px-6 sm:px-10 lg:px-16 py-16 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
          <AnimatedSection animation="fade-right">
            <div className="h-full rounded-[32px] bg-gradient-to-br from-[#fff4ec] to-white border border-[#ffd7c0] p-8 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-[#f16610]/15 blur-3xl" />
              <div className="relative z-10 flex flex-col h-full">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#f16610]/30 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#f16610]">
                  <Wallet size={12} /> Subscription snapshot
                </span>
                <h3 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
                  Starting from{' '}
                  <span className="bg-gradient-to-r from-[#f16610] to-[#ff8a3c] bg-clip-text text-transparent">{startingPrice}</span>
                </h3>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  Every subscription plugs bookkeeping, tax, compliance, reporting rituals, and direct access to Finanshels specialists into one partnership.
                </p>
                <div className="mt-6 space-y-2 text-sm text-slate-700">
                  {['No setup fees on annual', 'Switch plans any time', 'WhatsApp + email · < 24h SLA'].map((item) => (
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
                    <p className="font-semibold">Got it — reply coming within 24 hours.</p>
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
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[44px] bg-gradient-to-br from-[#f16610] via-[#ff7a23] to-[#ff8a3c] p-10 sm:p-16 text-white">
            <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-xl">
                <p className="text-xs uppercase tracking-[0.4em] text-white/80 font-semibold">Bring us in</p>
                <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
                  Bring Finanshels in for {page.title.toLowerCase()}.
                </h2>
                <p className="mt-4 text-white/85 text-lg">
                  Share your stack, headcount, and deadlines — our service leads send a tailored roadmap within 48 hours.
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
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/60 bg-white/10 backdrop-blur px-6 py-3.5 font-semibold text-white hover:bg-white/20 transition"
                >
                  <MessageSquare size={18} /> WhatsApp consultants
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
