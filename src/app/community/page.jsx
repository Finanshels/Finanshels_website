import Community from '@/screens/Community'

export const metadata = {
  title: 'Finanshels Founder Community | UAE Founder Slack Community',
  description:
    'Join the Finanshels Slack community for UAE and GCC founders to ask questions, trade referrals, and learn from operators building in the region.',
  alternates: {
    canonical: '/community',
  },
  openGraph: {
    title: 'Finanshels Founder Slack Community | Finanshels',
    description:
      'A private Slack community for UAE and GCC founders to ask questions, share intros, and get practical operator context.',
    url: '/community',
    type: 'website',
  },
}

export default function Page() {
  return <Community />
}
