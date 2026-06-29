import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'UAE VAT Registration | Get Your FTA TRN in 48 Hours | Finanshels' },
  description:
    'Register your UAE business for VAT with the FTA. Threshold assessment, TRN issuance, and compliance setup handled in 48 hours. From AED 750.',
  alternates: { canonical: '/vat-registration-uae' },
  openGraph: {
    title: 'UAE VAT Registration | Finanshels',
    description: 'Threshold assessment, VAT scheme selection, EmaraTax application, and TRN issuance. Most clients registered within a week.',
    url: '/vat-registration-uae',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
