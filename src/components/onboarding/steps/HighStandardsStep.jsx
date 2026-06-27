import { useOnboarding } from '../../../contexts/OnboardingContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ArrowRight, ArrowLeft, Star, CheckCircle2 } from 'lucide-react'
import AnimatedSection from '@/components/marketing/AnimatedSection'

export default function HighStandardsStep() {
  const { nextStep, previousStep } = useOnboarding()

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-white px-6 py-12 sm:py-16">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="text-center mb-12">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mb-6 shadow-2xl">
              <Star className="text-white" size={48} />
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tighter">
              <span className="bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">HIGH</span>{' '}
              <span className="text-slate-900">STANDARDS</span>
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
          <Card className="border-2 border-yellow-200 shadow-2xl mb-8">
            <div className="p-12 bg-gradient-to-br from-yellow-50 to-orange-50 space-y-6">
              <p className="text-lg text-slate-700 leading-relaxed">
                At Finanshels, we <span className="font-bold text-orange-600">prioritize maintaining exceptionally high standards</span> across all areas of our work. This commitment ensures that we continually meet and exceed our clients' expectations. Setting and modeling high standards allows us to prevent recurring issues, foster trust, and inspire continuous improvement throughout the organization.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Our dedication to these standards supports sustainable growth and aligns with our mission to keep enhancing what we deliver to our customers.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Leaders who exemplify high standards set a powerful example that resonates throughout the organization, ensuring sustainable quality and customer loyalty.
              </p>
            </div>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={150}>
          <Card className="border-2 border-yellow-200 shadow-2xl mb-8">
            <div className="p-8 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Star className="text-yellow-500" size={28} />
                How to Develop High Standards
              </h3>
              <div className="space-y-4">
                {[
                  'Never compromise on quality even under pressure',
                  'Double-check your work before submission',
                  'Set clear, measurable quality benchmarks',
                  'Learn from the best in your field',
                  'Give and receive constructive feedback regularly',
                  'Continuously improve processes and workflows'
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-yellow-50 border border-yellow-100">
                    <CheckCircle2 className="text-yellow-500 flex-shrink-0 mt-1" size={24} />
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

