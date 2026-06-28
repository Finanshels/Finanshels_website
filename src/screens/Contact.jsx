'use client'

import { useState } from 'react'
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Building2,
  CheckCircle2,
  Send,
  Calendar,
  ChevronDown,
} from 'lucide-react'
import { Linkedin, Twitter, Instagram, Youtube } from '@/components/icons/BrandIcons'
import AnimatedSection from '../components/marketing/AnimatedSection'

// Single source of truth for the contact channels used across this page.
const BOOKING_URL = 'https://contact-finanshels.zohobookings.com/#/inquiry-call'
const WHATSAPP_URL = 'https://wa.me/971507178156'
const EMAIL = 'contact@finanshels.com'
const PHONE_DISPLAY = '+971 50 717 8156'
const PHONE_HREF = 'tel:+971507178156'

// Single Dubai HQ — used by the "Visit us" band's map link.
const HQ = {
  city: 'Dubai, UAE',
  address: '406, Publishing Pavilion, Dubai Production City',
}

const COMPANY_SIZES = ['Just me', '2–10', '11–50', '51–200', '200+']

const SOCIALS = [
  { label: 'LinkedIn', handle: 'Finanshels', href: 'https://linkedin.com/company/finanshels', icon: Linkedin, accent: '#0A66C2' },
  { label: 'Instagram', handle: '@finanshels', href: 'https://www.instagram.com/finanshels', icon: Instagram, accent: '#E1306C' },
  { label: 'X', handle: '@finanshels', href: 'https://twitter.com/finanshels', icon: Twitter, accent: '#0f172a' },
  { label: 'YouTube', handle: '@finanshelshq', href: 'https://www.youtube.com/@finanshelshq', icon: Youtube, accent: '#FF0000' },
]

const TRUST_BADGES = [
  '7,000+ UAE clients',
  '180+ finance experts',
  '99.4% on-time filings',
  '4.9★ on Google',
]

const FAQS = [
  {
    q: 'How fast will I hear back?',
    a: 'Within 24 hours by email — usually much faster on WhatsApp during UAE business hours (Mon–Fri, 9:30 AM–6:30 PM GST). A senior operator replies, never a bot or SDR script.',
  },
  {
    q: 'What happens after I reach out?',
    a: 'We review your note, reply with clear next steps, and book a short scoping call. You walk away with a defined scope and a fixed quote — no pressure, no obligation.',
  },
  {
    q: 'Can I keep my current accountant or tools?',
    a: 'Yes. We work alongside your existing setup or take it over fully — QuickBooks, Zoho Books, Xero, Tally, whatever you run. We only suggest changes when they genuinely help.',
  },
  {
    q: 'Do you work with my free zone or mainland entity?',
    a: 'We support mainland DED companies and every major free zone — DMCC, JAFZA, DIFC, ADGM, IFZA and more — right across the UAE.',
  },
  {
    q: 'Is the first conversation free?',
    a: 'Completely. The scoping call and proposal cost nothing. You only pay once you choose a plan that fits.',
  },
]

