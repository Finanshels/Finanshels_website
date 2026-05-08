import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  NON_RESOURCE_STATIC_PAGE_PATHS,
  STATIC_PAGE_ALIASES,
  prettyTitleFromPath,
} from '@/lib/staticPageRoutes'

const EXISTING_APP_ROUTES = new Set<string>([
  '/',
  '/about',
  '/contact',
  '/pricing',
  '/products',
  '/services',
  '/solutions',
  '/customers',
  '/careers',
  '/home2',
])

const CATCH_ALL_STATIC_PATHS = NON_RESOURCE_STATIC_PAGE_PATHS.filter(
  (path) => path && !EXISTING_APP_ROUTES.has(path)
)

const CATCH_ALL_PATH_SET = new Set<string>(CATCH_ALL_STATIC_PATHS)

type CatchAllPageProps = {
  params: Promise<{
    slug: string[]
  }>
}

export const dynamicParams = false
export const revalidate = 3600

type PageCopy = {
  badge: string
  description: string
  highlights: string[]
  trustPoints: string[]
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
}

type FaqItem = {
  question: string
  answer: string
}

type MetricCard = {
  value: string
  label: string
  detail: string
}

type ComparisonPoint = {
  pain: string
  outcome: string
}

type Testimonial = {
  quote: string
  person: string
  role: string
}

type PageBlueprint = {
  introLabel: string
  introHeadline: string
  introText: string
  deliverablesTitle: string
  deliverables: string[]
  processTitle: string
  processSteps: string[]
  faqTitle: string
  faqs: FaqItem[]
}

