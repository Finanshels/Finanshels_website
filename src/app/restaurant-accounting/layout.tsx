import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Restaurant & F&B Accounting UAE | Food Cost, Aggregators | Finanshels',
  description:
    'Specialist accounting for UAE restaurants, cafés, and cloud kitchens. POS and aggregator reconciliation (Talabat, Deliveroo, Careem, Noon Food), food-cost and prime-cost reporting, VAT, WPS payroll, and Corporate Tax. From AED 899/month. Trusted by 7,000+ UAE businesses.',
  alternates: { canonical: '/restaurant-accounting' },
  openGraph: {
    title: 'Restaurant & F&B Accounting UAE | Finanshels',
    description:
      'POS and aggregator reconciliation, food-cost and prime-cost reporting, VAT, and payroll for UAE restaurants and cloud kitchens.',
    url: '/restaurant-accounting',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
