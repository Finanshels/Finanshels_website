import ServiceDetailPage from '../../screens/services/ServiceDetailPage'
import { SERVICE_PAGES } from '../../data/servicePages'

export const metadata = {
  title: 'Company Liquidation Dubai | UAE Company Wind-Up | Finanshels',
  description:
    'Finanshels handles the financial side of UAE company liquidation — final accounts, VAT deregistration, CT deregistration, and employee settlement calculations.',
  alternates: { canonical: '/company-liquidation-dubai' },
  openGraph: {
    title: 'Company Liquidation Dubai | Finanshels',
    description:
      'Final accounts, FTA VAT and CT deregistration, employee EOSB settlements, and liquidation report. Closed cleanly in 45–90 days.',
    url: '/company-liquidation-dubai',
    type: 'website',
  },
}

export default function Page() {
  return <ServiceDetailPage page={SERVICE_PAGES['company-liquidation-dubai']} />
}
