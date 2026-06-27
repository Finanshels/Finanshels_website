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
  Sparkles,
  CheckCircle2,
  Send,
  Calendar,
  Globe2,
  Zap,
} from 'lucide-react'
import AnimatedSection from '../components/marketing/AnimatedSection'

const OFFICES = [
  {
    city: 'Dubai, UAE',
    flag: '🇦🇪',
    role: 'Global HQ',
    address: 'in5 Tech, Dubai Internet City',
    phone: '+971 50 717 8156',
    email: 'contact@finanshels.com',
    accent: 'from-[#fff4ec] to-white',
    glow: 'rgba(241,102,16,0.3)',
  },
  {
    city: 'Kerala, India',
    flag: '🇮🇳',
    role: 'Delivery centre',
    address: 'Finanshels House, Calicut',
    phone: '+91 6282 600 106',
    email: 'india@finanshels.com',
    accent: 'from-[#eef2ff] to-white',
    glow: 'rgba(79,70,229,0.25)',
  },
  {
    city: 'Ahmedabad, India',
    flag: '🇮🇳',
    role: 'Coming soon',
    address: 'Finanshels Innovation Hub',
    phone: '+91 9879 500 222',
    email: 'india@finanshels.com',
    accent: 'from-[#ecfdf5] to-white',
    glow: 'rgba(5,150,105,0.25)',
  },
]

const REASONS = [
  { value: 'sales', label: 'Pricing & plans', icon: Sparkles },
  { value: 'support', label: 'Existing client support', icon: MessageCircle },
  { value: 'partnership', label: 'Partnership / referral', icon: Globe2 },
  { value: 'careers', label: 'Careers & talent', icon: Building2 },
]

const HELP_TOPICS = [
  { icon: Calendar, title: 'Book a 30-min scoping call', desc: 'Walk us through your books, tooling, and headcount. Get a roadmap.', cta: 'Schedule', href: 'mailto:contact@finanshels.com?subject=Scoping%20call' },
  { icon: MessageCircle, title: 'WhatsApp our team', desc: 'Senior operators answer in minutes during UAE working hours.', cta: 'Message', href: 'https://wa.me/971507178156' },
  { icon: Send, title: 'Async Loom or deck', desc: 'Drop a Loom at contact@finanshels.com — annotated reply within 48h.', cta: 'Email', href: 'mailto:contact@finanshels.com' },
]

