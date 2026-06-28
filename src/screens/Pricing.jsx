'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Zap,
  TrendingUp,
  Wallet,
  MessageSquare,
  Users,
  Building2,
  BarChart3,
  Calendar,
} from 'lucide-react'
import AnimatedSection from '../components/marketing/AnimatedSection'
import { TESTIMONIALS } from '@/content/team'
import TestimonialsCarousel from '@/components/marketing/TestimonialsCarousel'

const BOOKING_URL = 'https://contact-finanshels.zohobookings.com/#/inquiry-call'
const WHATSAPP = 'https://wa.me/971521549572'

const PLANS = [
  {
    key: 'essential',
    name: 'Essential',
    tag: 'Lean',
    bestFor: 'Best for solo founders & lean LLCs',
    priceMonthly: 4999,
    description: 'Cash-basis bookkeeping, VAT, and corporate tax handled every year for lean UAE businesses.',
    waText: 'I%20need%20the%20Essential%20Plan',
    limit: 'Up to 100 transactions / year',
    highlights: [
      'Cash-basis annual accounting',
      'Annual reports & reconciliations',
      '1 hour tax advisory / year',
      'WhatsApp + email support',
    ],
    glow: 'rgba(241,102,16,0.18)',
    border: 'border-slate-100',
    badge: null,
  },
  {
    key: 'growth',
    name: 'Growth',
    tag: 'Most picked',
    bestFor: 'Best for scaling teams, VAT-registered',
    priceMonthly: 9999,
    description: 'Quarterly accounting, VAT, and tax advisory for teams scaling across the UAE.',
    waText: 'I%20need%20the%20Growth%20Plan',
    limit: 'Up to 500 transactions / year',
    highlights: [
      'Quarterly cash-basis accounting',
      'VAT & CT handled quarterly',
      '2 hours tax advisory / quarter',
      'Dedicated finance pod',
      'Quarterly board pack',
    ],
    glow: 'rgba(241,102,16,0.35)',
    border: 'border-[#f16610]',
    badge: 'Most popular',
  },
  {
    key: 'scale',
    name: 'Scale',
    tag: '2 mo free annual',
    bestFor: 'Best for multi-entity & investor-backed operators',
    priceMonthly: 14999,
    description: 'Monthly accrual accounting, CFO attention, and expanded compliance for complex operators.',
    waText: 'I%20need%20the%20Scale%20Plan',
    limit: 'Up to 1,500 transactions / year',
    highlights: [
      'Monthly accrual accounting',
      'Full VAT + CT + AML coverage',
      'Dedicated CFO touchpoints',
      'Live dashboards & investor packs',
      'Audit prep & policy design',
    ],
    glow: 'rgba(127,156,255,0.35)',
    border: 'border-slate-800',
    badge: null,
    dark: true,
  },
]

// Annual = 2 months free → pay 10 of 12 months.
const ANNUAL_FREE_MONTHS = 2
function monthlyForBilling(priceMonthly, billing) {
  if (billing !== 'annual') return priceMonthly
  return Math.round((priceMonthly * (12 - ANNUAL_FREE_MONTHS)) / 12)
}
function fmt(n) {
  return n.toLocaleString('en-US')
}

// De-duplicated from the dark stats band (which owns 4.9 / <24h / 99.4% / 142k)
// and the hero badge — this bar's only job is risk reversal at the decision point.
const GUARANTEES = [
  { icon: Wallet, label: 'No setup fee on annual' },
  { icon: ShieldCheck, label: 'Cancel anytime — no lock-in' },
  { icon: Zap, label: 'Live in 7 days' },
  { icon: CheckCircle2, label: 'Keep your existing tools' },
]

const PROCESS = [
  {
    when: 'Week 1',
    title: 'We take the mess off your plate',
    description: 'We migrate your books, reconcile history, and connect your banks and tools — zero disruption to deadlines.',
    outcome: 'Fully live in 7 days',
    icon: Sparkles,
  },
  {
    when: 'Weeks 2–3',
    title: 'You finally see your numbers clearly',
    description: 'Live dashboards, a compliance calendar, and a dedicated pod that knows your business — not a ticket queue.',
    outcome: 'Dedicated pod · replies in <24h',
    icon: BarChart3,
  },
  {
    when: 'Every month',
    title: 'Your finance function runs itself',
    description: 'Board-ready reports on time, proactive VAT, CT & AML, and a fractional CFO on call. You get your nights back.',
    outcome: 'Investor-ready, on time',
    icon: TrendingUp,
  },
]