const SPECIFIC_COPY_BY_PATH: Record<string, PageCopy> = {
  '/policies/privacy-policy': {
    badge: 'Privacy Policy',
    description:
      'Understand how Finanshels collects, uses, stores, and protects personal data across web experiences and client interactions.',
    highlights: [
      'Covers data collection, retention, and lawful processing principles.',
      'Includes contact channels for privacy requests and data rights questions.',
    ],
    trustPoints: ['Plain-language policy format', 'Review-friendly sections', 'Fast clarification support'],
    primaryCta: { label: 'Contact privacy desk', href: '/contact' },
    secondaryCta: { label: 'View GDPR policy', href: '/policies/gdpr-policy' },
  },
  '/policies/terms-of-service': {
    badge: 'Terms Of Service',
    description:
      'Review the service terms, scope boundaries, and engagement conditions applicable to Finanshels website and offerings.',
    highlights: [
      'Defines accountabilities, usage expectations, and legal limitations.',
      'Useful before starting any managed finance or compliance engagement.',
    ],
    trustPoints: ['Clear scope boundaries', 'Transparent terms', 'Direct escalation path'],
    primaryCta: { label: 'Discuss service terms', href: '/contact' },
    secondaryCta: { label: 'Explore services', href: '/services' },
  },
  '/policies/cookies-policy': {
    badge: 'Cookies Policy',
    description:
      'See what cookies and similar technologies are used across Finanshels properties, and how preferences can be managed.',
    highlights: [
      'Lists essential, analytics, and performance-oriented cookie categories.',
      'Explains controls available to visitors and policy update practices.',
    ],
    trustPoints: ['Cookie purpose transparency', 'Simple controls', 'Regular updates'],
    primaryCta: { label: 'Request clarification', href: '/contact' },
    secondaryCta: { label: 'Read privacy policy', href: '/policies/privacy-policy' },
  },
  '/policies/gdpr-policy': {
    badge: 'GDPR Policy',
    description:
      'Review our GDPR commitments for personal data processing, transparency, and rights handling for eligible data subjects.',
    highlights: [
      'Covers access, correction, deletion, and objection request workflows.',
      'Aligned with privacy-by-design and operational data governance standards.',
    ],
    trustPoints: ['Rights-first approach', 'Structured request process', 'Responsive support'],
    primaryCta: { label: 'Submit GDPR request', href: '/contact' },
    secondaryCta: { label: 'Read privacy policy', href: '/policies/privacy-policy' },
  },
  '/tools/finance-hiring-salary-benchmark': {
    badge: 'Finance Hiring Tool',
    description:
      'Benchmark compensation and role mix for finance hiring decisions in UAE growth-stage companies.',
    highlights: [
      'Use role-level ranges to plan hiring budgets with more confidence.',
      'Ideal for founders building first finance teams or upgrading leadership.',
    ],
    trustPoints: ['Role-level benchmarking', 'UAE hiring context', 'Actionable next steps'],
    primaryCta: { label: 'Get hiring support', href: '/contact' },
    secondaryCta: { label: 'Explore CFO services', href: '/cfo-services-uae' },
  },
  '/tools/gratuity-checker-calculator-tool-in-uae': {
    badge: 'Gratuity Calculator',
    description:
      'Estimate end-of-service gratuity under UAE labor context for cleaner payroll and people-ops planning.',
    highlights: [
      'Useful for employee exits, HR planning, and accrual forecasting.',
      'For edge cases, our advisors can verify calculations with your exact setup.',
    ],
    trustPoints: ['Fast estimates', 'Practical HR support', 'Specialist verification available'],
    primaryCta: { label: 'Validate with an expert', href: '/contact' },
    secondaryCta: { label: 'View payroll-related services', href: '/services' },
  },
  '/tools/corporate-tax-registration-deadline-checker-uae': {
    badge: 'Tax Deadline Checker',
    description:
      'Check your UAE corporate tax registration timeline and avoid unnecessary penalties from missed windows.',
    highlights: [
      'Built to help founders quickly identify key registration deadlines.',
      'Connect with our team for filing support after your deadline check.',
    ],
    trustPoints: ['Deadline clarity', 'Penalty-risk reduction', 'Execution support'],
    primaryCta: { label: 'Start registration support', href: '/services/corporate-tax-registration-in-uae' },
    secondaryCta: { label: 'Talk to tax team', href: '/contact' },
  },
  '/tools/corporate-tax-filing-deadline-checker-in-uae': {
    badge: 'Tax Filing Deadline Checker',
    description:
      'Track corporate tax filing due dates and preparation windows so your team can file accurately and on time.',
    highlights: [
      'Helps prioritize filing readiness before critical deadlines.',
      'Pair this with our return filing service for end-to-end execution.',
    ],
    trustPoints: ['Timely reminders', 'Filing readiness focus', 'Specialist-led follow-through'],
    primaryCta: { label: 'Get filing help', href: '/services/corporate-tax-return-filing-in-uae' },
    secondaryCta: { label: 'Book a consultation', href: '/contact' },
  },
  '/landing-pages/goaml-registration-services-in-uae': {
    badge: 'goAML Registration',
    description:
      'Dedicated route for businesses that need help completing goAML registration and related AML obligations in the UAE.',
    highlights: [
      'Focused scope for faster onboarding and compliance readiness.',
      'Includes guidance on documents, process flow, and expected timelines.',
    ],
    trustPoints: ['Step-by-step onboarding', 'Dedicated compliance support', 'Clear ownership from day one'],
    primaryCta: { label: 'Start goAML registration', href: '/contact' },
    secondaryCta: { label: 'See AML services', href: '/aml-compliance-uae' },
  },
  '/landing-pages/goaml-registration-services-in-uae-arabic': {
    badge: 'goAML Registration (Arabic)',
    description:
      'Arabic-focused version of the goAML registration journey for UAE businesses requiring bilingual compliance support.',
    highlights: [
      'Optimized for teams that need Arabic-first operational coordination.',
      'Includes handholding through registration and early-stage compliance setup.',
    ],
    trustPoints: ['Arabic-first coordination', 'Hands-on support', 'Faster activation'],
    primaryCta: { label: 'Request Arabic support', href: '/contact' },
    secondaryCta: { label: 'View AML services', href: '/aml-compliance-uae' },
  },
  '/events-by-finanshels': {
    badge: 'Finanshels Events',
    description:
      'Explore upcoming and past Finanshels events designed for founders, finance leaders, and compliance teams.',
    highlights: [
      'Includes tactical sessions, leadership roundtables, and partner events.',
      'Useful for teams looking to stay ahead of UAE finance and tax changes.',
    ],
    trustPoints: ['Practical sessions', 'Operator-led insights', 'Actionable takeaways'],
    primaryCta: { label: 'Register for events', href: '/contact' },
    secondaryCta: { label: 'Browse blog', href: '/blog' },
  },
  '/cfo-event-by-finanshels': {
    badge: 'CFO Event',
    description:
      'A focused event experience for CFOs and finance leaders managing growth, compliance, and board reporting.',
    highlights: [
      'Practical frameworks for planning, governance, and risk control.',
      'Built for operators navigating UAE and regional expansion complexity.',
    ],
    trustPoints: ['CFO-focused agenda', 'Real operating playbooks', 'Peer-quality conversations'],
    primaryCta: { label: 'Join the CFO event', href: '/contact' },
    secondaryCta: { label: 'Explore CFO services', href: '/cfo-services-uae' },
  },
  '/order-confirmation': {
    badge: 'Order Confirmation',
    description:
      'Confirmation page for successful request submission so clients can verify next steps and expected follow-up.',
    highlights: [
      'Your request is recorded and routed to the relevant specialist team.',
      'A team member usually reaches out within the published response window.',
    ],
    trustPoints: ['Confirmed submission', 'Owner assigned', 'Next-step communication'],
    primaryCta: { label: 'Contact support', href: '/contact' },
    secondaryCta: { label: 'Return to home', href: '/' },
  },
  '/order-successful-page': {
    badge: 'Order Successful',
    description:
      'Success page confirming completion of an order or service request in the Finanshels acquisition flow.',
    highlights: [
      'Use this page as a trusted endpoint after campaign and checkout journeys.',
      'Includes clear routes for follow-up assistance and service escalation.',
    ],
    trustPoints: ['Submission completed', 'Follow-up ready', 'Support access'],
    primaryCta: { label: 'Talk to support', href: '/contact' },
    secondaryCta: { label: 'View services', href: '/services' },
  },
}

