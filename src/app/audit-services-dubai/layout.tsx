import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Audit Services Dubai | Statutory & FTA Audit Support | Finanshels',
  description:
    'Finanshels prepares UAE businesses for statutory and FTA audits — clean accrual-basis accounts, working paper packs, and auditor liaison support.',
  alternates: { canonical: '/audit-services-dubai' },
  openGraph: {
    title: 'Audit Services Dubai | Finanshels',
    description: 'Statutory audits, internal audits, free zone compliance audits, and FTA audit support. 100% inspection pass rate.',
    url: '/audit-services-dubai',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
