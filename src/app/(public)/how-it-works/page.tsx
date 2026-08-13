import { HowItWorksHero } from '@/features/how-it-works/components/HowItWorksHero'
import { HowItWorksSteps } from '@/features/how-it-works/components/HowItWorksSteps'
import { GetStartedSection } from '@/components/common/GetStartedSection'

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen pt-18">
      <HowItWorksHero />
      <HowItWorksSteps />
      <GetStartedSection />
    </main>
  )
}