const FAQS = [
  { q: 'What happens during onboarding?', a: 'Day 0–7 digitisation (books, banking, reconciliations), day 8–21 insights (dashboards, compliance trackers), day 22+ finance cadence with investor-ready rituals.' },
  { q: 'Can you support multi-entity or multi-country companies?', a: 'Yes. We handle consolidations, inter-company billing, and cross-border tax and AML requirements for the entire group.' },
  { q: 'Do I need to use certain tools?', a: 'No. We plug into your existing ERPs and banks. If migrations are needed, we scope them as projects and implement them for you.' },
  { q: 'How do we communicate?', a: 'WhatsApp / Slack for quick updates, weekly or bi-weekly finance reviews, monthly board-ready packs, plus quarterly strategic planning.' },
  { q: 'Is there a setup fee?', a: 'Setup is included for annual plans. For quarterly/monthly we charge a one-time onboarding fee based on historical clean-up volume.' },
  { q: 'Can I switch plans later?', a: 'Yes — upgrade or downgrade any time. Most clients start on Growth and move to Scale around their Series A.' },
  {
    q: 'How is finanshels different from Osome or a Big Four firm?',
    a: "finanshels is a managed, embedded finance team — not accounting software you operate yourself, and not a Big Four engagement you wait months to see results from. We handle all UAE compliance (VAT, corporate tax, AML, audit prep) under one roof, at transparent fixed prices with a <24h reply SLA. You get a dedicated finance pod that knows your business, not a ticket queue or a rotating audit team.",
  },
  {
    q: "I'm switching from accounting software or another firm — how hard is it?",
    a: "Not hard at all. Our onboarding (day 0–7) covers historical clean-up, data migration, and reconciling any gaps from your previous setup. We handle the transition as part of getting started — no downtime, no data loss, no disruption to your filing deadlines.",
  },
]

const PLAN_MATRIX = [
  { feature: 'Bookkeeping', essential: 'Up to 100 txn/yr', growth: 'Up to 500 txn/yr', scale: 'Up to 1,500 txn/yr' },
  { feature: 'Accounting type', essential: 'Cash-basis (annual)', growth: 'Cash-basis (quarterly)', scale: 'Accrual-basis (monthly)' },
  { feature: 'Management reports', essential: 'Annual', growth: 'Quarterly', scale: 'Monthly' },
  { feature: 'Bank reconciliation', essential: 'Annual', growth: 'Quarterly', scale: 'Monthly' },
  { feature: 'Card reconciliation', essential: 'Annual', growth: 'Quarterly', scale: 'Monthly' },
  { feature: 'Free tax advisory', essential: '1 hr / year', growth: '2 hrs / quarter', scale: '1 hr / month' },
  { feature: 'Corporate tax registration', essential: true, growth: true, scale: true },
  { feature: 'Corporate tax filing', essential: true, growth: true, scale: true },
  { feature: 'Unlimited email & chat support', essential: true, growth: true, scale: true },
  { feature: 'VAT registration', essential: false, growth: true, scale: true },
  { feature: 'Quarterly VAT filing', essential: false, growth: true, scale: true },
  { feature: 'Receivables summary', essential: false, growth: false, scale: true },
  { feature: 'Payables summary', essential: false, growth: false, scale: true },
  { feature: 'Schedule preparation', essential: false, growth: false, scale: true },
  { feature: 'Dedicated CFO touchpoints', essential: false, growth: false, scale: true },
]

const PLAN_KEYS = ['essential', 'growth', 'scale']

const REVENUE_OPTIONS = [
  { label: 'Under AED 375K', value: 'low' },
  { label: 'AED 375K – 3M', value: 'mid' },
  { label: 'AED 3M+', value: 'high' },
]