function routePath(parts: string[]): string {
  return `/${parts.join('/')}`
}

function metricCardsForPath(path: string): MetricCard[] {
  if (path.startsWith('/tools/')) {
    return [
      { value: '< 3 min', label: 'Typical completion time', detail: 'Get directional output quickly' },
      { value: '24 hrs', label: 'Expert follow-up', detail: 'When you request support from our team' },
      { value: '100%', label: 'Action-oriented outputs', detail: 'Built to guide your next decision' },
    ]
  }

  if (path.startsWith('/policies/')) {
    return [
      { value: 'Clear', label: 'Policy language', detail: 'Written for practical understanding' },
      { value: 'Fast', label: 'Clarification route', detail: 'Reach the right team without delay' },
      { value: 'Current', label: 'Policy updates', detail: 'Reviewed as requirements evolve' },
    ]
  }

  if (path.includes('/event') || path.includes('/events') || path.includes('/webinar')) {
    return [
      { value: 'Actionable', label: 'Session format', detail: 'Built for implementation, not theory' },
      { value: 'Operator-led', label: 'Speakers', detail: 'Real practitioners with field context' },
      { value: 'Direct', label: 'Post-event support', detail: 'Continue with tailored guidance' },
    ]
  }

  return [
    { value: '1:1', label: 'Specialist guidance', detail: 'Finance and compliance experts assigned' },
    { value: 'Clear', label: 'Scope and pricing', detail: 'No ambiguity before kickoff' },
    { value: 'Fast', label: 'Onboarding', detail: 'Start execution without long delays' },
  ]
}

