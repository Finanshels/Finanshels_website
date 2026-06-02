import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Company Liquidation Dubai | UAE Company Wind-Up | Finanshels',
  description:
    'Finanshels handles the financial side of UAE company liquidation — final accounts, VAT deregistration, CT deregistration, and employee settlement calculations.',
  alternates: { canonical: '/company-liquidation-dubai' },
  openGraph: {
    title: 'Company Liquidation Dubai | Finanshels',
    description: 'Final accounts, FTA clearances, employee EOSB settlements, and liquidation report. Closed cleanly in 45–90 days.',
    url: '/company-liquidation-dubai',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
