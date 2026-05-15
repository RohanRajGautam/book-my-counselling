'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MentorCardWithPackages } from '@/features/mentors/components/MentorCardWithPackages'
import { useMentors } from '@/features/mentors/hooks/useMentors'
import { useFilters } from '@/features/filters/context/FilterContext'

const FEATURED_MENTOR_LIMIT = 6
// Temporary featured-grid exclusion. Remove this constant/filter when this mentor can be shown again.
const HIDDEN_FEATURED_MENTOR_ID = '00c76b18-9a60-455e-9c8e-4afce0e984e0'

export function FeaturedMentorsGrid() {
  const router = useRouter()
  const { filters } = useFilters()
  const { data, isLoading, isFetching, isError } = useMentors(filters, 1)

  const featuredMentors =
    data?.items
      .filter((mentor) => mentor.id !== HIDDEN_FEATURED_MENTOR_ID)
      .slice(0, FEATURED_MENTOR_LIMIT) ?? []

  return (
    <>
      <section>
        {isError ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl p-12">
            <div className="text-center">
              <p className="mb-2 text-xl font-bold text-[#121c2a]">Unable to load mentors</p>
              <p className="text-[#434655]">Please try again in a moment</p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {Array.from({ length: FEATURED_MENTOR_LIMIT }).map((_, index) => (
              <div
                key={index}
                className="h-[420px] animate-pulse rounded-[2rem] bg-white shadow-[0_8px_24px_rgba(18,28,42,0.04)]"
              />
            ))}
          </div>
        ) : featuredMentors.length > 0 ? (
          <div
            className={`mt-12 grid grid-cols-1 gap-8 transition-opacity md:grid-cols-3 ${
              isFetching ? 'opacity-60' : 'opacity-100'
            }`}
          >
            {featuredMentors.map((mentor) => (
              <MentorCardWithPackages
                key={mentor.id}
                mentorId={mentor.id}
                name={mentor.full_name}
                role={mentor.title}
                company={mentor.company ?? ''}
                tags={mentor.tags?.slice(0, 4).map((t) => (t.startsWith('#') ? t : `#${t}`)) || []}
                rating={mentor.average_rating}
                reviews={mentor.total_reviews}
                description={`Mentor in ${mentor.industries?.join(', ') || 'various fields'} with ${mentor.total_sessions} sessions`}
                fallbackPrice={Number(mentor.hourly_rate)}
                imageUrl={mentor.avatar_url}
                verified={mentor.is_verified}
                onClick={() => router.push(`/explore-mentors/${mentor.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl p-12">
            <div className="text-center">
              <p className="mb-2 text-xl font-bold text-[#121c2a]">No mentors found</p>
            </div>
          </div>
        )}

        {!isLoading && !isError && featuredMentors.length > 0 && (
          <div className="mt-10 flex justify-center">
            <Link
              href="/explore-mentors"
              className="rounded-lg bg-[#004ac6] px-6 py-3 font-bold text-white shadow-[0_12px_28px_rgba(0,74,198,0.2)] transition hover:bg-[#003fa8]"
            >
              Explore all mentors
            </Link>
          </div>
        )}
      </section>
    </>
  )
}
