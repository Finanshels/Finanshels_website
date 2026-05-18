import Services from '../../screens/Services'

export const metadata = {
  title: 'Services',
  description:
    'Accounting, bookkeeping, VAT, corporate tax, audit, and fractional CFO services for ambitious UAE teams — delivered by 135+ finance experts.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Finanshels Services',
    description:
      'Accounting, bookkeeping, VAT, corporate tax, audit, and fractional CFO services for ambitious UAE teams.',
    url: '/services',
    type: 'website',
  },
}

export default function Page() {
  return <Services />
}
