import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/features/home/components/HeroSection'

import { BecomeCounsellorSection } from '@/features/home/components/BecomeCounsellorSection'

import { MentorDiscovery } from '@/features/mentors/components/MentorDiscovery'
import { FilterProvider } from '@/features/filters/context/filter-context'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <FilterProvider>
          <HeroSection />
          <MentorDiscovery />
        </FilterProvider>
      </main>
      <BecomeCounsellorSection />
      <Footer />
    </>
  )
}
