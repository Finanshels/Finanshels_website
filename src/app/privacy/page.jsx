export const metadata = {
  title: 'Privacy Policy',
  description:
    'How Finanshels collects, uses, stores, and protects your personal information when you use our website and services.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
}

const LAST_UPDATED = '20 May 2026'

const SECTIONS = [
  {
    heading: '1. Introduction',
    body: [
      'Finanshels ("Finanshels", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit finanshels.com or use our finance, tax, and compliance services.',
      'By using our website or services, you consent to the practices described in this policy.',
    ],
  },
  {
    heading: '2. Information we collect',
    body: [
      'Information you provide directly: name, email address, phone number, company name, and any details you share through our contact forms, lead forms, chat widget, or while engaging our services.',
      'Information collected automatically: IP address, browser type, device information, pages visited, and referral source, collected through cookies and similar technologies.',
      'Service information: financial, accounting, and tax records you share with us in the course of receiving our services.',
    ],
  },
  {
    heading: '3. How we use your information',
    body: [
      'To provide, operate, and improve our services; to respond to enquiries and provide quotes; to communicate with you about your account or engagement; to comply with legal and regulatory obligations; and to send relevant updates where you have consented.',
    ],
  },
  {
    heading: '4. How we share your information',
    body: [
      'We do not sell your personal information. We may share it with trusted service providers (such as our CRM, email, and hosting providers) who process data on our behalf, with regulatory authorities where required by law, and with professional advisers. All third parties are required to protect your information.',
    ],
  },
  {
    heading: '5. Data retention',
    body: [
      'We retain personal information for as long as necessary to fulfil the purposes described in this policy and to comply with legal, accounting, and regulatory requirements in the United Arab Emirates.',
    ],
  },
  {
    heading: '6. Your rights',
    body: [
      'Subject to applicable law, you may request access to, correction of, or deletion of your personal information, and you may object to or restrict certain processing. To exercise these rights, contact us at contact@finanshels.com.',
    ],
  },
  {
    heading: '7. Cookies and analytics',
    body: [
      'We use cookies and similar local-storage technologies to operate the website, remember your preferences, and measure aggregate performance. Strictly necessary cookies (such as the consent acknowledgement stored in your browser) are required for the site to work. Analytics cookies collect anonymous, aggregated usage information that helps us improve the site.',
      'We do not use cookies for cross-site advertising or to build personal profiles. When you first visit, a consent banner notifies you of cookie use; you can also control cookies through your browser settings. Disabling strictly necessary cookies may affect site functionality.',
      'Where we use third-party tracking pixels on specific landing pages (such as Google Tag conversion tracking), they are loaded only on those pages and only after the page becomes interactive.',
    ],
  },
  {
    heading: '8. Data security',
    body: [
      'We implement appropriate technical and organisational measures to protect your information against unauthorised access, loss, or misuse. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.',
    ],
  },
  {
    heading: '9. International transfers',
    body: [
      'Your information may be processed and stored in countries other than your own. Where this occurs, we take steps to ensure your information receives an adequate level of protection.',
    ],
  },
  {
    heading: '10. Changes to this policy',
    body: [
      'We may update this Privacy Policy from time to time. The latest version will always be posted on this page with a revised "last updated" date.',
    ],
  },
  {
    heading: '11. Contact us',
    body: [
      'If you have questions about this Privacy Policy or how we handle your information, contact us at contact@finanshels.com.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <section className="bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-6 pb-20 pt-32 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#f16610]">Legal</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Privacy Policy</h1>
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
