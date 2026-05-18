import Pricing from '../../screens/Pricing'

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

export default function Page() {
  return <Pricing />
}
