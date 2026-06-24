'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Calculator,
  ChevronDown,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Phone,
  Star,
  CheckCircle2,
  MessageSquare,
  ScrollText,
  BookOpen,
  Wallet,
  Archive,
  BarChart3,
  HeartHandshake,
} from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import TestimonialCarousel from '../components/TestimonialCarousel'
import { TESTIMONIALS } from '../data/team'

const WHATSAPP_HREF =
  'https://wa.me/971521549572?text=Hi%20Team%20Finanshels%2C%20let%E2%80%99s%20talk%20finance.'

const AVATAR_BASE = 'https://api.dicebear.com/9.x/notionists/svg'
const avatarUrl = (seed) =>
  `${AVATAR_BASE}?seed=${encodeURIComponent(seed)}&radius=50&backgroundColor=transparent`

// Each tile renders a layered gradient "blob" with a service-specific lucide icon.
// `blob` is the soft background gradient; `ring` is the icon-bubble gradient.
const SERVICE_TILES = [
  { name: 'Bookkeeping',          icon: BookOpen,       href: '/solutions/bookkeeping',                accent: 'from-[#fff4ec] to-white', blob: 'from-[#ffd7b5] to-[#ff8a3c]', ring: 'from-[#f16610] to-[#ff8a3c]' },
  { name: 'Corporate Tax Filing', icon: FileText,       href: '/solutions/corporate-tax-filing',       accent: 'from-[#eef2ff] to-white', blob: 'from-[#c7d2fe] to-[#6366f1]', ring: 'from-[#4f46e5] to-[#7c3aed]' },
  { name: 'VAT Filing',           icon: Calculator,     href: '/solutions/vat-filing',                 accent: 'from-[#ecfdf5] to-white', blob: 'from-[#a7f3d0] to-[#10b981]', ring: 'from-[#059669] to-[#10b981]' },
  { name: 'VAT Registration',     icon: ClipboardCheck, href: '/solutions/vat-registration',           accent: 'from-[#fef3c7] to-white', blob: 'from-[#fde68a] to-[#f59e0b]', ring: 'from-[#b45309] to-[#f59e0b]' },
  { name: 'CT Registration',      icon: ScrollText,     href: '/solutions/corporate-tax-registration', accent: 'from-[#fdf2f8] to-white', blob: 'from-[#fbcfe8] to-[#ec4899]', ring: 'from-[#db2777] to-[#ec4899]' },
  { name: 'Fractional CFO',       icon: TrendingUp,     href: '/solutions/fractional-cfo',             accent: 'from-[#f0f9ff] to-white', blob: 'from-[#bae6fd] to-[#0284c7]', ring: 'from-[#0284c7] to-[#0ea5e9]' },
  { name: 'Tax Consultancy',      icon: MessageSquare,  href: '/solutions/tax-consultancy',            accent: 'from-[#f5f3ff] to-white', blob: 'from-[#ddd6fe] to-[#7c3aed]', ring: 'from-[#7c3aed] to-[#a855f7]' },
  { name: 'Compliance & AML',     icon: ShieldCheck,    href: '/solutions/compliance-services',        accent: 'from-[#fef2f2] to-white', blob: 'from-[#fecaca] to-[#dc2626]', ring: 'from-[#dc2626] to-[#ef4444]' },
  { name: 'Payroll & WPS',        icon: Wallet,         href: '/solutions/payroll',                    accent: 'from-[#fff7ed] to-white', blob: 'from-[#fed7aa] to-[#ea580c]', ring: 'from-[#ea580c] to-[#fb923c]' },
  { name: 'Audit Support',        icon: BarChart3,      href: '/solutions/audit',                      accent: 'from-[#f0fdf4] to-white', blob: 'from-[#bbf7d0] to-[#16a34a]', ring: 'from-[#16a34a] to-[#22c55e]' },
  { name: 'Hire an Expert',       icon: Users,          href: '/solutions/hire-an-expert',             accent: 'from-[#eff6ff] to-white', blob: 'from-[#bfdbfe] to-[#2563eb]', ring: 'from-[#2563eb] to-[#3b82f6]' },
  { name: 'Liquidation',          icon: Archive,        href: '/solutions/liquidation-services',       accent: 'from-[#fdf4ff] to-white', blob: 'from-[#f5d0fe] to-[#a21caf]', ring: 'from-[#a21caf] to-[#c026d3]' },
]

