import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Healthcare Accounting UAE | Clinic Finance, Zero-Rated VAT | Finanshels' },
  description:
    'Specialist accounting services for UAE clinics and healthcare businesses. DHA/DOH VAT treatment, insurance receivables management, clinic-level P&L, Corporate Tax, and audit-ready records. From AED 799/month. Trusted by 7,000+ UAE businesses.',
  alternates: { canonical: '/healthcare-accounting' },
  openGraph: {
    title: 'Healthcare Accounting UAE | Finanshels',
    description:
      'VAT treatment by service type, insurance receivables, clinic-level P&L, and Corporate Tax for UAE clinics and healthcare groups.',
    url: '/healthcare-accounting',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
