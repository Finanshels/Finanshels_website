import Products from '../../screens/Products'

export const metadata = {
  title: 'Products',
  description:
    'Free tools and products from Finanshels — corporate tax checkers, cash-flow scorecards, and financial health calculators for UAE businesses.',
  alternates: { canonical: '/products' },
  openGraph: {
    title: 'Finanshels Products',
    description:
      'Free tools — corporate tax checkers, cash-flow scorecards, and financial health calculators for UAE businesses.',
    url: '/products',
    type: 'website',
  },
}

export default function Page() {
  return <Products />
}
