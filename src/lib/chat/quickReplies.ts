import 'server-only'

export interface QuickReply {
  id: string
  patterns: RegExp[]
  reply: string
  followUps?: string[]
  triggersLeadCapture?: boolean
}

const SUFFIX_FOLLOWUPS = (followUps?: string[]): string => {
  if (!followUps || followUps.length === 0) return ''
  const lines = followUps.map((f) => `- ${f}`).join('\n')
  return `\n\nWant to dig into something specific?\n${lines}`
}

const QUICK_REPLIES: QuickReply[] = [
  {
    id: 'talk_to_human',
    patterns: [
      /\b(talk|speak|connect|chat)\b.*\b(human|person|someone|team|agent|advisor|consultant)\b/i,
      /\b(call|whatsapp|phone|contact)\b.*\b(me|us|finanshels|sales|team)?\b/i,
      /\bbook\b.*\b(call|meeting|demo|consultation)\b/i,
      /\b(get|jump) on a call\b/i,
    ],
    reply:
      "Happy to connect you with our team. Share your **name** and the best way to reach you (WhatsApp number or email) and we'll follow up shortly.",
    triggersLeadCapture: true,
  },
  {
    id: 'pricing_bookkeeping',
    patterns: [
      /\b(pricing|price|cost|fee|quote|how much)\b.*\b(bookkeep|accounting|ledger)\b/i,
      /\b(bookkeep|accounting)\b.*\b(pricing|price|cost|fee|quote|how much)\b/i,
    ],
    reply:
      "Bookkeeping pricing depends on transaction volume, number of bank accounts, and whether you need VAT/CT compliance bundled in. Here's where it's outlined:\n\n- [Accounting & Bookkeeping](https://finanshels.com/accounting-bookkeeping-services-in-uae)\n- [Pricing overview](https://finanshels.com/pricing)\n\nWant me to have our team send you a tailored quote? Just share your name + email or WhatsApp.",
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
      "UAE corporate tax applies to most mainland and free-zone businesses, with registration and return deadlines tied to your financial year. We cover the rules, exemptions, and filing here:\n\n- [Corporate Tax Services](https://finanshels.com/corporate-tax-services-in-uae)\n- [Corporate Tax FAQ](https://finanshels.com/corporate-tax-faq)\n\nWant our team to review your specific situation?",
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
      "Our fractional CFO engagements typically cover financial reporting, cash flow & forecasting, board reporting, and investor readiness — sized to your stage. Details:\n\n- [CFO Services](https://finanshels.com/cfo-services-in-uae)\n\nIf you can share your stage (pre-seed, Series A, etc.) and headcount, I can route you to the right CFO on our side.",
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
      "We handle UAE VAT registration, quarterly filing, and FTA correspondence end-to-end. Mandatory registration kicks in once taxable supplies cross AED 375,000 over 12 months. More:\n\n- [VAT Services](https://finanshels.com/vat-services-in-uae)\n\nNeed help with a specific filing or a missed deadline?",
    followUps: ['VAT registration threshold', 'VAT penalties', 'Talk to a human'],
  },
  {
    id: 'payroll',
    patterns: [/\b(payroll|wps|salary processing|wages)\b/i],
    reply:
      "Payroll & WPS-compliant salary processing is part of our offering — including payslips, GOSI/pension, leave, and end-of-service. Here's the page:\n\n- [Payroll Services](https://finanshels.com/payroll-services-in-uae)\n\nHow many employees on your payroll today?",
    followUps: ['WPS compliance', 'Outsourced payroll pricing', 'Talk to a human'],
  },
  {
    id: 'audit',
    patterns: [/\b(audit|assurance|statutory audit)\b/i],
    reply:
      "We support audit-readiness and external audit coordination, especially for free-zone entities with annual audit requirements. Details:\n\n- [Audit Services](https://finanshels.com/audit-services-in-uae)\n\nDo you have an audit deadline coming up?",
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
    if (qr.patterns.some((p) => p.test(trimmed))) {
      return {
        id: qr.id,
        text: qr.reply + SUFFIX_FOLLOWUPS(qr.followUps),
        triggersLeadCapture: qr.triggersLeadCapture ?? false,
      }
    }
  }
  return null
}