const PARTNER_BRANDS = ['Wio Bank', 'Mashreq Neo', 'Tabby', 'YAP', 'Pyypl', 'Sarwa', 'Bayzat', 'Postpay']

const RADIO_STATIONS = ['Dubai Eye 103.8', 'Radio 4 FM', 'Virgin Radio', 'Channel 4 FM', 'Hit 96.7', 'Tag 91.1', 'Pulse 95', 'City 101.6']

const AMBASSADOR = {
  name: 'Kanika Tekriwal',
  title: 'Founder & CEO, JetSetGo',
  quote:
    'Finny and the Finanshels team have become the trusted finance brain for our UAE operations — transparent, fast, and obsessively reliable. They\'re the partner we recommend to every founder in the region.',
}

const TRUST_STATS = [
  { value: '4.9★', label: 'from 7,000+ reviews' },
  { value: '7,000+', label: 'UAE businesses served' },
  { value: '180+', label: 'finance specialists' },
  { value: '12', label: 'active markets' },
]

const WHY_CARDS = [
  {
    icon: MessageSquare,
    title: 'WhatsApp-first support',
    copy: 'Controllers, CFOs, and tax leads on one thread. Replies in minutes, not days.',
  },
  {
    icon: ShieldCheck,
    title: 'Zero-surprise filings',
    copy: 'Corporate tax, VAT, AML, and renewals tracked in one calendar so nothing slips.',
  },
  {
    icon: BarChart3,
    title: 'Board-ready every month',
    copy: 'Rolling forecasts, variance commentary, and KPI decks investors actually read.',
  },
  {
    icon: HeartHandshake,
    title: 'Built for MENA',
    copy: 'UAE/KSA-tuned playbooks, deadline checkers, and client portal in one place.',
  },
]

const PROCESS_STEPS = [
  {
    n: '01',
    title: 'Tell us what you need',
    copy: 'Pick a service above or WhatsApp us. We scope your setup in one short call.',
  },
  {
    n: '02',
    title: 'Meet your pod',
    copy: 'A dedicated controller, tax lead, and CFO partner is assigned in days, not weeks.',
  },
  {
    n: '03',
    title: 'Get the monthly rhythm',
    copy: 'Clean books, filings on time, board-ready packs, and WhatsApp answers — every month.',
  },
]

const CUSTOMER_LOGOS = [
  'Hub71', 'YAP', 'Baraka', 'Letswork', 'Sarwa', 'Rain',
  'Pyypl', 'Tabby', 'FOO', 'Lune', 'Postpay', 'Bayzat',
]

const PRESS_ITEMS = [
  { label: 'Featured in', name: 'Khaleej Times' },
  { label: 'Featured in', name: 'Gulf News' },
  { label: 'Featured in', name: 'Arabian Business' },
  { label: 'Featured in', name: 'Forbes Middle East' },
  { label: 'Partner of', name: 'Hub71' },
  { label: 'Member', name: 'Dubai Chamber' },
]

const FINNY_PROMISES = [
  { title: 'Filings on time, every time', copy: 'CT, VAT, AML, ESR — owned, scheduled, never late.' },
  { title: 'Your books, always clean',     copy: 'Bank, PSP and ERP reconciled monthly without nudging.' },
  { title: 'A CFO when you need one',      copy: 'Investor updates, runway models, and pricing strategy.' },
  { title: 'Answers in your pocket',       copy: 'WhatsApp pod for any finance question, anytime.' },
]