const FREQUENCY_OPTIONS = [
  { label: 'Once a year is fine', value: 'annual' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Every month', value: 'monthly' },
]

const STATS = [
  { value: '142k', label: 'avg AED annual saving' },
  { value: '<24h', label: 'reply SLA' },
  { value: '99.4%', label: 'on-time filings' },
  { value: '4.9★', label: 'Google rating' },
]

const THREE_WAYS = [
  {
    criteria: 'Monthly cost',
    inhouse: 'AED 12,000–25,000+ salary, visa & benefits — typical UAE market range',
    firm: 'AED 3,000–10,000+, often billed by the hour',
    finanshels: 'From AED 4,999, fixed monthly',
  },
  {
    criteria: 'Time to productive',
    inhouse: '3–6 months (hiring, onboarding, visa)',
    firm: '2–4 weeks scoping, slow ramp-up',
    finanshels: 'Fully operational within 7 days',
  },
  {
    criteria: 'Coverage',
    inhouse: 'One generalist — gaps in VAT, CT, or CFO work',
    firm: 'Audit or tax only; rarely both',
    finanshels: 'VAT, CT, AML, accounting & CFO under one roof',
  },
  {
    criteria: 'Compliance risk',
    inhouse: 'Single point of failure; high if staff leaves',
    firm: 'Reactive — you chase them for updates',
    finanshels: '99.4% on-time filings, proactive alerts',
  },
  {
    criteria: 'Scales with you',
    inhouse: 'Requires another hire per growth stage',
    firm: 'Re-scope & renegotiate each year',
    finanshels: 'Upgrade plan in minutes, no new contract',
  },
]

function computeRecommendedPlan(revenue, frequency) {
  const revenueScore = { low: 0, mid: 1, high: 2 }[revenue] ?? 0
  const frequencyScore = { annual: 0, quarterly: 1, monthly: 2 }[frequency] ?? 0
  const total = revenueScore + frequencyScore
  if (total <= 1) return 'essential'
  if (total <= 3) return 'growth'
  return 'scale'
}

export default function Pricing({ cmsTestimonials } = {}) {
  const [billing, setBilling] = useState('monthly')
  const [revenueAnswer, setRevenueAnswer] = useState(null)
  const [frequencyAnswer, setFrequencyAnswer] = useState(null)

  const recommendedPlan = useMemo(() => {
    if (!revenueAnswer || !frequencyAnswer) return null
    return computeRecommendedPlan(revenueAnswer, frequencyAnswer)
  }, [revenueAnswer, frequencyAnswer])

  const testimonials = TESTIMONIALS.slice(0, 2)

  const scrollToPlan = (planKey) => {
    const el = document.getElementById(`plan-${planKey}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const planDisplayName = (key) => PLANS.find((p) => p.key === key)?.name ?? key

  return (
    <div className="bg-[#fffdfb] text-slate-900 overflow-hidden">
      {/* HERO */}
      <section className="relative pt-32 pb-16 px-6 sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-[#fef3eb] via-[#fffaf3] to-transparent" />
          <div className="absolute -top-20 -left-32 w-[420px] h-[420px] rounded-full bg-[#f16610]/15 blur-[120px]" />
          <div className="absolute top-40 -right-20 w-[460px] h-[460px] rounded-full bg-[#7e8bff]/20 blur-[140px] animate-pulse-slow" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <AnimatedSection animation="fade-down">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#f16610]/30 bg-white/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#f16610] backdrop-blur">
                <Wallet size={13} /> Transparent pricing
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/80 px-3 py-1.5 text-[11px] font-semibold text-amber-700 backdrop-blur">
                <span className="text-amber-400 tracking-tighter text-sm leading-none">★★★★★</span>
                <span>4.9/5 · Rated by UAE founders</span>
              </span>
            </div>
            <h1 className="mt-6 text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.05] tracking-tight">
              Finance partnerships{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#f16610]">priced for clarity</span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-[#ffd19b] -z-0 -skew-x-6" />
              </span>
              <br />
              not surprises.
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
              Three plans, one bench of 180+ finance specialists. Pay monthly. Switch anytime. No hidden setup fees on annual.
            </p>
            <div className="mt-8 inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
                  billing === 'monthly' ? 'bg-slate-900 text-white' : 'text-slate-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('annual')}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
                  billing === 'annual' ? 'bg-slate-900 text-white' : 'text-slate-600'
                }`}
              >
                Annual
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  2 months free
                </span>
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* PLAN FINDER — compact */}
      <section className="px-6 sm:px-10 lg:px-16 pb-12">
        <AnimatedSection animation="fade-up">
          <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-900 to-[#2a1c12] p-6 sm:p-7 text-white shadow-[0_30px_60px_-35px_rgba(15,23,42,0.6)]">
            <div className="absolute -top-16 -right-8 h-48 w-48 rounded-full bg-[#f16610]/35 blur-[90px]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
              <div className="flex items-center gap-3 shrink-0">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f16610] text-white shadow-lg shadow-[#f16610]/40">
                  <Sparkles size={17} />
                </span>
                <p className="text-lg font-semibold leading-tight tracking-tight">
                  Find your<br className="hidden sm:block" /> plan in 10s
                </p>
              </div>

              <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:gap-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/45 font-semibold mb-2">Annual revenue</p>
                  <div className="flex flex-wrap gap-1.5">
                    {REVENUE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setRevenueAnswer(opt.value)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                          revenueAnswer === opt.value
                            ? 'border-[#f16610] bg-[#f16610] text-white'
                            : 'border-white/20 text-white/80 hover:border-white/40'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/45 font-semibold mb-2">Reporting cadence</p>
                  <div className="flex flex-wrap gap-1.5">
                    {FREQUENCY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setFrequencyAnswer(opt.value)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                          frequencyAnswer === opt.value
                            ? 'border-[#f16610] bg-[#f16610] text-white'
                            : 'border-white/20 text-white/80 hover:border-white/40'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="shrink-0 lg:border-l lg:border-white/10 lg:pl-7">
                {recommendedPlan ? (
                  <button
                    onClick={() => scrollToPlan(recommendedPlan)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-all hover:-translate-y-0.5 hover:bg-[#ff8a3c] hover:text-white"
                  >
                    See {planDisplayName(recommendedPlan)} <ArrowRight size={15} />
                  </button>
                ) : (
                  <p className="max-w-[130px] text-xs leading-snug text-white/40">Pick both to see your match</p>
                )}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* PLAN CARDS */}
      <section className="px-6 sm:px-10 lg:px-16 pb-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => {
            const isRecommended = recommendedPlan === plan.key
            const shownMonthly = monthlyForBilling(plan.priceMonthly, billing)
            const yearlySave = plan.priceMonthly * ANNUAL_FREE_MONTHS
            return (
              <AnimatedSection
                key={plan.key}
                animation="fade-up"
                delay={i * 100}
                className={plan.key === 'growth' ? 'order-first lg:order-none' : ''}
              >
                <div
                  id={`plan-${plan.key}`}
                  className={`relative h-full rounded-[32px] border-2 ${
                    isRecommended ? 'border-emerald-500 ring-4 ring-emerald-500/25' : plan.border
                  } p-8 overflow-hidden transition-all hover:-translate-y-1.5`}
                  style={
                    plan.dark
                      ? { background: 'linear-gradient(135deg, #0f172a 0%, #1a253a 50%, #0f172a 100%)' }
                      : plan.key === 'growth'
                      ? { background: 'linear-gradient(135deg, #fff1e5 0%, #fff8f0 50%, #ffffff 100%)' }
                      : { background: 'linear-gradient(135deg, #fff4ec 0%, #ffffff 100%)' }
                  }
                >
                  {isRecommended && (
                    <div className="absolute top-5 left-5 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white shadow">
                      <CheckCircle2 size={10} /> Recommended for you
                    </div>
                  )}
                  <div className="absolute -top-20 -right-20 h-52 w-52 rounded-full blur-3xl opacity-60" style={{ background: plan.glow }} />
                  {plan.badge && (
                    <div className={`absolute right-5 inline-flex items-center gap-1.5 rounded-full bg-[#f16610] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-[#f16610]/40 ${isRecommended ? 'top-14' : 'top-5'}`}>
                      <Sparkles size={11} /> {plan.badge}
                    </div>
                  )}

                  <div className={`relative z-10 ${plan.dark ? 'text-white' : ''} ${isRecommended ? 'pt-6' : ''}`}>
                    <p className={`text-[11px] uppercase tracking-[0.3em] font-semibold ${plan.dark ? 'text-[#ff8a3c]' : 'text-[#f16610]'}`}>{plan.tag}</p>
                    <h3 className={`mt-2 text-3xl font-semibold tracking-tight ${plan.dark ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                    <p className={`mt-1 text-xs font-medium ${plan.dark ? 'text-[#ff8a3c]/80' : 'text-[#f16610]'}`}>{plan.bestFor}</p>
                    <p className={`mt-1 text-sm ${plan.dark ? 'text-white/70' : 'text-slate-600'}`}>{plan.limit}</p>

                    <div className="mt-7 flex items-baseline gap-2">
                      <span className={`text-5xl font-semibold tracking-tight ${plan.dark ? 'text-white' : 'text-slate-900'}`}>{fmt(shownMonthly)}</span>
                      <span className={`text-sm font-medium ${plan.dark ? 'text-white/60' : 'text-slate-500'}`}>AED / mo</span>
                    </div>
                    {billing === 'annual' ? (
                      <p className={`mt-1.5 text-xs font-medium ${plan.dark ? 'text-[#ff8a3c]' : 'text-emerald-600'}`}>
                        <span className={`line-through mr-1.5 ${plan.dark ? 'text-white/40' : 'text-slate-400'}`}>{fmt(plan.priceMonthly)}</span>
                        billed annually · save AED {fmt(yearlySave)}/yr
                      </p>
                    ) : (
                      <p className={`mt-1.5 text-xs ${plan.dark ? 'text-white/50' : 'text-slate-400'}`}>billed monthly · or save 2 months on annual</p>
                    )}
                    <p className={`mt-3 text-sm ${plan.dark ? 'text-white/70' : 'text-slate-600'}`}>{plan.description}</p>

                    <a
                      href={BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold transition-all ${
                        plan.dark
                          ? 'bg-white text-slate-900 hover:bg-[#ff8a3c] hover:text-white'
                          : plan.key === 'growth'
                          ? 'bg-[#f16610] text-white shadow-lg shadow-[#f16610]/30 hover:shadow-xl hover:-translate-y-0.5'
                          : 'border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <Calendar size={16} /> Book a 30-min call
                    </a>
                    <a
                      href={`${WHATSAPP}?text=${plan.waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-2.5 text-sm font-semibold transition-all ${
                        plan.dark
                          ? 'border-white/25 text-white hover:border-white/50 hover:bg-white/10'
                          : 'border-slate-200 text-slate-700 hover:border-[#f16610]/50 hover:bg-[#fff8f0] hover:text-[#f16610]'
                      }`}
                    >
                      <MessageSquare size={15} /> Or WhatsApp an expert
                    </a>

                    <p className={`mt-2 text-center text-[11px] ${plan.dark ? 'text-white/40' : 'text-slate-400'}`}>
                      No setup fee on annual · Cancel anytime · Reply in &lt;24h
                    </p>

                    <div className={`mt-6 pt-6 border-t ${plan.dark ? 'border-white/15' : 'border-slate-200/60'} space-y-3`}>
                      {plan.highlights.map((h) => (
                        <div key={h} className="flex items-start gap-3 text-sm">
                          <CheckCircle2 size={18} className={`mt-0.5 flex-shrink-0 ${plan.dark ? 'text-[#ff8a3c]' : 'text-[#f16610]'}`} />
                          <span className={plan.dark ? 'text-white/90' : 'text-slate-700'}>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </section>

      {/* GUARANTEES — risk reversal only (numbers live in the dark stats band) */}
      <section className="px-6 sm:px-10 lg:px-16 pb-24">
        <AnimatedSection animation="fade-up">
          <div className="max-w-6xl mx-auto overflow-hidden rounded-[28px] border border-[#ffe2cc] bg-gradient-to-br from-[#fff7f0] via-white to-[#fff9f3] p-6 sm:p-8 shadow-[0_24px_60px_-40px_rgba(241,102,16,0.4)]">
            <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-10">
              <div className="flex items-center gap-3 shrink-0">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1e1] text-[#f16610]">
                  <ShieldCheck size={20} />
                </span>
                <div>
                  <p className="text-base font-semibold tracking-tight text-slate-900">Zero-risk to start</p>
                  <p className="text-xs text-slate-500">Every plan, no strings attached</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {GUARANTEES.map((g) => (
                  <span
                    key={g.label}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-[0_8px_20px_-16px_rgba(15,23,42,0.4)]"
                  >
                    <g.icon size={15} className="flex-shrink-0 text-emerald-500" /> {g.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* COMPARISON TABLE */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-white">
        <div className="max-w-6xl mx-auto space-y-10">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                Plan comparison
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">What you get on every plan</h2>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up">
            <div className="overflow-x-auto lg:overflow-x-visible rounded-[28px] border border-slate-100 bg-white shadow-[0_15px_40px_-20px_rgba(15,23,42,0.1)]">
              <table className="w-full text-sm text-slate-700 min-w-[640px]">
                <thead className="sticky top-16 z-20">
                  <tr className="text-left">
                    <th className="rounded-tl-[20px] border-b-2 border-slate-200 bg-slate-100 py-5 px-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">Feature</th>
                    {PLAN_KEYS.map((key, idx) => {
                      const plan = PLANS.find((p) => p.key === key)
                      const isGrowth = key === 'growth'
                      return (
                        <th
                          key={key}
                          className={`border-b-2 py-5 px-5 text-center ${isGrowth ? 'border-[#f16610] bg-[#fff1e1]' : 'border-slate-200 bg-slate-100'} ${idx === PLAN_KEYS.length - 1 ? 'rounded-tr-[20px]' : ''}`}
                        >
                          <span className={`block text-base font-bold tracking-tight ${isGrowth ? 'text-[#f16610]' : 'text-slate-900'}`}>{plan.name}</span>
                          <span className={`block text-[12px] mt-0.5 font-semibold ${isGrowth ? 'text-[#f16610]/80' : 'text-slate-500'}`}>
                            AED {fmt(monthlyForBilling(plan.priceMonthly, billing))}/mo
                          </span>
                          {isGrowth && <span className="block text-[9px] mt-1 font-bold uppercase tracking-widest text-[#f16610]">★ Most popular</span>}
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {PLAN_MATRIX.map((row, i) => (
                    <tr key={row.feature} className={`border-b border-slate-100 ${i % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                      <td className="py-4 px-5 font-medium text-slate-900">{row.feature}</td>
                      {PLAN_KEYS.map((key) => (
                        <td key={key} className={`py-4 px-5 text-center ${key === 'growth' ? 'bg-[#fff8f0]/50' : ''}`}>
                          {typeof row[key] === 'boolean' ? (
                            row[key] ? (
                              <CheckCircle2 className="inline text-emerald-500" size={18} />
                            ) : (
                              <span className="text-slate-300">—</span>
                            )
                          ) : (
                            <span className="text-slate-600 text-xs">{row[key]}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
              <p className="text-slate-600">Still comparing? We&apos;ll recommend the right plan on a quick call.</p>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-5 py-3 font-semibold text-white shadow-lg shadow-[#f16610]/30 hover:-translate-y-0.5 hover:shadow-xl transition-all"
              >
                <Calendar size={16} /> Book a 30-min call
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* DARK STATS + THREE WAYS */}
      <section className="px-6 sm:px-10 lg:px-16 py-20">
        <AnimatedSection animation="fade-up">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[44px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-10 sm:p-14 text-white">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#f16610]/30 blur-[120px]" />
            <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#7e8bff]/30 blur-[140px]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

            <div className="relative z-10 space-y-12">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#ff8a3c] font-semibold">Founder ROI</p>
                  <h2 className="mt-3 text-3xl sm:text-4xl font-semibold leading-tight">
                    Average client saves <span className="text-[#ff8a3c]">AED 142,000</span> a year vs in-house.
                  </h2>
                  <p className="mt-4 text-slate-300">
                    No hiring lag, no benefits, no severance risk. One subscription replaces a controller, a tax lead, an audit manager, and a fractional CFO.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  {STATS.map((s) => (
                    <div key={s.label} className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-5">
                      <p className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-white to-[#ff8a3c] bg-clip-text text-transparent">{s.value}</p>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[#ff8a3c] font-semibold mb-4">Three ways to run finance</p>
                <div className="overflow-x-auto -mx-2 px-2">
                  <table className="w-full min-w-[560px] text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-3 px-4 text-left text-[10px] uppercase tracking-[0.3em] text-slate-400 font-semibold w-[28%]">Criteria</th>
                        <th className="py-3 px-4 text-center text-[10px] uppercase tracking-[0.3em] text-slate-400 font-semibold">
                          <div className="inline-flex items-center gap-1.5"><Users size={12} /> In-house hire</div>
                        </th>
                        <th className="py-3 px-4 text-center text-[10px] uppercase tracking-[0.3em] text-slate-400 font-semibold">
                          <div className="inline-flex items-center gap-1.5"><Building2 size={12} /> Traditional firm</div>
                        </th>
                        <th className="py-3 px-4 text-center text-[10px] uppercase tracking-[0.3em] text-[#ff8a3c] font-semibold">
                          <div className="inline-flex items-center gap-1.5"><BarChart3 size={12} /> finanshels</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {THREE_WAYS.map((row, idx) => (
                        <tr key={row.criteria} className={`border-b border-white/5 ${idx % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                          <td className="py-4 px-4 font-semibold text-white text-xs">{row.criteria}</td>
                          <td className="py-4 px-4 text-slate-400 text-xs text-center">{row.inhouse}</td>
                          <td className="py-4 px-4 text-slate-400 text-xs text-center">{row.firm}</td>
                          <td className="py-4 px-4 text-[#ff8a3c] text-xs text-center font-medium bg-white/[0.04] rounded-sm">{row.finanshels}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-[10px] text-slate-500 italic">In-house cost figures reflect typical UAE market ranges and are not finanshels-verified statistics.</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* HOW IT WORKS — value delivery */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-700">
                <Zap size={12} /> How it works
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight max-w-3xl">
                From messy books to a finance function that{' '}
                <span className="bg-gradient-to-r from-[#f16610] to-[#ff8a3c] bg-clip-text text-transparent">runs itself</span>.
              </h2>
              <p className="text-slate-600 max-w-xl text-lg">
                No long ramp-ups. Most clients are fully live in 7 days — then it just works, every single month.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {PROCESS.map((step, index) => (
              <AnimatedSection key={step.title} animation="fade-up" delay={index * 120}>
                <div className="group relative flex h-full flex-col rounded-[28px] border border-slate-100 bg-white p-7 transition-all hover:-translate-y-1.5 hover:border-[#f16610]/30 hover:shadow-[0_30px_60px_-30px_rgba(241,102,16,0.25)]">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-[#fff4ec] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f16610]">
                      {step.when}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f16610] text-sm font-bold text-[#f16610]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="mt-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f16610] to-[#ff8a3c] text-white shadow-lg shadow-[#f16610]/30 transition-transform group-hover:scale-110">
                    <step.icon size={26} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{step.description}</p>
                  <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-5 text-sm font-semibold text-emerald-600">
                    <CheckCircle2 size={16} className="flex-shrink-0" /> {step.outcome}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {cmsTestimonials?.length ? (
        <section className="py-20">
          <TestimonialsCarousel items={cmsTestimonials} ariaLabel="reviews" />
        </section>
      ) : (
        <section className="px-6 sm:px-10 lg:px-16 py-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
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
      <section className="px-6 sm:px-10 lg:px-16 py-20">
        <div className="max-w-4xl mx-auto space-y-10">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                Questions
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">Pricing FAQs</h2>
            </div>
          </AnimatedSection>

          <div className="space-y-3">
            {FAQS.map((faq, index) => (
              <AnimatedSection key={faq.q} animation="fade-up" delay={index * 50}>
                <details className="group rounded-2xl border border-slate-100 bg-white p-6 hover:border-[#f16610]/30 transition-all open:shadow-[0_15px_40px_-25px_rgba(241,102,16,0.3)]">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <h3 className="text-lg font-semibold tracking-tight pr-4">{faq.q}</h3>
                    <span className="flex-shrink-0 h-8 w-8 rounded-full bg-[#fff4ec] text-[#f16610] flex items-center justify-center group-open:rotate-45 transition-transform text-xl font-light">+</span>
                  </summary>
                  <p className="mt-4 text-slate-600 leading-relaxed">{faq.a}</p>
                </details>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 sm:px-10 lg:px-16 pb-24">
        <AnimatedSection animation="fade-up">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[44px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-10 sm:p-16 text-white">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#f16610]/30 blur-[120px]" />
            <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#7e8bff]/25 blur-[140px]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-xl">
                <p className="text-xs uppercase tracking-[0.4em] text-[#ff8a3c] font-semibold">Ready to scope</p>
                <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">Let&apos;s scope the perfect plan.</h2>
                <p className="mt-4 text-white/75 text-lg">
                  Book a 30-minute call — we&apos;ll review your stack, headcount, and milestones, and reply with a detailed quote and implementation plan within 24 hours.
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-6 py-3.5 font-semibold text-white shadow-xl shadow-[#f16610]/30 hover:bg-[#ff8a3c] hover:-translate-y-0.5 transition-all"
                >
                  <Calendar size={18} /> Book a 30-min call
                </a>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/30 bg-white/5 backdrop-blur px-6 py-3.5 font-semibold text-white hover:bg-white/10 transition"
                >
                  <MessageSquare size={18} /> WhatsApp our consultants
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
