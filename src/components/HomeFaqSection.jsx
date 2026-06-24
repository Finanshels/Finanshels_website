'use client'

import Link from 'next/link'
import { useState } from 'react'
import { HOME_FAQS } from '../data/homeFaqs'
import { cn } from '../lib/utils'
import AnimatedSection from './AnimatedSection'

function FaqAnswer({ faq }) {
  if (!faq.answerParts) return <p className="text-slate-600 leading-relaxed">{faq.a}</p>
  return (
    <p className="text-slate-600 leading-relaxed">
      {faq.answerParts.map((part, i) =>
        part.link ? (
          <Link key={i} href={part.link} className="font-semibold text-[#f16610] underline underline-offset-2 hover:text-[#d45a0d]">
            {part.label}
          </Link>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </p>
  )
}

export default function HomeFaqSection() {
  const [open, setOpen] = useState(null)

  return (
    <section className="px-5 sm:px-10 lg:px-16 py-20 sm:py-28">
      <div className="max-w-4xl mx-auto space-y-10">
        <AnimatedSection animation="fade-up">
          <div className="flex flex-col items-center text-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#f16610]/20 bg-[#fff4ec] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f16610]">
              FAQs
            </span>
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
              Everything founders ask before they start.
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-xl">
              Still have a question?{' '}
              <a
                href="https://wa.me/971521549572?text=Hi%20Team%20Finanshels%2C%20I%20have%20a%20question."
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#f16610] hover:underline"
              >
                Chat with our team
              </a>{' '}
              — we'll give you a straight answer.
            </p>
          </div>
        </AnimatedSection>

        <div className="space-y-2.5">
          {HOME_FAQS.map((faq, index) => {
            const isOpen = open === index
            return (
              <AnimatedSection key={index} animation="fade-up" delay={index * 40}>
                <div
                  className={cn(
                    'rounded-2xl border bg-white transition-all duration-200',
                    isOpen
                      ? 'border-[#f16610]/30 shadow-[0_12px_36px_-12px_rgba(241,102,16,0.2)]'
                      : 'border-slate-100 hover:border-[#f16610]/20'
                  )}
                >
                  <button
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    onClick={() => setOpen(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-slate-900 text-base sm:text-lg leading-snug">
                      {faq.q}
                    </span>
                    <span
                      className={cn(
                        'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xl font-light transition-all duration-200',
                        isOpen
                          ? 'bg-[#f16610] text-white rotate-45'
                          : 'bg-[#fff4ec] text-[#f16610]'
                      )}
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5">
                      <FaqAnswer faq={faq} />
                    </div>
                  )}
                </div>
              </AnimatedSection>
            )
          })}
        </div>

        <AnimatedSection animation="fade-up">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-slate-700 font-semibold text-base sm:text-lg">
              Still not sure which plan fits? Book a Finance Health Check — we'll assess your setup and recommend the right starting point. No obligation.
            </p>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <a
                href="https://contact-finanshels.zohobookings.com/#/customer/finanshels"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#f16610]/25 hover:-translate-y-0.5 transition-all whitespace-nowrap"
              >
                Book a Finance Health Check
              </a>
              <a
                href="https://wa.me/971521549572?text=Hi%20Team%20Finanshels%2C%20I%20need%20a%20finance%20consultation."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-[#f16610] hover:text-[#f16610] transition whitespace-nowrap"
              >
                Chat with an Expert
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
