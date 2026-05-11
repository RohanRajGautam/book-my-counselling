import { Navbar } from '@/components/layout/Navbar'
import { HeroSection } from '@/features/home/components/HeroSection'
import { BecomeCounsellorSection } from '@/features/home/components/BecomeCounsellorSection'
import { FilterProvider } from '@/features/filters/context/FilterContext'
import { Statistics } from '@/features/home/components/Statistics'
import { FeaturedMentors } from '@/features/home/components/FeaturedMentors'
import { TestimonialsSection } from '@/features/home/components/TestimonialsSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <FilterProvider>
          <HeroSection />
          <FeaturedMentors />
          <Statistics />
          <TestimonialsSection />
          <BecomeCounsellorSection />
        </FilterProvider>
      </main>
    </>
  )
}
