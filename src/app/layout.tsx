import type { Metadata, Viewport } from 'next'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
import '../index.css'
import AppChrome from '../components/AppChrome'
import CookieConsent from '../components/CookieConsent'

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const fontDisplay = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
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
  alternates: { canonical: '/' },
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
    streetAddress: 'in5 Tech, Dubai Internet City',
    addressLocality: 'Dubai',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontDisplay.variable}`}>
      <body className="font-sans antialiased bg-white text-slate-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <AppChrome>{children}</AppChrome>
        <CookieConsent />
      </body>
    </html>
  )
}
