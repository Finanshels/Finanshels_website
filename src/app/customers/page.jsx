import Customers from '../../screens/Customers'

export const metadata = {
  title: 'Customers',
  description:
    'See how 7,000+ UAE founders and finance teams trust Finanshels for accounting, tax, and compliance. Read customer stories and results.',
  alternates: { canonical: '/customers' },
  openGraph: {
    title: 'Finanshels Customers',
    description:
      'See how 7,000+ UAE founders and finance teams trust Finanshels for accounting, tax, and compliance.',
    url: '/customers',
    type: 'website',
  },
}

export default function Page() {
  return <Customers />
}
