import { useOnboarding } from '../../../contexts/OnboardingContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ArrowRight, ArrowLeft, Heart, CheckCircle2 } from 'lucide-react'
import AnimatedSection from '@/components/marketing/AnimatedSection'

export default function CustomerObsessionStep() {
  const { nextStep, previousStep } = useOnboarding()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-white px-6 py-12 sm:py-16">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="text-center mb-12">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mb-6 shadow-2xl">
              <Heart className="text-white" size={48} />
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tighter">
              <span className="bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">CUSTOMER</span>{' '}
              <span className="text-slate-900">OBSESSION</span>
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
          <Card className="border-2 border-red-200 shadow-2xl mb-8">
            <div className="p-12 bg-gradient-to-br from-red-50 to-pink-50 space-y-6">
              <p className="text-lg text-slate-700 leading-relaxed">
                Finanshels focus extends beyond satisfying customers; it centers on <span className="font-bold text-red-600">obsessing over their needs, desires, and pain points</span>. We champion a philosophy where the company starts with the customer and works backward, making customer-centricity a cultural imperative throughout the organization.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                At Finanshels we innovate to solve real customer problems rather than for its own sake.
              </p>
            </div>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={150}>
          <Card className="border-2 border-red-200 shadow-2xl mb-8">
            <div className="p-8 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Heart className="text-red-500" size={28} />
                How to Develop Customer Obsession
              </h3>
              <div className="space-y-4">
                {[
                  'Listen actively to customer feedback and act on it promptly',
                  'Put yourself in the customer\'s shoes before making decisions',
                  'Anticipate customer needs before they ask',
                  'Follow up regularly to ensure satisfaction',
                  'Share customer success stories with the team',
                  'Measure your success by customer outcomes, not just tasks completed'
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-red-50 border border-red-100">
                    <CheckCircle2 className="text-red-500 flex-shrink-0 mt-1" size={24} />
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

