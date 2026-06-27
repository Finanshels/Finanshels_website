import type { ServicePage } from '../service-pages'

// Fresh copy — no source deck exists for this sector. UAE / DIFC / ADGM fund
// accounting detail (capital accounts, NAV, carry, QIF CT exemption) is written to
// be accurate and conservative; no client testimonials are claimed.
export const vcFund: ServicePage = {
  title: 'VC Fund Accounting',
  subtitle:
    'Venture capital fund accounting in the UAE — LP-ready capital accounts, defensible NAV, and clean carry.',
  description:
    'A venture fund is judged on the integrity of its numbers — by LPs reading their capital account statements, by auditors testing your portfolio valuations, and by the regulator reviewing your reporting. Finanshels provides fund accounting for UAE, DIFC, and ADGM venture managers: capital calls and distributions tracked to the LP, NAV built on defensible fair-value methodology, management fee and carried interest calculated correctly, and the GP and management company kept cleanly separate from the fund.',
  stats: [
    { label: 'UAE businesses', value: '7,000+' },
    { label: 'Trustpilot rating', value: '4.9' },
    { label: 'Fund-grade', value: 'IFRS' },
  ],
  problems: [
    'LP capital account statements are assembled by hand in spreadsheets, so every capital call, distribution, and fee allocation is a chance for an error your investors will catch.',
    'Portfolio companies are illiquid and hard to value, yet NAV and your performance metrics depend entirely on a fair-value methodology that has to survive audit.',
    'Management fee, carried interest, and the GP/LP waterfall are modelled informally — until a distribution event forces the question of who is owed exactly what.',
  ],
  whyNow: [
    'DIFC and ADGM funds operate under regulatory and audit regimes that expect fund-grade accounting and timely LP reporting from inception.',
    'UAE Corporate Tax introduced a Qualifying Investment Fund exemption with conditions that must be assessed and maintained — the structure’s tax position is no longer an afterthought.',
    'Institutional LPs increasingly diligence back-office quality before committing, and clean, independent fund accounting is part of being fundable.',
  ],
  whoFor: [
    {
      segment: 'First-time / emerging VC manager',
      description:
        'You are raising or have just closed your first fund and need institutional-grade fund accounting without building a finance team yet. You need capital accounts, NAV, and LP reporting that stand up to investor and auditor scrutiny from day one.',
    },
    {
      segment: 'Established multi-fund manager',
      description:
        'You run multiple funds and SPVs across vintages and need consistent accounting, allocations, and reporting across all of them — plus a clean separation between each fund, the GP entities, and the management company.',
    },
    {
      segment: 'DIFC or ADGM domiciled fund',
      description:
        'Your fund is domiciled in DIFC or ADGM and subject to its regulatory and audit framework. You need accounting aligned to the regime, coordination with your fund administrator and auditor, and reporting that meets both LP and regulatory expectations.',
    },
    {
      segment: 'GP management company',
      description:
        'You need the management company’s own books — management fee income, operating costs, payroll, and Corporate Tax — kept properly distinct from the fund itself, with carried interest tracked through to the individuals entitled to it.',
    },
    {
      segment: 'SPV / syndicate and angel structure',
      description:
        'You run deal-by-deal SPVs or a syndicate and need per-vehicle accounting, investor-level capital tracking, and clean reporting for each deal without standing up full fund infrastructure for every one.',
    },
  ],
  challengesEyebrow: 'Why fund accounting is different',
  challengesHeading: 'What VC fund accounting has to get right',
  challenges: [
    {
      heading: 'LP capital accounts, calls, and distributions',
      body: 'The core of fund accounting is an accurate capital account for every limited partner: committed capital, capital called, capital invested, distributions, and current value, all reconciling to the fund as a whole. Finanshels maintains these to LP-statement standard so each investor’s position is right at every reporting date — and so a capital call or distribution is a routine event, not a fire drill.',
      points: [
        'Committed, called, invested, and remaining (dry powder) capital tracked per LP',
        'Capital calls and distributions allocated correctly across the LP base',
        'Distribution waterfall applied — return of capital, preferred return, and carry',
        'Capital account statements reconciled to fund-level NAV at each date',
      ],
    },
    {
      heading: 'Portfolio valuation and NAV',
      body: 'A venture fund’s NAV depends on valuing illiquid, early-stage holdings — the hardest judgement in fund accounting. Finanshels builds NAV on a documented fair-value methodology consistent with IFRS / international fair-value standards, so your valuations are defensible to your auditor and credible to your LPs, and your performance metrics rest on solid ground.',
      points: [
        'Fair-value methodology documented and applied consistently across holdings',
        'Valuations supported for audit (recent rounds, marks, impairments)',
        'NAV produced at each reporting date with full supporting workpapers',
        'Performance metrics — IRR, MOIC, TVPI, and DPI — derived from the NAV',
      ],
    },
    {
      heading: 'Management fee and carried interest',
      body: 'Management fee and carry are where fund economics get intricate: fees may step down post-investment-period, and carry depends on hurdles, the waterfall, and clawback provisions. Finanshels calculates both in line with your LPA, tracks carry as it accrues, and keeps the management company’s fee income distinct from the fund’s own accounts.',
      points: [
        'Management fee calculated on the correct base and stepped down per the LPA',
        'Carried interest accrued against hurdle and waterfall terms',
        'GP commitment and clawback provisions tracked',
        'Fee income recognised in the management company, not the fund',
      ],
    },
    {
      heading: 'Multi-entity structure and Corporate Tax',
      body: 'A fund is rarely one entity — there is the fund, one or more GP entities, the management company, and often SPVs. Each needs clean books, correct intercompany treatment, and the right tax position. Finanshels keeps the structure cleanly separated and assesses the UAE Qualifying Investment Fund exemption and the management company’s Corporate Tax position.',
      points: [
        'Fund, GP, management company, and SPVs accounted for as distinct entities',
        'Intercompany flows (capital, fees, expenses) treated correctly',
        'UAE Qualifying Investment Fund (QIF) Corporate Tax exemption assessed and maintained',
        'Management company Corporate Tax registration and filing handled',
      ],
    },
  ],
  valueProps: [
    'LP-ready capital accounts — committed, called, invested, and distributed tracked per investor and reconciled to the fund.',
    'Defensible NAV — fair-value methodology documented and audit-ready, with IRR, MOIC, TVPI, and DPI derived from it.',
    'Carry and fees done right — management fee and carried interest calculated to your LPA, with the GP kept separate from the fund.',
    'Clean multi-entity structure — fund, GP, management company, and SPVs each with proper books and intercompany treatment.',
    'Tax handled at structure level — QIF exemption assessed for the fund and Corporate Tax managed for the management company.',
    'Built for diligence — independent, institutional-grade back office that LPs expect to see before they commit.',
  ],
  solutions: [
    'Fund accounting and LP capital accounts — capital calls, distributions, and allocations maintained to LP-statement standard.',
    'NAV and portfolio valuation support — documented fair-value methodology, supporting workpapers, and audit coordination.',
    'Management fee and carried-interest calculation — fees and carry computed to the LPA, with accrual tracking and clawback.',
    'LP and regulatory reporting — capital account statements, quarterly reporting packs, and performance metrics (IRR, MOIC, TVPI, DPI).',
    'Multi-entity accounting — fund, GP, management company, and SPVs with correct intercompany treatment.',
    'Corporate Tax and QIF assessment — fund exemption assessment plus management company CT registration and filing.',
  ],
  workflow: [
    'Day 1 — Fund onboarding: we review your LPA, structure (fund, GP, management company, SPVs), domicile (DIFC, ADGM, or other), fee and carry terms, and reporting calendar, and confirm the QIF and CT position.',
    'Days 2–5 — Structure and chart of accounts setup: each entity is set up with its own books, capital accounts are opened per LP, your fee and waterfall terms are configured, and your fair-value approach is agreed.',
    'Days 6–28 — First period of fund bookkeeping: capital calls and drawdowns recorded, investments booked, expenses allocated between fund and management company, and management fee recognised correctly.',
    'Period-end — NAV and LP reporting: NAV produced with supporting valuations, LP capital account statements prepared, and a reporting pack with IRR, MOIC, TVPI, and DPI delivered.',
    'Ongoing — quarterly reporting, annual audit, CT: LP reporting on your cycle, audit coordinated with your administrator and auditor, QIF position maintained, and management company CT filed. One team, one fixed fee.',
  ],
  deliverables: [
    'LP capital account statements reconciled to fund NAV.',
    'NAV with documented fair-value workpapers.',
    'Performance metrics — IRR, MOIC, TVPI, and DPI.',
    'Management fee and carried-interest schedules.',
    'Management company accounts and Corporate Tax readiness.',
  ],
  pricingTiers: [
    {
      name: 'Emerging fund',
      price: 'On assessment',
      bestFor: 'First-time managers and single-fund SPVs',
      includes: [
        'Fund bookkeeping and LP capital accounts',
        'Quarterly NAV and LP capital account statements',
        'Management fee calculation and GP/fund separation',
        'Management company Corporate Tax registration and filing',
        'QIF Corporate Tax exemption assessment',
        'Dedicated fund accountant',
      ],
    },
    {
      name: 'Multi-fund manager',
      price: 'On assessment',
      highlighted: true,
      bestFor: 'Managers running multiple funds, vintages, and SPVs',
      includes: [
        'Everything in Emerging fund, plus:',
        'Multi-entity accounting across funds, GP, and SPVs',
        'Carried-interest accrual against hurdle and waterfall',
        'Performance metrics (IRR, MOIC, TVPI, DPI) per fund',
        'Audit coordination with fund administrator and auditor',
        'Consolidated management-company reporting',
      ],
    },
    {
      name: 'Institutional',
      price: 'On assessment',
      bestFor: 'DIFC / ADGM funds with regulatory and institutional LP reporting',
      includes: [
        'Everything in Multi-fund manager, plus:',
        'Regulator-aligned reporting (DIFC / ADGM)',
        'Senior fund-controller oversight',
        'Fair-value valuation support and documentation',
        'Bespoke LP reporting packs',
      ],
    },
  ],
  pricingNote:
    'Fund accounting is scoped per structure — fund count, entities, LP base, and reporting cadence determine the fee. Book a consultation for a precise quote.',
  faqs: [
    {
      question: 'What does fund accounting cover that normal company accounting does not?',
      answer:
        'Company accounting produces a P&L and balance sheet for an operating business. Fund accounting tracks investor capital and fund performance: a capital account for each limited partner (committed, called, invested, and distributed capital), the fund’s net asset value based on the fair value of its holdings, the distribution waterfall, and performance metrics such as IRR, MOIC, TVPI, and DPI. It also keeps the fund, the GP, and the management company as distinct entities. We provide this fund-grade layer alongside the standard accounting your management company still needs.',
    },
    {
      question: 'How do you value illiquid portfolio companies for NAV?',
      answer:
        'Early-stage portfolio companies have no market price, so NAV depends on a fair-value methodology applied consistently and documented for audit. In practice this draws on indicators such as the most recent priced funding round, observable transactions, and impairment where a company has deteriorated — applied in line with IFRS / international fair-value standards. We build NAV on a documented methodology with supporting workpapers so your valuations are defensible to your auditor and credible to your LPs, and so the performance metrics derived from NAV rest on solid ground.',
    },
    {
      question: 'Can you calculate management fee and carried interest?',
      answer:
        'Yes. We calculate the management fee on the correct base as defined in your LPA — including step-downs after the investment period where they apply — and accrue carried interest against your hurdle rate and distribution waterfall, tracking GP commitment and any clawback provisions. Crucially, we recognise fee income in the management company rather than the fund and keep carry tracked through to the individuals entitled to it, so the economics are correct and the entities stay properly separated.',
    },
    {
      question: 'Are UAE investment funds exempt from Corporate Tax?',
      answer:
        'A fund that meets the conditions for a Qualifying Investment Fund (QIF) can be exempt from UAE Corporate Tax, but the exemption is conditional and must be assessed and maintained — it is not automatic. The management company that earns the management fee is generally a taxable entity in its own right. We assess the QIF position for the fund at onboarding, maintain the conditions, and handle Corporate Tax registration and filing for the management company, so the whole structure’s tax position is managed deliberately rather than assumed.',
    },
    {
      question: 'Do you work with DIFC and ADGM domiciled funds?',
      answer:
        'Yes. Funds domiciled in DIFC or ADGM operate under those regimes’ regulatory and audit frameworks, which expect fund-grade accounting and timely LP reporting. We align your accounting to the applicable regime, coordinate with your fund administrator and auditor, and produce reporting that meets both LP and regulatory expectations. We also work with funds domiciled elsewhere whose managers or activities are in the UAE.',
    },
    {
      question: 'We are a first-time fund. Do we need a full finance team?',
      answer:
        'Not at the start. Most emerging managers do not have the volume to justify a full in-house finance team for the first fund, but they absolutely need institutional-grade fund accounting — because LPs and auditors will scrutinise it regardless of fund size. We give first-time managers exactly that: capital accounts, NAV, LP reporting, and a properly separated management company, delivered by a dedicated fund accountant, so your back office looks institutional from day one without the headcount.',
    },
    {
      question: 'How is the management company accounted for separately from the fund?',
      answer:
        'The fund holds investor capital and makes investments; the management company runs the firm, earns the management fee, pays the team, and bears operating costs. Mixing the two is a serious error that distorts both LP reporting and tax. We keep separate books for the fund, the GP, the management company, and any SPVs, treat the intercompany flows (capital, fees, expenses) correctly, and ensure fee income lands in the management company while the fund’s accounts reflect only fund activity.',
    },
  ],
}
