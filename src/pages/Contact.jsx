import { useState } from 'react'
import { ArrowRight, Mail, Phone, MapPin, Clock, MessageCircle, Building2 } from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

const OFFICES = [
  {
    city: 'Dubai, UAE (HQ)',
    address: 'in5 Tech, Dubai Internet City',
    phone: '+971 50 717 8156',
    email: 'hello@finanshels.com'
  },
  {
    city: 'Kerala, India',
    address: 'Finanshels House, Calicut',
    phone: '+91 6282 600 106',
    email: 'india@finanshels.com'
  },
  {
    city: 'Ahmedabad, India (upcoming)',
    address: 'Finanshels Innovation Hub',
    phone: '+91 9879 500 222',
    email: 'india@finanshels.com'
  }
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="bg-white text-slate-900">
      <section className="pt-36 pb-16 px-6 sm:px-10 lg:px-16 bg-slate-950 text-white text-center">
        <div className="max-w-5xl mx-auto space-y-6">
          <AnimatedSection animation="fade-down">
            <p className="text-sm uppercase tracking-[0.4em] text-white/70 font-semibold">contact</p>
            <h1 className="text-4xl sm:text-5xl font-semibold">Finance clarity starts with a real conversation</h1>
            <p className="text-lg text-white/70 mt-4">
              Share your current stack, expansion plans, and finance headaches. We&apos;ll respond in less than 24 hours
              with next steps.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={80}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button as="a" href="mailto:hello@finanshels.com" size="lg">
                Email hello@finanshels.com
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button as="a" href="https://wa.me/971507178156" variant="ghost" size="lg" className="text-white border border-white/30">
                WhatsApp us
                <MessageCircle size={18} className="ml-2" />
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">
          <AnimatedSection animation="fade-right" className="lg:col-span-2">
            <Card className="border border-slate-100">
              <div className="p-8">
                <h2 className="text-3xl font-semibold mb-2">Send us a note</h2>
                <p className="text-slate-600 mb-8">
                  No bots—just senior operators who understand what building in MENA feels like.
                </p>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  {['name', 'email', 'company'].map((field) => (
                    <div key={field} className="space-y-2">
                      <label htmlFor={field} className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                        {field}
                      </label>
                      <input
                        id={field}
                        name={field}
                        type="text"
                        required
                        value={form[field]}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f16610]/30"
                      />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500"
                    >
                      message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f16610]/30"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    {submitted ? 'Message received. We\'ll reply soon.' : 'Send message'}
                  </Button>
                </form>
              </div>
            </Card>
          </AnimatedSection>
          <AnimatedSection animation="fade-left">
            <Card className="border border-slate-100 bg-[#fffaf5] h-full">
              <div className="p-8 space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-[#f16610]/80 font-semibold">direct lines</p>
                  <div className="mt-4 space-y-3 text-slate-700">
                    <p className="flex items-center gap-3">
                      <Mail className="text-[#f16610]" size={18} />
                      hello@finanshels.com
                    </p>
                    <p className="flex items-center gap-3">
                      <Phone className="text-[#f16610]" size={18} />
                      +971 50 717 8156
                    </p>
                    <p className="flex items-center gap-3">
                      <Clock className="text-[#f16610]" size={18} />
                      Sunday – Thursday • 9am – 7pm GST
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-[#f16610]/80 font-semibold">offices</p>
                  <div className="space-y-4 text-slate-700">
                    {OFFICES.map((office) => (
                      <div key={office.city} className="rounded-2xl border border-[#ffd7c0] p-4 bg-white">
                        <div className="flex items-center gap-3">
                          <MapPin className="text-[#f16610]" size={18} />
                          <p className="font-semibold">{office.city}</p>
                        </div>
                        <p className="text-sm text-slate-600 mt-2">{office.address}</p>
                        <p className="text-sm text-slate-600 mt-1">{office.phone}</p>
                        <p className="text-sm text-slate-600">{office.email}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <AnimatedSection animation="fade-right">
            <div className="rounded-3xl border border-white/20 p-8">
              <Building2 className="text-[#ffd19b]" size={32} />
              <h3 className="text-3xl font-semibold mt-4">Visit us at in5 Tech</h3>
              <p className="text-white/70 mt-2">
                Dubai Internet City, Building 1. Coffee&apos;s on us—bring your finance challenges and we&apos;ll whiteboard
                solutions in real time.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-left">
            <div className="rounded-3xl border border-white/20 p-8">
              <MessageCircle className="text-[#ffd19b]" size={32} />
              <h3 className="text-3xl font-semibold mt-4">Prefer async?</h3>
              <p className="text-white/70 mt-2">
                Drop us a Loom or deck at hello@finanshels.com and our CFO office will send back annotated feedback within
                48 hours.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
