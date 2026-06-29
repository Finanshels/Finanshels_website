import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'VC Fund Accounting UAE | LP Reporting, NAV, Carry | Finanshels' },
  description:
    'Specialist fund accounting for UAE, DIFC, and ADGM venture capital managers. LP capital accounts, NAV and fair-value valuation, management fee and carried interest, QIF Corporate Tax exemption, and audit coordination. Trusted by 7,000+ UAE businesses.',
  alternates: { canonical: '/vc-fund-accounting' },
  openGraph: {
    title: 'VC Fund Accounting UAE | Finanshels',
    description:
      'LP capital accounts, defensible NAV, management fee and carry, and QIF Corporate Tax assessment for UAE, DIFC, and ADGM funds.',
    url: '/vc-fund-accounting',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