const FAQS = [
  {
    q: 'How fast can you take over my books?',
    a: 'Most teams are onboarded in 5–7 working days. We ingest your ledger, banks, PSPs, and policies, then run the first month\'s close alongside you.',
  },
  {
    q: 'Do you handle UAE Corporate Tax registration and filing?',
    a: 'Yes — end-to-end. Registration, financial-year selection, free-zone analysis, and quarterly/annual filings are all covered. We also handle missed-deadline remediation.',
  },
  {
    q: 'What\'s included in a fractional CFO engagement?',
    a: 'Financial reporting, cash-flow forecasting, scenario modelling, investor updates, board packs, and pricing strategy. Engagements are sized to your stage from pre-seed to Series B+.',
  },
  {
    q: 'How is pricing structured?',
    a: 'Pricing depends on transaction volume, entities, and whether VAT/CT compliance is bundled. We give you a fixed monthly fee after a 20-minute scoping call — no hourly surprises.',
  },
  {
    q: 'Do you work with companies outside the UAE?',
    a: 'Yes. We serve UAE, KSA, and broader MENA, and coordinate with offshore (UK, Singapore, US) entities for group consolidation and reporting.',
  },
]

function FinnyFace({ size = 140 }) {
  // Friendly assistant character — round face, headset, brand orange
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_8px_20px_rgba(241,102,16,0.35)]"
    >
      <defs>
        <radialGradient id="finny-face" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#ffd1a8" />
          <stop offset="55%" stopColor="#f9a05c" />
          <stop offset="100%" stopColor="#e0571a" />
        </radialGradient>
        <linearGradient id="finny-hair" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a2218" />
          <stop offset="100%" stopColor="#1c110a" />
        </linearGradient>
        <linearGradient id="finny-headset" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <radialGradient id="finny-cheek" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff8c5a" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ff8c5a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* shoulders / shirt */}
      <path
        d="M30 200 Q30 160 70 150 L130 150 Q170 160 170 200 Z"
        fill="#0f5c4f"
      />
      <path
        d="M85 150 Q100 162 115 150 L115 165 Q100 175 85 165 Z"
        fill="#ffd1a8"
      />

      {/* head */}
      <ellipse cx="100" cy="92" rx="60" ry="62" fill="url(#finny-face)" />

      {/* hair */}
      <path
        d="M44 80 Q42 38 100 32 Q160 36 156 82 Q150 60 130 56 Q120 70 100 68 Q80 70 70 56 Q50 60 44 80 Z"
        fill="url(#finny-hair)"
      />

      {/* ears */}
      <ellipse cx="42" cy="98" rx="8" ry="12" fill="url(#finny-face)" />
      <ellipse cx="158" cy="98" rx="8" ry="12" fill="url(#finny-face)" />

      {/* headset band */}
      <path
        d="M48 78 Q100 30 152 78"
        stroke="url(#finny-headset)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* headset ear cups */}
      <ellipse cx="42" cy="96" rx="10" ry="14" fill="url(#finny-headset)" />
      <ellipse cx="158" cy="96" rx="10" ry="14" fill="url(#finny-headset)" />
      {/* mic */}
      <path
        d="M158 108 Q172 118 165 138"
        stroke="url(#finny-headset)"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="163" cy="140" r="3.5" fill="#f16610" />

      {/* cheeks blush */}
      <ellipse cx="70" cy="110" rx="11" ry="7" fill="url(#finny-cheek)" />
      <ellipse cx="130" cy="110" rx="11" ry="7" fill="url(#finny-cheek)" />

      {/* eyebrows */}
      <path d="M62 84 Q72 80 82 84" stroke="#1c110a" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M118 84 Q128 80 138 84" stroke="#1c110a" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* eyes */}
      <g>
        <ellipse cx="74" cy="98" rx="6.5" ry="7.5" fill="#1c110a" />
        <ellipse cx="126" cy="98" rx="6.5" ry="7.5" fill="#1c110a" />
        {/* eye highlights */}
        <circle cx="76.5" cy="95.5" r="2" fill="#ffffff" />
        <circle cx="128.5" cy="95.5" r="2" fill="#ffffff" />
      </g>

      {/* smile */}
      <path
        d="M78 122 Q100 138 122 122"
        stroke="#1c110a"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* tongue/lip highlight */}
      <path
        d="M88 128 Q100 134 112 128"
        stroke="#e0571a"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  )
}

