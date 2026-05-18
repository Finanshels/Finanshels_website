import AccountingServiceLocation from '../../screens/locations/AccountingServiceLocation'

export const metadata = {
  title: 'Accounting Services in Abu Dhabi',
  description:
    'Accounting, bookkeeping, VAT, and corporate tax services for businesses in Abu Dhabi. FTA-compliant filings delivered by 135+ finance experts. Get a quote.',
  alternates: { canonical: '/accounting-services-abu-dhabi' },
  openGraph: {
    title: 'Accounting Services in Abu Dhabi | Finanshels',
    description:
      'Accounting, bookkeeping, VAT, and corporate tax services for Abu Dhabi businesses — FTA-compliant and on time.',
    url: '/accounting-services-abu-dhabi',
    type: 'website',
  },
}

const CITY = {
  name: 'Abu Dhabi',
  intro:
    'From ADGM-registered entities to government contractors and growing SMEs, Abu Dhabi businesses rely on Finanshels for clean books, compliant VAT and corporate tax filings, and finance reporting that holds up to scrutiny.',
  why: 'Abu Dhabi businesses operate in a market where governance and compliance expectations are high. Our finance team understands ADGM and mainland structures, FTA requirements, and the corporate tax regime — and we deliver with a dedicated team, predictable monthly reporting, and senior operators who catch issues before they become penalties.',
  faqs: [
    {
      q: 'How much do accounting services in Abu Dhabi cost?',
      a: 'Pricing depends on transaction volume, entity structure, and the services you need. Use our pricing estimator or request a quote and we will scope it precisely for your business.',
    },
    {
      q: 'Do you support ADGM-registered companies?',
      a: 'Yes. We support ADGM entities as well as mainland LLCs in Abu Dhabi, and we understand the VAT and corporate tax implications of each structure.',
    },
    {
      q: 'Can you handle our VAT and corporate tax filings?',
      a: 'Yes. We handle VAT registration and returns and full corporate tax registration, computation, and return filing under the UAE corporate tax regime.',
    },
    {
      q: 'How quickly can you onboard our Abu Dhabi business?',
      a: 'Most clients are fully onboarded within one to two weeks. We migrate your records, set up your software, and agree a clear scope and timeline upfront.',
    },
  ],
}

export default function Page() {
  return <AccountingServiceLocation city={CITY} />
}
