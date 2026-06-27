import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Non-Profit Accounting UAE | NGO Finance, Donor Reporting | Finanshels',
  description:
    'Specialist accounting services for UAE non-profits, charities, and public benefit entities. Fund accounting, restricted fund tracking, donor reporting, CT exemption applications, VAT guidance, and audit coordination. Trusted by 7,000+ UAE businesses.',
  alternates: { canonical: '/non-profit-accounting' },
  openGraph: {
    title: 'Non-Profit Accounting UAE | Finanshels',
    description:
      'Fund accounting, donor reporting, Corporate Tax exemption, and audit coordination for UAE charities, foundations, and NGOs.',
    url: '/non-profit-accounting',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
