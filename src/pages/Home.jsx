import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  LineChart,
  Layers,
  Building2,
  Wallet,
  Receipt,
  Rocket,
  Users2,
  Globe2,
  Target,
  CheckCircle2,
  CalendarCheck2,
  BarChart3
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import AnimatedSection from '../components/AnimatedSection'
import FloatingCard from '../components/FloatingCard'
import AnimatedCounter from '../components/AnimatedCounter'
import TestimonialCard from '../components/TestimonialCard'
import LeadershipCard from '../components/LeadershipCard'
import { TESTIMONIALS, LEADERSHIP_TEAM, COMPANY_VALUES } from '../data/team'

const HERO_BULLETS = [
  'Dedicated service lines across accounting, payroll, VAT, tax, and CFO support',
  'Realtime dashboards, filings, board packs, and variance reviews every month',
  'Deep MENA expertise with on-ground teams across the GCC and Egypt'
]

const HERO_STATS = [
  { value: 900, suffix: '+', label: 'venture-backed founders supported' },
  { value: 120, suffix: '+', label: 'finance specialists in-house' },
  { value: 12, suffix: '', label: 'active markets across MENA' }
]

const CUSTOMER_LOGOS = ['Hub71', 'YAP', 'Baraka', 'Letswork', 'Sarwa', 'Rain']

const VALUE_PROPS = [
  {
    icon: Layers,
    title: 'Unified operating system',
    description:
      'Accounting, tax, payroll, and CFO services delivered through one control tower engineered for scaling founders.'
  },
  {
    icon: LineChart,
    title: 'Board-ready reporting',
    description:
      'Rolling forecasts, burn dashboards, margin tracking, and investor-ready rituals shipped every month.'
  },
  {
    icon: ShieldCheck,
    title: 'Regulatory-grade compliance',
    description:
      'UAE corporate tax, VAT, ESR, payroll, banking, and entity management handled by local teams who know every regulation.'
  }
]

const PLATFORM_FEATURES = [
  {
    icon: Wallet,
    title: 'Recurring finance service',
    description:
      'Controllers, accountants, tax leads, and CFO partners as an always-on managed service with 24/5 availability.'
  },
  {
    icon: Receipt,
    title: 'Automated bookkeeping',
    description:
      'Bank feeds, AR/AP, expenses, reimbursements, and reconciliations automated through our internal product suite.'
  },
  {
    icon: CalendarCheck2,
    title: 'Regulatory calendar',
    description:
      'Every filing, fee, visa, and renewal tracked, prepped, and submitted before the deadline—no more surprises.'
  },
  {
    icon: BarChart3,
    title: 'Scenario planning',
    description:
      'Rolling forecasts, pricing experiments, runway extensions, and board decks handled by our fractional CFO bench.'
  }
]

const SERVICE_PILLARS = [
  {
    icon: Building2,
    title: 'Accounting & Reporting',
    description:
      'Management reports, board packs, audit prep, AR/AP, and policy design built for venture-backed operators.'
  },
  {
    icon: ShieldCheck,
    title: 'Tax, VAT & Compliance',
    description:
      'Corporate tax, VAT, ESR, payroll, visas, and entity management run by specialists who live and breathe UAE laws.'
  },
  {
    icon: Rocket,
    title: 'Fractional CFO & Strategy',
    description:
      'Fundraising narratives, investor updates, pricing strategy, KPI stewardship, and operating cadences on autopilot.'
  }
]

const OPERATING_STACK = [
  {
    title: 'Digitize week',
    metric: 'Day 0 - 7',
    description:
      'We ingest your ledgers, banking, payroll, equity, and policy stack while building secure automations and approvals.'
  },
  {
    title: 'Insight week',
    metric: 'Day 8 - 21',
    description:
      'Clean books, dashboards, and compliance trackers go live. Your managed service walks the leadership team through the first operating review.'
  },
  {
    title: 'Command center',
    metric: 'Day 22+',
    description:
      'Monthly board-ready rituals, scenario planning, proactive compliance alerts, and founder support on WhatsApp keep everything in control.'
  }
]

