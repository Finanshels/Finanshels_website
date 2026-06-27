'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowUpRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Phone,
  Play,
  Sparkles,
  Star,
} from 'lucide-react'
import { LEADERSHIP_TEAM, TESTIMONIALS } from '@/content/team'

const WHATSAPP_HREF =
  'https://wa.me/971521549572?text=Hi%20Team%20Finanshels%2C%20let%E2%80%99s%20talk%20finance.'

const SHELL = 'mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12'
const display = { fontFamily: 'var(--font-display)' }

const avatarUrl = (seed) =>
  `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&radius=50&backgroundColor=fff4ec`

/* ───────────────────────── illustrations ─────────────────────────
   Professional hand-drawn art (Popsy — free for commercial use), amber palette
   to sit on the Finanshels orange brand. Hotlinked the same way the page already
   loads Unsplash photos and Dicebear avatars. */
const popsy = (name) => `https://illustrations.popsy.co/amber/${name}.svg`

function PopsyArt({ name, alt, className = '' }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={popsy(name)} alt={alt} className={className} loading="lazy" />
  )
}

function IndustryCard({ card, heightClass = '' }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[28px] bg-slate-200 shadow-sm transition duration-500 hover:shadow-xl ${heightClass}`}
      style={{ backgroundImage: `url(${unsplash(card.img)})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-7">
        <p className="flex items-center gap-1.5 text-2xl font-extrabold text-white" style={display}>
          {card.name} <ArrowUpRight size={22} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </p>
        <p className="mt-1.5 max-w-xs text-sm text-white/90">{card.copy}</p>
      </div>
    </div>
  )
}

// Horizontal, snap-scrolling carousel with left/right arrow nav (desktop).
function ScrollRow({ children, ariaLabel = 'items' }) {
  const ref = useRef(null)
  const nudge = (dir) => {
    const el = ref.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }
  return (
    <div className="relative">
      <div ref={ref} className="flex snap-x gap-5 overflow-x-auto px-5 pb-4 sm:px-8 lg:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
      <button type="button" onClick={() => nudge(-1)} aria-label={`Scroll ${ariaLabel} left`} className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0b1224] shadow-md transition hover:bg-slate-50 md:flex">
        <ChevronLeft size={20} />
      </button>
      <button type="button" onClick={() => nudge(1)} aria-label={`Scroll ${ariaLabel} right`} className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0b1224] shadow-md transition hover:bg-slate-50 md:flex">
        <ChevronRight size={20} />
      </button>
    </div>
  )
}

// A label with a dotted leader line filling the gap to a value/checkmark on the right.
function LeaderRow({ label, value }) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      <span className="text-sm text-slate-700">{label}</span>
      <span aria-hidden className="flex-1 border-b border-dotted border-slate-300" />
      <span className="flex items-center whitespace-nowrap text-sm font-semibold text-[#0b1224]">{value}</span>
    </li>
  )
}

// Fades + slides its children up the first time they scroll into view.
function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function FinnyOrb({ size = 96 }) {
  return (
    <div
      className="relative inline-flex items-center justify-center rounded-[28px] bg-gradient-to-br from-[#f16610] to-[#ff8a3c] shadow-[0_18px_40px_rgba(241,102,16,0.35)]"
      style={{ width: size, height: size }}
      aria-label="Finny — Finanshels AI CFO"
      role="img"
    >
      <div className="absolute inset-1.5 rounded-[22px] bg-white/10 backdrop-blur" />
      <Bot size={size * 0.46} className="relative text-white drop-shadow" strokeWidth={1.8} />
      <Sparkles size={size * 0.2} className="absolute -top-2 -right-2 text-[#ffd19b] animate-pulse" />
    </div>
  )
}

