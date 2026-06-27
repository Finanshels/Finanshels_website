'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Linkedin, Twitter, Instagram, Youtube, ArrowUpRight } from 'lucide-react'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  {
    heading: 'Finanshels',
    items: [
      { label: 'Services', to: '/services' },
      { label: 'Solutions', to: '/solutions' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Become a partner', href: 'https://partner.finanshels.com' }
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
      { label: 'Contact Us', to: '/contact' },
      { label: 'Call Hotline', href: 'tel:+97145457841' },
      { label: 'WhatsApp Now', href: 'https://wa.me/971521549572' },
      { label: 'Book a consult', href: 'mailto:contact@finanshels.com' }
    ]
  },
  {
    heading: 'Locations',
    items: [
      { label: 'Accounting Services in Dubai', to: '/accounting-services-dubai' },
      { label: 'Accounting Services in Abu Dhabi', to: '/accounting-services-abu-dhabi' },
      { label: 'Accounting Services in Sharjah', to: '/accounting-services-sharjah' }
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
            <Image
              src="/finanshels_logo.png"
              alt="Finanshels"
              width={160}
              height={40}
              className="h-10 w-auto"
              priority
            />
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              Finanshels, the back office finance partner for 7,000 founders in the UAE run by 180+ members so founders can stay focused on growth.
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
                href="mailto:contact@finanshels.com"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:border-[#f16610]"
              >
                contact@finanshels.com
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
