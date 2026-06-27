import { Inter } from 'next/font/google'
import Home4 from '@/screens/Home4'

// FONT: /home4 now uses the brand font (Inter), same as the rest of the site.
// A single Inter load drives both --font-display and --font-body so the screen's
// inline var(--font-display)/var(--font-body) styles all render Inter.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export default function Page() {
  return (
    <div
      className={inter.variable}
      style={{ '--font-body': 'var(--font-display)', fontFamily: 'var(--font-display)' }}
    >
      <Home4 />
    </div>
  )
}
