import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UAE Corporate Tax Registration | FTA Registration in 48 Hours | Finanshels',
  description:
    'Register your UAE business for Corporate Tax with the FTA. Entity classification, free zone QFZP assessment, and EmaraTax submission handled in 48 hours. From AED 1,500.',
  alternates: { canonical: '/corporate-tax-registration-uae' },
  openGraph: {
    title: 'UAE Corporate Tax Registration | Finanshels',
    description: 'Entity classification, QFZP assessment, and EmaraTax submission in 48 hours. AED 10,000 penalty avoided.',
    url: '/corporate-tax-registration-uae',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
