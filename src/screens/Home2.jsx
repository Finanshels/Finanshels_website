import Link from 'next/link'
import { 
  ArrowRight, 
  CheckCircle2, 
  Globe2, 
  Users, 
  TrendingUp, 
  Shield, 
  Clock, 
  BarChart3,
  MessageSquare,
  Zap,
  Building2,
  FileText,
  HelpCircle
} from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import AnimatedCounter from '../components/AnimatedCounter'
import TestimonialCarousel from '../components/TestimonialCarousel'
import { TESTIMONIALS } from '../data/team'

export default function Home2() {
  const problems = [
    "Local accountants who don't talk to each other",
    "Month-end closes that drag on across entities",
    "Tax handled country by country, not centrally",
    "Investors asking for consolidated views you don't have",
    "Cash position unclear unless someone pulls it manually"
  ]

  const benefits = [
    {
      icon: Clock,
      title: "Time back, everywhere",
      description: "Founders reclaim 10+ hours a week by removing follow-ups, reconciliations, and reporting chaos — even across multiple countries."
    },
    {
      icon: Shield,
      title: "Compliance without anxiety",
      description: "VAT, Corporate Tax, payroll, filings, renewals — handled locally, governed centrally. No surprises."
    },
    {
      icon: BarChart3,
      title: "Numbers you can actually use",
      description: "Dashboards and reviews that explain what changed and why, not just raw data."
    },
    {
      icon: TrendingUp,
      title: "Investor-ready by default",
      description: "Clean books, consolidated reporting, board packs, and forecasts that hold up globally."
    }
  ]

  const timeline = [
    {
      title: "Weeks 1–2 — Connect and clean",
      description: "We connect books, banks, payroll, PSPs, and entities. Gaps fixed. Structure put in place."
    },
    {
      title: "Weeks 3–4 — Make it visible",
      description: "Books cleaned. Compliance mapped. Dashboards live. First consolidated review delivered."
    },
    {
      title: "Ongoing — Stay in control",
      description: "Monthly packs, forecasts, variance reviews, and direct access to your pod keep finance steady as you scale."
    }
  ]

  const faqs = [
    {
      question: "How fast can we start?",
      answer: "Most companies see structure and visibility within 3–4 weeks, even with multiple entities."
    },
    {
      question: "Which tools and countries do you support?",
      answer: "We work with Zoho, Xero, QuickBooks, banks, PSPs, and support multi-country setups across key global markets."
    },
    {
      question: "What happens as we add new markets?",
      answer: "That's expected. Your finance pod expands with you."
    },
    {
      question: "What if it's not a fit?",
      answer: "No lock-in. First month is free. Walk away if it doesn't help."
    }
  ]

  return (
    <div className="min-h-screen bg-[#fffdfb]">
      {/* Hero Section */}
      <section className="relative px-6 sm:px-10 lg:px-16 pt-32 pb-24 overflow-hidden bg-gradient-to-b from-[#f7f0ff] via-white to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(241,102,16,0.06),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(241,102,16,0.04),transparent_60%)]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-sm font-semibold text-[#f16610] shadow-sm">
                <Globe2 size={18} />
                Finance as a Service for Global Founders
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.15] tracking-tight max-w-4xl mx-auto">
                Finance as a Service for founders who plan to scale globally
              </h1>
              
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Finance shouldn't slow you down as your company grows across borders.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={100}>
            <div className="mt-12 max-w-3xl mx-auto">
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-8 md:p-12 space-y-6">
                <p className="text-lg text-slate-700 leading-relaxed">
                  If you're building a serious business — in the UAE, Europe, the US, or Asia — finance can't stay fragmented, reactive, or local-only.
                </p>
                <div className="space-y-3 pt-2">
                  <p className="text-base text-slate-900 font-semibold">
                    Regulation is tightening everywhere.
                  </p>
                  <p className="text-base text-slate-900 font-semibold">
                    Investors expect clean, explainable numbers.
                  </p>
                  <p className="text-base text-slate-900 font-semibold">
                    And scaling across entities, countries, and currencies breaks most finance setups.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-200 space-y-3">
                  <p className="text-lg text-slate-900 leading-relaxed">
                    <strong>Finanshels runs accounting, tax, payroll, and finance cadence as one system,</strong> providing one dashboard with the current financial snapshot — so founders can focus on building, not managing back offices.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <div className="mt-12 text-center space-y-3 max-w-2xl mx-auto">
              <p className="text-3xl font-bold text-slate-900 leading-tight">
                We don't replace your ambition.
              </p>
              <p className="text-3xl font-bold text-slate-900 leading-tight">
                We remove the friction underneath it.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={250}>
            <div className="mt-8 text-center">
              <p className="text-base text-slate-600">
                Trusted by 5,000+ companies globally. Operated by 135+ finance specialists across 12 markets.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={300}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:hello@finanshels.com"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#f16610] text-white font-bold text-lg shadow-lg shadow-[#f16610]/30 hover:bg-[#e55a00] transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                Book a Strategy Call
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://wa.me/971507178156?text=Hi%20Team%20Finanshels%2C%20let%E2%80%99s%20talk%20finance."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-slate-300 bg-white text-slate-700 font-bold text-lg hover:border-[#f16610] hover:text-[#f16610] hover:bg-[#fff9f5] transition-all"
              >
                <MessageSquare size={20} />
                WhatsApp Us
              </a>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={400}>
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: 5000, suffix: '+', label: 'Companies trust us' },
                { value: 135, suffix: '+', label: 'Finance specialists' },
                { value: 12, suffix: '', label: 'Countries covered' },
                { value: '24/7', suffix: '', label: 'Support access', isText: true }
              ].map((stat, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="text-4xl font-bold text-[#f16610]">
                    {stat.isText ? stat.value : <AnimatedCounter end={stat.value} duration={2000} />}{stat.suffix}
                  </div>
                  <div className="text-sm text-slate-600 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Switch Section */}
      <section className="px-6 sm:px-10 lg:px-16 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-semibold text-[#f16610]/80">
                <TrendingUp size={16} />
                The quiet revolution
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Why 5,000+ founders moved<br />their finance ops here
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                This shift isn't loud — but it's happening fast.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="space-y-6 text-lg text-slate-700">
                <p className="text-2xl font-bold text-slate-900">Founders who scale early are standardising finance before things get complex.</p>
                <p>
                  They're done with patchwork accountants, local silos, and delayed closes.
                </p>
                <p className="text-xl font-semibold text-slate-900">
                  They want:
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div className="bg-white rounded-[32px] border border-slate-100 p-10 space-y-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <p className="text-2xl font-bold text-slate-900">The new standard:</p>
                <div className="space-y-4">
                  {[
                    { icon: Users, text: "One finance owner" },
                    { icon: Clock, text: "One reporting rhythm" },
                    { icon: Globe2, text: "One system that works across countries" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4 bg-[#fffdfb] rounded-2xl p-4 border border-slate-100">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                        <item.icon size={22} className="text-[#f16610]" />
                      </div>
                      <p className="text-lg font-semibold leading-snug text-slate-900">{item.text}</p>
                    </div>
                  ))}
                </div>
                <p className="text-lg pt-4 text-slate-700">
                  That's why teams from startups to multi-entity groups are moving their finance to Finanshels.
                </p>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection animation="fade-up" delay={300}>
            <div className="mt-16 text-center">
              <div className="inline-block bg-white rounded-3xl border border-slate-100 p-8 max-w-2xl shadow-[0_15px_40px_rgba(15,23,42,0.08)]">
                <p className="text-2xl font-bold text-slate-900 mb-4">
                  Momentum matters:
                </p>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Waiting usually costs more than moving early.
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={400}>
            <div className="mt-10 text-center">
              <a
                href="mailto:hello@finanshels.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-[#f16610] text-[#f16610] font-bold hover:bg-[#f16610] hover:text-white transition-all hover:-translate-y-0.5"
              >
                Check Availability
                <ArrowRight size={18} />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Finance Roadmap CTA */}
      <section className="px-6 sm:px-10 lg:px-16 py-24 bg-[#fffdfb] relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-semibold text-[#f16610]/80">
                <FileText size={16} />
                Free Finance Assessment
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900">
                Get a clear finance roadmap<br />
                <span className="text-slate-600">(free)</span>
              </h2>
              <div className="max-w-3xl mx-auto space-y-4">
                <p className="text-2xl font-semibold text-slate-900">
                  This isn't a demo.
                </p>
                <p className="text-xl font-semibold text-slate-900">
                  And it's not a sales call.
                </p>
                <p className="text-xl leading-relaxed text-slate-600">
                  We look at your current setup — tools, entities, jurisdictions, reporting gaps, and risks — and tell you what's working, what isn't, and what will break as you scale.
                </p>
                <p className="text-lg font-bold bg-white rounded-2xl px-6 py-4 border border-slate-100 inline-block text-slate-900 shadow-sm">
                  You'll leave with a clear plan, whether you work with us or not.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-6">
                {[
                  { icon: Clock, text: 'Response in 48 hours' },
                  { icon: Shield, text: 'Zero commitment required' },
                  { icon: MessageSquare, text: 'WhatsApp-first approach' },
                  { icon: CheckCircle2, text: 'Your data stays private' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-slate-100">
                    <item.icon size={20} className="flex-shrink-0 text-[#f16610]" />
                    <span className="font-semibold text-left text-slate-900">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8">
                <a
                  href="mailto:hello@finanshels.com"
                  className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-[#f16610] font-bold text-xl shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-1"
                >
                  Get My Finance Roadmap
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Problems Section */}
      <section className="px-6 sm:px-10 lg:px-16 py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-semibold text-slate-700">
                <Building2 size={16} />
                The reality check
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                This is what founders everywhere<br />are dealing with
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">Different countries. Same problems.</p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6">
            {problems.map((problem, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 80}>
                <div className="bg-white rounded-3xl border border-slate-100 p-6 hover:border-[#f16610]/40 hover:shadow-lg transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#f16610]/10 flex items-center justify-center mt-1 group-hover:bg-[#f16610]/20 transition-colors">
                      <div className="w-3 h-3 bg-[#f16610] rounded-full" />
                    </div>
                    <p className="text-lg text-slate-700 leading-relaxed font-medium">{problem}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection animation="fade-up" delay={400}>
            <div className="mt-12 text-center max-w-3xl mx-auto">
              <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <p className="text-2xl font-bold mb-4 text-slate-900">Here's the truth:</p>
                <p className="text-xl leading-relaxed text-slate-700">
                  This isn't about working harder or being smarter. It's about having the right infrastructure for the stage you're in.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 sm:px-10 lg:px-16 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-semibold text-[#f16610]/80">
                <Zap size={16} />
                How we work
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                How Finanshels actually works
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                We don't act like an outsourced firm.<br />
                We plug in as your finance function — globally.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                  <p className="text-2xl font-bold mb-4 text-slate-900">You get a dedicated pod:</p>
                  <p className="text-lg text-slate-700 mb-4">controllers, tax leads, payroll, and CFO support working together across jurisdictions.</p>
                  <div className="space-y-3 text-lg">
                    {[
                      'Controllers who know your business',
                      'Tax specialists across jurisdictions',
                      'Payroll experts who never miss a deadline',
                      'CFO support for strategic decisions'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 bg-[#fffdfb] rounded-xl p-3 border border-slate-100">
                        <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5 text-[#f16610]" />
                        <span className="font-semibold text-slate-900">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div className="space-y-8">
                <div>
                  <p className="text-2xl font-bold text-slate-900 mb-4">What that gives you:</p>
                  <div className="space-y-4">
                    {[
                      { icon: Users, title: 'one accountable team', desc: 'No more coordinating between multiple vendors' },
                      { icon: Clock, title: 'one global finance calendar', desc: 'Global sync, local execution' },
                      { icon: BarChart3, title: 'one monthly operating cadence', desc: 'Monthly reviews that actually help' },
                      { icon: MessageSquare, title: 'one place to get answers, fast', desc: '' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-slate-100 hover:border-[#f16610]/40 transition-colors">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                          <item.icon className="text-[#f16610]" size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-lg">{item.title}</p>
                          {item.desc && <p className="text-slate-600">{item.desc}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <p className="text-xl font-bold text-slate-900">
                    Finance becomes boring. Predictable. Reliable.
                  </p>
                  <p className="text-lg text-slate-700 mt-2">That's the point.</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-[#fffdfb]">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Why founders switch to us — and don't go back
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <AnimatedSection key={benefit.title} animation="fade-up" delay={index * 100}>
                <div className="bg-white rounded-3xl border border-slate-100 p-8 h-full hover:border-[#f16610]/40 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center">
                      <benefit.icon className="text-[#f16610]" size={28} />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-slate-900">{benefit.title}</h3>
                      <p className="text-slate-700 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Trusted by 5,000+ companies worldwide
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                From fast-growing startups to multi-entity groups, founders trust Finanshels to run finance properly.
              </p>
              <p className="text-slate-600 font-medium">
                Logos you'll recognise. Founders you can hear from. Operators who've already made the switch.
              </p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={100}>
            <TestimonialCarousel testimonials={TESTIMONIALS} />
          </AnimatedSection>
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="px-6 sm:px-10 lg:px-16 py-24 bg-[#fffdfb]">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-semibold text-slate-700">
                <Clock size={16} />
                Quick onboarding
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                How we get you live<br />(without slowing you down)
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-8">
            {timeline.map((step, index) => (
              <AnimatedSection key={step.title} animation="fade-up" delay={index * 100}>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-[#f16610] text-white font-bold text-2xl flex items-center justify-center shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div className="bg-white rounded-3xl border border-slate-100 p-8 flex-1 hover:border-[#f16610]/40 hover:shadow-lg transition-all">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                    <p className="text-lg text-slate-700 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="px-6 sm:px-10 lg:px-16 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="text-center space-y-8 bg-white rounded-[40px] border border-slate-100 p-12 lg:p-16 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-semibold text-[#f16610]/80">
                <TrendingUp size={16} />
                Transparent pricing
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Pricing that scales with you
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                No hidden fees. No long-term lock-ins.<br />
                Pricing reflects complexity, not hype.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="text-[#f16610]" size={20} />
                  <span className="font-semibold">First month free</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="text-[#f16610]" size={20} />
                  <span className="font-semibold">Money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="text-[#f16610]" size={20} />
                  <span className="font-semibold">Scale up or down as entities and markets grow</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#f16610] text-white font-semibold hover:bg-[#e55a00] transition-all"
                >
                  View Pricing
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="mailto:hello@finanshels.com"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-slate-300 text-slate-700 font-semibold hover:border-[#f16610] hover:text-[#f16610] transition-all"
                >
                  Talk to Sales
                  <MessageSquare size={18} />
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQs */}
      <section className="px-6 sm:px-10 lg:px-16 py-24 bg-[#fffdfb]">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="text-center space-y-4 mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-semibold text-slate-700">
                <HelpCircle size={16} />
                Common questions
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
                Straight answers
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <AnimatedSection key={faq.question} animation="fade-up" delay={index * 80}>
                <div className="bg-white rounded-3xl border border-slate-100 p-8 h-full hover:border-[#f16610]/40 hover:shadow-lg transition-all">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{faq.question}</h3>
                  <p className="text-lg text-slate-700 leading-relaxed">{faq.answer}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Note */}
      <section className="px-6 sm:px-10 lg:px-16 py-24 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="fade-up">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-semibold text-[#f16610]/80">
                  <Users size={16} />
                  From our founder
                </div>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight text-slate-900">
                  A note from the founder
                </h2>
                <div className="space-y-5 text-lg leading-relaxed">
                  <p className="text-slate-600">
                    Global companies don't break because founders lack ambition.
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    They break because finance doesn't keep up with growth.
                  </p>
                  <p className="text-slate-600">
                    Finanshels exists to give founders control early — before complexity turns into drag.
                  </p>
                  <p className="text-slate-600">
                    If you're building something that crosses borders, this is one of those decisions that's easier to make sooner than later.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-2xl font-bold text-slate-900">If you're ready, let's talk.</p>
                  <p className="text-lg text-slate-600 mt-2"></p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={100}>
              <div className="bg-white rounded-3xl border border-slate-100 p-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-[#f16610] flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                      F
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-900">Finanshels Team</p>
                      <p className="text-slate-600">Global Finance Partner</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-6">
                    <a
                      href="mailto:hello@finanshels.com"
                      className="group flex items-center justify-between w-full px-6 py-4 rounded-2xl bg-[#f16610] text-white font-bold text-lg hover:bg-[#e55a00] transition-all hover:-translate-y-0.5 shadow-lg"
                    >
                      <span>Book a Strategy Call</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a
                      href="https://wa.me/971507178156?text=Hi%20Team%20Finanshels%2C%20let%E2%80%99s%20talk%20finance."
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between w-full px-6 py-4 rounded-2xl border-2 border-slate-200 text-slate-900 font-bold text-lg hover:border-[#f16610] hover:text-[#f16610] transition-all"
                    >
                      <span>WhatsApp Us</span>
                      <MessageSquare size={20} />
                    </a>
                  </div>

                  <div className="pt-6 border-t border-slate-200 text-center">
                    <p className="text-sm text-slate-600">
                      Response within 48 hours • No commitment required
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}
