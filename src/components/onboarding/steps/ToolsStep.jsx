import { useOnboarding } from '../../../contexts/OnboardingContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ArrowRight, ArrowLeft, Zap } from 'lucide-react'
import AnimatedSection from '@/components/marketing/AnimatedSection'

export default function ToolsStep() {
  const { nextStep, previousStep } = useOnboarding()

  const tools = [
    { name: 'Keka', icon: '👥', category: 'HR Management', color: 'from-blue-500 to-cyan-600' },
    { name: 'Notion', icon: '📝', category: 'Documentation', color: 'from-purple-500 to-pink-600' },
    { name: 'Slack & WhatsApp', icon: '💬', category: 'Communication', color: 'from-emerald-500 to-teal-600' },
    { name: 'Canva', icon: '🎨', category: 'Design', color: 'from-orange-500 to-amber-600' },
    { name: 'ChatGPT', icon: '🤖', category: 'AI Assistant', color: 'from-indigo-500 to-purple-600' },
    { name: 'Google Drive', icon: '☁️', category: 'Cloud Storage', color: 'from-red-500 to-pink-600' },
    { name: 'Fathom AI', icon: '🎙️', category: 'Meeting Notes', color: 'from-yellow-500 to-orange-600' },
    { name: 'Maqsam', icon: '📊', category: 'Analytics', color: 'from-teal-500 to-cyan-600' },
    { name: 'Calendly', icon: '📅', category: 'Scheduling', color: 'from-pink-500 to-rose-600' },
    { name: 'FocusRO', icon: '🎯', category: 'Productivity', color: 'from-violet-500 to-purple-600' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 px-6 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-100 border border-orange-200 text-sm font-bold text-orange-700 mb-6">
              <Zap size={16} />
              TOOLS AND SYSTEMS
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tighter">
              Your <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">Tech Stack</span>
            </h2>
            <p className="text-lg text-slate-600">
              Essential tools you'll be using daily
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {tools.map((tool, idx) => (
            <AnimatedSection key={idx} animation="fade-up" delay={idx * 50}>
              <Card className="h-full border-2 border-slate-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-500 group cursor-pointer">
                <div className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 text-3xl`}>
                    {tool.icon}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{tool.name}</h3>
                  <p className="text-xs text-slate-600">{tool.category}</p>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-up" delay={500}>
          <Card className="border-2 border-blue-200 shadow-2xl">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 text-center">
              <p className="text-lg text-slate-700 leading-relaxed">
                You'll receive access credentials and training for all these tools during your first week. Don't worry if you're not familiar with some of them - we'll help you get up to speed!
              </p>
            </div>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={600}>
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

