import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HowItWorksHero } from '@/features/how-it-works/components/HowItWorksHero'
import { HowItWorksSteps } from '@/features/how-it-works/components/HowItWorksSteps'
import { VerifiedMentorSection } from '@/features/how-it-works/components/VerifiedMentorSection'
import { HowItWorksFaq } from '@/features/how-it-works/components/HowItWorksFaq'
import { GetStartedSection } from '@/components/common/GetStartedSection'

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-hidden bg-[#f7f8ff] pt-20">
        <HowItWorksHero />
        <HowItWorksSteps />
        <VerifiedMentorSection />
        <HowItWorksFaq />
        <GetStartedSection />
      </main>
      <Footer />
    </>
  )
}