function comparisonPointsForPath(path: string): ComparisonPoint[] {
  if (path.startsWith('/tools/')) {
    return [
      {
        pain: 'Guessing deadlines and obligations from scattered sources.',
        outcome: 'Instant visibility into what to do next and when.',
      },
      {
        pain: 'Manual calculations with risk of costly errors.',
        outcome: 'Structured calculations with clear assumptions and next actions.',
      },
      {
        pain: 'No bridge from insight to execution.',
        outcome: 'Direct handoff to specialists who can implement immediately.',
      },
    ]
  }

  if (path.startsWith('/policies/')) {
    return [
      {
        pain: 'Legal text that is difficult to apply in real decisions.',
        outcome: 'Plain, structured policy guidance you can act on quickly.',
      },
      {
        pain: 'Unclear ownership when policy questions come up.',
        outcome: 'Direct clarification channel to the right support team.',
      },
      {
        pain: 'Uncertainty about current applicability.',
        outcome: 'Updated policy context aligned with active operations.',
      },
    ]
  }

  return [
    {
      pain: 'Finance and compliance handled reactively under pressure.',
      outcome: 'Predictable workflows with clear ownership and timelines.',
    },
    {
      pain: 'Different advisors for each issue, no unified accountability.',
      outcome: 'One coordinated team across bookkeeping, tax, and compliance.',
    },
    {
      pain: 'Delayed decisions because reporting and filings are fragmented.',
      outcome: 'Faster decisions with cleaner data and proactive execution.',
    },
  ]
}

function testimonialsForPath(path: string): Testimonial[] {
  if (path.startsWith('/landing-pages/')) {
    return [
      {
        quote: 'We moved from compliance stress to a clear weekly plan in less than two weeks.',
        person: 'Founder, B2B SaaS',
        role: 'Dubai',
      },
      {
        quote: 'The team explained exactly what was needed, then handled execution end-to-end.',
        person: 'Operations Lead',
        role: 'Abu Dhabi',
      },
    ]
  }

  if (path.startsWith('/tools/')) {
    return [
      {
        quote: 'The tool gave us immediate clarity and helped us avoid a filing miss.',
        person: 'Finance Manager',
        role: 'Growth Startup',
      },
      {
        quote: 'What I liked most was the quick jump from calculator output to expert support.',
        person: 'Founder',
        role: 'Ecommerce Brand',
      },
    ]
  }

  return [
    {
      quote: 'Finanshels feels like an extension of our internal team, not just an external vendor.',
      person: 'CEO',
      role: 'VC-backed startup',
    },
    {
      quote: 'We now have clear visibility, cleaner books, and less firefighting every month.',
      person: 'Head of Finance',
      role: 'SME operator',
    },
  ]
}

