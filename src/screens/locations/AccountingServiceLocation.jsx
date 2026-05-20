import Link from 'next/link'

const SERVICES = [
  {
    title: 'Bookkeeping & accounting',
    desc: 'Monthly books kept clean and reconciled, with management reports you can actually read.',
  },
  {
    title: 'VAT registration & filing',
    desc: 'FTA-compliant VAT registration, returns, and refund claims — filed accurately and on time.',
  },
  {
    title: 'Corporate tax',
    desc: 'Corporate tax registration, computation, and return filing under the UAE corporate tax regime.',
  },
  {
    title: 'Audit support',
    desc: 'Audit-ready financials and full coordination with your external auditors.',
  },
  {
    title: 'Payroll & WPS',
    desc: 'Accurate payroll processing and WPS-compliant salary disbursement.',
  },
  {
    title: 'CFO advisory',
    desc: 'Fractional CFO support — cash-flow planning, budgeting, and board-ready reporting.',
  },
]

const PROCESS = [
  { step: '01', title: 'Discovery call', desc: 'We review your books, tooling, headcount, and compliance deadlines.' },
  { step: '02', title: 'Onboarding', desc: 'We migrate your records, set up software, and agree a clear scope and timeline.' },
  { step: '03', title: 'Monthly delivery', desc: 'Clean books, filings, and reports delivered on a predictable schedule.' },
  { step: '04', title: 'Ongoing advisory', desc: 'A dedicated finance team that flags risks and opportunities as you grow.' },
]

const STATS = [
  { value: '6,000+', label: 'UAE clients served' },
  { value: '135+', label: 'Finance experts' },
  { value: '99.4%', label: 'On-time filings' },
  { value: '4.9★', label: 'Average Google rating' },
]

export default function AccountingServiceLocation({ city }) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: city.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Accounting and bookkeeping services',
    provider: { '@type': 'Organization', name: 'Finanshels' },
    areaServed: { '@type': 'City', name: city.name },
    description: `Accounting, VAT, corporate tax, and CFO services for businesses in ${city.name}, UAE.`,
  }

  const citySlug = city.name.toLowerCase().replace(/\s+/g, '-')
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    '@id': `https://www.finanshels.com/accounting-services-${citySlug}#business`,
    name: `Finanshels — Accounting Services in ${city.name}`,
    url: `https://www.finanshels.com/accounting-services-${citySlug}`,
    image: 'https://www.finanshels.com/finanshels_logo.png',
    description: `Accounting, bookkeeping, VAT, and corporate tax services for businesses in ${city.name}, UAE.`,
    telephone: '+971-50-717-8156',
    email: 'contact@finanshels.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: city.name,
      addressCountry: 'AE',
    },
    areaServed: { '@type': 'City', name: city.name },
    priceRange: '$$',
    sameAs: [
      'https://linkedin.com/company/finanshels',
      'https://twitter.com/finanshels',
    ],
  }

  return (
    <div className="bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fef3eb] via-[#fffaf3] to-white">
        <div className="mx-auto max-w-5xl px-6 pb-16 pt-32 sm:px-10 lg:px-16">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#f16610]">
            Accounting services in {city.name}
          </p>
          <h1 className="mt-4 text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-tight tracking-tight">
            Accounting & bookkeeping services in {city.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">{city.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-xl bg-[#f16610] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#f16610]/30 hover:bg-[#d95a0e]"
            >
              Get a quote
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center rounded-xl border-2 border-slate-200 px-6 py-3.5 text-sm font-semibold text-slate-700 hover:border-slate-300"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-slate-100 bg-white py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 sm:grid-cols-4 sm:px-10">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <h2 className="text-3xl font-semibold tracking-tight">
            What our {city.name} finance team handles
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            One partner for every finance and compliance need a {city.name} business has — delivered
            by specialists who know the UAE regulatory landscape.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <article key={service.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{service.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="bg-[#fffaf3] py-16">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <h2 className="text-3xl font-semibold tracking-tight">
            Why {city.name} businesses choose Finanshels
          </h2>
          <p className="mt-4 max-w-3xl text-slate-600">{city.why}</p>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <h2 className="text-3xl font-semibold tracking-tight">How we get started</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((item) => (
              <div key={item.step} className="rounded-2xl border border-slate-200 p-5">
                <p className="text-sm font-bold text-[#f16610]">{item.step}</p>
                <h3 className="mt-2 text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#fffaf3] py-16">
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
          <h2 className="text-3xl font-semibold tracking-tight">
            Accounting services in {city.name} — FAQs
          </h2>
          <dl className="mt-8 space-y-3">
            {city.faqs.map((faq) => (
              <details key={faq.q} className="rounded-xl border border-slate-200 bg-white p-4 open:shadow-sm">
                <summary className="cursor-pointer text-base font-semibold text-slate-900">{faq.q}</summary>
                <dd className="mt-3 text-sm leading-relaxed text-slate-600">{faq.a}</dd>
              </details>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-950 py-16 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
          <h2 className="text-3xl font-semibold tracking-tight">
            Ready to fix your books in {city.name}?
          </h2>
          <p className="mt-3 text-white/70">
            Talk to a senior finance operator. We reply within 24 hours with clear next steps.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center rounded-xl bg-[#f16610] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#d95a0e]"
          >
            Get a quote
          </Link>
        </div>
      </section>
    </div>
  )
}
