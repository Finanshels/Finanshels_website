import { ArrowRight, Calculator, ShieldCheck, Wallet, Briefcase, Building2, Workflow } from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

const SERVICE_GROUPS = [
  {
    title: 'Accounting & Reporting',
    icon: Calculator,
    description:
      'Monthly bookkeeping, accrual-based ledgers, multi-entity consolidations, AR/AP, and board-ready reporting shipped like clockwork.',
    items: ['Monthly close rituals', 'Variance analysis and commentary', 'Audit preparation and policies']
  },
  {
    title: 'Tax, VAT & Compliance',
    icon: ShieldCheck,
    description:
      'Corporate tax, VAT, ESR, payroll, and regulatory filings executed by teams who live inside UAE regulations every day.',
    items: ['Corporate tax computation & filing', 'VAT registration and returns', 'Economic substance reporting']
  },
  {
    title: 'Payroll & People Finance',
    icon: Wallet,
    description:
      'WPS-compliant payroll, end-of-service, visa renewals, insurance, and HR ops backed by automated approvals and audit trails.',
    items: ['Salary processing & WPS uploads', 'End-of-service automation', 'Visa & PRO coordination']
  },
  {
    title: 'Fractional CFO Office',
    icon: Briefcase,
    description:
      'Fundraising narratives, cash forecasting, KPI stewardship, and pricing experiments guided by a bench of former startup CFOs.',
    items: ['Rolling forecasts & runway models', 'Board & investor updates', 'Pricing & margin diagnostics']
  },
  {
    title: 'Entity Launch & Expansion',
    icon: Building2,
    description:
      'Company formation, multi-entity governance, bank accounts, cap table support, and cross-border compliance as you scale regionally.',
    items: ['Entity advisory & incorporation', 'Banking & treasury set up', 'Cross-border documentation']
  },
  {
    title: 'Automation & Workflow Design',
    icon: Workflow,
    description:
      'Custom workflows across ERPs, expense tools, banks, and dashboards so your leadership team sees truth across every number.',
    items: ['Tooling integration & migration', 'Approval matrices & policies', 'Realtime dashboards & alerts']
  }
]

const DELIVERY_PROCESS = [
  {
    title: 'Discovery & diagnostics',
    description:
      'We audit your existing books, tooling, compliance backlog, and finance rituals to understand real gaps. Zero fluff—only signal.'
  },
  {
    title: 'Team assembly',
    description:
      'Specialists across accounting, tax, payroll, and CFO are assigned to your business. Each team has a single point of accountability.'
  },
  {
    title: 'Execution & rituals',
    description:
      'Monthly cadences with reporting packs, compliance trackers, and WhatsApp updates keep founders and operators in sync.'
  },
  {
    title: 'Scale & optimization',
    description:
      'As you expand into new geos or product lines, we adjust the finance architecture, tooling, and policies to match the ambition.'
  }
]

const METRICS = [
  { label: 'Finance operators in-house', value: '120+' },
  { label: 'MENA markets supported', value: '12' },
  { label: 'Average onboarding time', value: '30 days' },
  { label: 'Customer satisfaction score', value: '4.9/5' }
]

export default function Services() {
  return (
    <div className="bg-white text-slate-900">
      <section className="pt-36 pb-20 px-6 sm:px-10 lg:px-16 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(241,102,16,0.2),_transparent_55%)]" />
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(120deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:200px_200px]" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10 space-y-8 text-center">
          <AnimatedSection animation="fade-down">
            <p className="text-sm uppercase tracking-[0.4em] text-white/70">our services</p>
            <h1 className="text-4xl sm:text-5xl font-semibold mt-4">
              Every layer of finance delivered as a managed service
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto mt-6">
              Finanshels assembles dedicated teams across accounting, tax, payroll, and CFO so you can run a finance
              department built for velocity without the overhead of hiring dozens of specialists.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={100}>
            <Button as="a" href="mailto:hello@finanshels.com" size="lg">
              Design my finance team
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {SERVICE_GROUPS.map((service) => (
            <AnimatedSection key={service.title} animation="fade-up">
              <Card className="h-full border-2 border-[#ffe1cc] bg-white hover:-translate-y-1 hover:shadow-xl transition-all">
                <div className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#fff2e7] text-[#f16610] flex items-center justify-center">
                    <service.icon size={26} />
                  </div>
                  <h3 className="text-2xl font-semibold">{service.title}</h3>
                  <p className="text-slate-600">{service.description}</p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#f16610]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-[#fff4ec]">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-down">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 text-center font-semibold">
              delivery model
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-center mt-4">
              Teams built for founders, operators, and boards
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            {DELIVERY_PROCESS.map((step, index) => (
              <AnimatedSection key={step.title} animation="fade-up" delay={index * 60}>
                <Card className="h-full border border-[#ffd7c0] bg-white">
                  <div className="p-6 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-[0.4em] text-[#f16610]/70">
                      step {index + 1}
                    </span>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-sm text-slate-600">{step.description}</p>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <AnimatedSection animation="fade-down">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">impact</p>
            <h2 className="text-3xl sm:text-4xl font-semibold mt-3">Trusted by the fastest-growing teams in MENA</h2>
            <p className="text-lg text-slate-600 mt-4">
              We obsess over tangible wins: faster closes, cleaner compliance, and the confidence to take bigger bets.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {METRICS.map((metric) => (
              <AnimatedSection key={metric.label} animation="fade-up">
                <Card className="p-6 border border-slate-100">
                  <p className="text-3xl font-semibold text-[#f16610]">{metric.value}</p>
                  <p className="text-sm text-slate-600 mt-2">{metric.label}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-slate-950 text-white">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <AnimatedSection animation="fade-down">
            <h2 className="text-4xl font-semibold">Ready to plug in a global-grade finance team?</h2>
            <p className="text-lg text-white/70 mt-4">
              Share your current finance stack and we&apos;ll design a team, implementation plan, and pricing within 48
              hours.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={80}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button as="a" href="mailto:hello@finanshels.com" size="lg">
                Talk to sales
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button as="a" href="https://wa.me/971507178156" variant="ghost" size="lg" className="text-white border border-white/30">
                WhatsApp our team
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
