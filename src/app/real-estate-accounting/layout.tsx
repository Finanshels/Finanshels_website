import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Real Estate Agency Accounting UAE | RERA Trust Accounts | Finanshels' },
  description:
    'Specialist accounting services for UAE real estate agencies, developers, and property managers. RERA trust account reconciliation, property VAT treatment, AML compliance, commission income management, and Corporate Tax. Trusted by 7,000+ UAE businesses.',
  alternates: { canonical: '/real-estate-accounting' },
  openGraph: {
    title: 'Real Estate Accounting UAE | Finanshels',
    description:
      'RERA trust reconciliation, property VAT, AML, and Corporate Tax for UAE agencies, developers, and property managers.',
    url: '/real-estate-accounting',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
