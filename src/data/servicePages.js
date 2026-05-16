export const SERVICE_PAGES = {
  'corporate-tax-filing': {
    title: 'Corporate Tax Filing',
    subtitle: 'File corporate tax across the UAE with zero surprises',
    description:
      'From registration to computation, reliefs, and portal submissions, Finanshels teams manage the entire corporate tax lifecycle for high-growth companies.',
    stats: [
      { label: 'Entities filed', value: '800+' },
      { label: 'Penalties avoided', value: 'AED 6M+' },
      { label: 'Average turnaround', value: '10 days' }
    ],
    valueProps: [
      'Data gathering and audit-ready workpapers from ERPs, banks, and spend tools.',
      'Advisory on reliefs, exemptions, losses, and transfer pricing exposure.',
      'Full filing ownership inside FTA portals with reminders for payments.'
    ],
    workflow: [
      'CT readiness sprint: diagnostic, data room, and risk heatmap.',
      'Quarterly/annual computation with scenario planning for management.',
      'Submission + payment tracking with CFO briefings and board memos.'
    ],
    caseStudy: {
      logo: 'YAP',
      headline: 'Scaled from 1 to 11 entities without missing a single CT deadline',
      result: 'Finanshels automated data extraction from PSPs and ERPs, enabling faster reconciliations and eliminating penalties.'
    }
  },
  bookkeeping: {
    title: 'Bookkeeping',
    subtitle: 'Realtime books for operators who need clarity every week',
    description:
      'Dedicated controllers close books, reconcile banks/PSPs, and deliver board-grade packs so you never enter a fundraising meeting blind.',
    stats: [
      { label: 'Avg. close time', value: '5 days' },
      { label: 'Accounts automated', value: '150+' },
      { label: 'Dashboards shipped', value: '60+' }
    ],
    valueProps: [
      'Automated ingestion from banks, PSPs, ERPs, CRMs, and spend platforms.',
      'Variance analysis with commentary, burn, runway, and cohort views.',
      'Board-ready exports tailored to SaaS, fintech, retail, and marketplaces.'
    ],
    workflow: [
      'Digitize: Clean historical ledgers and standardize chart of accounts.',
      'Operate: Weekly reconciliations, accrual adjustments, and AR/AP ownership.',
      'Report: Monthly packs, KPI snapshots, investor dashboards, and audit prep.'
    ],
    caseStudy: {
      logo: 'Sarwa',
      headline: 'Reduced month-end from 20 days to 4 days',
      result: 'Multi-entity consolidation with PSP feeds allowed the leadership team to run weekly profitability reviews.'
    }
  },
  'tax-consultancy': {
    title: 'Tax Consultancy',
    subtitle: 'Strategic tax partners for scaling startups and corporate groups',
    description:
      'We advise on structuring, transfer pricing, double-tax treaties, and regulatory changes while coordinating with auditors and legal teams.',
    stats: [
      { label: 'Advisory projects', value: '200+' },
      { label: 'Jurisdictions covered', value: '9' }
    ],
    valueProps: [
      'Entity structuring guidance for M&A, fundraising, or geographic expansion.',
      'Transfer pricing documentation and benchmarking for intra-group transactions.',
      'Regulatory watchtower for UAE, KSA, Qatar, Oman, Bahrain, and India.'
    ],
    workflow: [
      'Scope: workshops with founders, CFOs, and legal counsel.',
      'Model: scenario planning and policy design reviewed by our tax bench.',
      'Deliver: memos, filings, and coordination with authorities/auditors.'
    ],
    caseStudy: {
      logo: 'Baraka',
      headline: 'Structured expansion into Saudi with full TP documentation',
      result: 'Avoided double taxation while keeping investors and regulators aligned.'
    }
  },
  'fractional-cfo': {
    title: 'Fractional CFO',
    subtitle: 'Senior finance leadership without hiring full-time',
    description:
      'Partner with CFOs who have navigated fundraising, pricing shifts, and multi-market expansion. They operate as an extension of your exec team.',
    stats: [
      { label: 'CFO bench', value: '12' },
      { label: 'Capital raised with our support', value: '$600M+' }
    ],
    valueProps: [
      'Investor storytelling, fundraise prep, and diligence rooms.',
      'Pricing and margin experiments with ops + GTM leaders.',
      'Scenario planning, runway extensions, and board meeting facilitation.'
    ],
    workflow: [
      'Onboard: align on KPIs, cadence, and stakeholder map.',
      'Operate: weekly exec reviews, forecasting, and resource allocation.',
      'Scale: support hiring, banking relationships, and exit prep.'
    ],
    caseStudy: {
      logo: 'Letswork',
      headline: 'Raised follow-on capital with revamped operating model',
      result: 'Fractional CFO introduced new pricing, cut burn by 22%, and led board reporting.'
    }
  },
  'compliance-services': {
    title: 'Compliance Services',
    subtitle: 'AML, data room hygiene, and governance handled for you',
    description:
      'Teams maintain registers, filings, policies, and evidence so audits are straightforward and founders sleep better.',
    stats: [
      { label: 'Compliance rituals automated', value: '500+' },
      { label: 'Average SLA', value: '24 hrs' }
    ],
    valueProps: [
      'AML/CFT policy creation, training, and ongoing monitoring.',
      'Audit-ready evidence files, registers, and review trails.',
      'Board + shareholder governance packs with version control and approvals.'
    ],
    workflow: [
      'Audit existing controls and produce a remediation roadmap.',
      'Implement trackers across Zoho, Notion, Jira, or custom control towers.',
      'Monthly compliance reviews with founders and legal counsel.'
    ],
    caseStudy: {
      logo: 'Hub71 Cohort',
      headline: 'Zero penalties across 18 portfolio companies',
      result: 'Regulators documented Finanshels process as best practice for AML and audit readiness.'
    }
  },
  'vat-registration': {
    title: 'VAT Registration',
    subtitle: 'Register once, stay compliant forever',
    description:
      'Eligibility checks, document prep, portal submissions, and follow-ups managed end-to-end by VAT specialists.',
    stats: [
      { label: 'Registrations completed', value: '650+' },
      { label: 'Rejected filings', value: '0' }
    ],
    valueProps: [
      'Eligibility assessment + voluntary vs. mandatory scenarios.',
      'Compilation of financials, legal docs, tenancy contracts, and approvals.',
      'Liaison with authorities plus reminders for first return + payments.'
    ],
    workflow: [
      'Gather documentation and gap-checkwith our compliance checklist.',
      'Submit application, respond to queries, and secure TRN.',
      'Transition into monthly/quarterly VAT filing team.'
    ],
    caseStudy: {
      logo: 'Retail Collective',
      headline: 'Registered 9 outlets with unified VAT workflows',
      result: 'Centralized returns prevented mismatches across emirates.'
    }
  },
  'corporate-tax-registration': {
    title: 'Corporate Tax Registration',
    subtitle: 'Register every entity before the fines hit',
    description:
      'We coordinate shareholder documents, legal entity structures, and FTA portal submissions.',
    stats: [
      { label: 'Entities registered', value: '900+' }],
    valueProps: [
      'Entity mapping and beneficial ownership review.',
      'Document gathering plus translation/notarization support.',
      'Portal submission + follow-up, including branches and freezone setups.'
    ],
    workflow: [
      'Kickoff with legal, finance, and operations for each entity.',
      'Compile documents, create accounts, and file registration.',
      'Handover checklist for ongoing CT compliance.'
    ],
    caseStudy: {
      logo: 'Global Holding',
      headline: 'Registered 14 subsidiaries in three weeks',
      result: 'Avoided AED 50k+ in penalties by hitting every deadline early.'
    }
  },
  'liquidation-services': {
    title: 'Liquidation Services',
    subtitle: 'Stress-free company closure with every detail handled',
    description:
      'Whether it’s a pivot or consolidation, we manage final accounts, regulatory clearances, and stakeholder communication.',
    stats: [
      { label: 'Liquidations executed', value: '80+' }
    ],
    valueProps: [
      'Closing financial statements, audit coordination, and bank closures.',
      'Final-employee settlement reconciliations and creditor notices.',
      'Regulatory filings, clearance certificates, and final deregistration.'
    ],
    workflow: [
      'Plan timeline and stakeholder map.',
      'Execute filings + clearances.',
      'Archive data rooms and transfer IP/assets as required.'
    ],
    caseStudy: {
      logo: 'Stealth SaaS',
      headline: 'Closed UAE entity remotely in 45 days',
      result: 'Founders focused on relaunch while we handled authorities and employees.'
    }
  },
  'hire-an-expert': {
    title: 'Hire an Expert',
    subtitle: 'Deploy controllers, CFOs, or audit specialists in days',
    description:
      'Our bench plugs into your org chart full-time or part-time, backed by Finanshels IP and tooling.',
    stats: [
      { label: 'Experts deployed', value: '60+' },
      { label: 'Average onboarding', value: '72 hrs' }
    ],
    valueProps: [
      'Pre-vetted finance talent with sector specialisation.',
      'Shadow support from Finanshels teams and bench leads.',
      'Flexible engagements: interim, fractional, or temp-to-perm.'
    ],
    workflow: [
      'Define role outcomes + KPIs.',
      'Match with the right expert and run joint onboarding.',
      'Review impact every 30 days with our talent partners.'
    ],
    caseStudy: {
      logo: 'VC-backed Fintech',
      headline: 'Interim CFO closed Series B diligence',
      result: 'Expert led data room, board comms, and bank relationships for six months.'
    }
  },
  'vat-filing': {
    title: 'VAT Filing',
    subtitle: 'Monthly and quarterly VAT filings delivered without follow-ups',
    description:
      'We reconcile every invoice, collect evidence, and submit returns on time while ensuring payment reminders hit your finance stack.',
    stats: [
      { label: 'Returns filed', value: '7,500+' },
      { label: 'Adjustments caught', value: 'AED 12M' }
    ],
    valueProps: [
      'Source-level reconciliation from POS, ERP, and PSP data.',
      'Documentation storage for audits and refund claims.',
      'Proactive alerts for anomalies, exemptions, and reverse-charge.'
    ],
    workflow: [
      'Collect data + automate feeds.',
      'Review + reconcile + prep return.',
      'Submit + track payment + provide management summary.'
    ],
    caseStudy: {
      logo: 'Ecom Chain',
      headline: 'Recovered AED 200k via input VAT audits',
      result: 'Clean evidence files accelerated refunds and improved cash flow.'
    }
  },
  restaurants: {
    title: 'Restaurants & F&B',
    subtitle: 'Financial command center for restaurant groups and cloud kitchens',
    description:
      'Track outlet profitability, supplier payments, and franchise royalties while staying compliant with VAT and labour laws.',
    stats: [
      { label: 'Locations supported', value: '320+' },
      { label: 'Inventory variances reduced', value: '18%' }
    ],
    valueProps: [
      'POS + delivery aggregator integrations for realtime sales.',
      'Ingredient costing, wastage tracking, and vendor payments.',
      'Outlet-level audit prep and AML hygiene for franchise networks.'
    ],
    workflow: [
      'Setup: integrate POS, aggregators, and inventory tools.',
      'Operate: weekly P&L per outlet + supplier scorecards.',
      'Grow: franchise reporting, royalty statements, and expansion modeling.'
    ],
    caseStudy: {
      logo: 'Kitch',
      headline: 'Expanded to 4 countries with consistent margins',
      result: 'Unified cost tracking and supplier controls saved AED 1.2M annually.'
    }
  },
  startups: {
    title: 'Startups & Scale-ups',
    subtitle: 'Designed for venture-backed founders sprinting towards the next round',
    description:
      'Teams plug into product, GTM, and talent teams to run burn, runway, metrics, and compliance without slowing you down.',
    stats: [
      { label: 'Founders served', value: '900+' }],
    valueProps: [
      'SaaS metrics, cohort analyses, and growth dashboards.',
      'Fundraising prep, data rooms, and investor updates.',
      'Compliance layer for CT, VAT, AML, and audit prep.'
    ],
    workflow: [
      'Diagnose tool stack + KPIs.',
      'Operate teams with weekly rituals + Slack/WhatsApp support.',
      'Scale into new markets with local compliance teams.'
    ],
    caseStudy: {
      logo: 'Baraka',
      headline: 'Board loved the new finance control room',
      result: 'Raised subsequent rounds with predictable reporting cadence.'
    }
  },
  ecommerce: {
    title: 'eCommerce & Retail',
    subtitle: 'Inventory, PSPs, and marketplace reconciliations in one place',
    description:
      'Get SKU-level visibility, sell-through rates, and tax-ready evidence without spreadsheets.',
    stats: [
      { label: 'SKUs reconciled', value: '50k+' }],
    valueProps: [
      'Marketplace + PSP integrations (Amazon, Noon, Deliveroo, Talabat, etc.).',
      'Landed cost, promotions, and margin dashboards per channel.',
      'Reverse-charge VAT, cross-border compliance, and cash cycle tracking.'
    ],
    workflow: [
      'Connect stores, PSPs, ERP, and 3PL feeds.',
      'Operate: daily reconciliations + AR/AP + claims management.',
      'Scale: multi-country filings and treasury support.'
    ],
    caseStudy: {
      logo: 'DesertCart',
      headline: 'Recovered AED 450k in marketplace deductions',
      result: 'Automated reconciliation flagged disputes within 24 hours.'
    }
  },
  smes: {
    title: 'SMEs & Family Businesses',
    subtitle: 'Enterprise-grade finance for ambitious SMBs',
    description:
      'We become your finance department—bookkeeping, compliance, and CFO strategy under one subscription.',
    stats: [
      { label: 'SMBs onboarded', value: '6000+' }],
    valueProps: [
      'Affordable teams customisable to your industry.',
      'Policy design, approvals, and internal controls from day one.',
      'On-call finance partner for banks, auditors, and regulators.'
    ],
    workflow: [
      'Understand: goals, cash position, and current tools.',
      'Build: custom team with controllers, tax, audit, and CFO leads.',
      'Operate: monthly reviews, compliance calendar, and growth projects.'
    ],
    caseStudy: {
      logo: 'SME Collective',
      headline: 'Transformed finance in 60 days',
      result: 'Owners finally had clarity on margins, cash, and compliance risk.'
    }
  }
}
