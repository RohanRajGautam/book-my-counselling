import { MentorDiscovery } from '@/features/mentors/components/MentorDiscovery'
import { FilterProvider } from '@/features/filters/context/FilterContext'

export default function ExploreMentorsPage() {
  return (
    <main className="min-h-screen pt-[73px]">
      <FilterProvider>
        <MentorDiscovery />
      </FilterProvider>
    </main>
  )
}
