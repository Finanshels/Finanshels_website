import { useOnboarding } from '../../../contexts/OnboardingContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ArrowRight, ArrowLeft, Users } from 'lucide-react'
import AnimatedSection from '@/components/marketing/AnimatedSection'

export default function TeamStep() {
  const { nextStep, previousStep, userData } = useOnboarding()

  const departments = [
    { name: 'Tech Stack', icon: '💻', members: ['Product', 'Clients', 'SDR', 'Finance Team', 'Operations'] },
    { name: 'HR Stack', icon: '👥', members: ['Admin', 'Legal', 'Clients', 'PMS', 'VAT'] },
    { name: 'Finance', icon: '💰', members: ['Bookkeeping', 'Consulting & Compliance'] },
    { name: 'Operations & Support', icon: '⚙️', members: ['Operations', 'Onboarding', 'Business Excellence'] }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white px-6 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-sm font-bold text-blue-700 mb-6">
              <Users size={16} />
              OUR CREW
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tighter">
              Meet Your <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Team</span>
            </h2>
            <p className="text-lg text-slate-600">
              Welcome to the {userData.department} department, {userData.name}!
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
          <Card className="border-2 border-blue-200 shadow-2xl mb-12 overflow-hidden">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl mb-4">
                  <div className="text-white text-left">
                    <div className="text-sm font-semibold opacity-90">CEO & Founder</div>
                    <div className="text-2xl font-extrabold">MOHAMMED SHAFEEQUE</div>
                  </div>
                </div>
                <div className="text-sm text-slate-600 mt-6">Leading Finanshels to revolutionize fintech</div>
              </div>
              
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 shadow-lg">
                  <div className="text-white">
                    <div className="text-xs font-semibold opacity-90">COO & Co-Founder</div>
                    <div className="text-lg font-extrabold">MUHAMMED MUSTAFA</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {departments.map((dept, idx) => (
            <AnimatedSection key={idx} animation="fade-up" delay={200 + idx * 100}>
              <Card className="border-2 border-slate-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-500 h-full">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{dept.icon}</span>
                    <h3 className="text-xl font-bold text-slate-900">{dept.name}</h3>
                  </div>
                  <div className="space-y-2">
                    {dept.members.map((member, midx) => (
                      <div key={midx} className="px-4 py-2 rounded-lg bg-orange-50 border border-orange-100 text-sm font-semibold text-slate-700">
                        {member}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-up" delay={600}>
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
              Continue
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

