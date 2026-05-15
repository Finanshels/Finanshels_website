import {
  ArrowRight,
  Building2,
  Laptop,
  ShoppingBag,
  Banknote,
  Factory,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  MessageSquare,
  Quote,
  Activity,
} from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'

const SOLUTION_SETS = [
  {
    title: 'Venture-backed startups',
    icon: Sparkles,
    tagline: 'SaaS · Fintech · AI · Marketplaces',
    description:
      'Finance architecture for SaaS, fintech, marketplaces, and AI companies who demand month-end closes under five days and board-grade visibility.',
    highlights: ['SaaS metrics + ARR dashboards', 'Revenue recognition & consolidation', 'Fundraising data rooms'],
    accent: 'from-[#fff4ec] to-white',
    iconBg: 'bg-[#fff1e1] text-[#f16610]',
    glow: 'rgba(241,102,16,0.18)',
  },
  {
    title: 'Retail & e-commerce',
    icon: ShoppingBag,
    tagline: 'D2C · Marketplaces · Multi-outlet',
    description:
      'Multi-location inventory accounting, storefront reconciliations, outlet-level profitability, and VAT compliance across the GCC.',
    highlights: ['POS + payment gateway automation', 'Branch-level P&L', 'Cash management & daily dashboards'],
    accent: 'from-[#fce7f3] to-white',
    iconBg: 'bg-[#fce7f3] text-[#db2777]',
    glow: 'rgba(219,39,119,0.18)',
  },
  {
    title: 'Financial services & fintech',
    icon: Banknote,
    tagline: 'PSPs · Lenders · Wallets',
    description:
      'Reconciliations across PSPs, float accounts, wallets, lending books, and settlement partners with controls ready for regulators.',
    highlights: ['Transaction-level reconciliation', 'Capital adequacy reporting', 'Treasury + liquidity models'],
    accent: 'from-[#eef2ff] to-white',
    iconBg: 'bg-[#e9ecff] text-[#4f46e5]',
    glow: 'rgba(79,70,229,0.18)',
  },
  {
    title: 'Industrial & manufacturing',
    icon: Factory,
    tagline: 'Plants · Multi-country',
    description:
      'Cost accounting, production variance, landed cost modelling, and multi-country payroll for teams spreading across the region.',
    highlights: ['Project & job costing', 'Capex controls & approvals', 'Payroll for plants & offices'],
    accent: 'from-[#fef3c7] to-white',
    iconBg: 'bg-[#fef3c7] text-[#b45309]',
    glow: 'rgba(180,83,9,0.18)',
  },
  {
    title: 'Corporate groups',
    icon: Building2,
    tagline: 'Holdings · Multi-subsidiary',
    description:
      'Group consolidations, holding-company governance, entity management, and strategic finance support for multi-subsidiary structures.',
    highlights: ['Multi-entity consolidations', 'Cash pooling & treasury', 'Internal control frameworks'],
    accent: 'from-[#ecfdf5] to-white',
    iconBg: 'bg-[#dcfce7] text-[#059669]',
    glow: 'rgba(5,150,105,0.18)',
  },
  {
    title: 'Digital agencies & services',
    icon: Laptop,
    tagline: 'Retainers · Project-based',
    description:
      'Margin tracking by client, resource allocation, retainer vs. project visibility, and intelligent AR collections.',
    highlights: ['Utilization dashboards', 'Revenue leak prevention', 'Agency-specific KPI tracking'],
    accent: 'from-[#cffafe] to-white',
    iconBg: 'bg-[#cffafe] text-[#0e7490]',
    glow: 'rgba(14,116,144,0.18)',
  },
]

const CASE_STUDIES = [
  {
    company: 'YAP',
    type: 'Fintech',
    result: 'Consolidated 7 banking partners and PSPs into a single reconciliation engine, reducing closing time from 15 days to 4.',
    quote: 'Finanshels behaves like an internal finance and risk team. We now close the books faster than most banks.',
    author: 'YAP Finance Leadership',
    metric: '15d → 4d',
    metricLabel: 'monthly close',
  },
  {
    company: 'Letswork',
    type: 'Marketplace',
    result: 'Centralized outlet-level performance, automated VAT, and spun up Saudi operations with zero compliance slippage.',
    quote: 'They set up our Saudi finance stack in weeks and handle every filing without a single follow-up.',
    author: 'Omar Al Mheiri, Co-founder',
    metric: '0',
    metricLabel: 'compliance misses',
  },
  {
    company: 'Sarwa',
    type: 'Wealthtech',
    result: 'Scaled from UAE to KSA with a dedicated finance team covering CFO support, payroll, and regulatory reporting.',
    quote: 'The fractional CFO team feels like senior leadership. Zero decks, only outcomes.',
    author: 'Sarwa Executive Team',
    metric: '2 mkts',
    metricLabel: 'expansion',
  },
]

const PLATFORM_METRICS = [
  { value: '40+', label: 'data sources automated' },
  { value: '1,200+', label: 'monthly workflows digitized' },
  { value: '300+', label: 'compliance tasks tracked' },
  { value: '15+', label: 'industries supported' },
]

const COMMAND_FEATURES = [
  'Realtime dashboards with proactive alerts',
  'Dedicated WhatsApp line to your finance pod',
  'Board + compliance kits delivered monthly',
  'Senior CFO touchpoints on every plan',
]

