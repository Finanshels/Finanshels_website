import About from '../../screens/About'

export const metadata = {
  title: 'About Us',
  description:
    'Meet the team behind Finanshels — finance, tax, and compliance specialists helping 6,000+ UAE businesses stay audit-ready and growth-focused.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Finanshels',
    description:
      'Finance, tax, and compliance specialists helping 6,000+ UAE businesses stay audit-ready and growth-focused.',
    url: '/about',
    type: 'website',
  },
}

export default function Page() {
  return <About />
}
