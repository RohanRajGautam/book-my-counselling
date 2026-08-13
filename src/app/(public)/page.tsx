import { HeroSection } from '@/features/home/components/HeroSection'
import { BecomeCounsellorSection } from '@/features/home/components/BecomeCounsellorSection'
import { FilterProvider } from '@/features/filters/context/FilterContext'
import { Statistics } from '@/features/home/components/Statistics'
import { TestimonialsSection } from '@/features/home/components/TestimonialsSection'
import { FeaturedMentorsSection } from '@/features/home/components/FeaturedMentorsSection'
import { HowItWorksFaq } from '@/features/how-it-works/components/HowItWorksFaq'
import { MentorCompaniesMarquee } from '@/features/home/components/MentorCompaniesMarquee'
import { ThreePillarsSection } from '@/features/home/components/ThreePillarsSection'

export default function Home() {
  return (
    <main className="min-h-screen pt-28 sm:pt-32">
      <FilterProvider>
        <HeroSection />
        <MentorCompaniesMarquee />
        <ThreePillarsSection />
        <Statistics />
        <FeaturedMentorsSection />
        <TestimonialsSection />
        <BecomeCounsellorSection />
        <HowItWorksFaq />
      </FilterProvider>
    </main>
  )
}
