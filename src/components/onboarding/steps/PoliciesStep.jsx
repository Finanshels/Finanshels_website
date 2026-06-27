import { useOnboarding } from '../../../contexts/OnboardingContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ArrowRight, ArrowLeft, FileText, Calendar, GraduationCap, Baby, Plane, Home } from 'lucide-react'
import AnimatedSection from '@/components/marketing/AnimatedSection'

export default function PoliciesStep() {
  const { nextStep, previousStep } = useOnboarding()

  const policies = [
    { title: 'Leaves', icon: Calendar, color: 'from-blue-500 to-cyan-600', desc: '30 days annual leave' },
    { title: 'Annual Leave', icon: Plane, color: 'from-orange-500 to-amber-600', desc: 'Paid time off' },
    { title: 'POSH', icon: FileText, color: 'from-red-500 to-pink-600', desc: 'Prevention of Sexual Harassment' },
    { title: 'Learning and Development', icon: GraduationCap, color: 'from-purple-500 to-pink-600', desc: 'Continuous learning support' },
    { title: 'Maternity Leave', icon: Baby, color: 'from-emerald-500 to-teal-600', desc: 'Family support' },
    { title: 'Holiday', icon: Plane, color: 'from-indigo-500 to-purple-600', desc: 'Public holidays' },
    { title: 'Work From Home', icon: Home, color: 'from-amber-500 to-orange-600', desc: 'Flexible work options' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 px-6 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-100 border border-blue-200 text-sm font-bold text-blue-700 mb-6">
              <FileText size={16} />
              COMPANY POLICIES
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tighter">
              Policies That <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Support You</span>
            </h2>
            <p className="text-lg text-slate-600">
              We believe in creating a supportive and flexible work environment
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {policies.map((policy, idx) => (
            <AnimatedSection key={idx} animation="fade-up" delay={idx * 50}>
              <Card className="h-full border-2 border-slate-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-500 group">
                <div className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${policy.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <policy.icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{policy.title}</h3>
                  <p className="text-xs text-slate-600">{policy.desc}</p>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-up" delay={400}>
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
              Explore Tools & Systems
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