function copyForPath(path: string, title: string): PageCopy {
  const specificCopy = SPECIFIC_COPY_BY_PATH[path]
  if (specificCopy) {
    return specificCopy
  }

  if (path.startsWith('/policies/')) {
    return {
      badge: 'Policy Centre',
      description:
        'Review legal, privacy, and compliance policies that govern how Finanshels services and data handling operate.',
      highlights: [
        'Policy language is continuously reviewed against current regulatory requirements.',
        'Need legal clarification? Our operations team can route your request quickly.',
      ],
      trustPoints: ['Transparent wording', 'Current policy context', 'Support when needed'],
      primaryCta: { label: 'Contact compliance team', href: '/contact' },
      secondaryCta: { label: 'View all services', href: '/services' },
    }
  }

  if (path.startsWith('/tools/')) {
    return {
      badge: 'Finance Tools',
      description:
        'Use practical calculators and diagnostics built for founders and finance teams operating in the UAE.',
      highlights: [
        'Tools are designed to provide quick directional insights before deeper advisory support.',
        'For custom modeling or validation, our tax and accounting teams can assist directly.',
      ],
      trustPoints: ['Instant direction', 'Built for UAE use cases', 'Human support available'],
      primaryCta: { label: 'Get implementation help', href: '/contact' },
      secondaryCta: { label: 'See service plans', href: '/pricing' },
    }
  }

  if (path.startsWith('/locations/')) {
    return {
      badge: 'Local Coverage',
      description:
        'Regional pages tailor Finanshels support for city-specific and emirate-specific business requirements.',
      highlights: [
        'Coverage spans VAT, corporate tax, bookkeeping, and compliance operations.',
        'Speak to a specialist for city-specific filing workflows and timelines.',
      ],
      trustPoints: ['Local relevance', 'Specialist guidance', 'Clear delivery plan'],
      primaryCta: { label: 'Talk to a local advisor', href: '/contact' },
      secondaryCta: { label: 'Explore tax services', href: '/services' },
    }
  }

  if (path.startsWith('/landing-pages/')) {
    return {
      badge: 'Finanshels',
      description:
        'Get practical finance and compliance support tailored to your business stage, team size, and filing requirements.',
      highlights: [
        'Speak directly with specialists in tax, bookkeeping, and compliance.',
        'Get a clear scope, timeline, and pricing before you commit.',
      ],
      trustPoints: ['Fast qualification', 'Transparent pricing', 'Focused onboarding'],
      primaryCta: { label: 'Book a consultation', href: '/contact' },
      secondaryCta: { label: 'View pricing', href: '/pricing' },
    }
  }

  if (path.startsWith('/services/')) {
    return {
      badge: 'Finanshels Services',
      description:
        'Get expert execution for your accounting, tax, and compliance tasks so you can focus on growing the business.',
      highlights: [
        'Choose one-time support or ongoing monthly service.',
        'Work with experienced operators who handle UAE requirements daily.',
      ],
      trustPoints: ['Flexible scope', 'Specialist team', 'Predictable delivery'],
      primaryCta: { label: 'Book a discovery call', href: '/contact' },
      secondaryCta: { label: 'Browse core services', href: '/services' },
    }
  }

  if (path.includes('/webinar') || path.includes('/event') || path.includes('/events')) {
    return {
      badge: 'Events & Webinars',
      description:
        'Join Finanshels sessions for practical guidance on compliance updates, finance operations, and founder workflows.',
      highlights: [
        'Sessions are designed for practical implementation, not high-level theory.',
        'You can request private workshops for portfolio companies or internal teams.',
      ],
      trustPoints: ['Hands-on sessions', 'Real operator context', 'Follow-up support'],
      primaryCta: { label: 'Register interest', href: '/contact' },
      secondaryCta: { label: 'Explore blog', href: '/blog' },
    }
  }

  return {
    badge: 'Finanshels',
    description: `${title} helps businesses simplify finance operations, stay compliant, and move faster with confidence.`,
    highlights: [
      'Practical support from specialists across finance, tax, and compliance.',
      'Clear next steps, transparent pricing, and fast onboarding.',
    ],
    trustPoints: ['Business-first approach', 'Execution-focused support', 'Simple onboarding'],
    primaryCta: { label: 'Talk to our team', href: '/contact' },
    secondaryCta: { label: 'Explore services', href: '/services' },
  }
}

