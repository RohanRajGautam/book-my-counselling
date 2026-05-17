import { HeroSection } from '@/features/home/components/HeroSection'
import { BecomeCounsellorSection } from '@/features/home/components/BecomeCounsellorSection'
import { FilterProvider } from '@/features/filters/context/FilterContext'
import { Statistics } from '@/features/home/components/Statistics'
import { FeaturedMentors } from '@/features/home/components/FeaturedMentors'
import { TestimonialsSection } from '@/features/home/components/TestimonialsSection'
import { ExclusiveEventsSection } from '@/features/home/components/ExclusiveEventsSection'
// import { MentorCompaniesMarquee } from '@/features/home/components/MentorCompaniesMarquee'
// import { QuotesMarquee } from '@/features/home/components/QuotesMarquee'
import { HowItWorksFaq } from '@/features/how-it-works/components/HowItWorksFaq'

export default function Home() {
  return (
    <>
      <main className="sm:pt min-h-screen pt-28">
        <FilterProvider>
          <HeroSection />
          <FeaturedMentors />
          <ExclusiveEventsSection />
          {/* <MentorCompaniesMarquee /> */}
          <Statistics />
          {/* <QuotesMarquee /> */}
          <TestimonialsSection />
          <BecomeCounsellorSection />
          <HowItWorksFaq />
        </FilterProvider>
      </main>
    </>
  )
}
