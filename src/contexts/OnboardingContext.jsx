'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const OnboardingContext = createContext()

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (!context) throw new Error('useOnboarding must be used within OnboardingProvider')
  return context
}

const ONBOARDING_STEPS = [
  { id: 'welcome', title: 'Welcome', icon: '👋', required: true },
  { id: 'personalize', title: 'Personalize', icon: '✨', required: true },
  { id: 'founder-message', title: 'Founder Message', icon: '💬', required: true },
  { id: 'roadmap', title: 'Your Roadmap', icon: '🗺️', required: true },
  { id: 'company', title: 'About Us', icon: '🏢', required: true },
  { id: 'vision-mission', title: 'Vision & Mission', icon: '🎯', required: true },
  { id: 'values', title: 'Our Values', icon: '💎', required: true },
  { id: 'customer-obsession', title: 'Customer Obsession', icon: '❤️', required: false },
  { id: 'earn-trust', title: 'Earn Trust', icon: '🤝', required: false },
  { id: 'learn-fast', title: 'Learn Fast', icon: '📚', required: false },
  { id: 'ownership', title: 'Ownership', icon: '👑', required: false },
  { id: 'high-standards', title: 'High Standards', icon: '⭐', required: false },
  { id: 'innovate', title: 'Innovate', icon: '🚀', required: false },
  { id: 'think-big', title: 'Think Big', icon: '💡', required: false },
  { id: 'okr-system', title: 'OKR System', icon: '📊', required: true },
  { id: 'services', title: 'Our Services', icon: '🛠️', required: true },
  { id: 'team', title: 'Meet the Team', icon: '👥', required: true },
  { id: 'policies', title: 'Company Policies', icon: '📋', required: true },
  { id: 'tools', title: 'Tools & Systems', icon: '⚙️', required: true },
  { id: 'testimonials', title: 'Customer Stories', icon: '⭐', required: false },
  { id: 'quiz', title: 'Knowledge Check', icon: '🎓', required: true },
  { id: 'completion', title: 'Congratulations!', icon: '🎉', required: true }
]

const BADGES = [
  { id: 'first-step', title: 'First Step', icon: '👣', condition: (progress) => progress.completedSteps.length >= 1 },
  { id: 'values-master', title: 'Values Master', icon: '💎', condition: (progress) => progress.completedSteps.filter(s => s.includes('obsession') || s.includes('trust') || s.includes('learn') || s.includes('ownership') || s.includes('standards') || s.includes('innovate') || s.includes('think')).length >= 5 },
  { id: 'quiz-ace', title: 'Quiz Ace', icon: '🏆', condition: (progress) => (progress.quizScore || 0) >= 80 },
  { id: 'speed-runner', title: 'Speed Runner', icon: '⚡', condition: (progress) => progress.timeSpent && progress.timeSpent < 30 },
  { id: 'completionist', title: 'Completionist', icon: '💯', condition: (progress) => progress.progress === 100 },
  { id: 'explorer', title: 'Explorer', icon: '🗺️', condition: (progress) => progress.completedSteps.length >= 10 }
]

export const OnboardingProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState('welcome')
  const [completedSteps, setCompletedSteps] = useState([])
  const [userData, setUserData] = useState({ name: '', role: '', department: '', startDate: new Date().toISOString().split('T')[0] })
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizScore, setQuizScore] = useState(0)
  const [badges, setBadges] = useState([])
  const [startTime] = useState(Date.now())
  const [timeSpent, setTimeSpent] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // FIX-060: guard localStorage access — JSON.parse on a corrupt value, or
    // getItem in privacy mode / sandboxed iframes, used to throw and white-screen
    // the whole onboarding flow.
    let saved = null
    try {
      saved = localStorage.getItem('finanshels-onboarding')
    } catch {
      saved = null
    }
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setCurrentStep(data.currentStep || 'welcome')
        setCompletedSteps(data.completedSteps || [])
        setUserData(data.userData || userData)
        setQuizAnswers(data.quizAnswers || {})
        setQuizScore(data.quizScore || 0)
        setBadges(data.badges || [])
      } catch {
        // Corrupt saved state — ignore and start fresh.
      }
    }
  }, [])

  useEffect(() => {
    const progress = {
      currentStep,
      completedSteps,
      userData,
      quizAnswers,
      quizScore,
      badges,
      timeSpent,
      progress: calculateProgress()
    }
    try {
      localStorage.setItem('finanshels-onboarding', JSON.stringify(progress))
    } catch {
      // Storage unavailable (private mode / quota exceeded) — non-fatal.
    }
    checkBadges(progress)
  }, [currentStep, completedSteps, userData, quizAnswers, quizScore, badges, timeSpent])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 60000))
    }, 60000)
    return () => clearInterval(interval)
  }, [startTime])

  const checkBadges = (progress) => {
    BADGES.forEach(badge => {
      if (!badges.find(b => b.id === badge.id) && badge.condition(progress)) {
        setBadges(prev => [...prev, badge])
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
    })
  }

  const calculateProgress = () => {
    // FIX-060: 'completion' is the celebration screen, not a task to complete, so
    // it can never be marked done — previously capping progress at 13/14 = 93%
    // and making the 100% "completionist" badge unreachable. Exclude it.
    const requiredSteps = ONBOARDING_STEPS.filter(s => s.required && s.id !== 'completion')
    const completedRequired = completedSteps.filter(cs =>
      requiredSteps.find(rs => rs.id === cs)
    )
    if (requiredSteps.length === 0) return 0
    return Math.round((completedRequired.length / requiredSteps.length) * 100)
  }

  const completeStep = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId])
    }
  }

  const goToStep = (stepId) => {
    setCurrentStep(stepId)
  }

  const nextStep = () => {
    const currentIndex = ONBOARDING_STEPS.findIndex(s => s.id === currentStep)
    if (currentIndex < ONBOARDING_STEPS.length - 1) {
      completeStep(currentStep)
      setCurrentStep(ONBOARDING_STEPS[currentIndex + 1].id)
    }
  }

  const previousStep = () => {
    const currentIndex = ONBOARDING_STEPS.findIndex(s => s.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(ONBOARDING_STEPS[currentIndex - 1].id)
    }
  }

  const updateUserData = (data) => {
    setUserData(prev => ({ ...prev, ...data }))
  }

  const updateQuizAnswers = (questionId, answer) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const resetOnboarding = () => {
    setCurrentStep('welcome')
    setCompletedSteps([])
    setUserData({ name: '', role: '', department: '', startDate: new Date().toISOString().split('T')[0] })
    setQuizAnswers({})
    setQuizScore(0)
    setBadges([])
    try {
      localStorage.removeItem('finanshels-onboarding')
    } catch {
      // ignore
    }
  }

  const value = {
    ONBOARDING_STEPS,
    currentStep,
    completedSteps,
    userData,
    quizAnswers,
    quizScore,
    badges,
    timeSpent,
    showConfetti,
    progress: calculateProgress(),
    setCurrentStep,
    completeStep,
    goToStep,
    nextStep,
    previousStep,
    updateUserData,
    updateQuizAnswers,
    setQuizScore,
    resetOnboarding
  }

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}

