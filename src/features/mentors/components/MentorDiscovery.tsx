import { FiltersSidebar } from '@/features/filters/components/FiltersSidebar'
import { MentorGrid } from '@/features/mentors/components/MentorGrid'

export function MentorDiscovery() {
  return (
    <div
      id="mentor-discovery"
      className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-8 pb-24 lg:grid-cols-12"
    >
      <div className="lg:col-span-3">
        <FiltersSidebar />
      </div>

      <div className="lg:col-span-9">
        <MentorGrid />
      </div>
    </div>
  )
}
