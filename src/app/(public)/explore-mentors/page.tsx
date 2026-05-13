import { MentorDiscovery } from '@/features/mentors/components/MentorDiscovery'
import { FilterProvider } from '@/features/filters/context/FilterContext'

export default function ExploreMentorsPage() {
  return (
    <main className="min-h-screen bg-[#f8f9ff] pt-[73px]">
      <FilterProvider>
        <MentorDiscovery />
      </FilterProvider>
    </main>
  )
}
