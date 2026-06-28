import Pricing from '../../screens/Pricing'
import { getTestimonials } from '@/lib/cms/reviewsRepository'

// Reviews change rarely; revalidate hourly (customer_reviews has no auto-revalidation route).
export const revalidate = 3600

export const metadata = {
  title: 'Pricing',
  description:
    'Transparent pricing for accounting, VAT, corporate tax, and CFO services in the UAE. Estimate your monthly cost and pick a plan built for your stage.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Finanshels Pricing',
    description:
      'Transparent pricing for accounting, VAT, corporate tax, and CFO services in the UAE.',
    url: '/pricing',
    type: 'website',
  },
}

export default async function Page() {
  const cmsTestimonials = await getTestimonials({ limit: 12 })
  return <Pricing cmsTestimonials={cmsTestimonials} />
}
