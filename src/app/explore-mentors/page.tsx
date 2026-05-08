import { Navbar } from '@/components/layout/Navbar'

import { MentorDiscovery } from '@/features/mentors/components/MentorDiscovery'
import { FilterProvider } from '@/features/filters/context/filter-context'

export default function ExploreMentorsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <FilterProvider>
          <MentorDiscovery />
        </FilterProvider>
      </main>
    </>
  )
}