// Bespoke, fully original animated mascot — Finny the AI CFO. Blinks, waves,
// antenna pulses, finance tokens orbit. Built from scratch (not a stock asset).
function FinnyMascot({ className = '' }) {
  return (
    <svg viewBox="0 0 360 380" className={className} role="img" aria-label="Finny, your AI CFO">
      <defs>
        <linearGradient id="finnyHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9a4d" />
          <stop offset="1" stopColor="#f16610" />
        </linearGradient>
        <linearGradient id="finnyArm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb27a" />
          <stop offset="1" stopColor="#f16610" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="180" cy="362" rx="104" ry="13" fill="#0b1224" opacity="0.07" />

      {/* orbiting finance tokens */}
      <g className="finny-orbit1">
        <circle cx="60" cy="98" r="27" fill="#fff" stroke="#f16610" strokeWidth="3" />
        <text x="60" y="104" textAnchor="middle" fontSize="15" fontWeight="800" fill="#f16610" fontFamily="var(--font-display)">AED</text>
      </g>
      <g className="finny-orbit2">
        <circle cx="302" cy="118" r="22" fill="#10b981" />
        <path d="M292 118l7 7 14-15" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="finny-twinkle"><path d="M312 58l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#ffd19b" /></g>
      <g className="finny-twinkle" style={{ animationDelay: '0.9s' }}><path d="M38 184l2.6 7 7 2.6-7 2.6-2.6 7-2.6-7-7-2.6 7-2.6z" fill="#f16610" /></g>

      {/* character */}
      <g className="finny-bob">
        {/* body / suit */}
        <path d="M120 252c0-31 27-48 60-48s60 17 60 48v58a14 14 0 0 1-14 14H134a14 14 0 0 1-14-14z" fill="#27314d" />
        {/* shirt + bowtie */}
        <path d="M180 206l20 14-20 30-20-30z" fill="#fff" />
        <path d="M180 224l-17-9v18zM180 224l17-9v18z" fill="#f16610" />
        <circle cx="180" cy="224" r="4" fill="#c9490a" />

        {/* waving left arm */}
        <g className="finny-wave">
          <rect x="107" y="228" width="22" height="64" rx="11" fill="url(#finnyArm)" />
          <circle cx="118" cy="296" r="14" fill="#ff9a4d" />
        </g>
        {/* right arm + tablet */}
        <rect x="231" y="234" width="22" height="58" rx="11" fill="url(#finnyArm)" />
        <rect x="232" y="276" width="66" height="48" rx="9" fill="#fff" stroke="#27314d" strokeWidth="3" />
        <rect x="240" y="302" width="9" height="14" rx="2" fill="#f16610" />
        <rect x="253" y="296" width="9" height="20" rx="2" fill="#f16610" />
        <rect x="266" y="290" width="9" height="26" rx="2" fill="#10b981" />
        <rect x="279" y="300" width="9" height="16" rx="2" fill="#f16610" />

        {/* head shell */}
        <rect x="98" y="74" width="164" height="150" rx="46" fill="url(#finnyHead)" />
        {/* headset */}
        <path d="M106 152c0-56 31-90 74-90s74 34 74 90" fill="none" stroke="#27314d" strokeWidth="9" strokeLinecap="round" />
        <rect x="86" y="140" width="22" height="42" rx="11" fill="#27314d" />
        <rect x="252" y="140" width="22" height="42" rx="11" fill="#27314d" />
        {/* antenna */}
        <line x1="180" y1="74" x2="180" y2="50" stroke="#27314d" strokeWidth="5" strokeLinecap="round" />
        <circle className="finny-pulse" cx="180" cy="46" r="7" fill="#10b981" />

        {/* face plate */}
        <rect x="116" y="96" width="128" height="104" rx="34" fill="#fff6ef" />
        {/* glasses */}
        <g fill="none" stroke="#27314d" strokeWidth="5">
          <rect x="128" y="120" width="44" height="38" rx="14" />
          <rect x="188" y="120" width="44" height="38" rx="14" />
          <path d="M172 138h16" />
        </g>
        {/* eyes */}
        <g className="finny-blink" fill="#27314d">
          <circle cx="150" cy="139" r="8" />
          <circle cx="210" cy="139" r="8" />
        </g>
        {/* smile + cheeks */}
        <path d="M156 176c10 11 38 11 48 0" fill="none" stroke="#27314d" strokeWidth="5" strokeLinecap="round" />
        <circle cx="138" cy="171" r="6" fill="#ffb27a" />
        <circle cx="222" cy="171" r="6" fill="#ffb27a" />
      </g>
    </svg>
  )
}

// Bespoke, consistent pillar icons (owned — not a stock set).
function PillarIcon({ name }) {
  const s = { fill: 'none', stroke: '#f16610', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' }
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff1e1]">
      <svg viewBox="0 0 48 48" className="h-7 w-7" aria-hidden="true">
        {name === 'docs' && (<g {...s}><rect x="13" y="9" width="20" height="27" rx="3" /><path d="M18 17h10M18 23h10M18 29h6" /><path d="M29 33l4 4 7-8" stroke="#10b981" /></g>)}
        {name === 'calendar' && (<g {...s}><rect x="10" y="13" width="28" height="25" rx="4" /><path d="M10 20h28M18 9v6M30 9v6" /><circle cx="24" cy="28" r="6" stroke="#10b981" /><path d="M24 25v3l2.5 2" stroke="#10b981" /></g>)}
        {name === 'chart' && (<g {...s}><path d="M12 37V11M12 37h25" /><rect x="17" y="27" width="4.5" height="7" rx="1" fill="#f16610" /><rect x="26" y="21" width="4.5" height="13" rx="1" fill="#f16610" /><rect x="35" y="15" width="4.5" height="19" rx="1" fill="#10b981" stroke="#10b981" /></g>)}
        {name === 'target' && (<g {...s}><circle cx="23" cy="25" r="13" /><circle cx="23" cy="25" r="7" /><circle cx="23" cy="25" r="1.8" fill="#f16610" /><path d="M33 15l6-6M35 9h4v4" stroke="#10b981" /></g>)}
      </svg>
    </span>
  )
}

