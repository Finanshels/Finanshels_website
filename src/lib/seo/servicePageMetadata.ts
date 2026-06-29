import type { Metadata } from 'next'

/**
 * Per-route SEO metadata for the sector, service, and standalone marketing
 * pages that render via `ServiceDetailPage` / `AccountingServiceLocation` /
 * `AmlPage`.
 *
 * WHY THIS EXISTS (FIX-062) — these pages previously exported NO `metadata`, so Next.js
 * inherited the root layout's `alternates: { canonical: '/' }` (metadata is
 * merged down the segment tree). Every one of them emitted
 * `<link rel="canonical" href="https://www.finanshels.com/">` and the
 * homepage's `<title>` — telling Google they were duplicates of the homepage.
 * That de-indexed the exact pages targeting our highest-intent commercial
 * keywords ("VAT filing UAE", "corporate tax registration UAE", sector
 * accounting). This module gives each page a unique, self-referential
 * canonical plus bespoke title + description.
 *
 * Titles OMIT the "| Finanshels" suffix — the root layout's title template
 * (`%s | Finanshels`) appends it. Keep titles ≤ ~47 chars so the rendered
 * title (with the brand suffix) stays under ~60 chars.
 *
 * Descriptions target ~150–160 chars: action + topic + value + one detail.
 */
interface SeoCopy {
  title: string
  description: string
}

export const SERVICE_PAGE_SEO: Record<string, SeoCopy> = {
  // ── Sector pages (`SECTOR_PAGES`) ──────────────────────────────────────
  '/small-business-accounting': {
    title: 'Small Business Accounting in the UAE',
    description:
      'Monthly bookkeeping, VAT, and Corporate Tax for UAE small businesses. Books closed by Day 10, FTA-compliant filings, and a dedicated accountant from AED 799/mo.',
  },
  '/real-estate-accounting': {
    title: 'Real Estate Accounting in the UAE',
    description:
      'Accounting, VAT, and Corporate Tax for UAE real estate firms, brokers, and developers — service-charge tracking, FTA-compliant filings, and monthly reports.',
  },
  '/healthcare-accounting': {
    title: 'Healthcare & Clinic Accounting in the UAE',
    description:
      'Accounting and VAT for DHA and DOH-licensed clinics in the UAE — correct zero-rated vs standard-rated treatment, insurance receivables, and monthly clinic P&L.',
  },
  '/non-profit-accounting': {
    title: 'Non-Profit Accounting in the UAE',
    description:
      'Fund accounting, grant tracking, and compliance for UAE non-profits and foundations — transparent financial reports and audit-ready records every month.',
  },
  '/ecommerce-accounting': {
    title: 'E-Commerce Accounting in the UAE',
    description:
      'Accounting and VAT for UAE e-commerce brands — multi-channel payouts reconciled, inventory and COGS tracked, FTA-compliant filings, and monthly margin reports.',
  },
  '/technology-accounting': {
    title: 'Startup & Tech Accounting in the UAE',
    description:
      'Accounting, VAT, and Corporate Tax for UAE startups and tech companies — investor-ready financials, runway and burn tracking, and a dedicated accountant.',
  },
  '/restaurant-accounting': {
    title: 'Restaurant & F&B Accounting in the UAE',
    description:
      'Accounting and VAT for UAE restaurants and cafes — POS reconciliation, outlet-level P&L, food-cost and delivery-platform tracking, and FTA-compliant filings.',
  },
  '/trading-business-accounting': {
    title: 'Trading Business Accounting in the UAE',
    description:
      'Accounting, VAT, and Corporate Tax for UAE trading companies — inventory and landed-cost tracking, import/export VAT, and audit-ready monthly reports.',
  },
  '/jewellery-business-accounting': {
    title: 'Jewellery Business Accounting in the UAE',
    description:
      'Accounting and VAT for UAE jewellers and precious-metals traders — VAT margin and reverse-charge handling, inventory valuation, and FTA-compliant filings.',
  },
  '/vc-fund-accounting': {
    title: 'VC Fund Accounting in the UAE',
    description:
      'Fund accounting and administration for UAE venture capital funds — NAV, capital calls, LP reporting, carried-interest tracking, and audit-ready statements.',
  },

  // ── Service pages (`SERVICE_PAGES`) ────────────────────────────────────
  '/corporate-tax-registration-uae': {
    title: 'Corporate Tax Registration in the UAE',
    description:
      'Register for UAE Corporate Tax with the FTA and avoid the AED 10,000 late-registration penalty. Finanshels handles your full CT registration from AED 999.',
  },
  '/corporate-tax-filing-uae': {
    title: 'Corporate Tax Filing in the UAE',
    description:
      'File your UAE Corporate Tax return on time with Finanshels — CT computation, Small Business Relief assessment, and FTA submission from reconciled accounts.',
  },
  '/vat-registration-uae': {
    title: 'VAT Registration in the UAE',
    description:
      'Register for UAE VAT with the FTA and avoid the AED 20,000 late-registration penalty. Finanshels handles your full VAT registration from AED 499.',
  },
  '/vat-filing-uae': {
    title: 'VAT Filing & Returns in the UAE',
    description:
      'File accurate quarterly UAE VAT returns with the FTA, on time, every time. Finanshels tags VAT on every transaction and files from clean data — from AED 500.',
  },
  '/audit-services-dubai': {
    title: 'Audit Services in Dubai',
    description:
      'Free-zone and mainland audit support in Dubai. Finanshels prepares audit-ready financial statements and coordinates your statutory audit for renewals and banks.',
  },
  '/company-liquidation-dubai': {
    title: 'Company Liquidation in Dubai',
    description:
      'Wind down your Dubai company the right way. Finanshels manages liquidation accounting, final VAT and Corporate Tax filings, and FTA de-registration end to end.',
  },

  // ── Standalone (`AmlPage`) ─────────────────────────────────────────────
  '/aml-uae': {
    title: 'AML Compliance Services in the UAE',
    description:
      'Meet UAE anti-money-laundering (AML/CFT) obligations. Finanshels handles goAML registration, risk assessments, policies, and ongoing compliance for your business.',
  },

  // ── Product pages (`PRODUCT_PAGES`) — linked from the homepage ──────────
  '/products/corporate-tax-deadline-checker': {
    title: 'UAE Corporate Tax Deadline Checker',
    description:
      'Check your UAE Corporate Tax registration and filing deadlines — and the penalties for missing them — in seconds. A free tool from Finanshels.',
  },
  '/products/hala': {
    title: 'Hala — Real-Time Finance Insights',
    description:
      'Hala gives UAE operators real-time financial insights at a glance — cash, revenue, and runway in one place. A finance copilot from Finanshels.',
  },
  '/products/financial-health-checker': {
    title: 'Financial Health Checker for UAE Businesses',
    description:
      'Run operator-grade diagnostics on your finance stack and get a clear financial-health score for your UAE business. A free tool from Finanshels.',
  },
  '/products/cash-flow-scorecard': {
    title: 'Cash Flow Scorecard for UAE Businesses',
    description:
      'Score and forecast your cash position with confidence. The Finanshels Cash Flow Scorecard gives founders and boards live, on-demand cash visibility.',
  },
  '/products/client-portal': {
    title: 'Client Portal for UAE Founders',
    description:
      'One source of truth between your team and Finanshels — financials, documents, and tasks in a single startup-finance portal. No spreadsheets.',
  },
  '/products/gratuity-calculator-uae': {
    title: 'UAE Gratuity Calculator (End-of-Service)',
    description:
      'Model UAE end-of-service gratuity and EOSB obligations in minutes. A free calculator that keeps HR, finance, and founders aligned on payouts.',
  },
}

