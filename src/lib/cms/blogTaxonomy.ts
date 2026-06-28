/**
 * Human-readable labels for the `blog_category` field. Shared by the listing
 * filter bar and the article masthead/cards so the mapping lives in one place.
 */
export const BLOG_CATEGORY_LABELS: Record<string, string> = {
  'accounting-bookkeeping': 'Accounting & Bookkeeping',
  'vat': 'VAT in UAE',
  'corporate-tax': 'Corporate Tax in UAE',
  'audit-assurance': 'Audit & Assurance',
  'compliance-aml': 'Compliance & AML',
  'cfo-cash-flow': 'CFO, Cash Flow & Financial Control',
  'ai-tech-finance': 'AI & Tech in Finance',
  'startup-sme-finance': 'Startup & SME Finance',
  'business-setup-free-zone': 'Business Setup & Free Zone Finance',
  'payroll': 'Payroll & Employee Finance',
}

/** Resolve a category slug to its display label, or `null` when unknown/empty. */
export function blogCategoryLabel(slug?: string | null): string | null {
  if (!slug) return null
  return BLOG_CATEGORY_LABELS[slug] ?? null
}
