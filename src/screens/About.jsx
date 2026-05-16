import {
  ArrowRight,
  Target,
  Users2,
  Sparkles,
  Globe2,
  Flame,
  Briefcase,
  ShieldCheck,
  Rocket,
  Heart,
  Compass,
  TrendingUp,
  CheckCircle2,
  Building2,
  MessageSquare,
} from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import LeadershipCard from '../components/LeadershipCard'
import { COMPANY_VALUES, LEADERSHIP_TEAM } from '../data/team'

const STORY_POINTS = [
  {
    year: '2019',
    title: 'A frustration turned into a company',
    description:
      'Finanshels began as an internal finance team helping Dubai founders fix messy books, missed filings, and compliance fire drills.',
    icon: Rocket,
  },
  {
    year: '2021',
    title: 'Productising the finance team',
    description:
      'We engineered workflows, automations, and reporting rituals that made finance predictable for dozens of venture-backed teams.',
    icon: Sparkles,
  },
  {
    year: '2023',
    title: 'Scaling across MENA',
    description:
      'Dedicated teams in UAE, KSA, Qatar, Egypt, and India helped 400+ companies run accounting, tax, and CFO programs with confidence.',
    icon: Globe2,
  },
  {
    year: 'Today',
    title: 'The finance partner founders deserve',
    description:
      'More than 180 finance specialists ship investor-ready clarity every month so founders can focus on building category-defining products.',
    icon: TrendingUp,
  },
]

const METRICS = [
  { value: '180+', label: 'finance specialists' },
  { value: '6,000+', label: 'UAE clients' },
  { value: '4.9★', label: 'avg. rating' },
  { value: '$1.2B', label: 'flows managed' },
]

const PILLARS = [
  {
    icon: Target,
    title: 'Built for operators',
    description: 'Dedicated teams embed into your leadership cadence, not the other way around.',
    accent: 'bg-[#fff1e1] text-[#f16610]',
  },
  {
    icon: Users2,
    title: 'People + product',
    description: 'Humans you trust plus automations that remove repetitive work and errors.',
    accent: 'bg-[#e9ecff] text-[#4f46e5]',
  },
  {
    icon: Heart,
    title: 'Radical ownership',
    description: 'We behave like an in-house team, obsessing over the same metrics you report to investors.',
    accent: 'bg-[#fce7f3] text-[#db2777]',
  },
]

const CULTURE_POINTS = [
  {
    icon: Flame,
    title: 'Speed without chaos',
    description:
      'Decisions are made in hours, not weeks. We bias toward action, document everything, and clean up as we ship.',
  },
  {
    icon: Briefcase,
    title: 'Craft and depth',
    description:
      'Every team spends 20% of its week on learning: new regulations, tooling, and ways to become a better partner.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust and accountability',
    description:
      'We publish commitments, SLAs, and postmortems openly. When we miss, we own it publicly and fix it fast.',
  },
]

const PRESENCE = [
  {
    flag: '🇦🇪',
    title: 'Dubai, UAE',
    role: 'Global HQ',
    description: 'in5 Tech. Home to leadership and founder-facing teams.',
    accent: 'from-[#fff4ec] to-white',
    glow: 'rgba(241,102,16,0.3)',
  },
  {
    flag: '🇮🇳',
    title: 'Kerala & Ahmedabad, India',
    role: 'Delivery centre',
    description: 'Finance operations hub and training ground for our teams.',
    accent: 'from-[#eef2ff] to-white',
    glow: 'rgba(79,70,229,0.25)',
  },
  {
    flag: '🇸🇦',
    title: 'KSA, Qatar & Egypt',
    role: 'On-ground',
    description: 'Local controllers ensuring compliance and approvals in market.',
    accent: 'from-[#ecfdf5] to-white',
    glow: 'rgba(5,150,105,0.25)',
  },
]

const PRINCIPLES = [
  { icon: Compass, label: 'Compass over map', description: 'Direction beats premature certainty.' },
  { icon: Heart, label: 'Numbers serve people', description: 'Finance exists to give founders confidence.' },
  { icon: Rocket, label: 'Ship and iterate', description: 'Cadence beats one-shot perfection.' },
  { icon: ShieldCheck, label: 'Earn trust daily', description: 'SLAs in public. Postmortems in public.' },
]

