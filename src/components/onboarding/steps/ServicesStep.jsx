import { useOnboarding } from '../../../contexts/OnboardingContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ArrowRight, ArrowLeft, Briefcase, Package, Building2 } from 'lucide-react'
import AnimatedSection from '@/components/marketing/AnimatedSection'

export default function ServicesStep() {
  const { nextStep, previousStep } = useOnboarding()

  const services = [
    { title: 'Bookkeeping', icon: '📚' },
    { title: 'Tax Consultancy', icon: '💼' },
    { title: 'Fractional CFO', icon: '👔' },
    { title: 'Audit & Liquidation', icon: '📊' },
    { title: 'Compliance Services', icon: '✅' }
  ]

  const products = [
    { title: 'Client Portal', icon: '📋' },
    { title: 'AI Bookkeeper', icon: '🧾' },
    { title: 'Hala AI', icon: '🔧' },
    { title: 'Practice Management Software', icon: '👨‍💼' }
  ]

  const industries = [
    { title: 'Startups', icon: '🚀' },
    { title: 'SMEs', icon: '🏢' },
    { title: 'Ecommerce', icon: '🛒' },
    { title: 'Restaurant', icon: '🍽️' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 px-6 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-100 border border-orange-200 text-sm font-bold text-orange-700 mb-6">
              <Briefcase size={16} />
              OUR SERVICES
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tighter">
              What We <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">Offer</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <AnimatedSection animation="fade-up" delay={100}>
            <Card className="border-2 border-blue-200 shadow-xl h-full">
              <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase className="text-blue-600" size={28} />
                  <h3 className="text-2xl font-extrabold text-slate-900">By Services</h3>
                </div>
                <div className="space-y-3">
                  {services.map((service, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-blue-100">
                      <span className="text-2xl">{service.icon}</span>
                      <span className="font-semibold text-slate-900">{service.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <Card className="border-2 border-purple-200 shadow-xl h-full">
              <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="text-purple-600" size={28} />
                  <h3 className="text-2xl font-extrabold text-slate-900">By Products</h3>
                </div>
                <div className="space-y-3">
                  {products.map((product, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-purple-100">
                      <span className="text-2xl">{product.icon}</span>
                      <span className="font-semibold text-slate-900">{product.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={300}>
            <Card className="border-2 border-orange-200 shadow-xl h-full">
              <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="text-orange-600" size={28} />
                  <h3 className="text-2xl font-extrabold text-slate-900">Industries Served</h3>
                </div>
                <div className="space-y-3">
                  {industries.map((industry, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-orange-100">
                      <span className="text-2xl">{industry.icon}</span>
                      <span className="font-semibold text-slate-900">{industry.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </AnimatedSection>
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
              Meet the Team
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

