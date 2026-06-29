import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'E-Commerce Accounting UAE | Shopify, Noon, Amazon.ae | Finanshels' },
  description:
    'Specialist accounting services for UAE e-commerce businesses. Shopify, Noon, Amazon.ae, COD reconciliation, COGS and inventory accounting, VAT compliance, cross-border GCC VAT, and Corporate Tax. From AED 800/month. Trusted by 7,000+ UAE businesses.',
  alternates: { canonical: '/ecommerce-accounting' },
  openGraph: {
    title: 'E-Commerce Accounting UAE | Finanshels',
    description:
      'Multi-channel reconciliation, inventory-based COGS, VAT, and cross-border GCC VAT for UAE Shopify, Noon, and Amazon.ae sellers.',
    url: '/ecommerce-accounting',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
