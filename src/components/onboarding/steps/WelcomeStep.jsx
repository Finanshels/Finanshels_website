import { useOnboarding } from '../../../contexts/OnboardingContext'
import { Button } from '../../ui/Button'
import { ArrowRight, Sparkles, Mail } from 'lucide-react'
import AnimatedSection from '@/components/marketing/AnimatedSection'

export default function WelcomeStep() {
  const { nextStep } = useOnboarding()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 text-white flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="absolute top-20 left-10 w-96 h-96 bg-orange-500/20 rounded-full filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/20 rounded-full filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <AnimatedSection animation="fade-down">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-sm font-bold mb-8 shadow-xl">
            <Sparkles size={18} className="text-yellow-300" />
            UAE's Leading Accounting & Tax Advisory Firm
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight" style={{ letterSpacing: '0.05em' }}>
            WELCOME TO
            <br />
            <span className="bg-gradient-to-r from-orange-200 via-amber-200 to-orange-200 bg-clip-text text-transparent">
              FINANSHELS
            </span>
          </h1>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={200}>
          <p className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-4 font-medium leading-relaxed">
            Accounting - Tax - Audit & Liquidation - Compliance - CFO Services
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={300}>
          <p className="text-base sm:text-lg text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            Welcome to Finanshels! We're thrilled to have you join our team. Today marks the beginning of your exciting journey with us, and we can't wait to see the incredible contributions you'll make. In this onboarding presentation, we'll provide you with all the information you need to get started and succeed in your role.
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={400}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              onClick={nextStep}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-12 py-6 text-lg shadow-2xl"
            >
              Start Your Journey
              <ArrowRight className="ml-2" size={24} />
            </Button>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={500}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="text-5xl font-extrabold bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">22</div>
              <div className="text-base text-white font-semibold">Interactive Steps</div>
              <div className="text-sm text-white/60 mt-1">To complete your journey</div>
            </div>
            <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="text-5xl font-extrabold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">6</div>
              <div className="text-base text-white font-semibold">Achievement Badges</div>
              <div className="text-sm text-white/60 mt-1">Unlock as you progress</div>
            </div>
            <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="text-5xl font-extrabold bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">~30</div>
              <div className="text-base text-white font-semibold">Minutes Duration</div>
              <div className="text-sm text-white/60 mt-1">At your own pace</div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={600}>
          <div className="mt-12">
            <a 
              href="mailto:hr@finanshels.com" 
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-orange-300 transition-colors group"
            >
              <Mail size={16} className="group-hover:scale-110 transition-transform" />
              <span>hr@finanshels.com</span>
            </a>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