const REFERRAL_POINTS = [
  'Plug in a founder friend to a modern finance service built for the region.',
  'Earn AED 2,500 for every company that signs up—paid within 48 hours of onboarding.',
  'Your referral gets white-glove onboarding, lifetime discounts, and a team tailored to their business.'
]

export default function Home() {
  useEffect(() => {
    const container = document.getElementById('zf_div_jQBxaOyXvB5vbVEwHYzgDthNbYVadDVpRDKRFkkD_Mo')

    if (container && container.querySelector('iframe')) {
      return
    }

    const loadForm = () => {
      try {
        const iframe = document.createElement('iframe')
        const ifrmSrc =
          'https://forms.zohopublic.com/finanshelsllc/form/GetYourFriendAJob/formperma/jQBxaOyXvB5vbVEwHYzgDthNbYVadDVpRDKRFkkD_Mo?zf_rszfm=1'

        iframe.src = ifrmSrc
        iframe.style.border = 'none'
        iframe.style.height = '758px'
        iframe.style.width = '100%'
        iframe.style.transition = 'all 0.5s ease'
        iframe.setAttribute('aria-label', 'Get Your Friend A Job')

        const target = document.getElementById('zf_div_jQBxaOyXvB5vbVEwHYzgDthNbYVadDVpRDKRFkkD_Mo')
        if (target) {
          target.innerHTML = ''
          target.appendChild(iframe)
        }

        const handleMessage = (event) => {
          const evntData = event.data
          if (evntData && evntData.constructor === String) {
            const zf_ifrm_data = evntData.split('|')
            if (zf_ifrm_data.length === 2 || zf_ifrm_data.length === 3) {
              const zf_perma = zf_ifrm_data[0]
              const zf_ifrm_ht_nw = parseInt(zf_ifrm_data[1], 10) + 15 + 'px'
              const currentContainer = document.getElementById(
                'zf_div_jQBxaOyXvB5vbVEwHYzgDthNbYVadDVpRDKRFkkD_Mo'
              )
              if (currentContainer) {
                const iframeEl = currentContainer.getElementsByTagName('iframe')[0]
                if (iframeEl && iframeEl.src.includes('formperma') && iframeEl.src.includes(zf_perma)) {
                  const prevIframeHeight = iframeEl.style.height
                  if (prevIframeHeight !== zf_ifrm_ht_nw) {
                    iframeEl.style.height = zf_ifrm_ht_nw
                  }
                }
              }
            }
          }
        }

        window.addEventListener('message', handleMessage)

        return () => {
          window.removeEventListener('message', handleMessage)
        }
      } catch (e) {
        console.error('Error loading Zoho form:', e)
      }
    }

    const cleanup = loadForm()

    return () => {
      if (cleanup) cleanup()
      const target = document.getElementById('zf_div_jQBxaOyXvB5vbVEwHYzgDthNbYVadDVpRDKRFkkD_Mo')
      if (target) {
        target.innerHTML = ''
      }
    }
  }, [])

  return (
    <div className="bg-white text-slate-900">
      <section className="relative overflow-hidden bg-slate-950 text-white pt-32 pb-24 px-6 sm:px-8 lg:px-12">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(241,102,16,0.18),_transparent_60%)]"></div>
          <div className="absolute -top-24 -right-24 w-[480px] h-[480px] bg-[#f16610]/20 blur-[140px] rounded-full"></div>
          <div className="absolute -bottom-32 -left-16 w-[360px] h-[360px] bg-[#ff8a3c]/20 blur-[160px] rounded-full"></div>
          <div className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(120deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:180px_180px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <AnimatedSection animation="fade-down">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/15 bg-white/5 text-sm uppercase tracking-[0.2em]">
                  <Sparkles className="text-[#ffd19b]" size={16} />
                  finanshels • built in dubai for scaling founders
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-right" delay={50}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-balance">
                  One financial operating system for{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f16610] via-[#ff8a3c] to-[#ffd19b]">
                    MENA scale-ups
                  </span>
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl">
                  Finanshels pairs elite finance talent with powerful automation so founders can run accounting, tax,
                  payroll, CFO, and compliance from one control center. We obsess over clarity so you can obsess over
                  growth.
                </p>
              </AnimatedSection>

              <AnimatedSection animation="fade-right" delay={100}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    as="a"
                    href="mailto:hello@finanshels.com"
                    size="lg"
                    className="shadow-[#f16610]/40"
                  >
                    Book a working session
                    <ArrowRight size={20} className="ml-2" />
                  </Button>
                  <Button
                    as={Link}
                    to="/services"
                    size="lg"
                    variant="ghost"
                    className="border border-white/30 text-white hover:bg-white/10 hover:text-white"
                  >
                    Explore services
                  </Button>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-right" delay={150}>
                <ul className="space-y-3 mt-8">
                  {HERO_BULLETS.map((item, index) => (
                    <li key={item} className="flex items-start gap-3 text-lg text-white/80">
                      <CheckCircle2 className="text-[#ffd19b] mt-1" size={22} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={200}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-10">
                  {HERO_STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur p-5"
                    >
                      <div className="text-3xl font-semibold">
                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                      </div>
                      <p className="text-sm text-white/60 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <AnimatedSection animation="fade-left">
                <FloatingCard className="bg-white/10 border-white/15 text-white shadow-2xl">
                  <div className="p-8 space-y-5">
                    <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-white/70">
                      <Users2 size={18} />
                      finance service
                    </div>
                    <h3 className="text-2xl font-semibold leading-tight">
                      Dedicated controllers, tax experts, payroll leads, and CFO partners for your business.
                    </h3>
                    <div className="space-y-3 text-white/80">
                      <div className="flex items-center gap-3">
                        <Target size={18} className="text-[#ffd19b]" />
                        <span>Industry-specific workflows for SaaS, fintech, retail, and services</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe2 size={18} className="text-[#ffd19b]" />
                        <span>Support across UAE, KSA, Qatar, Bahrain, Oman, Kuwait, and Egypt</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <ShieldCheck size={18} className="text-[#ffd19b]" />
                        <span>Controls, policies, and approvals embedded from day one</span>
                      </div>
                    </div>
                  </div>
                </FloatingCard>
              </AnimatedSection>
              <AnimatedSection animation="fade-left" delay={150}>
                <Card className="bg-white/95 border-white/20 shadow-2xl backdrop-blur rounded-3xl">
                  <div className="p-8 space-y-4">
                    <p className="text-sm font-semibold text-[#f16610] uppercase tracking-[0.3em]">
                      the finanshels cadence
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-4xl font-bold text-slate-900">24 hrs</p>
                        <p className="text-slate-500 text-sm font-medium">to spin up your workspace</p>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-bold text-slate-900">30 days</p>
                        <p className="text-slate-500 text-sm font-medium">to run investor-ready rituals</p>
                      </div>
                    </div>
                    <p className="text-slate-600">
                      We plug into your banks, ERPs, payroll, and spend tooling to build the most complete picture of your
                      business finances.
                    </p>
                  </div>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-8 lg:px-12 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500 text-center mb-10">
            trusted by category-defining teams
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-slate-400 text-sm font-semibold uppercase tracking-[0.4em]">
            {CUSTOMER_LOGOS.map((logo) => (
              <div key={logo} className="py-4 border border-slate-100 rounded-2xl">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-[#fff8f2]">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <AnimatedSection animation="fade-down">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">why finanshels</p>
          </AnimatedSection>
          <AnimatedSection animation="fade-down" delay={80}>
            <h2 className="text-4xl sm:text-5xl font-semibold text-balance">
              Finance clarity built for ambitious MENA operators
            </h2>
          </AnimatedSection>
          <AnimatedSection animation="fade-down" delay={160}>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We mix deep local expertise with a modern operating system so you never worry about compliance, reporting,
              or investor conversations again.
            </p>
          </AnimatedSection>
        </div>

        <div className="max-w-6xl mx-auto mt-14 grid gap-6 md:grid-cols-3">
          {VALUE_PROPS.map((item) => (
            <AnimatedSection key={item.title} animation="fade-up">
              <Card className="h-full border-2 border-[#ffe1cc] bg-white/80 hover:-translate-y-1 hover:shadow-xl transition-all">
                <div className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#fff2e7] text-[#f16610] flex items-center justify-center">
                    <item.icon size={26} />
                  </div>
                  <h3 className="text-2xl font-semibold">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
          <AnimatedSection animation="fade-right" className="space-y-6">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">
              the finanshels platform
            </p>
            <h2 className="text-4xl font-semibold leading-tight">
              One finance stack powering accounting, tax, payroll, and strategy
            </h2>
            <p className="text-lg text-slate-600">
              We pair technology with people. Data flows from your banks, ERP, and SaaS tools into our command center to
              give you realtime control, automated compliance, and a finance partner who lives inside your business.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-1.5 rounded-full bg-[#fff2e7] text-[#f16610] text-sm font-semibold">
                Live dashboards
              </span>
              <span className="px-4 py-1.5 rounded-full bg-[#fff2e7] text-[#f16610] text-sm font-semibold">
                WhatsApp support
              </span>
              <span className="px-4 py-1.5 rounded-full bg-[#fff2e7] text-[#f16610] text-sm font-semibold">
                Investor rituals
              </span>
            </div>
          </AnimatedSection>

          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            {PLATFORM_FEATURES.map((feature, index) => (
              <AnimatedSection key={feature.title} animation="fade-up" delay={index * 60}>
                <Card className="h-full border border-slate-100 hover:border-[#f16610]/30 hover:shadow-xl transition-all">
                  <div className="p-8 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#fff4ec] text-[#f16610] flex items-center justify-center">
                      <feature.icon size={26} />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <AnimatedSection animation="fade-right">
              <p className="text-sm uppercase tracking-[0.4em] text-white/60 font-semibold">services</p>
              <h2 className="text-4xl font-semibold mt-4">Teams built for every layer of finance</h2>
              <p className="text-lg text-white/70 mt-4 max-w-2xl">
                Founders plug into one partner and get the firepower of an entire finance department backed by product,
                data, and operators who have built inside the region&apos;s leading companies.
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-left">
              <Button
                as="a"
                href="mailto:hello@finanshels.com"
                variant="outline"
                className="border-white/50 text-white hover:border-white"
              >
                Design my finance service
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </AnimatedSection>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {SERVICE_PILLARS.map((pillar) => (
              <AnimatedSection key={pillar.title} animation="fade-up">
                <Card className="h-full bg-white/5 border border-white/10 backdrop-blur">
                  <div className="p-8 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                      <pillar.icon size={28} />
                    </div>
                    <h3 className="text-2xl font-semibold">{pillar.title}</h3>
                    <p className="text-white/70">{pillar.description}</p>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          <AnimatedSection animation="fade-right">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">playbook</p>
            <h2 className="text-4xl font-semibold mt-4">Clarity in 30 days</h2>
            <p className="text-lg text-slate-600 mt-4">
              We move with urgency because founders cannot wait. Your team ships clarity in weeks, not quarters, and then
              keeps the cadence forever.
            </p>
            <div className="mt-10 space-y-6">
              {OPERATING_STACK.map((step) => (
                <div key={step.title} className="border-l-4 border-[#f16610] pl-6">
                  <p className="text-sm uppercase tracking-[0.4em] text-slate-500">{step.metric}</p>
                  <h3 className="text-2xl font-semibold mt-2">{step.title}</h3>
                  <p className="text-slate-600 mt-2">{step.description}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-left">
            <Card className="h-full border-2 border-[#ffe1cc] bg-[#fffaf5]">
              <div className="p-10 space-y-8">
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">
                    operating cadence
                  </p>
                  <h3 className="text-3xl font-semibold mt-4">What founders experience</h3>
                </div>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-[#f16610] font-bold">
                      01
                    </div>
                    <div>
                      <p className="font-semibold">WhatsApp line to your team</p>
                      <p className="text-slate-600 text-sm mt-1">
                        Controllers, tax advisors, payroll managers, and CFO partners available on-demand.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-[#f16610] font-bold">
                      02
                    </div>
                    <div>
                      <p className="font-semibold">Monthly operating review</p>
                      <p className="text-slate-600 text-sm mt-1">
                        Burn, runway, CAC/LTV, margins, and compliance checklist benchmarked against the best companies.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-[#f16610] font-bold">
                      03
                    </div>
                    <div>
                      <p className="font-semibold">Board, audit, and fundraising kit</p>
                      <p className="text-slate-600 text-sm mt-1">
                        Board decks, investor updates, diligence rooms, and audit requests prepped before you even ask.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-[#fff4ec]">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection animation="fade-down">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold text-center">
              what our team says
            </p>
            <h2 className="text-4xl font-semibold text-center mt-4">Culture built on radical ownership</h2>
            <p className="text-lg text-slate-600 text-center max-w-3xl mx-auto mt-4">
              We obsess over people as much as we obsess over customers. Hear from the builders behind Finanshels.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {TESTIMONIALS.slice(0, 3).map((testimonial, index) => (
              <AnimatedSection key={testimonial.name} animation="fade-up" delay={index * 80}>
                <TestimonialCard testimonial={testimonial} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection animation="fade-down">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold text-center">
              leadership
            </p>
            <h2 className="text-4xl font-semibold text-center mt-4">People building the finance OS</h2>
            <p className="text-lg text-slate-600 text-center max-w-3xl mx-auto mt-4">
              Operators who have scaled finance, operations, and technology teams across MENA lead every engagement.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {LEADERSHIP_TEAM.slice(0, 6).map((leader, index) => (
              <AnimatedSection key={leader.name} animation="fade-up" delay={index * 60}>
                <LeadershipCard leader={leader} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection animation="fade-down">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold text-center">
              how we work
            </p>
            <h2 className="text-4xl font-semibold text-center mt-4">Values that make Finanshels unstoppable</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {COMPANY_VALUES.map((value, index) => (
              <AnimatedSection key={value.title} animation="fade-up" delay={index * 60}>
                <Card className="h-full border border-slate-100 bg-white">
                  <div className="p-8 space-y-3">
                    <div className="text-3xl">{value.icon}</div>
                    <h3 className="text-2xl font-semibold">{value.title}</h3>
                    <p className="text-slate-600">{value.description}</p>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          <AnimatedSection animation="fade-right">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">refer a founder</p>
            <h2 className="text-4xl font-semibold mt-4">Help your friends plug into a world-class finance service</h2>
            <p className="text-lg text-slate-600 mt-4">
              Finanshels has scaled to a 120+ person finance powerhouse because operators like you keep referring
              builders who deserve better finance.
            </p>
            <ul className="mt-6 space-y-4">
              {REFERRAL_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="text-[#f16610] mt-1" size={22} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection animation="fade-left">
            <div className="rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-brand text-white p-6">
                <p className="text-sm uppercase tracking-[0.4em] font-semibold">submit a referral</p>
                <h3 className="text-2xl font-semibold mt-2">We&apos;ll take care of the rest</h3>
              </div>
              <div className="p-6 bg-white">
                <div id="zf_div_jQBxaOyXvB5vbVEwHYzgDthNbYVadDVpRDKRFkkD_Mo" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-slate-950 text-white">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <AnimatedSection animation="fade-down">
            <p className="text-sm uppercase tracking-[0.4em] text-white/60 font-semibold">ready?</p>
            <h2 className="text-4xl sm:text-5xl font-semibold">
              Build a finance function worthy of your ambition
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto mt-4">
              Bring Finanshels into your operating room and unlock an unfair advantage in accounting, compliance, and
              strategic finance.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={120}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button as="a" href="mailto:hello@finanshels.com" size="lg">
                Talk to a finance lead
                <ArrowRight size={20} className="ml-2" />
              </Button>
              <Button
                as={Link}
                to="/customers"
                size="lg"
                variant="ghost"
                className="border border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                See customer stories
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
