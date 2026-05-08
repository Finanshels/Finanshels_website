import { ArrowRight, Star, Award, Users, TrendingUp } from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import TestimonialCard from '../components/TestimonialCard'
import { TESTIMONIALS } from '../data/team'

const HIGHLIGHTS = [
  { label: 'Avg. NPS', value: '79', description: 'We act like an embedded finance team, not an outsourced vendor.' },
  { label: 'Referrals', value: '65%', description: 'Most customers join via other founders and operators.' },
  { label: 'Markets', value: '12', description: 'Serving UAE, KSA, Qatar, Bahrain, Oman, Kuwait, and Egypt.' },
  { label: 'Compliance coverage', value: '100%', description: 'Zero missed filings or penalties since launch.' }
]

const CUSTOMER_QUOTES = [
  {
    company: 'Hub71 Startups',
    summary: 'Hub71 companies lean on Finanshels to operationalize finance from day zero.',
    detail:
      '“They plug into the founders’ stack within days, align on KPIs, and turn chaotic data into usable insights.”',
    author: 'Hub71 Program Lead'
  },
  {
    company: 'MBRIF Cohort',
    summary: 'Venture-backed teams across the accelerator rely on our finance teams.',
    detail:
      '“It feels like Finanshels only builds for startups—every ritual is fast, detailed, and obsessively documented.”',
    author: 'MBRIF Leadership'
  }
]

export default function Customers() {
  const heroTestimonials = TESTIMONIALS.slice(0, 3)

  return (
    <div className="bg-white text-slate-900">
      <section className="pt-36 pb-16 px-6 sm:px-10 lg:px-16 bg-[#fffaf5]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection animation="fade-right">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">customer stories</p>
            <h1 className="text-4xl sm:text-5xl font-semibold mt-4">
              5000+ founders trust Finanshels with every financial decision
            </h1>
            <p className="text-lg text-slate-600 mt-6">
              From venture-backed rockets to disciplined SMBs, our teams integrate with leadership, investors, and
              operators to keep everyone aligned on the numbers that matter.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button as="a" href="mailto:hello@finanshels.com" size="lg">
                Request customer intro
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button
                as="a"
                href="https://wa.me/971507178156"
                variant="ghost"
                size="lg"
                className="border border-[#f16610]/40"
              >
                WhatsApp our team
              </Button>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-left">
            <Card className="border-2 border-[#ffe1cc] bg-white">
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-4">
                  <Award className="text-[#f16610]" size={32} />
                  <div>
                    <p className="text-sm uppercase tracking-[0.4em] text-slate-500">recognition</p>
                    <p className="text-2xl font-semibold">Backed by MBRIF, in5 Tech, and Kube VC</p>
                  </div>
                </div>
                <p className="text-slate-600">
                  We are embedded partners inside accelerators, venture studios, and growth programs that power the MENA
                  ecosystem.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {HIGHLIGHTS.slice(0, 2).map((highlight) => (
                    <div key={highlight.label} className="p-4 rounded-2xl bg-[#fff4ec]">
                      <p className="text-3xl font-semibold text-[#f16610]">{highlight.value}</p>
                      <p className="text-sm text-slate-600">{highlight.label}</p>
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
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold text-center">proof</p>
            <h2 className="text-4xl font-semibold text-center mt-4">Outcomes operators talk about</h2>
            <p className="text-lg text-slate-600 text-center max-w-3xl mx-auto mt-3">
              Finance used to be a black box. With Finanshels, leadership teams brag about how easy closings, reporting,
              and compliance can be.
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            {HIGHLIGHTS.map((highlight) => (
              <AnimatedSection key={highlight.label} animation="fade-up">
                <Card className="p-6 border border-slate-100">
                  <p className="text-3xl font-semibold text-[#f16610]">{highlight.value}</p>
                  <p className="text-sm font-semibold mt-2">{highlight.label}</p>
                  <p className="text-sm text-slate-600 mt-2">{highlight.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-[#fff4ec]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {CUSTOMER_QUOTES.map((item) => (
            <AnimatedSection key={item.company} animation="fade-up">
              <Card className="h-full border border-[#ffd7c0] bg-white">
                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <Users className="text-[#f16610]" size={28} />
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{item.company}</p>
                      <p className="text-lg font-semibold">{item.summary}</p>
                    </div>
                  </div>
                  <p className="text-slate-600">{item.detail}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.author}</p>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-down">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold text-center">
              testimonials
            </p>
            <h2 className="text-4xl font-semibold text-center mt-4">Voices from the Finanshels crew</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {heroTestimonials.map((testimonial, index) => (
              <AnimatedSection key={testimonial.name} animation="fade-up" delay={index * 60}>
                <TestimonialCard testimonial={testimonial} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-slate-950 text-white">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <AnimatedSection animation="fade-down">
            <h2 className="text-4xl font-semibold">Let&apos;s make finance a strategic advantage</h2>
            <p className="text-lg text-white/70">
              Share your company name and we&apos;ll connect you with customers in your industry who rely on Finanshels
              every day.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={80}>
            <Button as="a" href="mailto:hello@finanshels.com" size="lg">
              Talk to references
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={120}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-left text-white/80">
              <div className="flex-1 rounded-2xl border border-white/20 p-6">
                <Star className="text-[#ffd19b]" />
                <p className="font-semibold mt-3">4.9/5 average review across Google, Clutch, and internal surveys.</p>
              </div>
              <div className="flex-1 rounded-2xl border border-white/20 p-6">
                <TrendingUp className="text-[#ffd19b]" />
                <p className="font-semibold mt-3">Teams scale with you—from seed to multi-country expansion.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