/** Trim a description to a SERP-friendly length without cutting mid-word. */
function clampDescription(value: string, max = 160): string {
  const text = value.trim()
  if (text.length <= max) return text
  const slice = text.slice(0, max)
  const lastSpace = slice.lastIndexOf(' ')
  return `${slice.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`
}

/**
 * Build a `Metadata` object with a self-referential canonical. `path` is a
 * site-relative path (e.g. `/vat-filing-uae`); Next resolves it against
 * `metadataBase` from the root layout, so canonical/OG host stays correct
 * regardless of the www-vs-apex decision.
 */
export function buildPageMetadata(args: {
  title: string
  description: string
  path: string
  image?: string
}): Metadata {
  const { title, path, image } = args
  const description = clampDescription(args.description)
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | Finanshels`,
      description,
      url: path,
      type: 'website',
      ...(image ? { images: [image] } : {}),
    },
    twitter: {
      title: `${title} | Finanshels`,
      description,
    },
  }
}

/**
 * Metadata for a sector/service route. Prefers the bespoke copy in
 * `SERVICE_PAGE_SEO`, falling back to the page's own title/description so a
 * new route is never left inheriting the homepage canonical.
 */
export function serviceRouteMetadata(
  path: string,
  fallback?: { title?: string; description?: string }
): Metadata {
  const seo = SERVICE_PAGE_SEO[path]
  return buildPageMetadata({
    title: seo?.title ?? fallback?.title ?? 'Finanshels',
    description: seo?.description ?? fallback?.description ?? '',
    path,
  })
}
