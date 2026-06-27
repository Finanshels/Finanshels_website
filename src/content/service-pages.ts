export interface ServiceStat {
  label: string
  value: string
}

export interface ServiceFaq {
  question: string
  answer: string
}

export interface ServiceCaseStudy {
  logo: string
  headline: string
  result: string
}

/** A persona/segment block for the "Who this is for" section. */
export interface ServiceAudience {
  segment: string
  description: string
  /** Optional supporting bullets (e.g. "What Finanshels handles for clinics"). */
  points?: string[]
}

/** A challenge/explainer block — heading + optional body paragraph + optional bullets. */
export interface ServiceChallenge {
  heading: string
  body?: string
  points?: string[]
}

/** A pricing tier card. `price` is the formatted amount (e.g. "AED 799/month"). */
export interface ServicePricingTier {
  name: string
  price: string
  period?: string
  bestFor?: string
  includes: string[]
  highlighted?: boolean
}

/** A one-time / add-on service line (e.g. "VAT Registration — AED 499"). */
export interface ServicePricingAddOn {
  name: string
  price: string
}

export interface ServicePage {
  title: string
  subtitle: string
  description: string
  stats?: ServiceStat[]
  problems?: string[]
  whyNow?: string[]
  valueProps?: string[]
  workflow?: string[]
  solutions?: string[]
  deliverables?: string[]
  faqs?: ServiceFaq[]
  caseStudy?: ServiceCaseStudy
  /** "Who this is for" persona blocks (sector pages). */
  whoFor?: ServiceAudience[]
  /** Sector-specific challenge/explainer blocks rendered below the signals row. */
  challenges?: ServiceChallenge[]
  /** Optional eyebrow + heading overrides for the challenges section. */
  challengesEyebrow?: string
  challengesHeading?: string
  /** Tiered pricing. When present, replaces the default "$219/mo" snapshot. */
  pricingTiers?: ServicePricingTier[]
  /** One-time services listed under the pricing tiers. */
  pricingAddOns?: ServicePricingAddOn[]
  /** Short note shown beneath the pricing tiers (e.g. region availability). */
  pricingNote?: string
}

