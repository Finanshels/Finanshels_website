import {
  CalendarClock,
  PlayCircle,
  Activity,
  BarChart3,
  Sparkles,
  Calculator
} from 'lucide-react'

const PRODUCT_DATA = [
  {
    slug: 'corporate-tax-deadline-checker',
    name: 'Corporate Tax Deadline Checker',
    category: 'Taxes',
    accent: '#f16610',
    summary: 'Check your deadline & penalties.',
    subtitle: 'Never miss another UAE corporate tax deadline.',
    description:
      'Centralise every trade licence, FTA login, and tax payment reminder inside one console. The deadline checker maps Federal Tax Authority calendars, treaty nuances, and penalty rules for every emirate so your finance stack stays compliant without the chaos.',
    stats: [
      { label: 'Entities monitored', value: '450+' },
      { label: 'FTA reminders sent', value: '12k+' },
      { label: 'Penalty risk removed', value: 'AED 2.5M' }
    ],
    features: [
      { title: 'Entity vault', description: 'Sync trade licence, tax registration numbers, and financial year preferences in seconds.' },
      { title: 'Penalty simulator', description: 'Model late filing and underpayment penalties instantly to get leadership buy-in.' },
      { title: 'Smart reminders', description: 'Automated WhatsApp + email nudges aligned to your month end rituals.' },
      { title: 'Board-ready log', description: 'Audit trail with timestamps, owners, and supporting files for regulators.' }
    ],
    workflow: [
      'Import entity register or connect to Finanshels bookkeeping.',
      'Select the taxation profiles that apply across the UAE or KSA.',
      'Assign owners and escalation paths for every deadline.',
      'Send automated digests to finance, legal, and founders.'
    ],
    outputs: [
      'Single dashboard with all FTA deadlines mapped.',
      'Penalty exposure report for each entity or group structure.',
      'Downloadable compliance pack for auditors and investors.'
    ],
    spotlight: {
      title: 'When finance leads turn to the checker',
      bullets: [
        'Board asks for clear accountability on tax filings.',
        'Multiple licences filed across zones with different year ends.',
        'Need to forecast penalty exposure before acquisitions.'
      ]
    },
    support: {
      title: 'Pair it with',
      bullets: [
        'Corporate tax filing managed service',
        'Finanshels compliance desk for AML & audit prep',
        'Monthly bookkeeping close rituals'
      ]
    },
    cta: {
      primaryLabel: 'Book a product tour',
      primaryHref: 'mailto:contact@finanshels.com?subject=Corporate%20Tax%20Deadline%20Checker',
      secondaryLabel: 'Talk to a tax specialist',
      secondaryHref: 'https://wa.me/971521549572?text=Hi%20Team%20Finanshels%2C%20show%20me%20the%20Tax%20Deadline%20Checker.'
    },
    icon: CalendarClock
  },
  {
    slug: 'hala',
    name: 'Hala',
    category: 'Taxes',
    accent: '#f16610',
    summary: 'Real-time financial insights at a glance.',
    subtitle: 'Finance copilots for operators on the move.',
    description:
      'Hala streams reconciled books, cash runway, and compliance alerts into a single conversational interface. It plugs into your Finanshels controller workflows so founders always see the same truth as the finance desk.',
    stats: [
      { label: 'Live dashboards', value: '18+' },
      { label: 'Integrations', value: '12' },
      { label: 'Response time', value: '<2 min' }
    ],
    features: [
      { title: 'Chat-first console', description: 'Ask “What is my VAT payable this month?” and get the reconciled answer instantly.' },
      { title: 'Playbooks built-in', description: 'Every reply links to the underlying close process for full context.' },
      { title: 'Executive summaries', description: 'Weekly digests showing KPI movement, risks, and owner notes.' }
    ],
    workflow: [
      'Connect your Finanshels bookkeeping workspace.',
      'Map KPI dashboards to departments or boards.',
      'Invite founders, investors, or business heads with role-based access.',
      'Trigger on-demand explainers before leadership meetings.'
    ],
    outputs: [
      'Conversational answers to cash, VAT, and P&L questions.',
      'Weekly WhatsApp digest for founders.',
      'Links back to reports, source entries, or support tickets.'
    ],
    spotlight: {
      title: 'Teams rely on Hala to',
      bullets: [
        'Skip sending screenshots from accounting software.',
        'Bring finance to every stand-up without extra headcount.',
        'Keep leadership aligned on compliance risks.'
      ]
    },
    support: {
      title: 'Works best with',
      bullets: [
        'Finanshels managed bookkeeping',
        'Tax monitoring + deadline checker',
        'Custom dashboards for board reporting'
      ]
    },
    cta: {
      primaryLabel: 'Try Hala with my books',
      primaryHref: 'mailto:contact@finanshels.com?subject=Hala%20Product',
      secondaryLabel: 'Get a live walkthrough',
      secondaryHref: 'https://wa.me/971521549572?text=I%20want%20a%20demo%20of%20Hala.'
    },
    icon: PlayCircle
  },
  {
    slug: 'financial-health-checker',
    name: 'Financial Health Checker',
    category: 'Financials',
    accent: '#f16610',
    summary: 'Deep dives, zero fluff—finance decoded.',
    subtitle: 'Operator-grade diagnostics for your finance stack.',
    description:
      'In two weeks Finanshels maps your books, tax positions, controls, and data hygiene. You get a prioritized action plan with quantified risk, automation opportunities, and immediate wins.',
    stats: [
      { label: 'Diagnostics delivered', value: '320+' },
      { label: 'Average time to insights', value: '14 days' },
      { label: 'Control gaps closed', value: '73%' }
    ],
    features: [
      { title: 'Ledger deep-dive', description: 'GL sampling, reconciliations review, and policy benchmarking.' },
      { title: 'Control maturity map', description: 'AML, tax, audit, and finance operations scored from 1-5.' },
      { title: 'Roadmap to action', description: 'Prioritized backlog with effort, owners, and sequence.' }
    ],
    workflow: [
      'Kick-off with your controller and leadership team.',
      'Data room & tooling access review within 48 hours.',
      'Finanshels analysts run diagnostics alongside your team.',
      'Debrief with leadership and hand over action plan.'
    ],
    outputs: [
      'Health report PDF and interactive board deck.',
      'Maturity score for every finance capability.',
      'Implementation roadmap with timelines and staffing.'
    ],
    spotlight: {
      title: 'Best for companies who',
      bullets: [
        'Are preparing for funding or due diligence.',
        'Need a neutral take on internal finance maturity.',
        'Want to scope Finanshels services with confidence.'
      ]
    },
    support: {
      title: 'Next steps most teams take',
      bullets: [
        'Deploy Finanshels bookkeeping squads',
        'Engage a fractional CFO to execute the roadmap',
        'Automate tax monitoring with our tools'
      ]
    },
    cta: {
      primaryLabel: 'Book a diagnostic',
      primaryHref: 'mailto:contact@finanshels.com?subject=Financial%20Health%20Checker',
      secondaryLabel: 'Talk to an advisor',
      secondaryHref: 'https://wa.me/971521549572?text=Tell%20me%20more%20about%20the%20Financial%20Health%20Checker.'
    },
    icon: Activity
  },
  {
    slug: 'cash-flow-scorecard',
    name: 'Cash Flow Scorecard',
    category: 'Financials',
    accent: '#f16610',
    summary: 'Live and on-demand cash wisdom.',
    subtitle: 'Forecasting confidence for founders and boards.',
    description:
      'The scorecard blends actuals, pipeline, and strategic scenarios into a weekly scoreboard. Operators get crystal clear runway, covenant tracking, and levers to extend burn instantly.',
    stats: [
      { label: 'Forecast accuracy', value: '97%' },
      { label: 'Scenarios managed', value: '20+' },
      { label: 'Runway visibility', value: '18 mo' }
    ],
    features: [
      { title: 'Rolling 13-week cash', description: 'Automated data sync with live PSP, bank, and payables feeds.' },
      { title: 'Play to extend runway', description: 'Preset levers to freeze hiring, reprice SKUs, or renegotiate payables.' },
      { title: 'Board-ready scorecard', description: 'Narrative plus KPIs that explain movement—not just numbers.' }
    ],
    workflow: [
      'Connect accounting, banks, PSPs, and sales pipeline.',
      'Agree on runway guardrails and reporting cadence.',
      'Finanshels FP&A leads run forecasts every week.',
      'Leaders receive action-focused commentary.'
    ],
    outputs: [
      'Rolling cash view with alerts by owner.',
      'Scenario planner shared with founders and investors.',
      'Weekly memo summarising moves, risks, and asks.'
    ],
    spotlight: {
      title: 'Why teams install the scorecard',
      bullets: [
        'Investors expect sharper cash visibility.',
        'Need to translate sales pipeline into finance-ready numbers.',
        'Multiple entities and banks make cobbling spreadsheets painful.'
      ]
    },
    support: {
      title: 'Popular add-ons',
      bullets: [
        'Fractional CFO office hours',
        'Finanshels receivables desk',
        'Collections and treasury automations'
      ]
    },
    cta: {
      primaryLabel: 'See my cash gaps',
      primaryHref: 'mailto:contact@finanshels.com?subject=Cash%20Flow%20Scorecard',
      secondaryLabel: 'Schedule a working session',
      secondaryHref: 'https://wa.me/971521549572?text=I%20want%20the%20Cash%20Flow%20Scorecard.'
    },
    icon: BarChart3
  },
  {
    slug: 'client-portal',
    name: 'Client Portal',
    category: 'Others',
    accent: '#f16610',
    summary: 'Startup finance—no spreadsheets, just stories.',
    subtitle: 'A single source of truth between your team and Finanshels.',
    description:
      'Ticket your finance questions, approve filings, and review docs—without hunting across emails. The portal keeps leadership, auditors, and Finanshels squads aligned with context-rich threads.',
    stats: [
      { label: 'Tickets resolved', value: '8k+' },
      { label: 'Average response', value: '<4 hrs' },
      { label: 'Stakeholders onboarded', value: '1.3k+' }
    ],
    features: [
      { title: 'Threaded approvals', description: 'Every compliance filing and close checklist routed to the right owner.' },
      { title: 'Document rooms', description: 'Store COIs, contracts, KPIs, and action logs with permissions.' },
      { title: 'Status pulses', description: 'See what Finanshels is working on this week and who owns each outcome.' }
    ],
    workflow: [
      'Invite your team via secure SSO.',
      'Log tasks, approvals, or blockers directly from WhatsApp or email.',
      'Finanshels triages, executes, and documents every action.',
      'Leadership reviews highlights via weekly recap.'
    ],
    outputs: [
      'Living implementation board for every finance stream.',
      'Library of artefacts for auditors and investors.',
      'Automated SLA tracking and satisfaction scores.'
    ],
    spotlight: {
      title: 'Why founders love it',
      bullets: [
        'Everything the finance team touches is documented.',
        'Approvals happen inline—no chasing screenshots.',
        'Gives investors read access without forward chains.'
      ]
    },
    support: {
      title: 'Ships with every Finanshels plan',
      bullets: [
        'Works across bookkeeping, tax, compliance, and CFO retainers.',
        'Embed your own rituals and approval matrices.',
        'Open API for HRIS, ERP, or collaboration tools.'
      ]
    },
    cta: {
      primaryLabel: 'Unlock the portal',
      primaryHref: 'mailto:contact@finanshels.com?subject=Client%20Portal',
      secondaryLabel: 'Chat with our team',
      secondaryHref: 'https://wa.me/971521549572?text=I%20want%20access%20to%20the%20client%20portal.'
    },
    icon: Sparkles
  },
  {
    slug: 'gratuity-calculator-uae',
    name: 'Gratuity Calculator for UAE',
    category: 'Others',
    accent: '#f16610',
    summary: 'Model end-of-service obligations in minutes.',
    subtitle: 'HR, finance, and founders stay aligned on payouts.',
    description:
      'The gratuity calculator benchmarks unlimited and limited contracts, employment histories, and tenure for every employee. Export the ledger to your payroll system or share with HR for instant clarity.',
    stats: [
      { label: 'Employees modelled', value: '5.6k+' },
      { label: 'Policy templates', value: '9' },
      { label: 'Forecast speed', value: '⩽30 sec' }
    ],
    features: [
      { title: 'Contract-aware math', description: 'Automatic recognition of labour law rules, overtime, and allowances.' },
      { title: 'Scenario planning', description: 'Model resignations, terminations, or policy changes instantly.' },
      { title: 'Easy export', description: 'Push ledger entries to your payroll system or download as CSV.' }
    ],
    workflow: [
      'Upload employee roster or connect to your HRIS.',
      'Map contract types, start dates, and special allowances.',
      'Choose payout scenarios or future dates.',
      'Export ledger entries or share the secure summary link.'
    ],
    outputs: [
      'Per-employee gratuity schedule.',
      'Company-level provision summary for the balance sheet.',
      'Memo explaining assumptions for HR and leadership.'
    ],
    spotlight: {
      title: 'Who uses the calculator',
      bullets: [
        'People teams planning restructures.',
        'Finance teams booking provisions during audit.',
        'Founders offering retention bonuses tied to tenure.'
      ]
    },
    support: {
      title: 'Add-ons that level it up',
      bullets: [
        'Audit-ready provision schedules for year-end close',
        'AML & compliance review for HR policies',
        'CFO advisory on workforce cost planning'
      ]
    },
    cta: {
      primaryLabel: 'Access the calculator',
      primaryHref: 'mailto:contact@finanshels.com?subject=Gratuity%20Calculator',
      secondaryLabel: 'Speak with HR finance',
      secondaryHref: 'https://wa.me/971521549572?text=Gratuity%20calculator%20demo%20please.'
    },
    icon: Calculator
  }
]

export const PRODUCT_PAGES = PRODUCT_DATA.reduce((acc, product) => {
  acc[product.slug] = product
  return acc
}, {})

export const PRODUCT_CATEGORIES = [
  {
    title: 'Taxes',
    items: PRODUCT_DATA.filter((product) => product.category === 'Taxes').map((product) => ({
      name: product.name,
      description: product.summary,
      slug: product.slug,
      icon: product.icon
    }))
  },
  {
    title: 'Financials',
    items: PRODUCT_DATA.filter((product) => product.category === 'Financials').map((product) => ({
      name: product.name,
      description: product.summary,
      slug: product.slug,
      icon: product.icon
    }))
  },
  {
    title: 'Others',
    items: PRODUCT_DATA.filter((product) => product.category === 'Others').map((product) => ({
      name: product.name,
      description: product.summary,
      slug: product.slug,
      icon: product.icon
    }))
  }
]

