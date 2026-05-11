import { MentorDiscovery } from '@/features/mentors/components/MentorDiscovery'
import { FilterProvider } from '@/features/filters/context/FilterContext'
import { ExploreMentorsHero } from '@/features/explore-mentors/components/ExploreMentorsHero'
import { ExploreMentorsSearch } from '@/features/explore-mentors/components/ExploreMentorsSearch'

export default function ExploreMentorsPage() {
  return (
    <>
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
