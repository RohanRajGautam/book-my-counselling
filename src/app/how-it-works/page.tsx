import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HowItWorksHero } from '@/components/sections/HowItWorksHero'
import { HowItWorksSteps } from '@/components/sections/HowItWorksSteps'
import { VerifiedMentorSection } from '@/components/sections/VerifiedMentorSection'
import { HowItWorksFaq } from '@/components/sections/HowItWorksFaq'

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-hidden bg-[#f7f8ff] pt-20">
        <HowItWorksHero />
        <HowItWorksSteps />
        <VerifiedMentorSection />
        <HowItWorksFaq />
      </main>
      <Footer />
    </>
  )
}
