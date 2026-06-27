import { useOnboarding } from '../../../contexts/OnboardingContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ArrowRight, ArrowLeft, Star, Quote } from 'lucide-react'
import AnimatedSection from '@/components/marketing/AnimatedSection'

export default function TestimonialsStep() {
  const { nextStep, previousStep } = useOnboarding()

  const logos = ['Reviv', 'Baqala', 'Jalebi', 'KeySmash', 'PremiseHub', 'Tacava', 'Roveti', 'Ronin', 'StudentClub', 'Qortica']

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white px-6 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-sm font-bold text-blue-700 mb-6">
              <Star size={16} />
              WHAT OUR CUSTOMERS THINK OF US?
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tighter">
              Real Stories. Real Reviews. <br />
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Real Customers.</span>
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
          <Card className="border-2 border-blue-200 shadow-2xl mb-12">
            <div className="p-12 bg-gradient-to-br from-blue-50 to-purple-50 text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Star className="text-yellow-500 fill-yellow-500" size={32} />
                <Star className="text-yellow-500 fill-yellow-500" size={32} />
                <Star className="text-yellow-500 fill-yellow-500" size={32} />
                <Star className="text-yellow-500 fill-yellow-500" size={32} />
                <Star className="text-yellow-500 fill-yellow-500" size={32} />
              </div>
              <div className="text-5xl font-extrabold text-slate-900 mb-2">4.9</div>
              <div className="text-lg text-slate-600 mb-8">Based on 200+ Reviews on Trustpilot & Capterra</div>
              <div className="flex flex-wrap justify-center gap-6 items-center">
                {logos.map((logo, idx) => (
                  <div key={idx} className="px-6 py-3 rounded-xl bg-white border-2 border-slate-100 shadow-md font-bold text-slate-700">
                    {logo}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[1, 2, 3, 4].map((idx) => (
              <Card key={idx} className="border-2 border-slate-100 hover:border-blue-300 hover:shadow-xl transition-all duration-500">
                <div className="p-6">
                  <Quote className="text-blue-500 mb-4" size={32} />
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="text-yellow-500 fill-yellow-500" size={16} />
                    ))}
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    "Finanshels has completely transformed how we manage our finances. Their automation tools and expert guidance have saved us countless hours."
                  </p>
                  <div className="font-bold text-slate-900">Customer Name</div>
                  <div className="text-sm text-slate-600">CEO, Company Name</div>
                </div>
              </Card>
            ))}
          </div>
        </AnimatedSection>

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
              Take the Knowledge Check
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

