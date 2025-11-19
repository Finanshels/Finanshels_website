import { ArrowRight, Target, Users2, Sparkles, Globe2, Building2, Award, Flame, Briefcase, ShieldCheck } from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import { Card } from '../components/ui/Card'
import LeadershipCard from '../components/LeadershipCard'
import { COMPANY_VALUES, LEADERSHIP_TEAM } from '../data/team'

const STORY_POINTS = [
  {
    year: '2019',
    title: 'A frustration turned into a company',
    description:
      'Finanshels began as an internal finance team helping Dubai founders fix messy books, broken payroll, and compliance fire drills.'
  },
  {
    year: '2021',
    title: 'Productising the finance team',
    description:
      'We engineered workflows, automations, and reporting rituals that made finance predictable for dozens of venture-backed teams.'
  },
  {
    year: '2023',
    title: 'Scaling across MENA',
    description:
      'Dedicated teams in UAE, KSA, Qatar, Egypt, and India helped 400+ companies run accounting, tax, and CFO programs with confidence.'
  },
  {
    year: 'Today',
    title: 'Building the finance OS for operators',
    description:
      'More than 120 finance specialists ship investor-ready clarity every month so founders can focus on building category-defining products.'
  }
]

const METRICS = [
  { value: '120+', label: 'finance operators' },
  { value: '12', label: 'active markets' },
  { value: '4.9/5', label: 'avg. customer rating' },
  { value: '30 days', label: 'to run investor rituals' }
]

const PILLARS = [
  {
    icon: Target,
    title: 'Built for operators',
    description: 'Dedicated teams embed into your leadership cadence, not the other way around.'
  },
  {
    icon: Users2,
    title: 'People + product',
    description: 'Humans you trust plus automations that remove repetitive work and errors.'
  },
  {
    icon: Sparkles,
    title: 'Radical ownership',
    description: 'We behave like an in-house team, obsessing over the same metrics you report to investors.'
  }
]

const CULTURE_POINTS = [
  {
    icon: Flame,
    title: 'Speed without chaos',
    description:
      'Decisions are made in hours, not weeks. We bias toward action, document everything, and clean up as we ship.'
  },
  {
    icon: Briefcase,
    title: 'Craft and depth',
    description:
      'Every team spends 20% of its week on learning: new regulations, tooling, and ways to become a better partner.'
  },
  {
    icon: ShieldCheck,
    title: 'Trust and accountability',
    description:
      'We publish commitments, SLAs, and postmortems openly. When we miss, we own it publicly and fix it fast.'
  }
]

const PRESENCE = [
  { title: 'Dubai, UAE', description: 'HQ at in5 Tech. Home to the leadership team and founder teams.' },
  { title: 'Kerala, India', description: 'Finance operations hub and training ground for our teams.' },
  { title: 'Saudi & Qatar', description: 'On-ground controllers ensuring local compliance and approvals.' }
]

