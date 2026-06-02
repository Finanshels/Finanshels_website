import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  ShieldCheck,
  Sparkles,
  BarChart3,
  FileText,
  Activity,
  MessageSquare,
  Calculator,
  TrendingUp,
  Bell,
  Zap,
  CheckCircle2,
  Globe2,
} from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import { Card } from '../components/ui/Card'
import TestimonialCarousel from '../components/TestimonialCarousel'
import { TESTIMONIALS } from '../data/team'

const HERO_BULLETS = [
  'Accounting, Bookkeeping, VAT, Corporate Tax, AML & CFO — all in one place',
  'FTA-registered. Books closed by Day 10, every month',
  'Backed by MBRIF, in5 Tech, and Kube VC. Recognised by Gulf News',
]

const HERO_STATS = [
  { value: '6,000+', label: 'UAE businesses trust us' },
  { value: 'AED 499', label: 'starting per month' },
  { value: 'Day 10', label: 'books closed every month' },
  { value: '4.9★', label: 'on Trustpilot · 280+ reviews' },
]

const CUSTOMER_LOGOS = ['Hub71', 'YAP', 'Baraka', 'Letswork', 'Sarwa', 'Rain', 'Pyypl', 'Tabby', 'FOO', 'Lune']

const COMMAND_TILES = [
  {
    key: 'pnl',
    span: 'md:col-span-2 md:row-span-2',
    accent: 'from-[#fff3e6] to-white',
    badge: 'Accounting & Bookkeeping',
    title: 'Every transaction recorded. Books always current, never catching up.',
    copy: 'Every transaction recorded, categorised and reconciled weekly. Bank, PSP, and ERP feeds reconcile into a live P&L your team and board can actually read.',
    visual: 'pnl',
  },
  {
    key: 'runway',
    span: 'md:col-span-1 md:row-span-1',
    accent: 'from-[#eef2ff] to-white',
    badge: 'CFO as a Service',
    title: 'Senior financial strategy without the full-time cost',
    copy: 'Cash flow modelling, investor reporting, and pricing strategy from seasoned CFOs.',
    visual: 'runway',
  },
  {
    key: 'tax',
    span: 'md:col-span-1 md:row-span-1',
    accent: 'from-[#fff7ed] to-white',
    badge: 'VAT & Corporate Tax',
    title: 'CT, VAT — every filing on track, penalty-free',
    copy: 'Quarterly VAT returns prepared and filed. Annual CT returns with full working papers. Every UAE filing tracked and owned.',
    visual: 'tax',
  },
  {
    key: 'chat',
    span: 'md:col-span-1 md:row-span-1',
    accent: 'from-[#ecfdf5] to-white',
    badge: 'Dedicated account manager',
    title: 'Not a helpdesk queue — your dedicated team',
    copy: 'Controllers, CFO, tax lead — one WhatsApp thread, your numbers, replies in minutes.',
    visual: 'chat',
  },
  {
    key: 'board',
    span: 'md:col-span-1 md:row-span-1',
    accent: 'from-[#fef2f2] to-white',
    badge: 'Financial Controller (FCaaS)',
    title: 'Clean P&L, balance sheet, cash flow — by Day 10',
    copy: 'Full financial report every month by the 10th. In plain language, not accountant-speak.',
    visual: 'board',
  },
  {
    key: 'compliance',
    span: 'md:col-span-2 md:row-span-1',
    accent: 'from-[#f5f3ff] to-white',
    badge: 'DDA Audit · AML · Liquidation',
    title: 'Audit-ready files, AML controls, clean wind-downs',
    copy: 'Statutory audits for UAE free zone renewals, AML compliance for DNFBPs including goAML registration, and end-to-end company liquidation. The same team that closes your books defends them at audit.',
    visual: 'compliance',
  },
]

