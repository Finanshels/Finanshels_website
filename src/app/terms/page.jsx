export const metadata = {
  title: 'Terms of Service',
  description:
    'The terms and conditions that govern your use of the Finanshels website and services.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: true },
}

const LAST_UPDATED = '18 May 2026'

const SECTIONS = [
  {
    heading: '1. Acceptance of terms',
    body: [
      'These Terms of Service ("Terms") govern your access to and use of the Finanshels website at finanshels.com and the finance, tax, and compliance services provided by Finanshels ("Finanshels", "we", "us", or "our"). By accessing the website or engaging our services, you agree to be bound by these Terms.',
    ],
  },
  {
    heading: '2. Our services',
    body: [
      'Finanshels provides accounting, bookkeeping, VAT, corporate tax, audit support, and CFO advisory services. The specific scope, deliverables, and fees for any engagement are set out in a separate engagement letter or proposal, which prevails over these Terms in the event of a conflict.',
    ],
  },
  {
    heading: '3. Eligibility',
    body: [
      'You must be at least 18 years old and have the authority to enter into these Terms on behalf of yourself or the business you represent.',
    ],
  },
  {
    heading: '4. Your responsibilities',
    body: [
      'You agree to provide accurate, complete, and timely information, to maintain the confidentiality of any account credentials, and to use the website and services only for lawful purposes. You are responsible for the accuracy of records and information you submit to us.',
    ],
  },
  {
    heading: '5. Acceptable use',
    body: [
      'You may not misuse the website, attempt to gain unauthorised access, interfere with its operation, or use it to transmit unlawful, harmful, or infringing content.',
    ],
  },
  {
    heading: '6. Fees and payment',
    body: [
      'Fees for services are set out in the applicable engagement letter or proposal. Unless stated otherwise, fees are exclusive of VAT and payable in accordance with the agreed schedule. Late payment may result in suspension of services.',
    ],
  },
  {
    heading: '7. Intellectual property',
    body: [
      'All content on the website, including text, graphics, logos, and software, is owned by or licensed to Finanshels and is protected by intellectual property laws. You may not reproduce or distribute it without our prior written consent.',
    ],
  },
  {
    heading: '8. Third-party links',
    body: [
      'The website may contain links to third-party websites or tools. We are not responsible for the content, accuracy, or practices of any third-party site.',
    ],
  },
  {
    heading: '9. Disclaimers',
    body: [
      'The website and any free tools or calculators are provided "as is" and "as available" for general information only and do not constitute professional advice. For advice specific to your circumstances, you must engage our services formally.',
    ],
  },
  {
    heading: '10. Limitation of liability',
    body: [
      'To the maximum extent permitted by law, Finanshels shall not be liable for any indirect, incidental, or consequential loss arising from your use of the website. Our liability in connection with any engagement is limited as set out in the relevant engagement letter.',
    ],
  },
  {
    heading: '11. Indemnification',
    body: [
      'You agree to indemnify and hold Finanshels harmless from any claims, losses, or expenses arising from your breach of these Terms or your misuse of the website or services.',
    ],
  },
  {
    heading: '12. Governing law',
    body: [
      'These Terms are governed by the laws of the United Arab Emirates. Any dispute arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE.',
    ],
  },
  {
    heading: '13. Changes to these terms',
    body: [
      'We may update these Terms from time to time. The latest version will always be posted on this page with a revised "last updated" date. Continued use of the website after changes constitutes acceptance of the updated Terms.',
    ],
  },
  {
    heading: '14. Contact us',
    body: [
      'If you have questions about these Terms, contact us at contact@finanshels.com.',
    ],
  },
]

export default function TermsPage() {
  return (
    <section className="bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-6 pb-20 pt-32 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#f16610]">Legal</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Terms of Service</h1>
        <p className="mt-4 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

        <div className="mt-10 space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.heading}>
              <h2 className="text-xl font-semibold text-slate-900">{section.heading}</h2>
              {section.body.map((paragraph, idx) => (
                <p key={idx} className="mt-3 text-base leading-relaxed text-slate-600">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
