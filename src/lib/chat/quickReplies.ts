import 'server-only'

export interface QuickReply {
  id: string
  patterns: RegExp[]
  reply: string | ((match: RegExpExecArray) => string)
  followUps?: string[]
  triggersLeadCapture?: boolean
}

interface ServicePage {
  description: string
  pageLabel: string
  pageUrl: string
  extras?: Array<{ label: string; url: string }>
}

// Keys MUST match the strings emitted by LeadForm's SERVICE_GROUPS.
// URLs are sourced from https://finanshels.com/sitemap.xml (live as of 2026-05).
const PRICING_LINK = { label: 'Pricing', url: 'https://finanshels.com/pricing' }
const BOOKKEEPING_URL = 'https://finanshels.com/bookkeeping-services-uae'
const CT_REG_URL = 'https://finanshels.com/services/corporate-tax-registration-in-uae'
const CT_FILE_URL = 'https://finanshels.com/services/corporate-tax-return-filing-in-uae'
const VAT_URL = 'https://finanshels.com/services/vat-filing-and-accounting-in-uae'
const COMPLIANCE_URL = 'https://finanshels.com/services/business-compliance-services-in-uae'
const AUDIT_URL = 'https://finanshels.com/auditing-services-uae'
const AML_URL = 'https://finanshels.com/aml-compliance-uae'
const LIQUIDATION_URL = 'https://finanshels.com/services/company-liquidation-services-in-uae'
const CFO_URL = 'https://finanshels.com/cfo-services-uae'
const SALARY_BENCHMARK_URL = 'https://finanshels.com/tools/finance-hiring-salary-benchmark'

