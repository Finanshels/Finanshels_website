import { ArrowRight } from 'lucide-react'
import AnimatedSection from '../../components/AnimatedSection'
import { Card } from '../../components/ui/Card'

export default function ResourcePage({ page }) {
  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-600">
        <p>This resource is coming soon.</p>
      </div>
    )
  }

  return (
    <div className="bg-white text-slate-900">
      <section className="pt-36 pb-16 px-6 sm:px-10 lg:px-16 bg-gradient-to-b from-slate-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(241,102,16,0.25),_transparent_60%)]"></div>
        <div className="max-w-6xl mx-auto relative z-10 space-y-8">
          <AnimatedSection animation="fade-down">
            {page.heroTag && (
              <p className="text-sm uppercase tracking-[0.4em] text-white/60 font-semibold">{page.heroTag}</p>
            )}
            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight max-w-3xl">{page.heroTitle}</h1>
            {page.heroDescription && (
              <p className="text-lg text-white/75 max-w-3xl mt-6">{page.heroDescription}</p>
            )}
          </AnimatedSection>
          {(page.heroCTA || page.heroSecondaryCTA) && (
            <AnimatedSection animation="fade-up" delay={80}>
              <div className="flex flex-col sm:flex-row gap-4">
                {page.heroCTA && (
                  <a
                    href={page.heroCTA.href}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-5 py-3 font-semibold text-white shadow-lg shadow-[#f16610]/30"
                    target={page.heroCTA.href.startsWith('http') ? '_blank' : undefined}
                    rel={page.heroCTA.href.startsWith('http') ? 'noreferrer' : undefined}
                  >
                    {page.heroCTA.label}
                    <ArrowRight size={18} />
                  </a>
                )}
                {page.heroSecondaryCTA && (
                  <a
                    href={page.heroSecondaryCTA.href}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/40 px-5 py-3 font-semibold text-white/80 hover:text-white"
                    target={page.heroSecondaryCTA.href.startsWith('http') ? '_blank' : undefined}
                    rel={page.heroSecondaryCTA.href.startsWith('http') ? 'noreferrer' : undefined}
                  >
                    {page.heroSecondaryCTA.label}
                    <ArrowRight size={18} />
                  </a>
                )}
              </div>
            </AnimatedSection>
          )}
          {page.highlights && (
            <AnimatedSection animation="fade-up" delay={140}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {page.highlights.map((highlight) => (
                  <Card key={highlight.label} className="bg-white/10 border-white/20 text-center p-5 rounded-3xl">
                    <p className="text-2xl font-semibold">{highlight.value}</p>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/70 mt-2">{highlight.label}</p>
                  </Card>
                ))}
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {page.sections && page.sections.length > 0 && (
        <section className="py-20 px-6 sm:px-10 lg:px-16 bg-white">
          <div className="max-w-6xl mx-auto space-y-12">
            {page.sections.map((section, index) => (
              <AnimatedSection key={section.title} animation="fade-up" delay={index * 80}>
                <Card className="border border-slate-100 rounded-3xl">
                  <div className="p-8 space-y-5">
                    <div>
                      <p className="text-sm uppercase tracking-[0.4em] text-[#f16610]/80 font-semibold">{section.title}</p>
                      {section.description && (
                        <p className="text-slate-600 mt-3 text-lg">{section.description}</p>
                      )}
                    </div>
                    {section.items && (
                      <div className="grid sm:grid-cols-2 gap-6">
                        {section.items.map((item) => (
                          <div key={item.title} className="rounded-2xl bg-[#fff7f1] p-5">
                            <p className="font-semibold text-lg text-slate-900">{item.title}</p>
                            <p className="text-sm text-slate-600 mt-2">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      {page.cta && (
        <section className="py-16 px-6 sm:px-10 lg:px-16 bg-[#fff4ec]">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection animation="fade-up">
              <Card className="rounded-[32px] border border-[#ffd7c0] bg-white p-10 text-center space-y-4">
                <h2 className="text-3xl font-semibold">{page.cta.title}</h2>
                {page.cta.description && (
                  <p className="text-lg text-slate-600">{page.cta.description}</p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {page.cta.primary && (
                    <a
                      href={page.cta.primary.href}
                      className="inline-flex items-center gap-2 rounded-2xl bg-[#f16610] px-6 py-3 font-semibold text-white"
                      target={page.cta.primary.href.startsWith('http') ? '_blank' : undefined}
                      rel={page.cta.primary.href.startsWith('http') ? 'noreferrer' : undefined}
                    >
                      {page.cta.primary.label}
                      <ArrowRight size={18} />
                    </a>
                  )}
                  {page.cta.secondary && (
                    <a
                      href={page.cta.secondary.href}
                      className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#f16610] px-6 py-3 font-semibold text-[#f16610]"
                      target={page.cta.secondary.href.startsWith('http') ? '_blank' : undefined}
                      rel={page.cta.secondary.href.startsWith('http') ? 'noreferrer' : undefined}
                    >
                      {page.cta.secondary.label}
                      <ArrowRight size={18} />
                    </a>
                  )}
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </section>
      )}
    </div>
  )
}

