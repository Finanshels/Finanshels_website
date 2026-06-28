/**
 * Single source of truth for the shared content-category taxonomy. Used as:
 *   - `blog_category`    (blog posts)      — single select
 *   - `term_category`    (glossary terms)  — single select
 *   - `service_category` (customer reviews, FAQs) — multi-select "Services"
 *
 * One list so every collection buckets content the same way and a service page
 * can pull matching FAQs / testimonials by the same slug. `general` is the
 * catch-all for content not tied to a specific service.
 *
 * Pure data — NO React / lucide imports — so it is safe to import from
 * `collectionDefinitions.ts` AND `definitions/blocks.ts` without a runtime
 * import cycle (collectionDefinitions re-exports blocks).
 */

export const CONTENT_CATEGORY_OPTIONS: string[] = [
  'accounting-bookkeeping',
  'vat',
  'corporate-tax',
  'audit-assurance',
  'compliance-aml',
  'cfo-cash-flow',
  'ai-tech-finance',
  'startup-sme-finance',
  'business-setup-free-zone',
  'payroll',
  'general',
]

/** Slug → human label for dropdowns, chips, and headings. */
export const CONTENT_CATEGORY_LABELS: Record<string, string> = {
  'accounting-bookkeeping': 'Accounting & Bookkeeping',
  vat: 'VAT',
  'corporate-tax': 'Corporate Tax',
  'audit-assurance': 'Audit & Assurance',
  'compliance-aml': 'Compliance & AML',
  'cfo-cash-flow': 'CFO & Cash Flow',
  'ai-tech-finance': 'AI & Tech in Finance',
  'startup-sme-finance': 'Startup & SME Finance',
  'business-setup-free-zone': 'Business Setup & Free Zone',
  payroll: 'Payroll',
  general: 'General',
}
