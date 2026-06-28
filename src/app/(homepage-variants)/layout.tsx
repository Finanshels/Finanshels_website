import type { Metadata } from 'next'

/**
 * Homepage variants (/home2, /home3, /home4) are internal experiments that
 * share the real homepage's topical intent. We noindex the whole route group
 * so these duplicates don't compete with `/` for head terms or split ranking
 * signals. home2/home3 are `'use client'` and can't export metadata directly,
 * so a group layout is the only place to set robots for them.
 *
 * Remove (or override per-page) when promoting a variant to the canonical `/`.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function HomepageVariantsLayout({ children }: { children: React.ReactNode }) {
  return children
}
