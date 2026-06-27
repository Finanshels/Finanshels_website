'use client'

import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import AnimatedSection from '../components/marketing/AnimatedSection'
import { PRODUCT_CATEGORIES } from '@/content/products'
import { Card } from '../components/ui/Card'

export default function Products() {
  return (
    <div className="bg-white text-slate-900">
      <section className="pt-36 pb-16 px-6 sm:px-10 lg:px-16 bg-[#fef5ef] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-12 -right-6 w-64 h-64 rounded-full bg-[#f16610]/10 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white/60 to-transparent" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10 space-y-6">
          <AnimatedSection animation="fade-down">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#f16610]/80">Products</p>
            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight max-w-4xl">
              Tools that keep every finance ritual on schedule
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mt-4">
              Finanshels products make compliance, reporting, and cash control effortless. Choose a purpose-built tool or
              combine them with our managed finance teams for full-stack control.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href="mailto:contact@finanshels.com?subject=Finanshels%20Products"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-6 py-3 font-semibold text-white shadow-lg shadow-[#f16610]/30"
              >
                Talk to sales
                <ArrowRight size={18} />
              </a>
              <a
                href="https://wa.me/971507178156?text=Show%20me%20Finanshels%20products."
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#f16610] px-6 py-3 font-semibold text-[#f16610]"
              >
                WhatsApp us
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-10 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          {PRODUCT_CATEGORIES.map((section) => (
            <AnimatedSection key={section.title} animation="fade-up">
              <Card className="border border-slate-100 rounded-[32px] p-6 sm:p-10 bg-[#fffdfb]">
                <div className="space-y-6">
                  <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">{section.title}</p>
                  <div className="grid gap-6 md:grid-cols-2">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.slug}
                          href={`/products/${item.slug}`}
                          className="group flex items-start gap-4 rounded-3xl border border-transparent bg-white/80 p-5 transition hover:-translate-y-1 hover:border-[#ffd7c0]"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff4ec] text-[#f16610] shadow-inner">
                            <Icon size={22} />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-semibold text-slate-900">{item.name}</p>
                              <ArrowUpRight
                                size={18}
                                className="text-slate-400 transition group-hover:text-[#f16610]"
                              />
                            </div>
                            <p className="text-sm text-slate-600">{item.description}</p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="pb-20 px-6 sm:px-10 lg:px-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection animation="fade-up">
            <Card className="rounded-[32px] border border-[#ffd7c0] bg-[#fff8f2] p-10 text-center space-y-4">
              <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">Need a custom build?</p>
              <h2 className="text-3xl font-semibold">Blend our products with managed finance teams.</h2>
              <p className="text-lg text-slate-600">
                Finanshels squads plug in bookkeeping, compliance, CFO rituals, and tooling into one cohesive partnership.
                Let’s map the right configuration for your finance goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <a
                  href="mailto:contact@finanshels.com"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#f16610] px-6 py-3 font-semibold text-white"
                >
                  Share your challenges
                  <ArrowRight size={18} />
                </a>
                <Link
                  href="/solutions"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#f16610] px-6 py-3 font-semibold text-[#f16610]"
                >
                  Browse finance services
                </Link>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
