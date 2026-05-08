import { useOnboarding } from '../../../contexts/OnboardingContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ArrowRight, ArrowLeft, Target, Compass } from 'lucide-react'
import AnimatedSection from '../../AnimatedSection'

export default function VisionMissionStep() {
  const { nextStep, previousStep } = useOnboarding()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 px-6 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-50 to-orange-50 border border-blue-200 text-sm font-bold text-blue-700 mb-6">
              <Target size={16} />
              OUR VISION & MISSION
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tighter">
              Where We're <span className="bg-gradient-to-r from-blue-500 to-orange-600 bg-clip-text text-transparent">Heading</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <AnimatedSection animation="fade-right" delay={100}>
            <Card className="h-full border-2 border-blue-200 shadow-2xl overflow-hidden group hover:shadow-3xl transition-all duration-500">
              <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Compass className="text-white" size={28} />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-blue-900">OUR <span className="text-blue-600">VISION</span></div>
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  <h3 className="text-xl font-bold text-blue-900">Financial Mastery for Everyone</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Financial mastery is the idea that everyone, regardless of economic standing, should have full control of their finances. It's more than knowing how to balance a checkbook; financial mastery gives people the tools they need to stay on top of their finances, and improve their lives.
                  </p>
                </div>
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-left" delay={200}>
            <Card className="h-full border-2 border-orange-200 shadow-2xl overflow-hidden group hover:shadow-3xl transition-all duration-500">
              <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Target className="text-white" size={28} />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-orange-900">OUR <span className="text-orange-600">MISSION</span></div>
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  <h3 className="text-xl font-bold text-orange-900">Simplifying Financial Life</h3>
                  <p className="text-slate-700 leading-relaxed">
                    We are on a mission to simplify financial life for SMEs through Technology, Data and Design. Our focus is on providing tools and guidance for a new generation of founders to understand their finances seamlessly.
                  </p>
                </div>
              </div>
            </Card>
          </AnimatedSection>
        </div>

        <AnimatedSection animation="fade-up" delay={300}>
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
              Explore Our Values
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

