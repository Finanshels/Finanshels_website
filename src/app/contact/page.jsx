import Contact from '../../screens/Contact'

export const metadata = {
  title: 'Contact Us',
  description:
    'Talk to Finanshels. Senior finance operators reply within 24 hours — book a scoping call, WhatsApp us, or send a note about VAT, corporate tax, bookkeeping, or CFO support.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Finanshels',
    description:
      'Senior finance operators reply within 24 hours. Book a scoping call or send us a note.',
    url: '/contact',
    type: 'website',
  },
}

export default function Page() {
  return <Contact />
}
