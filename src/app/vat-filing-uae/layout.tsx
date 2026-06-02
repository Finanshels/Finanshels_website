import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UAE VAT Filing | Quarterly Returns Filed in 48 Hours | Finanshels',
  description:
    'Finanshels prepares and files your UAE VAT return with the FTA — every transaction correctly coded, quarterly submission within 48 hours of period close, penalty-free.',
  alternates: { canonical: '/vat-filing-uae' },
  openGraph: {
    title: 'UAE VAT Filing | Finanshels',
    description: 'Every transaction correctly coded, filed before the 28th every quarter. Or we cover the penalty.',
    url: '/vat-filing-uae',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
