import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  AlertTriangle,
  Building2,
  MessageSquare,
} from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import TestimonialCarousel from '../components/TestimonialCarousel'
import { TESTIMONIALS } from '../data/team'

const SECTORS = [
  { tag: 'DNFBP', title: 'Real Estate', desc: 'Brokers, developers & agencies handling AED 55K+ cash deals must file DPMSR/REAR via goAML.' },
  { tag: 'DPMS', title: 'Jewellers & Precious Metals', desc: 'Dealers in gold, diamonds & precious stones above AED 55K thresholds — full KYC + STR/SAR filings.' },
  { tag: 'VASP', title: 'Crypto & Virtual Assets', desc: 'VASPs licensed by VARA, ADGM or DFSA — wallet screening, travel rule & on-chain risk monitoring.' },
  { tag: 'LEGAL', title: 'Law Firms & Notaries', desc: 'Independent legal professionals handling client funds, real estate or corporate structuring.' },
  { tag: 'AUDIT', title: 'Auditors & Accountants', desc: 'Tax consultants, bookkeepers & audit firms registered with MOE & FTA.' },
  { tag: 'TCSP', title: 'Trust & Corporate Services', desc: 'Company formation, nominee director and trust services across mainland & free zones.' },
]

const SERVICES_INCLUDED = [
  { title: 'goAML Registration', desc: 'Full registration on UAE FIU\'s goAML portal — typically completed in 3–5 working days.' },
  { title: 'Entity Risk Assessment', desc: 'FATF-aligned business-wide risk assessment with documented controls and ratings.' },
  { title: 'AML/CFT Policy & Procedures', desc: 'Custom policy manual, KYC procedures and internal controls aligned to your sector.' },
  { title: 'KYC, Sanctions & PEP Screening', desc: 'Live screening of customers against UN, OFAC, EU & UAE local terror lists.' },
  { title: 'Transaction Monitoring', desc: 'Weekly transaction reviews, rule-based alerts and red-flag triage.' },
  { title: 'FIU Reporting', desc: 'STR, SAR, DPMSR, REAR, FFR and PNMR filings on goAML — fully managed.' },
  { title: 'Staff Training & Certification', desc: 'Annual AML training for your team with certificates accepted in regulator audits.' },
  { title: 'Inspection & Audit Support', desc: 'We sit beside you during MOE inspections and prepare all evidence files.' },
]

const PRICING_TIERS = [
  {
    name: 'Starter',
    desc: 'Small DNFBPs with up to 25 clients',
    price: 'AED 3,499',
    period: '/mo',
    popular: false,
    features: [
      '0–25 clients',
      'goAML Registration',
      'Entity Risk Assessment',
      'AML/CFT Policy & Controls',
      'EOCN Subscription',
      'FIU Reporting (STR/SAR)',
      'Sanction Screening',
    ],
    cta: 'Get Started',
    href: 'https://contact-finanshels.zohobookings.com/#/aml-consultation',
  },
  {
    name: 'Growth',
    desc: 'Most popular for real estate & jewellers',
    price: 'AED 5,999',
    period: '/mo',
    popular: true,
    features: [
      'Up to 100 clients',
      'Everything in Starter',
      'Weekly transaction monitoring',
      'AML software setup included',
      'Quarterly compliance reports',
      'Annual policy review',
      'Priority WhatsApp support',
    ],
    cta: 'Get Started',
    href: 'https://contact-finanshels.zohobookings.com/#/aml-consultation',
  },
  {
    name: 'Scale',
    desc: 'High-volume crypto, gold & TCSPs',
    price: 'AED 9,999',
    period: '/mo',
    popular: false,
    features: [
      'Up to 500 clients',
      'Everything in Growth',
      'Dedicated MLRO support',
      'Internal audit report',
      'Inspection & survey assistance',
      'Up to 10 staff trainings',
      '5-year record keeping',
    ],
    cta: 'Get Started',
    href: 'https://contact-finanshels.zohobookings.com/#/aml-consultation',
  },
  {
    name: 'Enterprise',
    desc: 'Banks, exchanges & VASPs',
    price: 'Custom',
    period: '',
    popular: false,
    features: [
      'Unlimited clients & screenings',
      'On-site MLRO option',
      'Custom rule engine setup',
      'API & ERP integration',
      'External audit (10K–25K AED)',
      '24/7 incident response',
      'Board-level reporting',
    ],
    cta: 'Talk to Sales',
    href: 'https://contact-finanshels.zohobookings.com/#/aml-consultation',
  },
]

