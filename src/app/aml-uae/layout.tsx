import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'AML Compliance UAE | DNFBP goAML Registration & FIU Reporting | Finanshels' },
  description:
    'End-to-end AML compliance for UAE Designated Non-Financial Businesses — goAML registration, Business Risk Assessment, CDD procedures, and FIU reporting. Compliant in 7 days.',
  alternates: { canonical: '/aml-uae' },
  openGraph: {
    title: 'AML Compliance UAE | Finanshels',
    description: 'goAML registration, risk assessment, FIU reporting, and staff training. Avoid penalties up to AED 5,000,000.',
    url: '/aml-uae',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
