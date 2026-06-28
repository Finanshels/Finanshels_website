import Home from '../screens/Home'
import { safeJsonLd } from '@/lib/seo/safeJsonLd'
import { HOME_FAQS } from '@/content/home-faqs'
import { getTestimonials } from '@/lib/cms/reviewsRepository'

// Reviews change rarely; revalidate hourly (customer_reviews has no auto-revalidation route).
export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.finanshels.com'

const PAGE_TITLE = 'UAE Accounting Services | Finanshels'
const PAGE_DESCRIPTION =
  'Bookkeeping, VAT filing, corporate tax, payroll and CFO advisory for UAE businesses. FTA-registered. From AED 1,500/month. Books closed by Day 10, every month.'

export const metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  keywords: ['accounting services UAE', 'bookkeeping UAE', 'VAT filing Dubai', 'corporate tax UAE'],
  alternates: { canonical: '/' },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Finanshels',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/blog?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'AccountingService',
  name: 'Finanshels',
  image: `${SITE_URL}/finanshels_logo.png`,
  url: SITE_URL,
  telephone: '+971507178156',
  email: 'contact@finanshels.com',
  priceRange: 'AED 1,500+/month',
  description: PAGE_DESCRIPTION,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Office 406, Publishing Pavilion, Dubai Production City',
    addressLocality: 'Dubai',
    addressRegion: 'Dubai',
    addressCountry: 'AE',
  },
  // NOTE: approximate Dubai Production City coords — verify exact lat/long for Publishing Pavilion.
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 25.029,
    longitude: 55.192,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:30',
    closes: '18:30',
  },
  areaServed: { '@type': 'Country', name: 'United Arab Emirates' },
  sameAs: [
    'https://linkedin.com/company/finanshels',
    'https://twitter.com/finanshels',
    'https://www.instagram.com/finanshels',
    'https://www.youtube.com/@finanshelshq',
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: HOME_FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
}

export default async function Page() {
  const cmsTestimonials = await getTestimonials({ limit: 12 })
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}
      />
      <Home cmsTestimonials={cmsTestimonials} />
    </>
  )
}
