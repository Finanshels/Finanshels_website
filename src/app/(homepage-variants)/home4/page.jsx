import { Inter } from 'next/font/google'
import Home4 from '@/screens/Home4'
import { getTestimonials } from '@/lib/cms/reviewsRepository'

// Reviews change rarely; revalidate hourly. (customer_reviews has no routePattern,
// so CMS saves don't auto-revalidate this page.)
export const revalidate = 3600

// FONT: /home4 now uses the brand font (Inter), same as the rest of the site.
// A single Inter load drives both --font-display and --font-body so the screen's
// inline var(--font-display)/var(--font-body) styles all render Inter.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export default async function Page() {
  // Published + approved reviews → testimonial carousel. Falls back to the
  // screen's built-in demo set when none exist yet.
  const testimonials = await getTestimonials({ limit: 12 })
  return (
    <div
      className={inter.variable}
      style={{ '--font-body': 'var(--font-display)', fontFamily: 'var(--font-display)' }}
    >
      <Home4 testimonials={testimonials} />
    </div>
  )
}
