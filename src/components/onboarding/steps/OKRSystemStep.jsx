import { useOnboarding } from '../../../contexts/OnboardingContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ArrowRight, ArrowLeft, Target, TrendingUp } from 'lucide-react'
import AnimatedSection from '@/components/marketing/AnimatedSection'

export default function OKRSystemStep() {
  const { nextStep, previousStep } = useOnboarding()

  const okrs = [
    'Achieve AED 72M in Annual Revenue and Become a Category Leader',
    'Achieve 50% Market Visibility & Build a Leading AI-Powered Financial Automation Brand',
    'Build a Scalable Team & High-Performance Culture',
    'Raise $2M in Growth Capital to Scale AI-Powered Financial Automation'
  ]

  const howToAchieve = [
    { title: 'CRM Optimization', desc: 'Automate 70% of lead qualification in Zoho CRM' },
    { title: 'Improve Lead Servicing Time', desc: 'Reduce response time and improve conversion' },
    { title: 'Facilitate Cross-selling & Upselling', desc: 'Make it easier in CRM' },
    { title: 'Refine Audience Segmentation', desc: 'Into SME niches Goals, real, service-based businesses' },
    { title: 'Revamp Website UX/UI', desc: 'For better conversions with dynamic CTAs and AI-powered lead nurturing' },
    { title: 'Launch Employer Brand', desc: 'Thought Leadership Strategy' },
    { title: 'Expand Employer Branding Initiatives', desc: 'Build strong talent pipeline' },
    { title: 'Investor Engagement & Follow-Ups', desc: 'Secure funding for growth' },
    { title: 'Showcase Product & Traction', desc: 'In investor-focused events & PR' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white px-6 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-sm font-bold text-blue-700 mb-6">
              <Target size={16} />
              FINANSHELS OKR SYSTEM
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tighter">
              Our <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Goals</span> & Objectives
            </h2>
            <p className="text-lg text-slate-600">
              Ambitious targets we're working towards together
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {okrs.map((okr, idx) => (
              <Card key={idx} className="border-2 border-slate-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-500">
                <div className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Target className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900 font-bold leading-relaxed">{okr}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={200}>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="text-white" size={24} />
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900">How to Achieve</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {howToAchieve.map((item, idx) => (
                <Card key={idx} className="border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300">
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50">
                    <div className="text-sm font-bold text-slate-900 mb-1">{item.title}</div>
                    <div className="text-xs text-slate-600">{item.desc}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={300}>
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
              Continue
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