function mapsHref(office) {
  return `https://maps.google.com/?q=${encodeURIComponent(`${office.address}, ${office.city}`)}`
}

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    companySize: '',
    message: '',
    reason: 'sales',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState(0)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          phone: form.phone || undefined,
          companySize: form.companySize || undefined,
          message: form.message,
          reason: form.reason,
          pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) {
        setError(
          data.error === 'rate_limited'
            ? 'Too many submissions. Please try again in a few minutes.'
            : data.error === 'invalid_email'
              ? 'Please enter a valid email address.'
              : 'Something went wrong sending your message. Please email contact@finanshels.com directly.'
        )
        return
      }
      setSubmitted(true)
    } catch {
      setError('Could not reach our servers. Please email contact@finanshels.com directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-[#fffdfb] text-slate-900 overflow-hidden">
      {/* HERO */}
      <section className="relative pt-32 pb-16 px-6 sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-[#fef3eb] via-[#fffaf3] to-transparent" />
          <div className="absolute -top-20 -left-32 w-[420px] h-[420px] rounded-full bg-[#f16610]/15 blur-[120px]" />
          <div className="absolute top-40 -right-20 w-[460px] h-[460px] rounded-full bg-[#7e8bff]/20 blur-[140px] animate-pulse-slow" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <AnimatedSection animation="fade-down">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#f16610]/30 bg-white/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#f16610] backdrop-blur">
              <MessageCircle size={13} /> Let&apos;s talk
            </span>
            <h1 className="mt-6 text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.05] tracking-tight">
              Finance clarity starts with{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#f16610]">a real conversation</span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-[#ffd19b] -z-0 -skew-x-6" />
              </span>
              .
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
              Tell us your stack, expansion plans, and finance headaches. A senior operator replies in &lt; 24 hours with real next steps — no bots, no boilerplate.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
              {TRUST_BADGES.map((b, i) => (
                <span key={b} className="inline-flex items-center gap-2">
                  {i > 0 && <span className="h-1 w-1 rounded-full bg-slate-300" />}
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  {b}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FORM + FAST LANES */}
      <section className="px-6 sm:px-10 lg:px-16 pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
          {/* FORM */}
          <AnimatedSection animation="fade-right">
            <div className="relative rounded-[36px] border border-slate-100 bg-white shadow-[0_30px_70px_-30px_rgba(15,23,42,0.2)] overflow-hidden">
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#f16610]/15 blur-3xl" />
              <div className="relative z-10 p-8 sm:p-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-semibold tracking-tight">Send us a note</h2>
                    <p className="text-slate-600 mt-1 text-sm">Senior operators reply. No bots, no SDR scripts.</p>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online now
                  </span>
                </div>

                {submitted ? (
                  <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 p-8 text-center">
                    <div className="mx-auto h-14 w-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-4">
                      <CheckCircle2 size={28} />
                    </div>
                    <h3 className="text-xl font-semibold">Message received.</h3>
                    <p className="mt-2 text-slate-600">
                      Our team will reply within 24 hours from{' '}
                      <span className="font-semibold text-slate-900">{EMAIL}</span>. Keep an eye on your inbox (and spam, just in case).
                    </p>
                    <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3">
                      <a
                        href={BOOKING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#f16610] transition"
                      >
                        <Calendar size={16} /> Book a call now
                      </a>
                      <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition"
                      >
                        Or WhatsApp us <ArrowRight size={16} />
                      </a>
                    </div>
                  </div>
                ) : (
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                          Your name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Aisha Mansoori"
                          className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-300 focus:outline-none focus:border-[#f16610] focus:ring-4 focus:ring-[#f16610]/10 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                          Work email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="aisha@yourstartup.com"
                          className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-300 focus:outline-none focus:border-[#f16610] focus:ring-4 focus:ring-[#f16610]/10 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="company" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                          Company
                        </label>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          required
                          value={form.company}
                          onChange={handleChange}
                          placeholder="Your startup or business"
                          className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-300 focus:outline-none focus:border-[#f16610] focus:ring-4 focus:ring-[#f16610]/10 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="phone" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                          Phone <span className="text-slate-300 normal-case tracking-normal">(optional)</span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+971 50 000 0000"
                          className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-300 focus:outline-none focus:border-[#f16610] focus:ring-4 focus:ring-[#f16610]/10 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="companySize" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Team size <span className="text-slate-300 normal-case tracking-normal">(optional)</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {COMPANY_SIZES.map((size) => {
                          const active = form.companySize === size
                          return (
                            <button
                              type="button"
                              key={size}
                              onClick={() =>
                                setForm((prev) => ({ ...prev, companySize: active ? '' : size }))
                              }
                              className={`rounded-2xl border-2 px-4 py-2 text-sm font-semibold transition-all ${
                                active
                                  ? 'border-[#f16610] bg-[#fff4ec] text-[#f16610]'
                                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
                              }`}
                            >
                              {size}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Tell us what you need
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Our team is 12 people, raised seed, books in QuickBooks, VAT due next month, no CFO yet…"
                        className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-300 focus:outline-none focus:border-[#f16610] focus:ring-4 focus:ring-[#f16610]/10 transition-all resize-none"
                      />
                    </div>

                    {error && (
                      <p className="rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="group w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#f16610] px-6 py-4 font-semibold text-white shadow-lg shadow-[#f16610]/30 hover:shadow-xl hover:shadow-[#f16610]/40 hover:-translate-y-0.5 transition-all disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send message
                          <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-slate-500 text-center">
                      By submitting, you agree to be contacted by Finanshels. We never share your details.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </AnimatedSection>

          {/* FAST LANES — consolidated aside */}
          <AnimatedSection animation="fade-left" delay={100}>
            <div className="space-y-5">
              {/* Fast lanes */}
              <div className="rounded-[28px] border border-slate-100 bg-white p-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#f16610] font-semibold">Skip the form</p>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-4 flex items-center gap-3 rounded-2xl bg-[#f16610] px-4 py-3.5 text-white shadow-lg shadow-[#f16610]/30 hover:-translate-y-0.5 hover:shadow-xl transition-all"
                >
                  <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <Calendar size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-white/70 font-semibold">Fastest</p>
                    <p className="font-semibold text-sm">Book a 30-min call</p>
                  </div>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </a>

                <div className="mt-3 space-y-3">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-2xl border border-slate-100 px-4 py-3 hover:border-[#f16610]/40 hover:bg-[#fff8f0] transition"
                  >
                    <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <MessageCircle size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">WhatsApp</p>
                      <p className="font-semibold text-sm">{PHONE_DISPLAY}</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-[#f16610] group-hover:translate-x-1 transition" />
                  </a>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="group flex items-center gap-3 rounded-2xl border border-slate-100 px-4 py-3 hover:border-[#f16610]/40 hover:bg-[#fff8f0] transition"
                  >
                    <div className="h-9 w-9 rounded-xl bg-[#fff4ec] text-[#f16610] flex items-center justify-center">
                      <Mail size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Email</p>
                      <p className="font-semibold text-sm">{EMAIL}</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-[#f16610] group-hover:translate-x-1 transition" />
                  </a>
                  <a
                    href={PHONE_HREF}
                    className="group flex items-center gap-3 rounded-2xl border border-slate-100 px-4 py-3 hover:border-[#f16610]/40 hover:bg-[#fff8f0] transition"
                  >
                    <div className="h-9 w-9 rounded-xl bg-[#fff4ec] text-[#f16610] flex items-center justify-center">
                      <Phone size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Call us</p>
                      <p className="font-semibold text-sm">{PHONE_DISPLAY}</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-[#f16610] group-hover:translate-x-1 transition" />
                  </a>
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="h-9 w-9 rounded-xl bg-white text-slate-500 flex items-center justify-center">
                      <Clock size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Hours</p>
                      <p className="font-semibold text-sm">Mon – Fri · 9:30 AM – 6:30 PM GST</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Follow us */}
              <div className="rounded-[28px] border border-slate-100 bg-white p-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#f16610] font-semibold">Follow us</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow Finanshels on ${s.label}`}
                      style={{ '--accent': s.accent }}
                      className="group flex items-center gap-3 rounded-2xl border-2 border-slate-200 p-3 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[0_16px_30px_-18px_var(--accent)]"
                    >
                      <span
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-white transition-transform group-hover:scale-110"
                        style={{ background: s.accent }}
                      >
                        <s.icon size={18} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold leading-tight tracking-tight text-slate-900">{s.label}</span>
                        <span className="block truncate text-xs text-slate-400">{s.handle}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-white">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3 mb-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                Before you ask
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">Quick answers</h2>
              <p className="text-slate-600 max-w-lg text-lg">
                The things founders ask us most — answered before you even hit send.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={80}>
            <div className="space-y-3">
              {FAQS.map((f, i) => {
                const open = openFaq === i
                return (
                  <div
                    key={f.q}
                    className={`rounded-[24px] border bg-white transition-all ${
                      open ? 'border-[#f16610]/40 shadow-[0_20px_40px_-28px_rgba(241,102,16,0.3)]' : 'border-slate-100'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? -1 : i)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">{f.q}</span>
                      <ChevronDown
                        size={20}
                        className={`flex-shrink-0 text-[#f16610] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {open && (
                      <p className="px-6 pb-5 -mt-1 text-[15px] leading-relaxed text-slate-600">{f.a}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* VISIT US — DUBAI HQ */}
      <section className="px-6 sm:px-10 lg:px-16 pb-24">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="relative overflow-hidden rounded-[44px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-10 sm:p-14 text-white">
              <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#f16610]/30 blur-[120px]" />
              <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#7e8bff]/30 blur-[140px]" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

              <div className="relative z-10 grid md:grid-cols-[1.3fr_1fr] gap-10 items-center">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/90 backdrop-blur">
                    <Building2 size={12} /> Visit us
                  </span>
                  <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
                    Drop by our{' '}
                    <span className="bg-gradient-to-r from-white to-[#ff8a3c] bg-clip-text text-transparent">Dubai HQ</span>.
                  </h2>
                  <p className="mt-4 text-white/80 text-lg max-w-lg">
                    Coffee&apos;s on us — bring your finance challenges and we&apos;ll whiteboard solutions in real time. Book ahead so the right operator is in the room.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <a
                      href={mapsHref(HQ)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900 hover:bg-[#ff8a3c] hover:text-white transition"
                    >
                      <MapPin size={16} /> Open in Maps
                    </a>
                    <a
                      href={BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/40 bg-white/10 backdrop-blur px-5 py-3 font-semibold text-white hover:bg-white/20 transition"
                    >
                      <Calendar size={16} /> Book a call
                    </a>
                  </div>
                </div>
                <div className="rounded-[28px] border border-white/15 bg-white/5 backdrop-blur p-6">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-semibold">Finanshels HQ</p>
                  <p className="mt-2 text-2xl font-semibold">Publishing Pavilion</p>
                  <p className="text-white/70 text-sm">Office 406, Dubai Production City, Dubai, UAE</p>
                  <div className="mt-5 pt-5 border-t border-white/10 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-white/80">
                      <Clock size={14} className="text-[#ff8a3c]" /> Mon – Fri · 9:30 AM – 6:30 PM GST
                    </div>
                    <a href={PHONE_HREF} className="flex items-center gap-2 text-white/80 hover:text-white transition">
                      <Phone size={14} className="text-[#ff8a3c]" /> {PHONE_DISPLAY}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