const PROCESS_STEPS = [
  { day: 'DAY 1', title: 'Free 30-min discovery call', desc: 'We map your AML obligations against your licence, sector and client base.' },
  { day: 'DAY 2–5', title: 'goAML registration & risk assessment', desc: 'We register you on the FIU portal and run a FATF-aligned business risk assessment.' },
  { day: 'DAY 6–7', title: 'Policies, controls & staff training', desc: 'Custom AML/CFT manual, KYC procedures and certified team training delivered.' },
  { day: 'CONTINUOUS', title: 'Ongoing monitoring & FIU reporting', desc: 'We file STRs, SARs, DPMSR & REAR every month and stand by you in inspections.' },
]

const FAQS = [
  {
    question: 'What is goAML and do I really need to register?',
    answer: 'goAML is the UAE Financial Intelligence Unit\'s official portal for AML/CFT reporting. Registration is mandatory for all DNFBPs — including real estate brokers, dealers in precious metals, auditors, lawyers, corporate service providers and virtual asset service providers. Operating without goAML registration carries fines from AED 50,000 up to AED 5,000,000 per breach.',
  },
  {
    question: 'Do you provide an MLRO if we do not have one?',
    answer: 'Yes. We can act as your outsourced Money Laundering Reporting Officer (MLRO) or assign a dedicated compliance officer to your account. Our MLROs are UAE-licensed, CAMS-certified professionals who take on the regulatory accountability role so your team does not have to.',
  },
  {
    question: 'What does AML compliance cost in the UAE?',
    answer: 'Our packages start at AED 3,499/month for small DNFBPs with up to 25 clients, covering goAML registration, risk assessment, policies, FIU reporting and sanction screening. A standalone goAML registration is available at AED 499. We provide a fixed monthly fee with no per-filing surprises.',
  },
  {
    question: 'Will you support us during MOE inspections?',
    answer: 'Absolutely. We provide inspection readiness assessments before any visit, prepare your full evidence file, and sit alongside your team during MOE/FIU inspection interviews. Our clients on the Growth and Scale plans have a 100% pass rate in inspections we have supported.',
  },
  {
    question: 'My business has never had an MOE inspection. Do I really need to worry?',
    answer: 'Inspection frequency has increased significantly since 2022, particularly in real estate, accounting, and precious metals. The question is not whether you will be inspected — it is whether you will be ready when you are. The cost of compliance setup is a small fraction of the minimum penalty for non-compliance.',
  },
  {
    question: 'How often must our AML policy be updated?',
    answer: 'At minimum annually, and whenever there is a material change to your business or a change in UAE AML regulations. Policies that have not been updated since before the 2023 and 2024 MOE guidance updates are likely non-compliant today.',
  },
]