function blueprintForPath(path: string, title: string): PageBlueprint {
  if (path.startsWith('/policies/')) {
    return {
      introLabel: 'Your Trust Matters',
      introHeadline: 'Clear policies. No legal guesswork.',
      introText:
        'We keep policies transparent so you know exactly how your data is handled and what terms apply when working with us.',
      deliverablesTitle: 'What this page includes',
      deliverables: [
        'Clear explanation of policy scope and where it applies.',
        'Key rights, responsibilities, and usage expectations.',
        'Contact route for clarification and escalation requests.',
      ],
      processTitle: 'Before you proceed',
      processSteps: [
        'Review the scope to confirm relevance to your use case.',
        'Check obligations and rights sections before operational decisions.',
        'Reach out to our team for interpretation support when needed.',
      ],
      faqTitle: 'Questions you may have',
      faqs: [
        {
          question: 'Are these policies updated regularly?',
          answer: 'Yes. Policy language is reviewed and updated as product, legal, and compliance requirements evolve.',
        },
        {
          question: 'Can I request clarification on legal terms?',
          answer: 'Yes. Use the contact route on this page and the team will direct your question to the relevant owner.',
        },
      ],
    }
  }

  if (path.startsWith('/tools/')) {
    return {
      introLabel: 'Make Better Decisions Faster',
      introHeadline: 'Get clarity first, then act with confidence.',
      introText:
        'Use these tools to estimate numbers quickly, reduce uncertainty, and take the right next step with confidence.',
      deliverablesTitle: 'What you can do here',
      deliverables: [
        'Get fast directional outputs for planning and prioritization.',
        'Understand deadlines, eligibility, and next-step implications.',
        'Escalate from self-serve diagnostics to expert implementation.',
      ],
      processTitle: 'How to use this in 3 steps',
      processSteps: [
        'Run the initial estimate or check to identify your current position.',
        'Review any risk or deadline signals surfaced by the output.',
        'Book implementation support if you need filing or compliance execution.',
      ],
      faqTitle: 'Before you start',
      faqs: [
        {
          question: 'Are these tools a substitute for professional advice?',
          answer: 'They are built for fast direction. For filing or legal commitments, validation with a specialist is recommended.',
        },
        {
          question: 'Can Finanshels implement based on tool output?',
          answer: 'Yes. Our team can convert tool insights into an execution plan and complete delivery support.',
        },
      ],
    }
  }

  if (path.startsWith('/locations/')) {
    return {
      introLabel: 'Built For UAE Businesses',
      introHeadline: 'Local execution support where you operate.',
      introText:
        'Get support tailored to your emirate, business setup, and local compliance needs.',
      deliverablesTitle: 'What this location page helps with',
      deliverables: [
        'City-specific context for tax and bookkeeping workflows.',
        'Service fit for local operating and compliance requirements.',
        'Direct path to speak with an advisor familiar with your region.',
      ],
      processTitle: 'How we get you live quickly',
      processSteps: [
        'Share your entity details and operating geography.',
        'Receive scope mapped to local filing and accounting realities.',
        'Launch execution with defined cadence and ownership.',
      ],
      faqTitle: 'Common questions',
      faqs: [
        {
          question: 'Do you support multi-emirate businesses?',
          answer: 'Yes. Engagements are scoped for single-entity and multi-location operating setups.',
        },
        {
          question: 'Can location workflows be combined with other services?',
          answer: 'Yes. Most clients bundle tax, bookkeeping, and advisory into one managed operating model.',
        },
      ],
    }
  }

  if (path.startsWith('/landing-pages/')) {
    return {
      introLabel: 'How We Help',
      introHeadline: 'Faster onboarding. Less compliance stress.',
      introText:
        'From registration to filing and ongoing compliance, our team handles the heavy lifting so you can focus on running your business.',
      deliverablesTitle: 'What you get',
      deliverables: [
        'A clear view of what service is included.',
        'Simple next steps to get started quickly.',
        'Direct access to a specialist when you need advice.',
      ],
      processTitle: 'What happens after you contact us',
      processSteps: [
        'Share your business details and current requirement.',
        'Get a quick assessment and suggested plan.',
        'Start onboarding with clear timelines and ownership.',
      ],
      faqTitle: 'Questions before you begin',
      faqs: [
        {
          question: 'Are campaign offers time-bound?',
          answer: 'Some offers run for a limited period. We will confirm current availability when you contact us.',
        },
        {
          question: 'Can I request a custom variant of this offer?',
          answer: 'Yes. We can customize scope based on your business model and urgency.',
        },
      ],
    }
  }

  if (path.startsWith('/services/')) {
    return {
      introLabel: 'Service Scope',
      introHeadline: 'Execution support that moves at your pace.',
      introText:
        'Service pages map specific finance and compliance outcomes delivered by Finanshels teams across tax, reporting, and operations.',
      deliverablesTitle: 'What you get',
      deliverables: [
        'Defined scope with outputs tied to your business stage.',
        'Assigned specialists and a predictable delivery rhythm.',
        'Operational guidance to reduce risk and execution delays.',
      ],
      processTitle: 'How we onboard and execute',
      processSteps: [
        'Run a short discovery to align on requirements and timelines.',
        'Confirm scope, milestones, and ownership across teams.',
        'Start execution with periodic updates and outcome tracking.',
      ],
      faqTitle: 'Questions we get often',
      faqs: [
        {
          question: 'Can this service be monthly retainer or one-time?',
          answer: 'Both models are available. Scope and cadence are aligned during discovery.',
        },
        {
          question: 'How quickly can onboarding start?',
          answer: 'Most engagements can start quickly once access and scope confirmation are complete.',
        },
      ],
    }
  }

  if (path.includes('/webinar') || path.includes('/event') || path.includes('/events')) {
    return {
      introLabel: 'Events Program',
      introHeadline: 'Learn what works from operators who have done it.',
      introText:
        'Events and webinars bring tactical guidance to founders and finance leaders on compliance changes and operating best practices.',
      deliverablesTitle: 'What you can expect',
      deliverables: [
        'Focused sessions on practical implementation, not theory.',
        'Context from real client scenarios and operating patterns.',
        'Clear route to continue with advisory support post-session.',
      ],
      processTitle: 'How to join',
      processSteps: [
        'Register interest through the page CTA.',
        'Receive session details and pre-read material if applicable.',
        'Join live or request follow-up support with our specialists.',
      ],
      faqTitle: 'Before you register',
      faqs: [
        {
          question: 'Are sessions suitable for non-finance founders?',
          answer: 'Yes. Sessions are designed to be practical for both operators and leadership teams.',
        },
        {
          question: 'Do you run private sessions for teams?',
          answer: 'Yes. Dedicated workshops can be arranged for internal teams, portfolio companies, and partners.',
        },
      ],
    }
  }

  return {
    introLabel: 'Why Businesses Choose Finanshels',
    introHeadline: 'Practical finance and compliance support for growth teams.',
    introText: `${title} is designed to help you stay compliant, improve visibility, and move faster with the right finance partner.`,
    deliverablesTitle: 'What you get',
    deliverables: [
      'Specialist guidance mapped to your business stage and urgency.',
      'Clear scope and execution timeline before kickoff.',
      'A direct path to start quickly with confidence.',
    ],
    processTitle: 'How to get started',
    processSteps: [
      'Share your current requirement in a quick intro call.',
      'Receive a recommended scope and delivery approach.',
      'Approve and start onboarding with assigned owners.',
    ],
    faqTitle: 'Questions before you commit',
    faqs: [
      {
        question: 'Can this page be customized further?',
        answer: 'Yes. We can tailor scope and delivery to your industry, company stage, and internal capacity.',
      },
      {
        question: 'Is this route production-ready?',
        answer: 'Yes, this page is live and ready to use.',
      },
    ],
  }
}

