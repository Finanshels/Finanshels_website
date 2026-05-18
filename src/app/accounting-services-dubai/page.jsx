import AccountingServiceLocation from '../../screens/locations/AccountingServiceLocation'

export const metadata = {
  title: 'Accounting Services in Dubai',
  description:
    'Accounting, bookkeeping, VAT, and corporate tax services for businesses in Dubai. FTA-compliant filings delivered by 135+ finance experts. Get a quote.',
  alternates: { canonical: '/accounting-services-dubai' },
  openGraph: {
    title: 'Accounting Services in Dubai | Finanshels',
    description:
      'Accounting, bookkeeping, VAT, and corporate tax services for Dubai businesses — FTA-compliant and on time.',
    url: '/accounting-services-dubai',
    type: 'website',
  },
}

const CITY = {
  name: 'Dubai',
  intro:
    'From DIFC startups to free-zone trading companies and mainland SMEs, Dubai businesses trust Finanshels to keep their books clean, their VAT and corporate tax filings compliant, and their finances investor-ready.',
  why: 'Dubai moves fast — and so does its regulatory environment. Our Dubai finance team combines deep knowledge of FTA requirements, free-zone and mainland structures, and corporate tax with a delivery model built for speed. You get a dedicated team, predictable monthly reporting, and senior operators who flag risks before they become penalties.',
  faqs: [
    {
      q: 'How much do accounting services in Dubai cost?',
      a: 'Pricing depends on transaction volume, entity structure, and the services you need. Use our pricing estimator or request a quote and we will scope it precisely for your business.',
    },
    {
      q: 'Do you work with both free-zone and mainland companies in Dubai?',
      a: 'Yes. We support DIFC, DMCC, IFZA, and other free-zone entities as well as mainland LLCs, and we understand the VAT and corporate tax implications of each.',
    },
    {
      q: 'Can you handle our VAT and corporate tax filings?',
      a: 'Yes. We handle VAT registration and returns and full corporate tax registration, computation, and return filing under the UAE corporate tax regime.',
    },
    {
      q: 'How quickly can you onboard our Dubai business?',
      a: 'Most clients are fully onboarded within one to two weeks. We migrate your records, set up your software, and agree a clear scope and timeline upfront.',
    },
  ],
}

export default function Page() {
  return <AccountingServiceLocation city={CITY} />
}
