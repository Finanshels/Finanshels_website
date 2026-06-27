import { useOnboarding } from '../../../contexts/OnboardingContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ArrowRight, ArrowLeft, Shield, CheckCircle2 } from 'lucide-react'
import AnimatedSection from '@/components/marketing/AnimatedSection'

export default function EarnTrustStep() {
  const { nextStep, previousStep } = useOnboarding()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white px-6 py-12 sm:py-16">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="text-center mb-12">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6 shadow-2xl">
              <Shield className="text-white" size={48} />
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tighter">
              <span className="bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">EARN</span>{' '}
              <span className="text-slate-900">TRUST</span>
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
          <Card className="border-2 border-blue-200 shadow-2xl mb-8">
            <div className="p-12 bg-gradient-to-br from-blue-50 to-cyan-50 space-y-6">
              <p className="text-lg text-slate-700 leading-relaxed">
                Finanshels highlights the importance of trust as a fundamental component of business success. Believing that trust comes from experiences as a customer- treat others the way you wish to be treated. <span className="font-bold text-blue-600">It's quite straightforward—you build and sustain customer trust by helping them reach their goals</span>. As a service-focused business, our goal at Finanshels is to simplify our customers' lives, this is our most precious resource we all possess, and it cannot be regained.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                By focusing on a smooth and efficient process, customers will truly value our efforts.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Effective communication is essential for building trust with clients. Being transparent about services and processes boosts client confidence. Consistently delivering high-quality work fosters reliability over time. Additionally, understanding client needs and expectations is crucial for meeting their requirements.
              </p>
            </div>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={150}>
          <Card className="border-2 border-blue-200 shadow-2xl mb-8">
            <div className="p-8 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Shield className="text-blue-500" size={28} />
                How to Develop Trust
              </h3>
              <div className="space-y-4">
                {[
                  'Be transparent and honest in all communications',
                  'Admit mistakes quickly and take corrective action',
                  'Keep your promises and follow through on commitments',
                  'Communicate proactively about delays or issues',
                  'Maintain confidentiality and respect privacy',
                  'Demonstrate consistency in your actions and decisions'
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <CheckCircle2 className="text-blue-500 flex-shrink-0 mt-1" size={24} />
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

