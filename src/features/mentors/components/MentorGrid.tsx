'use client'
import { useState } from 'react'
import { MentorCard } from '@/features/mentors/components/MentorCard'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { useMentors } from '@/features/mentors/hooks/useMentors'
import { MENTORS_PER_PAGE } from '@/features/mentors/api/mentors.api'
import { MentorProfileModal } from './MentorProfileModal'
import { useFilters } from '@/features/filters/context/FilterContext'

export function MentorGrid() {
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null)
  const { filters, updateFilter, currentPage, setCurrentPage } = useFilters()
  const { data, isLoading, isFetching, isError } = useMentors(filters, currentPage)

  const totalPages = data?.total_pages ?? 1
  const currentMentors = data?.items ?? []

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <>
      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {isLoading
              ? 'Loading mentors...'
              : `${data?.total ?? 0} Mentor${data?.total === 1 ? '' : 's'} available`}
          </h2>
          <div className="flex items-center gap-2 text-[#434655]">
            <span>Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value as typeof filters.sortBy)}
              className="cursor-pointer border-none bg-transparent py-0 font-bold text-[#121c2a] focus:ring-0"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {isError ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl bg-[#eff4ff] p-12">
            <div className="text-center">
              <p className="mb-2 text-xl font-bold text-[#121c2a]">Unable to load mentors</p>
              <p className="text-[#434655]">Please try again in a moment</p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {Array.from({ length: MENTORS_PER_PAGE }).map((_, index) => (
              <div
                key={index}
                className="h-[420px] animate-pulse rounded-[2rem] bg-white shadow-[0_8px_24px_rgba(18,28,42,0.04)]"
              />
            ))}
          </div>
        ) : currentMentors.length > 0 ? (
          <div
            className={`grid grid-cols-1 gap-8 transition-opacity md:grid-cols-2 ${
              isFetching ? 'opacity-60' : 'opacity-100'
            }`}
          >
            {currentMentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                name={mentor.full_name}
                role={mentor.title}
                company={mentor.company ?? ''}
                tags={mentor.tags?.slice(0, 4).map((t) => (t.startsWith('#') ? t : `#${t}`)) || []}
                rating={mentor.average_rating}
                reviews={mentor.total_reviews}
                description={`Mentor in ${mentor.industries?.join(', ') || 'various fields'} with ${mentor.total_sessions} sessions`}
                price={Number(mentor.hourly_rate)}
                imageUrl={mentor.avatar_url}
                verified={mentor.is_verified}
                onClick={() => setSelectedMentorId(mentor.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl bg-[#eff4ff] p-12">
            <div className="text-center">
              <p className="mb-2 text-xl font-bold text-[#121c2a]">No mentors found</p>
              <p className="text-[#434655]">Try adjusting your filters</p>
            </div>
          </div>
        )}

        {!isLoading && !isError && totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isFetching}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c3c6d7] text-[#434655] hover:bg-[#e6eeff] disabled:opacity-50"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={page === '...' || isFetching}
                className={`flex h-12 w-12 items-center justify-center rounded-full font-bold transition-colors ${
                  page === currentPage
                    ? 'bg-[#004ac6] text-white'
                    : 'text-[#434655] hover:bg-[#e6eeff]'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isFetching}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c3c6d7] text-[#434655] hover:bg-[#e6eeff] disabled:opacity-50"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}
      </section>

      <MentorProfileModal
        isOpen={!!selectedMentorId}
        onClose={() => setSelectedMentorId(null)}
        mentorId={selectedMentorId!}
      />
    </>
  )
}