const SERVICE_PAGES: Record<string, ServicePage> = {
  // ─── Tax & FTA ──────────────────────────────────────────────────────────
  'Corporate Tax Registration': {
    description:
      'UAE Corporate Tax registration with the FTA — deadline tracking, document prep, and TRN issuance.',
    pageLabel: 'Corporate Tax Registration',
    pageUrl: CT_REG_URL,
    extras: [
      {
        label: 'Registration deadline checker',
        url: 'https://finanshels.com/tools/corporate-tax-registration-deadline-checker-uae',
      },
      PRICING_LINK,
    ],
  },
  'Corporate Tax Filing': {
    description:
      'Annual UAE Corporate Tax return preparation and filing for mainland and free-zone entities, including small business relief eligibility.',
    pageLabel: 'Corporate Tax Return Filing',
    pageUrl: CT_FILE_URL,
    extras: [
      {
        label: 'Filing deadline checker',
        url: 'https://finanshels.com/tools/corporate-tax-filing-deadline-checker-in-uae',
      },
    ],
  },
  'Corporate Tax Deregistration': {
    description:
      'Corporate Tax deregistration when ceasing UAE operations — handled with the FTA on your behalf.',
    pageLabel: 'Corporate Tax Services',
    pageUrl: CT_REG_URL,
  },
  'VAT Registration': {
    description:
      'UAE VAT registration with the FTA. Mandatory once taxable supplies cross AED 375,000 over 12 months; voluntary from AED 187,500.',
    pageLabel: 'VAT Filing & Accounting',
    pageUrl: VAT_URL,
  },
  'VAT Filing': {
    description:
      'Quarterly UAE VAT return preparation and submission to the FTA, including input VAT reconciliation and zero-rated review.',
    pageLabel: 'VAT Filing & Accounting',
    pageUrl: VAT_URL,
    extras: [
      { label: 'Claim a VAT refund', url: 'https://finanshels.com/services/claim-your-vat-refund-in-uae' },
    ],
  },
  'VAT Deregistration': {
    description:
      'VAT deregistration when supplies fall below the threshold or you wind down operations — coordinated with the FTA.',
    pageLabel: 'VAT Services',
    pageUrl: VAT_URL,
  },
  'FTA Amendments': {
    description:
      'Amendments to FTA records — trade licence updates, activity changes, ownership changes, and other regulatory updates.',
    pageLabel: 'Business Compliance Services',
    pageUrl: COMPLIANCE_URL,
  },

  // ─── Accounting ─────────────────────────────────────────────────────────
  'Monthly Accounting': {
    description:
      'Monthly bookkeeping, bank reconciliation, and management reports — sized to your transaction volume.',
    pageLabel: 'Bookkeeping Services',
    pageUrl: BOOKKEEPING_URL,
    extras: [PRICING_LINK],
  },
  'Quarterly Accounting': {
    description:
      'Quarterly books cleanup and reporting — good fit if you keep day-to-day records yourself but want a quarterly review.',
    pageLabel: 'Bookkeeping Services',
    pageUrl: BOOKKEEPING_URL,
    extras: [PRICING_LINK],
  },
  'Annual Accounting': {
    description: 'Year-end books closure, financial statement prep, and tax-ready reports.',
    pageLabel: 'Bookkeeping Services',
    pageUrl: BOOKKEEPING_URL,
    extras: [PRICING_LINK],
  },
  Accounting: {
    description:
      'Full-service accounting — bookkeeping, reconciliations, payables/receivables, and reporting on the cadence you need.',
    pageLabel: 'Bookkeeping Services',
    pageUrl: BOOKKEEPING_URL,
    extras: [PRICING_LINK],
  },
  'Management Accounting': {
    description:
      'Decision-grade management reports — P&L by segment, cash-flow forecasts, and KPI dashboards for founders and CFOs.',
    pageLabel: 'Bookkeeping Services',
    pageUrl: BOOKKEEPING_URL,
    extras: [{ label: 'CFO Services', url: CFO_URL }],
  },
  'Financial Statement Preparation': {
    description:
      'IFRS-compliant financial statements (Balance Sheet, P&L, Cash Flow) for audit, lender, or investor needs.',
    pageLabel: 'Bookkeeping Services',
    pageUrl: BOOKKEEPING_URL,
  },

  // ─── Audit & Compliance ─────────────────────────────────────────────────
  Auditing: {
    description:
      'Statutory and external audit services for UAE mainland and free-zone entities, delivered with our partner audit firms.',
    pageLabel: 'Auditing Services',
    pageUrl: AUDIT_URL,
  },
  'Audited Financial Statements': {
    description:
      'Independent audit of your financial statements with sign-off accepted by free-zone authorities, banks, and investors.',
    pageLabel: 'Auditing Services',
    pageUrl: AUDIT_URL,
  },
  'AML Compliance': {
    description:
      'goAML registration, AML policy drafting, KYC procedures, and ongoing compliance for UAE DNFBP and regulated businesses.',
    pageLabel: 'AML Compliance',
    pageUrl: AML_URL,
    extras: [
      {
        label: 'goAML registration',
        url: 'https://finanshels.com/landing-pages/goaml-registration-services-in-uae',
      },
    ],
  },
  Liquidation: {
    description:
      'Company liquidation in the UAE — final accounts, liquidator appointment, FTA deregistration, and licence cancellation.',
    pageLabel: 'Company Liquidation Services',
    pageUrl: LIQUIDATION_URL,
  },

  // ─── CFO Advisory ───────────────────────────────────────────────────────
  'Fractional CFO - hourly': {
    description:
      'Hourly access to a senior CFO for board prep, fundraising, modelling, or one-off finance challenges — no monthly retainer.',
    pageLabel: 'CFO Services',
    pageUrl: CFO_URL,
  },
  'CFO Services': {
    description:
      'Fractional CFO engagements covering reporting, cash-flow forecasting, board reporting, and investor readiness — sized to your stage.',
    pageLabel: 'CFO Services',
    pageUrl: CFO_URL,
  },
  'Salary Benchmarking': {
    description:
      'Benchmark finance hires against UAE market data — useful before hiring an accountant, controller, or CFO.',
    pageLabel: 'Finance Hiring Salary Benchmark',
    pageUrl: SALARY_BENCHMARK_URL,
  },
}