function FinnyMascot({ size = 220, variant = 'wave' }) {
  const tagline = variant === 'wave' ? 'Finny here' : variant === 'shield' ? "I've got you" : 'Always on'
  const faceSize = Math.round(size * 0.62)
  return (
    <div
      className="relative inline-block"
      style={{ width: size, height: size }}
      aria-label="Finny — Finanshels assistant"
      role="img"
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#fff4ec] via-[#ffe6d3] to-[#ffd19b] blur-2xl opacity-70" />
      <div className="relative h-full w-full rounded-full bg-gradient-to-br from-white to-[#fff4ec] border-2 border-white shadow-[0_24px_60px_rgba(241,102,16,0.25)] flex items-center justify-center overflow-hidden">
        <div className="absolute -top-6 -right-4 h-24 w-24 rounded-full bg-[#f16610]/20 blur-2xl" />
        <div className="absolute -bottom-8 -left-6 h-28 w-28 rounded-full bg-[#7e8bff]/15 blur-2xl" />
        <div className="relative flex flex-col items-center justify-center gap-2">
          <FinnyFace size={faceSize} />
          <div className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#f16610] shadow-sm border border-[#ffd19b]">
            {tagline}
          </div>
        </div>
      </div>
      <div className="absolute -top-2 right-4 animate-pulse">
        <Sparkles size={18} className="text-[#f16610]" />
      </div>
      <div className="absolute bottom-2 -left-2 animate-pulse">
        <CheckCircle2 size={16} className="text-emerald-500" />
      </div>
    </div>
  )
}

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="w-full text-left rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-[#f16610]/40 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="font-semibold text-slate-900">{item.q}</p>
        <ChevronDown
          size={20}
          className={`mt-1 flex-shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-[#f16610]' : ''}`}
        />
      </div>
      {isOpen && (
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
      )}
    </button>
  )
}

