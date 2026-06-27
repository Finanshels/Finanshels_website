import { useOnboarding } from '../../../contexts/OnboardingContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ArrowRight, ArrowLeft, BookOpen, CheckCircle2 } from 'lucide-react'
import AnimatedSection from '@/components/marketing/AnimatedSection'

export default function LearnFastStep() {
  const { nextStep, previousStep } = useOnboarding()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white px-6 py-12 sm:py-16">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="text-center mb-12">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 shadow-2xl">
              <BookOpen className="text-white" size={48} />
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tighter">
              <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">LEARN FAST</span>{' '}
              <span className="text-slate-900">AND BE CURIOUS</span>
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
          <Card className="border-2 border-purple-200 shadow-2xl mb-8">
            <div className="p-12 bg-gradient-to-br from-purple-50 to-pink-50 space-y-6">
              <p className="text-lg text-slate-700 leading-relaxed">
                At Finanshels, we commit to fostering a <span className="font-bold text-purple-600">culture of curiosity and rapid learning</span> across all levels of the organization. We encourage our team members to explore, ask questions, and embrace the unknown to enhance innovation, improve processes, and drive personal and professional growth.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Learning is a lifelong journey, and it's vital to keep your mind open and curious. Embrace every opportunity to grow, and evolve whether it's reading a book taking a course or simply exploring new hobbies continuous learning keeps your mind sharp and your spirit young.
              </p>
              <div className="bg-white p-6 rounded-xl border-2 border-purple-200">
                <p className="text-lg text-slate-700 leading-relaxed font-semibold text-center">
                  Very important: if you're not curious if you're not always learning you're falling behind you have to read to have to learn.
                </p>
              </div>
            </div>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={150}>
          <Card className="border-2 border-purple-200 shadow-2xl mb-8">
            <div className="p-8 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <BookOpen className="text-purple-500" size={28} />
                How to Develop Fast Learning
              </h3>
              <div className="space-y-4">
                {[
                  'Read books, articles, and industry news regularly',
                  'Ask "why" and "how" questions frequently',
                  'Learn from failures and document lessons learned',
                  'Seek feedback actively and implement it',
                  'Attend workshops, webinars, and training sessions',
                  'Teach others what you learn to reinforce knowledge'
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-purple-50 border border-purple-100">
                    <CheckCircle2 className="text-purple-500 flex-shrink-0 mt-1" size={24} />
                    <span className="text-slate-700 font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={200}>
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
              Next Value
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

