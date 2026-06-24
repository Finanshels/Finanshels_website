/**
 * Canonical FAQ data for the homepage and /faq page.
 * `a` is plain text used for JSON-LD schema.
 * `answerParts` is optional rich content for UI rendering (text + inline links).
 */
export const HOME_FAQS = [
  {
    q: 'What exactly does Finanshels do?',
    a: 'Finanshels is your complete outsourced finance team. We handle your monthly bookkeeping, VAT returns, Corporate Tax registration and filing, management reporting, audit coordination, and CFO support — all reviewed by qualified accountants and delivered on a fixed monthly fee. You get a finance function without hiring one.',
  },
  {
    q: 'I already have a freelancer handling my books. Why would I switch?',
    a: "A freelancer handles transactions. Finanshels owns outcomes. That means your VAT treatment is reviewed, your CT position is reconciled, your books are accrual-ready, and your monthly reports tell you something useful. If your bank, auditor, or investor ever asks for financials, you'll know the answer before they do.",
  },
  {
    q: 'I use Zoho Books / QuickBooks / Wafeq. Do I need to switch software?',
    a: 'No. Finanshels works with your existing accounting software. The platform is a tool — what matters is who reviews the output, owns the classifications, files the returns, and monitors the compliance calendar. That\'s what we do.',
  },
  {
    q: 'How do I know the quality of the accounting is actually good?',
    a: 'Every set of books we deliver goes through an accrual quality checklist: bank reconciliation, AR and AP ageing, VAT treatment review, vendor mapping, accruals and prepayments, and accountant sign-off before reports are released. Your books will be ready for an FTA query, an audit, or an investor review from day one.',
  },
  {
    q: "What's the difference between Finanshels and a traditional accounting firm in the UAE?",
    a: 'Traditional firms are reactive — you hear from them at filing season. Finanshels operates on a monthly rhythm: books closed, reports delivered, compliance calendar updated, and your accountant available when you need them. We\'re also priced significantly below what an in-house accountant costs, with a team behind every client rather than a single point of failure.',
  },
  {
    q: 'Do I need to do anything once I sign up?',
    a: 'Very little. We handle document collection, categorisation, reconciliation, filings, and reporting. If something needs your input — an unusual transaction, a document we can\'t locate, a decision that affects your tax position — we\'ll flag it clearly and tell you exactly what we need. Most founders spend less than an hour a month on finance after onboarding.',
  },
  {
    q: 'What does Corporate Tax mean for my UAE business?',
    a: 'Every UAE business must register for Corporate Tax with the FTA — regardless of size, free zone status, or whether your profits fall below the AED 375,000 zero-rate threshold. The penalty for not registering is a flat AED 10,000. Finanshels handles CT registration, confirms your correct classification, assesses QFZP eligibility for free zone entities, and files your annual return. It\'s included in all recurring plans.',
    answerParts: [
      { text: 'Every UAE business must register for Corporate Tax with the FTA — regardless of size, free zone status, or whether your profits fall below the AED 375,000 zero-rate threshold. The penalty for not registering is a flat AED 10,000. Finanshels handles ' },
      { link: '/corporate-tax-registration-uae', label: 'CT registration' },
      { text: ', confirms your correct classification, assesses QFZP eligibility for free zone entities, and files your annual return. It\'s included in all recurring plans.' },
    ],
  },
  {
    q: 'My books are behind. Can you still help?',
    a: "Yes — and it's more common than you'd think. We start with a Books Health Check to assess where things stand, scope the cleanup required, and give you a fixed price before we begin. Once your opening position is clean, we move you onto a monthly plan. You don't need to be in perfect shape to get started.",
  },
  {
    q: 'How much does Finanshels cost?',
    a: 'Plans start from AED 499 per month for growing service businesses and scale based on transaction volume, VAT status, entity count, and reporting complexity. Every plan includes monthly bookkeeping, CT and VAT management, a compliance calendar, and monthly financial reports. For most UAE founders, it\'s a fraction of the fully loaded cost of one in-house accountant — without the visa, the leave, or the single-person risk.',
    answerParts: [
      { text: 'Plans start from AED 499 per month for growing service businesses and scale based on transaction volume, VAT status, entity count, and reporting complexity. Every ' },
      { link: '/pricing', label: 'plan' },
      { text: ' includes monthly bookkeeping, CT and VAT management, a compliance calendar, and monthly financial reports. For most UAE founders, it\'s a fraction of the fully loaded cost of one in-house accountant — without the visa, the leave, or the single-person risk.' },
    ],
  },
  {
    q: 'How quickly can we get started?',
    a: "Typically within 48 hours of onboarding. We confirm your entity setup, request your documents, and begin the month-end close on the current period. Your first management report is delivered at the end of your first full month with us.",
  },
]