const SOLUTION_PILLARS = [
  {
    icon: Building2,
    title: 'Finance Back Office',
    copy: 'Monthly bookkeeping, Financial Controller service, AR/AP, and board-ready reporting — all delivered on one platform. Books closed by Day 10 every month.',
    accent: 'from-[#fff4ec] to-[#fff]',
    iconBg: 'bg-[#fff1e1] text-[#f16610]',
    href: '/accounting-services-dubai',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance & Tax',
    copy: 'Corporate tax registration and filing, VAT, AML compliance for DNFBPs, DDA audits, and company liquidation — handled by an FTA-accredited team.',
    accent: 'from-[#eef2ff] to-[#fff]',
    iconBg: 'bg-[#e9ecff] text-[#4f46e5]',
    href: '/corporate-tax-filing-uae',
  },
  {
    icon: Sparkles,
    title: 'CFO as a Service',
    copy: 'Senior financial strategy without the full-time cost. Cash flow modelling, investor reporting, pricing strategy, and fundraising support from seasoned CFOs.',
    accent: 'from-[#ecfdf5] to-[#fff]',
    iconBg: 'bg-[#dcfce7] text-[#059669]',
    href: '/cfo-services-dubai',
  },
]

const TIMELINE = [
  { caption: 'Onboard in 48 hours', title: 'We set up fast', copy: 'Send us your trade licence and a few documents. We connect your bank feeds, set up your accounting platform, and start your books immediately. No waiting.', icon: Zap },
  { caption: 'We handle everything monthly', title: 'Your dedicated team works', copy: 'Your dedicated accountant takes care of every transaction, every week. You\'ll hear from us when something needs your attention — not constantly, just when it matters.', icon: BarChart3 },
  { caption: 'You get the full picture on Day 10', title: 'Complete report every month', copy: 'By the 10th of every month, you receive a complete financial report. What you made, what you spent, where your cash is, and anything that warrants a closer look.', icon: Sparkles },
]

const PRODUCT_STRIP = [
  { name: 'Corporate Tax Deadline Checker', tag: 'Tax', desc: 'Check your deadline and penalty exposure in 30 seconds.', icon: FileText, href: '/products/corporate-tax-deadline-checker' },
  { name: 'Hala — finance assistant', tag: 'AI', desc: 'Ask anything about your books. Real-time insights, zero spreadsheets.', icon: Sparkles, href: '/products/hala' },
  { name: 'Financial Health Checker', tag: 'Diagnostics', desc: 'Score your books on liquidity, runway, and compliance in minutes.', icon: Activity, href: '/products/financial-health-checker' },
  { name: 'Cash Flow Scorecard', tag: 'Cash', desc: 'Live and on-demand money wisdom for founders.', icon: BarChart3, href: '/products/cash-flow-scorecard' },
  { name: 'Client Portal', tag: 'Workspace', desc: 'Real talk on startup money — no spreadsheets, all clarity.', icon: MessageSquare, href: '/products/client-portal' },
  { name: 'Gratuity Calculator (UAE)', tag: 'HR Tool', desc: 'Model end-of-service obligations in minutes.', icon: Calculator, href: '/products/gratuity-calculator-uae' },
]

const WHY_SWITCH = [
  { icon: MessageSquare, tag: 'Dedicated support', title: 'Your account manager, not a helpdesk', copy: 'One dedicated account manager who knows your business. Respond via WhatsApp, get your controller, CFO, and tax lead in the same thread.' },
  { icon: ShieldCheck, tag: 'FTA-accredited', title: 'Deep UAE regulatory knowledge', copy: 'FTA-accredited team with deep knowledge of UAE Corporate Tax, VAT, AML, and free zone compliance across DMCC, JAFZA, DIFC, ADGM, IFZA, and more.' },
  { icon: BarChart3, tag: 'Real-time dashboards', title: 'Financial dashboards integrated with your tools', copy: 'Real-time financial dashboards integrated with your existing software. 20+ KPIs. Accrual-basis bookkeeping. Accurate financial statements every month.' },
  { icon: Globe2, tag: 'Free migration', title: 'Free migration — we fix gaps too', copy: 'Switch from any accountant for free. We migrate your historical books, identify any gaps, and get you compliant from Day 1.' },
]

const CTA_LINKS = [
  { label: 'Explore solutions', href: '/solutions' },
  { label: 'View pricing', href: '/pricing' },
  { label: 'Talk to sales', href: 'mailto:contact@finanshels.com' },
]

function Sparkline({ stroke = '#f16610' }) {
  return (
    <svg viewBox="0 0 220 70" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,55 L20,48 L40,52 L60,40 L80,42 L100,30 L120,34 L140,22 L160,26 L180,14 L200,18 L220,6"
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="400"
        className="animate-dash"
      />
      <path
        d="M0,55 L20,48 L40,52 L60,40 L80,42 L100,30 L120,34 L140,22 L160,26 L180,14 L200,18 L220,6 L220,70 L0,70 Z"
        fill="url(#spark-fill)"
      />
    </svg>
  )
}

