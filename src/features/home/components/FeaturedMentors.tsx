import { FeaturedMentorsGrid } from '@/features/mentors/components/FeaturedMentorsGrid'

export function FeaturedMentors() {
  return (
    <section id="mentor-discovery" className="px-4 pb-20 sm:px-8">
      <div className="mx-auto max-w-[1350px]">
        <FeaturedMentorsGrid />
      </div>
    </section>
  )
}
