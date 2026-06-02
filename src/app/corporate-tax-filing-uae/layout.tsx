import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UAE Corporate Tax Filing | Accurate CT Returns | Finanshels',
  description:
    'Finanshels files your UAE Corporate Tax return — books review, taxable income calculation, related-party disclosures, and EmaraTax submission before your deadline.',
  alternates: { canonical: '/corporate-tax-filing-uae' },
  openGraph: {
    title: 'UAE Corporate Tax Filing | Finanshels',
    description: 'Full CT return with working papers. QFZP compliance. Filed before deadline — or we cover the penalty.',
    url: '/corporate-tax-filing-uae',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
