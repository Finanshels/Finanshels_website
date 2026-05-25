'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { ChatWidget } from './chat/ChatWidget'
import Footer from './Footer'
import Navbar from './Navbar'

/**
 * Admin routes need the full viewport for the CMS; the marketing shell (nav + footer)
 * was stealing height and making `100vh` math wrong, leaving a huge white band.
 *
 * FIX-046: lock <html> and <body> to the viewport while on admin routes. The
 * editor shell already uses `h-dvh overflow-hidden`, but any descendant that
 * lands outside its containing block (popovers, absolutely-positioned menus,
 * tooltips) could still extend the document height and produce a tall blank
 * scroll band below the UI. Pinning the document at the body level guarantees
 * no page scroll regardless of what individual editor widgets do.
 */
export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const isLandingPage = pathname.startsWith('/landing-pages')

  useEffect(() => {
    if (!isAdmin) return
    const html = document.documentElement
    const body = document.body
    const prev = {
      htmlOverflow: html.style.overflow,
      htmlHeight: html.style.height,
      bodyOverflow: body.style.overflow,
      bodyHeight: body.style.height,
    }
    html.style.overflow = 'hidden'
    html.style.height = '100dvh'
    body.style.overflow = 'hidden'
    body.style.height = '100dvh'
    return () => {
      html.style.overflow = prev.htmlOverflow
      html.style.height = prev.htmlHeight
      body.style.overflow = prev.bodyOverflow
      body.style.height = prev.bodyHeight
    }
  }, [isAdmin])

  if (isAdmin) {
    return <div className="h-dvh overflow-hidden bg-[#f7f3ee]">{children}</div>
  }

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-white">
        {children}
        <ChatWidget />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
