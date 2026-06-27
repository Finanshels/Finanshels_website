import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Small Business Accounting UAE | SME Finance, Zero Fines | Finanshels',
  description:
    'Accounting services for UAE small businesses — clinics, salons, gyms, restaurants, consultancies, and service firms. Monthly bookkeeping, VAT, Corporate Tax, and management reports. From AED 799/month. Trusted by 7,000+ UAE businesses.',
  alternates: { canonical: '/small-business-accounting' },
  openGraph: {
    title: 'Small Business Accounting UAE | Finanshels',
    description:
      'Monthly bookkeeping, VAT, and Corporate Tax for UAE SMEs — fixed monthly pricing, dedicated accountant, zero fines.',
    url: '/small-business-accounting',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
