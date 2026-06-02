import AmlPage from '../../screens/AmlPage'

export const metadata = {
  title: 'AML Compliance UAE | DNFBP goAML, CDD, FIU Reporting | Finanshels',
  description:
    'End-to-end AML compliance for UAE Designated Non-Financial Businesses — goAML registration, Business Risk Assessment, CDD procedures, and FIU reporting. Compliant in 7 days.',
  alternates: { canonical: '/aml-uae' },
  openGraph: {
    title: 'AML Compliance UAE | Finanshels',
    description:
      'From goAML registration and risk assessment to FIU reporting and staff training. Avoid penalties up to AED 5,000,000.',
    url: '/aml-uae',
    type: 'website',
  },
}

export default function Page() {
  return <AmlPage />
}