export default function Solutions() {
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
            <span className="inline-flex items-center gap-2 rounded-full border border-[#f16610]/30 bg-white/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#f16610] backdrop-blur">
              <Activity size={13} /> Industry solutions
            </span>
            <h1 className="mt-6 text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.05] tracking-tight max-w-4xl mx-auto">
              Finance clarity for{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#f16610]">every business model</span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-[#ffd19b] -z-0 -skew-x-6" />
              </span>
              <br />
              in the region.
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
              Whether you scale software, commerce, manufacturing, or services — Finanshels plugs in workflows tailored to your industry nuances and keeps them future-proof.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="mailto:hello@finanshels.com"
                className="group inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#f16610]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Request a tailored plan
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/services"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-900 bg-white px-6 py-3.5 font-semibold text-slate-900 hover:bg-slate-900 hover:text-white transition"
              >
                See all services
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* SOLUTIONS BENTO */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                Six industries · six playbooks
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight max-w-3xl">
                One platform.{' '}
                <span className="bg-gradient-to-r from-[#f16610] to-[#ff8a3c] bg-clip-text text-transparent">Six industry playbooks.</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SOLUTION_SETS.map((solution, i) => (
              <AnimatedSection key={solution.title} animation="fade-up" delay={i * 70}>
                <div className={`group relative h-full overflow-hidden rounded-[28px] border border-slate-100 bg-gradient-to-br ${solution.accent} p-7 hover:-translate-y-1 hover:shadow-[0_30px_60px_-25px_rgba(15,23,42,0.18)] transition-all`}>
                  <div
                    className="absolute -top-20 -right-20 h-52 w-52 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: solution.glow }}
                  />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className={`w-14 h-14 rounded-2xl ${solution.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <solution.icon size={26} />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-semibold">{solution.tagline}</p>
                    <h3 className="mt-1 text-xl font-semibold tracking-tight">{solution.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{solution.description}</p>
                    <ul className="mt-5 space-y-2">
                      {solution.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                          <CheckCircle2 size={15} className="text-[#f16610] mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* COMMAND CENTER */}
      <section className="px-6 sm:px-10 lg:px-16 py-20">
        <AnimatedSection animation="fade-up">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[44px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-10 sm:p-14 text-white">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#f16610]/30 blur-[120px]" />
            <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#7e8bff]/30 blur-[140px]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/90 backdrop-blur">
                  <Sparkles size={12} /> How we plug in
                </span>
                <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
                  A finance{' '}
                  <span className="bg-gradient-to-r from-white to-[#ff8a3c] bg-clip-text text-transparent">command centre</span>{' '}
                  for each playbook.
                </h2>
                <p className="mt-5 text-slate-300 text-lg max-w-md">
                  Deep MENA expertise, local teams, and a control tower that connects your banks, ERPs, PSPs, and payroll so leadership can trust every metric.
                </p>
                <div className="mt-7 space-y-3">
                  {COMMAND_FEATURES.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm text-white/85">
                      <CheckCircle2 size={16} className="text-[#ff8a3c] mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] bg-white/5 border border-white/15 backdrop-blur-xl p-7 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-semibold">Platform snapshot</p>
                      <p className="mt-1 text-2xl font-semibold">Command Centre</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">
                    Bank feeds, PSP data, ERPs, payroll, and approvals flow into a single pane. Finance rituals documented, assigned, and tracked — no spreadsheets.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {PLATFORM_METRICS.map((m) => (
                      <div key={m.label} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                        <p className="text-2xl font-semibold bg-gradient-to-r from-white to-[#ff8a3c] bg-clip-text text-transparent">
                          {m.value}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mt-1">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* CASE STUDIES */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-700">
                <TrendingUp size={12} /> Customer stories
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">Proof across the ecosystem</h2>
              <p className="text-slate-600 max-w-2xl text-lg">
                We go deep with each client, acting as an extension of their leadership team. Here&apos;s how that plays out.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-5">
            {CASE_STUDIES.map((cs, i) => (
              <AnimatedSection key={cs.company} animation="fade-up" delay={i * 80}>
                <div className="group h-full rounded-[28px] border border-slate-100 bg-white p-7 hover:-translate-y-1 hover:border-[#f16610]/30 hover:shadow-[0_30px_60px_-25px_rgba(241,102,16,0.25)] transition-all flex flex-col relative overflow-hidden">
                  <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#fff1e1] opacity-0 group-hover:opacity-100 blur-2xl transition-opacity" />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-semibold">{cs.type}</p>
                        <h3 className="mt-1 text-2xl font-semibold tracking-tight">{cs.company}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-semibold bg-gradient-to-r from-[#f16610] to-[#ff8a3c] bg-clip-text text-transparent">
                          {cs.metric}
                        </p>
                        <p className="text-[9px] uppercase tracking-widest text-slate-400">{cs.metricLabel}</p>
                      </div>
                    </div>
                    <p className="mt-5 text-sm text-slate-700 leading-relaxed">{cs.result}</p>
                    <div className="mt-auto pt-5">
                      <div className="rounded-2xl bg-[#fff8f0] border border-[#ffd7c0] p-4">
                        <Quote size={16} className="text-[#f16610] mb-2" />
                        <p className="text-sm italic text-slate-700 leading-relaxed">&ldquo;{cs.quote}&rdquo;</p>
                        <p className="mt-2 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">— {cs.author}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
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
                <p className="text-xs uppercase tracking-[0.4em] text-white/80 font-semibold">Tailored playbook</p>
                <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
                  Bring Finanshels into your finance stack.
                </h2>
                <p className="mt-4 text-white/85 text-lg">
                  Share your industry, stage, and tool stack — we&apos;ll send a bespoke playbook in under 48 hours.
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <a
                  href="mailto:hello@finanshels.com"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-semibold text-[#f16610] shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                >
                  Get the playbook <ArrowRight size={18} />
                </a>
                <a
                  href="https://wa.me/971507178156"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/60 bg-white/10 backdrop-blur px-6 py-3.5 font-semibold text-white hover:bg-white/20 transition"
                >
                  <MessageSquare size={18} /> WhatsApp our team
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
