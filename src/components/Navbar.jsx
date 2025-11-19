import { Link, useLocation } from 'react-router-dom'
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
  Mic,
  PlayCircle,
  Megaphone,
  Briefcase,
  Archive
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '../lib/utils'

const SOLUTIONS_SECTIONS = [
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
    title: 'Use cases',
    items: [
      { name: 'Tools', description: 'Bite-sized utilities for finance teams.', href: '/resources/tools', icon: Briefcase },
      { name: 'Glossary', description: 'Speak finance like a founder.', href: '/resources/glossary', icon: MessageSquare },
      { name: 'FAQs', description: 'Answers to the most common questions.', href: '/resources/faqs', icon: HelpCircle }
    ]
  },
  {
    title: 'Resources',
    items: [
      { name: 'Ebooks', description: 'Deep dives, zero fluff—finance decoded.', href: '/resources/ebooks', icon: BookOpen },
      { name: 'Podcasts', description: 'Stories from operators and CFOs.', href: '/resources/podcasts', icon: Mic },
      { name: 'Webinars', description: 'Live and on-demand finance wisdom.', href: '/resources/webinars', icon: PlayCircle }
    ]
  },
  {
    title: 'Company',
    items: [
      { name: 'About us', description: 'Who we are and why we build Finanshels.', href: '/about', icon: Building2 },
      { name: 'Blogs', description: 'Sharp takes on startup finance.', href: '/blog', icon: Megaphone },
      { name: 'Careers', description: 'We’re hiring!', badge: 'We\'re hiring!', href: '/careers', icon: Users }
    ]
  }
]

