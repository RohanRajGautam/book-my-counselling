import { HeroSection } from '@/features/home/components/HeroSection'
import { BecomeCounsellorSection } from '@/features/home/components/BecomeCounsellorSection'
import { FilterProvider } from '@/features/filters/context/FilterContext'
import { Statistics } from '@/features/home/components/Statistics'
import { TestimonialsSection } from '@/features/home/components/TestimonialsSection'
import { ExclusiveEventsSection } from '@/features/home/components/ExclusiveEventsSection'
import { HowItWorksFaq } from '@/features/how-it-works/components/HowItWorksFaq'
import { MentorCompaniesMarquee } from '@/features/home/components/MentorCompaniesMarquee'

export default function Home() {
  return (
    <main className="min-h-screen pt-28 sm:pt-32">
      <FilterProvider>
        <HeroSection />
        <MentorCompaniesMarquee />
        <ExclusiveEventsSection />
        <Statistics />
        <TestimonialsSection />
        <BecomeCounsellorSection />
        <HowItWorksFaq />
      </FilterProvider>
    </main>
  )
}