export default function About() {
  return (
    <div className="bg-white text-slate-900">
      <section className="pt-36 pb-16 px-6 sm:px-10 lg:px-16 bg-gradient-to-b from-slate-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(241,102,16,0.35),_transparent_55%)]"></div>
        <div className="max-w-6xl mx-auto relative z-10 space-y-8">
          <AnimatedSection animation="fade-down">
            <p className="text-sm uppercase tracking-[0.4em] text-white/70 font-semibold">about finanshels</p>
            <h1 className="text-4xl sm:text-5xl font-semibold mt-4 max-w-3xl leading-tight">
              Finanshels is the financial operating system powering ambitious MENA teams.
            </h1>
            <p className="text-lg text-white/80 max-w-3xl mt-6">
              We are accountants, controllers, tax leads, payroll experts, and CFO partners who live inside your business.
              We obsess over numbers so founders can obsess over product, customers, and expansion.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={80}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {METRICS.map((metric) => (
                <Card key={metric.label} className="bg-white/10 border-white/20 text-center p-6 rounded-3xl">
                  <p className="text-3xl font-semibold">{metric.value}</p>
                  <p className="text-sm text-white/70 mt-1 uppercase tracking-wide">{metric.label}</p>
                </Card>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">
          <AnimatedSection animation="fade-right" className="space-y-5">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">our edge</p>
            <h2 className="text-4xl font-semibold">We are a finance company that behaves like a product team</h2>
            <p className="text-lg text-slate-600">
              Finanshels wasn’t born in a boardroom. It was built by operators who were tired of broken books, delayed
              filings, and finance teams who never had the full context. We built teams that run every layer of finance and
              feed dashboards that leadership actually uses.
            </p>
          </AnimatedSection>
          <div className="lg:col-span-2 grid sm:grid-cols-3 gap-4">
            {PILLARS.map((pillar, index) => (
              <AnimatedSection key={pillar.title} animation="fade-up" delay={index * 80}>
                <Card className="h-full border border-slate-100 rounded-3xl">
                  <div className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#fff2e7] text-[#f16610] flex items-center justify-center">
                      <pillar.icon size={20} />
                    </div>
                    <h3 className="text-xl font-semibold">{pillar.title}</h3>
                    <p className="text-sm text-slate-600">{pillar.description}</p>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-[#fff8f2]">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-down">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold text-center">our story</p>
            <h2 className="text-4xl font-semibold text-center mt-4">Our journey from finance team to finance OS</h2>
          </AnimatedSection>
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {STORY_POINTS.map((story, index) => (
              <AnimatedSection key={story.year} animation="fade-up" delay={index * 80}>
                <Card className="h-full border border-[#ffd7c0] bg-white rounded-3xl">
                  <div className="p-6 space-y-3">
                    <span className="text-xs uppercase tracking-[0.4em] text-[#f16610]/70 font-semibold">
                      {story.year}
                    </span>
                    <h3 className="text-2xl font-semibold">{story.title}</h3>
                    <p className="text-slate-600">{story.description}</p>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-down">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">leadership</p>
                <h2 className="text-4xl font-semibold mt-4">Operators who have built inside the region’s best teams</h2>
              </div>
              <p className="text-base text-slate-600 lg:max-w-sm">
                Our leadership bench spans accounting, tax, HR, technology, and GTM. They coach teams, meet founders weekly,
                and keep the Finanshels bar painfully high.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {LEADERSHIP_TEAM.map((leader, index) => (
              <AnimatedSection key={leader.name} animation="fade-up" delay={index * 60}>
                <LeadershipCard leader={leader} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-[#f4f9ff]">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-down">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold text-center">
              values
            </p>
            <h2 className="text-4xl font-semibold text-center mt-4">Principles that shape how we work</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {COMPANY_VALUES.map((value, index) => (
              <AnimatedSection key={value.title} animation="fade-up" delay={index * 60}>
                <Card className="h-full border border-slate-200 rounded-3xl bg-white">
                  <div className="p-6 space-y-3">
                    <div className="text-3xl">{value.icon}</div>
                    <h3 className="text-xl font-semibold">{value.title}</h3>
                    <p className="text-sm text-slate-600">{value.description}</p>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
          <AnimatedSection animation="fade-right">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">global presence</p>
            <h2 className="text-4xl font-semibold mt-4">Local experts across the GCC + India</h2>
            <p className="text-lg text-slate-600 mt-4">
              Finance is hyper-local. That’s why we have teams on the ground in every country we serve, backed by centres of
              excellence in Dubai and India.
            </p>
            <div className="mt-8 grid gap-4">
              {PRESENCE.map((place) => (
                <Card key={place.title} className="border border-slate-100 rounded-3xl">
                  <div className="p-5">
                    <div className="flex items-center gap-3">
                      <Globe2 className="text-[#f16610]" />
                      <h3 className="font-semibold text-lg">{place.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">{place.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-left">
            <Card className="h-full border border-slate-100 rounded-[32px] bg-gradient-to-br from-[#fff4ec] to-white">
              <div className="p-10 space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">life at finanshels</p>
                  <h3 className="text-3xl font-semibold mt-3">A place for builders who enjoy ownership</h3>
                </div>
                <p className="text-slate-600">
                  We’re assembling a team of finance athletes, operators, and creatives. If you want to design teams,
                  implement automations, or coach founders, Finanshels is your arena.
                </p>
                <div className="space-y-4">
                  {CULTURE_POINTS.map((point) => (
                    <div key={point.title} className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white text-[#f16610] flex items-center justify-center">
                        <point.icon size={20} />
                      </div>
                      <div>
                        <p className="font-semibold">{point.title}</p>
                        <p className="text-sm text-slate-600">{point.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-slate-950 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatedSection animation="fade-down">
            <h2 className="text-4xl font-semibold">Ready to build your finance command center?</h2>
            <p className="text-lg text-white/70 mt-4">
              Bring Finanshels into your operating room. We’ll map your needs, assemble a team, and get you investor-ready
              in 30 days.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={80}>
            <a
              href="mailto:hello@finanshels.com"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-6 py-3 font-semibold text-white hover:bg-[#d85105]"
            >
              Talk to the team
              <ArrowRight size={18} />
            </a>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
