import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ChevronRight,
  Building2,
  ShieldCheck,
  Sparkles,
  Wallet,
  CalendarCheck2,
  BarChart3,
  FileText,
  Activity,
  MessageSquare,
  Calculator,
  PlayCircle
} from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import { Card } from '../components/ui/Card'
import TestimonialCard from '../components/TestimonialCard'
import { TESTIMONIALS } from '../data/team'

const HERO_BULLETS = [
  'Dedicated controllers, tax leads, payroll, and CFO partners inside one subscription',
  'Realtime dashboards, filings, board packs, and variance reviews every month',
  'Deep MENA presence with on-ground finance operators across the GCC and beyond'
]

const HERO_STATS = [
  { value: '5,000+', label: 'clients across the UAE' },
  { value: '135+', label: 'finance specialists' },
  { value: '12', label: 'active markets' }
]

const CUSTOMER_LOGOS = ['Hub71', 'YAP', 'Baraka', 'Letswork', 'Sarwa', 'Rain']

const PRODUCT_STRIP = [
  {
    title: 'Taxes',
    items: [
      { name: 'Corporate Tax Deadline Checker', description: 'Check your deadline & penalties.', icon: FileText, href: '/products/corporate-tax-deadline-checker' },
      { name: 'Hala', description: 'Real-time finance insights at a glance.', icon: PlayCircle, href: '/products/hala' }
    ]
  },
  {
    title: 'Financials',
    items: [
      { name: 'Financial Health Checker', description: 'Deep dives, zero fluff—finance decoded.', icon: Activity, href: '/products/financial-health-checker' },
      { name: 'Cash Flow Scorecard', description: 'Live and on-demand money wisdom.', icon: BarChart3, href: '/products/cash-flow-scorecard' }
    ]
  },
  {
    title: 'Others',
    items: [
      { name: 'Client Portal', description: 'Real talk on startup money—no spreadsheets.', icon: MessageSquare, href: '/products/client-portal' },
      { name: 'Gratuity Calculator for UAE', description: 'Model end-of-service obligations in minutes.', icon: Calculator, href: '/products/gratuity-calculator-uae' }
    ]
  }
]

const SOLUTION_PILLARS = [
  {
    icon: Building2,
    title: 'Accounting & Reporting',
    copy: 'Management reporting, AR/AP, audit prep, and policy design purpose-built for scale-ups.'
  },
  {
    icon: ShieldCheck,
    title: 'Tax, VAT & Compliance',
    copy: 'Corporate tax, VAT, ESR, payroll, entity administration, and governance handled end-to-end.'
  },
  {
    icon: Sparkles,
    title: 'Fractional CFO & Strategy',
    copy: 'Runway planning, pricing strategy, investor updates, and operating cadences with seasoned CFOs.'
  }
]

const TIMELINE = [
  {
    caption: 'Day 0 – 7',
    title: 'Digitize',
    copy: 'We ingest ledgers, banks, payroll, PSPs, and policies while building automations and approvals.'
  },
  {
    caption: 'Day 8 – 21',
    title: 'Insight',
    copy: 'Clean books, compliance trackers, and dashboards go live. Leadership sees the first operating review.'
  },
  {
    caption: 'Day 22+',
    title: 'Command',
    copy: 'Monthly board-ready packs, scenario planning, and WhatsApp support keep every ritual on track.'
  }
]

const CTA_LINKS = [
  { label: 'Explore solutions', href: '/solutions' },
  { label: 'View pricing', href: '/pricing' },
  { label: 'Talk to sales', href: 'mailto:hello@finanshels.com' }
]

const WHY_SWITCH = [
  {
    tag: 'Support',
    title: 'WhatsApp-first access',
    copy: 'Dedicated pods respond within minutes and bring controllers, CFOs, and tax leads into every thread.'
  },
  {
    tag: 'Compliance',
    title: 'Zero-surprise filings',
    copy: 'Corporate tax, VAT, ESR, payroll, visas, and entity renewals tracked in one calendar so nothing slips.'
  },
  {
    tag: 'Insights',
    title: 'Board-ready narratives',
    copy: 'Monthly decks, rolling forecasts, and “what changed” commentary ready for investors and leadership.'
  },
  {
    tag: 'Tooling',
    title: 'Products built for MENA',
    copy: 'Deadline checkers, client portals, and cash scorecards tuned for UAE/KSA regulations.'
  }
]

