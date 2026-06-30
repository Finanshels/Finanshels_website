import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import AppChrome from '../components/layout/AppChrome'
import CookieConsent from '../components/layout/CookieConsent'
import { safeJsonLd } from '@/lib/seo/safeJsonLd'
import { getNavTools } from '@/lib/cms/toolsRepository'
import { getAnnouncement } from '@/lib/cms/siteSettingsRepository'
import { EMPTY_ANNOUNCEMENT, type SiteAnnouncement } from '@/lib/cms/siteAnnouncementTypes'
import type { NavTool } from '@/lib/tools/types'

// Inter is the single brand typeface — used for both body and headings. The
// Tailwind `display` family also points at --font-sans, so `font-display`
// headings render Inter site-wide. Variable font: all weights (400–800) ship
// in one download. (The /home4 variant keeps its own bespoke faces.)
const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.finanshels.com'
const SITE_DESCRIPTION = 'Finance, tax, and compliance for ambitious teams across MENA.'

export const metadata: Metadata = {
  title: {
    default: 'Finanshels — Finance, Tax & Compliance for MENA Teams',
    template: '%s | Finanshels',
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  // FIX-062: do NOT set `alternates.canonical` here. App Router merges metadata
  // down the segment tree, so a root canonical is inherited by every page that
  // doesn't override it — which made ~17 commercial pages emit the homepage
  // canonical and de-indexed them. Each page sets its own canonical instead;
  // the homepage's lives in src/app/page.jsx.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    siteName: 'Finanshels',
    title: 'Finanshels — Finance, Tax & Compliance for MENA Teams',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Finanshels — Finance, Tax & Compliance for MENA Teams',
    description: SITE_DESCRIPTION,
    site: '@finanshels',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Finanshels',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  description: SITE_DESCRIPTION,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Office 406, Publishing Pavilion, Dubai Production City',
    addressLocality: 'Dubai',
    addressRegion: 'Dubai',
    addressCountry: 'AE',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: '+971-50-717-8156',
    email: 'contact@finanshels.com',
    areaServed: 'AE',
    availableLanguage: ['en'],
  },
  sameAs: [
    'https://linkedin.com/company/finanshels',
    'https://twitter.com/finanshels',
    'https://www.instagram.com/finanshels',
    'https://www.youtube.com/@finanshelshq',
  ],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // The navbar's Tools menu is CMS-driven. Fetch featured tools here (the only
  // server boundary above the client navbar) and pass them down. Degrade to an
  // empty list on failure — nav chrome must never 500 the entire site.
  let navTools: NavTool[] = []
  try {
    navTools = await getNavTools()
  } catch {
    navTools = []
  }

  // FIX-078: site-wide announcement nudge (degrade to none on any failure).
  let announcement: SiteAnnouncement = EMPTY_ANNOUNCEMENT
  try {
    announcement = await getAnnouncement()
  } catch {
    announcement = EMPTY_ANNOUNCEMENT
  }

  return (
    <html lang="en" className={`${fontSans.variable}`}>
      <body className="font-sans antialiased bg-white text-slate-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationSchema) }}
        />
        <AppChrome navTools={navTools} announcement={announcement}>{children}</AppChrome>
        <CookieConsent />
      </body>
    </html>
  )
}
