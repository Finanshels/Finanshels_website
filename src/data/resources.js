export const RESOURCE_PAGES = {
  tools: {
    slug: 'tools',
    heroTag: 'tools',
    heroTitle: 'Bite-sized finance tools built by operators',
    heroDescription:
      'Benchmark burn, calculate corporate tax, automate VAT, and run payroll scenarios with utilities crafted by the Finanshels team.',
    heroCTA: { label: 'Try the tools', href: 'https://www.finanshels.com/corporate-tax-filing-portal-by-finanshels-in-the-uae' },
    highlights: [
      { value: '12+', label: 'interactive calculators' },
      { value: '5 mins', label: 'average setup' },
      { value: 'Free', label: 'for founders + operators' }
    ],
    sections: [
      {
        title: 'Featured utilities',
        description: 'Every tool captures UAE nuances so you can trust the output before sharing it with your board.',
        items: [
          { title: 'Corporate tax estimator', description: 'Project liabilities, reliefs, and quarterly payment schedules.' },
          { title: 'VAT readiness kit', description: 'Checklist + simulator for VAT onboarding and monthly filings.' },
          { title: 'Payroll & gratuity calculator', description: 'Auto-calculate EOS, WPS submissions, and visa renewals.' },
          { title: 'Burnway dashboard', description: 'Upload bank statements to see burn, runway, and headcount capacity.' }
        ]
      },
      {
        title: 'Coming soon',
        description: 'We ship new utilities every sprint. Tell us what you need and we will build it.',
        items: [
          { title: 'Equity dilution planner', description: 'Model option pools, SAFEs, and ESOP refreshers with dilution guardrails.' },
          { title: 'Revenue recognition template', description: 'Drag-and-drop logic for SaaS, usage-based, and retail revenue.' }
        ]
      }
    ],
    cta: {
      title: 'Need a custom tool for your finance workflow?',
      description: 'Our engineering and finance teams build internal tooling weekly. Share your wishlist and we’ll co-build it.',
      primary: { label: 'Request a tool', href: 'mailto:hello@finanshels.com' },
      secondary: { label: 'Join the operator community', href: 'https://community.finanshels.com' }
    }
  },
  glossary: {
    slug: 'glossary',
    heroTag: 'glossary',
    heroTitle: 'Every finance acronym explained in plain language',
    heroDescription:
      'From ESR to ZATCA, our glossary distills regulations, filings, and accounting concepts into one-liners teams actually read.',
    highlights: [
      { value: '350+', label: 'entries' },
      { value: 'Weekly', label: 'updates shipped' },
      { value: 'MENA-first', label: 'context + examples' }
    ],
    sections: [
      {
        title: 'Popular entries',
        description: 'Trending topics founders keep asking about.',
        items: [
          { title: 'Corporate Tax (CT)', description: 'Understand thresholds, deadlines, penalties, and reliefs under the UAE CT regime.' },
          { title: 'Economic Substance Regulations (ESR)', description: 'A breakdown of relevant activities, filings, and penalties.' },
          { title: 'ZATCA e-invoicing', description: 'Phase 2 requirements explained for Saudi operators.' },
          { title: 'WPS', description: 'How wage protection works, the forms you need, and the most common errors.' }
        ]
      },
      {
        title: 'How we maintain it',
        description: 'Teams review regulatory updates daily and add case studies from real Finanshels projects.',
        items: [
          { title: 'Signal only', description: 'Plain English explanations with founder-friendly context.' },
          { title: 'Regional nuance', description: 'Examples from UAE, KSA, Qatar, Oman, and Egypt.' },
          { title: 'Contributor notes', description: 'Controllers link to the exact circulars, decrees, or toolkits.' }
        ]
      }
    ],
    cta: {
      title: 'Want a pocket glossary in Notion or Slack?',
      description: 'We can embed our definitions inside your workspace with attachments, workflow checklists, and reminders.',
      primary: { label: 'Embed for my team', href: 'mailto:hello@finanshels.com' }
    }
  },
  faqs: {
    slug: 'faqs',
    heroTag: 'faqs',
    heroTitle: 'Answers before you even ask',
    heroDescription:
      'Everything founders, finance leads, and HR teams ask about accounting, tax, payroll, and our teams.',
    highlights: [
      { value: '24hr', label: 'response SLA' },
      { value: 'Zero', label: 'hidden fees' }
    ],
    sections: [
      {
        title: 'Most requested',
        description: 'Short answers, long details inside the articles.',
        items: [
          { title: 'How fast can you onboard?', description: 'Day 0–7 digitisation, day 8–21 insights, day 22+ rituals. Full clarity in 30 days.' },
          { title: 'Do you work with in-house teams?', description: 'Yes—our teams plug into your controllers, FP&A, or HR folks to extend capacity.' },
          { title: 'Which tools do you support?', description: 'Netsuite, Zoho, Xero, QuickBooks, SAP, Odoo, Ramp, Spendesk, Jeeves, and custom ERPs.' },
          { title: 'Can you help with fundraising?', description: 'Our fractional CFO bench builds data rooms, investor updates, and board packs.' }
        ]
      }
    ],
    cta: {
      title: 'Didn’t see your question?',
      description: 'Ping us on WhatsApp or email and you’ll hear back from a human team lead—no bots, no waitlists.',
      primary: { label: 'Chat on WhatsApp', href: 'https://wa.me/971507178156' },
      secondary: { label: 'Email hello@finanshels.com', href: 'mailto:hello@finanshels.com' }
    }
  },
  ebooks: {
    slug: 'ebooks',
    heroTag: 'ebooks',
    heroTitle: 'Deep dives on finance, GTM, and operations in MENA',
    heroDescription: 'Downloadable playbooks we share with portfolio founders, accelerators, and venture partners.',
    heroCTA: { label: 'Get the ebook bundle', href: 'https://www.finanshels.com/resources' },
    highlights: [
      { value: '7', label: 'premium guides' },
      { value: '40k+', label: 'downloads' }
    ],
    sections: [
      {
        title: 'Featured reading',
        description: 'Each guide includes templates, checklists, and automation blueprints.',
        items: [
          { title: 'Finance OS Playbook', description: 'How to architect teams, rituals, and dashboards across geos.' },
          { title: 'Corporate Tax Launch Kit', description: 'Everything a CFO needs to navigate UAE CT with zero penalties.' },
          { title: 'Venture-Ready Reporting', description: 'Board pack templates, investor update flows, and forecasting frameworks.' },
          { title: 'Payroll + People Ops Manual', description: 'Visa, WPS, EOS, and benefits guidelines for distributed teams.' }
        ]
      }
    ],
    cta: {
      title: 'Need a customised workshop for your portfolio?',
      description: 'We host private sessions for venture studios, accelerators, and scale-ups.',
      primary: { label: 'Book a session', href: 'mailto:hello@finanshels.com' }
    }
  },
  podcasts: {
    slug: 'podcasts',
    heroTag: 'podcasts',
    heroTitle: 'Real talk on startup money—no spreadsheets, just stories',
    heroDescription: 'Operators, CFOs, founders, and regulators share how they scaled finance functions across MENA.',
    heroCTA: { label: 'Listen on Spotify', href: 'https://open.spotify.com/show/finanshels' },
    sections: [
      {
        title: 'Recent episodes',
        description: 'Actionable episodes under 25 minutes.',
        items: [
      { title: 'Building finance operations for Saudi scale-ups', description: 'With controllers supporting the ZATCA e-invoicing push.' },
          { title: 'How founders should prep for corporate tax', description: 'Live breakdown with the Finanshels tax bench.' },
          { title: 'The CFO-CEO weekly standup', description: 'Rituals that keep leadership aligned on money.' }
        ]
      },
      {
        title: 'Formats',
        description: 'Choose your preferred cadence.',
        items: [
          { title: 'Operator diaries', description: 'Short monologues from our teams on real-life challenges.' },
          { title: 'Founder calls', description: 'Unfiltered chats with scale-up CEOs in the region.' },
          { title: 'Expert corners', description: 'Regulators, lawyers, and auditors join to decode policies.' }
        ]
      }
    ],
    cta: {
      title: 'Want to be on the show?',
      description: 'Pitch us your story—whether you cracked a finance ritual or survived a tax audit.',
      primary: { label: 'Drop us a line', href: 'mailto:hello@finanshels.com' }
    }
  },
  webinars: {
    slug: 'webinars',
    heroTag: 'webinars',
    heroTitle: 'Live and on-demand masterclasses for finance leaders',
    heroDescription: 'Weekly sessions covering compliance deadlines, tooling migrations, and leadership rituals.',
    heroCTA: { label: 'Reserve your seat', href: 'https://lu.ma/finanshels' },
    highlights: [
      { value: 'Live Q&A', label: 'with finance leads' },
      { value: 'Recordings', label: 'posted within 24h' }
    ],
    sections: [
      {
        title: 'Upcoming sessions',
        description: 'Limited seats to keep conversations tactical.',
        items: [
          { title: 'Corporate Tax Filing AMA', description: 'Walkthrough of GAZT/FTA portals with real datasets.' },
          { title: 'Designing the finance OS for Series A operators', description: 'Tooling, people, and dashboards in 45 minutes.' },
          { title: 'Building a payroll command centre', description: 'From visa renewals to EOS automation.' }
        ]
      },
      {
        title: 'On-demand library',
        description: 'Watch past workshops anytime.',
        items: [
          { title: 'VAT readiness sprint', description: 'Three episodes covering onboarding to reconciliation.' },
          { title: 'Fundraising finance stack', description: 'How CFOs prepare for diligence and investor questions.' }
        ]
      }
    ],
    cta: {
      title: 'Need a private workshop for your team?',
      description: 'We run bespoke sessions for leadership teams, boards, and HR teams.',
      primary: { label: 'Host a session', href: 'mailto:hello@finanshels.com' }
    }
  },
  blog: {
    slug: 'blog',
    heroTag: 'blog',
    heroTitle: 'Sharp takes on startup finance, decoded for MENA',
    heroDescription: 'No fluff—just hard-earned lessons from the teams, published weekly.',
    heroCTA: { label: 'Visit the blog', href: 'https://www.finanshels.com/blog' },
    sections: [
      {
        title: 'Latest stories',
        description: 'Editor picks from the last few weeks.',
        items: [
          { title: 'Designing a finance OS for multi-entity startups', description: 'Playbooks from teams supporting holding companies.' },
          { title: 'Corporate tax penalties to avoid in 2025', description: 'A practical guide with real audit stories.' },
          { title: 'How CFOs use WhatsApp to keep leadership aligned', description: 'Async rituals that work in high-velocity teams.' }
        ]
      },
      {
        title: 'Categories',
        description: 'Find articles that match your current sprint.',
        items: [
          { title: 'Accounting + Reporting', description: 'Close processes, board packs, consolidations.' },
          { title: 'Tax + Compliance', description: 'VAT, CT, ESR, ZATCA, and beyond.' },
          { title: 'People Finance', description: 'Payroll, HR ops, and visa strategy.' }
        ]
      }
    ],
    cta: {
      title: 'Want updates once a week?',
      description: 'We send a Sunday finance memo with three battle-tested ideas.',
      primary: { label: 'Subscribe to the memo', href: 'https://finanshels.substack.com' }
    }
  },
  careers: {
    slug: 'careers',
    heroTag: 'careers',
    heroTitle: 'Build the finance operating system of MENA',
    heroDescription: 'We hire accountants, controllers, engineers, designers, and creatives who love building with founders.',
    heroCTA: { label: 'See open roles', href: 'https://finanshels.kekahire.com' },
    highlights: [
      { value: '120+', label: 'Finanshels crew' },
      { value: '5', label: 'countries' },
      { value: 'Unlimited', label: 'learning budget' }
    ],
    sections: [
      {
        title: 'Teams hiring now',
        description: 'Join teams that ship clarity every week.',
        items: [
          { title: 'Accounting & Controllers', description: 'Own global closes, consolidations, and reporting rituals.' },
          { title: 'Tax & Compliance', description: 'Navigate CT, VAT, ESR, and new regulations with founders.' },
          { title: 'Automation & Product', description: 'Build internal tools that power our teams.' },
          { title: 'People & Ops', description: 'Design growth programs, recruiting loops, and culture.' }
        ]
      },
      {
        title: 'Life at Finanshels',
        description: 'What teammates say about working here.',
        items: [
          { title: 'Ownership first', description: 'You lead projects, meet founders, and present to boards.' },
          { title: 'Learning budget', description: 'Courses, certifications, and conferences on demand.' },
          { title: 'Global exposure', description: 'Work across UAE, KSA, Qatar, Oman, and India.' }
        ]
      }
    ],
    cta: {
      title: 'Don’t see a role that fits?',
      description: 'Send your story anyway. We often craft roles around exceptional people.',
      primary: { label: 'Introduce yourself', href: 'mailto:talents@finanshels.com' },
      secondary: { label: 'Follow Finanshels on LinkedIn', href: 'https://linkedin.com/company/finanshels' }
    }
  }
}
