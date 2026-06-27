import { requireAdminAuth } from '@/lib/cms/adminAuth'
import OnboardingShell from '@/components/onboarding/OnboardingShell'

export const dynamic = 'force-dynamic'

export default async function OnboardingPage() {
  await requireAdminAuth('viewer')
  return <OnboardingShell />
}