const TRUST_BADGES = [
  '7,000+ UAE clients',
  '135+ finance experts',
  '99.4% on-time filings',
  '4.9★ on Google',
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '', reason: 'sales' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

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

  const selectReason = (value) => setForm((prev) => ({ ...prev, reason: value }))

  return (
    <div className="bg-[#fffdfb] text-slate-900 overflow-hidden">
      {/* HERO */}
      <section className="relative pt-32 pb-20 px-6 sm:px-10 lg:px-16">
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
              Share your stack, expansion plans, and finance headaches. We respond in &lt; 24 hours with next steps — no bots, no boilerplate.
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

      {/* FORM + DIRECT LINES */}
      <section className="px-6 sm:px-10 lg:px-16 pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
          <AnimatedSection animation="fade-right">
            <div className="relative rounded-[36px] border border-slate-100 bg-white shadow-[0_30px_70px_-30px_rgba(15,23,42,0.2)] overflow-hidden">
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#f16610]/15 blur-3xl" />
              <div className="relative z-10 p-8 sm:p-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-semibold tracking-tight">Send us a note</h2>
                    <p className="text-slate-600 mt-1 text-sm">
                      Senior operators reply. No bots, no SDR scripts.
                    </p>
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
                      <span className="font-semibold text-slate-900">contact@finanshels.com</span>. Keep an eye on your inbox (and spam, just in case).
                    </p>
                    <a
                      href="https://wa.me/971507178156"
                      className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition"
                    >
                      Or WhatsApp us now <ArrowRight size={16} />
                    </a>
                  </div>
                ) : (
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-semibold mb-3">What&apos;s on your mind?</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {REASONS.map((r) => {
                          const active = form.reason === r.value
                          return (
                            <button
                              type="button"
                              key={r.value}
                              onClick={() => selectReason(r.value)}
                              className={`flex items-center gap-2 rounded-2xl border-2 px-3 py-2.5 text-left text-xs font-semibold transition-all ${
                                active
                                  ? 'border-[#f16610] bg-[#fff4ec] text-[#f16610]'
                                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
                              }`}
                            >
                              <r.icon size={14} className="flex-shrink-0" />
                              <span className="leading-tight">{r.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

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
                      <p className="rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                      </p>
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

          <AnimatedSection animation="fade-left" delay={100}>
            <div className="space-y-5">
              <div className="relative rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white overflow-hidden">
                <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#f16610]/30 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-semibold">Response time</p>
                  </div>
                  <p className="text-5xl font-semibold tracking-tight bg-gradient-to-r from-white to-[#ff8a3c] bg-clip-text text-transparent">
                    {'< 24h'}
                  </p>
                  <p className="text-sm text-white/70">
                    Median reply time across email and WhatsApp during UAE business hours.
                  </p>
                  <div className="pt-2 grid grid-cols-3 gap-2 text-center">
                    {[
                      { v: '8m', l: 'WhatsApp' },
                      { v: '2h', l: 'Email' },
                      { v: '24h', l: 'Async' },
                    ].map((s) => (
                      <div key={s.l} className="rounded-xl bg-white/5 border border-white/10 py-2">
                        <p className="text-base font-bold text-[#ff8a3c]">{s.v}</p>
                        <p className="text-[9px] uppercase tracking-widest text-white/50">{s.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-100 bg-white p-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#f16610] font-semibold">Direct lines</p>
                <div className="mt-4 space-y-3">
                  <a
                    href="mailto:contact@finanshels.com"
                    className="group flex items-center gap-3 rounded-2xl border border-slate-100 px-4 py-3 hover:border-[#f16610]/40 hover:bg-[#fff8f0] transition"
                  >
                    <div className="h-9 w-9 rounded-xl bg-[#fff4ec] text-[#f16610] flex items-center justify-center">
                      <Mail size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Email</p>
                      <p className="font-semibold text-sm">contact@finanshels.com</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-[#f16610] group-hover:translate-x-1 transition" />
                  </a>
                  <a
                    href="tel:+971507178156"
                    className="group flex items-center gap-3 rounded-2xl border border-slate-100 px-4 py-3 hover:border-[#f16610]/40 hover:bg-[#fff8f0] transition"
                  >
                    <div className="h-9 w-9 rounded-xl bg-[#fff4ec] text-[#f16610] flex items-center justify-center">
                      <Phone size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Phone / WhatsApp</p>
                      <p className="font-semibold text-sm">+971 50 717 8156</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-[#f16610] group-hover:translate-x-1 transition" />
                  </a>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-100 px-4 py-3">
                    <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Clock size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Hours</p>
                      <p className="font-semibold text-sm">Sun – Thu · 9am – 7pm GST</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* HELP TOPICS */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                Three ways to reach us
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight max-w-3xl">
                Pick the channel that{' '}
                <span className="bg-gradient-to-r from-[#f16610] to-[#ff8a3c] bg-clip-text text-transparent">fits how you work</span>.
              </h2>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-5">
            {HELP_TOPICS.map((t, i) => (
              <AnimatedSection key={t.title} animation="fade-up" delay={i * 100}>
                <a
                  href={t.href}
                  className="group h-full flex flex-col rounded-[28px] border border-slate-100 bg-gradient-to-br from-white to-[#fffaf3] p-7 hover:border-[#f16610]/40 hover:shadow-[0_30px_60px_-25px_rgba(241,102,16,0.25)] hover:-translate-y-1 transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#fff1e1] to-[#ffd19b]/40 text-[#f16610] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <t.icon size={26} />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight">{t.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.desc}</p>
                  <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#f16610]">
                    {t.cta}
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* OFFICES */}
      <section className="px-6 sm:px-10 lg:px-16 py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                <Globe2 size={12} /> Where we&apos;re based
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">Three offices. One team.</h2>
              <p className="text-slate-600 max-w-xl text-lg">
                Operators in the UAE for client-facing work, India for delivery scale. Same standards everywhere.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-5">
            {OFFICES.map((office, i) => (
              <AnimatedSection key={office.city} animation="fade-up" delay={i * 100}>
                <div className={`group relative h-full overflow-hidden rounded-[32px] border border-slate-100 bg-gradient-to-br ${office.accent} p-7 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-25px_rgba(15,23,42,0.15)] transition-all`}>
                  <div
                    className="absolute -top-20 -right-20 h-52 w-52 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"
                    style={{ background: office.glow }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl leading-none">{office.flag}</span>
                      <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-semibold">{office.role}</span>
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold tracking-tight">{office.city}</h3>
                    <div className="mt-5 space-y-2.5 text-sm">
                      <div className="flex items-start gap-2.5 text-slate-700">
                        <MapPin size={15} className="text-[#f16610] mt-0.5 flex-shrink-0" />
                        <span>{office.address}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-700">
                        <Phone size={15} className="text-[#f16610] flex-shrink-0" />
                        <span>{office.phone}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-700">
                        <Mail size={15} className="text-[#f16610] flex-shrink-0" />
                        <span>{office.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* VISIT US — DUBAI */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="relative overflow-hidden rounded-[44px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-10 sm:p-14 text-white">
              <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#f16610]/30 blur-[120px]" />
              <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#7e8bff]/30 blur-[140px]" />
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-[20%] left-[15%] h-1.5 w-1.5 rounded-full bg-white" />
                <div className="absolute top-[35%] left-[30%] h-1 w-1 rounded-full bg-white" />
                <div className="absolute top-[55%] left-[25%] h-1.5 w-1.5 rounded-full bg-white" />
                <div className="absolute top-[40%] left-[60%] h-1 w-1 rounded-full bg-white" />
                <div className="absolute top-[70%] left-[55%] h-2 w-2 rounded-full bg-[#ff8a3c] animate-pulse" />
                <div className="absolute top-[70%] left-[55%] h-8 w-8 rounded-full border border-[#ff8a3c]/40 animate-ping" />
                <div className="absolute top-[25%] left-[75%] h-1 w-1 rounded-full bg-white" />
                <div className="absolute top-[60%] left-[85%] h-1.5 w-1.5 rounded-full bg-white" />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

              <div className="relative z-10 grid md:grid-cols-[1.3fr_1fr] gap-10 items-center">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/90 backdrop-blur">
                    <Building2 size={12} /> Visit us
                  </span>
                  <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
                    Drop by{' '}
                    <span className="bg-gradient-to-r from-white to-[#ff8a3c] bg-clip-text text-transparent">in5 Tech, Dubai</span>.
                  </h2>
                  <p className="mt-4 text-white/80 text-lg max-w-lg">
                    Dubai Internet City, Building 1. Coffee&apos;s on us — bring your finance challenges and we&apos;ll whiteboard solutions in real time.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <a
                      href="https://maps.google.com/?q=in5+Tech+Dubai+Internet+City"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900 hover:bg-[#ff8a3c] hover:text-white transition"
                    >
                      <MapPin size={16} /> Open in Maps
                    </a>
                    <a
                      href="mailto:contact@finanshels.com?subject=Office%20visit"
                      className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/40 bg-white/10 backdrop-blur px-5 py-3 font-semibold text-white hover:bg-white/20 transition"
                    >
                      <Calendar size={16} /> Schedule a visit
                    </a>
                  </div>
                </div>
                <div className="rounded-[28px] border border-white/15 bg-white/5 backdrop-blur p-6">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-semibold">Finanshels HQ</p>
                  <p className="mt-2 text-2xl font-semibold">in5 Tech</p>
                  <p className="text-white/70 text-sm">Dubai Internet City, Bldg 1</p>
                  <div className="mt-5 pt-5 border-t border-white/10 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-white/80">
                      <Clock size={14} className="text-[#ff8a3c]" /> Sun – Thu · 9am – 7pm GST
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Zap size={14} className="text-[#ff8a3c]" /> Walk-ins welcome with prior call
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 sm:px-10 lg:px-16 pb-24">
        <AnimatedSection animation="fade-up">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[44px] bg-gradient-to-br from-[#f16610] via-[#ff7a23] to-[#ff8a3c] p-10 sm:p-16 text-white">
            <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-center md:text-left">
              <div className="max-w-xl">
                <p className="text-xs uppercase tracking-[0.4em] text-white/80 font-semibold">Async preferred?</p>
                <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
                  Drop a Loom, get a roadmap.
                </h2>
                <p className="mt-4 text-white/85 text-lg">
                  Record a 5-minute Loom about your finance setup. Our CFO office sends back annotated feedback within 48 hours.
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <a
                  href="mailto:contact@finanshels.com?subject=Loom%20review"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-semibold text-[#f16610] shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                >
                  Email a Loom <ArrowRight size={18} />
                </a>
                <a
                  href="https://wa.me/971507178156"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/60 bg-white/10 backdrop-blur px-6 py-3.5 font-semibold text-white hover:bg-white/20 transition"
                >
                  <MessageCircle size={18} /> WhatsApp us
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
