import type { ServicePage } from '../service-pages'

export const smallBusiness: ServicePage = {
  title: 'Small Business Accounting',
  subtitle:
    'Small business accounting in the UAE — every number right, every deadline met, nothing left to chance.',
  description:
    'Running a small business in the UAE means every hour spent on bank reconciliations is an hour not spent on the business. Finanshels handles the numbers — books closed every month, VAT filed every quarter, Corporate Tax managed every year, and a qualified accountant available whenever you need one. You run the business. We make sure the finances are right.',
  stats: [
    { label: 'UAE businesses', value: '7,000+' },
    { label: 'Trustpilot rating', value: '4.9' },
    { label: 'Starting from', value: 'AED 799/mo' },
  ],
  problems: [
    'Every hour you spend on bank reconciliations is an hour not spent running the business.',
    'You must register for Corporate Tax and file annually — even below the AED 375,000 threshold — or face a flat AED 10,000 penalty.',
    'Your books only get looked at near year-end, so you can not see your real margin, cash position, or who owes you.',
  ],
  whyNow: [
    'The AED 10,000 CT non-registration penalty applies now — regardless of whether any tax is owed.',
    'Once taxable supplies cross AED 375,000, VAT registration is mandatory and late registration costs AED 20,000.',
    'Free zone licence renewals, bank facilities, and investors all require audited, reconciled financials.',
  ],
  whoFor: [
    {
      segment: 'Healthcare: DHA and DOH-licensed clinics',
      description:
        'Running a clinic in Dubai or Abu Dhabi means managing one of the more complex VAT profiles in the UAE. Licensed medical services are generally zero-rated — but cosmetic treatments, wellness packages, and product sales may be standard-rated at 5%. On top of that, most clinics manage insurance receivables, prepaid wellness packages with deferred revenue, and multi-practitioner commission structures.',
      points: [
        'Zero-rated versus standard-rated VAT classification by treatment and service type',
        'Insurance receivables tracking and ageing',
        'Deferred revenue for prepaid packages',
        'Multi-practitioner commission calculations',
        'Monthly clinic-level P&L showing revenue, cost of delivery, and margin per practitioner or service line',
        'DHA/DOH compliance records maintained for audit readiness',
      ],
    },
    {
      segment: 'Salons, spas, and beauty businesses',
      description:
        'Salon accounting looks simple from the outside — service revenue, some product sales, staff wages. In practice, staff commissions, tip allocations, multi-branch POS reconciliation, and high-volume daily transactions create a bookkeeping workload that quickly outpaces a spreadsheet or a part-time freelancer.',
      points: [
        'Daily POS reconciliation — cash, card, and digital payments',
        'Staff commission calculations matched to individual revenue',
        'Product inventory and sales tracking',
        'Multi-branch P&L where applicable',
        'Monthly reports showing revenue per treatment category, per stylist, and per branch',
      ],
    },
    {
      segment: 'Supermarkets and food retail',
      description:
        'Food retail has one of the most complex VAT profiles in the UAE. Basic food items are zero-rated; processed foods, confectionery, and non-food items are standard-rated at 5%. In a supermarket with hundreds of SKUs, correct VAT coding at product level is not a one-time setup task — it requires ongoing review as your product mix changes.',
      points: [
        'VAT coding review for mixed standard-rated and zero-rated inventory',
        'High-volume daily transaction reconciliation',
        'POS and supplier invoice matching',
        'Stock movement and cost of goods tracking',
        'Monthly margin reporting by category',
      ],
    },
    {
      segment: 'Gyms and fitness businesses',
      description:
        'Annual memberships and class pack sales create deferred revenue — cash received upfront, but revenue earned over the membership period. Getting this right affects both your monthly P&L and your VAT return timing. Instructor employment versus freelance classification also affects EOSB calculations and WPS compliance.',
      points: [
        'Deferred revenue recognition for annual memberships and prepaid class packs',
        'VAT treatment on membership income, personal training, and retail sales',
        'EOSB calculations for instructors and full-time staff',
        'WPS payroll management',
        'Monthly KPI reporting — active memberships, revenue per member, churn rate, and class utilisation',
      ],
    },
    {
      segment: 'Consulting, professional services, and agencies',
      description:
        'For a consulting firm, agency, or professional services business, accounting is less about transaction volume and more about financial visibility — your real margin on each project, which clients are actually profitable, and AR ageing that tells you who owes you and for how long. Most founders know their revenue number; very few know their net margin by client.',
      points: [
        'Project-based P&L tracking — revenue, direct costs, and margin per engagement',
        'Invoice management and AR ageing — outstanding invoices tracked and flagged',
        'WPS payroll for small teams',
        'Expense categorisation for CT deductibility',
        'Monthly management reports showing revenue pipeline, margin, and cash position',
      ],
    },
    {
      segment: 'Restaurants and cafes',
      description:
        'Restaurant accounting requires POS integration, outlet-level P&L, food cost tracking, and delivery platform reconciliation — a different workflow from most service businesses. Finanshels handles restaurant accounting through a dedicated restaurant accounting service. Not sure which plan fits your business? Book a free Finance Health Check — we will assess your setup and recommend the right starting point.',
    },
  ],
  challengesEyebrow: 'What every small business needs',
  challengesHeading: 'The compliance obligations every UAE small business carries',
  challenges: [
    {
      heading: 'Monthly bookkeeping and reconciliation',
      body: 'Every transaction recorded, categorised, and reconciled every month. Not quarterly. Not at year-end. Bank statements matched to invoices and payments, VAT treatment tagged on every line, and books closed by the 10th of the following month. This is the foundation everything else is built on.',
    },
    {
      heading: 'Corporate Tax registration and annual filing',
      body: 'Every UAE business must register for Corporate Tax — regardless of whether profits fall below the AED 375,000 zero-rate threshold. The AED 10,000 FTA penalty for non-registration applies regardless of whether any tax is owed. Finanshels handles CT registration as part of onboarding and prepares and files your annual CT return from your reconciled management accounts.',
    },
    {
      heading: 'VAT registration and quarterly filing',
      body: 'Once your taxable supplies exceed AED 375,000 in any 12-month period, VAT registration is mandatory. The penalty for late registration is AED 20,000. Finanshels monitors your threshold throughout the year, triggers registration at the right time, and files your quarterly VAT returns before every deadline — with every transaction already tagged to the correct treatment.',
    },
    {
      heading: 'Monthly management reports',
      body: 'A Profit and Loss statement, a Balance Sheet, and a plain-English summary from your accountant — delivered by the 10th of every month. Not a year-end package. Monthly numbers you can make decisions from.',
    },
    {
      heading: 'WPS payroll compliance',
      body: 'If you employ staff, your payroll must be run through the UAE Wages Protection System. Finanshels manages WPS-compliant payroll, EOSB gratuity calculations, and end-of-service settlements as part of the Growth and Scale plans and above.',
    },
    {
      heading: 'Audit-ready records',
      body: 'Free zone licence renewals require audited financial statements. Bank facilities require audited accounts. Investors require clean, reconciled financials. Finanshels maintains your records to audit-ready standard throughout the year — so when the request arrives, the preparation work is already done.',
    },
  ],
  valueProps: [
    'Your chart of accounts and VAT treatment rules are configured for your specific business type and sector — not a generic template.',
    'Books closed by the 10th of every month, with a plain-English summary from a dedicated qualified accountant.',
    'VAT treatment tagged on every transaction throughout the quarter — so the return is built from clean data, not reconstructed at the deadline.',
    'Audit-ready records maintained year-round for free zone renewals, bank facilities, and investor due diligence.',
    'One team for bookkeeping, VAT, Corporate Tax, and payroll — on one fixed monthly fee.',
  ],
  workflow: [
    'Day 1 — Onboarding call: we review your current books, confirm your entity structure, and identify what is needed to set your accounting up correctly. If cleanup is required, we scope and price it clearly before starting.',
    'Days 2–5 — Setup: your chart of accounts is configured for your business type, VAT treatment rules are set up, accounting software is connected (Zoho Books, QuickBooks, Wafeq, or Xero), and your compliance calendar is built.',
    'Days 6–28 — First month of bookkeeping: transactions recorded and categorised, bank statements reconciled, VAT tagged on every transaction, and supporting documents collected and stored.',
    'Day 30 — First month-end close: books closed; your first P&L, Balance Sheet, and cash summary delivered with a plain-English explanation. This becomes your monthly rhythm.',
    'Ongoing — every quarter and every year: VAT returns filed quarterly, annual CT return prepared and filed, payroll run monthly, and audit coordination triggered when required.',
  ],
  deliverables: [
    'Monthly Profit and Loss statement and Balance Sheet, closed by the 10th.',
    'Plain-English monthly summary from your dedicated accountant.',
    'Quarterly VAT returns filed before every FTA deadline (Growth plan and above).',
    'Annual Corporate Tax return prepared and filed within your nine-month window.',
    'Audit-ready records and a full-year compliance calendar.',
  ],
  pricingTiers: [
    {
      name: 'Essential plan',
      price: 'AED 799/month',
      bestFor: 'AED 300K–2M revenue · service businesses · up to 200 transactions per month',
      includes: [
        'Transaction recording and categorisation',
        'Bank reconciliation',
        'VAT tagging on every transaction',
        'Supporting document management',
        'Monthly Profit and Loss and Balance Sheet',
        'Plain-English monthly summary from your accountant',
        'Corporate Tax registration and annual filing',
        'Compliance calendar and audit-ready records',
        'Dedicated accountant',
        'VAT filing available as add-on — AED 500/quarter',
      ],
    },
    {
      name: 'Growth plan',
      price: 'AED 999/month',
      highlighted: true,
      bestFor: 'AED 2M–7M · VAT-registered businesses · up to 500 transactions per month',
      includes: [
        'Everything in Essential, plus:',
        'Quarterly VAT returns included',
        'AR and AP ageing reports',
        'Monthly management pack with cash flow statement',
        'WPS payroll management',
        'Quarterly review call with senior accountant',
      ],
    },
  ],
  pricingAddOns: [
    { name: 'Books Health Check (credited against cleanup or first month)', price: 'AED 299–500' },
    { name: 'Books Cleanup', price: 'from AED 1,500' },
    { name: 'CT Registration', price: 'AED 999' },
    { name: 'VAT Registration', price: 'AED 499' },
  ],
  pricingNote:
    'Available across mainland UAE (Dubai, Abu Dhabi, Sharjah, Ajman, RAK, UAQ, Fujairah) and every major free zone — DMCC, JAFZA, DIFC, ADGM, IFZA, Shams, SPC, RAKEZ, Meydan, Dubai South, and others.',
  faqs: [
    {
      question:
        'My small business makes less than AED 375,000 in profit. Do I still need to worry about Corporate Tax?',
      answer:
        'Yes — but the obligation is simpler than it sounds. Your taxable profits below AED 375,000 are taxed at 0%, meaning you owe nothing. But you still need to register for CT and file an annual return. Not doing so carries a AED 10,000 penalty, regardless of whether any tax is owed. Finanshels handles CT registration as part of onboarding and prepares and files your annual return as part of every plan.',
    },
    {
      question: 'My business revenue is under AED 3 million. Can I elect Small Business Relief?',
      answer:
        'Yes, if you meet the conditions. Small Business Relief allows eligible businesses with revenue under AED 3 million to elect zero taxable income — meaning no CT is payable for the period. The return still needs to be filed and the election documented correctly. We assess SBR eligibility for every applicable client and apply it where it reduces your CT liability.',
    },
    {
      question: 'I have missed some VAT returns. What should I do?',
      answer:
        'File them as soon as possible. The penalty for late filing starts from the date of the missed deadline and compounds monthly — AED 1,000 for a first offence, AED 2,000 for repeat offences within 24 months, plus percentage-based penalties on any unpaid VAT. Proactive late filing consistently results in lower penalties than waiting for the FTA to contact you. We handle outstanding VAT returns as part of our onboarding for new clients.',
    },
    {
      question: 'How long does it take to get started?',
      answer:
        'Most clients are set up and operating on their first monthly close within 48 hours to two weeks — depending on the current state of their books. We confirm your entity structure, connect your accounting software, build your chart of accounts for your sector, and begin recording transactions for the current month. If cleanup is required first, we scope and price it clearly before starting.',
    },
    {
      question: 'Do I need a bookkeeper if I already use Zoho Books or QuickBooks?',
      answer:
        'Yes. Accounting software records what you put into it — it does not review whether transactions are categorised correctly, whether VAT treatment is accurate, whether your bank reconciles, or whether your month-end position is reliable. Finanshels works with your existing software and provides the qualified accountant review, VAT tagging, reconciliation, and compliance ownership the software cannot provide on its own.',
    },
    {
      question: 'I am a freelancer or sole proprietor. Can Finanshels help?',
      answer:
        'Yes, if your annual turnover exceeds AED 1 million — at which point you are required to register for Corporate Tax as a natural person conducting business. Below that threshold, Finanshels can still provide bookkeeping and accounting support on a flexible basis. Get in touch and we will advise on the right level of service for your situation.',
    },
    {
      question: 'What VAT rate applies to my business?',
      answer:
        'It depends on your sector and the nature of your supplies. Most UAE service businesses charge VAT at the standard rate of 5%. Healthcare businesses providing licensed medical services typically apply the zero rate. Certain educational services, financial services, and residential property transactions are exempt. Food retail involves a mix of zero-rated basic food items and standard-rated processed foods and non-food items. Finanshels confirms the correct VAT treatment for your specific revenue categories as part of your onboarding — not as a generic assumption.',
    },
    {
      question: 'Can Finanshels handle multiple branches or locations?',
      answer:
        'Yes. For businesses operating across multiple branches — salons, clinics, gyms, supermarkets — Finanshels can produce both consolidated reporting and branch-level P&Ls. This is particularly valuable for understanding which locations are profitable and which are not. Branch-level reporting is available from the Growth plan upward.',
    },
    {
      question: 'What happens if the FTA audits my business?',
      answer:
        'Finanshels maintains your books, VAT returns, and CT filings consistently throughout the year — which means your records are already in the shape required to respond to an FTA query. If you receive an FTA audit notification, we prepare your documentation, review your filing positions, and coordinate the response through our tax advisory team. You deal with us throughout — not directly with the FTA.',
    },
    {
      question: 'Is my data safe with Finanshels?',
      answer:
        'Yes. All financial data is stored in your accounting software account — Zoho Books, QuickBooks, Wafeq, or Xero — which you own and control. Finanshels operates with accountant-level access, which means we can record and review transactions but cannot transfer funds or change ownership of the account. Your data is never shared with third parties without your explicit consent.',
    },
  ],
}
