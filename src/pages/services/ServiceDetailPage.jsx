import { useState } from 'react'
import { ArrowRight, CheckCircle2, Quote } from 'lucide-react'
import AnimatedSection from '../../components/AnimatedSection'
import { Card } from '../../components/ui/Card'
import { TESTIMONIALS } from '../../data/team'

export default function ServiceDetailPage({ page }) {
  const [lead, setLead] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-600">
        <p>Service coming soon.</p>
      </div>
    )
  }

  const defaultProblems = [
    `No consistent process for ${page.title.toLowerCase()} which causes delays and penalties.`,
    'Too many spreadsheets, not enough signal for leadership.',
    'Compliance pressure from boards, regulators, and investors.'
  ]

  const defaultSolutions =
    page.workflow?.map((step, index) => `Step ${index + 1}: ${step}`) || [
      'Blueprint the process and controls',
      'Execute with specialists and automations',
      'Report outcomes with commentary and next steps'
    ]

  const defaultWhyNow = [
    'Regulations across the GCC are rapidly evolving.',
    'Investors expect board-ready numbers every month.',
    'Better controls unlock better cash flow and valuations.'
  ]

  const testimonials = TESTIMONIALS.slice(0, 2)

  const handleChange = (event) => {
    const { name, value } = event.target
    setLead((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="bg-white text-slate-900">
      <section className="pt-36 pb-16 px-6 sm:px-10 lg:px-16 bg-gradient-to-b from-[#0f172a] to-[#111827] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(241,102,16,0.4),_transparent_60%)]"></div>
        <div className="max-w-6xl mx-auto relative z-10 space-y-8">
          <AnimatedSection animation="fade-down">
            <p className="text-sm uppercase tracking-[0.4em] text-white/60 font-semibold">{page.title}</p>
            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight max-w-4xl">{page.subtitle}</h1>
            <p className="text-lg text-white/75 max-w-3xl mt-6">{page.description}</p>
          </AnimatedSection>
          {page.stats && (
            <AnimatedSection animation="fade-up" delay={80}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {page.stats.map((stat) => (
                  <Card key={stat.label} className="bg-white/10 border-white/15 text-center p-5 rounded-3xl">
                    <p className="text-3xl font-semibold">{stat.value}</p>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/70 mt-2">{stat.label}</p>
                  </Card>
                ))}
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      <section className="py-16 px-6 sm:px-10 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
          <AnimatedSection animation="fade-right">
            <Card className="h-full border border-slate-100 rounded-[28px]">
              <div className="p-8 space-y-4">
                <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">problem statements</p>
                <div className="space-y-4">
                  {(page.problems || defaultProblems).map((problem, index) => (
                    <div key={problem} className="flex gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#fff4ec] text-[#f16610] flex items-center justify-center font-bold">
                        {(index + 1).toString().padStart(2, '0')}
                      </div>
                      <p className="text-slate-700">{problem}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </AnimatedSection>
          <AnimatedSection animation="fade-left">
            <Card className="h-full border border-slate-100 rounded-[28px] bg-[#fff7f1]">
              <div className="p-8 space-y-4">
                <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">solution blueprint</p>
                <div className="space-y-4">
                  {(page.solutions || defaultSolutions).map((solution) => (
                    <div key={solution} className="flex gap-3">
                      <CheckCircle2 className="text-[#f16610]" size={20} />
                      <p className="text-slate-700">{solution}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-10 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
          <AnimatedSection animation="fade-right">
            <Card className="h-full border border-slate-100 rounded-[28px]">
              <div className="p-8 space-y-4">
                <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">why finanshels</p>
                <div className="space-y-4">
                  {page.valueProps?.map((prop) => (
                    <div key={prop} className="rounded-2xl bg-[#fff8f5] p-4 text-sm text-slate-700">
                      {prop}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </AnimatedSection>
          <AnimatedSection animation="fade-left">
            <Card className="h-full border border-slate-100 rounded-[28px] bg-[#f8fafc]">
              <div className="p-8 space-y-4">
                <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">why now</p>
                <div className="space-y-3 text-slate-700">
                  {(page.whyNow || defaultWhyNow).map((item) => (
                    <div key={item} className="rounded-2xl border border-slate-200 p-4 text-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {page.caseStudy && (
        <section className="py-16 px-6 sm:px-10 lg:px-16 bg-slate-950 text-white">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection animation="fade-up">
              <Card className="bg-white/10 border-white/20 rounded-[32px]">
                <div className="p-10 space-y-4">
                  <p className="text-sm uppercase tracking-[0.4em] text-white/70 font-semibold">case study</p>
                  <p className="text-white/80 text-sm">{page.caseStudy.logo}</p>
                  <h3 className="text-3xl font-semibold">{page.caseStudy.headline}</h3>
                  <p className="text-white/80">{page.caseStudy.result}</p>
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </section>
      )}

      <section className="py-16 px-6 sm:px-10 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={testimonial.name} animation="fade-up" delay={index * 80}>
              <Card className="h-full border border-slate-100 rounded-[28px] p-8 space-y-4">
                <Quote className="text-[#f16610]" size={24} />
                <p className="text-lg text-slate-700">&quot;{testimonial.quote}&quot;</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 sm:px-10 lg:px-16 bg-[#fff8f2]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <AnimatedSection animation="fade-right">
            <Card className="h-full border border-[#ffd7c0] rounded-[32px] bg-white">
              <div className="p-8 space-y-4">
                <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">pricing snapshot</p>
                <h3 className="text-3xl font-semibold">Starting from $219/mo</h3>
                <p className="text-slate-600">
                  Every subscription covers bookkeeping, tax, compliance tracking, reporting rituals, and direct access to Finanshels specialists.
                </p>
                <a
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-5 py-3 font-semibold text-white"
                >
                  View pricing
                  <ArrowRight size={18} />
                </a>
              </div>
            </Card>
          </AnimatedSection>
          <AnimatedSection animation="fade-left">
            <Card className="h-full border border-[#ffd7c0] rounded-[32px] bg-white">
              <div className="p-8 space-y-4">
                <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">get a tailored plan</p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    value={lead.name}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f16610]/30"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Work Email"
                    required
                    value={lead.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f16610]/30"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone / WhatsApp"
                    value={lead.phone}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f16610]/30"
                  />
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Tell us about your finance challenges"
                    value={lead.message}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f16610]/30"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-[#f16610] px-5 py-3 font-semibold text-white"
                  >
                    {submitted ? 'Thanks! We will reach out shortly.' : 'Request a consultation'}
                  </button>
                </form>
                <p className="text-xs text-slate-500">
                  Prefer a direct line? <a href="mailto:hello@finanshels.com" className="text-[#f16610] font-semibold">Email hello@finanshels.com</a> or{' '}
                  <a href="https://wa.me/971507178156" className="text-[#f16610] font-semibold">WhatsApp us</a>.
                </p>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-10 lg:px-16 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl font-semibold">Bring Finanshels in for {page.title.toLowerCase()}</h2>
            <p className="text-lg text-slate-600">
              Share your current stack and expansion plans—our service leads will respond with a tailored roadmap within 48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <a
                href="mailto:hello@finanshels.com"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-6 py-3 font-semibold text-white"
              >
                Talk to sales
                <ArrowRight size={18} />
              </a>
              <a
                href="https://wa.me/971507178156"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#f16610] px-6 py-3 font-semibold text-[#f16610]"
              >
                WhatsApp our consultants
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

