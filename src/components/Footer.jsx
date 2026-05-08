 'use client'

import Link from 'next/link'
import { Linkedin, Twitter, Mail, Instagram, Youtube, ArrowUpRight, MapPin, Phone } from 'lucide-react'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  {
    heading: 'Finanshels',
    items: [
      { label: 'Services', to: '/services' },
      { label: 'Solutions', to: '/solutions' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Customers', to: '/customers' }
    ]
  },
  {
    heading: 'Insights',
    items: [
      { label: 'Products', to: '/products' },
      { label: 'Glossary', to: '/glossary' },
      { label: 'Blog', to: '/blog' },
      { label: 'Careers', to: '/careers' }
    ]
  },
  {
    heading: 'Need help?',
    items: [
      { label: 'Contact', to: '/contact' },
      { label: 'WhatsApp', href: 'https://wa.me/971507178156' },
      { label: 'Book a consult', href: 'mailto:hello@finanshels.com' }
    ]
  }
]

const SOCIALS = [
  { icon: Linkedin, href: 'https://linkedin.com/company/finanshels' },
  { icon: Twitter, href: 'https://twitter.com/finanshels' },
  { icon: Instagram, href: 'https://www.instagram.com/finanshels' },
  { icon: Youtube, href: 'https://www.youtube.com/@finanshelshq' }
]

export default function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-white via-[#fff6ef] to-white text-slate-900 border-t border-[#ffe0ca]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 left-12 w-64 h-64 bg-[#f16610]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-6 w-72 h-72 bg-[#6b70ff]/10 rounded-full blur-[160px]" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-16 space-y-12">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12">
          <div className="space-y-6">
            <img src="/finanshels_logo.png" alt="Finanshels" className="h-10 w-auto" />
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              Finance partners for UAE startups, retailers, clinics, and SMBs. Accounting, tax, payroll, and CFO rituals run by a 135+ person team so
              founders stay focused on growth.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)] text-[#0f5c4f] hover:-translate-y-1 transition"
                >
                  <social.icon size={20} />
                </a>
              ))}
              <a
                href="mailto:hello@finanshels.com"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:border-[#f16610]"
              >
                hello@finanshels.com
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {NAV_LINKS.map((section) => (
              <div key={section.heading} className="space-y-4">
                <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">{section.heading}</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {section.items.map((item) => {
                    const Component = item.to ? Link : 'a'
          const props = item.to ? { href: item.to } : { href: item.href, target: '_blank', rel: 'noreferrer' }
                    return (
                      <li key={item.label}>
                        <Component
                          {...props}
                          className="inline-flex items-center gap-2 hover:text-[#f16610] transition text-base font-semibold"
                        >
                          {item.label}
                          <ArrowUpRight size={16} />
                        </Component>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 rounded-[30px] border border-slate-200 bg-white/80 p-6 shadow-[0_10px_50px_rgba(15,23,42,0.08)]">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">Dubai HQ</p>
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <MapPin size={18} className="text-[#f16610]" />
              in5 Tech, Dubai Internet City
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">Ops hubs</p>
            <p className="text-sm text-slate-600">Kerala • Abu Dhabi • KSA</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">Hotline</p>
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <Phone size={18} className="text-[#f16610]" />
              +971 50 717 8156
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/60 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Finanshels. Licensed by DIFC, in5 Tech cohort alumni.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-[#f16610] transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#f16610] transition">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
