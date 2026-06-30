'use client'

import { usePathname } from 'next/navigation'
import { ChatWidget } from '../chat/ChatWidget'
import { AnnouncementBar } from './AnnouncementBar'
import Footer from './Footer'
import Navbar from './Navbar'
import type { NavTool } from '@/lib/tools/types'
import { EMPTY_ANNOUNCEMENT, type SiteAnnouncement } from '@/lib/cms/siteAnnouncementTypes'

/**
 * Admin routes render without the marketing shell (nav + footer), which was
 * stealing height and making `100vh` math wrong.
 *
 * FIX-050: admin pages must scroll. The previous FIX-046 locked <html>/<body>
 * to `overflow:hidden; height:100dvh` and wrapped every admin route in
 * `h-dvh overflow-hidden`. That suited the editor (an app-like fixed shell with
 * its own internal scroll panes) but TRAPPED every other admin page — listings,
 * settings, lists — clipping anything past one viewport with no way to scroll
 * (reported: "where the fuck is scrolling"). The wrapper is now `min-h-dvh` and
 * scrolls normally; the CMS editor view keeps its own self-contained
 * `h-dvh overflow-hidden` shell (see src/app/admin/cms/page.tsx), so it stays
 * pinned to the viewport while listings/settings scroll the page.
 */
export default function AppChrome({
  children,
  navTools = [],
  announcement = EMPTY_ANNOUNCEMENT,
}: {
  children: React.ReactNode
  navTools?: NavTool[]
  announcement?: SiteAnnouncement
}) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const isLandingPage = pathname.startsWith('/landing-pages')

  if (isAdmin) {
    return <div className="min-h-dvh bg-[#f7f3ee]">{children}</div>
  }

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-white">
        {children}
        <AnnouncementBar announcement={announcement} />
        <ChatWidget />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar navTools={navTools} />
      {/*
        Global breathing room under the fixed 80px (h-20) navbar so the first
        section never butts against it. Kept WELL under the navbar height: on
        full-bleed hero pages (e.g. the dark homepage hero) the shifted top strip
        stays hidden behind the ~90%-opaque blurred navbar, while heading-first
        content pages (guides, listings) gain a consistent gap. Per-page heroes
        keep their own pt on top of this.
      */}
      <main className="flex-1 pt-6 sm:pt-8">{children}</main>
      <Footer />
      <AnnouncementBar announcement={announcement} />
      <ChatWidget />
    </div>
  )
}
