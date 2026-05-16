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
    "Your accountant in Dubai and your accountant in London have never spoken.",
    "Month-end takes eight working days because each entity closes on its own clock.",
    "Tax is handled by whoever you found locally. Nobody owns the group position.",
    "An investor asks for a group P&L. You ask Slack who has the latest version.",
    "Group cash is whatever the last person to update the sheet thought it was."
  ]

  const benefits = [
    {
      icon: Clock,
      title: "Roughly ten hours back a week",
      description: "Mostly the ones you spend chasing accountants, reconciling between tools, and re-explaining the same thing to three different vendors."
    },
    {
      icon: Shield,
      title: "VAT, CT, AML, audit prep, statutory filings",
      description: "Filed on time, in every jurisdiction you operate in. You stop being the person who remembers when things are due."
    },
    {
      icon: BarChart3,
      title: "Reports that come with a sentence",
      description: "Every monthly pack has a one-line read on why the numbers moved, so you don't have to call your accountant to interpret them."
    },
    {
      icon: TrendingUp,
      title: "Board packs that don't require a Saturday",
      description: "Clean books and a consolidated view sit on top of one ledger structure. The forecast holds up under questions."
    }
  ]

  const timeline = [
    {
      title: "Weeks 1–2: we get our hands on everything",
      description: "Books, banks, PSPs, payroll, prior filings, entity register. Whatever's broken gets logged. Whatever's missing gets asked for once."
    },
    {
      title: "Weeks 3–4: it starts feeling boring (good boring)",
      description: "Cleaned books, mapped compliance, a working dashboard. You get the first consolidated review and a list of what we want to change next quarter."
    },
    {
      title: "From month two: a rhythm you don't have to run",
      description: "Monthly close on a fixed day. Quarterly forecast review. A pod you can WhatsApp. Filings done before you think about them."
    }
  ]

  const faqs = [
    {
      question: "How long before this actually feels different?",
      answer: "Three to four weeks. The first close on our cadence is usually where founders notice it."
    },
    {
      question: "Which tools do you work with?",
      answer: "Zoho, Xero, QuickBooks, NetSuite for the books, plus your banks, PSPs, and payroll system. If you're already on something, we keep it."
    },
    {
      question: "What happens when we add another entity?",
      answer: "Tell us a week before. The pod absorbs it. The cadence doesn't change."
    },
    {
      question: "What if it's not working?",
      answer: "First month is free and there's no lock-in. If we're not pulling our weight, leave."
    }
  ]

  return (
    <div className="min-h-screen bg-[#fffdfb]">
      {/* Hero Section */}
      <section className="relative px-5 sm:px-10 lg:px-16 pt-24 sm:pt-32 pb-20 sm:pb-24 overflow-hidden bg-gradient-to-b from-[#f7f0ff] via-white to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(241,102,16,0.06),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(241,102,16,0.04),transparent_60%)]" />

        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="max-w-4xl space-y-6 sm:space-y-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[11px] sm:text-xs font-semibold tracking-wide uppercase text-slate-700">
                <Globe2 size={14} className="text-[#f16610]" />
                Finance, tax, audit, CFO — one team
              </div>

              <h1 className="text-[2rem] sm:text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.08] sm:leading-[1.04] lg:leading-[1.02] tracking-[-0.02em]">
                Most finance setups break the year you start scaling.
                <span className="block text-[#f16610] mt-1.5 sm:mt-2">Ours doesn&rsquo;t.</span>
              </h1>

              <p className="text-base sm:text-xl lg:text-2xl text-slate-700 max-w-2xl leading-snug">
                We run your bookkeeping, tax, audit prep, and CFO function as one team. On one cadence. Across every entity you operate.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={150}>
            <div className="mt-10 sm:mt-12 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-10 lg:items-end">
              <div className="space-y-4 text-base sm:text-lg text-slate-700 leading-relaxed border-l-2 border-[#f16610]/30 pl-5 sm:pl-6">
                <p>
                  Around entity number three is where it usually starts. The Dubai books look fine. The UK books look fine. Nobody owns the consolidated view, and month-end takes a week longer than it should.
                </p>
                <p className="text-slate-900 font-medium">
                  We&rsquo;re the team you bring in before that becomes the next quarter&rsquo;s emergency.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-stretch">
                <a
                  href="mailto:contact@finanshels.com"
                  className="group inline-flex w-full sm:w-auto lg:w-full items-center justify-between gap-3 px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-[#f16610] text-white font-semibold text-base shadow-lg shadow-[#f16610]/30 hover:bg-[#e55a00] transition-all hover:-translate-y-0.5"
                >
                  Book a strategy call
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="https://wa.me/971521549572?text=Hi%20Team%20Finanshels%2C%20let%E2%80%99s%20talk%20finance."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full sm:w-auto lg:w-full items-center justify-between gap-3 px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl border border-slate-300 bg-white text-slate-800 font-semibold text-base hover:border-[#f16610] hover:text-[#f16610] hover:bg-[#fff9f5] transition-all"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare size={18} />
                    WhatsApp us
                  </span>
                  <ArrowRight size={16} className="opacity-60" />
                </a>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={300}>
            <div className="mt-16 sm:mt-20 border-t border-slate-200 pt-8 sm:pt-10">
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-5 sm:mb-6">
                Where we are right now
              </p>
              <div className="grid grid-cols-3 gap-3 sm:gap-8 lg:gap-10">
                {[
                  { value: 6000, suffix: '+', label: 'Companies on our books' },
                  { value: 180, suffix: '+', label: 'On the finance team' },
                  { value: 1, suffix: 'B+', prefix: '$', label: 'Value accounted for' }
                ].map((stat, index) => (
                  <div key={index} className="space-y-1 sm:space-y-1.5 min-w-0">
                    <div className="text-[1.5rem] sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight whitespace-nowrap">
                      {stat.prefix}<AnimatedCounter end={stat.value} duration={2000} />{stat.suffix}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 leading-tight">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Switch Section */}
      <section className="px-6 sm:px-10 lg:px-16 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-start">
            <AnimatedSection animation="fade-up">
              <div className="lg:sticky lg:top-24 space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f16610]">
                  Why founders move
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.05] tracking-tight">
                  The kind of switch you make once and never revisit.
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  It usually happens after a bad month-end. Or right before fundraising. Or the first time a tax notice arrives in a country nobody on the team thought about.
                </p>
                <a
                  href="mailto:contact@finanshels.com"
                  className="inline-flex items-center gap-2 text-base font-semibold text-[#f16610] hover:gap-3 transition-all"
                >
                  See if we have a pod for you
                  <ArrowRight size={18} />
                </a>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={150}>
              <div className="space-y-10">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">What changes the day you switch</p>
                  <ol className="space-y-5">
                    {[
                      { n: '01', title: 'One person owns finance again', body: 'Not three vendors who copy-paste each other. A pod that sees every entity and every ledger.' },
                      { n: '02', title: 'Reporting follows a fixed clock', body: 'Close lands on the same working day each month. Forecasts get updated. Variance gets explained.' },
                      { n: '03', title: 'The same system, every market you add', body: 'You don’t rebuild finance every time you incorporate somewhere new. The new entity slots in.' },
                    ].map((item) => (
                      <li key={item.n} className="grid grid-cols-[auto_1fr] gap-5 pb-5 border-b border-slate-100 last:border-0">
                        <span className="text-sm font-semibold text-[#f16610] tabular-nums pt-1">{item.n}</span>
                        <div>
                          <p className="text-xl font-semibold text-slate-900 leading-snug">{item.title}</p>
                          <p className="text-base text-slate-600 mt-1.5 leading-relaxed">{item.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="rounded-2xl bg-[#fff9f5] border border-[#f16610]/15 p-6">
                  <p className="text-base text-slate-800 leading-relaxed">
                    Most teams that move tell us the same thing afterwards: they wish they&rsquo;d done it two quarters earlier.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Finance Roadmap CTA */}
      <section className="px-6 sm:px-10 lg:px-16 py-24 bg-[#fffdfb] relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-semibold text-[#f16610]/80">
                <FileText size={16} />
                Free finance assessment
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900">
                A read on what&rsquo;s working,<br />
                <span className="text-slate-600">and what&rsquo;s about to break.</span>
              </h2>
              <div className="max-w-3xl mx-auto space-y-4">
                <p className="text-xl leading-relaxed text-slate-700">
                  Send us your current setup. We look at the tools you&rsquo;re on, the entities you run, how you&rsquo;re filing in each country, and where the reporting actually lives.
                </p>
                <p className="text-xl leading-relaxed text-slate-700">
                  You get a one-page read on what we&rsquo;d change, what we&rsquo;d leave alone, and what we&rsquo;d worry about at the next stage. Whether or not you work with us.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-6">
                {[
                  { icon: Clock, text: 'You hear back within two business days' },
                  { icon: Shield, text: 'No commitment, no NDA theatre' },
                  { icon: MessageSquare, text: 'WhatsApp works, email works' },
                  { icon: CheckCircle2, text: 'Your numbers don&rsquo;t leave our team' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-slate-100">
                    <item.icon size={20} className="flex-shrink-0 text-[#f16610]" />
                    <span className="font-medium text-left text-slate-900">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8">
                <a
                  href="mailto:contact@finanshels.com"
                  className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-[#f16610] font-bold text-xl shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-1"
                >
                  Get my finance read
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
                Five sentences founders<br />keep saying to us
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">If two of these sound like you, this page is probably for you.</p>
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
                <p className="text-xl leading-relaxed text-slate-700">
                  None of this is a smarts problem. It&rsquo;s a wiring problem. The setup you built for one country and ten people isn&rsquo;t the setup you need for four countries and a board.
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
                You get a pod, not a portal.
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Real names, real Slack handles, real WhatsApp numbers. We sit inside your finance function, not next to it.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                  <p className="text-2xl font-bold mb-4 text-slate-900">What&rsquo;s on the pod</p>
                  <p className="text-lg text-slate-700 mb-4">Four roles, working on your books together. Not a sales channel routing to subcontractors.</p>
                  <div className="space-y-3 text-lg">
                    {[
                      'A controller who runs your monthly close',
                      'A tax lead who covers every jurisdiction you operate in',
                      'An audit and AML specialist who watches the deadlines',
                      'A fractional CFO when you need the strategic call'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 bg-[#fffdfb] rounded-xl p-3 border border-slate-100">
                        <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5 text-[#f16610]" />
                        <span className="font-medium text-slate-900">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div className="space-y-8">
                <div>
                  <p className="text-2xl font-bold text-slate-900 mb-4">What it gives you</p>
                  <div className="space-y-4">
                    {[
                      { icon: Users, title: 'One team to escalate to', desc: 'Not a help-desk queue and three vendor email threads.' },
                      { icon: Clock, title: 'One close calendar across entities', desc: 'Everyone closes on the same working day each month.' },
                      { icon: BarChart3, title: 'One monthly review you actually read', desc: 'Numbers, a one-line read on what moved, and the decisions it implies.' },
                      { icon: MessageSquare, title: 'One WhatsApp thread for the messy questions', desc: 'Reply within the working day, not the working week.' }
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
                  <p className="text-lg text-slate-700 leading-relaxed">
                    Most of our clients describe finance, after a couple of months with us, as the part of the company they think about least. We take that as the compliment.
                  </p>
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
                What you actually notice after a quarter with us
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
                Six thousand teams already let us run this
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Some are a founder and a co-founder. Some are mid-Series-B with four entities. Most started with one bad month-end.
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
                Onboarding
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                What the first month looks like
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                You stay in your day job. We do the heavy lift on getting your books, filings, and entities into one place.
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
            <div className="text-center space-y-6 sm:space-y-8 bg-white rounded-3xl sm:rounded-[40px] border border-slate-100 p-6 sm:p-10 lg:p-16 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-semibold text-[#f16610]/80">
                <TrendingUp size={16} />
                Pricing
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Priced for the company you have, not the one you&rsquo;ll have in three years.
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                We quote against the actual shape of your business: entities, transactions, filings, headcount. Adjust the scope, adjust the price. No multi-year contracts.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="text-[#f16610]" size={20} />
                  <span className="font-medium">First month is on us</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="text-[#f16610]" size={20} />
                  <span className="font-medium">Month-to-month after that</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="text-[#f16610]" size={20} />
                  <span className="font-medium">Scale up or down as entities change</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#f16610] text-white font-semibold hover:bg-[#e55a00] transition-all"
                >
                  See the brackets
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="mailto:contact@finanshels.com"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-slate-300 text-slate-700 font-semibold hover:border-[#f16610] hover:text-[#f16610] transition-all"
                >
                  Get a quote for your setup
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
                FAQ
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
                The questions we get on the first call
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
      <section className="px-5 sm:px-10 lg:px-16 py-20 sm:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(241,102,16,0.05),transparent_55%)]" />

        <div className="max-w-4xl mx-auto relative z-10">
          <AnimatedSection animation="fade-up">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#f16610] mb-6 sm:mb-8">
              A note from the team
            </p>

            <div className="space-y-5 sm:space-y-7 text-lg sm:text-2xl md:text-[1.65rem] leading-[1.5] sm:leading-[1.45] text-slate-900 font-serif tracking-tight">
              <p>
                Most of our clients didn&rsquo;t come to us because finance was on fire. They came because it was quietly slipping — a tax notice nobody saw coming, a board pack stitched together at 2am, a month-end that took twice as long as last quarter.
              </p>
              <p>
                None of that is a competence problem. It&rsquo;s what happens when a finance setup designed for one country and a small team has to absorb three more countries and a board.
              </p>
              <p className="text-[#f16610]">
                We&rsquo;re the team you bring in before that gets expensive.
              </p>
            </div>

            <div className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-slate-200">
              <p className="text-sm text-slate-500 mb-5 sm:mb-6">
                If any of this sounds like the next twelve months for you, we&rsquo;re a short email or WhatsApp away.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:contact@finanshels.com"
                  className="group inline-flex w-full sm:w-auto items-center justify-between gap-3 px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-slate-900 text-white font-semibold text-base hover:bg-slate-800 transition-all"
                >
                  Email us about your setup
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="https://wa.me/971521549572?text=Hi%20Team%20Finanshels%2C%20let%E2%80%99s%20talk%20finance."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-between gap-3 px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl border border-slate-300 text-slate-800 font-semibold text-base hover:border-[#f16610] hover:text-[#f16610] transition-all"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare size={18} />
                    WhatsApp instead
                  </span>
                  <ArrowRight size={16} className="opacity-60" />
                </a>
              </div>
              <p className="text-xs text-slate-500 mt-5">
                Reply within two business days. First conversation isn&rsquo;t a pitch.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