export default function Home() {
  return (
    <div className="bg-[#fffdfb] text-slate-900">
      <section className="pt-36 pb-20 px-6 sm:px-10 lg:px-16 bg-gradient-to-b from-[#f7f0ff] via-white to-white relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#b397ff]/30 to-transparent pointer-events-none" />
        <div className="absolute -top-10 -right-20 w-64 h-64 rounded-full bg-[#f16610]/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-[#7e8bff]/20 blur-[120px]" />
        <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <AnimatedSection animation="fade-right">
            <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">Finance operators for founders</p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-semibold leading-tight">
              Leave your <span className="text-[#f16610]">Accounting</span> heavy lifting to Finanshels
            </h1>
            <p className="mt-6 text-lg text-slate-600">
              Accounting, tax, payroll, and CFO partners on autopilot. Finanshels builds a finance command centre around your company so you can focus on
              shipping products, not chasing spreadsheets—trusted by more than 5,000 UAE clients and a bench of 135+ finance specialists.
            </p>
            <div className="mt-8 grid gap-3">
              {HERO_BULLETS.map((bullet) => (
                <div key={bullet} className="flex items-start gap-3 text-sm text-slate-700">
                  <ChevronRight className="text-[#f16610]" size={20} />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-6 py-3 font-semibold text-white shadow-lg shadow-[#f16610]/30"
              >
                Speak to our team
                <ArrowRight size={18} />
              </Link>
              <a
                href="https://wa.me/971507178156?text=Hi%20Team%20Finanshels%2C%20let%E2%80%99s%20talk%20finance."
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#f16610] px-6 py-3 font-semibold text-[#f16610]"
              >
                WhatsApp us
              </a>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-left">
            <Card className="rounded-[36px] border border-white/60 bg-white/90 backdrop-blur p-8 space-y-6 shadow-[0_25px_70px_rgba(15,23,42,0.12)]">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500 font-semibold">Trusted numbers</p>
              <div className="grid grid-cols-2 gap-4 text-slate-700 font-semibold text-lg">
                {HERO_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl bg-gradient-to-br from-[#fff8f2] to-white p-4 border border-[#ffe4d1] shadow-inner shadow-white/60"
                  >
                    <p className="text-3xl text-[#f16610] font-semibold">{stat.value}</p>
                    <p className="text-xs uppercase tracking-[0.35em] mt-2 text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-3xl border border-slate-100/80 p-4 bg-[#f8fafc] space-y-2 text-sm text-slate-600">
                <p className="text-xs uppercase tracking-[0.35em] text-[#f16610]/80 font-semibold">Operators love us for</p>
                <p>Weekly variance calls • Board-ready narratives • Compliance vigilance • WhatsApp-first support</p>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="px-6 sm:px-10 lg:px-16 pb-16">
        <AnimatedSection animation="fade-up">
          <div className="max-w-6xl mx-auto rounded-[30px] border border-slate-100 bg-white p-4 flex flex-wrap justify-between items-center gap-4 shadow-[0_15px_40px_rgba(15,23,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">Trusted by modern operators</p>
            <div className="flex flex-wrap gap-6 text-slate-500 text-sm font-semibold">
              {CUSTOMER_LOGOS.map((logo) => (
                <span key={logo} className="uppercase tracking-[0.2em] text-slate-400">
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      <section className="px-6 sm:px-10 lg:px-16 pb-20">
        <AnimatedSection animation="fade-up">
          <div className="max-w-6xl mx-auto rounded-[36px] border border-slate-100 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.08)] p-8 space-y-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">Products</p>
              <h2 className="text-2xl font-semibold text-slate-900">Purpose-built tools to keep finance on schedule</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {PRODUCT_STRIP.map((section) => (
                <div key={section.title} className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.4em] text-slate-500 font-semibold">{section.title}</p>
                  <div className="space-y-3">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="group flex items-start gap-4 rounded-3xl border border-slate-100 bg-[#fff9f5] p-4 hover:border-[#f16610]/40"
                        >
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-inner text-[#f16610]">
                            <Icon size={20} />
                          </div>
                          <div>
                            <p className="font-semibold flex items-center gap-2">
                              {item.name}
                              <ArrowRight className="text-slate-400 group-hover:text-[#f16610]" size={16} />
                            </p>
                            <p className="text-sm text-slate-600">{item.description}</p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      <section className="px-6 sm:px-10 lg:px-16 pb-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">How we plug in</p>
              <h2 className="text-3xl font-semibold">Pick the finance muscle you need</h2>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {SOLUTION_PILLARS.map((pillar) => (
              <AnimatedSection key={pillar.title} animation="fade-up">
                <Card className="h-full rounded-[32px] border border-slate-100 bg-white p-6 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#fff4ec] text-[#f16610] flex items-center justify-center">
                    <pillar.icon size={22} />
                  </div>
                  <h3 className="text-xl font-semibold">{pillar.title}</h3>
                  <p className="text-slate-600 text-sm">{pillar.copy}</p>
                  <Link to="/solutions" className="inline-flex items-center gap-2 text-sm font-semibold text-[#f16610]">
                    Explore services
                    <ArrowRight size={16} />
                  </Link>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-10 lg:px-16 pb-20 bg-white">
        <div className="max-w-6xl mx-auto space-y-8">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">Why teams switch</p>
              <h2 className="text-3xl font-semibold">Finance isn’t just bookkeeping — it’s your command centre</h2>
              <p className="text-slate-600 max-w-3xl">
                Finanshels blends battle-tested runbooks with collaborative tooling so your numbers, filings, and narratives move at startup speed.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6">
            {WHY_SWITCH.map((item, index) => (
              <AnimatedSection key={item.title} animation="fade-up" delay={index * 60}>
                <Card className="h-full rounded-[30px] border border-slate-100 bg-[#fffdfb] p-6 space-y-3 hover:border-[#f16610]/40 transition">
                  <span className="text-xs uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">{item.tag}</span>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.copy}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-[#fffdfb]">
        <div className="max-w-5xl mx-auto space-y-10">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">Go live fast</p>
              <h2 className="text-3xl font-semibold">From chaos to command in three sprints</h2>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {TIMELINE.map((item, index) => (
              <AnimatedSection key={item.title} animation="fade-up" delay={index * 80}>
                <Card className="h-full rounded-[32px] border border-slate-100 bg-white p-6 space-y-3 shadow-[0_15px_40px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition">
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400 font-semibold">{item.caption}</p>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.copy}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-10 lg:px-16 pb-20 bg-[#fffdfb]">
        <div className="max-w-6xl mx-auto space-y-10">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">Testimonials</p>
              <h2 className="text-3xl font-semibold">What founders and CFOs say</h2>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.slice(0, 4).map((testimonial, index) => (
              <AnimatedSection key={testimonial.name} animation="fade-up" delay={index * 60}>
                <TestimonialCard testimonial={testimonial} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-10 lg:px-16 pb-20">
        <AnimatedSection animation="fade-up">
          <div className="max-w-5xl mx-auto text-center space-y-5 rounded-[36px] border border-slate-100 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-10">
            <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">Let’s build your finance operations</p>
            <h2 className="text-3xl font-semibold">Plug Finanshels into your stack</h2>
            <p className="text-slate-600 text-lg">
              Share your tooling, team, and deadlines. We respond within 48 hours with a tailored roadmap and pricing snapshot.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {CTA_LINKS.map((cta) =>
                cta.href.startsWith('http') ? (
                  <a key={cta.label} href={cta.href} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-6 py-3 text-slate-700">
                    {cta.label}
                    <ArrowRight size={16} />
                  </a>
                ) : (
                  <Link key={cta.label} to={cta.href} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-6 py-3 text-slate-700">
                    {cta.label}
                    <ArrowRight size={16} />
                  </Link>
                )
              )}
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
