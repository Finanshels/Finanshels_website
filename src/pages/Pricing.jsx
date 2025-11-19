import { useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, Info, ShieldCheck, Sparkles, Zap, Award } from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { TESTIMONIALS } from '../data/team'
import { SERVICE_PAGES } from '../data/servicePages'

const PLANS = [
  {
    name: 'Launch',
    price: '219',
    currency: 'USD / mo',
    description: 'Accounting, VAT, payroll, and compliance for early-stage teams up to 25 employees.',
    cta: 'Start with Launch',
    features: [
      'Monthly bookkeeping & reconciliations',
      'VAT filings & compliance reminders',
      'Payroll & WPS processing',
      'WhatsApp support for leadership',
      'Board-ready reports every month'
    ]
  },
  {
    name: 'Scale',
    price: '699',
    currency: 'USD / mo',
    description: 'Command centre for Series A/B ventures with multi-entity operations.',
    featured: true,
    cta: 'Talk to a Strategist',
    features: [
      'Weekly revenue & burn dashboards',
      'Corporate tax & ESR filings',
      'Fractional CFO office hours',
      'Multi-entity consolidations',
      'Scenario modelling & fundraising kits'
    ]
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Tailored services for conglomerates, regulated fintech, and multi-market operators.',
    cta: 'Book a custom scope',
    features: [
      'Dedicated CFO partner & controllers',
      'In-house PRO & payroll specialists',
      'Tooling & ERP migrations',
      'Advanced internal controls',
      'On-site support & governance'
    ]
  }
]

const VALUE_DRIVERS = [
  { icon: Sparkles, title: 'Managed service', description: 'No freelance chaos. Finansehls delivers audited processes and SLAs.' },
  { icon: ShieldCheck, title: 'Regulatory-grade', description: 'Corporate tax, VAT, ESR, payroll, and visas handled under one roof.' },
  { icon: Zap, title: 'Automation included', description: 'Bank feeds, PSP data, approvals, and dashboards set up as standard.' },
  { icon: Award, title: 'Executive-level reporting', description: 'Weekly, monthly, and quarterly packs benchmarked against top performers.' }
]

const PROCESS = [
  {
    title: '1. Diagnose',
    description:
      'We audit your books, tool stack, compliance backlog, and leadership rituals. You get a scorecard and custom roadmap.'
  },
  {
    title: '2. Implement',
    description:
      'Connect banks, ERPs, spend tools, and payroll. Automations and controls go live while we clean historical data.'
  },
  {
    title: '3. Operate',
    description:
      'Monthly reviews, weekly syncs, live dashboards, investor-ready reporting, and compliance alerts become your new cadence.'
  }
]

const FAQS = [
  {
    q: 'What happens during onboarding?',
    a: 'Day 0–7 digitisation (books, banking, payroll), day 8–21 insights (dashboards, compliance trackers), day 22+ operating cadence with investor-ready rituals.'
  },
  {
    q: 'Can you support multi-entity or multi-country companies?',
    a: 'Yes. We handle entity formation, consolidations, inter-company billing, and cross-border tax/ESR requirements for the entire group.'
  },
  {
    q: 'Do I need to use certain tools?',
    a: 'No. We plug into your existing ERPs and banks. If migrations are needed, we scope them as projects and implement them for you.'
  },
  {
    q: 'How do we communicate?',
    a: 'Slack/WhatsApp for quick updates, weekly/bi-weekly operating reviews, monthly board-ready packs, plus quarterly strategic planning.'
  }
]

const testimonials = TESTIMONIALS.slice(0, 2)

const CAPACITY_OPTIONS = [
  { label: 'Launch', value: 'launch', description: '0-25 employees / up to $1M ARR', multiplier: 1 },
  { label: 'Scale', value: 'scale', description: '26-100 employees / up to $20M ARR', multiplier: 1.9 },
  { label: 'Enterprise', value: 'enterprise', description: '100+ employees / multi-entity', multiplier: 3.2 }
]

