'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'
import Navbar from './Navbar'

/**
 * Admin routes need the full viewport for the CMS; the marketing shell (nav + footer)
 * was stealing height and making `100vh` math wrong, leaving a huge white band.
 */
export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const isLandingPage = pathname.startsWith('/landing-pages')

  if (isAdmin) {
    return <div className="min-h-dvh bg-[#f7f3ee]">{children}</div>
  }

  if (isLandingPage) {
    // Landing pages bring their own minimal header/footer to keep visitors focused on conversion.
    return <div className="min-h-screen bg-white">{children}</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
