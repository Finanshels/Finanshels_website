import { useOnboarding } from '../../../contexts/OnboardingContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ArrowRight, ArrowLeft, Lightbulb, CheckCircle2 } from 'lucide-react'
import AnimatedSection from '@/components/marketing/AnimatedSection'

export default function ThinkBigStep() {
  const { nextStep, previousStep } = useOnboarding()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white px-6 py-12 sm:py-16">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="text-center mb-12">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-2xl">
              <Lightbulb className="text-white" size={48} />
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tighter">
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">THINK</span>{' '}
              <span className="text-slate-900">BIG</span>
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
          <Card className="border-2 border-indigo-200 shadow-2xl mb-8">
            <div className="p-12 bg-gradient-to-br from-indigo-50 to-purple-50 space-y-6">
              <p className="text-lg text-slate-700 leading-relaxed">
                <span className="font-bold text-indigo-600">Thinking big is essential to long-term success</span>. Leaders inspire bold goals, anticipating future needs and changes in technology. Constantly innovating and solving customer problems creates a unique value in the market and enables companies to stay ahead.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                At Finanshels, we embrace the power of thinking big. This principle drives us to pursue ambitious goals, anticipate customer needs, and innovate continuously. By taking bold initiatives, we aim to create long-lasting impact and deliver exceptional experiences that keep us ahead in a dynamic market.
              </p>
            </div>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={150}>
          <Card className="border-2 border-indigo-200 shadow-2xl mb-8">
            <div className="p-8 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Lightbulb className="text-indigo-500" size={28} />
                How to Develop Big Thinking
              </h3>
              <div className="space-y-4">
                {[
                  'Set ambitious goals that inspire you and others',
                  'Think 10x instead of 10% improvement',
                  'Consider long-term impact over short-term wins',
                  'Don\'t limit yourself based on current constraints',
                  'Study successful visionaries and their strategies',
                  'Regularly step back to see the bigger picture'
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                    <CheckCircle2 className="text-indigo-500 flex-shrink-0 mt-1" size={24} />
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
              Continue to OKR System
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

