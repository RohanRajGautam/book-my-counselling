import { Navbar } from '@/components/layout/Navbar'

import { MentorDiscovery } from '@/features/mentors/components/MentorDiscovery'
import { FilterProvider } from '@/features/filters/context/filter-context'
import { HeroSection } from '@/features/home/components/HeroSection'
import { ExploreMentorsHero } from '@/features/explore-mentors/components/ExploreMentorsHero'
import { ExploreMentorsSearch } from '@/features/explore-mentors/components/ExploreMentorsSearch'

export default function ExploreMentorsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <FilterProvider>
          <ExploreMentorsHero />
          <ExploreMentorsSearch />
          <MentorDiscovery />
        </FilterProvider>
      </main>
    </>
  )
}
