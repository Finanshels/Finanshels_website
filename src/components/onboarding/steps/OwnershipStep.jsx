import { useOnboarding } from '../../../contexts/OnboardingContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ArrowRight, ArrowLeft, Crown, CheckCircle2 } from 'lucide-react'
import AnimatedSection from '@/components/marketing/AnimatedSection'

export default function OwnershipStep() {
  const { nextStep, previousStep } = useOnboarding()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white px-6 py-12 sm:py-16">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="text-center mb-12">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-6 shadow-2xl">
              <Crown className="text-white" size={48} />
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tighter">
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">OWNERSHIP</span>
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
          <Card className="border-2 border-amber-200 shadow-2xl mb-8">
            <div className="p-12 bg-gradient-to-br from-amber-50 to-orange-50 space-y-6">
              <p className="text-lg text-slate-700 leading-relaxed">
                When you embrace work as ownership, it <span className="font-bold text-amber-600">transforms your approach to tasks and responsibilities</span>. Instead of simply following a to-do list, you invest yourself fully with the aim of achieving meaningful impact rather than just completing a checklist.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                You actively engage with challenges, asking yourself how you can navigate each situation to achieve the best possible outcome. This mindset encourages you to take initiative, seek innovative solutions, and collaborate effectively, fostering a sense of pride and accountability in your work.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Ultimately, working with ownership leads to personal growth and contributes to the overall success of the team and organization.
              </p>
            </div>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={150}>
          <Card className="border-2 border-amber-200 shadow-2xl mb-8">
            <div className="p-8 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Crown className="text-amber-500" size={28} />
                How to Develop Ownership
              </h3>
              <div className="space-y-4">
                {[
                  'Take initiative without waiting to be asked',
                  'Think long-term about the impact of your decisions',
                  'Solve problems completely, not just symptoms',
                  'Act on behalf of the entire company, not just your team',
                  'Take responsibility for failures and learn from them',
                  'Never say "that\'s not my job" - look for ways to contribute'
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <CheckCircle2 className="text-amber-500 flex-shrink-0 mt-1" size={24} />
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

