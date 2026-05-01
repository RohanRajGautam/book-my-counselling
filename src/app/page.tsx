import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { FiltersSidebar } from '@/components/sections/FiltersSidebar'
import { MentorGrid } from '@/components/sections/MentorGrid'
import { BecomeCounsellorSection } from '@/components/sections/BecomeCounsellorSection'
import { FilterProvider } from '@/contexts/FilterContext'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <HeroSection />

        <FilterProvider>
          {/* Discovery Layout */}
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-8 pb-24 lg:grid-cols-12">
            {/* Sidebar Filters */}
            <div className="lg:col-span-3">
              <FiltersSidebar />
            </div>

            {/* Mentor Grid */}
            <div className="lg:col-span-9">
              <MentorGrid />
            </div>
          </div>
        </FilterProvider>
      </main>
      <BecomeCounsellorSection />
      <Footer />
    </>
  )
}
