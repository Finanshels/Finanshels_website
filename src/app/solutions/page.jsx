import Solutions from '../../screens/Solutions'

export const metadata = {
  title: 'Solutions',
  description:
    'Finance solutions tailored to your industry and stage — from startup bookkeeping to corporate tax compliance and CFO-level reporting across the UAE.',
  alternates: { canonical: '/solutions' },
  openGraph: {
    title: 'Finanshels Solutions',
    description:
      'Finance solutions tailored to your industry and stage — bookkeeping, tax compliance, and CFO-level reporting across the UAE.',
    url: '/solutions',
    type: 'website',
  },
}

export default function Page() {
  return <Solutions />
}
