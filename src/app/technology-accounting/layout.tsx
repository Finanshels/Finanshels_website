import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Technology & Startup Accounting UAE | Board Reports, Burn Rate | Finanshels' },
  description:
    'Specialist accounting services for UAE tech startups, SaaS businesses, fintech, and AI companies. MRR revenue recognition, burn rate reporting, investor-grade board packs, R&D CT treatment, and ESOP accounting. From AED 499/month. Trusted by 7,000+ UAE businesses.',
  alternates: { canonical: '/technology-accounting' },
  openGraph: {
    title: 'Technology & Startup Accounting UAE | Finanshels',
    description:
      'Investor-grade accounting for UAE startups and SaaS — burn rate, runway, MRR, and board-ready reporting from month one.',
    url: '/technology-accounting',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