function BarChartMini() {
  const bars = [38, 54, 46, 70, 60, 84, 76, 92]
  return (
    <div className="flex items-end gap-1.5 h-16">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-2.5 rounded-t-md bg-gradient-to-t from-[#f16610] to-[#ff8a3c] animate-bar-grow"
          style={{ height: `${h}%`, animationDelay: `${i * 90}ms` }}
        />
      ))}
    </div>
  )
}

function RunwayGauge() {
  return (
    <div className="relative h-20 w-20">
      <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#eef2ff" strokeWidth="3" />
        <circle
          cx="18" cy="18" r="15.9"
          fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round"
          strokeDasharray="78,100"
          className="drop-shadow-[0_0_8px_rgba(79,70,229,0.45)]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold text-slate-900">78%</span>
        <span className="text-[10px] uppercase tracking-widest text-slate-500">on track</span>
      </div>
    </div>
  )
}

function TaxCalendar() {
  const items = [
    { label: 'CT return', date: 'Sep 30', state: 'done' },
    { label: 'VAT Q3', date: 'Oct 28', state: 'progress' },
    { label: 'Audit pack', date: 'Nov 15', state: 'queued' },
  ]
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white/80 px-3 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${item.state === 'done' ? 'bg-emerald-500' : item.state === 'progress' ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'
                }`}
            />
            <span className="font-medium text-slate-700">{item.label}</span>
          </div>
          <span className="text-slate-500">{item.date}</span>
        </div>
      ))}
    </div>
  )
}

function ChatBubble() {
  return (
    <div className="space-y-2">
      <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-[#f16610] px-3 py-2 text-xs text-white shadow-md">
        Can we close September today?
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-xs text-slate-700 shadow-md border border-slate-100">
        On it. P&amp;L draft in 2h, board pack tonight ✅
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Your CFO pod is online
      </div>
    </div>
  )
}

function BoardPack() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-900 to-slate-800 p-3 text-white shadow-inner relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(241,102,16,0.35),transparent_60%)]" />
      <div className="relative z-10 space-y-1.5">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Board pack · Oct</p>
        <p className="text-sm font-semibold leading-tight">Q3 Operating Review</p>
        <div className="flex items-end gap-2 pt-1">
          <div className="text-2xl font-bold text-[#ff8a3c]">+34%</div>
          <div className="text-[10px] text-white/70 pb-1">QoQ revenue</div>
        </div>
      </div>
    </div>
  )
}

function ComplianceVisual() {
  const rows = [
    { label: 'Audit pack — Q3 FY25', state: 'paid' },
    { label: 'AML policy review', state: 'paid' },
    { label: 'Liquidation — Newco LLC', state: 'queued' },
  ]
  return (
    <div className="space-y-1.5">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between rounded-lg bg-white/80 border border-slate-100 px-2.5 py-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#7e8bff] text-white flex items-center justify-center">
              <ShieldCheck size={11} />
            </div>
            <span className="font-medium text-slate-700">{row.label}</span>
          </div>
          {row.state === 'paid' ? (
            <CheckCircle2 size={12} className="text-emerald-500" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </div>
      ))}
    </div>
  )
}

function TileVisual({ kind }) {
  if (kind === 'pnl') {
    return (
      <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-inner space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">October P&amp;L</p>
            <p className="text-2xl font-semibold text-slate-900">AED 482,300</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
            <TrendingUp size={12} />
            +18.4%
          </span>
        </div>
        <div className="h-20"><Sparkline /></div>
        <div className="flex items-end justify-between pt-1">
          <BarChartMini />
          <div className="space-y-1 text-right">
            <p className="text-[10px] uppercase tracking-widest text-slate-400">Cash in</p>
            <p className="text-sm font-semibold text-slate-900">AED 612k</p>
          </div>
        </div>
      </div>
    )
  }
  if (kind === 'runway') {
    return (
      <div className="flex items-center gap-3">
        <RunwayGauge />
        <div className="space-y-0.5">
          <p className="text-[10px] uppercase tracking-widest text-slate-400">Burn</p>
          <p className="text-sm font-semibold text-slate-900">AED 184k/mo</p>
          <p className="text-[10px] text-emerald-600 font-medium">↓ 6% vs Sep</p>
        </div>
      </div>
    )
  }
  if (kind === 'tax') return <TaxCalendar />
  if (kind === 'chat') return <ChatBubble />
  if (kind === 'board') return <BoardPack />
  if (kind === 'compliance') return <ComplianceVisual />
  return null
}

function HeroDashboard() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[44px] bg-gradient-to-br from-[#f16610]/20 via-[#7e8bff]/20 to-transparent blur-2xl" />
      <div className="relative rounded-[36px] border border-white/70 bg-white/90 backdrop-blur-xl p-5 shadow-[0_30px_80px_-20px_rgba(15,23,42,0.25)]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            </div>
            <span className="text-xs font-semibold text-slate-500 ml-2">finanshels.app · October</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4">
          <div className="col-span-2 rounded-2xl border border-slate-100 bg-gradient-to-br from-[#fff8f1] to-white p-4 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Revenue · Oct</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-slate-900">AED 482,300</span>
              <span className="text-[11px] font-semibold text-emerald-600">+18.4%</span>
            </div>
            <div className="h-14"><Sparkline /></div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-[#eef2ff] to-white p-3 flex flex-col justify-between">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Runway</p>
            <p className="text-xl font-semibold text-slate-900">18.4<span className="text-xs text-slate-500"> mo</span></p>
            <RunwayGauge />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-3 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">UAE filings</p>
            <TaxCalendar />
          </div>
          <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-[#ecfdf5] to-white p-3 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">CFO pod</p>
            <ChatBubble />
          </div>
        </div>
      </div>

      <div className="hidden lg:flex absolute -left-10 top-16 items-center gap-2 rounded-2xl bg-white border border-slate-100 px-3 py-2 shadow-xl animate-float-slow">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center">
          <CheckCircle2 size={16} />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-900 leading-tight">VAT Q3 filed</p>
          <p className="text-[10px] text-slate-500">2 minutes ago</p>
        </div>
      </div>

      <div className="hidden lg:flex absolute -right-6 bottom-20 items-center gap-2 rounded-2xl bg-white border border-slate-100 px-3 py-2 shadow-xl animate-float" style={{ animationDelay: '1.2s' }}>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#f16610] to-[#ff8a3c] text-white flex items-center justify-center">
          <Bell size={14} />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-900 leading-tight">Board pack ready</p>
          <p className="text-[10px] text-slate-500">draft + variance</p>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="bg-[#fffdfb] text-slate-900 overflow-hidden">
      {/* HERO */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-5 sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-[#fef3eb] via-[#fffaf3] to-transparent" />
          <div className="absolute -top-20 -left-32 w-[420px] h-[420px] rounded-full bg-[#f16610]/15 blur-[120px]" />
          <div className="absolute top-40 -right-20 w-[460px] h-[460px] rounded-full bg-[#7e8bff]/20 blur-[140px] animate-pulse-slow" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 lg:items-center">
          <AnimatedSection animation="fade-right">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#f16610]/30 bg-white/70 px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] sm:tracking-[0.25em] text-[#f16610] backdrop-blur">
              <Sparkles size={13} /> Finance operators for founders
            </span>
            <h1 className="mt-5 sm:mt-6 text-[2.25rem] sm:text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.1] sm:leading-[1.05] tracking-tight">
              Your UAE back office{' '}
              <span className="sm:hidden">finance team, without </span>
              <span className="hidden sm:inline"><br />finance team,{' '}</span>
              <span className="relative inline-block">
                <span className="relative z-10 text-[#f16610]">without the headcount.</span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-[#ffd19b] -z-0 -skew-x-6" />
              </span>
            </h1>
            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Accounting, Bookkeeping, DDA Audit, VAT, Corporate Tax, AML &amp; CFO support — handled by experts, delivered on one platform. Join 6,000+ UAE businesses that trust Finanshels with their books. From AED 499/mo. No lock-in.
            </p>
            <div className="mt-6 sm:mt-7 grid gap-2.5 max-w-lg">
              {HERO_BULLETS.map((bullet) => (
                <div key={bullet} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="text-[#f16610] mt-0.5 flex-shrink-0" size={18} />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
            <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <a
                href="https://contact-finanshels.zohobookings.com/#/customer/finanshels"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-[#f16610] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#f16610]/30 hover:shadow-xl hover:shadow-[#f16610]/40 hover:-translate-y-0.5 transition-all"
              >
                Book a Free Consultation
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://wa.me/97145457841?text=Hi%20Team%20Finanshels%2C%20I%27d%20like%20to%20chat%20with%20an%20expert."
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border-2 border-slate-900 bg-white px-6 py-3.5 font-semibold text-slate-900 hover:bg-slate-900 hover:text-white transition"
              >
                <MessageSquare size={18} />
                Chat with an Expert
              </a>
            </div>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-y-3 gap-x-8 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['#f16610', '#4f46e5', '#059669', '#d946ef'].map((c, i) => (
                    <div
                      key={i}
                      className="h-7 w-7 rounded-full border-2 border-white"
                      style={{ background: `linear-gradient(135deg, ${c}, ${c}99)` }}
                    />
                  ))}
                </div>
                <span><strong className="text-slate-900">6,000+ UAE businesses</strong> trust Finanshels with their books</span>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
                <span className="text-slate-600 ml-1.5">4.9 on Trustpilot · 280+ reviews</span>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-left" delay={100}>
            <HeroDashboard />
          </AnimatedSection>
        </div>
      </section>

      {/* LOGO MARQUEE */}
      <section className="px-6 sm:px-10 lg:px-16 pb-16">
        <AnimatedSection animation="fade-up">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-xs uppercase tracking-[0.4em] text-slate-500 font-semibold mb-6">
              Trusted by modern operators across the GCC
            </p>
            <div
              className="relative overflow-hidden"
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
              }}
            >
              <div className="flex w-max gap-12 animate-marquee">
                {[...CUSTOMER_LOGOS, ...CUSTOMER_LOGOS].map((logo, i) => (
                  <span
                    key={i}
                    className="text-xl font-bold uppercase tracking-[0.18em] text-slate-400 hover:text-slate-700 transition-colors whitespace-nowrap"
                  >
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* THE PROBLEM */}
      <section className="px-6 sm:px-10 lg:px-16 py-16">
        <AnimatedSection animation="fade-up">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[32px] border border-slate-100 bg-white p-8 sm:p-12">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#f16610]/10 blur-3xl" />
            <div className="relative z-10 grid lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-red-600">
                  The problem
                </span>
                <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
                  Most UAE businesses are paying for financial problems they don&apos;t know they have.
                </h2>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  The FTA is increasingly sophisticated — cross-matching VAT returns against Corporate Tax filings, flagging anomalies in transaction data, and issuing penalties that start at AED 1,000 and scale from there.
                </p>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  Most accounting firms in the UAE hand you a login to a cloud platform and a junior bookkeeper, then disappear until year-end. Finanshels works differently.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  'Late VAT submissions — penalties accumulating without warning',
                  'CT returns filed without reconciling against VAT history',
                  'Books untouched since the last audit, not the last month',
                  'An FTA penalty letter arriving with no time to respond',
                ].map((pain) => (
                  <div key={pain} className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/50 p-4 text-sm text-slate-700">
                    <span className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center font-bold text-xs">✕</span>
                    <span>{pain}</span>
                  </div>
                ))}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 font-medium">
                  ✓ Finanshels: dedicated team, proactive compliance management, and financial reporting that tells you something useful every month.
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* BENTO COMMAND CENTRE */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                <Activity size={12} /> Inside the platform
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold max-w-3xl leading-tight tracking-tight">
                Everything your UAE business needs,{' '}
                <span className="bg-gradient-to-r from-[#f16610] to-[#ff8a3c] bg-clip-text text-transparent">one platform.</span>
              </h2>
              <p className="text-slate-600 max-w-2xl text-lg">
                Most accounting firms hand you a login and a junior bookkeeper, then disappear until year-end. Finanshels works differently — a dedicated team, proactive compliance management, and financial reporting that tells you something useful every month.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 grid-flow-row-dense gap-5 md:auto-rows-[230px]">
            {COMMAND_TILES.map((tile, i) => (
              <AnimatedSection key={tile.key} animation="fade-up" delay={i * 70} className={tile.span}>
                <div className={`group relative h-full overflow-hidden rounded-[28px] border border-slate-100 bg-gradient-to-br ${tile.accent} p-5 transition-all hover:border-[#f16610]/40 hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_rgba(241,102,16,0.25)]`}>
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-[#f16610] font-semibold">{tile.badge}</span>
                      <ArrowRight size={14} className="text-slate-300 group-hover:text-[#f16610] group-hover:translate-x-1 transition" />
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900 leading-snug">{tile.title}</h3>
                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">{tile.copy}</p>
                    <div className="mt-auto pt-3">
                      <TileVisual kind={tile.visual} />
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* DARK STATS BAND */}
      <section className="px-5 sm:px-10 lg:px-16 py-16 sm:py-20">
        <AnimatedSection animation="fade-up">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-3xl sm:rounded-[44px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 sm:p-10 lg:p-14 text-white">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#f16610]/30 blur-[120px]" />
            <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#7e8bff]/30 blur-[140px]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-12">
                <div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.32em] sm:tracking-[0.4em] text-[#ff8a3c] font-semibold">By the numbers</p>
                  <h2 className="mt-2.5 sm:mt-3 text-2xl sm:text-4xl font-semibold max-w-xl leading-tight">
                    The UAE&apos;s most trusted finance back office.
                  </h2>
                </div>
                <p className="text-slate-300 max-w-md text-sm leading-relaxed">
                  Gulf News recognised. MBRIF-backed. FTA-accredited. The same team that closes your books also files your taxes, manages your AML, and briefs your board.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
                {HERO_STATS.map((stat) => (
                  <div key={stat.label} className="space-y-1 sm:space-y-1.5 min-w-0">
                    <p className="text-[1.75rem] sm:text-4xl lg:text-5xl font-semibold tracking-tight bg-gradient-to-r from-white to-[#ff8a3c] bg-clip-text text-transparent whitespace-nowrap">
                      {stat.value}
                    </p>
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.25em] text-slate-400 leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* PILLARS */}
      <section className="px-6 sm:px-10 lg:px-16 py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                How we plug in
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">What Finanshels covers for you</h2>
              <p className="text-slate-600 max-w-2xl text-lg">
                From routine bookkeeping to complex compliance — your full finance function covered by one dedicated team. Mainland DED companies, free zone entities across DMCC, JAFZA, DIFC, ADGM, IFZA, and beyond.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {SOLUTION_PILLARS.map((pillar, i) => (
              <AnimatedSection key={pillar.title} animation="fade-up" delay={i * 100}>
                <div className={`group relative h-full overflow-hidden rounded-[32px] border border-slate-100 bg-gradient-to-br ${pillar.accent} p-7 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-25px_rgba(15,23,42,0.18)] transition-all`}>
                  <div className={`w-14 h-14 rounded-2xl ${pillar.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <pillar.icon size={26} />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 tracking-tight">{pillar.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{pillar.copy}</p>
                  <Link href={pillar.href || '/services'} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 group/link">
                    Explore services
                    <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                  <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-white/40 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU'RE GETTING */}
      <section className="px-6 sm:px-10 lg:px-16 py-16">
        <div className="max-w-6xl mx-auto space-y-10">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                What you get
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">Everything included in your subscription</h2>
              <p className="text-slate-600 max-w-2xl text-lg">
                One platform. One dedicated team. Everything your finance function needs — from Day 1.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { badge: '10×', title: 'Faster monthly close', copy: 'Accrual-basis bookkeeping delivered by Day 10 every month — not whenever someone gets around to it.' },
              { badge: '20+', title: 'Financial KPIs', copy: 'Real-time dashboards with the metrics that matter: revenue, burn, runway, margins, and cash position.' },
              { badge: '100%', title: 'Cloud-based accounting', copy: 'Access your books, reports, and filings anywhere. Integrated with your bank, PSP, and ERP.' },
              { badge: '0', title: 'Paperwork on your desk', copy: 'Paperless document storage, mobile app for invoice and expense upload, and digital approvals.' },
            ].map((item, i) => (
              <AnimatedSection key={item.title} animation="fade-up" delay={i * 80}>
                <div className="h-full rounded-[28px] border border-slate-100 bg-white p-6 hover:border-[#f16610]/40 hover:shadow-[0_25px_50px_-20px_rgba(241,102,16,0.18)] hover:-translate-y-1 transition-all">
                  <span className="inline-block text-3xl font-bold bg-gradient-to-r from-[#f16610] to-[#ff8a3c] bg-clip-text text-transparent mb-3">{item.badge}</span>
                  <h3 className="text-lg font-semibold tracking-tight mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.copy}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              'Accurate financial statements',
              'Mobile app for invoicing',
              'Expense upload & approvals',
              'Dedicated finance team',
              'FTA-registered accountants',
              'One platform for all finance functions',
            ].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 font-medium hover:border-[#f16610]/40 transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-700">
                <Zap size={12} /> Go live fast
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">From chaos to command in three sprints</h2>
            </div>
          </AnimatedSection>

          <div className="relative">
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-[#f16610]/30 via-[#f16610] to-[#f16610]/30">
              <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-white to-transparent animate-marquee" />
            </div>

            <div className="grid md:grid-cols-3 gap-6 relative">
              {TIMELINE.map((item, index) => (
                <AnimatedSection key={item.title} animation="fade-up" delay={index * 120}>
                  <div className="text-center group">
                    <div className="relative inline-flex">
                      <div className="absolute inset-0 rounded-full bg-[#f16610]/20 blur-xl group-hover:bg-[#f16610]/40 transition-colors" />
                      <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-[#f16610] to-[#ff8a3c] flex items-center justify-center text-white shadow-xl shadow-[#f16610]/30 group-hover:scale-110 transition-transform">
                        <item.icon size={32} />
                      </div>
                      <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white border-2 border-[#f16610] text-[#f16610] text-sm font-bold flex items-center justify-center shadow-md">
                        {index + 1}
                      </span>
                    </div>
                    <p className="mt-5 text-xs uppercase tracking-[0.35em] text-slate-400 font-semibold">{item.caption}</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-2 text-slate-600 max-w-xs mx-auto leading-relaxed">{item.copy}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY SWITCH */}
      <section className="px-6 sm:px-10 lg:px-16 py-20">
        <div className="max-w-6xl mx-auto space-y-10">
          <AnimatedSection animation="fade-up">
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-end">
              <div>
                <span className="text-xs uppercase tracking-[0.4em] text-[#f16610] font-semibold">Why 6,000+ UAE businesses choose Finanshels</span>
                <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight max-w-2xl">
                  UAE-first. Founder-focused. Tech-powered.
                </h2>
              </div>
              <p className="text-slate-600 max-w-sm">
                The FTA is increasingly sophisticated in identifying compliance gaps. Finanshels keeps you ahead — not catching up.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_SWITCH.map((item, index) => (
              <AnimatedSection key={item.title} animation="fade-up" delay={index * 80}>
                <div className="group h-full rounded-[28px] border border-slate-100 bg-white p-6 hover:border-[#f16610]/40 hover:shadow-[0_25px_50px_-20px_rgba(241,102,16,0.2)] hover:-translate-y-1 transition-all">
                  <div className="w-11 h-11 rounded-2xl bg-[#fff4ec] text-[#f16610] flex items-center justify-center mb-4 group-hover:bg-[#f16610] group-hover:text-white transition-colors">
                    <item.icon size={20} />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-semibold">{item.tag}</span>
                  <h3 className="mt-1.5 text-lg font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.copy}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE WORK WITH */}
      <section className="px-6 sm:px-10 lg:px-16 py-16 bg-white">
        <AnimatedSection animation="fade-up">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 sm:p-12 text-white">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#f16610]/25 blur-[120px]" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#7e8bff]/20 blur-[100px]" />
            <div className="relative z-10 grid lg:grid-cols-[1fr_1.1fr] gap-10 items-start">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/90">
                  Who we work with
                </span>
                <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
                  UAE businesses at every stage — from first licence to AED 50M revenue.
                </h2>
                <p className="mt-4 text-slate-300 leading-relaxed">
                  Sector-specific expertise across real estate, F&amp;B, e-commerce, healthcare, technology, manufacturing, trading, and professional services.
                </p>
                <p className="mt-3 text-slate-300 leading-relaxed">
                  If you&apos;re operating in the UAE, we know your compliance landscape.
                </p>
              </div>
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#ff8a3c] font-semibold mb-3">Entity types</p>
                  <div className="flex flex-wrap gap-2">
                    {['Mainland DED companies', 'DMCC entities', 'JAFZA companies', 'DIFC firms', 'ADGM businesses', 'IFZA entities', 'Shams & SAIF Zone', 'Branches of foreign companies'].map((e) => (
                      <span key={e} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 font-medium">{e}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#ff8a3c] font-semibold mb-3">Locations</p>
                  <div className="flex flex-wrap gap-2">
                    {['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'KSA', 'GCC'].map((l) => (
                      <span key={l} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 font-medium">{l}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#ff8a3c] font-semibold mb-3">Sectors</p>
                  <div className="flex flex-wrap gap-2">
                    {['Real Estate', 'F&B & Restaurants', 'E-commerce', 'Healthcare', 'Technology', 'Trading', 'Professional Services', 'VC & Funds'].map((s) => (
                      <span key={s} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* PRODUCT STRIP */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-gradient-to-b from-white to-[#fffaf3]">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                Free tools
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">Explore free powerful business tools</h2>
              <p className="text-slate-600 max-w-xl text-lg">
                Try a Finanshels tool before you talk to us — free, instant, and designed to enhance your efficiency in the UAE.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCT_STRIP.map((item, i) => (
              <AnimatedSection key={item.name} animation="fade-up" delay={i * 60}>
                <Link
                  href={item.href}
                  className="group h-full block rounded-[28px] border border-slate-100 bg-white p-6 hover:border-[#f16610]/40 hover:shadow-[0_25px_50px_-25px_rgba(15,23,42,0.18)] hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#fff4ec] to-[#ffd19b]/40 text-[#f16610] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <item.icon size={22} />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-semibold">{item.tag}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 tracking-tight flex items-center gap-2">
                    {item.name}
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-[#f16610] group-hover:translate-x-1 transition" />
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 sm:px-10 lg:px-16 py-20">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col items-center text-center gap-3 mb-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-700">
                ★★★★★  4.9 rating
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">Client results from real Trustpilot reviews</h2>
              <p className="text-slate-600 max-w-2xl text-lg">
                Rated 4.9 stars. Hear from UAE businesses who trust Finanshels with their books, tax, and compliance.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={100}>
            <TestimonialCarousel testimonials={TESTIMONIALS} />
          </AnimatedSection>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 sm:px-10 lg:px-16 pb-16 sm:pb-24">
        <AnimatedSection animation="fade-up">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-3xl sm:rounded-[44px] bg-gradient-to-br from-[#f16610] via-[#ff7a23] to-[#ff8a3c] p-6 sm:p-10 lg:p-16 text-white">
            <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />
            <div className="relative z-10 grid md:grid-cols-[1.4fr_1fr] gap-8 sm:gap-10 md:items-center">
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.32em] sm:tracking-[0.4em] text-white/80 font-semibold">Your UAE back office finance team, without the headcount</p>
                <h2 className="mt-2.5 sm:mt-3 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.15]">
                  Onboarded in 48 hours.{' '}
                  <span className="text-amber-100 block sm:inline">No lock-in. From AED 499/mo.</span>
                </h2>
                <p className="mt-4 sm:mt-5 text-white/85 text-base sm:text-lg max-w-xl leading-relaxed">
                  Send us your trade licence and a few documents. We connect your bank feeds, set up your accounting platform, and start your books immediately.
                </p>
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                  <a
                    href="https://contact-finanshels.zohobookings.com/#/customer/finanshels"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-semibold text-[#f16610] shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                  >
                    Book a Free Consultation
                    <ArrowRight size={18} />
                  </a>
                  <Link
                    href="/pricing"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border-2 border-white/60 bg-white/10 backdrop-blur px-6 py-3.5 font-semibold text-white hover:bg-white/20 transition"
                  >
                    View pricing
                  </Link>
                </div>
              </div>
              <div className="space-y-3">
                {CTA_LINKS.map((cta) => (
                  cta.href.startsWith('http') || cta.href.startsWith('mailto') ? (
                    <a
                      key={cta.label}
                      href={cta.href}
                      className="group flex items-center justify-between rounded-2xl bg-white/10 backdrop-blur border border-white/20 px-5 py-3.5 sm:py-4 text-white hover:bg-white/20 transition-all"
                    >
                      <span className="font-semibold text-sm sm:text-base">{cta.label}</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  ) : (
                    <Link
                      key={cta.label}
                      href={cta.href}
                      className="group flex items-center justify-between rounded-2xl bg-white/10 backdrop-blur border border-white/20 px-5 py-3.5 sm:py-4 text-white hover:bg-white/20 transition-all"
                    >
                      <span className="font-semibold text-sm sm:text-base">{cta.label}</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
