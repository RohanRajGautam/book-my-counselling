import { FeaturedMentorsGrid } from '@/features/mentors/components/FeaturedMentorsGrid'
import { FiltersSidebar } from '@/features/mentors/components/FiltersSidebar'
import { MentorGrid } from '@/features/mentors/components/MentorGrid'

export function FeaturedMentors() {
  return (
    <div id="mentor-discovery" className="mx-auto grid max-w-7xl gap-12 px-8 pb-24">
      <div className="lg:col-span-9">
        <FeaturedMentorsGrid />
      </div>
    </div>
  )
}
