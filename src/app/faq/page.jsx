import Link from 'next/link'
import { HOME_FAQS } from '../../data/homeFaqs'
import { safeJsonLd } from '@/lib/seo/safeJsonLd'
import HomeFaqSection from '../../components/HomeFaqSection'

const PAGE_TITLE = 'Frequently Asked Questions | Finanshels'
const PAGE_DESCRIPTION =
  'Answers to every question founders ask before starting with Finanshels — pricing, onboarding, software, quality, and UAE corporate tax.'

export const metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: '/faq' },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  twitter: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: HOME_FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
}

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}
      />
      <div className="pt-20">
        <div className="px-5 sm:px-10 lg:px-16 pt-16 pb-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#f16610]/20 bg-[#fff4ec] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f16610]">
            FAQs
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight">
            Frequently asked questions.
          </h1>
          <p className="mt-4 text-slate-500 text-lg max-w-xl mx-auto">
            Everything founders ask before they start.{' '}
            <a
              href="https://wa.me/971521549572?text=Hi%20Team%20Finanshels%2C%20I%20have%20a%20question."
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#f16610] hover:underline"
            >
              Chat with our team
            </a>{' '}
            if you need a straight answer.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://contact-finanshels.zohobookings.com/#/customer/finanshels"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#f16610]/25 hover:-translate-y-0.5 transition-all"
            >
              Book a Finance Health Check
            </a>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-[#f16610] hover:text-[#f16610] transition"
            >
              View pricing
            </Link>
          </div>
        </div>
        <HomeFaqSection />
      </div>
    </>
  )
}
