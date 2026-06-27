import type { ServicePage } from '../service-pages'

// NOTE: Thin stub. The source copy deck only provides metadata, the H1, and one
// opening sentence for this sector. Hero + SEO + proof numbers are real; the rest
// of the page renders from ServiceDetailPage's generic fallbacks until full body
// copy is written. Do not invent detailed challenges/FAQs here — add them when the
// finalised technology copy is available.
export const technology: ServicePage = {
  title: 'Technology & Startup Accounting',
  subtitle:
    'Startup and technology accounting in the UAE — investor-ready from month one.',
  description:
    'Your investor will ask about burn rate, runway, and MRR waterfall in the first five minutes of your next board meeting — and the quality of your answer depends entirely on the quality of your books. Finanshels keeps UAE tech startups, SaaS businesses, fintechs, and AI companies investor-ready with clean monthly accounts, board-grade reporting, and the tax compliance your cap table expects.',
  stats: [
    { label: 'UAE businesses', value: '7,000+' },
    { label: 'Trustpilot rating', value: '4.9' },
    { label: 'Starting from', value: 'AED 499/mo' },
  ],
  pricingTiers: [
    {
      name: 'Startup plan',
      price: 'AED 499/month',
      highlighted: true,
      bestFor: 'Early-stage UAE tech startups and SaaS businesses',
      includes: [
        'Monthly bookkeeping and bank reconciliation',
        'Monthly management accounts (P&L and balance sheet)',
        'Corporate Tax registration and annual filing',
        'Compliance calendar for FTA deadlines',
        'Dedicated accountant',
      ],
    },
  ],
  pricingNote:
    'Technology and startup accounting from AED 499/month — investor-grade reporting at fixed pricing.',
}