export function generateStaticParams() {
  return CATCH_ALL_STATIC_PATHS.map((path) => ({
    slug: path.replace(/^\//, '').split('/'),
  }))
}

export async function generateMetadata({ params }: CatchAllPageProps): Promise<Metadata> {
  const { slug } = await params
  const path = routePath(slug)
  const resolvedPath = STATIC_PAGE_ALIASES[path] ?? path
  const title = prettyTitleFromPath(path)
  const copy = copyForPath(path, title)

  return {
    title,
    description: copy.description,
    alternates: {
      canonical: resolvedPath,
    },
  }
}

export default async function LegacyStaticPage({ params }: CatchAllPageProps) {
  const { slug } = await params
  const path = routePath(slug)
  const aliasTarget = STATIC_PAGE_ALIASES[path]

  if (aliasTarget) {
    redirect(aliasTarget)
  }

  if (!CATCH_ALL_PATH_SET.has(path)) {
    notFound()
  }

  const title = prettyTitleFromPath(path)
  const copy = copyForPath(path, title)
  const blueprint = blueprintForPath(path, title)
  const metrics = metricCardsForPath(path)
  const comparisonPoints = comparisonPointsForPath(path)
  const testimonials = testimonialsForPath(path)

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 md:px-8 md:py-14">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-blue-50 p-8 shadow-sm md:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-indigo-100/60 blur-3xl" />

        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{copy.badge}</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight text-slate-900 md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600 md:text-xl">{copy.description}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={copy.primaryCta.href}
            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow"
          >
            {copy.primaryCta.label}
          </Link>
          <Link
            href={copy.secondaryCta.href}
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            {copy.secondaryCta.label}
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {copy.trustPoints.map((point) => (
            <span key={point} className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {point}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {copy.highlights.map((highlight) => (
          <article
            key={highlight}
            className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
          >
            <p className="text-sm font-medium text-slate-700">{highlight}</p>
          </article>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10">
        <h2 className="text-2xl font-semibold text-slate-900">Outcomes you can expect</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <article key={metric.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:bg-white">
              <p className="text-3xl font-semibold leading-none text-slate-900">{metric.value}</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{metric.label}</p>
              <p className="mt-2 text-xs text-slate-600">{metric.detail}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{blueprint.introLabel}</p>
        <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">{blueprint.introHeadline}</h2>
        <p className="mt-3 text-base text-slate-200 md:text-lg">{blueprint.introText}</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10">
        <h2 className="text-2xl font-semibold text-slate-900">Why teams switch to Finanshels</h2>
        <div className="mt-6 space-y-4">
          {comparisonPoints.map((item) => (
            <article key={item.pain} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Without the right partner</p>
                <p className="mt-2 text-sm text-slate-700">{item.pain}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">With Finanshels</p>
                <p className="mt-2 text-sm text-slate-900">{item.outcome}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-8">
          <h2 className="text-2xl font-semibold text-slate-900">{blueprint.deliverablesTitle}</h2>
          <ul className="mt-5 space-y-3 text-sm text-slate-700 md:text-base">
            {blueprint.deliverables.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.12)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8">
          <h2 className="text-2xl font-semibold text-slate-900">{blueprint.processTitle}</h2>
          <ol className="mt-5 space-y-4 text-sm text-slate-700 md:text-base">
            {blueprint.processSteps.map((step, index) => (
              <li key={step} className="flex items-start gap-3">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10">
        <h2 className="text-2xl font-semibold text-slate-900">What clients say</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {testimonials.map((item) => (
            <article key={item.quote} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:bg-white">
              <p className="text-sm leading-relaxed text-slate-700">"{item.quote}"</p>
              <p className="mt-4 text-sm font-semibold text-slate-900">{item.person}</p>
              <p className="text-xs text-slate-600">{item.role}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10">
        <h2 className="text-2xl font-semibold text-slate-900">{blueprint.faqTitle}</h2>
        <div className="mt-5 space-y-4">
          {blueprint.faqs.map((faq) => (
            <details key={faq.question} className="rounded-xl border border-slate-200 p-4">
              <summary className="cursor-pointer list-none font-medium text-slate-900">{faq.question}</summary>
              <p className="mt-2 text-sm text-slate-600 md:text-base">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 md:p-10">
        <h2 className="text-2xl font-semibold text-slate-900">Get started with Finanshels</h2>
        <p className="mt-3 max-w-3xl text-sm text-slate-700 md:text-base">
          Tell us what you need help with and we will come back with a clear plan, timeline, and pricing so you can decide quickly.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Talk to our team
          </Link>
          <Link
            href="/pricing"
            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            See plans
          </Link>
        </div>
      </div>

    </section>
  )
}
