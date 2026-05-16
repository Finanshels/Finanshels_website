import {
  ArrowRight,
  Calculator,
  ShieldCheck,
  Wallet,
  Briefcase,
  Building2,
  Workflow,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Zap,
  TrendingUp,
  Users2,
  Compass,
} from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'

const SERVICE_GROUPS = [
  {
    title: 'Accounting & Reporting',
    icon: Calculator,
    description:
      'Monthly bookkeeping, accrual-based ledgers, multi-entity consolidations, AR/AP, and board-ready reporting shipped like clockwork.',
    items: ['Monthly close rituals', 'Variance analysis and commentary', 'Audit preparation and policies'],
    accent: 'from-[#fff4ec] to-white',
    iconBg: 'bg-[#fff1e1] text-[#f16610]',
    glow: 'rgba(241,102,16,0.18)',
  },
  {
    title: 'Tax, VAT & Compliance',
    icon: ShieldCheck,
    description:
      'Corporate tax, VAT, AML, and audit-prep filings executed by teams who live inside UAE regulations every day.',
    items: ['Corporate tax computation & filing', 'VAT registration and returns', 'AML policies & reviews'],
    accent: 'from-[#eef2ff] to-white',
    iconBg: 'bg-[#e9ecff] text-[#4f46e5]',
    glow: 'rgba(79,70,229,0.18)',
  },
  {
    title: 'Audit & Financial Modelling',
    icon: Wallet,
    description:
      'External-audit support, working papers, and founder-grade financial models that hold up in board rooms and data rooms.',
    items: ['Year-end audit preparation', 'Three-statement & scenario models', 'Investor data room hygiene'],
    accent: 'from-[#ecfdf5] to-white',
    iconBg: 'bg-[#dcfce7] text-[#059669]',
    glow: 'rgba(5,150,105,0.18)',
  },
  {
    title: 'Fractional CFO Office',
    icon: Briefcase,
    description:
      'Fundraising narratives, cash forecasting, KPI stewardship, and pricing experiments guided by a bench of former startup CFOs.',
    items: ['Rolling forecasts & runway models', 'Board & investor updates', 'Pricing & margin diagnostics'],
    accent: 'from-[#fef3c7] to-white',
    iconBg: 'bg-[#fef3c7] text-[#b45309]',
    glow: 'rgba(180,83,9,0.18)',
  },
  {
    title: 'Liquidation & Wind-down',
    icon: Building2,
    description:
      'Clean shutdowns when it is time to wind down: regulator filings, final accounts, asset settlement, and clearance certificates.',
    items: ['Liquidation filings & approvals', 'Final accounts & creditor notices', 'Clearance & deregistration support'],
    accent: 'from-[#fce7f3] to-white',
    iconBg: 'bg-[#fce7f3] text-[#db2777]',
    glow: 'rgba(219,39,119,0.18)',
  },
  {
    title: 'Automation & Workflow Design',
    icon: Workflow,
    description:
      'Custom workflows across ERPs, expense tools, banks, and dashboards so your leadership team sees truth across every number.',
    items: ['Tooling integration & migration', 'Approval matrices & policies', 'Realtime dashboards & alerts'],
    accent: 'from-[#cffafe] to-white',
    iconBg: 'bg-[#cffafe] text-[#0e7490]',
    glow: 'rgba(14,116,144,0.18)',
  },
]

const DELIVERY_PROCESS = [
  {
    title: 'Discovery & diagnostics',
    description:
      'We audit your existing books, tooling, compliance backlog, and finance rituals to understand real gaps. Zero fluff — only signal.',
    icon: Compass,
  },
  {
    title: 'Team assembly',
    description:
      'Specialists across accounting, tax, compliance, and CFO are assigned to your business. Each team has a single point of accountability.',
    icon: Users2,
  },
  {
    title: 'Execution & rituals',
    description:
      'Monthly cadences with reporting packs, compliance trackers, and WhatsApp updates keep founders and operators in sync.',
    icon: Zap,
  },
  {
    title: 'Scale & optimization',
    description:
      'As you expand into new geos or product lines, we adjust the finance architecture, tooling, and policies to match the ambition.',
    icon: TrendingUp,
  },
]

const METRICS = [
  { label: 'finance operators in-house', value: '180+' },
  { label: 'MENA markets supported', value: '12' },
  { label: 'avg. onboarding time', value: '30 days' },
  { label: 'customer satisfaction', value: '4.9/5' },
]

const HIGHLIGHTS = [
  'One subscription · no hourly billing',
  'Senior operators on every account',
  'WhatsApp + email · < 24h reply SLA',
]

