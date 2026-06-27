'use client'

import { OnboardingProvider, useOnboarding } from '@/contexts/OnboardingContext'
import Sidebar from './Sidebar'
import BadgeNotification from './BadgeNotification'
import ConfettiEffect from './ConfettiEffect'
import WelcomeStep from './steps/WelcomeStep'
import PersonalizeStep from './steps/PersonalizeStep'
import FounderMessageStep from './steps/FounderMessageStep'
import RoadmapStep from './steps/RoadmapStep'
import CompanyOverviewStep from './steps/CompanyOverviewStep'
import VisionMissionStep from './steps/VisionMissionStep'
import ValuesStep from './steps/ValuesStep'
import CustomerObsessionStep from './steps/CustomerObsessionStep'
import EarnTrustStep from './steps/EarnTrustStep'
import LearnFastStep from './steps/LearnFastStep'
import OwnershipStep from './steps/OwnershipStep'
import HighStandardsStep from './steps/HighStandardsStep'
import InnovateStep from './steps/InnovateStep'
import ThinkBigStep from './steps/ThinkBigStep'
import OKRSystemStep from './steps/OKRSystemStep'
import ServicesStep from './steps/ServicesStep'
import TeamStep from './steps/TeamStep'
import PoliciesStep from './steps/PoliciesStep'
import ToolsStep from './steps/ToolsStep'
import TestimonialsStep from './steps/TestimonialsStep'
import QuizStep from './steps/QuizStep'
import CompletionStep from './steps/CompletionStep'

const STEP_COMPONENTS = {
  'welcome': WelcomeStep,
  'personalize': PersonalizeStep,
  'founder-message': FounderMessageStep,
  'roadmap': RoadmapStep,
  'company': CompanyOverviewStep,
  'vision-mission': VisionMissionStep,
  'values': ValuesStep,
  'customer-obsession': CustomerObsessionStep,
  'earn-trust': EarnTrustStep,
  'learn-fast': LearnFastStep,
  'ownership': OwnershipStep,
  'high-standards': HighStandardsStep,
  'innovate': InnovateStep,
  'think-big': ThinkBigStep,
  'okr-system': OKRSystemStep,
  'services': ServicesStep,
  'team': TeamStep,
  'policies': PoliciesStep,
  'tools': ToolsStep,
  'testimonials': TestimonialsStep,
  'quiz': QuizStep,
  'completion': CompletionStep,
}

function OnboardingContent() {
  const { currentStep, showConfetti } = useOnboarding()
  const StepComponent = STEP_COMPONENTS[currentStep]

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {StepComponent ? <StepComponent /> : null}
      </main>
      <ConfettiEffect show={showConfetti} />
      <BadgeNotification />
    </div>
  )
}

export default function OnboardingShell() {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  )
}
