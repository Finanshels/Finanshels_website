import { useState } from 'react'
import { useOnboarding } from '../../../contexts/OnboardingContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ArrowRight, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'
import AnimatedSection from '@/components/marketing/AnimatedSection'

export default function QuizStep() {
  const { updateQuizAnswers, setQuizScore, nextStep, previousStep } = useOnboarding()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const questions = [
    {
      id: 1,
      question: 'What is Finanshels\' primary focus?',
      options: [
        'Social Media Marketing',
        'Streamlining accounting and tax compliance for SMBs',
        'E-commerce Solutions',
        'Mobile App Development'
      ],
      correct: 1
    },
    {
      id: 2,
      question: 'Which region does Finanshels primarily serve?',
      options: ['North America', 'Europe', 'MENA Region', 'Asia Pacific'],
      correct: 2
    },
    {
      id: 3,
      question: 'What is one of Finanshels\' core values?',
      options: ['Customer Obsession', 'Profit Maximization', 'Speed over Quality', 'Individual Glory'],
      correct: 0
    },
    {
      id: 4,
      question: 'What does "Think Big" value encourage?',
      options: [
        'Working long hours',
        'Pursuing ambitious goals and anticipating future needs',
        'Avoiding risks',
        'Following competitors'
      ],
      correct: 1
    },
    {
      id: 5,
      question: 'How many core values does Finanshels have?',
      options: ['3', '5', '7', '10'],
      correct: 2
    }
  ]

  const handleAnswer = (optionIdx) => {
    const newAnswers = { ...answers, [currentQ]: optionIdx }
    setAnswers(newAnswers)
    updateQuizAnswers(currentQ, optionIdx)

    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 500)
    } else {
      const score = Object.keys(newAnswers).reduce((acc, qIdx) => {
        return acc + (newAnswers[qIdx] === questions[qIdx].correct ? 1 : 0)
      }, 0)
      const percentage = Math.round((score / questions.length) * 100)
      setQuizScore(percentage)
      setShowResults(true)
    }
  }

  const handleComplete = () => {
    nextStep()
  }

  if (showResults) {
    const score = Object.keys(answers).reduce((acc, qIdx) => {
      return acc + (answers[qIdx] === questions[qIdx].correct ? 1 : 0)
    }, 0)
    const percentage = Math.round((score / questions.length) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white px-6 py-12 sm:py-16 flex items-center">
      <div className="max-w-3xl mx-auto w-full">
          <AnimatedSection animation="fade-up">
            <Card className="border-2 border-emerald-200 shadow-2xl">
              <div className="p-12 bg-gradient-to-br from-emerald-50 to-teal-50 text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 shadow-2xl">
                  <div className="text-5xl font-extrabold text-white">{percentage}%</div>
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
                  {percentage >= 80 ? '🎉 Excellent!' : percentage >= 60 ? '👍 Good Job!' : '💪 Keep Learning!'}
                </h2>
                <p className="text-xl text-slate-700 mb-8">
                  You scored {score} out of {questions.length}
                </p>
                
                <div className="space-y-4 mb-8 text-left">
                  {questions.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white border-2 border-slate-100">
                      <div className="flex items-start gap-3">
                        {answers[idx] === q.correct ? (
                          <CheckCircle2 className="text-emerald-500 flex-shrink-0 mt-1" size={24} />
                        ) : (
                          <XCircle className="text-red-500 flex-shrink-0 mt-1" size={24} />
                        )}
                        <div>
                          <div className="font-bold text-slate-900 mb-1">{q.question}</div>
                          <div className="text-sm text-slate-600">
                            Your answer: {q.options[answers[idx]]}
                            {answers[idx] !== q.correct && (
                              <div className="text-emerald-600 mt-1">Correct: {q.options[q.correct]}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
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
                    onClick={handleComplete}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold px-12 text-lg shadow-xl"
                  >
                    Complete Onboarding
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </div>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    )
  }

  const question = questions[currentQ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white px-6 py-12 sm:py-16 flex items-center">
      <div className="max-w-3xl mx-auto w-full">
        <AnimatedSection animation="fade-down">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-sm font-bold text-blue-700 mb-6">
              Question {currentQ + 1} of {questions.length}
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-8">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
          <Card className="border-2 border-blue-200 shadow-2xl">
            <div className="p-8 sm:p-12 bg-gradient-to-br from-blue-50 to-purple-50">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8 text-center">
                {question.question}
              </h3>
              <div className="space-y-4">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className="w-full p-6 rounded-xl bg-white border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 text-left font-semibold text-slate-900 hover:scale-105"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      {option}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  )
}

