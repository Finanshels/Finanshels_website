export type LandingPageSectionType =
  | 'hero'
  | 'trust-bar'
  | 'stats-row'
  | 'testimonials-carousel'
  | 'video-testimonial'
  | 'awards-press'
  | 'feature-grid'
  | 'process-steps'
  | 'comparison-table'
  | 'pricing'
  | 'inline-form'
  | 'cta-banner'
  | 'lead-magnet'
  | 'final-cta'
  | 'faq'
  | 'guarantee'
  | 'risk-reversal'

export type SectionFieldType =
  | 'text'
  | 'textarea'
  | 'rich_text'
  | 'boolean'
  | 'url'
  | 'number'
  | 'select'
  | 'json'
  | 'image'
  | 'color'

export type SectionFieldDef = {
  name: string
  label: string
  type: SectionFieldType
  required?: boolean
  options?: string[]
  placeholder?: string
  description?: string
  defaultValue?: string | number | boolean
}

export type SectionCatalogEntry = {
  type: LandingPageSectionType
  label: string
  description: string
  group: 'Hero' | 'Trust' | 'Value' | 'Conversion' | 'Objection'
  icon: string
  defaultProps: Record<string, unknown>
  fields: SectionFieldDef[]
}

const FEATURE_GRID_DEFAULT = [
  { icon: 'check-circle', title: 'FTA-approved process', description: 'Filed directly with the Federal Tax Authority by certified agents.' },
  { icon: 'shield-check', title: 'Penalty-free guarantee', description: "If we make a mistake, we pay the penalty — not you." },
  { icon: 'clock', title: 'Turnaround in 3 days', description: 'Most filings completed within 72 hours of document handover.' },
  { icon: 'message-circle', title: 'Dedicated tax expert', description: 'A real human on WhatsApp — not a chatbot, not a ticket queue.' },
]

const PROCESS_DEFAULT = [
  { number: '1', icon: 'message-square', title: 'Book a free consultation', description: 'Tell us about your business — takes 2 minutes.' },
  { number: '2', icon: 'file-text', title: 'Share documents securely', description: 'Upload trade license + records via our secure portal.' },
  { number: '3', icon: 'check', title: 'We file. You relax.', description: 'We handle FTA submission and keep you updated end-to-end.' },
]

const FAQ_DEFAULT = [
  { question: 'How long does the process take?', answer: 'Most filings are completed within 3 business days once we receive your documents.' },
  { question: 'What if I miss a deadline?', answer: 'We track every FTA deadline for you. If we miss one due to our mistake, we cover the penalty.' },
  { question: 'Do you serve free zones?', answer: 'Yes — we work with mainland and all major free zones (DMCC, IFZA, RAKEZ, JAFZA, and more).' },
  { question: 'Is my data safe?', answer: 'All documents are stored encrypted in UAE-based servers, accessed only by your assigned tax expert.' },
]

const TRUST_LOGOS_DEFAULT = [
  { src: '/logos/fta.svg', alt: 'Federal Tax Authority' },
  { src: '/logos/google.svg', alt: 'Google' },
  { src: '/logos/trustpilot.svg', alt: 'Trustpilot' },
]

const STATS_DEFAULT = [
  { value: '5000+', label: 'UAE businesses served' },
  { value: '12,000+', label: 'Returns filed' },
  { value: '4.9★', label: 'Google rating' },
  { value: 'AED 0', label: 'Penalties paid by clients' },
]

