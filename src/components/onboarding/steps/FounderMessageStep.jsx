import Image from 'next/image'
import { useOnboarding } from '../../../contexts/OnboardingContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ArrowRight, ArrowLeft, Play, Quote } from 'lucide-react'
import AnimatedSection from '../../AnimatedSection'

export default function FounderMessageStep() {
  const { userData, nextStep, previousStep } = useOnboarding()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 px-6 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-100 border border-orange-200 text-sm font-bold text-orange-700 mb-6">
              <Quote size={16} />
              NOTE FROM FOUNDER
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tighter">
              Welcome, <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">{userData.name}!</span>
            </h2>
            <p className="text-lg text-slate-600">
              A personal message for you
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-[400px,1fr] gap-8 items-start">
          <AnimatedSection animation="fade-right" delay={100}>
            <Card className="border-2 border-orange-200 shadow-2xl overflow-hidden bg-white sticky top-8">
              <div className="relative h-[450px] bg-gradient-to-br from-slate-50 to-orange-50 overflow-hidden">
                <Image
                  src="/shafeekh.png"
                  alt="Mohammed Shafeekh - CEO & Founder"
                  fill
                  sizes="(min-width: 1024px) 400px, 100vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="p-6 bg-white border-t-2 border-orange-100">
                <h3 className="font-bold text-slate-900 text-xl mb-1">Mohammed Shafeekh</h3>
                <p className="text-orange-600 text-sm font-semibold">CEO & Founder, Finanshels</p>
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-left" delay={200}>
            <div className="space-y-6">
              <div className="p-8 rounded-2xl bg-white border-2 border-slate-100 shadow-lg">
                <Quote className="text-orange-500 mb-4" size={32} />
                <p className="text-slate-700 leading-relaxed text-base mb-4">
                  Our approach is grounded in excellence, where every member of our team plays an integral role in delivering unparalleled financial services to a global clientele. We don't settle for mediocrity; we aim for excellence through innovation and automation.
                </p>
                <p className="text-slate-700 leading-relaxed text-base">
                  By embracing the future of finance, we free ourselves to focus on what truly matters—delivering exceptional customer service and fostering continuous improvement.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-blue-50 border-2 border-orange-100 shadow-md">
                <p className="text-slate-800 leading-relaxed font-medium text-lg italic">
                  "Together, let us redefine financial advisory, let us empower the future of finance, and let us, as Finanshels, illuminate the path towards financial mastery for all."
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={previousStep}
                  className="bg-white hover:bg-slate-50 text-slate-900 font-bold text-lg shadow-xl border-2 border-slate-200"
                >
                  <ArrowLeft className="mr-2" size={20} />
                  Back
                </Button>
                <Button
                  size="lg"
                  onClick={nextStep}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-xl"
                >
                  Continue to Roadmap
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}

