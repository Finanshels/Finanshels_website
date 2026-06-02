import ServiceDetailPage from '../../screens/services/ServiceDetailPage'
import { SERVICE_PAGES } from '../../data/servicePages'

export const metadata = {
  title: 'UAE Corporate Tax Filing | Accurate CT Returns | Finanshels',
  description:
    'Finanshels files your UAE Corporate Tax return — books review, taxable income calculation, related-party disclosures, and EmaraTax submission before your deadline.',
  alternates: { canonical: '/corporate-tax-filing-uae' },
  openGraph: {
    title: 'UAE Corporate Tax Filing | Finanshels',
    description:
      'Full CT return preparation: books review, taxable income calculation, QFZP compliance, and EmaraTax submission. Or we cover the penalty.',
    url: '/corporate-tax-filing-uae',
    type: 'website',
  },
}

export default function Page() {
  return <ServiceDetailPage page={SERVICE_PAGES['corporate-tax-filing-uae']} />
}