const INDUSTRIES = [
  { label: 'SaaS & Fintech', value: 'saas' },
  { label: 'Retail & eCommerce', value: 'retail' },
  { label: 'F&B & hospitality', value: 'fnb' },
  { label: 'Professional services', value: 'services' }
]

const MODULES = [
  { id: 'accounting', label: 'Accounting & Reporting', description: 'Monthly close, dashboards, investor packs', multiplier: 0.35 },
  { id: 'tax', label: 'Tax & Compliance', description: 'VAT, corporate tax, ESR, governance', multiplier: 0.25 },
  { id: 'payroll', label: 'Payroll & People Finance', description: 'WPS, visas, benefits, gratuity', multiplier: 0.15 },
  { id: 'cfo', label: 'Fractional CFO', description: 'Scenario planning, fundraising, pricing', multiplier: 0.4 }
]

const SERVICE_LIST = Object.entries(SERVICE_PAGES).map(([slug, details]) => ({
  slug,
  title: details.title,
  subtitle: details.subtitle,
  category: slug.includes('tax') || slug.includes('vat') ? 'Tax & Compliance' : slug.includes('book') ? 'Accounting' : slug.includes('restaurants') || slug.includes('ecommerce') || slug.includes('smes') ? 'Industry programs' : 'Managed services'
}))

