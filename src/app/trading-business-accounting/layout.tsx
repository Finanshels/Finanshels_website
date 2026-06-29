import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Trading Business Accounting UAE | Landed Cost, Import VAT | Finanshels' },
  description:
    'Specialist accounting for UAE trading, import/export, and distribution businesses. Landed-cost inventory, import VAT and customs reconciliation, multi-currency FX, free-zone QFZP assessment, and Corporate Tax. From AED 899/month. Trusted by 7,000+ UAE businesses.',
  alternates: { canonical: '/trading-business-accounting' },
  openGraph: {
    title: 'Trading Business Accounting UAE | Finanshels',
    description:
      'Landed-cost inventory, import VAT and customs, multi-currency FX, and Corporate Tax for UAE traders and distributors.',
    url: '/trading-business-accounting',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
