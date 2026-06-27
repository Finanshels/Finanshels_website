import { useOnboarding } from '../../../contexts/OnboardingContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ArrowRight, ArrowLeft, Rocket, CheckCircle2 } from 'lucide-react'
import AnimatedSection from '@/components/marketing/AnimatedSection'

export default function InnovateStep() {
  const { nextStep, previousStep } = useOnboarding()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-white px-6 py-12 sm:py-16">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="text-center mb-12">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 shadow-2xl">
              <Rocket className="text-white" size={48} />
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tighter">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">INNOVATE</span>{' '}
              <span className="text-slate-900">AND SIMPLIFY</span>
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
          <Card className="border-2 border-emerald-200 shadow-2xl mb-8">
            <div className="p-12 bg-gradient-to-br from-emerald-50 to-teal-50 space-y-6">
              <p className="text-lg text-slate-700 leading-relaxed">
                <span className="font-bold text-emerald-600">Constantly innovating and simplifying processes is crucial for sustainable growth</span>. Leaders emphasize the importance of not only initial innovation but also the ability to reinvent and improve over time, staying responsive to constantly evolving needs.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                This approach has been essential for delivering the highest customer standards.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                At Finanshels, we prioritize innovation and simplification as key to enduring success. By fostering an inventive culture and embracing external insights, we aim to continually improve and adapt, meeting the highest customer standards.
              </p>
            </div>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={150}>
          <Card className="border-2 border-emerald-200 shadow-2xl mb-8">
            <div className="p-8 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Rocket className="text-emerald-500" size={28} />
                How to Develop Innovation
              </h3>
              <div className="space-y-4">
                {[
                  'Challenge the status quo and ask "why not?"',
                  'Simplify complex processes wherever possible',
                  'Look outside your industry for fresh ideas',
                  'Experiment with new tools and approaches',
                  'Encourage creative thinking in brainstorming sessions',
                  'Turn failed experiments into learning opportunities'
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <CheckCircle2 className="text-emerald-500 flex-shrink-0 mt-1" size={24} />
                    <span className="text-slate-700 font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={200}>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              onClick={previousStep}
              className="bg-white hover:bg-slate-50 text-slate-900 font-bold px-12 text-lg shadow-xl border-2 border-slate-200"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back
            </Button>
            <Button
              size="lg"
              onClick={nextStep}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-12 text-lg shadow-xl"
            >
              Next Value
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

