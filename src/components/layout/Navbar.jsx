'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  FileText,
  BookOpen,
  MessageSquare,
  TrendingUp,
  ShieldCheck,
  BadgePercent,
  FileSpreadsheet,
  Users,
  Store,
  Sparkles,
  ShoppingCart,
  Building2,
  HelpCircle,
  Briefcase,
  Archive,
  GraduationCap,
  Newspaper,
  FileBarChart,
  ListChecks,
  LayoutTemplate,
  Scale,
  Wallet,
  HeartPulse,
  CalendarClock,
  Coins,
  Percent,
  Receipt,
  Heart,
  HeartHandshake,
  CalendarDays,
  Mic,
  Video,
  Calculator,
  ClipboardCheck,
  Utensils,
  Gem
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

const SERVICES_SECTIONS = [
  {
    title: 'Compliance',
    items: [
      { name: 'Corporate Tax Registration', href: '/corporate-tax-registration-uae', icon: FileSpreadsheet },
      { name: 'Corporate Tax Filing', href: '/corporate-tax-filing-uae', icon: FileText },
      { name: 'VAT Registration', href: '/vat-registration-uae', icon: BadgePercent },
      { name: 'VAT Filing', href: '/vat-filing-uae', icon: Receipt },
      { name: 'AML Compliance', href: '/aml-uae', icon: ShieldCheck },
      { name: 'DDA Audit Services', href: '/audit-services-dubai', icon: ClipboardCheck },
      { name: 'Company Liquidation', href: '/company-liquidation-dubai', icon: Archive }
    ]
  },
  {
    title: 'Finance Back Office',
    items: [
      // FIX-055: /accounting-services-uae, /financial-controller-uae and
      // /cfo-services-dubai 404 (no page). Remapped to live pages.
      { name: 'Accounting Services', href: '/services', icon: BookOpen },
      { name: 'Bookkeeping Services', href: '/bookkeeping-services-uae', icon: Calculator },
      { name: 'Financial Controller (FCaaS)', href: '/services', icon: TrendingUp },
      { name: 'CFO Services', href: '/cfo-services-uae', icon: Briefcase }
    ]
  },
  {
    title: 'Sectors',
    items: [
      { name: 'Small Business Accounting', href: '/small-business-accounting', icon: Store },
      { name: 'Real Estate Accounting', href: '/real-estate-accounting', icon: Building2 },
      { name: 'Healthcare Accounting', href: '/healthcare-accounting', icon: HeartPulse },
      { name: 'Non-Profit Accounting', href: '/non-profit-accounting', icon: Heart },
      { name: 'E-Commerce Accounting', href: '/ecommerce-accounting', icon: ShoppingCart }
    ]
  },
  {
    title: '',
    items: [
      { name: 'Technology & Startup Accounting', href: '/technology-accounting', icon: Sparkles },
      { name: 'Restaurant & F&B Accounting', href: '/restaurant-accounting', icon: Utensils },
      { name: 'Trading Business Accounting', href: '/trading-business-accounting', icon: Scale },
      { name: 'Jewellers & Precious Metals', href: '/jewellery-business-accounting', icon: Gem },
      { name: 'VC Fund Accounting', href: '/vc-fund-accounting', icon: Wallet }
    ]
  }
]

// FIX-055: the Resources hub linked to ~12 pages that don't exist yet (guides,
// reports, cheat sheets, templates, and standalone calculator routes all 404).
// Until those ship, each entry points at the closest live page so nothing 404s.
const RESOURCES_SECTIONS = [
  {
    title: 'Knowledge',
    items: [
      { name: 'Guides Hub', href: '/blog', icon: GraduationCap },
      { name: 'Blog Hub', href: '/blog', icon: Newspaper },
      { name: 'Glossary Hub', href: '/glossary', icon: BookOpen },
      { name: 'Reports', href: '/blog', icon: FileBarChart }
    ]
  },
  {
    title: 'Quick Reference',
    items: [
      { name: 'FAQs', href: '/faq', icon: HelpCircle },
      { name: 'Cheat Sheets', href: '/blog', icon: ListChecks },
      { name: 'Templates', href: '/blog', icon: LayoutTemplate }
    ]
  },
  {
    title: 'Calculators',
    items: [
      { name: 'Cash Flow', href: '/services', icon: Wallet },
      { name: 'Gratuity', href: '/services', icon: Coins },
      { name: 'VAT', href: '/vat-filing-uae', icon: Percent },
      { name: 'E-Invoicing', href: '/vat-filing-uae', icon: Receipt }
    ]
  },
  {
    title: 'Benchmarks & Checks',
    items: [
      { name: 'Salary Benchmark', href: '/services', icon: Scale },
      { name: 'Finance Health Check', href: '/services', icon: HeartPulse },
      { name: 'CT Deadline Check', href: '/corporate-tax-filing-uae', icon: CalendarClock }
    ]
  }
]

