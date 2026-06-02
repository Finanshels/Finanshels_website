import ServiceDetailPage from '../../screens/services/ServiceDetailPage'
import { SERVICE_PAGES } from '../../data/servicePages'

export const metadata = {
  title: 'UAE Corporate Tax Registration | FTA Registration in 48 Hours | Finanshels',
  description:
    'Register your UAE business for Corporate Tax with the FTA. Entity classification, free zone QFZP assessment, and EmaraTax submission handled in 48 hours. From AED 1,500.',
  alternates: { canonical: '/corporate-tax-registration-uae' },
  openGraph: {
    title: 'UAE Corporate Tax Registration | Finanshels',
    description:
      'Register your UAE business for Corporate Tax with the FTA. Entity classification, QFZP assessment, and EmaraTax submission in 48 hours.',
    url: '/corporate-tax-registration-uae',
    type: 'website',
  },
}

export default function Page() {
  return <ServiceDetailPage page={SERVICE_PAGES['corporate-tax-registration-uae']} />
}
