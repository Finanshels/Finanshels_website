'use client'

import AnimatedSection from '../../components/marketing/AnimatedSection'
import { Card } from '../../components/ui/Card'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

export default function ProductDetailPage({ product }) {
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-600">
        <p>Product coming soon.</p>
      </div>
    )
  }

  return (
    <div className="bg-white text-slate-900">
      <section className="pt-36 pb-16 px-6 sm:px-10 lg:px-16 bg-gradient-to-b from-[#0f172a] to-[#141b2f] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(241,102,16,0.4),_transparent_60%)]"></div>
        <div className="max-w-6xl mx-auto relative z-10 space-y-6">
          <AnimatedSection animation="fade-down">
            <p className="text-xs uppercase tracking-[0.4em] text-white/70 font-semibold">{product.category}</p>
            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight max-w-4xl">{product.name}</h1>
            <p className="text-lg text-white/80 max-w-3xl mt-4">{product.subtitle}</p>
            <p className="text-base text-white/70 max-w-3xl">{product.description}</p>
            <div className="flex flex-wrap gap-3 mt-6">
              {product.cta?.primaryHref && (
                <a
                  href={product.cta.primaryHref}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-6 py-3 font-semibold text-white shadow-lg shadow-[#f16610]/30"
                >
                  {product.cta.primaryLabel}
                  <ArrowRight size={18} />
                </a>
              )}
              {product.cta?.secondaryHref && (
                <a
                  href={product.cta.secondaryHref}
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/40 px-6 py-3 font-semibold text-white/90 hover:bg-white/10"
                >
                  {product.cta.secondaryLabel}
                </a>
              )}
            </div>
          </AnimatedSection>
          {product.stats && (
            <AnimatedSection animation="fade-up" delay={60}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {product.stats.map((stat) => (
                  <Card key={stat.label} className="bg-white/10 border-white/15 text-center p-5 rounded-3xl">
                    <p className="text-3xl font-semibold">{stat.value}</p>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/70 mt-2">{stat.label}</p>
                  </Card>
                ))}
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {product.features && (
        <section className="py-16 px-6 sm:px-10 lg:px-16 bg-white">
          <div className="max-w-6xl mx-auto space-y-10">
            <AnimatedSection animation="fade-right">
              <div className="flex flex-col gap-3">
                <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">What&apos;s inside</p>
                <h2 className="text-3xl font-semibold">Capabilities operators lean on</h2>
                <p className="text-base text-slate-600">
                  Every Finanshels product comes with expert support, documentation, and onboarding help so your team can
                  go live in days—not months.
                </p>
              </div>
            </AnimatedSection>
            <div className="grid gap-6 md:grid-cols-3">
              {product.features.map((feature) => (
                <AnimatedSection key={feature.title} animation="fade-up">
                  <Card className="h-full border border-slate-100 rounded-[28px] bg-[#fffdfb] p-6 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#fff4ec] text-[#f16610] flex items-center justify-center">
                      <Sparkles size={20} />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-slate-600 text-sm">{feature.description}</p>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {product.workflow && (
        <section className="py-16 px-6 sm:px-10 lg:px-16 bg-[#f8fafc]">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
            <AnimatedSection animation="fade-right">
              <Card className="border border-slate-100 rounded-[32px] bg-white p-8 space-y-5">
                <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">How it works</p>
                <div className="space-y-4">
                  {product.workflow.map((step, index) => (
                    <div key={step} className="flex gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#fff4ec] text-[#f16610] flex items-center justify-center font-bold">
                        {(index + 1).toString().padStart(2, '0')}
                      </div>
                      <p className="text-slate-700">{step}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </AnimatedSection>
            {product.outputs && (
              <AnimatedSection animation="fade-left">
                <Card className="border border-slate-100 rounded-[32px] bg-white p-8 space-y-5">
                  <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">What you get</p>
                  <div className="space-y-4">
                    {product.outputs.map((output) => (
                      <div key={output} className="flex gap-3">
                        <CheckCircle2 className="text-[#f16610]" size={20} />
                        <p className="text-slate-700">{output}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </AnimatedSection>
            )}
          </div>
        </section>
      )}

      {(product.spotlight || product.support) && (
        <section className="py-16 px-6 sm:px-10 lg:px-16 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            {product.spotlight && (
              <AnimatedSection animation="fade-up">
                <Card className="h-full border border-slate-100 rounded-[32px] bg-[#fff8f5] p-8 space-y-4">
                  <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">{product.spotlight.title}</p>
                  <div className="space-y-3 text-slate-700">
                    {product.spotlight.bullets.map((item) => (
                      <div key={item} className="rounded-2xl border border-white/60 bg-white/80 p-4 text-sm">
                        {item}
                      </div>
                    ))}
                  </div>
                </Card>
              </AnimatedSection>
            )}
            {product.support && (
              <AnimatedSection animation="fade-up" delay={80}>
                <Card className="h-full border border-slate-100 rounded-[32px] bg-[#f8fafc] p-8 space-y-4">
                  <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">{product.support.title}</p>
                  <div className="space-y-3 text-slate-700">
                    {product.support.bullets.map((item) => (
                      <div key={item} className="rounded-2xl border border-slate-100 bg-white p-4 text-sm">
                        {item}
                      </div>
                    ))}
                  </div>
                </Card>
              </AnimatedSection>
            )}
          </div>
        </section>
      )}

      <section className="py-16 px-6 sm:px-10 lg:px-16 bg-[#fff8f2]">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <AnimatedSection animation="fade-up">
            <p className="text-xs uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">Ready to plug it in?</p>
            <h2 className="text-3xl font-semibold">Bring Finanshels into your finance stack</h2>
            <p className="text-lg text-slate-600">
              Share your current tools, headcount, and deadlines. We will map the fastest way to launch {product.name}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <a
                href="mailto:contact@finanshels.com"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-6 py-3 font-semibold text-white"
              >
                Talk to sales
                <ArrowRight size={18} />
              </a>
              <a
                href="https://wa.me/971507178156"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#f16610] px-6 py-3 font-semibold text-[#f16610]"
              >
                WhatsApp a consultant
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

