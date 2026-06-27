import { useOnboarding } from '../../../contexts/OnboardingContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ArrowRight, ArrowLeft, Building2, Globe, Users, Zap } from 'lucide-react'
import AnimatedSection from '@/components/marketing/AnimatedSection'

export default function CompanyOverviewStep() {
  const { nextStep, previousStep } = useOnboarding()

  const stats = [
    { icon: Users, value: '50+', label: 'Team Members', color: 'from-blue-500 to-cyan-600' },
    { icon: Globe, value: 'MENA', label: 'Region Focus', color: 'from-orange-500 to-amber-600' },
    { icon: Zap, value: '1000+', label: 'SMBs Served', color: 'from-purple-500 to-pink-600' },
    { icon: Building2, value: '5+', label: 'Years Experience', color: 'from-emerald-500 to-teal-600' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 px-6 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-100 border border-orange-200 text-sm font-bold text-orange-700 mb-6">
              <Building2 size={16} />
              COMPANY OVERVIEW
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tighter">
              Who <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">We Are</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <AnimatedSection key={idx} animation="fade-up" delay={idx * 100}>
              <Card className="border-2 border-slate-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-500 group">
                <div className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <stat.icon className="text-white" size={28} />
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600 font-semibold">{stat.label}</div>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-up" delay={400}>
          <Card className="border-2 border-orange-200 shadow-2xl overflow-hidden">
            <div className="p-12 bg-gradient-to-br from-orange-50 to-blue-50">
              <p className="text-lg text-slate-700 leading-relaxed text-center max-w-4xl mx-auto">
                At <span className="font-bold text-orange-600">Finanshels.com</span>, we're a fintech firm dedicated to <span className="font-bold">revolutionizing financial processes</span>. Our focus is on streamlining accounting and tax compliance, providing access to expert finance professionals, and delivering real-time financial insights to small and medium-sized businesses (SMBs) across the <span className="font-bold">MENA region</span>.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed text-center max-w-4xl mx-auto mt-6">
                Our platform aims to ease the burden of manual accounting tasks and the scarcity of automation faced by SMBs, while also tackling the challenge of limited access to qualified finance professionals.
              </p>
            </div>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={500}>
          <div className="flex justify-center gap-4 mt-12">
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
              Continue to Vision & Mission
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