// The signature "money thread": an orange line that draws itself as the section
// scrolls through the viewport, with numbered nodes and alternating step cards.
function MoneyThread() {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const p = (vh * 0.5 - rect.top) / rect.height
      setProgress(Math.max(0, Math.min(1, p)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return (
    <div ref={ref} className="relative mx-auto mt-16 max-w-5xl">
      <div className="pointer-events-none absolute bottom-0 left-5 top-0 w-[3px] -translate-x-1/2 rounded-full bg-[#f16610]/15 md:left-1/2" />
      <div className="pointer-events-none absolute left-5 top-0 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#ff9a4d] to-[#f16610] md:left-1/2" style={{ height: `${progress * 100}%` }}>
        <span className="absolute -bottom-1.5 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-[#f16610] shadow-[0_0_0_6px_rgba(241,102,16,0.18)]" />
      </div>

      <div className="space-y-12 md:space-y-20">
        {ADVANTAGE_ROWS.map((step, i) => {
          const left = i % 2 === 0
          return (
            <div key={step.tag} className="relative md:grid md:grid-cols-2 md:gap-12">
              <div className="absolute left-5 top-0 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#f16610] bg-white text-sm font-extrabold text-[#f16610] md:left-1/2" style={display}>
                {`0${i + 1}`}
              </div>
              <Reveal className={left ? 'ml-14 md:ml-0 md:pr-14 md:text-right' : 'ml-14 md:col-start-2 md:ml-0 md:pl-14'}>
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className={`flex items-center gap-3 ${left ? 'md:flex-row-reverse' : ''}`}>
                    <PillarIcon name={step.icon} />
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#f16610]">{step.tag}</p>
                  </div>
                  <p className="mt-3 text-2xl font-extrabold leading-tight text-[#0b1224]" style={display}>{step.title}</p>
                  <p className="mt-3 leading-relaxed text-slate-600">{step.copy}</p>
                </div>
              </Reveal>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ───────────────────────── data ───────────────────────── */

const AUDIENCE_PILLS = [
  'Freelancers', 'Solo founders', 'Online sellers', 'Startups', 'Real estate brokers',
  'Property managers', 'Restaurants', 'Agencies', 'Consultants', 'Coaches',
  'Clinics', 'Retail stores', 'Event planners', 'Fitness studios', 'Holding companies',
  'Service businesses', 'Creators', 'Importers & exporters', 'Family offices', 'Influencers',
]

const INDUSTRY_CARDS = [
  { name: 'Retailers', copy: 'Know what sold, what is left, and what to reorder.', img: 'photo-1441986300917-64674bd600d8' },
  { name: 'Restaurants', copy: 'Stay with your guests, not the back office.', img: 'photo-1517248135467-4c7edcad34c4' },
  { name: 'Agencies', copy: 'See revenue, collections, and profit by project.', img: 'photo-1552664730-d307ca884978' },
  { name: 'Startups', copy: 'Investor-ready numbers that update fast.', img: 'photo-1556761175-5973dc0f32e7' },
  { name: 'Online sellers', copy: 'Know your gross profit by SKU.', img: 'photo-1556742502-ec7c0e9f34b1' },
]

const SERVICE_CARDS = [
  { title: 'Accounting', copy: 'Accurate monthly financial reports, structured around how your business actually runs.', href: '/solutions/bookkeeping', art: 'calculator' },
  { title: 'Tax & Compliance', copy: 'Registration, prep, and filing done right and on time — so penalties never reach your inbox.', href: '/solutions/corporate-tax-filing', art: 'studying' },
  { title: 'Financial & data analysis', copy: 'We turn reports into decisions: clean budgets, sharp forecasts, and the metrics that matter.', href: '/solutions/fractional-cfo', art: 'presentation', soon: true },
]

const ADVANTAGE_ROWS = [
  {
    tag: 'Documents, sorted',
    icon: 'docs',
    title: 'You did not become a founder to chase receipts.',
    copy: 'Finny plugs into your inbox, bank feeds, and ERP to pull every invoice, receipt, and statement — then sorts and reconciles them quietly in the background, so your books are clean before you open your laptop.',
  },
  {
    tag: 'Deadlines, tracked',
    icon: 'calendar',
    title: '“Wait — when was that due again?” Never again.',
    copy: 'Every recurring due date — Corporate Tax, VAT, payroll, renewals — lands on one internal calendar. You get a calm, well-timed nudge with everything already prepped and ready to file.',
  },
  {
    tag: 'Numbers, nailed',
    icon: 'chart',
    title: 'You have the numbers. Now they mean something.',
    copy: 'Your data becomes clean, simple financial reports with deeper analysis on request — so you always know exactly where the business stands, at any moment.',
  },
  {
    tag: 'Plans, precise',
    icon: 'target',
    title: 'Big decisions deserve better than a blind guess.',
    copy: 'Finny does not just record what happened — it helps you plan what comes next. From forecasts to scenario models, you get the answer before you even ask the question.',
  },
]

const TEAM_MEMBERS = LEADERSHIP_TEAM.slice(0, 8)

// Reviews carousel — a mix of written reviews and (dummy) video testimonials.
// Video thumbnails are placeholder Unsplash portraits until real videos exist.
const REVIEWS = [
  { type: 'video', name: 'Priya M Nair', role: 'Founder, ZWAG AI', company: 'ZWAG AI', duration: '2:14', img: 'photo-1494790108377-be9c29b29330' },
  { type: 'text', name: 'Nassib Sawaya', role: 'Director, UAE Business', quote: TESTIMONIALS[1].quote },
  { type: 'video', name: 'Elie Ronin', role: 'Co-Founder', company: 'Ronin Labs', duration: '1:08', img: 'photo-1500648767791-00dcc994a43e' },
  { type: 'text', name: 'Sami Khan', role: 'CEO, desertcart.ae', quote: TESTIMONIALS[5].quote },
  { type: 'video', name: 'Ranya Al Suwaidi', role: 'Founder, Bloom Cafe', company: 'Bloom Cafe', duration: '0:47', img: 'photo-1573497019940-1c28c88b4f3e' },
  { type: 'text', name: 'Leena Kurian', role: 'Co-founder, Atlas Clinics', quote: TESTIMONIALS[6].quote },
  { type: 'video', name: 'Ahmed Khalil', role: 'CEO, Greenfield Properties', company: 'Greenfield', duration: '1:32', img: 'photo-1519085360753-af0119f7cbe7' },
  { type: 'text', name: 'Rohan Mehta', role: 'Managing Partner, Premier Realty', quote: TESTIMONIALS[3].quote },
]

const STATS = [
  { to: 6000, suffix: '+', label: 'UAE businesses served' },
  { to: 50000, suffix: '+', label: 'Filings & reports delivered' },
  { to: 6, suffix: ' hrs', label: 'Avg. response time' },
  { to: 5, suffix: '.0', label: 'Average client rating' },
]

// Discrete, evenly-spaced slider stops (non-linear values, like skrooge's slider).
const TXN_STOPS = [0, 10, 30, 50, 75, 100, 150, 200, 300, 500]

const PRICING_TIERS = [
  { max: 0, price: 0 },
  { max: 25, price: 749 },
  { max: 75, price: 999 },
  { max: 150, price: 1499 },
  { max: 300, price: 2299 },
  { max: 500, price: 3299 },
]

const PRICING_INCLUDED = [
  { group: 'Accounting', items: ['Transaction capture & categorisation', 'Bank & payment reconciliation', 'Payroll & gratuity calculation', 'Accounts receivable & payable tracking', 'Monthly P&L, Cash Flow & Balance Sheet'] },
  { group: 'Tax', items: ['VAT registration & filing', 'Corporate Tax registration & filing', 'Tax authority liaison & reconciliation', '1 hour of tax advisory each month'] },
  { group: 'Operational support', items: ['A dedicated accounting pod', 'Finanshels app + Zoho Books access', '6 business-hour response SLA'] },
]

const ONE_TIME_SERVICES = [
  { name: 'Corporate Tax registration', price: 'from AED 399' },
  { name: 'Corporate Tax filing', price: 'from AED 499' },
  { name: 'VAT filing', price: 'from AED 499' },
  { name: 'AML registration', price: 'from AED 1,999' },
  { name: 'Audit support', price: 'from AED 2,999' },
  { name: 'Company liquidation', price: 'from AED 9,999' },
]

const FAQS = [
  { q: 'Is Finny a real person or software?', a: 'Both, working together. Finny is the AI layer that fetches, sorts, reconciles, and reminds — and behind it sits a qualified chartered accountant who owns your reports and signs off on every filing.' },
  { q: 'Do I still have to manage anything myself?', a: 'Very little. Once you are onboarded, your pod and Finny handle the monthly rhythm. You approve, ask questions on WhatsApp, and get on with running the business.' },
  { q: 'Can you help if my books are a mess — or do not exist yet?', a: 'Absolutely. Backlog clean-ups are our bread and butter. Whether you are a few months behind or starting from a blank slate, we rebuild your ledger and bring you current.' },
  { q: 'How is this different from a traditional accounting firm in Dubai?', a: 'Traditional firms handle the basics. We handle the basics, the reminders, the dashboards, and the strategic calls — delivered through automation and tight operational processes.' },
  { q: 'How much do accounting services cost in the UAE?', a: 'It depends on transaction volume, entities, and whether VAT and Corporate Tax are bundled. Most teams land between AED 749 and AED 3,000+ a month, fixed after a 20-minute scoping call.' },
  { q: 'What types of business is Finanshels best for?', a: 'Freelancers, startups, e-commerce sellers, property managers, restaurants, agencies, clinics, holding companies, and family offices — across the UAE and wider MENA.' },
]

const unsplash = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`

/* ───────────────────────── small components ───────────────────────── */

// Thin top scroll-progress bar.
function ScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setP(max > 0 ? (h.scrollTop / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-1">
      <div className="h-full bg-gradient-to-r from-[#ff9a4d] to-[#f16610] transition-[width] duration-150 ease-out" style={{ width: `${p}%` }} />
    </div>
  )
}

// Counts a number up the first time it scrolls into view.
function CountUp({ to, prefix = '', suffix = '', duration = 1600 }) {
  const ref = useRef(null)
  const [val, setVal] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now) => {
            const t = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - t, 3)
            setVal(Math.round(to * eased))
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [to, duration])
  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString()}
      {suffix}
    </span>
  )
}

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <button onClick={onToggle} className="w-full text-left rounded-[18px] border border-slate-200 bg-white px-6 py-5 transition hover:border-[#f16610]/40 hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <p className="text-base font-semibold text-[#0b1224]">{item.q}</p>
        <span className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition ${isOpen ? 'bg-[#f16610] text-white' : 'bg-[#fff1e1] text-[#f16610]'}`}>
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </div>
      {isOpen && <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>}
    </button>
  )
}

export default function Home4() {
  const [openFaq, setOpenFaq] = useState(0)
  const [stopIndex, setStopIndex] = useState(4)
  const [noTxns, setNoTxns] = useState(false)
  const txns = TXN_STOPS[stopIndex]

  const price = useMemo(() => {
    if (noTxns || txns === 0) return 0
    const tier = PRICING_TIERS.find((t) => txns <= t.max) ?? PRICING_TIERS[PRICING_TIERS.length - 1]
    return tier.price
  }, [txns, noTxns])

  return (
    <main className="bg-white text-[#0b1224]">
      <ScrollProgress />
      <style>{`
        @keyframes home4-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .home4-marquee-track { display:flex; width:max-content; animation: home4-marquee 32s linear infinite; }
        @keyframes home4-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes home4-float-sm { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        @keyframes home4-sway { 0%,100% { transform: translateY(0) rotate(-1.2deg); } 50% { transform: translateY(-10px) rotate(1.2deg); } }
        @keyframes home4-bar { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .home4-float { animation: home4-float 6s ease-in-out infinite; }
        .home4-float-sm { animation: home4-float-sm 5s ease-in-out infinite; }
        .home4-sway { animation: home4-sway 7s ease-in-out infinite; transform-origin: center bottom; }
        .home4-bar { transform-origin: bottom; animation: home4-bar .7s ease-out both; }
        /* bespoke Finny mascot */
        @keyframes finny-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        @keyframes finny-blink { 0%,90%,100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
        @keyframes finny-wave { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(20deg); } }
        @keyframes finny-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.45; transform: scale(1.6); } }
        @keyframes finny-twinkle { 0%,100% { opacity: 0.2; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1); } }
        @keyframes finny-orbit1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes finny-orbit2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(12px); } }
        .finny-bob { animation: finny-bob 5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        .finny-blink { animation: finny-blink 5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        .finny-wave { animation: finny-wave 2.6s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 0%; }
        .finny-pulse { animation: finny-pulse 2s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        .finny-twinkle { animation: finny-twinkle 2.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        .finny-orbit1 { animation: finny-orbit1 6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        .finny-orbit2 { animation: finny-orbit2 7s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        @media (prefers-reduced-motion: reduce) {
          .home4-float, .home4-float-sm, .home4-sway, .home4-marquee-track, .home4-bar,
          .finny-bob, .finny-blink, .finny-wave, .finny-pulse, .finny-twinkle, .finny-orbit1, .finny-orbit2 { animation: none !important; }
        }
      `}</style>

      {/* sticky side Pricing button */}
      <a
        href="#pricing"
        className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center justify-center rounded-full bg-[#7e8bff] px-1 text-white shadow-xl transition hover:scale-105 lg:flex"
        style={{ width: 64, height: 64 }}
      >
        <span className="text-lg font-bold">$</span>
        <span className="text-[9px] font-semibold uppercase tracking-wide">Pricing</span>
      </a>

      {/* ──────────── HERO (centered · illustration + floating cards) ──────────── */}
      <section className="relative overflow-hidden bg-[#fff8f1] pt-28 pb-20 md:pt-32">
        <div className="absolute -top-24 left-1/2 h-[460px] w-[760px] -translate-x-1/2 rounded-full bg-[#f16610]/8 blur-[150px]" />
        <div className="absolute right-[8%] top-40 h-[280px] w-[280px] rounded-full bg-[#7e8bff]/10 blur-[120px]" />
        <div className="absolute left-[6%] top-24 h-[240px] w-[240px] rounded-full bg-amber-300/15 blur-[120px]" />
        <div className={`relative ${SHELL}`}>
          {/* illustration with floating cards */}
          <div className="relative mx-auto mb-12 max-w-[880px]">
            <FinnyMascot className="mx-auto w-full max-w-[380px]" />

            {/* profit card (top-right) */}
            <div className="home4-float-sm absolute right-0 top-0 hidden rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xl sm:block lg:right-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white">+27%</span>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Profit</p>
                  <p className="text-lg font-extrabold text-[#0b1224]" style={display}>AED 25,100</p>
                </div>
              </div>
              <div className="mt-2 flex items-end gap-[3px]">
                {[5, 7, 6, 9, 8, 11, 10, 13, 12, 15, 14, 17].map((h, i) => (
                  <div key={i} className="home4-bar w-1.5 rounded-sm bg-emerald-500" style={{ height: h * 2, animationDelay: `${i * 60}ms` }} />
                ))}
              </div>
            </div>

            {/* VAT / reports card (left) */}
            <div className="home4-float-sm absolute left-0 top-1/4 hidden max-w-[230px] rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xl sm:block lg:left-6" style={{ animationDelay: '1.2s' }}>
              <p className="flex items-center gap-2 text-xs text-slate-700"><span>🗓️</span> VAT return due in 2 weeks.</p>
              <p className="mt-2 flex items-center gap-2 text-xs text-slate-700"><CheckCircle2 size={14} className="text-emerald-500" /> Reports ready for review and filing.</p>
            </div>

            {/* Finny chat bubble (bottom-right) */}
            <div className="home4-float-sm absolute -right-1 bottom-2 hidden max-w-[240px] rounded-2xl rounded-br-sm border border-slate-100 bg-white p-3.5 shadow-xl sm:block lg:right-4" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center gap-2">
                <FinnyOrb size={22} />
                <p className="text-xs font-bold text-[#0b1224]">Finny</p>
              </div>
              <p className="mt-1.5 text-xs italic text-slate-600">Margins are up 20% this quarter. Want a quick breakdown of why?</p>
            </div>
          </div>

          {/* trust pill */}
          <div className="mx-auto flex w-fit items-center gap-2.5 rounded-full border border-amber-200 bg-white px-5 py-2.5 shadow-sm">
            <span>🤝</span>
            <p className="text-sm font-semibold text-slate-700">Trusted by 7,000+ businesses</p>
            <span className="text-slate-300">·</span>
            <span className="text-sm font-bold text-slate-700">5.0</span>
            <div className="flex">{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} className="fill-amber-500 text-amber-500" />)}</div>
          </div>

          {/* heading */}
          <h1 className="mx-auto mt-7 max-w-4xl text-center text-[clamp(2.4rem,5.6vw,4.6rem)] font-extrabold leading-[1.05] text-[#f16610]" style={display}>
            Hassle-free, AI-powered accounting &amp; tax in the UAE
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg text-slate-600">
            Senior accountants backed by Finny, our AI CFO. Half the cost, same-day replies, no last-minute chaos.
          </p>

          <div className="mt-9 flex flex-col items-center gap-4">
            <a href={WHATSAPP_HREF} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f16610] px-10 py-4 text-base font-bold text-white shadow-[0_16px_30px_rgba(241,102,16,0.35)] transition hover:-translate-y-0.5 hover:bg-[#e0571a]" style={display}>
              Let&apos;s Get Started!
            </a>
            <a href="#pricing" className="text-sm font-bold text-[#f16610] hover:underline" style={display}>See Pricing</a>
          </div>
        </div>
      </section>

      {/* ──────────── STATS BAND (count-up) ──────────── */}
      <section className="border-y border-[#f16610]/10 bg-white py-12">
        <div className={`${SHELL} grid grid-cols-2 gap-8 text-center md:grid-cols-4`}>
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-extrabold text-[#f16610] md:text-5xl" style={display}>
                <CountUp to={stat.to} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────── BUILT FOR ──────────── */}
      <section className="py-20">
        <div className={SHELL}>
          <h2 className="mx-auto max-w-3xl text-center text-3xl font-extrabold text-[#0b1224] md:text-4xl" style={display}>
            Built for UAE businesses that like their accounting clean and processes tight
          </h2>
        </div>

        {/* marquee */}
        <div className="relative my-12 overflow-hidden">
          <div className="home4-marquee-track">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center">
                {AUDIENCE_PILLS.map((pill) => (
                  <span key={pill + dup} className="mx-5 whitespace-nowrap text-2xl font-bold text-[#f16610]/35" style={display}>
                    {pill} <span className="mx-1 text-[#f16610]/25">•</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className={`relative ${SHELL}`}>
          {/* staggered / offset masonry — columns sit at different heights */}
          <div className="grid gap-5 md:grid-cols-2 md:items-start">
            {/* LEFT column */}
            <div className="flex flex-col gap-5">
              <IndustryCard card={INDUSTRY_CARDS[0]} heightClass="h-[300px] md:h-[460px]" />
              <IndustryCard card={INDUSTRY_CARDS[2]} heightClass="h-[300px]" />
              <IndustryCard card={INDUSTRY_CARDS[4]} heightClass="h-[300px] md:h-[340px]" />
            </div>

            {/* RIGHT column — pushed down for the asymmetric stagger */}
            <div className="flex flex-col gap-5 md:mt-24">
              <IndustryCard card={INDUSTRY_CARDS[1]} heightClass="h-[300px] md:h-[400px]" />
              <IndustryCard card={INDUSTRY_CARDS[3]} heightClass="h-[300px]" />

              {/* not sure where you fit */}
              <div className="flex flex-col items-center justify-center rounded-[28px] border border-[#f16610]/25 bg-[#fff8f1] p-8 text-center">
                <PopsyArt name="customer-support" alt="Talk to the Finanshels team" className="home4-float-sm w-40" />
                <p className="mt-4 max-w-xs text-lg font-bold text-[#0b1224]" style={display}>Not sure where you fit?</p>
                <p className="mt-1 text-sm text-slate-600">Let&apos;s talk — we&apos;ll figure it out with you.</p>
                <a href={WHATSAPP_HREF} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f16610] px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5" style={display}>Book a free call</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── TESTIMONIALS ──────────── */}
      <section className="bg-white py-20">
        <div className={SHELL}>
          <h2 className="text-center text-4xl font-extrabold text-[#0b1224] md:text-5xl" style={display}>Trusted By Entrepreneurs</h2>
          <p className="mt-3 text-center text-lg font-semibold text-slate-500">Success stories from businesses like yours</p>
        </div>

        <div className="mt-12">
          <ScrollRow ariaLabel="reviews">
            {REVIEWS.map((r) =>
              r.type === 'video' ? (
                <div key={r.name} className="relative h-[440px] w-[300px] shrink-0 snap-start overflow-hidden rounded-[24px] bg-slate-800 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={unsplash(r.img)} alt={r.name} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/25" />
                  <span className="absolute right-3 top-3 rounded-md bg-black/55 px-2 py-0.5 text-xs font-semibold text-white">{r.duration}</span>
                  <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 ring-1 ring-white/50 backdrop-blur-sm transition group-hover:scale-105">
                    <Play size={24} className="ml-0.5 fill-white text-white" />
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/70">{r.company}</p>
                    <p className="mt-1 text-lg font-bold text-white" style={display}>{r.name}</p>
                    <p className="text-xs text-white/80">{r.role}</p>
                  </div>
                </div>
              ) : (
                <div key={r.name} className="flex h-[440px] w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex">{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} className="fill-amber-500 text-amber-500" />)}</div>
                  <p className="mt-4 flex-1 overflow-hidden text-sm leading-relaxed text-slate-700">{r.quote}</p>
                  <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatarUrl(r.name)} alt={r.name} className="h-11 w-11 rounded-full bg-[#fff4ec]" loading="lazy" />
                    <div>
                      <p className="text-sm font-bold text-[#0b1224]">{r.name}</p>
                      <p className="text-xs text-slate-500">{r.role}</p>
                    </div>
                  </div>
                </div>
              )
            )}
          </ScrollRow>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-2.5 shadow-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff1e1] text-xs font-bold text-[#f16610]">F</span>
            <p className="text-sm font-semibold text-slate-700">Finanshels Accounting Services</p>
            <span className="text-sm font-bold text-slate-700">5.0</span>
            <div className="flex">{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={13} className="fill-amber-500 text-amber-500" />)}</div>
            <span className="text-xs text-slate-500">Based on 200+ reviews</span>
          </div>
        </div>
      </section>

      {/* ──────────── ALL YOUR NEEDS COVERED ──────────── */}
      <section className="bg-[#fff8f1] py-20">
        <div className={SHELL}>
          <h2 className="mx-auto max-w-3xl text-center text-4xl font-extrabold text-[#0b1224] md:text-5xl" style={display}>All Your Needs Covered</h2>
          <p className="mt-3 text-center text-lg text-slate-600">Everything we take care of, so you don&apos;t have to.</p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {SERVICE_CARDS.map((card) => (
              <div key={card.title} className="relative rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1.5 hover:shadow-xl">
                {card.soon && <span className="absolute right-6 top-6 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">Coming soon</span>}
                <PopsyArt name={card.art} alt={card.title} className="home4-float-sm h-32 w-36 object-contain" />
                <p className="mt-5 text-2xl font-bold text-[#0b1224]" style={display}>{card.title}</p>
                <p className="mt-3 leading-relaxed text-slate-600">{card.copy}</p>
                {!card.soon && <Link href={card.href} className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#f16610] hover:underline">Learn more <ArrowUpRight size={15} /></Link>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── MEET FINNY (quote two-col · team carousel) ──────────── */}
      <section className="bg-white py-20">
        <div className={SHELL}>
          <h2 className="text-center text-4xl font-extrabold text-[#0b1224] md:text-5xl" style={display}>Meet Finny</h2>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
            <div className="relative">
              <span className="absolute -left-2 -top-8 text-[120px] leading-none text-[#7e8bff]/30" style={display}>&ldquo;</span>
              <p className="relative pl-8 text-2xl font-bold leading-snug text-[#0b1224] md:text-3xl" style={display}>
                Good decisions come from clean numbers. Fast ones come from having them ready. I&apos;m built for both.
              </p>
              <p className="mt-5 pl-8 text-right text-lg font-semibold text-slate-500" style={display}>— Finny</p>
            </div>
            <div className="lg:border-l lg:border-slate-200 lg:pl-10">
              <p className="text-xl font-bold text-[#0b1224]" style={display}>Your expert accounting team, supercharged by clever tech.</p>
              <p className="mt-4 leading-relaxed text-slate-600">
                You work with a qualified chartered accountant who actually gets your business — backed by Finny, the AI CFO who sorts, reconciles, files and reminds without breaking a sweat.
              </p>
              <a href={WHATSAPP_HREF} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-1.5 text-base font-bold text-[#f16610] hover:underline" style={display}>
                Talk to the accounting team <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* team carousel */}
        <div className="mt-12">
          <ScrollRow ariaLabel="team">
            <div className="w-[230px] shrink-0 snap-start">
              <div className="relative flex items-center justify-center overflow-hidden rounded-[20px] border border-[#f16610]/20 bg-gradient-to-b from-[#fff1e1] to-[#ffd9b8]" style={{ height: 280 }}>
                <FinnyOrb size={92} />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4">
                  <p className="text-lg font-bold text-white" style={display}>Finny — AI CFO</p>
                </div>
              </div>
              <p className="mt-3 px-1 text-sm text-slate-600">Your AI CFO that never rests and makes no mistakes.</p>
            </div>
            {TEAM_MEMBERS.map((m) => (
              <div key={m.name} className="w-[230px] shrink-0 snap-start">
                <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-b from-slate-100 to-slate-300" style={{ height: 280 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.image || avatarUrl(m.name)} alt={m.name} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-lg font-bold text-white" style={display}>{m.name}</p>
                    <p className="text-[11px] text-white/80">{m.role}</p>
                  </div>
                </div>
                <p className="mt-3 px-1 text-sm text-slate-600">{m.bio}</p>
              </div>
            ))}
          </ScrollRow>
        </div>
      </section>

      {/* ──────────── FINNY ADVANTAGE (illustrated rows) ──────────── */}
      <section className="bg-white pt-16">
        <div className={SHELL}>
          <h2 className="text-center text-4xl font-extrabold text-[#0b1224] md:text-5xl" style={display}>The Finny Advantage</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-600">Four things Finny quietly handles end-to-end — follow the thread.</p>

          <MoneyThread />
        </div>

        {/* scalloped divider into pricing */}
        <div
          aria-hidden="true"
          className="mt-20 h-6 w-full"
          style={{
            backgroundColor: '#ffffff',
            backgroundImage: 'radial-gradient(circle at 16px 24px, #fff8f1 15px, transparent 16px)',
            backgroundSize: '32px 24px',
            backgroundRepeat: 'repeat-x',
          }}
        />
      </section>

      {/* ──────────── PRICING (single column · dotted-leader lists) ──────────── */}
      <section id="pricing" className="bg-[#fff8f1] py-20">
        <div className={SHELL}>
          <h2 className="text-center text-4xl font-extrabold text-[#0b1224] md:text-5xl" style={display}>Clear pricing. No fluff. No surprises.</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-lg text-slate-600">Accounting &amp; Tax package priced by your monthly transactions.</p>

          <div className="mx-auto mt-12 max-w-3xl">
            <div className="border-t border-dashed border-slate-300" />

            {/* transactions value + no-transactions checkbox */}
            <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-base font-semibold text-slate-700">Transactions per month:</span>
                <span className="inline-flex min-w-[68px] justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-lg font-extrabold text-[#0b1224]" style={display}>
                  {noTxns ? '—' : (txns >= 500 ? '500+' : txns)}
                </span>
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                or I don&apos;t have transactions yet
                <input type="checkbox" checked={noTxns} onChange={(e) => setNoTxns(e.target.checked)} className="h-5 w-5 accent-[#f16610]" />
              </label>
            </div>

            {/* slider + evenly-spaced tick labels */}
            <div className="mt-6">
              <input type="range" min={0} max={TXN_STOPS.length - 1} step={1} value={stopIndex} disabled={noTxns} onChange={(e) => setStopIndex(Number(e.target.value))} className="w-full accent-[#f16610] disabled:opacity-40" aria-label="Transactions per month" />
              <div className="mt-2 flex justify-between text-xs font-semibold text-slate-500">
                {TXN_STOPS.map((t, i) => (
                  <span key={t} className={!noTxns && i === stopIndex ? 'text-[#f16610]' : ''}>{t === 500 ? '500+' : t}</span>
                ))}
              </div>
            </div>

            {/* price */}
            <div className="mt-10 text-center">
              {price === 0 ? (
                <p className="text-3xl font-extrabold text-[#f16610] md:text-4xl" style={display}>Let&apos;s scope it together</p>
              ) : (
                <p className="text-5xl font-extrabold text-[#f16610] md:text-6xl" style={display}>
                  AED {price.toLocaleString()}<span className="align-super text-2xl">/m</span>
                </p>
              )}
              <p className="mt-3 text-base text-slate-600">Billed quarterly. VAT excluded.</p>
            </div>

            {/* full-width CTA */}
            <a href={WHATSAPP_HREF} target="_blank" rel="noreferrer" className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f16610] px-6 py-4 text-base font-bold text-white shadow-[0_16px_30px_rgba(241,102,16,0.3)] transition hover:-translate-y-0.5 hover:bg-[#e0571a]" style={display}>
              Let&apos;s Get Started
            </a>

            <div className="mt-10 border-t border-dashed border-slate-300" />

            {/* everything included */}
            <h3 className="mt-9 text-xl font-extrabold text-[#0b1224]" style={display}>Everything you need is included:</h3>
            <div className="mt-6 space-y-7">
              {PRICING_INCLUDED.map((group) => (
                <div key={group.group}>
                  <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#7e8bff]">{group.group}</p>
                  <ul className="mt-2">
                    {group.items.map((item) => (
                      <LeaderRow key={item} label={item} value={<Check size={18} strokeWidth={3} className="text-emerald-600" />} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* one-time & specialised services card */}
            <div className="mt-10 rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-lg font-extrabold text-[#0b1224]" style={display}>One-time &amp; specialised services</p>
              <p className="mt-1 text-sm text-slate-500">Standalone prices — many are already covered inside your monthly package.</p>
              <ul className="mt-4">
                {ONE_TIME_SERVICES.map((svc) => (
                  <LeaderRow key={svc.name} label={svc.name} value={svc.price} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── CTA BANNER ──────────── */}
      <section className="bg-white py-16">
        <div className={SHELL}>
          <div className="overflow-hidden rounded-[36px] bg-gradient-to-br from-[#f16610] to-[#ff8a3c] p-10 text-center text-white shadow-[0_36px_80px_rgba(241,102,16,0.35)] md:p-14">
            <h2 className="mx-auto max-w-3xl text-3xl font-extrabold md:text-4xl" style={display}>Let&apos;s take the weight of accounting off your plate.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">Accounting, tax prep, and financial guidance — handled properly, and never in a rush.</p>
            <a href={WHATSAPP_HREF} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-white px-9 py-4 text-base font-bold text-[#f16610] shadow-lg transition hover:-translate-y-0.5" style={display}><Phone size={18} /> Book Your Call Now</a>
          </div>
        </div>
      </section>

      {/* ──────────── FAQ ──────────── */}
      <section className="bg-[#fff8f1] py-20">
        <div className={SHELL}>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-4xl font-extrabold text-[#0b1224] md:text-5xl" style={display}>Frequently Asked Questions</h2>
            <p className="mt-4 text-center text-sm text-slate-600">
              Still have questions? Email <a href="mailto:contact@finanshels.com" className="font-semibold text-[#f16610] hover:underline">contact@finanshels.com</a> or message us on WhatsApp.
            </p>
            <div className="mt-10 space-y-3">
              {FAQS.map((item, idx) => (
                <FaqItem key={item.q} item={item} isOpen={openFaq === idx} onToggle={() => setOpenFaq(openFaq === idx ? -1 : idx)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── FOOTER TAGLINE BAND ──────────── */}
      <section className="relative overflow-hidden bg-[#0b1224] py-24 text-white">
        <div className="absolute -top-20 left-1/3 h-[360px] w-[360px] rounded-full bg-[#f16610]/20 blur-[120px]" />
        <div className={`relative ${SHELL} text-center`}>
          <FinnyOrb size={84} />
          <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold md:text-6xl" style={display}>You run your business. Finny minds the books.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">7,000+ UAE businesses already trust us with their numbers. Your move.</p>
          <a href={WHATSAPP_HREF} target="_blank" rel="noreferrer" className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#f16610] px-9 py-4 text-base font-bold text-white shadow-lg shadow-[#f16610]/40 transition hover:-translate-y-0.5" style={display}><Phone size={18} /> WhatsApp Finny</a>
        </div>
      </section>
    </main>
  )
}
