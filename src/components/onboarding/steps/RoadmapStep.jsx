import { useOnboarding } from '../../../contexts/OnboardingContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ArrowRight, ArrowLeft, Sparkles, Video, MessageCircle, TrendingUp } from 'lucide-react'
import AnimatedSection from '../../AnimatedSection'

export default function RoadmapStep() {
  const { userData, nextStep, previousStep } = useOnboarding()

  const phases = [
    {
      title: 'Welcome to Your Onboarding Journey',
      icon: Sparkles,
      color: 'from-blue-500 to-cyan-600',
      description: 'Embark on an exciting path to integrate our team and culture.'
    },
    {
      title: 'Access to Essential Guidance',
      icon: TrendingUp,
      color: 'from-orange-500 to-amber-600',
      description: 'Receive all the tools and credentials you need to get started effectively.'
    },
    {
      title: 'A Conversation with Our Founder',
      icon: MessageCircle,
      color: 'from-purple-500 to-pink-600',
      description: 'Hear insights and vision directly from the visionary driving Finanshels\' success.'
    },
    {
      title: 'Meet Your Buddy',
      icon: Video,
      color: 'from-emerald-500 to-teal-600',
      description: 'Connect with your designated buddy who will guide you throughout your onboarding.'
    },
    {
      title: 'Leadership Connections',
      icon: TrendingUp,
      color: 'from-indigo-500 to-blue-600',
      description: 'Build meaningful connections, understand expectations and set the stage for success.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-sm font-bold text-blue-700 mb-6">
              <TrendingUp size={16} />
              YOUR ONBOARDING PLAN
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tighter">
              Your <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Roadmap</span> to Success
            </h2>
            <p className="text-lg text-slate-600">
              Here's what you can expect in your first days, {userData.name}
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {phases.map((phase, idx) => (
            <AnimatedSection key={idx} animation="fade-up" delay={idx * 100}>
              <Card className="h-full border-2 border-slate-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-500 group">
                <div className="p-6 flex flex-col h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${phase.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <phase.icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 leading-tight">
                    {phase.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {phase.description}
                  </p>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-up" delay={500}>
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
              Let's Get Started
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