export default function Services() {
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
              <Sparkles size={13} /> Our services
            </span>
            <h1 className="mt-6 text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.05] tracking-tight max-w-4xl mx-auto">
              Every layer of finance, delivered as a{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#f16610]">managed service</span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-[#ffd19b] -z-0 -skew-x-6" />
              </span>
              .
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
              Finanshels assembles dedicated teams across accounting, tax, compliance, and CFO so you can run a finance department built for velocity — without the overhead of hiring a dozen specialists.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="mailto:contact@finanshels.com"
                className="group inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#f16610]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Design my finance team
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-900 bg-white px-6 py-3.5 font-semibold text-slate-900 hover:bg-slate-900 hover:text-white transition"
              >
                See pricing
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
              {HIGHLIGHTS.map((h, i) => (
                <span key={h} className="inline-flex items-center gap-2">
                  {i > 0 && <span className="h-1 w-1 rounded-full bg-slate-300" />}
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  {h}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* SERVICE BENTO */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                Six services · one bench
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight max-w-3xl">
                Pick the muscles you need.{' '}
                <span className="bg-gradient-to-r from-[#f16610] to-[#ff8a3c] bg-clip-text text-transparent">Add more as you grow.</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICE_GROUPS.map((service, i) => (
              <AnimatedSection key={service.title} animation="fade-up" delay={i * 70}>
                <div className={`group relative h-full overflow-hidden rounded-[28px] border border-slate-100 bg-gradient-to-br ${service.accent} p-7 hover:-translate-y-1 hover:shadow-[0_30px_60px_-25px_rgba(15,23,42,0.18)] transition-all`}>
                  <div
                    className="absolute -top-20 -right-20 h-52 w-52 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: service.glow }}
                  />
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl ${service.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                      <service.icon size={26} />
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight">{service.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{service.description}</p>
                    <ul className="mt-5 space-y-2">
                      {service.items.map((item) => (
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

      {/* DELIVERY PROCESS */}
      <section className="px-6 sm:px-10 lg:px-16 py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-700">
                <Zap size={12} /> Delivery model
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                Teams built for founders, operators, and boards
              </h2>
            </div>
          </AnimatedSection>

          <div className="relative">
            <div className="hidden md:block absolute top-12 left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-[#f16610]/30 via-[#f16610] to-[#f16610]/30">
              <div className="h-full w-1/4 bg-gradient-to-r from-transparent via-white to-transparent animate-marquee" />
            </div>
            <div className="grid md:grid-cols-4 gap-6 relative">
              {DELIVERY_PROCESS.map((step, index) => (
                <AnimatedSection key={step.title} animation="fade-up" delay={index * 100}>
                  <div className="text-center group">
                    <div className="relative inline-flex">
                      <div className="absolute inset-0 rounded-full bg-[#f16610]/20 blur-xl group-hover:bg-[#f16610]/40 transition-colors" />
                      <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-[#f16610] to-[#ff8a3c] flex items-center justify-center text-white shadow-xl shadow-[#f16610]/30 group-hover:scale-110 transition-transform">
                        <step.icon size={30} />
                      </div>
                      <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white border-2 border-[#f16610] text-[#f16610] text-sm font-bold flex items-center justify-center shadow-md">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold tracking-tight">{step.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">{step.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DARK METRICS BAND */}
      <section className="px-6 sm:px-10 lg:px-16 py-20">
        <AnimatedSection animation="fade-up">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[44px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-10 sm:p-14 text-white">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#f16610]/30 blur-[120px]" />
            <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#7e8bff]/30 blur-[140px]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#ff8a3c] font-semibold">Impact</p>
                  <h2 className="mt-3 text-3xl sm:text-4xl font-semibold max-w-xl tracking-tight">
                    Trusted by the fastest-growing teams in MENA.
                  </h2>
                </div>
                <p className="text-slate-300 max-w-md text-sm">
                  We obsess over tangible wins: faster closes, cleaner compliance, and the confidence to take bigger bets.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {METRICS.map((m) => (
                  <div key={m.label} className="space-y-1.5">
                    <p className="text-4xl sm:text-5xl font-semibold tracking-tight bg-gradient-to-r from-white to-[#ff8a3c] bg-clip-text text-transparent">
                      {m.value}
                    </p>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
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
                <p className="text-xs uppercase tracking-[0.4em] text-white/80 font-semibold">Plug us in</p>
                <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
                  Ready for a global-grade finance team?
                </h2>
                <p className="mt-4 text-white/85 text-lg">
                  Share your current stack — we&apos;ll design a team, implementation plan, and pricing within 48 hours.
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
                  href="https://wa.me/971521549572"
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