export default function AmlPage() {
  return (
    <div className="bg-[#fffdfb] text-slate-900 overflow-hidden">
      {/* HERO */}
      <section className="relative pt-32 pb-20 px-6 sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-[#fef3eb] via-[#fffaf3] to-transparent" />
          <div className="absolute -top-20 -left-32 w-[420px] h-[420px] rounded-full bg-[#f16610]/15 blur-[120px]" />
          <div className="absolute top-40 -right-20 w-[460px] h-[460px] rounded-full bg-[#7e8bff]/20 blur-[140px] animate-pulse-slow" />
        </div>
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-down">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f16610]/30 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#f16610]">UAE FIU · goAML · MOE Registered</span>
            </div>
            <h1 className="text-[clamp(2.2rem,5vw,3.75rem)] font-semibold leading-[1.06] tracking-tight max-w-4xl">
              AML Compliance in the UAE,{' '}
              <span className="text-[#f16610]">done-for-you in 7 days.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl">
              From <strong>goAML registration</strong> and <strong>risk assessment</strong> to <strong>FIU reporting</strong> and staff training — Finanshels handles your end-to-end Anti-Money Laundering obligations so you avoid penalties up to <strong>AED 5,000,000</strong>.
            </p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
              {[
                { value: '6,000+', label: 'Businesses protected' },
                { value: '7 days', label: 'Average to compliance' },
                { value: '100%', label: 'Inspection pass rate' },
                { value: 'AED 499', label: 'goAML registration' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/80 border border-slate-100 px-4 py-4 shadow-sm">
                  <p className="text-2xl font-semibold text-[#f16610]">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://contact-finanshels.zohobookings.com/#/aml-consultation"
                className="group inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#f16610]/30 hover:-translate-y-0.5 hover:shadow-xl transition-all"
              >
                Book Free Consultation
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://api.whatsapp.com/send/?phone=97145457841&text=Hi+I%27d+like+to+get+started+with+AML+compliance."
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-900 bg-white px-6 py-3.5 font-semibold text-slate-900 hover:bg-slate-900 hover:text-white transition"
              >
                <MessageSquare size={18} /> Chat on WhatsApp
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* WHO MUST COMPLY */}
      <section className="px-6 sm:px-10 lg:px-16 py-16 bg-white">
        <div className="max-w-6xl mx-auto space-y-10">
          <AnimatedSection animation="fade-up">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-700">Who must comply</span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">Built for UAE&apos;s regulated industries</h2>
              <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
                If you operate in any of these sectors, AML registration with goAML and ongoing FIU reporting is <strong>mandatory by law</strong>.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTORS.map((sector, i) => (
              <AnimatedSection key={sector.title} animation="fade-up" delay={i * 60}>
                <div className="h-full rounded-2xl border border-slate-100 bg-white p-5 hover:border-[#f16610]/30 hover:shadow-md transition-all">
                  <span className="inline-block rounded-full bg-[#fff4ec] text-[#f16610] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 mb-3">{sector.tag}</span>
                  <h3 className="font-semibold text-slate-900 mb-1.5">{sector.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{sector.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* PENALTY BANNER */}
      <section className="px-6 sm:px-10 lg:px-16 py-16">
        <AnimatedSection animation="fade-up">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[44px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-10 sm:p-14 text-white">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#f16610]/30 blur-[120px]" />
            <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#7e8bff]/30 blur-[140px]" />
            <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={20} className="text-amber-400" />
                  <span className="text-xs uppercase tracking-[0.3em] text-amber-400 font-semibold">The cost of non-compliance</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">One missed STR can cost you <span className="text-[#ff8a3c]">AED 5 Million</span></h2>
                <p className="mt-4 text-slate-300 text-lg max-w-xl">
                  Since 2022, the UAE Ministry of Economy has issued <strong>over AED 115 million</strong> in AML fines to DNFBPs — mostly to real estate, gold and corporate-services firms that missed simple deadlines.
                </p>
                <a
                  href="https://contact-finanshels.zohobookings.com/#/aml-consultation"
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-6 py-3.5 font-semibold text-white hover:-translate-y-0.5 transition-all"
                >
                  Protect My Business <ArrowRight size={18} />
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4 min-w-0">
                {[
                  { value: 'AED 50K–5M', label: 'Fines per violation' },
                  { value: 'Licence suspension', label: 'MOE can freeze operations' },
                  { value: 'Public register', label: 'Non-compliant entities named' },
                  { value: 'Criminal liability', label: 'Directors personally liable' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <p className="text-sm font-semibold text-white">{item.value}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* WHAT IS INCLUDED */}
      <section className="px-6 sm:px-10 lg:px-16 py-16 bg-white">
        <div className="max-w-6xl mx-auto space-y-10">
          <AnimatedSection animation="fade-up">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-700">What is included</span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">Everything you need to be 100% AML-compliant</h2>
              <p className="mt-3 text-slate-600">One team, one fixed monthly fee — no hidden costs, no per-filing surprises.</p>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES_INCLUDED.map((item, i) => (
              <AnimatedSection key={item.title} animation="fade-up" delay={i * 60}>
                <div className="h-full rounded-2xl border border-slate-100 bg-white p-5 hover:border-[#f16610]/30 hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#fff4ec] text-[#f16610] flex items-center justify-center mb-3">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="px-6 sm:px-10 lg:px-16 py-20">
        <div className="max-w-6xl mx-auto space-y-10">
          <AnimatedSection animation="fade-up">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-700">Transparent pricing</span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">One fixed fee. Zero compliance worries.</h2>
              <p className="mt-3 text-slate-600">Annual contracts billed monthly. Standalone goAML registration available at AED 499.</p>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRICING_TIERS.map((tier, i) => (
              <AnimatedSection key={tier.name} animation="fade-up" delay={i * 80}>
                <div className={`relative h-full flex flex-col rounded-[28px] border p-6 ${tier.popular ? 'border-[#f16610] bg-gradient-to-b from-[#fff4ec] to-white shadow-[0_30px_60px_-20px_rgba(241,102,16,0.25)]' : 'border-slate-100 bg-white'}`}>
                  {tier.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#f16610] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">Most Popular</span>
                  )}
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">{tier.name}</p>
                  <p className="text-[11px] text-slate-500 mt-1 mb-4">{tier.desc}</p>
                  <div className="mb-5">
                    <span className="text-3xl font-bold text-slate-900">{tier.price}</span>
                    <span className="text-sm text-slate-500">{tier.period}</span>
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={tier.href}
                    className={`mt-auto inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold text-sm transition-all ${tier.popular ? 'bg-[#f16610] text-white hover:-translate-y-0.5 hover:shadow-lg' : 'border-2 border-slate-200 text-slate-700 hover:border-[#f16610] hover:text-[#f16610]'}`}
                  >
                    {tier.cta}
                  </a>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 4-STEP PROCESS */}
      <section className="px-6 sm:px-10 lg:px-16 py-16 bg-white">
        <div className="max-w-6xl mx-auto space-y-10">
          <AnimatedSection animation="fade-up">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                <Zap size={11} /> Our process
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">Compliant in 7 days, protected forever</h2>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-4 gap-5">
            {PROCESS_STEPS.map((step, i) => (
              <AnimatedSection key={step.title} animation="fade-up" delay={i * 80}>
                <div className="relative h-full rounded-2xl border border-slate-100 bg-white p-5 hover:border-[#f16610]/30 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#f16610]">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">{step.day}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 sm:px-10 lg:px-16 py-16">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-700">
                ★★★★★ 4.9 rating · 255 reviews
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">The AML partner UAE&apos;s regulators trust</h2>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={100}>
            <TestimonialCarousel testimonials={TESTIMONIALS.slice(0, 4)} />
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 sm:px-10 lg:px-16 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-700">Frequently asked questions</span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">Common questions answered</h2>
            </div>
          </AnimatedSection>
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, i) => (
              <AnimatedSection key={faq.question} animation="fade-up" delay={i * 60}>
                <details className="group rounded-2xl border border-slate-100 bg-white overflow-hidden hover:border-[#f16610]/30 transition-colors">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer px-6 py-4 font-semibold text-slate-900 list-none select-none">
                    <span>{faq.question}</span>
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-slate-100 group-open:bg-[#fff4ec] text-slate-600 group-open:text-[#f16610] flex items-center justify-center text-sm font-bold transition-colors">
                      <span className="group-open:hidden">+</span>
                      <span className="hidden group-open:inline">−</span>
                    </span>
                  </summary>
                  <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.answer}
                  </div>
                </details>
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
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-xl">
                <p className="text-xs uppercase tracking-[0.4em] text-white/80 font-semibold">Talk to a UAE AML expert in the next 2 hours</p>
                <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
                  Tell us about your business and get a free AML roadmap.
                </h2>
                <p className="mt-4 text-white/85 text-lg">
                  Fixed-fee quote and inspection-readiness checklist included. No obligation.
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <a
                  href="https://contact-finanshels.zohobookings.com/#/aml-consultation"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-semibold text-[#f16610] shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Book a Meeting <ArrowRight size={18} />
                </a>
                <a
                  href="https://api.whatsapp.com/send/?phone=97145457841&text=Hi+I%27d+like+to+get+started+with+AML+compliance."
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/60 bg-white/10 backdrop-blur px-6 py-3.5 font-semibold text-white hover:bg-white/20 transition"
                >
                  <MessageSquare size={18} /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
