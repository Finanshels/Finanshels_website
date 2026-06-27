import type { ServicePage } from '../service-pages'

export const healthcare: ServicePage = {
  title: 'Healthcare Accounting',
  subtitle:
    'Healthcare accounting in the UAE — VAT handled correctly, insurance receivables tracked, clinic P&L clear.',
  description:
    'Running a UAE clinic means your accounting needs to understand the difference between a consultation and a cosmetic treatment — because the VAT treatment is completely different. Finanshels has built specific accounting workflows for licensed medical services, cosmetic treatments, insurance billing, and multi-site clinic reporting — so nothing falls through the gap between your clinical operations and your compliance obligations.',
  stats: [
    { label: 'UAE businesses', value: '7,000+' },
    { label: 'Trustpilot rating', value: '4.9' },
    { label: 'Qualified accountants', value: '200+' },
  ],
  problems: [
    'Your accountant applies a single VAT approach to everything — so either your VAT return is wrong or your P&L is misleading, or both.',
    'Insurance cash arrives 30 to 90 days after treatment, and cash-basis bookkeeping cannot tell you what you are actually owed.',
    'A single consolidated P&L hides which clinic, practitioner, or service line is actually carrying the group.',
  ],
  whyNow: [
    'Every UAE healthcare business must register for Corporate Tax and file annually — the AED 10,000 non-registration penalty applies regardless of profit.',
    'Incorrectly treating licensed medical services as exempt rather than zero-rated forfeits recoverable input VAT on equipment and supplies.',
    'Free zone clinic licence renewals require audited financial statements maintained to standard throughout the year.',
  ],
  whoFor: [
    {
      segment: 'Single-location clinic',
      description:
        'A DHA or DOH-licensed clinic — GP, dental, physiotherapy, specialist, or diagnostic — with employed or contracted practitioners, insurance billing through Daman or another UAE insurer, and a growing sense that the monthly numbers do not reflect what the business is actually doing. You need clean books, correct VAT treatment, insurance receivables tracked properly, and a monthly P&L you can actually use.',
    },
    {
      segment: 'Multi-specialty clinic',
      description:
        'You offer both licensed medical services and cosmetic or aesthetic treatments. The VAT treatment is different for each. The revenue recognition is different for each. Your current accountant is applying a single approach to everything — which means either your VAT return is wrong or your P&L is misleading, or both.',
    },
    {
      segment: 'Clinic chain or group',
      description:
        'You are operating two, three, or more locations. You need consolidated group reporting and branch-level P&L. You need to know which clinic is profitable and which is not — and you cannot see that from a single consolidated P&L. You may also need practitioner-level reporting to understand revenue, cost, and margin per doctor or therapist.',
    },
    {
      segment: 'Wellness centre or spa with clinical components',
      description:
        'You are operating at the boundary of healthcare and wellness — physiotherapy, nutrition counselling, chiropractic, licensed wellness services. Your VAT position depends on which services are provided by a licensed facility and which are not. Getting this wrong affects both your quarterly return and your input VAT recovery.',
    },
    {
      segment: 'Healthcare startup or new clinic',
      description:
        'You have just received your DHA or DOH licence and you are generating your first revenue. You want to set up your accounting correctly from day one — chart of accounts configured for healthcare, VAT treatment rules built in from the start, insurance receivables tracked from the first claim, and CT registration handled before the first deadline arrives.',
    },
  ],
  challengesEyebrow: 'Why healthcare is different',
  challengesHeading: 'The four accounting challenges every UAE clinic faces',
  challenges: [
    {
      heading: 'VAT treatment that changes by service type',
      body: 'This is the most commonly misapplied area of UAE healthcare accounting. The VAT treatment of medical services is not uniform — it depends on the licence status of the facility, the nature of the service, and whether the treatment has a therapeutic medical purpose. If your clinic provides both DHA/DOH-licensed medical services and cosmetic treatments, the VAT treatment must be applied separately to each income stream in every billing system, every invoice, and every quarterly return.',
      points: [
        'Consultations, GP visits, diagnostics, lab tests, in-patient treatment, surgery, physiotherapy, and dental — licensed facility: zero-rated 0%',
        'Cosmetic and aesthetic treatments with no therapeutic medical purpose: standard-rated 5%',
        'Medical equipment and pharmaceuticals supplied to a licensed facility: zero-rated 0% — input VAT recoverable',
        'Wellness services from an unlicensed or non-clinical facility: standard-rated 5%',
        'Shared overhead costs (reception, utilities, rent) must be apportioned between zero-rated and standard-rated streams using an agreed method',
      ],
    },
    {
      heading: "Insurance receivables that cash-basis bookkeeping can't handle",
      body: 'If you accept patients under Daman, Thiqa, ADNIC, AXA, MetLife, or any other UAE insurer, your revenue cycle has a structural timing mismatch. Revenue is earned when the patient is treated, but the cash arrives 30 to 90 days later — after claim submission, insurer review, potential rejection and resubmission, and eventual payment. Accrual accounting records it when earned; the gap lives on your balance sheet as a receivable that must be tracked correctly.',
      points: [
        'An insurance receivables ledger maintained per insurer — claims submitted, approved, pending, disputed/rejected, and received',
        'Reconciled monthly to insurer statements',
        'Outstanding claims flagged for follow-up at 30, 60, and 90 days',
        'Rejected claims identified and reviewed for resubmission',
        'A monthly receivables ageing report showing exactly what you are owed, by insurer, and for how long',
      ],
    },
    {
      heading: 'Clinic-level and practitioner-level P&L for multi-site operations',
      body: 'A consolidated P&L tells you how the group is performing. It does not tell you which clinic is carrying the others, which practitioner is generating the margin, or which service line is worth expanding. For clinic chain owners, the monthly reports that matter are the individual clinic P&Ls and the practitioner-level breakdown.',
      points: [
        'Consolidated group P&L for overall financial performance',
        'Branch-level P&L for each clinic — revenue, direct clinical costs, staff costs, overhead allocation, and contribution margin',
        'Practitioner-level revenue tracking — income per practitioner against practitioner cost and commission',
        'Service-line P&L where applicable — medical versus cosmetic, or by specialty',
        'Delivered by the 10th of the following month, in a format a practice manager can act on',
      ],
    },
    {
      heading: 'Corporate Tax and compliance that cannot be left to a general checklist',
      body: 'Every UAE healthcare business must register for Corporate Tax and file an annual return regardless of profit level. For multi-entity clinic groups, the CT position may involve related-party transactions, intercompany management fees, or a group structure that requires consolidated treatment decisions. DHA and DOH-licensed facilities operating in free zones — DHCC, DIFC, Masdar City — need QFZP assessment to determine whether qualifying income can access the 0% rate. This requires annual confirmation, audited accounts, and documented substance. Free zone clinics also need audited financial statements for licence renewal — maintained throughout the year, not assembled in the final weeks.',
    },
  ],
  valueProps: [
    'Healthcare-specific from day one — chart of accounts, VAT rules, insurance receivables workflow, and practitioner reporting configured for your clinic type at onboarding.',
    'VAT treatment reviewed per transaction, not assumed — the zero-rating claim confirmed, documented, and defensible.',
    'Insurance receivables managed, not just recorded — claims tracked from submission to payment and aged so outstanding amounts are visible and actionable.',
    'Clinic-level and practitioner-level visibility produced monthly as a standard deliverable, not a custom report request.',
    'One team from bookkeeping to VAT to CT to audit — no handoffs, no version gaps between what your accountant recorded and what your filing reports.',
    'Specialist healthcare knowledge is included in standard plan pricing — not charged at a premium because your business type requires it.',
  ],
  solutions: [
    'Monthly bookkeeping and financial close — patient revenue, insurance billing, cosmetic revenue, equipment purchases, and staff costs reconciled monthly and closed by the 10th with VAT applied at transaction level.',
    'Healthcare VAT management and quarterly filing — zero-rated licensed services, standard-rated cosmetic treatments, and exempt supplies tagged correctly, with input VAT recovery maximised.',
    'Insurance receivables management — a per-insurer ledger (Daman, Thiqa, ADNIC, AXA, MetLife, and others), monthly reconciliation, and an ageing report with rejected claims flagged.',
    'Clinic-level and practitioner-level reporting for multi-location groups — branch P&L, practitioner revenue tracking, service-line margin, and consolidated group reporting.',
    'WPS payroll for clinical and administrative staff, with EOSB gratuity calculated and tracked and practitioner commission structures handled.',
    'Corporate Tax registration and annual filing, including QFZP assessment, Small Business Relief, and related-party review for clinic groups.',
    'Audit coordination for free zone clinics — DHCC, DIFC, Masdar City, and others — through our licensed partner network.',
    'Books Health Check for clinics joining from another provider — identifying VAT misclassifications and receivables issues before the monthly service begins.',
  ],
  workflow: [
    'Day 1 — Healthcare-specific onboarding: we review your DHA or DOH licence status, confirm your service mix, and establish the correct VAT treatment for each revenue category.',
    'Days 2–5 — System setup and insurance receivables configuration: software connected, insurance ledgers created for each insurer, VAT rules configured at category level, and the compliance calendar built.',
    'Days 6–28 — First month of bookkeeping: transactions recorded and VAT-tagged, insurance claims tracked from submission, bank statements reconciled, and outstanding receivables logged.',
    'Day 30 — First month-end close: books closed; P&L, Balance Sheet, Insurance Receivables Ageing, and Cash Flow delivered with plain-English commentary, plus branch-level reports for clinic groups.',
    'Ongoing — quarterly VAT and annual CT: returns filed before every FTA deadline from correctly tagged transactions, with input VAT recovery maximised and positions reconciled against CT.',
  ],
  deliverables: [
    'Monthly P&L, Balance Sheet, and Cash Flow, closed by the 10th.',
    'Monthly insurance receivables ageing report by insurer.',
    'Branch-level and practitioner-level P&L for multi-site groups.',
    'Quarterly VAT returns and annual Corporate Tax filing.',
    'Audit-ready records for free zone clinic licence renewals.',
  ],
  pricingTiers: [
    {
      name: 'Essential plan',
      price: 'AED 799/month',
      bestFor: 'Single-location clinic · up to 200 transactions/month',
      includes: [
        'Monthly bookkeeping with healthcare VAT treatment configured',
        'Bank reconciliation',
        'Insurance receivables ledger (up to two insurers)',
        'Monthly P&L and Balance Sheet',
        'Corporate Tax registration and annual filing',
        'Compliance calendar and audit-ready records',
        'Dedicated accountant',
      ],
    },
    {
      name: 'Growth plan',
      price: 'AED 999/month',
      highlighted: true,
      bestFor: 'VAT-registered or multi-specialty clinic · up to 500 transactions/month',
      includes: [
        'Everything in Essential, plus:',
        'Quarterly VAT returns included',
        'Insurance receivables management across all insurers — ageing and monthly reconciliation',
        'Monthly management pack with cash flow statement',
        'WPS payroll management',
        'Quarterly review call with senior accountant',
      ],
    },
    {
      name: 'Scale plan',
      price: 'AED 1,999/month',
      bestFor: 'Clinic chain or group · multi-entity · up to 1,000 transactions/month',
      includes: [
        'Everything in Growth, plus:',
        'Branch-level and practitioner-level P&L reporting',
        'Multi-entity consolidated reporting',
        'Senior accountant oversight',
        'Audit coordination included',
        'Investor and bank reporting pack',
      ],
    },
  ],
  pricingNote:
    'Specialist healthcare accounting at standard plan pricing — no healthcare surcharge. A Books Health Check (AED 299–500) is available for clinics joining from another provider and is credited against cleanup or your first month.',
  faqs: [
    {
      question: 'Are all medical services zero-rated for VAT in the UAE?',
      answer:
        'No — only services provided by DHA or DOH-licensed healthcare facilities. The zero rate applies to consultations, diagnostics, in-patient treatment, surgery, physiotherapy, dental treatment, and other licensed medical services where the treatment has a therapeutic medical purpose. Cosmetic procedures and aesthetic treatments with no therapeutic medical purpose are standard-rated at 5% VAT. If your clinic provides both, each category must be treated and reported separately.',
    },
    {
      question: 'Can our clinic recover input VAT on medical equipment purchases?',
      answer:
        'Yes — input VAT on medical equipment, pharmaceutical supplies, diagnostic consumables, and clinical technology purchased by a licensed healthcare facility for use in zero-rated services is fully recoverable. This is one of the most valuable VAT provisions available to UAE clinics — and one of the most commonly missed when VAT is managed by a generalist accountant who has not confirmed the zero-rating position correctly.',
    },
    {
      question: 'What is the difference between zero-rated and exempt for healthcare VAT?',
      answer:
        'Both mean the patient pays no VAT. But the treatment of input VAT recovery is fundamentally different. On a zero-rated supply, the clinic can recover input VAT on costs directly related to that supply. On an exempt supply, input VAT recovery is generally restricted. Licensed medical services are zero-rated — not exempt. Treating them as exempt means forgoing input VAT recovery on medical equipment, supplies, and related overhead costs. This is a material error for any clinic with significant equipment or consumable costs.',
    },
    {
      question: 'How should insurance receivables be managed in clinic accounting?',
      answer:
        'Revenue from insurance-covered treatments should be recognised when the service is delivered — not when the insurer pays. The gap between service delivery and cash receipt creates an accounts receivable that must be tracked per insurer, per claim, and reconciled monthly to insurer statements. Finanshels maintains an insurance receivables ledger for each insurer, tracks claims from submission through approval and payment, ages outstanding receivables monthly, and flags rejected or disputed claims for follow-up.',
    },
    {
      question: 'Does our clinic need to register for Corporate Tax?',
      answer:
        'Yes. All UAE healthcare businesses — clinics, dental practices, diagnostic centres, physiotherapy studios, and wellness centres — must register for Corporate Tax regardless of profit level or entity type. Profits below AED 375,000 are taxed at 0%, but the registration and annual filing obligation exists regardless. The AED 10,000 penalty for non-registration applies whether or not any tax is owed. Finanshels handles CT registration as part of onboarding and prepares and files your annual return as part of every plan.',
    },
    {
      question: 'We offer both medical treatments and cosmetic services. How does the accounting work?',
      answer:
        'Each income stream is treated separately — medical services at zero-rated VAT and cosmetic services at standard-rated 5% VAT. Your chart of accounts must separate the two revenue categories, and each invoice must reflect the correct VAT treatment. Input VAT on shared overhead costs — reception staff, building rent, utilities — must be apportioned between the two streams using an agreed method. Finanshels configures this split at onboarding and maintains it throughout the engagement, so your quarterly VAT return reflects the correct position on both income streams.',
    },
    {
      question: 'What reports do you produce for multi-clinic groups?',
      answer:
        'For clinic chains and groups, Finanshels produces consolidated group financial statements alongside branch-level P&L for each location. Branch reporting shows revenue, direct clinical costs, practitioner costs, overhead allocation, and contribution margin per clinic. Practitioner-level revenue tracking is available where required — showing income generated per doctor, therapist, or practitioner against the cost of their time and any commission structure. All reports are delivered monthly by the 10th.',
    },
    {
      question: 'Do free zone clinics need an audit?',
      answer:
        'Yes, for licence renewal. Free zone clinic entities — including those licensed in DHCC, DIFC, and other healthcare-relevant free zones — require audited financial statements for licence renewal. Finanshels maintains your books to audit-ready standard throughout the year and coordinates the audit through our licensed partner network at renewal time. Where a free zone clinic is also claiming QFZP status for Corporate Tax purposes, audited accounts are additionally required to support the 0% rate claim.',
    },
    {
      question: 'How long does it take to set up healthcare accounting with Finanshels?',
      answer:
        'Most clinics are set up and operating on their first monthly close within 48 hours to two weeks of onboarding — depending on the current state of their books. We confirm your DHA/DOH licence status, configure your chart of accounts for your specific service mix, set up your insurance receivables ledgers, and begin the current period’s bookkeeping. If cleanup is required first, we scope and price it clearly before starting. Your first month-end report is delivered by the 10th of the following month.',
    },
    {
      question: 'What if our books have been maintained incorrectly by a previous accountant?',
      answer:
        'We start with a Books Health Check — a review of your current records that identifies VAT misclassifications, incorrectly managed insurance receivables, reconciliation gaps, and any other issues affecting your books. The Health Check is priced separately (AED 299–500) and credited against your cleanup or first month’s plan. Cleanup is scoped and priced clearly before any work begins. Most clinics onboarding from a generalist accountant are fully corrected and running on their first clean monthly close within three to four weeks.',
    },
  ],
}