function renderLinks(info: ServicePage): string {
  const lines = [`- [${info.pageLabel}](${info.pageUrl})`]
  if (info.extras) {
    for (const extra of info.extras) {
      lines.push(`- [${extra.label}](${extra.url})`)
    }
  }
  return lines.join('\n')
}

function buildPricingReply(service: string): string {
  const info = SERVICE_PAGES[service]
  if (!info) {
    return 'Pricing depends on your business size and complexity. Tap "Get a quote" below and our team will send you a tailored estimate within a business day.'
  }
  return [
    `Pricing for ${service} depends on scope, volume, and which compliance bundles you need.`,
    '',
    renderLinks(info),
    '',
    'Tap "Get a quote" below for a tailored estimate, or "Talk to Human" for instant WhatsApp.',
  ].join('\n')
}

function buildKnowMoreReply(service: string): string {
  const info = SERVICE_PAGES[service]
  if (!info) {
    return "Tell me a bit more about what you're trying to solve — happy to dig in."
  }
  return [info.description, '', renderLinks(info), '', 'Anything specific you want me to expand on?'].join('\n')
}

const QUICK_REPLIES: QuickReply[] = [
  {
    id: 'chip_pricing',
    patterns: [/^pricing plans\s*[—–-]\s*(.+)$/i],
    reply: (match) => buildPricingReply(match[1].trim()),
  },
  {
    id: 'chip_know_more',
    patterns: [/^know more\s*[—–-]\s*(.+)$/i],
    reply: (match) => buildKnowMoreReply(match[1].trim()),
  },
  {
    id: 'talk_to_human',
    patterns: [
      /\b(talk|speak|connect|chat)\b.*\b(human|person|someone|team|agent|advisor|consultant)\b/i,
      /\b(call|whatsapp|phone|contact)\b.*\b(me|us|finanshels|sales|team)?\b/i,
      /\bbook\b.*\b(call|meeting|demo|consultation)\b/i,
      /\b(get|jump) on a call\b/i,
    ],
    reply:
      "Sure — what's your name and WhatsApp number (or email)? Our team will follow up shortly.",
    triggersLeadCapture: true,
  },
  {
    id: 'pricing_bookkeeping',
    patterns: [
      /\b(pricing|price|cost|fee|quote|how much)\b.*\b(bookkeep|accounting|ledger)\b/i,
      /\b(bookkeep|accounting)\b.*\b(pricing|price|cost|fee|quote|how much)\b/i,
    ],
    reply:
      "Bookkeeping pricing depends on transaction volume, number of bank accounts, and whether you need VAT/CT compliance bundled in. Here's where it's outlined:\n\n- [Bookkeeping Services](https://finanshels.com/bookkeeping-services-uae)\n- [Pricing overview](https://finanshels.com/pricing)\n\nWant me to have our team send you a tailored quote? Just share your name + email or WhatsApp.",
    followUps: ['What does monthly bookkeeping include?', 'Bookkeeping vs. accounting', 'Talk to a human'],
    triggersLeadCapture: true,
  },
  {
    id: 'corporate_tax',
    patterns: [
      /\b(corporate tax|ct|corp tax)\b.*\b(deadline|due|when|filing|registration)\b/i,
      /\b(deadline|due|when|filing|registration)\b.*\b(corporate tax|ct|corp tax)\b/i,
      /\buae corporate tax\b/i,
    ],
    reply:
      "UAE corporate tax applies to most mainland and free-zone businesses, with registration and return deadlines tied to your financial year. We cover the rules, exemptions, and filing here:\n\n- [Corporate Tax Registration](https://finanshels.com/services/corporate-tax-registration-in-uae)\n- [Corporate Tax Return Filing](https://finanshels.com/services/corporate-tax-return-filing-in-uae)\n\nWant our team to review your specific situation?",
    followUps: ['Do free-zone companies pay CT?', 'CT registration help', 'Talk to a human'],
  },
  {
    id: 'cfo',
    patterns: [
      /\b(fractional|outsourced|virtual|part.?time)\s*cfo\b/i,
      /\b(cfo|chief financial)\b.*\b(engage|engagement|work|service|how)\b/i,
      /\bhow\b.*\bcfo\b/i,
    ],
    reply:
      "Our fractional CFO engagements typically cover financial reporting, cash flow & forecasting, board reporting, and investor readiness — sized to your stage. Details:\n\n- [CFO Services](https://finanshels.com/cfo-services-uae)\n\nIf you can share your stage (pre-seed, Series A, etc.) and headcount, I can route you to the right CFO on our side.",
    followUps: ['What does a CFO engagement include?', 'Pricing for CFO', 'Talk to a human'],
    triggersLeadCapture: true,
  },
  {
    id: 'vat',
    patterns: [
      /\bvat\b.*\b(register|registration|filing|return|deadline|threshold)\b/i,
      /\b(register|registration|filing|return|deadline|threshold)\b.*\bvat\b/i,
      /\bvat\b.*\b(uae|service|help)\b/i,
    ],
    reply:
      "We handle UAE VAT registration, quarterly filing, and FTA correspondence end-to-end. Mandatory registration kicks in once taxable supplies cross AED 375,000 over 12 months. More:\n\n- [VAT Filing & Accounting](https://finanshels.com/services/vat-filing-and-accounting-in-uae)\n\nNeed help with a specific filing or a missed deadline?",
    followUps: ['VAT registration threshold', 'VAT penalties', 'Talk to a human'],
  },
  {
    id: 'payroll',
    patterns: [/\b(payroll|wps|salary processing|wages)\b/i],
    reply:
      "Payroll & WPS-compliant salary processing is part of our offering — including payslips, GOSI/pension, leave, and end-of-service. We bundle it with accounting:\n\n- [Bookkeeping Services](https://finanshels.com/bookkeeping-services-uae)\n\nHow many employees on your payroll today?",
    followUps: ['WPS compliance', 'Outsourced payroll pricing', 'Talk to a human'],
  },
  {
    id: 'audit',
    patterns: [/\b(audit|assurance|statutory audit)\b/i],
    reply:
      "We support audit-readiness and external audit coordination, especially for free-zone entities with annual audit requirements. Details:\n\n- [Auditing Services](https://finanshels.com/auditing-services-uae)\n\nDo you have an audit deadline coming up?",
    followUps: ['Audit-readiness checklist', 'Free-zone audit requirements', 'Talk to a human'],
  },
  {
    id: 'locations',
    patterns: [
      /\b(where|location|office|based)\b.*\b(finanshels|you|located)\b/i,
      /\bare you in (dubai|abu dhabi|sharjah)\b/i,
    ],
    reply:
      "We're headquartered in Dubai and serve clients across the UAE and wider MENA. You can reach us via:\n\n- [Contact](https://finanshels.com/contact)\n\nWant me to set up an intro call?",
    triggersLeadCapture: true,
  },
  {
    id: 'greeting',
    patterns: [/^(hi|hello|hey|salam|assalamu|good (morning|afternoon|evening))\b/i],
    reply:
      "Hi — I'm Finny. I can help with accounting, VAT, corporate tax, payroll, CFO, and audit questions about Finanshels. What's on your mind?",
    followUps: [
      'Pricing for bookkeeping',
      'Corporate tax deadlines in UAE',
      'How does a fractional CFO engagement work?',
      'Talk to a human',
    ],
  },
]

export interface QuickReplyMatch {
  id: string
  text: string
  triggersLeadCapture: boolean
}

export function matchQuickReply(message: string): QuickReplyMatch | null {
  const trimmed = message.trim()
  if (!trimmed) return null
  for (const qr of QUICK_REPLIES) {
    for (const pattern of qr.patterns) {
      const match = pattern.exec(trimmed)
      if (match) {
        const text = typeof qr.reply === 'function' ? qr.reply(match) : qr.reply
        return {
          id: qr.id,
          text,
          triggersLeadCapture: qr.triggersLeadCapture ?? false,
        }
      }
    }
  }
  return null
}
