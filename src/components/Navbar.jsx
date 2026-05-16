'use client'

import Link from 'next/link'
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
  Megaphone,
  Briefcase,
  Archive
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '../lib/utils'
import { PRODUCT_CATEGORIES } from '../data/products'

const SERVICES_SECTIONS = [
  {
    title: 'By Service',
    items: [
      { name: 'Corporate Tax Filing', description: 'File corporate tax across the UAE', badge: 'New', href: '/solutions/corporate-tax-filing', icon: FileText },
      { name: 'Bookkeeping', description: 'Monthly closes with full reconciliations', href: '/solutions/bookkeeping', icon: BookOpen },
      { name: 'Tax Consultancy', description: 'Advisory, strategies, and filings', href: '/solutions/tax-consultancy', icon: MessageSquare },
      { name: 'Fractional CFO', description: 'Strategic finance and operating cadences', href: '/solutions/fractional-cfo', icon: TrendingUp },
      { name: 'Compliance Services', description: 'AML, ESR, governance, and policies', badge: 'New', href: '/solutions/compliance-services', icon: ShieldCheck }
    ]
  },
  {
    title: 'Other Services',
    items: [
      { name: 'VAT Registration', description: 'Effortless VAT onboarding & renewals', href: '/solutions/vat-registration', icon: BadgePercent },
      { name: 'Corporate Tax Registration', description: 'Entity set up and filings', href: '/solutions/corporate-tax-registration', icon: FileSpreadsheet },
      { name: 'Liquidation Services', description: 'Stress-free company closure', href: '/solutions/liquidation-services', icon: Archive },
      { name: 'Hire an Expert', description: 'Deploy controllers and CFOs instantly', href: '/solutions/hire-an-expert', icon: Users },
      { name: 'VAT Filing', description: 'Managed VAT cycles every month', badge: 'New', href: '/solutions/vat-filing', icon: FileText }
    ]
  },
  {
    title: 'By Industry',
    items: [
      { name: 'Restaurants', description: 'Tailored finance for F&B groups', href: '/solutions/restaurants', icon: Store },
      { name: 'Startups', description: 'Strategic partner for venture-backed teams', href: '/solutions/startups', icon: Sparkles },
      { name: 'eCommerce', description: 'Inventory, PSP, and marketplace control', href: '/solutions/ecommerce', icon: ShoppingCart },
      { name: 'SMEs', description: 'Purpose-built teams for scaling SMBs', href: '/solutions/smes', icon: Building2 }
    ]
  }
]

const RESOURCES_SECTIONS = [
  {
    title: 'Learn',
    items: [
      { name: 'Blog', description: 'Sharp takes on startup finance.', href: '/blog', icon: Megaphone },
      { name: 'Glossary', description: 'Speak finance like a founder.', href: '/glossary', icon: BookOpen },
      { name: 'FAQs', description: 'Answers to the most common questions.', href: '/contact', icon: HelpCircle }
    ]
  },
  {
    title: 'Products & Tools',
    items: [
      { name: 'All Products', description: 'Purpose-built tools for finance teams.', href: '/products', icon: Briefcase },
      ...PRODUCT_CATEGORIES.slice(0, 1).flatMap((section) =>
        section.items.slice(0, 2).map((item) => ({
          name: item.name,
          description: item.description,
          href: `/products/${item.slug}`,
          icon: item.icon
        }))
      )
    ]
  },
  {
    title: 'Customers',
    items: [
      { name: 'Case studies', description: 'See how teams scale with Finanshels.', href: '/customers', icon: Sparkles },
      { name: 'Resources hub', description: 'Guides, templates, and playbooks.', href: '/resources', icon: FileText }
    ]
  }
]

const COMPANY_SECTIONS = [
  {
    title: 'About Finanshels',
    items: [
      { name: 'About us', description: 'Who we are and why we build Finanshels.', href: '/about', icon: Building2 },
      { name: 'Careers', description: 'Join the team.', badge: "We're hiring!", href: '/careers', icon: Users }
    ]
  },
  {
    title: 'Get in touch',
    items: [
      { name: 'Contact', description: 'Talk to our team.', href: '/contact', icon: MessageSquare },
      { name: 'Become a partner', description: 'Grow with the Finanshels partner network.', href: 'https://partner.finanshels.com', icon: Briefcase }
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
        cta: {
          text: 'Guides, products, and case studies for ambitious operators.',
          primary: { href: '/blog', label: 'View blog' },
          actions: [
            { href: '/products', label: 'Browse products' },
            { href: '/customers', label: 'Customer stories' }
          ]
        }
      },
      {
        name: 'Company',
        dropdown: COMPANY_SECTIONS,
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

  const renderDropdown = (sections, cta) => (
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
        <div className="grid gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <div key={section.title} className="space-y-4 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#f16610]/80">{section.title}</p>
              <div className="space-y-3">
                {section.items.map((item) => {
                  const Icon = item.icon || ArrowUpRight
              const ItemComponent = item.href?.startsWith('http') ? 'a' : Link
              const componentProps = item.href?.startsWith('http')
                ? { href: item.href, target: '_blank', rel: 'noreferrer' }
                : { href: item.href || '#' }
                  return (
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-white/95 via-white/90 to-[#fff6ee]/90 border-b border-white/40 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative">
        <div className="flex items-center gap-4 h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/finanshels_logo.png"
              alt="Finanshels"
              className="h-7 w-auto transition-transform duration-200 group-hover:scale-[1.04]"
            />
            <span className="sr-only">Finanshels</span>
          </Link>

          <div className="hidden md:flex flex-1 items-center justify-center gap-1 rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
            {navItems.map((item) =>
              item.dropdown ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className="flex items-center gap-1 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-600 transition hover:text-[#f16610]"
                  >
                    {item.name}
                    <ChevronDown size={14} className={cn('transition-transform', openDropdown === item.name && 'rotate-180')} />
                  </button>
                  {openDropdown === item.name && renderDropdown(item.dropdown, item.cta)}
                </div>
              ) : item.external ? (
                <a
                  key={item.name}
                  href={item.path}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.35em] transition text-slate-600 hover:text-[#f16610]"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.path}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.35em] transition',
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
                                : { to: entry.href || '#', onClick: () => setMobileMenuOpen(false) }
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
                                  : { to: action.href, onClick: () => setMobileMenuOpen(false) }
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