export default function Pricing() {
  const [stage, setStage] = useState('launch')
  const [headcount, setHeadcount] = useState(25)
  const [industry, setIndustry] = useState('saas')
  const [currency, setCurrency] = useState('usd')
  const [modules, setModules] = useState(() => MODULES.map((m) => m.id))

  const estimate = useMemo(() => {
    const baseMap = { launch: 219, scale: 699, enterprise: 1200 }
    const base = baseMap[stage] || 219
    const moduleMultiplier = modules.reduce((acc, id) => {
      const module = MODULES.find((m) => m.id === id)
      return acc + (module ? module.multiplier : 0)
    }, 1)
    const headMultiplier = Math.max(headcount / 25, 1)
    const currencyRate = currency === 'usd' ? 1 : 3.67
    const amount = base * moduleMultiplier * headMultiplier * currencyRate
    const min = Math.round((amount * 0.9) / 10) * 10
    const max = Math.round((amount * 1.2) / 10) * 10
    return { min, max }
  }, [stage, headcount, modules, currency])

  const toggleModule = (id) => {
    setModules((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="bg-white text-slate-900">
      <section className="pt-36 pb-16 px-6 sm:px-10 lg:px-16 bg-slate-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(241,102,16,0.25),_transparent_50%)]" />
        <div className="max-w-5xl mx-auto relative z-10 space-y-6">
          <AnimatedSection animation="fade-down">
            <p className="text-sm uppercase tracking-[0.4em] text-white/70 font-semibold">pricing</p>
            <h1 className="text-4xl sm:text-5xl font-semibold">Finance services tailored to your stage</h1>
            <p className="text-lg text-white/70 mt-4">
              Accounting, tax, payroll, compliance, and CFO services delivered as a single managed service. No hidden fees, no
              unexpected hires.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={80}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button as="a" href="mailto:hello@finanshels.com" size="lg">
                Share your stack
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button
                as="a"
                href="https://wa.me/971507178156"
                variant="ghost"
                size="lg"
                className="border border-white/40 text-white hover:bg-white/10"
              >
                WhatsApp our consultants
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-10 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8 items-start">
          <AnimatedSection animation="fade-right" className="lg:col-span-1 space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">pricing estimator</p>
            <h2 className="text-3xl font-semibold">Answer three questions to see a starting price</h2>
            <p className="text-slate-600">
              This calculator gives a directional number. We send a detailed quote after we review your stack.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-left" className="lg:col-span-2">
            <Card className="rounded-[32px] border border-slate-100">
              <div className="p-8 space-y-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/70 font-semibold mb-3">pick your stage</p>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {CAPACITY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setStage(option.value)}
                        className={`rounded-2xl border px-4 py-3 text-left transition ${
                          stage === option.value ? 'border-[#f16610] bg-[#fff4ec]' : 'border-slate-200'
                        }`}
                      >
                        <p className="font-semibold text-slate-900">{option.label}</p>
                        <p className="text-xs text-slate-500">{option.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/70 font-semibold mb-3">headcount</p>
                  <input
                    type="range"
                    min="10"
                    max="250"
                    step="5"
                    value={headcount}
                    onChange={(e) => setHeadcount(Number(e.target.value))}
                    className="w-full accent-[#f16610]"
                  />
                  <div className="flex justify-between text-sm text-slate-600 mt-2">
                    <span>10</span>
                    <span>{headcount} people</span>
                    <span>250+</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/70 font-semibold mb-3">industry</p>
                  <div className="flex flex-wrap gap-3">
                    {INDUSTRIES.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setIndustry(option.value)}
                        className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                          industry === option.value ? 'border-[#f16610] bg-[#fff4ec]' : 'border-slate-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/70 font-semibold mb-3">services required</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {MODULES.map((module) => (
                      <button
                        key={module.id}
                        onClick={() => toggleModule(module.id)}
                        className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                          modules.includes(module.id) ? 'border-[#f16610] bg-[#fff4ec]' : 'border-slate-200'
                        }`}
                      >
                        <p className="font-semibold text-slate-900">{module.label}</p>
                        <p className="text-xs text-slate-500">{module.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                  <button
                    onClick={() => setCurrency('usd')}
                    className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${
                      currency === 'usd' ? 'border-[#f16610] bg-[#fff4ec]' : 'border-slate-200'
                    }`}
                  >
                    USD
                  </button>
                  <button
                    onClick={() => setCurrency('aed')}
                    className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${
                      currency === 'aed' ? 'border-[#f16610] bg-[#fff4ec]' : 'border-slate-200'
                    }`}
                  >
                    AED
                  </button>
                </div>
                <div className="rounded-[28px] border border-slate-100 bg-[#f8fafc] p-6 text-center space-y-2">
                  <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">estimated monthly fee</p>
                  <p className="text-4xl font-semibold">
                    {currency === 'usd' ? '$' : 'AED '}
                    {estimate.min.toLocaleString()} – {currency === 'usd' ? '$' : 'AED '}
                    {estimate.max.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">Detailed proposals depend on your tool stack, transaction volume, and add-ons.</p>
                </div>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <AnimatedSection key={plan.name} animation="fade-up">
              <Card
                className={`h-full border-2 ${plan.featured ? 'border-[#f16610]' : 'border-slate-100'} ${
                  plan.featured ? 'shadow-2xl' : ''
                } rounded-[28px]`}
              >
                <div className="p-8 space-y-5">
                  <div>
                    <p className="text-sm uppercase tracking-[0.4em] text-slate-500">{plan.name}</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-4xl font-semibold">{plan.price}</span>
                      {plan.currency && <span className="text-slate-500">{plan.currency}</span>}
                    </div>
                    <p className="text-slate-600 mt-2">{plan.description}</p>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="text-[#f16610]" size={18} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    as="a"
                    href="mailto:hello@finanshels.com"
                    variant={plan.featured ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="py-12 px-6 sm:px-10 lg:px-16 bg-slate-50">
        <div className="max-w-6xl mx-auto space-y-6">
          <AnimatedSection animation="fade-down">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">explore services</p>
                <h2 className="text-3xl font-semibold mt-2">Choose the services you need, add more when you need them</h2>
              </div>
              <Button as="a" href="/solutions" variant="outline">See all solutions</Button>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-4">
            {SERVICE_LIST.map((service) => (
              <AnimatedSection key={service.slug} animation="fade-up">
                <Card className="rounded-[24px] border border-slate-100 hover:border-[#f16610]/40 transition">
                  <a href={`/solutions/${service.slug}`} className="block p-6 space-y-2">
                    <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/70 font-semibold">{service.category}</p>
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                    <p className="text-sm text-slate-600">{service.subtitle}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#f16610]">
                      Learn more
                      <ArrowRight size={16} />
                    </span>
                  </a>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-[#fff4ec]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection animation="fade-right">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">what&apos;s included</p>
            <h2 className="text-4xl font-semibold mt-4">Every plan includes the Finanshels control centre</h2>
            <p className="text-lg text-slate-600 mt-4">
              Compliance tracking, reporting cadences, stakeholder updates, and automation rollouts are not add-ons—they ship by
              default. You focus on building; we make sure finance runs.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-left">
            <Card className="border-2 border-[#ffd7c0] bg-white rounded-[32px]">
              <div className="p-8 space-y-5 text-sm text-slate-600">
                {[
                  { label: 'Finance service', value: 'Accounting, tax, payroll, compliance, CFO' },
                  { label: 'Cadence', value: 'Weekly syncs, monthly operating reviews, quarterly boards' },
                  { label: 'Compliance', value: 'VAT, corporate tax, ESR, payroll, visa, entity filings' },
                  { label: 'Automation', value: 'Bank feeds, PSP data, ERP workflows, approvals' },
                  { label: 'Support', value: 'WhatsApp, email, scheduled reviews with SLAs' }
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <Info className="text-[#f16610] mt-1" size={18} />
                    <div>
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-down">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold text-center">
              why operators choose finanshels
            </p>
            <h2 className="text-4xl font-semibold text-center mt-4">More than a vendor. A finance operating system.</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {VALUE_DRIVERS.map((driver) => (
              <AnimatedSection key={driver.title} animation="fade-up">
                <Card className="h-full border border-slate-100 rounded-[28px] p-6 text-center space-y-3">
                  <driver.icon className="mx-auto text-[#f16610]" size={26} />
                  <h3 className="font-semibold text-lg">{driver.title}</h3>
                  <p className="text-sm text-slate-600">{driver.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-slate-50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10 items-center">
          <AnimatedSection animation="fade-right" className="lg:col-span-1">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">how pricing works</p>
            <h2 className="text-3xl font-semibold mt-4">Clean onboarding → predictable monthly invoices</h2>
            <p className="text-slate-600 mt-4">
              Every engagement goes through the same three steps. We do the heavy lifting and keep leadership informed the entire time.
            </p>
          </AnimatedSection>
          <div className="lg:col-span-2 grid sm:grid-cols-3 gap-4">
            {PROCESS.map((step, index) => (
              <AnimatedSection key={step.title} animation="fade-up" delay={index * 80}>
                <Card className="h-full border border-slate-100 rounded-[28px] p-6">
                  <p className="text-4xl font-semibold text-[#f16610] mb-3">{index + 1}</p>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-sm text-slate-600 mt-2">{step.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={testimonial.name} animation="fade-up" delay={index * 80}>
              <Card className="h-full border border-slate-100 rounded-[28px] p-8 space-y-4">
                <p className="text-lg text-slate-700">&quot;{testimonial.quote}&quot;</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection animation="fade-down">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold text-center">
              questions
            </p>
            <h2 className="text-4xl font-semibold text-center mt-4">Pricing FAQs</h2>
          </AnimatedSection>
          <div className="mt-10 space-y-6">
            {FAQS.map((faq, index) => (
              <AnimatedSection key={faq.q} animation="fade-up" delay={index * 40}>
                <Card className="border border-slate-100 rounded-[24px]">
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-semibold">{faq.q}</h3>
                    <p className="text-slate-600">{faq.a}</p>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-slate-950 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatedSection animation="fade-down">
            <h2 className="text-4xl font-semibold">Let&apos;s scope the perfect service</h2>
            <p className="text-lg text-white/70">
              Send us your stack, headcount, and upcoming milestones—we&apos;ll respond with a detailed quote and implementation plan
              within 48 hours.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={80}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button as="a" href="mailto:hello@finanshels.com" size="lg">
                Share my stack
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button
                as="a"
                href="https://wa.me/971507178156"
                size="lg"
                variant="ghost"
                className="text-white border border-white/40 hover:bg-white/10"
              >
                WhatsApp our consultants
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
