import { ArrowRight, Building2, Laptop, ShoppingBag, Banknote, Factory, Sparkles, ShieldCheck } from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

const SOLUTION_SETS = [
  {
    title: 'Venture-backed startups',
    icon: Sparkles,
    description:
      'Finance architecture for SaaS, fintech, marketplaces, and AI companies who demand month-end closes under five days and board-grade visibility.',
    highlights: ['SaaS metrics + ARR dashboards', 'Revenue recognition & consolidation', 'Fundraising data rooms']
  },
  {
    title: 'Retail & e-commerce',
    icon: ShoppingBag,
    description:
      'Multi-location inventory accounting, storefront reconciliations, outlet-level profitability, and VAT compliance across the GCC.',
    highlights: ['POS + payment gateway automation', 'Branch-level P&L', 'Cash management & daily dashboards']
  },
  {
    title: 'Financial services & fintech',
    icon: Banknote,
    description:
      'Reconciliations across PSPs, float accounts, wallets, lending books, and settlement partners with controls ready for regulators.',
    highlights: ['Transaction-level reconciliation', 'Capital adequacy reporting', 'Treasury + liquidity models']
  },
  {
    title: 'Industrial & manufacturing',
    icon: Factory,
    description:
      'Cost accounting, production variance, landed cost modelling, and multi-country payroll for teams spreading across the region.',
    highlights: ['Project & job costing', 'Capex controls & approvals', 'Payroll for plants & offices']
  },
  {
    title: 'Corporate groups',
    icon: Building2,
    description:
      'Group consolidations, holding-company governance, entity management, and strategic finance support for multi-subsidiary structures.',
    highlights: ['Multi-entity consolidations', 'Cash pooling & treasury', 'Internal control frameworks']
  },
  {
    title: 'Digital agencies & services',
    icon: Laptop,
    description:
      'Margin tracking by client, resource allocation, retainer vs. project visibility, and intelligent AR collections.',
    highlights: ['Utilization dashboards', 'Revenue leak prevention', 'Agency-specific KPI tracking']
  }
]

const CASE_STUDIES = [
  {
    company: 'YAP',
    type: 'Fintech',
    result: 'Consolidated 7 banking partners and PSPs into a single reconciliation engine, reducing closing time from 15 days to 4.',
    quote: '“Finanshels behaves like an internal finance and risk team. We now close the books faster than most banks.”',
    author: 'YAP Finance Leadership'
  },
  {
    company: 'Letswork',
    type: 'Marketplace',
    result: 'Centralized outlet-level performance, automated VAT, and spun up Saudi operations with zero compliance slippage.',
    quote: '“They set up our Saudi finance stack in weeks and handle every filing without a single follow-up.”',
    author: 'Omar Al Mheiri, Co-founder'
  },
  {
    company: 'Sarwa',
    type: 'Wealthtech',
    result: 'Scaled from UAE to KSA with a dedicated finance team covering CFO support, payroll, and regulatory reporting.',
    quote: '“The fractional CFO team feels like senior leadership. Zero decks, only outcomes.”',
    author: 'Sarwa Executive Team'
  }
]

export default function Solutions() {
  return (
    <div className="bg-white text-slate-900">
      <section className="pt-36 pb-16 px-6 sm:px-10 lg:px-16 bg-[#fff4ec]">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <AnimatedSection animation="fade-down">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">industry solutions</p>
            <h1 className="text-4xl sm:text-5xl font-semibold">
              Finance clarity for every business model in the region
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Whether you scale software, commerce, manufacturing, or services, Finanshels plugs in workflows tailored to
              your industry nuances—and keeps them future proof.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={80}>
            <Button as="a" href="mailto:hello@finanshels.com" size="lg">
              Request a tailored plan
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {SOLUTION_SETS.map((solution) => (
            <AnimatedSection key={solution.title} animation="fade-up">
              <Card className="h-full border border-slate-100 hover:-translate-y-1 hover:shadow-xl transition-all">
                <div className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#fff0e3] text-[#f16610] flex items-center justify-center">
                    <solution.icon size={26} />
                  </div>
                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-semibold">{solution.title}</h3>
                    <ShieldCheck className="text-[#f16610]" size={18} />
                  </div>
                  <p className="text-slate-600">{solution.description}</p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {solution.highlights.map((item) => (
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

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection animation="fade-right">
            <p className="text-sm uppercase tracking-[0.4em] text-white/70 font-semibold">how we plug in</p>
            <h2 className="text-4xl font-semibold mt-4">A finance command center for each playbook</h2>
            <p className="text-lg text-white/70 mt-6">
              Deep MENA expertise, local teams, and a control tower that connects your banks, ERPs, PSPs, and payroll so
              leadership can trust every metric.
            </p>
            <div className="mt-8 space-y-4">
              {['Realtime dashboards with alerts', 'Dedicated WhatsApp line to your team', 'Board and compliance kits every month'].map(
                (item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#ffd19b] mt-2" />
                    <p className="text-white/80">{item}</p>
                  </div>
                )
              )}
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-left">
            <Card className="bg-white text-slate-900 rounded-3xl overflow-hidden">
              <div className="p-8 space-y-5">
                <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">platform snapshot</p>
                <h3 className="text-3xl font-semibold">Command Center</h3>
                <p className="text-slate-600">
                  Bank feeds, PSP data, ERPs, payroll, and internal approvals flow into a single pane. Finance rituals
                  get documented, assigned, and tracked without spreadsheets.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Data sources automated', value: '40+' },
                    { label: 'Monthly workflows digitized', value: '1200+' },
                    { label: 'Compliance tasks tracked', value: '300+' },
                    { label: 'Industries supported', value: '15+' }
                  ].map((metric) => (
                    <div key={metric.label} className="p-4 rounded-2xl bg-[#fff4ec]">
                      <p className="text-2xl font-semibold text-[#f16610]">{metric.value}</p>
                      <p className="text-sm text-slate-600 mt-1">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-down">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 text-center font-semibold">customer stories</p>
            <h2 className="text-4xl font-semibold text-center mt-4">Proof across the ecosystem</h2>
            <p className="text-lg text-slate-600 text-center max-w-3xl mx-auto mt-3">
              We go deep with each client, acting as an extension of their leadership teams. Here&apos;s how that plays
              out.
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {CASE_STUDIES.map((cs, index) => (
              <AnimatedSection key={cs.company} animation="fade-up" delay={index * 60}>
                <Card className="h-full border border-slate-100">
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{cs.type}</p>
                      <h3 className="text-2xl font-semibold mt-1">{cs.company}</h3>
                    </div>
                    <p className="text-sm text-[#f16610] font-semibold uppercase tracking-[0.3em]">result</p>
                    <p className="text-slate-700">{cs.result}</p>
                    <blockquote className="text-sm italic text-slate-500 border-l-2 border-[#f16610] pl-4">
                      {cs.quote}
                    </blockquote>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{cs.author}</p>
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
            <h2 className="text-4xl font-semibold">Bring Finanshels into your finance stack</h2>
            <p className="text-lg text-white/70">
              Share your industry, stage, and tool stack—we&apos;ll send a bespoke playbook in under 48 hours.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={80}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button as="a" href="mailto:hello@finanshels.com" size="lg">
                Get the playbook
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button as="a" href="https://calendly.com" variant="ghost" size="lg" className="text-white border border-white/30">
                Schedule a walkthrough
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
