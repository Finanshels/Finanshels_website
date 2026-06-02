import ServiceDetailPage from '../../screens/services/ServiceDetailPage'
import { SERVICE_PAGES } from '../../data/servicePages'

export const metadata = {
  title: 'UAE VAT Registration | Get Your FTA TRN in 48 Hours | Finanshels',
  description:
    'Register your UAE business for VAT with the FTA. Threshold assessment, TRN issuance, and compliance setup handled in 48 hours. From AED 750.',
  alternates: { canonical: '/vat-registration-uae' },
  openGraph: {
    title: 'UAE VAT Registration | Finanshels',
    description:
      'Threshold assessment, VAT scheme selection, EmaraTax application, and TRN issuance. Most clients registered within a week.',
    url: '/vat-registration-uae',
    type: 'website',
  },
}

export default function Page() {
  return <ServiceDetailPage page={SERVICE_PAGES['vat-registration-uae']} />
}
