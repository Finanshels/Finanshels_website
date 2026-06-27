import type { ServicePage } from '../service-pages'

export const realEstate: ServicePage = {
  title: 'Real Estate Accounting',
  subtitle:
    'Real estate accounting in the UAE — trust accounts reconciled, property VAT correct, AML obligations managed, commission income clear.',
  description:
    'Running a UAE real estate agency means carrying more compliance obligations than almost any other business in the country — and most of them are not covered by a standard accounting service. Real estate agencies are DNFBPs with mandatory AML obligations, their VAT treatment varies by transaction type in ways that trip up generalist accountants, and their trust accounts must be reconcilable on any day of the month. Finanshels has built specific workflows for each — so nothing falls through the gap between your accounting, your compliance, and your regulatory obligations.',
  stats: [
    { label: 'UAE businesses', value: '7,000+' },
    { label: 'Trustpilot rating', value: '4.9' },
    { label: 'AML status', value: 'UAE FIU Registered' },
  ],
  problems: [
    'Real estate agencies are DNFBPs with mandatory AML obligations that a standard accounting service does not cover.',
    'Property VAT misclassification is small on any single deal but compounds across every quarter into a material FTA exposure.',
    'RERA requires trust accounts to be reconcilable on demand — not just the day before an inspection.',
  ],
  whyNow: [
    'Since 2022 the UAE Ministry of Economy has issued over AED 115 million in AML penalties — real estate is one of the most heavily scrutinised sectors.',
    'AML penalties run from AED 50,000 to AED 5,000,000 per violation, with trade licence suspension and director personal liability.',
    'Every real estate entity must register for Corporate Tax — the AED 10,000 non-registration penalty applies regardless of profit.',
  ],
  whoFor: [
    {
      segment: 'Real estate agencies and brokers',
      description:
        'RERA-licensed brokers managing trust accounts, commission income, broker splits, and quarterly VAT returns — alongside mandatory AML compliance obligations as a DNFBP. Your accounting needs are more complex than a standard service business and your compliance obligations are more extensive.',
    },
    {
      segment: 'Property developers',
      description:
        'Off-plan and completed unit developers managing project-level accounting, RERA escrow accounts, milestone-based revenue recognition, and investor reporting. Your books need to reflect the project cycle accurately — not just cash in and cash out.',
    },
    {
      segment: 'Property management companies',
      description:
        'Managing multiple landlords, multiple properties, service charge accounting, maintenance cost allocation, and rental income distribution. Your accounting needs to work at property level and portfolio level simultaneously.',
    },
    {
      segment: 'Real estate investors',
      description:
        'Individual or corporate investors managing rental income, property-level P&L, asset valuations, and the CT treatment of investment income versus business income. Your compliance position depends on how your activity is classified — and that classification affects everything from VAT to Corporate Tax.',
    },
  ],
  challengesEyebrow: 'The compliance landscape',
  challengesHeading: 'Four obligations every UAE real estate business must manage correctly',
  challenges: [
    {
      heading: 'AML compliance — mandatory for RERA-licensed brokers',
      body: 'Under UAE Federal Decree-Law No. 20 of 2018, real estate brokers and developers who handle property transactions above AED 55,000 in cash are classified as Designated Non-Financial Businesses and Professions (DNFBPs). This carries mandatory AML obligations that go significantly beyond what most accountants manage. Penalty for non-compliance: AED 50,000 to AED 5,000,000 per violation, trade licence suspension, public listing in MOE registers, and director personal liability. Finanshels is a UAE FIU registered AML service provider and manages the full obligation as a dedicated service alongside your accounting.',
      points: [
        'goAML registration with the UAE Financial Intelligence Unit',
        'REAR (Real Estate Activity Reports) filing for all qualifying transactions through the goAML portal',
        'Business Risk Assessment — a documented FATF-aligned assessment of your client base, transaction types, and geographic exposure',
        'AML/CFT policy and procedures — a written policy manual, KYC procedures, and internal controls maintained annually',
        'KYC and sanctions screening against UN, OFAC, EU, and UAE local sanctions lists',
        'Annual AML staff training with certificates maintained for inspection',
      ],
    },
    {
      heading: 'Property VAT — the treatment that trips up most generalist accountants',
      body: 'Property VAT in the UAE is one of the most commonly misapplied areas of the entire FTA regime. The treatment varies by property type, transaction type, and timing — and getting it wrong in either direction creates FTA audit exposure. The single most common error Finanshels finds when onboarding agencies from other providers is VAT misclassification.',
      points: [
        'First sale of new residential property (within 3 years of completion): zero-rated 0% — input VAT on construction costs is recoverable',
        'Subsequent sale of residential property (after 3 years): exempt — input VAT on related costs generally not recoverable',
        'Off-plan residential sale: zero-rated 0% — treated as a first supply',
        'Commercial property sale and lease: standard-rated 5%',
        'Bare land: exempt. Mixed-use property: apportioned by residential/commercial split',
        'Agency commission on any transaction: always standard-rated 5%, regardless of the underlying property treatment',
      ],
    },
    {
      heading: 'RERA trust account reconciliation',
      body: 'RERA requires Dubai-licensed brokers to maintain separate trust accounts for client funds. Reservation deposits, DLD transfer payments, and escrow amounts must be segregated from your operating account and reconcilable on demand — not just at audit time. Finanshels delivers trust account reconciliation by Day 5 of every month, ready for a RERA inspection on any day of the month.',
      points: [
        'Opening balance confirmed against prior month close',
        'All receipts recorded with client reference, property address, and transaction type',
        'All disbursements recorded with authorisation reference and recipient',
        'Closing balance tied to the bank statement balance',
        'Any uncleared items identified and flagged',
        'Delivered in RERA-ready format',
      ],
    },
    {
      heading: 'Corporate Tax — what applies and what does not',
      body: 'Real estate businesses often have a more complex CT position than a standard service company, because the treatment depends on who is receiving the income and how. Individual investors earning pure rental income from personal property holdings are generally excluded from business income. But once activity crosses into development, brokerage, property management, or any structured commercial activity, Corporate Tax applies under normal rules. Free zone entities with qualifying income may access the 0% rate under QFZP status — but this requires annual confirmation, audited accounts, and documented substance.',
      points: [
        'CT registration for agencies, developers, and property management companies',
        'QFZP eligibility assessment for free zone entities',
        'Annual CT return preparation from reconciled management accounts',
        'Small Business Relief election assessment for qualifying agencies',
        'Related-party transaction review for developer group structures',
        'Transfer pricing documentation for intercompany arrangements',
      ],
    },
  ],
  valueProps: [
    'Built for real estate, not adapted from a generic template — chart of accounts, VAT rules, trust account workflow, commission recognition, and AML procedures configured from day one.',
    'VAT classification reviewed on every transaction — no blanket rules, no assumed treatments, reconciled against your CT position before filing.',
    'Trust account reconciliation delivered by Day 5 every month, in RERA-ready format, with every receipt and disbursement tied to the bank statement.',
    'AML compliance managed by UAE FIU registered specialists — goAML, REAR, Business Risk Assessment, KYC screening, training, and MOE inspection support.',
    'Accounting, VAT, CT, and AML in one engagement — four compliance obligations, one provider, one point of contact.',
    'Audit-ready records maintained year-round for free zone renewals, RERA audits, bank facilities, and investor due diligence.',
  ],
  solutions: [
    'Monthly bookkeeping and financial close — commission income, trust movements, operating expenses, payroll, and VAT entries reconciled monthly and closed by the 10th on an accrual basis in line with IFRS.',
    'Commission income management — recognised when earned, with broker splits calculated and payable monthly, and an agency P&L showing performance by agent, by development, and by transaction type.',
    'RERA trust account reconciliation delivered by Day 5, reconciled to the bank statement and formatted for inspection.',
    'VAT management and quarterly filing — every transaction tagged to the correct treatment, input VAT recovery maximised, VAT and CT reconciled before filing.',
    'AML compliance — goAML registration, REAR filings, Business Risk Assessment, policy documentation, KYC screening, annual training, and MOE inspection support.',
    'Corporate Tax registration and annual filing, including QFZP assessment and related-party/transfer pricing review for group structures.',
    'Audit coordination through our licensed audit partner network for free zone renewals, RERA readiness, bank facilities, and investor due diligence.',
    'Property and project-level reporting — project P&L, escrow movement reports, occupancy and rental income summaries, and net operating income by property.',
  ],
  workflow: [
    'Day 1 — Real estate onboarding: we confirm your RERA licence and entity structure, verify your DNFBP/AML obligation, and review your current trust account and VAT position.',
    'Days 2–5 — Setup: your chart of accounts, trust account workflow, commission recognition policy, and VAT treatment rules are configured for real estate, and your compliance calendar is built.',
    'Days 6–28 — First month of bookkeeping: transactions recorded and VAT-tagged, trust account movements logged, commission income recognised on an accrual basis, and AML setup scoped where required.',
    'Day 30 — First month-end close: books closed; P&L, Balance Sheet, Cash Flow, and the Day-5 trust account reconciliation delivered with plain-English commentary.',
    'Ongoing — every quarter and year: VAT returns filed quarterly, REAR filings and KYC screening maintained, annual CT return filed, and audits coordinated when required.',
  ],
  deliverables: [
    'Monthly P&L, Balance Sheet, and Cash Flow, closed by the 10th.',
    'RERA-ready trust account reconciliation delivered by Day 5 every month.',
    'Agency P&L showing performance by agent, development, and transaction type.',
    'Quarterly VAT returns and annual Corporate Tax filing.',
    'AML compliance records — REAR filings, KYC screening logs, and inspection-ready documentation.',
  ],
  pricingTiers: [
    {
      name: 'Essential plan',
      price: 'AED 799/month',
      bestFor: 'Up to 200 transactions/month',
      includes: [
        'Monthly bookkeeping and reconciliation',
        'RERA trust account reconciliation',
        'Commission income management',
        'Corporate Tax registration and annual filing',
        'Monthly management reports',
        'Audit-ready records',
      ],
    },
    {
      name: 'Growth plan',
      price: 'AED 999/month',
      highlighted: true,
      bestFor: 'Up to 500 transactions/month · VAT-registered',
      includes: [
        'Everything in Essential, plus:',
        'Quarterly VAT returns included',
        'AR and AP ageing reports',
        'Monthly management pack',
        'VAT tagging on every transaction',
      ],
    },
    {
      name: 'Scale plan',
      price: 'AED 1,999/month',
      bestFor: 'Multi-entity agencies and developer groups',
      includes: [
        'Everything in Growth, plus:',
        'Multi-entity consolidated reporting',
        'Senior accountant oversight',
        'Audit coordination included',
        'Project and property-level reporting',
      ],
    },
  ],
  pricingAddOns: [
    { name: 'goAML registration and initial AML setup (one-time)', price: 'AED 3,500–4,999' },
    { name: 'AML ongoing compliance — REAR, KYC, policy, training, inspection support', price: 'from AED 3,499/month' },
  ],
  pricingNote:
    'Accounting from AED 499/month. AML compliance is scoped and confirmed separately after your DNFBP obligation is verified — it is never bundled into an accounting plan by default.',
  faqs: [
    {
      question: 'Does a UAE real estate agency need to register for AML compliance?',
      answer:
        'Yes, if your agency handles property transactions where a buyer or seller pays AED 55,000 or more in cash. Under UAE Federal Decree-Law No. 20 of 2018, real estate brokers and agencies meeting this threshold are classified as DNFBPs with mandatory AML obligations — including goAML registration, REAR filings, a documented Business Risk Assessment, KYC procedures, and annual staff training. The FTA and MOE enforcement posture in real estate has intensified significantly since 2022. Finanshels confirms your specific obligation before recommending any AML service.',
    },
    {
      question: "What VAT applies to a real estate agent's commission in the UAE?",
      answer:
        'Always standard-rated at 5% — regardless of the underlying property transaction. If the agent facilitates the sale of a residential property (which may be exempt or zero-rated), the agency’s commission for that service is still subject to 5% VAT. The property itself has its own VAT treatment. The agency service is a separate supply, always standard-rated.',
    },
    {
      question: 'What is the difference between zero-rated and exempt for residential property VAT?',
      answer:
        'Both mean the buyer pays no VAT — but the treatment of input VAT recovery is different. On a zero-rated supply, the supplier can recover input VAT on costs directly related to that supply. On an exempt supply, input VAT recovery is generally restricted. For a residential developer, the first supply of a new unit within three years of completion is zero-rated — meaning input VAT on construction costs is recoverable. A subsequent sale of the same property after three years is exempt — and input VAT recovery is restricted. Treating a zero-rated supply as exempt is a common and material error.',
    },
    {
      question: 'What is a RERA trust account and what are the reconciliation requirements?',
      answer:
        'RERA requires Dubai-licensed real estate brokers to maintain separate trust accounts for client funds — reservation deposits, DLD transfer payments, and escrow amounts must be segregated from operating funds. RERA expects these accounts to be reconcilable on demand. Finanshels delivers a complete trust account reconciliation by Day 5 of every month — opening balance, all receipts with client references, all disbursements with authorisation, and closing balance tied to the bank statement — in a format that is ready for a RERA inspection on any day of the month.',
    },
    {
      question: 'Do UAE real estate agencies need to be registered for Corporate Tax?',
      answer:
        'Yes. Every UAE corporate entity — including real estate agencies and brokerage firms — must register for Corporate Tax and file an annual return regardless of whether profits fall below the AED 375,000 zero-rate threshold. The AED 10,000 penalty for non-registration applies regardless of whether tax is owed. Individual investors earning personal rental income may fall outside the definition of business income under specific conditions — but any structured commercial real estate activity is subject to CT under normal rules.',
    },
    {
      question: 'What is REAR filing and which real estate businesses need to submit it?',
      answer:
        'REAR stands for Real Estate Activity Report — a mandatory report submitted through the goAML portal by real estate agencies and brokers who handle qualifying cash transactions above AED 55,000. REAR filing is a component of the UAE’s AML framework for DNFBPs. It requires details of the transaction, the parties involved, the property, and the cash amount. Failure to file carries significant penalties. Finanshels manages REAR filings as part of the AML compliance service for RERA-licensed agencies.',
    },
    {
      question: 'How should real estate commission income be recognised in the books?',
      answer:
        'Commission income should be recognised when earned — at the point of contract exchange or practical completion, depending on your revenue recognition policy — not when cash is received. An agency that books all income when cash arrives produces a P&L that overstates performance in cash-heavy months and understates it in months where work has been done but payments have not arrived. Finanshels implements accrual-based commission income recognition for every real estate agency we work with, with broker splits calculated and payable monthly on a transparent basis.',
    },
    {
      question: 'We have missed some RERA trust account reconciliations. How do we fix that?',
      answer:
        'We handle trust account catch-up reconciliation as a separate fixed-fee engagement. We reconstruct the reconciliations from bank statements and client transaction records, ensure they are in the correct RERA-ready format, and move to the ongoing monthly service from that point. The fee is confirmed before we start — no open-ended engagement.',
    },
    {
      question: 'Does a real estate developer need separate accounts for each project?',
      answer:
        'Yes — and in many cases, RERA requires it for off-plan developments through the mandatory escrow account structure. Beyond regulatory requirements, project-level accounting is also operationally essential: it allows developers to track revenue, costs, and margin per development, understand profitability at the project level rather than only at the company level, and produce the milestone-based reporting that investors and lenders expect.',
    },
  ],
}
