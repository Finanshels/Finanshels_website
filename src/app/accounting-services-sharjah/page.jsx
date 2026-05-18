import AccountingServiceLocation from '../../screens/locations/AccountingServiceLocation'

export const metadata = {
  title: 'Accounting Services in Sharjah',
  description:
    'Accounting, bookkeeping, VAT, and corporate tax services for businesses in Sharjah. FTA-compliant filings delivered by 135+ finance experts. Get a quote.',
  alternates: { canonical: '/accounting-services-sharjah' },
  openGraph: {
    title: 'Accounting Services in Sharjah | Finanshels',
    description:
      'Accounting, bookkeeping, VAT, and corporate tax services for Sharjah businesses — FTA-compliant and on time.',
    url: '/accounting-services-sharjah',
    type: 'website',
  },
}

const CITY = {
  name: 'Sharjah',
  intro:
    'From SPC Free Zone startups to manufacturers and family-run SMEs, Sharjah businesses trust Finanshels to keep their books clean, their VAT and corporate tax filings compliant, and their finances ready for growth.',
  why: 'Sharjah is home to a fast-growing base of free-zone and mainland businesses, many of them cost-conscious SMEs. Our finance team pairs deep knowledge of SPC Free Zone and mainland structures, FTA requirements, and corporate tax with an efficient delivery model — a dedicated team, predictable monthly reporting, and senior operators who flag risks early.',
  faqs: [
    {
      q: 'How much do accounting services in Sharjah cost?',
      a: 'Pricing depends on transaction volume, entity structure, and the services you need. Use our pricing estimator or request a quote and we will scope it precisely for your business.',
    },
    {
      q: 'Do you work with SPC Free Zone companies in Sharjah?',
      a: 'Yes. We support SPC Free Zone and other Sharjah free-zone entities as well as mainland LLCs, and we understand the VAT and corporate tax implications of each.',
    },
    {
      q: 'Can you handle our VAT and corporate tax filings?',
      a: 'Yes. We handle VAT registration and returns and full corporate tax registration, computation, and return filing under the UAE corporate tax regime.',
    },
    {
      q: 'How quickly can you onboard our Sharjah business?',
      a: 'Most clients are fully onboarded within one to two weeks. We migrate your records, set up your software, and agree a clear scope and timeline upfront.',
    },
  ],
}

export default function Page() {
  return <AccountingServiceLocation city={CITY} />
}