const COMPANY_SECTIONS = [
  {
    title: 'About',
    items: [
      { name: 'About Us', href: '/about-us', icon: Building2 },
      { name: 'Customers', href: '/customers', icon: Heart }
    ]
  },
  {
    title: 'Connect',
    items: [
      // FIX-055: /partners 404s — use the external partner portal (matches footer).
      { name: 'Partners', href: 'https://partner.finanshels.com', icon: HeartHandshake },
      { name: 'Contact', href: '/contact', icon: MessageSquare }
    ]
  },
  {
    title: 'Careers',
    items: [
      // FIX-055: /jobs 404s — point to the live careers page.
      { name: 'Careers', badge: "We're hiring!", href: '/careers', icon: Briefcase },
      { name: 'Open Roles', href: '/careers', icon: Briefcase }
    ]
  },
  {
    title: 'Media',
    items: [
      // FIX-055: /events, /podcasts, /webinars 404 — remap to live pages.
      { name: 'Community', href: '/community', icon: Users },
      { name: 'Events', href: '/events-by-finanshels', icon: CalendarDays },
      { name: 'Podcasts', href: '/blog', icon: Mic },
      { name: 'Webinars', href: '/blog', icon: Video }
    ]
  }
]

export default function Navbar() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) {
    return null
  }
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null)

  useEffect(() => {
    setOpenDropdown(null)
    setMobileMenuOpen(false)
  }, [pathname])

  const isActive = (path) => {
    if (!path) return false
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  const isOnHome2 = pathname === '/home2'
  const homeToggleItem = isOnHome2
    ? { name: 'Home', path: '/' }
    : { name: 'Why?', path: '/home2' }

  const navItems = useMemo(
    () => [
      homeToggleItem,
      {
        name: 'Services',
        dropdown: SERVICES_SECTIONS,
        dropdownOptions: { cols: 4, compact: true },
        cta: {
          text: 'Need help scoping the right finance services for your business?',
          primary: { href: 'mailto:contact@finanshels.com', label: 'Book now' },
          actions: [
            { href: '/pricing', label: 'Pricing' },
            { href: 'https://wa.me/971521549572?text=Hi%20Team%20Finanshels%2C%20I%20need%20a%20finance%20consultation.', label: 'Chat to sales' }
          ]
        }
      },
      { name: 'Packages', path: '/pricing' },
      {
        name: 'Resources',
        dropdown: RESOURCES_SECTIONS,
        dropdownOptions: { cols: 4, compact: true },
        cta: {
          text: 'Free guides, calculators, and tools for ambitious operators.',
          primary: { href: '/blog', label: 'View blog' },
          actions: [
            { href: '/blog', label: 'Browse guides' },
            { href: '/glossary', label: 'Explore glossary' }
          ]
        }
      },
      {
        name: 'Company',
        dropdown: COMPANY_SECTIONS,
        dropdownOptions: { cols: 4, compact: true },
        cta: {
          text: 'Learn about Finanshels, join the team, or grow with us as a partner.',
          primary: { href: '/contact', label: 'Contact us' },
          actions: [
            { href: '/careers', label: 'Careers' },
            { href: 'https://partner.finanshels.com', label: 'Become a partner' }
          ]
        }
      }
    ],
    [homeToggleItem]
  )

  const renderDropdown = (sections, cta, options = {}) => {
    const { cols = 3, compact = false } = options
    const gridClass = cols === 4
      ? 'grid gap-4 grid-cols-2 lg:grid-cols-4'
      : 'grid gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    return (
    <div
      className="fixed left-1/2 top-20 -translate-x-1/2 w-full max-w-[1100px] px-4 sm:px-8 z-50"
      onMouseEnter={() => setOpenDropdown(openDropdown)}
      onMouseLeave={() => setOpenDropdown(null)}
    >
      {/* Invisible bridge to prevent dropdown from closing */}
      <div className="absolute -top-20 left-0 right-0 h-20" />
      <div className="relative rounded-[32px] border border-slate-200/80 bg-white/95 shadow-[0_30px_70px_rgba(10,16,31,0.22)] px-6 py-8 lg:px-8">
        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white via-[#fff9f5] to-white opacity-90 pointer-events-none" />
        <div className="absolute -top-10 right-16 h-24 w-24 rounded-full bg-[#f16610]/25 blur-[60px]" />
        <div className="relative z-10">
        <div className={gridClass}>
          {sections.map((section) => (
            <div key={section.title} className="space-y-2 min-w-0">
              {section.title
                ? <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#f16610]/80">{section.title}</p>
                : <div className="h-[18px]" />
              }
              <div className={compact ? 'space-y-1' : 'space-y-3'}>
                {section.items.map((item) => {
                  const Icon = item.icon || ArrowUpRight
              const ItemComponent = item.href?.startsWith('http') ? 'a' : Link
              const componentProps = item.href?.startsWith('http')
                ? { href: item.href, target: '_blank', rel: 'noreferrer' }
                : { href: item.href || '#' }
                  return compact ? (
                    <ItemComponent
                      key={item.name}
                      {...componentProps}
                      className="group flex items-center gap-2 rounded-2xl border border-transparent bg-white/60 px-2.5 py-2 transition-all hover:border-[#ffd7c0] hover:bg-white min-w-0"
                    >
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-[#fff1e3] text-[#f16610]">
                        <Icon size={14} />
                      </div>
                      <p className="font-semibold text-slate-800 text-xs leading-tight">{item.name}</p>
                    </ItemComponent>
                  ) : (
                    <ItemComponent
                      key={item.name}
                      {...componentProps}
                      className="group flex items-start gap-3 rounded-3xl border border-transparent bg-white/60 p-3.5 lg:p-4 transition-all hover:-translate-y-0.5 hover:border-[#ffd7c0] hover:bg-white min-w-0"
                    >
                      <div className="flex h-10 w-10 lg:h-11 lg:w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#fff1e3] text-[#f16610] shadow-inner">
                        <Icon size={20} className="lg:hidden" />
                        <Icon size={22} className="hidden lg:block" />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-slate-900 text-sm lg:text-base">{item.name}</p>
                          {item.badge && (
                            <span className="rounded-full bg-[#ffe8d8] px-2 py-0.5 text-xs font-semibold text-[#f16610] whitespace-nowrap">{item.badge}</span>
                          )}
                        </div>
                        {item.description && <p className="text-xs lg:text-sm text-slate-600 leading-relaxed">{item.description}</p>}
                      </div>
                    </ItemComponent>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        {cta && (
          <div className="mt-6 lg:mt-8 space-y-3 lg:space-y-4 rounded-3xl border border-slate-200/80 bg-white/90 p-4 lg:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-xs lg:text-sm font-semibold text-slate-700 flex-1">{cta.text}</p>
              {cta.primary && (
                <a
                  href={cta.primary.href}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#f16610] px-4 lg:px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#f16610]/30 transition hover:-translate-y-0.5 whitespace-nowrap"
                >
                  {cta.primary.label}
                  <ArrowUpRight size={18} />
                </a>
              )}
            </div>
            {cta.actions && (
              <div className="flex flex-wrap gap-2 lg:gap-3">
                {cta.actions.map((action) => {
          const ActionComponent = action.href.startsWith('http') ? 'a' : Link
          const props = action.href.startsWith('http') ? { href: action.href, target: '_blank', rel: 'noreferrer' } : { href: action.href }
                  return (
                    <ActionComponent
                      key={action.label}
                      {...props}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 lg:px-4 py-1.5 text-xs lg:text-sm font-semibold text-slate-600 hover:border-[#f16610] hover:text-[#f16610] whitespace-nowrap"
                    >
                      {action.label}
                      <ArrowUpRight size={14} className="lg:hidden" />
                      <ArrowUpRight size={16} className="hidden lg:block" />
                    </ActionComponent>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
  )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-white/95 via-white/90 to-[#fff6ee]/90 border-b border-white/40 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative">
        <div className="flex items-center gap-4 h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/finanshels_logo.png"
              alt="Finanshels"
              width={140}
              height={28}
              priority
              className="h-7 w-auto transition-transform duration-200 group-hover:scale-[1.04]"
            />
            <span className="sr-only">Finanshels</span>
          </Link>

          <div className="hidden md:flex mx-auto items-center justify-center gap-0.5 rounded-full border border-slate-200/80 bg-white/70 px-2 py-2 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
            {navItems.map((item) =>
              item.dropdown ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-600 transition hover:text-[#f16610]"
                  >
                    {item.name}
                    <ChevronDown size={14} className={cn('transition-transform', openDropdown === item.name && 'rotate-180')} />
                  </button>
                  {openDropdown === item.name && renderDropdown(item.dropdown, item.cta, item.dropdownOptions)}
                </div>
              ) : item.external ? (
                <a
                  key={item.name}
                  href={item.path}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.35em] transition text-slate-600 hover:text-[#f16610]"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.path}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.35em] transition',
                    isActive(item.path) ? 'text-[#f16610] bg-[#fff2ea] ring-1 ring-inset ring-[#f16610]/15' : 'text-slate-600 hover:text-[#f16610]'
                  )}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          <div className="hidden md:flex items-center">
            <a
              href="https://wa.me/971521549572?text=Hi%20Team%20Finanshels%2C%20let%E2%80%99s%20talk%20finance."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-[18px] bg-[#0f5c4f] px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(15,92,79,0.45)] hover:bg-[#0c4a3f]"
            >
              WhatsApp
              <ArrowUpRight size={16} className="text-white/80" />
            </a>
          </div>

          <button
            className="md:hidden ml-auto p-3 rounded-xl hover:bg-slate-100 transition"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl">
          <div className="px-6 py-4 space-y-3">
            {navItems.map((item) =>
              item.dropdown ? (
                <div key={item.name} className="rounded-2xl border border-slate-200 bg-white">
                  <button
                    className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold text-slate-900"
                    onClick={() => setOpenMobileDropdown((prev) => (prev === item.name ? null : item.name))}
                  >
                    {item.name}
                    <ChevronDown size={18} className={cn('transition-transform', openMobileDropdown === item.name && 'rotate-180')} />
                  </button>
                  {openMobileDropdown === item.name && (
                    <div className="px-4 pb-4 space-y-4">
                      {item.dropdown.map((section) => (
                        <div key={section.title}>
                          <p className="text-xs uppercase tracking-[0.3em] text-[#f16610]/80 font-semibold">{section.title}</p>
                          <div className="mt-2 space-y-3">
                            {section.items.map((entry) => {
                              const EntryComponent = entry.href?.startsWith('http') ? 'a' : Link
                              const entryProps = entry.href?.startsWith('http')
                                ? { href: entry.href, target: '_blank', rel: 'noreferrer', onClick: () => setMobileMenuOpen(false) }
                                // FIX-055: next/link uses `href`, not `to` — the mobile
                                // submenu links were rendering with no href (dead links).
                                : { href: entry.href || '#', onClick: () => setMobileMenuOpen(false) }
                              return (
                                <EntryComponent
                                  key={entry.name}
                                  {...entryProps}
                                  className="block rounded-2xl bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-800"
                                >
                                  {entry.name}
                                  {entry.description && <span className="mt-1 block text-xs font-normal text-slate-600">{entry.description}</span>}
                                </EntryComponent>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                      {item.cta && (
                        <div className="mt-4 space-y-2 rounded-2xl bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                          <p className="text-sm font-semibold text-slate-700">{item.cta.text}</p>
                          {item.cta.primary && (
                            <a
                              href={item.cta.primary.href}
                              className="inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-4 py-2 text-sm font-bold text-white"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item.cta.primary.label}
                              <ArrowUpRight size={16} />
                            </a>
                          )}
                          {item.cta.actions && (
                            <div className="flex flex-wrap gap-2">
                              {item.cta.actions.map((action) => {
                                const ActionComponent = action.href.startsWith('http') ? 'a' : Link
                                const actionProps = action.href.startsWith('http')
                                  ? { href: action.href, target: '_blank', rel: 'noreferrer', onClick: () => setMobileMenuOpen(false) }
                                  : { href: action.href, onClick: () => setMobileMenuOpen(false) }
                                return (
                                  <ActionComponent
                                    key={action.label}
                                    {...actionProps}
                                    className="rounded-2xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600"
                                  >
                                    {action.label}
                                  </ActionComponent>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : item.external ? (
                <a
                  key={item.name}
                  href={item.path}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-5 py-3.5 rounded-xl font-semibold transition-all duration-300 text-slate-700 hover:bg-slate-50"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block px-5 py-3.5 rounded-xl font-semibold transition-all duration-300',
                    isActive(item.path) ? 'text-[#f16610] bg-[#fff4ec] shadow-sm' : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  {item.name}
                </Link>
              )
            )}
            <a
              href="https://wa.me/971521549572?text=Hi%20Team%20Finanshels%2C%20let%E2%80%99s%20talk%20finance."
              target="_blank"
              rel="noreferrer"
              className="block text-center px-5 py-3.5 rounded-xl font-semibold border-2 border-[#0f5c4f] text-[#0f5c4f] hover:bg-[#0f5c4f] hover:text-white transition"
            >
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