export const SERVICE_PAGES: Record<string, ServicePage> = {
  'corporate-tax-registration-uae': {
    title: 'Corporate Tax Registration UAE',
    subtitle: 'UAE Corporate Tax registration — done correctly, in 48 hours.',
    description:
      'Every UAE business must register for Corporate Tax. The penalty for non-registration is a flat AED 10,000 — regardless of whether you owe any tax. We confirm your entity classification, conduct a QFZP assessment for free zone entities, and complete EmaraTax portal submission within 48 hours.',
    stats: [
      { label: 'Entities registered', value: '900+' },
      { label: 'Non-registration penalty', value: 'AED 10k' },
      { label: 'Registration turnaround', value: '48 hrs' },
    ],
    problems: [
      'Your UAE business is not yet registered for Corporate Tax — the AED 10,000 penalty applies now, not when you eventually file.',
      'You operate in a free zone and are unsure whether you qualify for the 0% Corporate Tax rate (QFZP status).',
      'You have multiple UAE entities and need to assess whether a Tax Group election is appropriate.',
    ],
    whyNow: [
      'FTA issues a fixed AED 10,000 penalty for each failure to register on time — regardless of profit owed.',
      'Your first filing deadline is 9 months after your financial year-end, so registration must happen well before then.',
      'The FTA cross-matches CT returns against VAT filings — revenue must align, making a clean start essential.',
    ],
    valueProps: [
      'Entity classification confirmed — Resident Person, Non-Resident, or Qualifying Free Zone Person — so exemptions and rates are applied correctly from day one.',
      'QFZP assessment for free zone entities: we document the basis for the 0% rate so it stands up under FTA scrutiny.',
      'EmaraTax portal submission completed within 48 hours of receiving documents. CT TRN typically arrives within 3–5 business days.',
      'CT deadlines added to your compliance calendar immediately after registration.',
      'Tax Group eligibility assessed for multi-entity businesses.',
    ],
    workflow: [
      'Review your entity type and confirm correct classification (Resident Person, Non-Resident, or Qualifying Free Zone Person).',
      'Determine your tax period based on your accounting year-end — this sets your first filing deadline.',
      'Conduct QFZP assessment if you are a free zone entity; document the basis for the 0% rate where applicable.',
      'Complete and submit registration through the EmaraTax portal.',
      'Deliver your CT TRN and add all compliance deadlines to your calendar with next-step guidance.',
    ],
    solutions: [
      'Corporate Tax Registration — entity classification, documentation, EmaraTax submission, TRN issuance.',
      'QFZP Assessment — confirm 0% qualifying income eligibility with documented working papers.',
      'Tax Group Election — assess eligibility for consolidated CT filing across UAE group companies.',
      'CT Implementation — audit your accounting setup for CT gaps and build required record-keeping infrastructure.',
      'CT Advisory — free zone qualifying income rules, related-party transactions, transfer pricing, Small Business Relief elections.',
    ],
    deliverables: [
      'Corporate Tax Registration Number (CT TRN) confirmed via EmaraTax.',
      'QFZP eligibility assessment with supporting documentation (free zone entities).',
      'Compliance calendar with your first CT return deadline and payment dates.',
      'Handover checklist for ongoing CT compliance requirements.',
    ],
    caseStudy: {
      logo: 'Global Holding',
      headline: 'Registered 14 subsidiaries in three weeks, avoided AED 140,000 in penalties',
      result: 'Finanshels coordinated shareholder documents, conducted QFZP assessments for 6 free zone entities, and hit every FTA deadline ahead of schedule.',
    },
    faqs: [
      {
        question: 'Can free zone companies really pay 0% Corporate Tax?',
        answer: 'Yes — but only if your entity genuinely qualifies as a Qualifying Free Zone Person (QFZP). Qualifying income earned from non-UAE customers, other QFZPs, or eligible passive income is taxed at 0%. Income from UAE mainland customers or non-qualifying categories is taxed at 9%. QFZP status requires annual confirmation and proper documentation. We assess eligibility for every free zone client we onboard.',
      },
      {
        question: 'What is the penalty for not registering for Corporate Tax?',
        answer: 'The FTA issues a fixed penalty of AED 10,000 for each failure to register on time. This applies regardless of whether your business makes any profit — registration is a separate obligation from filing or payment. If you have not registered yet, the penalty clock is already running.',
      },
      {
        question: 'Do free zone companies need to register even if they qualify for the 0% rate?',
        answer: 'Yes, without exception. All UAE free zone companies must register for Corporate Tax. Qualifying Free Zone Person status affects the rate you pay on qualifying income — it has no bearing on the registration requirement itself.',
      },
      {
        question: 'What documents do I need to register?',
        answer: 'Usually your trade licence, memorandum of association or certificate of incorporation, Emirates ID of the authorised signatory, your existing VAT TRN if you have one, and confirmation of your financial year-end. For free zone entities, your free zone registration certificate.',
      },
      {
        question: 'My business was set up years ago. Can I still register without facing the full penalty?',
        answer: 'The FTA has issued guidance on late registration. In some cases, proactive registration with an explanation of circumstances has resulted in reduced penalties. If you are registering late, we will assess your specific situation and advise on the best approach before submitting.',
      },
      {
        question: 'We are a group with multiple UAE entities. Do we register each one separately?',
        answer: 'Yes — each UAE entity registers individually. However, businesses within a qualifying group may apply for a UAE Tax Group election, which allows consolidated CT filing. We assess Tax Group eligibility for all multi-entity clients.',
      },
    ],
  },

  'corporate-tax-filing-uae': {
    title: 'Corporate Tax Filing UAE',
    subtitle: 'Clean returns, documented positions, no nasty surprises — or we pay.',
    description:
      'Your CT return touches your chart of accounts, related-party transactions, taxable income calculation, and EmaraTax submission. One misstep creates a position you carry into every return that follows. We review your books, prepare the full computation with working papers, and file before your deadline — or we cover the penalty.',
    stats: [
      { label: 'CT returns filed', value: '800+' },
      { label: 'Penalties avoided', value: 'AED 6M+' },
      { label: 'Average turnaround', value: '10 days' },
    ],
    problems: [
      'Your books have not been reconciled against your VAT history — the FTA cross-matches both, and discrepancies trigger scrutiny.',
      "You have intercompany transactions with related parties but no transfer pricing documentation or arm's-length review.",
      'You are a free zone entity claiming the 0% QFZP rate but have not verified you still qualify for the current period.',
    ],
    whyNow: [
      'Late filing carries AED 500/month for year one, then AED 1,000/month after — penalties compound quickly.',
      'Incorrect returns that understate tax liability carry percentage-based penalties on the underpaid amount.',
      'The FTA is increasingly sophisticated at cross-matching CT returns against VAT filings — revenue must align.',
    ],
    valueProps: [
      'We review your books before we file — fixing categorisation issues that affect taxable income before the return goes in.',
      'Every filing comes with a full computation and supporting documentation. If the FTA ever asks, you are covered from day one.',
      'QFZP status is not assumed — we confirm eligibility before filing and maintain records to defend the position year after year.',
      'One team across CT, VAT, and audit — nothing falls between the cracks.',
      'Flat pricing. You know the fee before we start. No add-ons when it gets complicated.',
    ],
    workflow: [
      "Books review — accrual basis adherence, expense categorisation, capital vs revenue expenditure, related-party transactions.",
      "CT computation — taxable income calculation from accounting profit with all required adjustments, each line documented.",
      "Related-party review — pricing against arm's-length benchmarks, transfer pricing documentation where required.",
      'QFZP compliance check — verify qualifying conditions were met during the period and document the basis.',
      'EmaraTax filing — submit completed return, confirm receipt, deliver filed return and full working papers.',
    ],
    solutions: [
      'Annual CT return preparation and EmaraTax submission with complete working papers.',
      'Books reconciliation and CT computation from audited financials.',
      'Related-party transaction review and transfer pricing documentation.',
      'QFZP qualifying income analysis and annual eligibility confirmation.',
      'Voluntary disclosure management for previously filed incorrect returns.',
    ],
    deliverables: [
      'Filed CT return with EmaraTax submission confirmation.',
      'Full CT computation with supporting working papers for every line item.',
      'Transfer pricing documentation where intercompany transactions exist.',
      'QFZP eligibility confirmation and documented basis for 0% rate (free zone entities).',
    ],
    caseStudy: {
      logo: 'YAP',
      headline: 'Scaled from 1 to 11 entities without missing a single CT deadline',
      result: 'Finanshels automated data extraction from PSPs and ERPs, enabling faster reconciliations and eliminating penalties across all entities.',
    },
    faqs: [
      {
        question: 'What is the UAE Corporate Tax rate?',
        answer: '9% on taxable profits above AED 375,000 per year. Profits below this threshold are taxed at 0%. Qualifying Free Zone Persons can apply a 0% rate to qualifying income regardless of amount, subject to meeting ongoing conditions each year.',
      },
      {
        question: 'Do I need audited financial statements to file my CT return?',
        answer: 'Audited accounts are mandatory for businesses with annual revenues above AED 50 million and for Qualifying Free Zone Persons. Below these thresholds, well-prepared management accounts on an accrual basis are generally acceptable.',
      },
      {
        question: 'What happens if I have already filed an incorrect return?',
        answer: 'The FTA allows voluntary disclosure — proactively flagging an error typically results in significantly lower penalties than an error discovered during an FTA audit. If you think your CT position may be wrong, talk to us before you wait for the FTA to find it.',
      },
      {
        question: 'My company made a loss this year. Do I still need to file?',
        answer: 'Yes. The CT return is mandatory regardless of profit or loss. Filing a loss return is actually valuable — it registers your tax loss with the FTA so you can carry it forward to offset future profits.',
      },
      {
        question: 'We have intercompany transactions with a related company. Does that matter for CT?',
        answer: "Yes, significantly. All transactions with related parties must be conducted at arm's length. If the pricing is not arm's length, the FTA can adjust your taxable income. For businesses with material intercompany flows, transfer pricing documentation is essential.",
      },
      {
        question: 'When is my Corporate Tax return due?',
        answer: 'Your filing deadline is 9 months after the end of your financial year. If your year ends on 31 December, your return is due by 30 September the following year.',
      },
    ],
  },

  'vat-registration-uae': {
    title: 'VAT Registration UAE',
    subtitle: 'UAE VAT registration — threshold checked, TRN issued, compliance set up from day one.',
    description:
      'Miss the AED 375,000 threshold and the FTA penalty is AED 20,000 — plus retrospective liability. Register on time and you start recovering input VAT on your own costs. We handle everything from threshold assessment to TRN issuance. Most clients are registered within a week.',
    stats: [
      { label: 'Registrations completed', value: '650+' },
      { label: 'Rejected filings', value: '0' },
      { label: 'Typical turnaround', value: '1 week' },
    ],
    problems: [
      'Your taxable supplies have crossed AED 375,000 but you have not yet registered — the AED 20,000 late registration penalty and retrospective VAT liability are accumulating.',
      'You are unsure whether to register voluntarily from AED 187,500 or wait for mandatory registration.',
      'You have zero-rated sales and do not know whether voluntary registration would let you recover input VAT on your costs.',
    ],
    whyNow: [
      'Mandatory registration kicks in when taxable supplies cross AED 375,000 — no grace period once the threshold is crossed.',
      'The FTA late registration penalty is AED 20,000 plus retrospective liability on all taxable supplies made while unregistered.',
      'Voluntary registration from AED 187,500 allows you to recover input VAT on business costs before hitting the mandatory threshold.',
    ],
    valueProps: [
      'Threshold position checked before anything else — we assess your taxable supplies, confirm your obligation, and flag any retrospective exposure.',
      'Full process end-to-end: threshold assessment, VAT scheme selection, EmaraTax application, TRN issuance — most clients registered within a week.',
      'Late registration handled regularly — including calculating retrospective liability and offsetting against recoverable input VAT where possible.',
      'VAT scheme selected for your business type, not by default — standard, cash basis, or mixed supply from day one.',
      'One team handles VAT registration, filing, and everything after — nothing gets handed off.',
    ],
    workflow: [
      'Review last 12 months of taxable supplies to confirm mandatory or voluntary registration threshold.',
      'Assess standard-rated, zero-rated, and exempt income sources for your business.',
      'Select the right VAT accounting basis and scheme for your business type.',
      'Complete and submit EmaraTax VAT registration application.',
      'TRN issuance — typically within 3–5 business days — then invoice template review and compliance calendar setup.',
    ],
    solutions: [
      'Mandatory VAT registration — threshold assessment, documentation, EmaraTax submission, TRN.',
      'Voluntary VAT registration — eligibility review, input VAT recovery analysis, scheme selection.',
      'Late registration with retrospective liability assessment and voluntary disclosure management.',
      'VAT scheme selection — standard, cash basis, or mixed supply treatment.',
      'Transition into ongoing quarterly VAT filing and compliance management.',
    ],
    deliverables: [
      'UAE Tax Registration Number (TRN) confirmed via EmaraTax.',
      'VAT scheme and accounting basis confirmed in writing.',
      'Invoice templates reviewed and updated to meet FTA requirements.',
      'Quarterly VAT filing compliance calendar with all deadlines.',
    ],
    caseStudy: {
      logo: 'Retail Collective',
      headline: 'Registered 9 outlets with unified VAT workflows, zero late penalties',
      result: 'Centralised returns prevented mismatches across emirates and recovered AED 180k in input VAT the business had never previously claimed.',
    },
    faqs: [
      {
        question: 'When do you have to register for VAT?',
        answer: 'Mandatory registration kicks in when your taxable supplies — standard-rated and zero-rated sales, excluding exempt supplies — cross AED 375,000 in the last 12 months, or are expected to cross that figure within the next 30 days. There is no grace period. Voluntary registration is available from AED 187,500.',
      },
      {
        question: 'What happens if you have been trading above the threshold without registering?',
        answer: 'You face two issues: a AED 20,000 late registration penalty, plus retrospective VAT liability on all taxable supplies made while you should have been registered. The right move is to register immediately and make a voluntary disclosure. Retrospective liability can sometimes be offset against input VAT you could have claimed during that period.',
      },
      {
        question: 'What is a UAE Tax Registration Number (TRN)?',
        answer: 'Your TRN is a 15-digit number issued by the FTA that identifies your business as VAT-registered. It must appear on all tax invoices you issue, all VAT correspondence with the FTA, and your VAT returns.',
      },
      {
        question: 'Once registered, how often do I file VAT returns?',
        answer: 'Most businesses file quarterly — by the 28th of the month following each quarter-end. So the March quarter is due 28 April, the June quarter by 28 July, and so on.',
      },
      {
        question: 'Do I need to register if all my sales are zero-rated?',
        answer: 'If all your taxable supplies are zero-rated, you can register voluntarily to recover input VAT on your costs, or apply for a VAT exemption from registration. We assess which option makes more financial sense for your specific situation.',
      },
      {
        question: 'Can I register for VAT and Corporate Tax at the same time?',
        answer: 'Yes — they are separate registrations on different sections of the EmaraTax portal, but we handle both concurrently where needed.',
      },
    ],
  },

  'vat-filing-uae': {
    title: 'VAT Filing UAE',
    subtitle: 'UAE VAT filing — right rate, right time, every quarter — or we pay.',
    description:
      'Most VAT errors are not about complexity — they are about consistency. Correct transaction coding, timely reconciliation, and portal submission every quarter without fail. We prepare your return within 48 hours of period-end and file before the 28th. If we miss the deadline or get it wrong, we cover the penalty.',
    stats: [
      { label: 'VAT returns filed', value: '7,500+' },
      { label: 'Input VAT adjustments caught', value: 'AED 12M' },
      { label: 'Deadlines missed', value: '0' },
    ],
    problems: [
      'Missing a UAE VAT deadline costs 2% of unpaid tax immediately, rising to 4% per month after 7 days — on AED 100,000 quarterly liability, that is AED 2,000 in the first week alone.',
      'You have a mix of standard-rated, zero-rated, and exempt supplies but transactions are being miscoded — creating both overpayment and audit exposure.',
      'Your input VAT exceeds output VAT due to large zero-rated sales, but you have never claimed a refund.',
    ],
    whyNow: [
      'VAT returns are due on the 28th of the month following each quarter-end — no extensions.',
      'Incorrect categorisation of exempt vs zero-rated supplies is one of the most common FTA audit triggers.',
      'FTA cross-matching between VAT returns and CT filings means inconsistencies surface in both directions.',
    ],
    valueProps: [
      'Sector-specific VAT knowledge: real estate, restaurants and F&B, healthcare, e-commerce, and logistics each have different VAT rules — we have built specific workflows for each.',
      'Source-level reconciliation from POS, ERP, and PSP data — not just journal entries.',
      'VAT refund claims managed end-to-end when your input VAT exceeds output VAT.',
      'Voluntary disclosure management if a previous quarter was filed incorrectly.',
      'Proactive alerts for anomalies, exemptions, and reverse-charge treatments.',
    ],
    workflow: [
      'Collect transaction data from POS, ERP, banks, and PSPs and automate recurring feeds.',
      'Review and reconcile all transactions — coding standard-rated, zero-rated, and exempt correctly for each income stream.',
      'Prepare VAT return with full audit trail and supporting documentation.',
      'Submit on EmaraTax before the 28th deadline and provide a management summary.',
      'Flag input VAT refund opportunities and initiate refund claims where applicable.',
    ],
    solutions: [
      'Quarterly VAT return preparation and EmaraTax submission before the 28th deadline.',
      'Transaction reconciliation — POS, ERP, bank, PSP, and marketplace feeds.',
      'VAT rate classification — standard-rated, zero-rated, and exempt correctly coded per sector.',
      'Input VAT refund claims — documentation preparation and FTA follow-up until cash received.',
      'Voluntary disclosure for previously filed incorrect returns.',
    ],
    deliverables: [
      'Filed VAT return with EmaraTax submission confirmation for each quarter.',
      'Reconciliation workpapers supporting every line of the return.',
      'VAT refund application and FTA correspondence management where applicable.',
      'Management summary highlighting anomalies, adjustments, or upcoming changes.',
    ],
    caseStudy: {
      logo: 'Ecom Chain',
      headline: 'Recovered AED 200k via input VAT audits across 3 years of unfiled credits',
      result: 'Clean evidence files accelerated the refund process and improved operating cash flow by AED 67k per quarter going forward.',
    },
    faqs: [
      {
        question: 'What is the VAT filing deadline in the UAE?',
        answer: 'VAT returns are due on the 28th of the month following each quarter-end. For the quarter ending 31 March, the deadline is 28 April. For 30 June, 28 July. For 30 September, 28 October. For 31 December, 28 January.',
      },
      {
        question: 'What triggers an FTA VAT audit?',
        answer: 'Common triggers include inconsistent VAT return history, large refund claims, a sudden change in VAT position, sector-specific red flags (real estate, hospitality, professional services), or discrepancies between VAT returns and Corporate Tax filings.',
      },
      {
        question: 'What is the difference between zero-rated and exempt supplies?',
        answer: 'Zero-rated supplies (0%) include exports, international transport, and healthcare in licensed UAE facilities — you can still recover input VAT on related costs. Exempt supplies include residential property resale and certain financial services — you cannot recover input VAT. Misclassifying exempt as zero-rated is one of the most common FTA audit triggers.',
      },
      {
        question: 'Can I recover VAT on business expenses?',
        answer: 'Yes — input VAT on goods and services used for standard-rated or zero-rated activities is fully recoverable. Input VAT on exempt activities and personal expenses is not recoverable. If your business has a mix, you will need to apportion input VAT recovery — we handle this calculation as part of quarterly preparation.',
      },
      {
        question: 'What records do I need to keep for VAT?',
        answer: 'All records supporting your VAT returns must be kept for a minimum of seven years. This includes tax invoices issued and received, import and export documentation, bank statements, and any voluntary disclosure or correspondence with the FTA.',
      },
      {
        question: 'We filed incorrectly in a previous quarter. What should we do?',
        answer: 'The FTA allows voluntary disclosure of errors. Proactively correcting an error carries significantly lower penalties than having the FTA discover it themselves. We handle voluntary disclosures regularly.',
      },
    ],
  },

  'audit-services-dubai': {
    title: 'Audit Services Dubai',
    subtitle: 'Audit-ready books for UAE businesses — statutory, internal, and FTA audit support.',
    description:
      'As your business grows, so do the compliance requirements. Failure to keep up with FTA audits can lead to penalties and tarnish your business reputation. Finanshels prepares UAE businesses for statutory and FTA audits with clean accrual-basis accounts, working paper packs, and auditor liaison support.',
    stats: [
      { label: 'UAE businesses served', value: '7,000+' },
      { label: 'Audit inspection pass rate', value: '100%' },
      { label: 'Certified auditors', value: 'CPA, CA, ACCA, CMA' },
    ],
    problems: [
      'Your trade licence renewal is approaching and your free zone requires audited financial statements — your books are not audit-ready.',
      'The FTA has selected your company for a VAT or CT audit and your records do not support every line of your filings.',
      'Investors or a bank facility require independently audited accounts, but your management accounts are on a cash basis.',
    ],
    whyNow: [
      'UAE free zones require audited accounts for annual licence renewal — missing the deadline can freeze your operations.',
      'Businesses with revenues above AED 50M must have audited financials to file their Corporate Tax return.',
      'Banks restrict access to credit and facilities without current audited statements.',
    ],
    valueProps: [
      'Deep UAE knowledge — UAE Commercial Companies Law, FTA regulations, and free zone requirements across JAFZA, DMCC, DIFC, ADGM, and more, inside out.',
      'Certified professionals with UAE Ministry of Economy audit approval — CPA, CA, ACCA, CMA.',
      'Advanced audit software and automated testing — faster turnaround without cutting corners.',
      'We do not disappear after the report — post-audit advisory support, recommendations implementation, and year-round guidance.',
      'Trusted by 7,000+ UAE businesses with a consistent delivery record.',
    ],
    workflow: [
      'Book your free audit consultation and receive a customised audit assessment.',
      'We review your accounts, identify gaps, and prepare audit-ready financials.',
      'Audit fieldwork — independent verification of financial statements, controls review, and evidence examination.',
      'Working papers prepared, audit opinion issued, management letter with recommendations.',
      'Post-audit advisory — implement recommendations, prepare for next cycle, year-round support.',
    ],
    solutions: [
      'Statutory Financial Audits — clear audit opinions meeting UAE legal requirements for DED renewal, free zone compliance, and FTA submissions.',
      'Internal Audit Services — operational efficiency assessment, control weakness identification, practical improvement recommendations.',
      'Free Zone Compliance Audits — specialised for JAFZA, DMCC, DIFC, ADGM, and all major UAE free zones.',
      'Tax Audits and FTA Support — VAT return review, CT filing review, transfer pricing documentation, and expert FTA representation.',
      'Audit-Readiness Preparation — pre-audit books cleanup, working paper packs, and documentation organising.',
    ],
    deliverables: [
      'Audited financial statements with independent audit opinion.',
      'Working paper pack supporting every material line item.',
      'Management letter with identified control weaknesses and recommendations.',
      'Free zone or FTA submission package where required.',
    ],
    caseStudy: {
      logo: 'Hub71 Cohort',
      headline: 'Zero audit observations across 18 portfolio companies in one cycle',
      result: 'Finanshels process was documented by regulators as best practice for audit readiness and AML compliance.',
    },
    faqs: [
      {
        question: 'How long does an audit typically take?',
        answer: 'Usually four to eight weeks from the point when audit-ready accounts are available and the auditor begins fieldwork. The biggest variable is the condition of the accounts when the auditor starts — which is why we focus on maintaining audit-ready books throughout the year.',
      },
      {
        question: 'Do sole establishments need an audit?',
        answer: 'Not typically — sole establishments do not have a statutory audit requirement. However, if you are applying for a bank loan, raising investment, or operating in a free zone that requires audited accounts for licence renewal, you will need one regardless of entity type.',
      },
      {
        question: 'What is the difference between an audit and a review engagement?',
        answer: 'An audit provides the highest level of assurance — the auditor confirms your accounts give a true and fair view. A review engagement provides limited assurance at lower cost. Investors and lenders generally require full audits for significant transactions.',
      },
      {
        question: 'Which free zones require annual audited accounts?',
        answer: 'Most major UAE free zones — including JAFZA, DMCC, DIFC, ADGM, and IFZA — require audited financial statements for annual licence renewal. Requirements and deadlines vary by free zone. We handle submissions for all major free zones.',
      },
      {
        question: 'What happens if the FTA selects us for an audit?',
        answer: 'We provide inspection readiness assessments before any visit, prepare your full evidence file, and sit alongside your team during FTA audit interviews. Our clients have a 100% pass rate in audits we have supported.',
      },
    ],
  },

  'company-liquidation-dubai': {
    title: 'Company Liquidation Dubai',
    subtitle: 'Closing your UAE company — done cleanly, done right.',
    description:
      'Winding up a UAE company is not just notifying the licensing authority and walking away. You need final accounts, FTA clearance for VAT and Corporate Tax, settled employee entitlements, and a liquidation report — each with its own deadlines, paperwork, and penalties. We handle every financial and compliance step so you close without surprises.',
    stats: [
      { label: 'Liquidations executed', value: '80+' },
      { label: 'Average completion', value: '45–90 days' },
      { label: 'Countries supported', value: '9' },
    ],
    problems: [
      'You are winding down a UAE entity and do not know the correct sequence of VAT deregistration, CT deregistration, and licensing authority notification.',
      'You have employees with outstanding EOSB gratuity entitlements that need to be calculated and settled before the licence can be cancelled.',
      'You have a VAT credit balance with the FTA that needs to be refunded as part of the deregistration process.',
    ],
    whyNow: [
      'Final CT return for the period through to the liquidation date is required — the filing deadline is 9 months after cessation.',
      'Outstanding VAT credits are only refunded as part of the formal deregistration process — you will not receive them automatically.',
      'Employee EOSB gratuity must be calculated and settled before the licensing authority will approve the cancellation.',
    ],
    valueProps: [
      'Full sequence managed: final accounts, VAT deregistration, CT deregistration, employee settlements, and liquidation account.',
      'Statutory audit coordination where required — mainland LLCs, DIFC and ADGM entities, and many free zone companies.',
      'VAT credit refund application prepared and FTA follow-up managed until cash is received.',
      'Employee EOSB gratuity calculated correctly for every employee, documented and settled.',
      'Remote liquidation available — founders focused on what comes next while we handle authorities and employees.',
    ],
    workflow: [
      'Final financial statements prepared to liquidation date on accrual basis, including all outstanding accruals and provisions.',
      'Statutory audit coordinated where required by your licensing authority or free zone.',
      'VAT deregistration — formal FTA application, final VAT return to cessation date, FTA clearance certificate.',
      'Corporate Tax deregistration — final CT return filed for the period through to liquidation date.',
      'Employee entitlements — final salaries and EOSB gratuity calculated, documented, and settled.',
      'Liquidation account — statement of asset realisation, creditor payments, and distribution to shareholders.',
    ],
    solutions: [
      'Final financial statements — accrual-basis accounts to liquidation date.',
      'Statutory audit — audit-ready financials and auditor coordination where required.',
      'VAT deregistration — FTA application, final return, clearance certificate, credit refund.',
      'Corporate Tax deregistration — final CT return and FTA deregistration confirmation.',
      'Employee settlements — EOSB gratuity calculations and settlement documentation.',
    ],
    deliverables: [
      'Final audited financial statements to liquidation date.',
      'VAT deregistration clearance certificate from FTA.',
      'Corporate Tax final return and deregistration confirmation.',
      'Employee EOSB settlement calculations and payment documentation.',
      'Liquidation account with asset realisation and distribution statement.',
    ],
    caseStudy: {
      logo: 'Stealth SaaS',
      headline: 'Closed UAE entity remotely in 45 days while founders focused on relaunch',
      result: 'Finanshels handled all authority communications, employee settlements, and FTA clearances — zero admin burden for the founding team throughout.',
    },
    faqs: [
      {
        question: 'How long does the financial wind-down take?',
        answer: 'Typically four to twelve weeks, depending on the complexity of the business and the number of outstanding items. The licensing authority process runs in parallel and usually takes longer than the financial close. Starting the financial wind-down early keeps the overall timeline manageable.',
      },
      {
        question: 'What happens to a VAT credit when a company closes?',
        answer: 'Outstanding VAT credits are refunded by the FTA as part of the deregistration process, subject to their review. We prepare the refund application and follow up until the cash is received.',
      },
      {
        question: 'Do we need to file a Corporate Tax return if the company only operated for part of a year?',
        answer: 'Yes. A final CT return is required for the period from the last filed return through to the cessation date. The filing deadline is 9 months after that date.',
      },
      {
        question: 'Do we need an audit to close the company?',
        answer: 'Mainland LLCs, DIFC and ADGM entities, and many free zone companies require audited final accounts as part of the liquidation process. We prepare audit-ready financials and coordinate with the appointed auditor.',
      },
      {
        question: 'Can the company be liquidated remotely if the founders are not in the UAE?',
        answer: 'Yes. We handle all authority communications, FTA correspondence, and employee settlement documentation on your behalf. Most of our liquidation engagements are managed remotely.',
      },
    ],
  },

  'corporate-tax-filing': {
    title: 'Corporate Tax Filing',
    subtitle: 'File corporate tax across the UAE with zero surprises',
    description:
      'From registration to computation, reliefs, and portal submissions, Finanshels teams manage the entire corporate tax lifecycle for high-growth companies.',
    stats: [
      { label: 'Entities filed', value: '800+' },
      { label: 'Penalties avoided', value: 'AED 6M+' },
      { label: 'Average turnaround', value: '10 days' },
    ],
    valueProps: [
      'Data gathering and audit-ready workpapers from ERPs, banks, and spend tools.',
      'Advisory on reliefs, exemptions, losses, and transfer pricing exposure.',
      'Full filing ownership inside FTA portals with reminders for payments.',
    ],
    workflow: [
      'CT readiness sprint: diagnostic, data room, and risk heatmap.',
      'Quarterly/annual computation with scenario planning for management.',
      'Submission + payment tracking with CFO briefings and board memos.',
    ],
    caseStudy: {
      logo: 'YAP',
      headline: 'Scaled from 1 to 11 entities without missing a single CT deadline',
      result: 'Finanshels automated data extraction from PSPs and ERPs, enabling faster reconciliations and eliminating penalties.',
    },
  },

  bookkeeping: {
    title: 'Bookkeeping',
    subtitle: 'Realtime books for operators who need clarity every week',
    description:
      'Dedicated controllers close books, reconcile banks/PSPs, and deliver board-grade packs so you never enter a fundraising meeting blind.',
    stats: [
      { label: 'Avg. close time', value: '5 days' },
      { label: 'Accounts automated', value: '150+' },
      { label: 'Dashboards shipped', value: '60+' },
    ],
    valueProps: [
      'Automated ingestion from banks, PSPs, ERPs, CRMs, and spend platforms.',
      'Variance analysis with commentary, burn, runway, and cohort views.',
      'Board-ready exports tailored to SaaS, fintech, retail, and marketplaces.',
    ],
    workflow: [
      'Digitize: Clean historical ledgers and standardize chart of accounts.',
      'Operate: Weekly reconciliations, accrual adjustments, and AR/AP ownership.',
      'Report: Monthly packs, KPI snapshots, investor dashboards, and audit prep.',
    ],
    caseStudy: {
      logo: 'Sarwa',
      headline: 'Reduced month-end from 20 days to 4 days',
      result: 'Multi-entity consolidation with PSP feeds allowed the leadership team to run weekly profitability reviews.',
    },
  },

  'tax-consultancy': {
    title: 'Tax Consultancy',
    subtitle: 'Strategic tax partners for scaling startups and corporate groups',
    description:
      'We advise on structuring, transfer pricing, double-tax treaties, and regulatory changes while coordinating with auditors and legal teams.',
    stats: [
      { label: 'Advisory projects', value: '200+' },
      { label: 'Jurisdictions covered', value: '9' },
    ],
    valueProps: [
      'Entity structuring guidance for M&A, fundraising, or geographic expansion.',
      'Transfer pricing documentation and benchmarking for intra-group transactions.',
      'Regulatory watchtower for UAE, KSA, Qatar, Oman, Bahrain, and India.',
    ],
    workflow: [
      'Scope: workshops with founders, CFOs, and legal counsel.',
      'Model: scenario planning and policy design reviewed by our tax bench.',
      'Deliver: memos, filings, and coordination with authorities/auditors.',
    ],
    caseStudy: {
      logo: 'Baraka',
      headline: 'Structured expansion into Saudi with full TP documentation',
      result: 'Avoided double taxation while keeping investors and regulators aligned.',
    },
  },

  'fractional-cfo': {
    title: 'Fractional CFO',
    subtitle: 'Senior finance leadership without hiring full-time',
    description:
      'Partner with CFOs who have navigated fundraising, pricing shifts, and multi-market expansion. They operate as an extension of your exec team.',
    stats: [
      { label: 'CFO bench', value: '12' },
      { label: 'Capital raised with our support', value: '$600M+' },
    ],
    valueProps: [
      'Investor storytelling, fundraise prep, and diligence rooms.',
      'Pricing and margin experiments with ops + GTM leaders.',
      'Scenario planning, runway extensions, and board meeting facilitation.',
    ],
    workflow: [
      'Onboard: align on KPIs, cadence, and stakeholder map.',
      'Operate: weekly exec reviews, forecasting, and resource allocation.',
      'Scale: support hiring, banking relationships, and exit prep.',
    ],
    caseStudy: {
      logo: 'Letswork',
      headline: 'Raised follow-on capital with revamped operating model',
      result: 'Fractional CFO introduced new pricing, cut burn by 22%, and led board reporting.',
    },
  },

  'compliance-services': {
    title: 'Compliance Services',
    subtitle: 'AML, data room hygiene, and governance handled for you',
    description:
      'Teams maintain registers, filings, policies, and evidence so audits are straightforward and founders sleep better.',
    stats: [
      { label: 'Compliance rituals automated', value: '500+' },
      { label: 'Average SLA', value: '24 hrs' },
    ],
    valueProps: [
      'AML/CFT policy creation, training, and ongoing monitoring.',
      'Audit-ready evidence files, registers, and review trails.',
      'Board + shareholder governance packs with version control and approvals.',
    ],
    workflow: [
      'Audit existing controls and produce a remediation roadmap.',
      'Implement trackers across Zoho, Notion, Jira, or custom control towers.',
      'Monthly compliance reviews with founders and legal counsel.',
    ],
    caseStudy: {
      logo: 'Hub71 Cohort',
      headline: 'Zero penalties across 18 portfolio companies',
      result: 'Regulators documented Finanshels process as best practice for AML and audit readiness.',
    },
  },

  'vat-registration': {
    title: 'VAT Registration',
    subtitle: 'Register once, stay compliant forever',
    description:
      'Eligibility checks, document prep, portal submissions, and follow-ups managed end-to-end by VAT specialists.',
    stats: [
      { label: 'Registrations completed', value: '650+' },
      { label: 'Rejected filings', value: '0' },
    ],
    valueProps: [
      'Eligibility assessment + voluntary vs. mandatory scenarios.',
      'Compilation of financials, legal docs, tenancy contracts, and approvals.',
      'Liaison with authorities plus reminders for first return + payments.',
    ],
    workflow: [
      'Gather documentation and gap-checkwith our compliance checklist.',
      'Submit application, respond to queries, and secure TRN.',
      'Transition into monthly/quarterly VAT filing team.',
    ],
    caseStudy: {
      logo: 'Retail Collective',
      headline: 'Registered 9 outlets with unified VAT workflows',
      result: 'Centralized returns prevented mismatches across emirates.',
    },
  },

  'corporate-tax-registration': {
    title: 'Corporate Tax Registration',
    subtitle: 'Register every entity before the fines hit',
    description:
      'We coordinate shareholder documents, legal entity structures, and FTA portal submissions.',
    stats: [
      { label: 'Entities registered', value: '900+' },
    ],
    valueProps: [
      'Entity mapping and beneficial ownership review.',
      'Document gathering plus translation/notarization support.',
      'Portal submission + follow-up, including branches and freezone setups.',
    ],
    workflow: [
      'Kickoff with legal, finance, and operations for each entity.',
      'Compile documents, create accounts, and file registration.',
      'Handover checklist for ongoing CT compliance.',
    ],
    caseStudy: {
      logo: 'Global Holding',
      headline: 'Registered 14 subsidiaries in three weeks',
      result: 'Avoided AED 50k+ in penalties by hitting every deadline early.',
    },
  },

  'liquidation-services': {
    title: 'Liquidation Services',
    subtitle: 'Stress-free company closure with every detail handled',
    description:
      "Whether it's a pivot or consolidation, we manage final accounts, regulatory clearances, and stakeholder communication.",
    stats: [
      { label: 'Liquidations executed', value: '80+' },
    ],
    valueProps: [
      'Closing financial statements, audit coordination, and bank closures.',
      'Final-employee settlement reconciliations and creditor notices.',
      'Regulatory filings, clearance certificates, and final deregistration.',
    ],
    workflow: [
      'Plan timeline and stakeholder map.',
      'Execute filings + clearances.',
      'Archive data rooms and transfer IP/assets as required.',
    ],
    caseStudy: {
      logo: 'Stealth SaaS',
      headline: 'Closed UAE entity remotely in 45 days',
      result: 'Founders focused on relaunch while we handled authorities and employees.',
    },
  },

  'hire-an-expert': {
    title: 'Hire an Expert',
    subtitle: 'Deploy controllers, CFOs, or audit specialists in days',
    description:
      'Our bench plugs into your org chart full-time or part-time, backed by Finanshels IP and tooling.',
    stats: [
      { label: 'Experts deployed', value: '60+' },
      { label: 'Average onboarding', value: '72 hrs' },
    ],
    valueProps: [
      'Pre-vetted finance talent with sector specialisation.',
      'Shadow support from Finanshels teams and bench leads.',
      'Flexible engagements: interim, fractional, or temp-to-perm.',
    ],
    workflow: [
      'Define role outcomes + KPIs.',
      'Match with the right expert and run joint onboarding.',
      'Review impact every 30 days with our talent partners.',
    ],
    caseStudy: {
      logo: 'VC-backed Fintech',
      headline: 'Interim CFO closed Series B diligence',
      result: 'Expert led data room, board comms, and bank relationships for six months.',
    },
  },

  'vat-filing': {
    title: 'VAT Filing',
    subtitle: 'Monthly and quarterly VAT filings delivered without follow-ups',
    description:
      'We reconcile every invoice, collect evidence, and submit returns on time while ensuring payment reminders hit your finance stack.',
    stats: [
      { label: 'Returns filed', value: '7,500+' },
      { label: 'Adjustments caught', value: 'AED 12M' },
    ],
    valueProps: [
      'Source-level reconciliation from POS, ERP, and PSP data.',
      'Documentation storage for audits and refund claims.',
      'Proactive alerts for anomalies, exemptions, and reverse-charge.',
    ],
    workflow: [
      'Collect data + automate feeds.',
      'Review + reconcile + prep return.',
      'Submit + track payment + provide management summary.',
    ],
    caseStudy: {
      logo: 'Ecom Chain',
      headline: 'Recovered AED 200k via input VAT audits',
      result: 'Clean evidence files accelerated refunds and improved cash flow.',
    },
  },

  restaurants: {
    title: 'Restaurants & F&B',
    subtitle: 'Financial command center for restaurant groups and cloud kitchens',
    description:
      'Track outlet profitability, supplier payments, and franchise royalties while staying compliant with VAT and labour laws.',
    stats: [
      { label: 'Locations supported', value: '320+' },
      { label: 'Inventory variances reduced', value: '18%' },
    ],
    valueProps: [
      'POS + delivery aggregator integrations for realtime sales.',
      'Ingredient costing, wastage tracking, and vendor payments.',
      'Outlet-level audit prep and AML hygiene for franchise networks.',
    ],
    workflow: [
      'Setup: integrate POS, aggregators, and inventory tools.',
      'Operate: weekly P&L per outlet + supplier scorecards.',
      'Grow: franchise reporting, royalty statements, and expansion modeling.',
    ],
    caseStudy: {
      logo: 'Kitch',
      headline: 'Expanded to 4 countries with consistent margins',
      result: 'Unified cost tracking and supplier controls saved AED 1.2M annually.',
    },
  },

  startups: {
    title: 'Startups & Scale-ups',
    subtitle: 'Designed for venture-backed founders sprinting towards the next round',
    description:
      'Teams plug into product, GTM, and talent teams to run burn, runway, metrics, and compliance without slowing you down.',
    stats: [
      { label: 'Founders served', value: '900+' },
    ],
    valueProps: [
      'SaaS metrics, cohort analyses, and growth dashboards.',
      'Fundraising prep, data rooms, and investor updates.',
      'Compliance layer for CT, VAT, AML, and audit prep.',
    ],
    workflow: [
      'Diagnose tool stack + KPIs.',
      'Operate teams with weekly rituals + Slack/WhatsApp support.',
      'Scale into new markets with local compliance teams.',
    ],
    caseStudy: {
      logo: 'Baraka',
      headline: 'Board loved the new finance control room',
      result: 'Raised subsequent rounds with predictable reporting cadence.',
    },
  },

  ecommerce: {
    title: 'eCommerce & Retail',
    subtitle: 'Inventory, PSPs, and marketplace reconciliations in one place',
    description:
      'Get SKU-level visibility, sell-through rates, and tax-ready evidence without spreadsheets.',
    stats: [
      { label: 'SKUs reconciled', value: '50k+' },
    ],
    valueProps: [
      'Marketplace + PSP integrations (Amazon, Noon, Deliveroo, Talabat, etc.).',
      'Landed cost, promotions, and margin dashboards per channel.',
      'Reverse-charge VAT, cross-border compliance, and cash cycle tracking.',
    ],
    workflow: [
      'Connect stores, PSPs, ERP, and 3PL feeds.',
      'Operate: daily reconciliations + AR/AP + claims management.',
      'Scale: multi-country filings and treasury support.',
    ],
    caseStudy: {
      logo: 'DesertCart',
      headline: 'Recovered AED 450k in marketplace deductions',
      result: 'Automated reconciliation flagged disputes within 24 hours.',
    },
  },

  smes: {
    title: 'SMEs & Family Businesses',
    subtitle: 'Enterprise-grade finance for ambitious SMBs',
    description:
      'We become your finance department—bookkeeping, compliance, and CFO strategy under one subscription.',
    stats: [
      { label: 'SMBs onboarded', value: '7,000' },
    ],
    valueProps: [
      'Affordable teams customisable to your industry.',
      'Policy design, approvals, and internal controls from day one.',
      'On-call finance partner for banks, auditors, and regulators.',
    ],
    workflow: [
      'Understand: goals, cash position, and current tools.',
      'Build: custom team with controllers, tax, audit, and CFO leads.',
      'Operate: monthly reviews, compliance calendar, and growth projects.',
    ],
    caseStudy: {
      logo: 'SME Collective',
      headline: 'Transformed finance in 60 days',
      result: 'Owners finally had clarity on margins, cash, and compliance risk.',
    },
  },
}