export const SECTION_CATALOG: SectionCatalogEntry[] = [
  {
    type: 'hero',
    label: 'Hero',
    description: 'Top-of-page headline + lead form. Pick a variant on the page Settings tab.',
    group: 'Hero',
    icon: 'flag',
    defaultProps: {
      eyebrow: 'UAE Corporate Tax',
      heading: 'Register your business for Corporate Tax — in 3 days, FTA-approved.',
      subheading: 'Trusted by 5,000+ UAE businesses. Get a free consultation today.',
      bullets: [
        'FTA-approved tax agents',
        'Free consultation in 24h',
        'Penalty-free guarantee',
      ],
      imageUrl: '',
      videoUrl: '',
      formHeading: 'Get a free quote in 24 hours',
      formSubheading: 'No commitment. No spam. Just answers.',
      submitLabel: 'Get my free quote',
      urgencyText: '',
      urgencyDeadline: '',
    },
    fields: [
      { name: 'eyebrow', label: 'Eyebrow text', type: 'text' },
      { name: 'heading', label: 'Headline', type: 'text', required: true },
      { name: 'subheading', label: 'Sub-headline', type: 'textarea' },
      { name: 'bullets', label: 'Bullet list (JSON array of strings)', type: 'json' },
      { name: 'imageUrl', label: 'Image URL (split / centered variants)', type: 'image' },
      { name: 'videoUrl', label: 'Video URL (video variant — YouTube/Vimeo/MP4)', type: 'url' },
      { name: 'formHeading', label: 'Form heading', type: 'text' },
      { name: 'formSubheading', label: 'Form sub-heading', type: 'text' },
      { name: 'submitLabel', label: 'Submit button label', type: 'text' },
      { name: 'urgencyText', label: 'Urgency text (urgency-banner variant)', type: 'text', placeholder: 'VAT filing deadline' },
      { name: 'urgencyDeadline', label: 'Urgency deadline (ISO datetime)', type: 'text', placeholder: '2026-07-31T23:59:00Z' },
    ],
  },
  {
    type: 'trust-bar',
    label: 'Trust bar',
    description: 'Logo strip + business count + rating chip.',
    group: 'Trust',
    icon: 'shield',
    defaultProps: {
      heading: 'Trusted by 5,000+ UAE businesses',
      logos: TRUST_LOGOS_DEFAULT,
      ratingLabel: '4.9 / 5 on Google',
    },
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'ratingLabel', label: 'Rating chip text', type: 'text' },
      { name: 'logos', label: 'Logos (JSON array of {src,alt})', type: 'json' },
    ],
  },
  {
    type: 'stats-row',
    label: 'Stats row',
    description: 'Animated counters showing impact numbers.',
    group: 'Trust',
    icon: 'bar-chart',
    defaultProps: {
      heading: 'Numbers that matter',
      items: STATS_DEFAULT,
    },
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'items', label: 'Items (JSON array of {value,label})', type: 'json' },
    ],
  },
  {
    type: 'testimonials-carousel',
    label: 'Testimonials',
    description: 'Carousel of customer quotes.',
    group: 'Trust',
    icon: 'quote',
    defaultProps: {
      heading: 'What UAE business owners say',
      subheading: 'Real founders, real results.',
      items: [
        { quote: 'Finanshels handled our corporate tax registration in 2 days. Zero stress.', author: 'Ahmed Al Mansoori', role: 'Founder', company: 'Bayan Trading LLC' },
        { quote: 'I was paying AED 3,500/month to another firm. Finanshels gives me more, for less.', author: 'Priya Menon', role: 'Director', company: 'Aurora Consulting' },
      ],
    },
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'subheading', label: 'Sub-heading', type: 'text' },
      { name: 'items', label: 'Quotes (JSON array of {quote,author,role,company,imageUrl?})', type: 'json' },
    ],
  },
  {
    type: 'video-testimonial',
    label: 'Video testimonial',
    description: 'One embedded video + pull quote.',
    group: 'Trust',
    icon: 'video',
    defaultProps: {
      videoUrl: '',
      quote: '',
      author: '',
      role: '',
      company: '',
    },
    fields: [
      { name: 'videoUrl', label: 'Video URL', type: 'url', required: true },
      { name: 'quote', label: 'Pull quote', type: 'textarea' },
      { name: 'author', label: 'Author name', type: 'text' },
      { name: 'role', label: 'Author role', type: 'text' },
      { name: 'company', label: 'Company', type: 'text' },
    ],
  },
  {
    type: 'awards-press',
    label: 'Awards & press',
    description: 'Logos of certifications, awards, press mentions.',
    group: 'Trust',
    icon: 'award',
    defaultProps: {
      heading: 'Recognised by',
      logos: [
        { src: '/logos/fta.svg', alt: 'FTA Approved Tax Agent' },
        { src: '/logos/gulf-news.svg', alt: 'Gulf News' },
        { src: '/logos/khaleej-times.svg', alt: 'Khaleej Times' },
      ],
    },
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'logos', label: 'Logos (JSON array of {src,alt})', type: 'json' },
    ],
  },
  {
    type: 'feature-grid',
    label: 'Feature grid',
    description: 'What you get — icon + title + 1-line description cards.',
    group: 'Value',
    icon: 'grid',
    defaultProps: {
      heading: 'What you get with Finanshels',
      subheading: 'Everything you need to stay compliant, none of the hassle.',
      columns: 4,
      items: FEATURE_GRID_DEFAULT,
    },
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'subheading', label: 'Sub-heading', type: 'textarea' },
      { name: 'columns', label: 'Columns (2/3/4)', type: 'number' },
      { name: 'items', label: 'Items (JSON array of {icon,title,description})', type: 'json' },
    ],
  },
  {
    type: 'process-steps',
    label: 'Process steps',
    description: 'Numbered "how it works" steps.',
    group: 'Value',
    icon: 'list-ordered',
    defaultProps: {
      heading: 'How it works',
      subheading: 'Three steps. That is it.',
      items: PROCESS_DEFAULT,
    },
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'subheading', label: 'Sub-heading', type: 'textarea' },
      { name: 'items', label: 'Steps (JSON array of {number,icon,title,description})', type: 'json' },
    ],
  },
  {
    type: 'comparison-table',
    label: 'Comparison table',
    description: 'Finanshels vs. DIY vs. other firms.',
    group: 'Value',
    icon: 'columns',
    defaultProps: {
      heading: 'Why Finanshels',
      subheading: 'Compare your options.',
      columns: ['Finanshels', 'Other firms', 'DIY'],
      highlightColumn: 0,
      rows: [
        { label: 'FTA-approved tax agents', values: [true, true, false] },
        { label: 'Penalty-free guarantee', values: [true, false, false] },
        { label: 'WhatsApp support', values: [true, false, false] },
        { label: 'Turnaround in 3 days', values: [true, false, false] },
        { label: 'Transparent fixed pricing', values: [true, false, false] },
      ],
    },
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'subheading', label: 'Sub-heading', type: 'textarea' },
      { name: 'columns', label: 'Column headers (JSON array)', type: 'json' },
      { name: 'highlightColumn', label: 'Highlighted column index', type: 'number' },
      { name: 'rows', label: 'Rows (JSON array of {label, values: boolean[]})', type: 'json' },
    ],
  },
  {
    type: 'pricing',
    label: 'Pricing',
    description: '1-3 pricing tiers with bullets and per-tier CTA.',
    group: 'Value',
    icon: 'tag',
    defaultProps: {
      heading: 'Simple, transparent pricing',
      subheading: 'No hidden fees. Cancel anytime.',
      tiers: [
        {
          name: 'Starter',
          price: 'AED 199',
          priceSuffix: '/month',
          description: 'For early-stage businesses.',
          features: ['Bookkeeping', 'VAT filing', 'Quarterly review'],
          ctaLabel: 'Get started',
          highlighted: false,
        },
        {
          name: 'Growth',
          price: 'AED 499',
          priceSuffix: '/month',
          description: 'For scaling teams.',
          features: ['Everything in Starter', 'Corporate Tax filing', 'Monthly review', 'Dedicated expert'],
          ctaLabel: 'Most popular',
          highlighted: true,
        },
      ],
    },
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'subheading', label: 'Sub-heading', type: 'textarea' },
      { name: 'tiers', label: 'Tiers (JSON array)', type: 'json' },
    ],
  },
  {
    type: 'inline-form',
    label: 'Inline form',
    description: 'A second lead form embedded mid-page.',
    group: 'Conversion',
    icon: 'form',
    defaultProps: {
      heading: 'Ready to get started?',
      subheading: 'Free consultation. No commitment.',
      submitLabel: 'Get my free quote',
      backgroundTone: 'soft',
    },
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'subheading', label: 'Sub-heading', type: 'textarea' },
      { name: 'submitLabel', label: 'Submit label', type: 'text' },
      { name: 'backgroundTone', label: 'Background tone (soft/brand/dark)', type: 'select', options: ['soft', 'brand', 'dark'] },
    ],
  },
  {
    type: 'cta-banner',
    label: 'CTA banner',
    description: 'Full-width band with one line + Call / WhatsApp / Form buttons.',
    group: 'Conversion',
    icon: 'megaphone',
    defaultProps: {
      heading: 'Talk to a tax expert today.',
      subheading: '',
      tone: 'brand',
      showFormButton: true,
      showCallButton: true,
      showWhatsAppButton: true,
    },
    fields: [
      { name: 'heading', label: 'Heading', type: 'text', required: true },
      { name: 'subheading', label: 'Sub-heading', type: 'text' },
      { name: 'tone', label: 'Tone', type: 'select', options: ['brand', 'dark', 'soft'] },
      { name: 'showFormButton', label: 'Show "Get quote" button', type: 'boolean' },
      { name: 'showCallButton', label: 'Show "Call" button', type: 'boolean' },
      { name: 'showWhatsAppButton', label: 'Show "WhatsApp" button', type: 'boolean' },
    ],
  },
  {
    type: 'lead-magnet',
    label: 'Lead magnet',
    description: 'Gated download — visitor submits form, gets PDF.',
    group: 'Conversion',
    icon: 'download',
    defaultProps: {
      heading: 'Free VAT compliance checklist',
      subheading: 'A 12-point list every UAE business should review before filing.',
      fileUrl: '',
      coverImageUrl: '',
      submitLabel: 'Send me the checklist',
    },
    fields: [
      { name: 'heading', label: 'Heading', type: 'text', required: true },
      { name: 'subheading', label: 'Sub-heading', type: 'textarea' },
      { name: 'fileUrl', label: 'File URL (PDF)', type: 'url', required: true },
      { name: 'coverImageUrl', label: 'Cover image URL', type: 'image' },
      { name: 'submitLabel', label: 'Submit label', type: 'text' },
    ],
  },
  {
    type: 'final-cta',
    label: 'Final CTA',
    description: 'Closing block with form + call + WhatsApp. Always place last.',
    group: 'Conversion',
    icon: 'send',
    defaultProps: {
      heading: 'Stop worrying about tax.',
      subheading: 'Get a free consultation today.',
      submitLabel: 'Get my free quote',
      tone: 'dark',
    },
    fields: [
      { name: 'heading', label: 'Heading', type: 'text', required: true },
      { name: 'subheading', label: 'Sub-heading', type: 'textarea' },
      { name: 'submitLabel', label: 'Submit label', type: 'text' },
      { name: 'tone', label: 'Tone', type: 'select', options: ['dark', 'brand', 'soft'] },
    ],
  },
  {
    type: 'faq',
    label: 'FAQ accordion',
    description: 'Expandable Q&A — strong impact on conversion and SEO.',
    group: 'Objection',
    icon: 'help-circle',
    defaultProps: {
      heading: 'Frequently asked questions',
      subheading: '',
      items: FAQ_DEFAULT,
    },
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'subheading', label: 'Sub-heading', type: 'textarea' },
      { name: 'items', label: 'Items (JSON array of {question,answer})', type: 'json' },
    ],
  },
  {
    type: 'guarantee',
    label: 'Guarantee',
    description: 'Standout callout for money-back / penalty-free / approval guarantees.',
    group: 'Objection',
    icon: 'shield-check',
    defaultProps: {
      heading: 'Our penalty-free guarantee',
      body: 'If we make a mistake on your filing, we pay the FTA penalty — not you. Full stop.',
      iconName: 'shield-check',
    },
    fields: [
      { name: 'heading', label: 'Heading', type: 'text', required: true },
      { name: 'body', label: 'Body text', type: 'textarea', required: true },
      { name: 'iconName', label: 'Lucide icon name', type: 'text' },
    ],
  },
  {
    type: 'risk-reversal',
    label: 'Risk-reversal badges',
    description: 'Row of badges: no commitment, free consultation, etc.',
    group: 'Objection',
    icon: 'check-circle',
    defaultProps: {
      items: [
        { icon: 'check', text: 'No commitment' },
        { icon: 'clock', text: 'Free quote in 24h' },
        { icon: 'lock', text: 'Your data stays in UAE' },
        { icon: 'shield', text: 'FTA-approved process' },
      ],
    },
    fields: [
      { name: 'items', label: 'Items (JSON array of {icon,text})', type: 'json' },
    ],
  },
]

const CATALOG_MAP = new Map<string, SectionCatalogEntry>(
  SECTION_CATALOG.map((s) => [s.type, s])
)

export const SECTION_TYPES: readonly LandingPageSectionType[] = SECTION_CATALOG.map((s) => s.type)

export function getSectionCatalogEntry(type: string): SectionCatalogEntry | null {
  return CATALOG_MAP.get(type) ?? null
}

export function getSectionDefaultProps(type: string): Record<string, unknown> {
  return CATALOG_MAP.get(type)?.defaultProps ?? {}
}

export function isKnownSectionType(type: string): type is LandingPageSectionType {
  return CATALOG_MAP.has(type)
}

export function createDefaultSection(type: LandingPageSectionType): {
  id: string
  type: LandingPageSectionType
  enabled: boolean
  props: Record<string, unknown>
} {
  const entry = CATALOG_MAP.get(type)
  const id =
    typeof globalThis.crypto !== 'undefined' && 'randomUUID' in globalThis.crypto
      ? globalThis.crypto.randomUUID()
      : `s_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
  return {
    id,
    type,
    enabled: true,
    props: entry ? JSON.parse(JSON.stringify(entry.defaultProps)) : {},
  }
}
