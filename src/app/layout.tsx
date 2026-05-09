import type { Metadata, Viewport } from 'next'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
import '../index.css'
import AppChrome from '../components/AppChrome'

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

export const metadata: Metadata = {
  title: {
    default: 'Finanshels',
    template: '%s | Finanshels',
  },
  description: 'Finance, tax, and compliance for ambitious teams across MENA.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.finanshels.com'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontDisplay.variable}`}>
      <body className="font-sans antialiased bg-white text-slate-900">
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  )
}
