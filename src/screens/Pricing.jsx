'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Zap,
  Award,
  TrendingUp,
  Calculator,
  Wallet,
  MessageSquare,
  Users,
  Building2,
  BarChart3,
} from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import { Button } from '../components/ui/Button'
import { TESTIMONIALS } from '../data/team'
import { SERVICE_PAGES } from '../data/servicePages'

const PLANS = [
  {
    key: 'essential',
    name: 'Essential',
    tag: 'Lean',
    bestFor: 'Best for solo founders & lean LLCs',
    price: '4,999',
    currency: 'AED / mo',
    description: 'Cash-basis bookkeeping, VAT, and corporate tax handled every year for lean UAE businesses.',
    ctaHref: 'https://wa.me/971521549572?text=I%20need%20the%20Essential%20Plan',
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
    price: '9,999',
    currency: 'AED / mo',
    description: 'Quarterly accounting, VAT, and tax advisory for teams scaling across the UAE.',
    ctaHref: 'https://wa.me/971521549572?text=I%20need%20the%20Growth%20Plan',
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
    price: '14,999',
    currency: 'AED / mo',
    description: 'Monthly accrual accounting, CFO attention, and expanded compliance for complex operators.',
    ctaHref: 'https://wa.me/971521549572?text=I%20need%20the%20Scale%20Plan',
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

const VALUE_DRIVERS = [
  { icon: Sparkles, title: 'Managed service', description: 'An embedded UAE finance team — not freelancers or disparate vendors.', accent: 'bg-[#fff1e1] text-[#f16610]' },
  { icon: ShieldCheck, title: 'Regulatory-first', description: 'Corporate tax, VAT, AML, audit prep, and liquidation handled under one roof.', accent: 'bg-[#e9ecff] text-[#4f46e5]' },
  { icon: Zap, title: 'Automation built-in', description: 'Bank feeds, PSP data, approvals, and dashboards implemented for you.', accent: 'bg-[#dcfce7] text-[#059669]' },
  { icon: Award, title: 'Executive reporting', description: 'Weekly, monthly, and quarterly packs benchmarked against top performers.', accent: 'bg-[#fef3c7] text-[#b45309]' },
]

const PROCESS = [
  { title: 'Diagnose', description: 'We audit your books, tool stack, compliance backlog, and leadership rituals. You get a scorecard and custom roadmap.', icon: Calculator },
  { title: 'Implement', description: 'Connect banks, ERPs, and spend tools. Automations and controls go live while we clean historical data.', icon: Zap },
  { title: 'Operate', description: 'Monthly reviews, weekly syncs, live dashboards, investor-ready reporting, and compliance alerts become your cadence.', icon: TrendingUp },
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

const CAPACITY_OPTIONS = [
  { label: 'Essential', value: 'essential', description: 'Up to 100 txn / yr' },
  { label: 'Growth', value: 'growth', description: 'Up to 500 txn / yr' },
  { label: 'Scale', value: 'scale', description: 'Up to 1,500 txn / yr' },
]

const INDUSTRIES = [
  { label: 'SaaS & Fintech', value: 'saas' },
  { label: 'Retail & eCommerce', value: 'retail' },
  { label: 'F&B & hospitality', value: 'fnb' },
  { label: 'Professional services', value: 'services' },
]

const MODULES = [
  { id: 'accounting', label: 'Accounting & Reporting', description: 'Monthly close, dashboards, investor packs', multiplier: 0.35 },
  { id: 'tax', label: 'Tax & Compliance', description: 'VAT, corporate tax, AML, governance', multiplier: 0.25 },
  { id: 'audit', label: 'Audit & Financial Modelling', description: 'Audit prep, working papers, founder models', multiplier: 0.15 },
  { id: 'cfo', label: 'Fractional CFO', description: 'Scenario planning, fundraising, pricing', multiplier: 0.4 },
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

const PLAN_PRICES = { essential: 'AED 4,999/mo', growth: 'AED 9,999/mo', scale: 'AED 14,999/mo' }

const PLAN_KEYS = ['essential', 'growth', 'scale']

const SERVICE_LIST = Object.entries(SERVICE_PAGES).map(([slug, details]) => ({
  slug,
  title: details.title,
  subtitle: details.subtitle,
  category: slug.includes('tax') || slug.includes('vat')
    ? 'Tax & Compliance'
    : slug.includes('book')
    ? 'Accounting'
    : slug.includes('restaurants') || slug.includes('ecommerce') || slug.includes('smes')
    ? 'Industry programs'
    : 'Managed services',
}))

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

function computeRecommendedPlan(revenue, frequency) {
  const revenueScore = { low: 0, mid: 1, high: 2 }[revenue] ?? 0
  const frequencyScore = { annual: 0, quarterly: 1, monthly: 2 }[frequency] ?? 0
  const total = revenueScore + frequencyScore
  if (total <= 1) return 'essential'
  if (total <= 3) return 'growth'
  return 'scale'
}

function PriceSparkline() {
  return (
    <svg viewBox="0 0 200 50" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="price-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f16610" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f16610" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,40 L25,36 L50,38 L75,28 L100,30 L125,20 L150,22 L175,12 L200,8"
        fill="none"
        stroke="#f16610"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="400"
        className="animate-dash"
      />
      <path
        d="M0,40 L25,36 L50,38 L75,28 L100,30 L125,20 L150,22 L175,12 L200,8 L200,50 L0,50 Z"
        fill="url(#price-fill)"
      />
    </svg>
  )
}

export default function Pricing() {
  const [stage, setStage] = useState('essential')
  const [transactions, setTransactions] = useState(100)
  const [industry, setIndustry] = useState('saas')
  const [currency, setCurrency] = useState('aed')
  const [modules, setModules] = useState(() => MODULES.map((m) => m.id))
  const [billing, setBilling] = useState('monthly')
  const [revenueAnswer, setRevenueAnswer] = useState(null)
  const [frequencyAnswer, setFrequencyAnswer] = useState(null)

  const recommendedPlan = useMemo(() => {
    if (!revenueAnswer || !frequencyAnswer) return null
    return computeRecommendedPlan(revenueAnswer, frequencyAnswer)
  }, [revenueAnswer, frequencyAnswer])

  const estimate = useMemo(() => {
    const baseMap = { essential: 4999, growth: 9999, scale: 14999 }
    const base = baseMap[stage] || 4999
    const moduleMultiplier = modules.reduce((acc, id) => {
      const module = MODULES.find((m) => m.id === id)
      return acc + (module ? module.multiplier : 0)
    }, 1)
    const txnMultiplier = Math.max(transactions / 100, 1)
    const currencyRate = currency === 'usd' ? 1 / 3.67 : 1
    const billingDiscount = billing === 'annual' ? 0.83 : 1
    const amount = base * moduleMultiplier * txnMultiplier * currencyRate * billingDiscount
    const min = Math.round((amount * 0.9) / 10) * 10
    const max = Math.round((amount * 1.2) / 10) * 10
    return { min, max }
  }, [stage, transactions, modules, currency, billing])

  const currencyLabel = currency === 'usd' ? '$' : 'AED '
  const testimonials = TESTIMONIALS.slice(0, 2)

  const toggleModule = (id) => {
    setModules((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const scrollToPlan = (planKey) => {
    const el = document.getElementById(`plan-${planKey}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const planDisplayName = (key) => PLANS.find((p) => p.key === key)?.name ?? key

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

      {/* PLAN FINDER */}
      <section className="px-6 sm:px-10 lg:px-16 pb-14">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="rounded-[32px] border border-slate-200 bg-white shadow-[0_15px_40px_-20px_rgba(15,23,42,0.10)] p-8 sm:p-10 space-y-8">
              <div className="text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#f16610]/30 bg-[#fff4ec] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#f16610]">
                  <Sparkles size={11} /> Find your plan
                </span>
                <p className="mt-3 text-lg font-semibold tracking-tight text-slate-900">
                  Answer two questions — we'll point you to the right fit.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 font-semibold">
                  What&apos;s your annual revenue?
                </p>
                <div className="flex flex-wrap gap-2">
                  {REVENUE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setRevenueAnswer(opt.value)}
                      className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all ${
                        revenueAnswer === opt.value
                          ? 'border-[#f16610] bg-[#fff4ec] text-[#f16610] shadow-sm shadow-[#f16610]/20'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 font-semibold">
                  How often do you need management numbers?
                </p>
                <div className="flex flex-wrap gap-2">
                  {FREQUENCY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFrequencyAnswer(opt.value)}
                      className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all ${
                        frequencyAnswer === opt.value
                          ? 'border-[#f16610] bg-[#fff4ec] text-[#f16610] shadow-sm shadow-[#f16610]/20'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`rounded-2xl px-6 py-4 text-center transition-all ${
                recommendedPlan
                  ? 'bg-[#fff4ec] border border-[#f16610]/30'
                  : 'bg-slate-50 border border-slate-200'
              }`}>
                {recommendedPlan ? (
                  <div className="space-y-3">
                    <p className="text-slate-700 text-sm">
                      Based on your answers, the{' '}
                      <strong className="text-[#f16610]">{planDisplayName(recommendedPlan)}</strong> plan fits best.
                    </p>
                    <button
                      onClick={() => scrollToPlan(recommendedPlan)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#f16610]/30 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                      See {planDisplayName(recommendedPlan)} plan <ArrowRight size={15} />
                    </button>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">
                    Select both options above and we&apos;ll recommend the right plan for you.
                  </p>
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* PLAN CARDS */}
      <section className="px-6 sm:px-10 lg:px-16 pb-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => {
            const isRecommended = recommendedPlan === plan.key
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
                    isRecommended ? 'border-[#f16610] ring-4 ring-[#f16610]/25' : plan.border
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
                    <div className="absolute top-5 left-5 inline-flex items-center gap-1 rounded-full bg-[#f16610] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white shadow">
                      Recommended for you
                    </div>
                  )}
                  <div
                    className="absolute -top-20 -right-20 h-52 w-52 rounded-full blur-3xl opacity-60"
                    style={{ background: plan.glow }}
                  />
                  {plan.badge && (
                    <div className={`absolute right-5 inline-flex items-center gap-1.5 rounded-full bg-[#f16610] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-[#f16610]/40 ${isRecommended ? 'top-14' : 'top-5'}`}>
                      <Sparkles size={11} /> {plan.badge}
                    </div>
                  )}

                  <div className={`relative z-10 ${plan.dark ? 'text-white' : ''} ${isRecommended ? 'pt-6' : ''}`}>
                    <p className={`text-[11px] uppercase tracking-[0.3em] font-semibold ${plan.dark ? 'text-[#ff8a3c]' : 'text-[#f16610]'}`}>
                      {plan.tag}
                    </p>
                    <h3 className={`mt-2 text-3xl font-semibold tracking-tight ${plan.dark ? 'text-white' : 'text-slate-900'}`}>
                      {plan.name}
                    </h3>
                    <p className={`mt-1 text-xs font-medium ${plan.dark ? 'text-[#ff8a3c]/80' : 'text-[#f16610]'}`}>
                      {plan.bestFor}
                    </p>
                    <p className={`mt-1 text-sm ${plan.dark ? 'text-white/70' : 'text-slate-600'}`}>{plan.limit}</p>

                    <div className="mt-7 flex items-baseline gap-2">
                      <span className={`text-5xl font-semibold tracking-tight ${plan.dark ? 'text-white' : 'text-slate-900'}`}>
                        {plan.price}
                      </span>
                      <span className={`text-sm font-medium ${plan.dark ? 'text-white/60' : 'text-slate-500'}`}>{plan.currency}</span>
                    </div>
                    <p className={`mt-2 text-sm ${plan.dark ? 'text-white/70' : 'text-slate-600'}`}>{plan.description}</p>

                    <a
                      href={plan.ctaHref}
                      className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold transition-all ${
                        plan.dark
                          ? 'bg-white text-slate-900 hover:bg-[#ff8a3c] hover:text-white'
                          : plan.key === 'growth'
                          ? 'bg-[#f16610] text-white shadow-lg shadow-[#f16610]/30 hover:shadow-xl hover:-translate-y-0.5'
                          : 'border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      Chat with expert <ArrowRight size={16} />
                    </a>

                    <p className={`mt-2 text-center text-[11px] ${plan.dark ? 'text-white/40' : 'text-slate-400'}`}>
                      No setup fee on annual · Cancel anytime · Reply in &lt;24h
                    </p>

                    <div className={`mt-6 pt-6 border-t ${plan.dark ? 'border-white/15' : 'border-slate-200/60'} space-y-3`}>
                      {plan.highlights.map((h) => (
                        <div key={h} className="flex items-start gap-3 text-sm">
                          <CheckCircle2
                            size={18}
                            className={`mt-0.5 flex-shrink-0 ${plan.dark ? 'text-[#ff8a3c]' : 'text-[#f16610]'}`}
                          />
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

      {/* ESTIMATOR */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                <Calculator size={12} /> Interactive estimator
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight max-w-3xl">
                Three sliders. One real-time{' '}
                <span className="bg-gradient-to-r from-[#f16610] to-[#ff8a3c] bg-clip-text text-transparent">price</span>.
              </h2>
              <p className="text-slate-600 max-w-xl text-lg">
                Move the levers below. We send a detailed proposal after a 30-minute scoping call.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid lg:grid-cols-5 gap-6 items-start">
            <AnimatedSection animation="fade-right" className="lg:col-span-3">
              <div className="rounded-[32px] border border-slate-100 bg-white shadow-[0_25px_60px_-30px_rgba(15,23,42,0.18)] p-8 space-y-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-semibold mb-3">Pick your stage</p>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {CAPACITY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setStage(option.value)}
                        className={`group rounded-2xl border-2 px-4 py-3 text-left transition-all ${
                          stage === option.value
                            ? 'border-[#f16610] bg-[#fff4ec] shadow-md shadow-[#f16610]/10'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <p className="font-semibold text-slate-900">{option.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{option.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-semibold">Transactions / year</p>
                    <span className="text-sm font-semibold text-[#f16610]">{transactions.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1800"
                    step="50"
                    value={transactions}
                    onChange={(e) => setTransactions(Number(e.target.value))}
                    className="w-full accent-[#f16610]"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>50</span>
                    <span>900</span>
                    <span>1,800+</span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-semibold mb-3">Industry</p>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setIndustry(option.value)}
                        className={`rounded-full border-2 px-4 py-1.5 text-xs font-semibold transition ${
                          industry === option.value
                            ? 'border-[#f16610] bg-[#fff4ec] text-[#f16610]'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-semibold mb-3">Services included</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {MODULES.map((module) => {
                      const active = modules.includes(module.id)
                      return (
                        <button
                          key={module.id}
                          onClick={() => toggleModule(module.id)}
                          className={`flex items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all ${
                            active ? 'border-[#f16610] bg-[#fff4ec]' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                              active ? 'border-[#f16610] bg-[#f16610]' : 'border-slate-300'
                            }`}
                          >
                            {active && <CheckCircle2 size={14} className="text-white" />}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{module.label}</p>
                            <p className="text-[11px] text-slate-500">{module.description}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-semibold mr-2">Currency</p>
                  {['aed', 'usd'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition ${
                        currency === c ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-left" delay={100} className="lg:col-span-2">
              <div className="sticky top-32 rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white relative overflow-hidden">
                <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-[#f16610]/30 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[#7e8bff]/25 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live estimate
                    </span>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-semibold">{billing}</p>
                  </div>

                  <p className="mt-5 text-xs uppercase tracking-[0.3em] text-white/60 font-semibold">Estimated monthly fee</p>
                  <div className="mt-2">
                    <p className="text-5xl font-semibold tracking-tight bg-gradient-to-r from-white to-[#ff8a3c] bg-clip-text text-transparent">
                      {currencyLabel}
                      {estimate.min.toLocaleString()}
                    </p>
                    <p className="text-sm text-white/60 mt-1">
                      to {currencyLabel}{estimate.max.toLocaleString()} / month
                    </p>
                  </div>

                  <div className="mt-6 h-12">
                    <PriceSparkline />
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs">
                    <div className="flex justify-between text-white/70">
                      <span>Stage</span>
                      <span className="text-white font-medium capitalize">{stage}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Transactions / yr</span>
                      <span className="text-white font-medium">{transactions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Modules</span>
                      <span className="text-white font-medium">{modules.length} of {MODULES.length}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Industry</span>
                      <span className="text-white font-medium capitalize">{industry}</span>
                    </div>
                  </div>

                  <a
                    href="mailto:contact@finanshels.com"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900 hover:bg-[#ff8a3c] hover:text-white transition-all"
                  >
                    Get detailed proposal <ArrowRight size={16} />
                  </a>
                  <p className="text-[10px] text-white/50 mt-3 text-center">No commitment. Reply in &lt; 24 hours.</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* VALUE DRIVERS */}
      <section className="px-6 sm:px-10 lg:px-16 py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                Why finanshels
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">More than a vendor. A finance co-pilot.</h2>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUE_DRIVERS.map((d, i) => (
              <AnimatedSection key={d.title} animation="fade-up" delay={i * 80}>
                <div className="group h-full rounded-[28px] border border-slate-100 bg-white p-6 hover:-translate-y-1 hover:shadow-[0_25px_50px_-20px_rgba(15,23,42,0.15)] transition-all">
                  <div className={`w-12 h-12 rounded-2xl ${d.accent} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <d.icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">{d.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{d.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
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
                <thead className="bg-slate-50/90 sticky top-16 z-20">
                  <tr className="border-b border-slate-200 text-left">
                    <th className="py-4 px-5 font-semibold text-slate-500 text-[10px] uppercase tracking-[0.3em] bg-slate-50/90">Feature</th>
                    {PLAN_KEYS.map((key, index) => (
                      <th
                        key={key}
                        className={`py-4 px-5 font-semibold text-[10px] uppercase tracking-[0.3em] text-center ${
                          key === 'growth' ? 'text-[#f16610] bg-[#fff8f0]' : 'text-slate-500 bg-slate-50/90'
                        }`}
                      >
                        {PLANS[index].name}
                        <span className={`block text-[9px] mt-0.5 font-bold ${key === 'growth' ? 'text-[#f16610]' : 'text-slate-400'}`}>
                          {PLAN_PRICES[key]}
                        </span>
                        {key === 'growth' && (
                          <span className="block text-[8px] mt-0.5 font-bold text-[#f16610]">★ MOST POPULAR</span>
                        )}
                      </th>
                    ))}
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
        </div>
      </section>

      {/* DARK STATS BAND + THREE WAYS TO RUN FINANCE */}
      <section className="px-6 sm:px-10 lg:px-16 py-20">
        <AnimatedSection animation="fade-up">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[44px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-10 sm:p-14 text-white">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#f16610]/30 blur-[120px]" />
            <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#7e8bff]/30 blur-[140px]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

            <div className="relative z-10 space-y-12">
              {/* Stats intro row */}
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
                  {[
                    { value: '142k', label: 'avg AED annual saving' },
                    { value: '<24h', label: 'reply SLA' },
                    { value: '99.4%', label: 'on-time filings' },
                    { value: '4.9★', label: 'Google rating' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-5">
                      <p className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-white to-[#ff8a3c] bg-clip-text text-transparent">
                        {s.value}
                      </p>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Three ways comparison */}
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
                      {[
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
                      ].map((row, idx) => (
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

      {/* PROCESS */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-700">
                <Zap size={12} /> How it works
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">Clean onboarding → predictable invoices</h2>
            </div>
          </AnimatedSection>

          <div className="relative">
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-[#f16610]/30 via-[#f16610] to-[#f16610]/30">
              <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-white to-transparent animate-marquee" />
            </div>
            <div className="grid md:grid-cols-3 gap-6 relative">
              {PROCESS.map((step, index) => (
                <AnimatedSection key={step.title} animation="fade-up" delay={index * 120}>
                  <div className="text-center group">
                    <div className="relative inline-flex">
                      <div className="absolute inset-0 rounded-full bg-[#f16610]/20 blur-xl group-hover:bg-[#f16610]/40 transition-colors" />
                      <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-[#f16610] to-[#ff8a3c] flex items-center justify-center text-white shadow-xl shadow-[#f16610]/30 group-hover:scale-110 transition-transform">
                        <step.icon size={32} />
                      </div>
                      <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white border-2 border-[#f16610] text-[#f16610] text-sm font-bold flex items-center justify-center shadow-md">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold tracking-tight">{step.title}</h3>
                    <p className="mt-2 text-slate-600 max-w-xs mx-auto leading-relaxed">{step.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
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

      {/* SERVICES STRIP */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-gradient-to-b from-white to-[#fffaf3]">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                  Add-on services
                </span>
                <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight max-w-2xl">
                  Choose what you need. Add more when you grow.
                </h2>
              </div>
              <Button as="a" href="/solutions" variant="outline">
                See all solutions
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICE_LIST.slice(0, 9).map((service, i) => (
              <AnimatedSection key={service.slug} animation="fade-up" delay={i * 50}>
                <a
                  href={`/solutions/${service.slug}`}
                  className="group block h-full rounded-[24px] border border-slate-100 bg-white p-6 hover:border-[#f16610]/40 hover:shadow-[0_20px_40px_-20px_rgba(15,23,42,0.15)] hover:-translate-y-1 transition-all"
                >
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#f16610] font-semibold">{service.category}</p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight">{service.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">{service.subtitle}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#f16610]">
                    Learn more <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

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
                    <span className="flex-shrink-0 h-8 w-8 rounded-full bg-[#fff4ec] text-[#f16610] flex items-center justify-center group-open:rotate-45 transition-transform text-xl font-light">
                      +
                    </span>
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
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[44px] bg-gradient-to-br from-[#f16610] via-[#ff7a23] to-[#ff8a3c] p-10 sm:p-16 text-white">
            <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-xl">
                <p className="text-xs uppercase tracking-[0.4em] text-white/80 font-semibold">Ready to scope</p>
                <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
                  Let&apos;s scope the perfect service.
                </h2>
                <p className="mt-4 text-white/85 text-lg">
                  Share your stack, headcount, and upcoming milestones. We&apos;ll respond with a detailed quote and implementation plan within 48 hours.
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <a
                  href="mailto:contact@finanshels.com"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-semibold text-[#f16610] shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                >
                  Share my stack <ArrowRight size={18} />
                </a>
                <a
                  href="https://wa.me/971521549572"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/60 bg-white/10 backdrop-blur px-6 py-3.5 font-semibold text-white hover:bg-white/20 transition"
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