export default function About() {
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
              <Building2 size={13} /> About Finanshels
            </span>
            <h1 className="mt-6 text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.05] tracking-tight max-w-4xl mx-auto">
              The finance partner powering{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#f16610]">ambitious UAE teams</span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-[#ffd19b] -z-0 -skew-x-6" />
              </span>
              .
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
              Accountants, controllers, tax leads, audit specialists, and CFO partners who live inside your business. We obsess over numbers so founders can obsess over product, customers, and expansion.
            </p>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {METRICS.map((m, i) => (
                <AnimatedSection key={m.label} animation="fade-up" delay={i * 60}>
                  <div className="rounded-2xl bg-white/80 backdrop-blur border border-slate-100 px-4 py-5 shadow-[0_15px_40px_-25px_rgba(15,23,42,0.18)]">
                    <p className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-[#f16610] to-[#ff8a3c] bg-clip-text text-transparent">
                      {m.value}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1">{m.label}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* OUR EDGE / PILLARS */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
          <AnimatedSection animation="fade-right">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">
              Our edge
            </span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
              A finance company that behaves like a{' '}
              <span className="bg-gradient-to-r from-[#f16610] to-[#ff8a3c] bg-clip-text text-transparent">product team</span>.
            </h2>
            <p className="mt-5 text-lg text-slate-600">
              Finanshels wasn&apos;t born in a boardroom. It was built by operators who were tired of broken books, delayed filings, and finance teams that never had the full context. We built teams that run every layer of finance and feed dashboards leadership actually uses.
            </p>
            <a
              href="/contact"
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-5 py-3 font-semibold text-white shadow-lg shadow-[#f16610]/30 hover:-translate-y-0.5 hover:shadow-xl transition"
            >
              Meet the team <ArrowRight size={16} />
            </a>
          </AnimatedSection>

          <div className="grid sm:grid-cols-3 gap-4">
            {PILLARS.map((p, i) => (
              <AnimatedSection key={p.title} animation="fade-up" delay={i * 100}>
                <div className="group h-full rounded-[28px] border border-slate-100 bg-white p-6 hover:-translate-y-1 hover:shadow-[0_25px_50px_-20px_rgba(15,23,42,0.15)] transition-all">
                  <div className={`w-12 h-12 rounded-2xl ${p.accent} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <p.icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{p.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* STORY TIMELINE */}
      <section className="px-6 sm:px-10 lg:px-16 py-20">
        <div className="max-w-6xl mx-auto space-y-14">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#f16610]/30 bg-[#fff4ec] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#f16610]">
                <Rocket size={12} /> Our story
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight max-w-3xl">
                From a frustration in 2019 to MENA&apos;s default finance partner.
              </h2>
            </div>
          </AnimatedSection>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-[#f16610]/30 to-transparent">
              <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent via-[#f16610] to-transparent animate-marquee" />
            </div>

            <div className="space-y-10 md:space-y-14">
              {STORY_POINTS.map((story, index) => {
                const left = index % 2 === 0
                return (
                  <AnimatedSection key={story.year} animation={left ? 'fade-right' : 'fade-left'} delay={index * 80}>
                    <div className="relative md:grid md:grid-cols-2 md:gap-12 items-center">
                      <div className={left ? 'md:pr-12' : 'md:pl-12 md:order-2'}>
                        <div className="group relative rounded-[28px] border border-slate-100 bg-white p-7 hover:-translate-y-1 hover:shadow-[0_30px_60px_-25px_rgba(15,23,42,0.18)] transition-all">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#f16610] to-[#ff8a3c] text-white flex items-center justify-center shadow-md shadow-[#f16610]/30">
                              <story.icon size={20} />
                            </div>
                            <span className="text-xs uppercase tracking-[0.35em] text-[#f16610] font-bold">{story.year}</span>
                          </div>
                          <h3 className="text-2xl font-semibold tracking-tight">{story.title}</h3>
                          <p className="mt-2 text-slate-600 leading-relaxed">{story.description}</p>
                        </div>
                      </div>
                      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center z-10">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-[#f16610]/30 blur-md animate-pulse" />
                          <div className="relative h-5 w-5 rounded-full bg-white border-4 border-[#f16610]" />
                        </div>
                      </div>
                      <div className="hidden md:block" />
                    </div>
                  </AnimatedSection>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* DARK MISSION BAND */}
      <section className="px-6 sm:px-10 lg:px-16 py-20">
        <AnimatedSection animation="fade-up">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[44px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-10 sm:p-14 text-white">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#f16610]/30 blur-[120px]" />
            <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#7e8bff]/30 blur-[140px]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[#ff8a3c] font-semibold">Our mission</p>
                <h2 className="mt-3 text-4xl sm:text-5xl font-semibold leading-tight tracking-tight">
                  Give every MENA founder a{' '}
                  <span className="bg-gradient-to-r from-white to-[#ff8a3c] bg-clip-text text-transparent">command-centre</span>{' '}
                  for finance.
                </h2>
                <p className="mt-5 text-slate-300 text-lg">
                  We exist so brilliant operators stop drowning in spreadsheets and start shipping the businesses MENA needs.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {PRINCIPLES.map((p) => (
                  <div key={p.label} className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-5 hover:bg-white/10 transition">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f16610]/30 to-[#ff8a3c]/20 text-[#ff8a3c] flex items-center justify-center mb-3">
                      <p.icon size={18} />
                    </div>
                    <p className="text-sm font-semibold">{p.label}</p>
                    <p className="text-xs text-white/60 mt-1 leading-snug">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* LEADERSHIP */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedSection animation="fade-up">
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                  Leadership
                </span>
                <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight max-w-2xl">
                  Operators who&apos;ve built inside the region&apos;s best teams.
                </h2>
              </div>
              <p className="text-slate-600 max-w-sm">
                Our bench spans accounting, tax, HR, technology, and GTM. They coach teams, meet founders weekly, and keep the Finanshels bar painfully high.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEADERSHIP_TEAM.map((leader, index) => (
              <AnimatedSection key={leader.name} animation="fade-up" delay={index * 60}>
                <LeadershipCard leader={leader} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES BENTO */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-gradient-to-b from-white to-[#fffaf3]">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                <Heart size={12} /> Values
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">Principles that shape how we work</h2>
              <p className="text-slate-600 max-w-xl text-lg">
                Not posters. Daily decisions. Every hire, every SLA, every escalation runs through these.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COMPANY_VALUES.map((value, index) => (
              <AnimatedSection key={value.title} animation="fade-up" delay={index * 70}>
                <div className="group h-full rounded-[28px] border border-slate-100 bg-white p-7 hover:-translate-y-1 hover:border-[#f16610]/30 hover:shadow-[0_25px_50px_-20px_rgba(241,102,16,0.2)] transition-all relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#fff1e1] opacity-0 group-hover:opacity-100 blur-2xl transition-opacity" />
                  <div className="relative z-10">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">{value.icon}</div>
                    <h3 className="text-xl font-semibold tracking-tight">{value.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* GLOBAL PRESENCE */}
      <section className="px-6 sm:px-10 lg:px-16 py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                <Globe2 size={12} /> Global presence
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">Local experts across the GCC + India</h2>
              <p className="text-slate-600 max-w-2xl text-lg">
                Finance is hyper-local. Teams on the ground in every country we serve, backed by centres of excellence in Dubai and India.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-5">
            {PRESENCE.map((place, i) => (
              <AnimatedSection key={place.title} animation="fade-up" delay={i * 100}>
                <div className={`group relative h-full overflow-hidden rounded-[32px] border border-slate-100 bg-gradient-to-br ${place.accent} p-7 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-25px_rgba(15,23,42,0.15)] transition-all`}>
                  <div
                    className="absolute -top-20 -right-20 h-52 w-52 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"
                    style={{ background: place.glow }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl leading-none">{place.flag}</span>
                      <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-semibold">{place.role}</span>
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold tracking-tight">{place.title}</h3>
                    <p className="mt-2 text-slate-600 text-sm leading-relaxed">{place.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CULTURE / CAREERS */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="relative overflow-hidden rounded-[44px] bg-gradient-to-br from-[#fff4ec] via-white to-[#fff9f3] border border-[#ffd7c0] p-10 sm:p-14">
              <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#f16610]/15 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[#7e8bff]/15 blur-3xl" />
              <div className="relative z-10 grid lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#f16610]/30 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#f16610]">
                    <Flame size={12} /> Life at Finanshels
                  </span>
                  <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
                    A place for builders who{' '}
                    <span className="bg-gradient-to-r from-[#f16610] to-[#ff8a3c] bg-clip-text text-transparent">enjoy ownership</span>.
                  </h2>
                  <p className="mt-4 text-slate-600 text-lg">
                    We&apos;re assembling a team of finance athletes, operators, and creatives. If you want to design teams, implement automations, or coach founders — Finanshels is your arena.
                  </p>
                  <a
                    href="/careers"
                    className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-[#f16610] transition"
                  >
                    See open roles <ArrowRight size={16} />
                  </a>
                </div>
                <div className="space-y-4">
                  {CULTURE_POINTS.map((point, i) => (
                    <AnimatedSection key={point.title} animation="fade-left" delay={i * 80}>
                      <div className="group flex gap-4 rounded-2xl bg-white border border-slate-100 p-5 hover:border-[#f16610]/30 hover:shadow-[0_15px_40px_-25px_rgba(241,102,16,0.3)] transition-all">
                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#fff1e1] to-[#ffd19b]/40 text-[#f16610] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <point.icon size={20} />
                        </div>
                        <div>
                          <p className="font-semibold tracking-tight">{point.title}</p>
                          <p className="text-sm text-slate-600 leading-relaxed mt-1">{point.description}</p>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
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
                <p className="text-xs uppercase tracking-[0.4em] text-white/80 font-semibold">Let&apos;s build together</p>
                <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
                  Ready to build your finance command centre?
                </h2>
                <p className="mt-4 text-white/85 text-lg">
                  Bring Finanshels into your leadership rhythm. We&apos;ll map your needs, assemble a team, and get you investor-ready in 30 days.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/80">
                  <span className="inline-flex items-center gap-2"><CheckCircle2 size={16} /> 48-hour proposal</span>
                  <span className="inline-flex items-center gap-2"><CheckCircle2 size={16} /> No setup fees on annual</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <a
                  href="mailto:contact@finanshels.com"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-semibold text-[#f16610] shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                >
                  Talk to the team <ArrowRight size={18} />
                </a>
                <a
                  href="https://wa.me/971521549572"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/60 bg-white/10 backdrop-blur px-6 py-3.5 font-semibold text-white hover:bg-white/20 transition"
                >
                  <MessageSquare size={18} /> WhatsApp us
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
