import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Jewellery & Precious Metals Accounting UAE | Gold VAT, AML | Finanshels' },
  description:
    'Specialist accounting for UAE jewellers and precious-metals dealers. Gold-price-aware inventory, the gold & diamond reverse-charge VAT scheme, DPMS AML alignment, consignment stock, and Corporate Tax. From AED 999/month. Trusted by 7,000+ UAE businesses.',
  alternates: { canonical: '/jewellery-business-accounting' },
  openGraph: {
    title: 'Jewellery & Precious Metals Accounting UAE | Finanshels',
    description:
      'Gold-aware inventory, the gold & diamond reverse-charge VAT scheme, and DPMS AML alignment for UAE jewellers and bullion dealers.',
    url: '/jewellery-business-accounting',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