export default function Navbar() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null)

  useEffect(() => {
    setOpenDropdown(null)
    setMobileMenuOpen(false)
  }, [location.pathname])

  const isActive = (path) => {
    if (!path) return false
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const navItems = useMemo(() => [
    { name: 'Home', path: '/' },
    { 
      name: 'Solutions', 
      dropdown: SOLUTIONS_SECTIONS,
      cta: {
        text: 'Need help scoping the right finance services for your business?',
        primary: { href: 'mailto:hello@finanshels.com', label: 'Book now' },
        actions: [
          { href: '/pricing', label: 'Pricing' },
          { href: 'https://wa.me/971507178156?text=Hi%20Team%20Finanshels%2C%20I%20need%20a%20finance%20consultation.', label: 'Chat to sales' }
        ]
      }
    },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Customers', path: '/customers' },
    { 
      name: 'Resources', 
      dropdown: RESOURCES_SECTIONS,
      cta: {
        text: 'Deep dives, podcasts, and live sessions for ambitious operators.',
        primary: { href: 'https://www.finanshels.com/resources', label: 'View library' },
        actions: [
          { href: 'https://www.finanshels.com/blog', label: 'Blog' },
          { href: 'https://www.finanshels.com/careers', label: 'Careers' }
        ]
      }
    },
    { name: 'Contact', path: '/contact' }
  ], [])

  const renderDropdown = (sections, cta) => (
    <div className="absolute left-1/2 top-full mt-0 -translate-x-1/2 w-[1100px] max-w-[calc(100vw-2rem)] rounded-[32px] border border-slate-200/80 bg-white/95 shadow-[0_30px_70px_rgba(10,16,31,0.22)] px-8 py-8">
      <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white via-[#fff9f5] to-white opacity-90 pointer-events-none"></div>
      <div className="absolute -top-10 right-16 h-24 w-24 rounded-full bg-[#f16610]/25 blur-[60px]" />
      <div className="relative z-10">
        <div className="grid gap-8 md:grid-cols-3">
          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#f16610]/80">{section.title}</p>
              <div className="space-y-3">
                {section.items.map((item) => {
                  const Icon = item.icon || ArrowUpRight
                  const ItemComponent = item.href?.startsWith('http') ? 'a' : Link
                  const componentProps = item.href?.startsWith('http')
                    ? { href: item.href, target: '_blank', rel: 'noreferrer' }
                    : { to: item.href || '#' }
                  return (
                    <ItemComponent
                      key={item.name}
                      {...componentProps}
                      className="group flex items-start gap-4 rounded-3xl border border-transparent bg-white/60 p-4 transition-all hover:-translate-y-0.5 hover:border-[#ffd7c0] hover:bg-white"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1e3] text-[#f16610] shadow-inner">
                        <Icon size={22} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          {item.badge && (
                            <span className="rounded-full bg-[#ffe8d8] px-2 py-0.5 text-xs font-semibold text-[#f16610]">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.description && <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>}
                      </div>
                    </ItemComponent>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        {cta && (
          <div className="mt-8 space-y-4 rounded-3xl border border-slate-200/80 bg-white/90 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-sm font-semibold text-slate-700">{cta.text}</p>
              {cta.primary && (
                <a
                  href={cta.primary.href}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#f16610]/30 transition hover:-translate-y-0.5"
                >
                  {cta.primary.label}
                  <ArrowUpRight size={18} />
                </a>
              )}
            </div>
            {cta.actions && (
              <div className="flex flex-wrap gap-3">
                {cta.actions.map((action) => {
                  const ActionComponent = action.href.startsWith('http') ? 'a' : Link
                  const props = action.href.startsWith('http') ? { href: action.href, target: '_blank', rel: 'noreferrer' } : { to: action.href }
                  return (
                    <ActionComponent
                      key={action.label}
                      {...props}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-600 hover:border-[#f16610] hover:text-[#f16610]"
                    >
                      {action.label}
                      <ArrowUpRight size={16} />
                    </ActionComponent>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center group">
            <img
              src="/finanshels_logo.png"
              alt="Finanshels"
              className="h-8 w-auto transition-all duration-300 group-hover:scale-105"
            />
          </Link>

          <div className="hidden md:flex items-center gap-3">
            {navItems.map((item) =>
              item.dropdown ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold uppercase tracking-wide text-slate-700 transition hover:text-[#f16610]"
                  >
                    {item.name}
                    <ChevronDown size={16} className={cn('transition-transform', openDropdown === item.name && 'rotate-180')} />
                  </button>
                  {openDropdown === item.name &&
                    renderDropdown(item.dropdown, item.cta)}
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-semibold uppercase tracking-wide transition',
                    isActive(item.path)
                      ? 'text-[#f16610] bg-[#fff4ec]'
                      : 'text-slate-700 hover:text-[#f16610]'
                  )}
                >
                  {item.name}
                </Link>
              )
            )}
            <a
              href="https://wa.me/971507178156?text=Hi%20Team%20Finanshels%2C%20let%E2%80%99s%20talk%20finance."
              target="_blank"
              rel="noreferrer"
              className="ml-2 inline-flex items-center rounded-2xl bg-[#0f5c4f] px-5 py-2.5 font-semibold text-white transition hover:bg-[#0c4a3f]"
            >
              WhatsApp • Speak to us
            </a>
          </div>

          <button
            className="md:hidden p-3 rounded-xl hover:bg-slate-50 transition-all duration-300"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-2xl">
          <div className="px-6 py-4 space-y-3">
            {navItems.map((item) =>
              item.dropdown ? (
                <div key={item.name} className="rounded-2xl border border-slate-200">
                  <button
                    className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold text-slate-900"
                    onClick={() => setOpenMobileDropdown((prev) => (prev === item.name ? null : item.name))}
                  >
                    {item.name}
                    <ChevronDown
                      size={18}
                      className={cn('transition-transform', openMobileDropdown === item.name && 'rotate-180')}
                    />
                  </button>
                  {openMobileDropdown === item.name && (
                    <div className="px-4 pb-4 space-y-4">
                      {item.dropdown.map((section) => (
                        <div key={section.title}>
                          <p className="text-xs uppercase tracking-[0.3em] text-[#f16610]/80 font-semibold">
                            {section.title}
                          </p>
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
                                  {entry.description && (
                                    <span className="mt-1 block text-xs font-normal text-slate-600">
                                      {entry.description}
                                    </span>
                                  )}
                                </EntryComponent>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                      {item.cta && (
                        <div className="mt-4 space-y-2 rounded-2xl bg-white p-4">
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
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block px-5 py-3.5 rounded-xl font-semibold transition-all duration-300',
                    isActive(item.path)
                      ? 'text-[#f16610] bg-[#fff4ec] shadow-sm'
                      : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  {item.name}
                </Link>
              )
            )}
            <a
              href="https://wa.me/971507178156?text=Hi%20Team%20Finanshels%2C%20let%E2%80%99s%20talk%20finance."
              target="_blank"
              rel="noreferrer"
              className="block text-center px-5 py-3.5 rounded-xl font-semibold border-2 border-[#0f5c4f] text-[#0f5c4f] hover:bg-[#0f5c4f] hover:text-white transition"
            >
              WhatsApp • Speak to us
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