export default function Home3() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <main className="bg-white text-slate-900">
      {/* ──────────── HERO ──────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fff8f1] via-white to-white pt-28 pb-20">
        <div className="absolute -top-20 -left-32 h-[420px] w-[420px] rounded-full bg-[#f16610]/10 blur-[120px]" />
        <div className="absolute top-20 right-0 h-[380px] w-[380px] rounded-full bg-[#7e8bff]/15 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-8 relative">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <AnimatedSection animation="fade-right">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#f16610]/30 bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#f16610] backdrop-blur">
                <Sparkles size={13} /> Meet Finny — your finance partner
              </span>
              <h1 className="mt-6 text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.05] tracking-tight">
                Finny simplifies your{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-[#f16610]">finance ops</span>
                  <span className="absolute inset-x-0 bottom-1 h-3 -skew-x-6 bg-[#ffd19b] -z-0" />
                </span>
              </h1>
              <p className="mt-5 text-lg text-slate-600 max-w-xl">
                Experience excellence with the UAE&apos;s most-loved finance partner — accounting, tax, payroll, and CFO services in one place.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#0f5c4f] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(15,92,79,0.4)] hover:bg-[#0c4a3f] transition"
                >
                  <Phone size={16} /> WhatsApp us now
                </a>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-[#f16610] hover:text-[#f16610] transition"
                >
                  View packages <ArrowRight size={16} />
                </Link>
              </div>

              <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-amber-200 bg-amber-50 px-4 py-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} className="fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  4.9/5 from 7,000+ UAE businesses
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-left">
              <div className="relative flex items-center justify-center">
                <FinnyMascot size={300} variant="wave" />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                    Operated by
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    180+ finance specialists
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ──────────── TRUST STRIP ──────────── */}
      <section className="border-y border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl md:text-3xl font-bold text-[#f16610]">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────── SERVICE SELECTOR GRID ──────────── */}
      <section className="py-20 bg-gradient-to-b from-white to-[#fff8f1]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <AnimatedSection animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#fff1e1] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f16610]">
                Pick a service
              </span>
              <h2 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight">
                What would you like to sort out today?
              </h2>
              <p className="mt-3 text-slate-600">
                Tap a tile and we&apos;ll walk you through it. Or WhatsApp us with anything finance.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SERVICE_TILES.map((tile) => {
              const Icon = tile.icon
              return (
                <Link
                  key={tile.name}
                  href={tile.href}
                  className={`group relative flex flex-col items-center text-center rounded-2xl border border-slate-200 bg-gradient-to-br ${tile.accent} p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#f16610]/40`}
                >
                  {/* Layered icon medallion */}
                  <div className="relative h-24 w-24 flex items-center justify-center">
                    {/* outer soft blob (background glow) */}
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${tile.blob} opacity-30 blur-xl`} />
                    {/* mid ring */}
                    <div className={`absolute inset-2 rounded-full bg-gradient-to-br ${tile.blob} opacity-60`} />
                    {/* icon bubble */}
                    <div className={`relative h-16 w-16 rounded-full bg-gradient-to-br ${tile.ring} flex items-center justify-center shadow-lg ring-4 ring-white transition-transform group-hover:-rotate-6 group-hover:scale-105`}>
                      <Icon size={28} className="text-white drop-shadow" strokeWidth={2.2} />
                    </div>
                  </div>
                  <p className="mt-3 font-bold text-slate-900">{tile.name}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500 group-hover:text-[#f16610] transition">
                    Explore <ArrowUpRight size={12} />
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="mt-10 text-center">
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#f16610] hover:underline"
            >
              Not sure where to start? Ask Finny on WhatsApp <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ──────────── WHY FINANSHELS (with Finny) ──────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 items-center">
            <AnimatedSection animation="fade-right">
              <div className="text-center lg:text-left">
                <FinnyMascot size={240} variant="shield" />
                <h2 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight">
                  Why founders pick Finanshels
                </h2>
                <p className="mt-3 text-slate-600 max-w-md mx-auto lg:mx-0">
                  Real humans, modern tooling, and a relentless focus on getting your numbers right.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-left">
              <div className="grid sm:grid-cols-2 gap-4">
                {WHY_CARDS.map((card) => {
                  const Icon = card.icon
                  return (
                    <div
                      key={card.title}
                      className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-[#fff8f1] p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1e1] text-[#f16610]">
                        <Icon size={22} />
                      </div>
                      <p className="mt-4 font-bold text-slate-900">{card.title}</p>
                      <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{card.copy}</p>
                    </div>
                  )
                })}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ──────────── 3-STEP PROCESS ──────────── */}
      <section className="py-20 bg-gradient-to-b from-[#fff8f1] to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <AnimatedSection animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#fff1e1] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f16610]">
                How it works
              </span>
              <h2 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight">
                From chaos to clarity in 3 steps
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px border-t-2 border-dashed border-[#f16610]/30" />
            {PROCESS_STEPS.map((step) => (
              <div key={step.n} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f16610] to-[#ff8a3c] text-sm font-bold text-white shadow-lg shadow-[#f16610]/30">
                  {step.n}
                </div>
                <p className="mt-5 font-bold text-slate-900 text-lg">{step.title}</p>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── EXPERT HELP PANEL ──────────── */}
      <section className="pt-6 pb-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-[#fff8f1] via-white to-[#fff8f1] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl('finny-help')}
              alt="Finny — expert"
              className="h-24 w-24 rounded-full border-4 border-white shadow-md bg-[#fff4ec]"
              loading="lazy"
            />
            <div className="flex-1 text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f16610]">Get expert help</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                Not sure what fits? Talk to your dedicated finance advisor.
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Free 20-minute scoping call. We&apos;ll map the right pod for your stage and entities.
              </p>
            </div>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#f16610]/30 hover:-translate-y-0.5 transition whitespace-nowrap"
            >
              <Phone size={16} /> Talk to an advisor
            </a>
          </div>
        </div>
      </section>

      {/* ──────────── APP / PORTAL SHOWCASE ──────────── */}
      <section className="py-20 bg-gradient-to-b from-white to-[#fff8f1]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid lg:grid-cols-[0.95fr_1.05fr] gap-12 items-center">
          <AnimatedSection animation="fade-right">
            {/* Phone mockup */}
            <div className="relative mx-auto w-[280px] aspect-[280/560]">
              <div className="absolute inset-0 rounded-[44px] bg-slate-900 shadow-[0_30px_80px_rgba(15,23,42,0.35)]" />
              <div className="absolute inset-[10px] rounded-[36px] overflow-hidden bg-gradient-to-br from-white to-[#fff8f1]">
                <div className="absolute left-1/2 top-2 -translate-x-1/2 h-6 w-28 rounded-b-2xl bg-slate-900" />
                <div className="absolute top-12 left-0 right-0 px-4">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarUrl('finny-portal')}
                      alt=""
                      className="h-9 w-9 rounded-full bg-[#fff4ec] border border-slate-200"
                    />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">myFinny</p>
                      <p className="text-sm font-bold text-slate-900">Good morning, Sarah</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl bg-gradient-to-br from-[#f16610] to-[#ff8a3c] p-4 text-white shadow-md">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/80">VAT return due</p>
                    <p className="mt-1 text-lg font-bold">In 6 days</p>
                    <p className="mt-1 text-[11px] text-white/85">Q4 2026 · AED 18,420</p>
                  </div>
                  <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Cash runway</p>
                    <p className="mt-1 text-base font-bold text-slate-900">18.4 months</p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                      <div className="h-full w-3/4 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                  <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">MTD P&amp;L</p>
                      <span className="text-[10px] font-bold text-emerald-600">+12.4%</span>
                    </div>
                    <p className="mt-1 text-base font-bold text-slate-900">AED 482,310</p>
                  </div>
                  <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-2.5 flex items-center gap-2 shadow-sm">
                    <MessageSquare size={14} className="text-[#f16610]" />
                    <p className="text-[11px] text-slate-700">Your pod replied in WhatsApp</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fff1e1] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f16610]">
              Client portal
            </span>
            <h2 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight">
              Your finance command centre — in your pocket.
            </h2>
            <p className="mt-3 text-slate-600 max-w-md">
              Filings, runway, P&amp;L, and your pod chat in one app. Built for founders, not accountants.
            </p>

            <div className="mt-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500 mb-3">
                Integrated with
              </p>
              <div className="flex flex-wrap gap-2">
                {PARTNER_BRANDS.map((brand) => (
                  <span
                    key={brand}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md"
              >
                <span className="text-lg leading-none"></span>
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/70">Download on the</span>
                  <span className="text-sm">App Store</span>
                </span>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md"
              >
                <span className="text-lg leading-none">▶</span>
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/70">Get it on</span>
                  <span className="text-sm">Google Play</span>
                </span>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ──────────── BRAND AMBASSADOR ──────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-[#fff8f1] to-white p-6 md:p-10 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#fff1e1] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f16610]">
                  Brand Ambassador
                </span>
                <p className="mt-5 text-2xl md:text-3xl font-bold text-slate-900 leading-snug">
                  &ldquo;{AMBASSADOR.quote}&rdquo;
                </p>
                <p className="mt-5 text-sm font-bold text-slate-900">{AMBASSADOR.name}</p>
                <p className="text-xs text-slate-500">{AMBASSADOR.title}</p>
              </div>
              <div className="flex items-end justify-center gap-1 -mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(AMBASSADOR.name)}&backgroundColor=fff4ec`}
                  alt={AMBASSADOR.name}
                  className="h-32 w-32 rounded-2xl border-2 border-white shadow-md object-cover"
                  loading="lazy"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarUrl('finny-ambassador')}
                  alt="Finny"
                  className="h-28 w-28 rounded-full bg-[#fff4ec] border-2 border-white shadow-md"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── CUSTOMER LOGOS ──────────── */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <p className="text-center text-xs uppercase tracking-[0.4em] text-slate-500 mb-8">
            Trusted by ambitious teams across the UAE
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 items-center">
            {CUSTOMER_LOGOS.map((logo) => (
              <div
                key={logo}
                className="flex h-14 items-center justify-center rounded-xl border border-slate-100 bg-white text-sm font-bold text-slate-400 transition hover:text-slate-700 hover:border-slate-200"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── TESTIMONIALS ──────────── */}
      <section className="py-20 bg-gradient-to-b from-white to-[#fff8f1]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <AnimatedSection animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#fff1e1] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f16610]">
                What clients say
              </span>
              <h2 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight">
                Real founders. Real numbers.
              </h2>
            </div>
          </AnimatedSection>
          <TestimonialCarousel testimonials={TESTIMONIALS} />
        </div>
      </section>

      {/* ──────────── PRESS / RECOGNITION ──────────── */}
      <section className="py-14 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <p className="text-center text-xs uppercase tracking-[0.4em] text-slate-500 mb-8">
            As featured in
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PRESS_ITEMS.map((p) => (
              <div
                key={p.name}
                className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-4 text-center"
              >
                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                  {p.label}
                </p>
                <p className="mt-1.5 text-sm font-bold text-slate-700">{p.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── RADIO / MEDIA STRIP ──────────── */}
      <section className="py-12 bg-gradient-to-b from-white to-[#fff8f1]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <p className="text-center text-xs uppercase tracking-[0.4em] text-slate-500 mb-6">
            As heard on
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {RADIO_STATIONS.map((station) => (
              <span
                key={station}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm"
              >
                {station}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── FINNY PROMISES ──────────── */}
      <section className="py-20 bg-gradient-to-br from-[#0b1224] via-[#0f1a36] to-[#0b1224] text-white relative overflow-hidden">
        <div className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-[#f16610]/20 blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full bg-[#7e8bff]/20 blur-[120px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-8 relative">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <AnimatedSection animation="fade-right">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#ffd19b] backdrop-blur">
                Finny&apos;s got your back
              </span>
              <h2 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight">
                Four promises, kept every month.
              </h2>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {FINNY_PROMISES.map((promise) => (
                  <div
                    key={promise.title}
                    className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur"
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-[#ffd19b]" />
                      <div>
                        <p className="font-bold text-white">{promise.title}</p>
                        <p className="mt-1 text-sm text-white/70 leading-relaxed">{promise.copy}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-left">
              <div className="flex justify-center">
                <FinnyMascot size={280} variant="cape" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ──────────── FAQ ──────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#fff1e1] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f16610]">
                FAQ
              </span>
              <h2 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight">
                Quick answers
              </h2>
            </div>
          </AnimatedSection>

          <div className="space-y-3">
            {FAQS.map((item, idx) => (
              <FaqItem
                key={item.q}
                item={item}
                isOpen={openFaq === idx}
                onToggle={() => setOpenFaq(openFaq === idx ? -1 : idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── FINAL CTA ──────────── */}
      <section className="py-20 bg-gradient-to-br from-[#f16610] to-[#ff8a3c] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Ready to put your finance ops on autopilot?
          </h2>
          <p className="mt-4 text-lg text-white/90 max-w-xl mx-auto">
            7,000+ UAE businesses already trust us with their numbers. Your move.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-[#f16610] shadow-lg hover:-translate-y-0.5 transition"
            >
              <Phone size={16} /> WhatsApp Finny
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-white px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition"
            >
              Book a call <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
