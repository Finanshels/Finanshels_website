import ServiceDetailPage from '../../screens/services/ServiceDetailPage'
import { SERVICE_PAGES } from '../../data/servicePages'

export const metadata = {
  title: 'Audit Services Dubai | Audit-Ready Financials | Finanshels',
  description:
    'Finanshels prepares UAE businesses for statutory and FTA audits — clean accrual-basis accounts, working paper packs, and auditor liaison support.',
  alternates: { canonical: '/audit-services-dubai' },
  openGraph: {
    title: 'Audit Services Dubai | Finanshels',
    description:
      'Statutory audits, internal audits, free zone compliance audits, and FTA audit support. Certified auditors — CPA, CA, ACCA, CMA.',
    url: '/audit-services-dubai',
    type: 'website',
  },
}

export default function Page() {
  return <ServiceDetailPage page={SERVICE_PAGES['audit-services-dubai']} />
}
