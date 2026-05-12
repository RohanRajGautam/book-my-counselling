'use client'

import { useState } from 'react'
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'

import { MentorCard } from '@/features/mentors/components/MentorCard'
import { MENTORS_PER_PAGE } from '@/features/mentors/api/mentors.api'
import { useMentors } from '@/features/mentors/hooks/useMentors'
import { useFilters } from '@/features/filters/context/FilterContext'
import { MentorProfileModal } from './MentorProfileModal'

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top rated' },
  { value: 'reviews', label: 'Most reviewed' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
] as const

export function MentorGrid() {
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null)
  const { filters, updateFilter, currentPage, setCurrentPage } = useFilters()
  const { data, isLoading, isFetching, isError } = useMentors(filters, currentPage)

  const totalPages = data?.total_pages ?? 1
  const currentMentors = data?.items ?? []

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    document
      .getElementById('mentor-results')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      for (let page = 1; page <= totalPages; page += 1) pages.push(page)
      return pages
    }

    pages.push(1)
    if (currentPage > 3) pages.push('...')

    for (
      let page = Math.max(2, currentPage - 1);
      page <= Math.min(totalPages - 1, currentPage + 1);
      page += 1
    ) {
      pages.push(page)
    }

    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)

    return pages
  }

  return (
    <>
      <section id="mentor-results" className="px-6 py-9 lg:px-8 xl:px-9">
        <div className="mb-10 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-headline)] text-4xl font-extrabold tracking-tight text-[#121c2a] md:text-[42px]">
              Explore Expert Mentors
            </h1>
            <p className="mt-3 max-w-[590px] text-lg leading-8 font-medium text-[#5f6472]">
              Connect with world-class guides to navigate your academic journey or professional
              career path.
            </p>
          </div>

          <div className="grid h-[60px] w-full max-w-[334px] grid-cols-2 rounded-full bg-[#e6eeff] p-1.5 shadow-[inset_0_0_0_1px_rgba(195,198,215,0.18)]">
            <button
              type="button"
              onClick={() => updateFilter('counselingType', 'academic')}
              className={`rounded-xl text-sm leading-tight font-extrabold transition ${
                filters.counselingType === 'academic'
                  ? 'bg-white text-[#0053db] shadow-[0_8px_20px_rgba(18,28,42,0.08)]'
                  : 'text-[#263247]'
              }`}
            >
              Academic
              <br />
              Counselling
            </button>
            <button
              type="button"
              onClick={() => updateFilter('counselingType', 'professional')}
              className={`rounded-xl text-sm leading-tight font-extrabold transition ${
                filters.counselingType === 'professional'
                  ? 'bg-white text-[#0053db] shadow-[0_8px_20px_rgba(18,28,42,0.08)]'
                  : 'text-[#263247]'
              }`}
            >
              Professional
              <br />
              Mentorship
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center">
          <div className="flex h-16 min-w-0 flex-1 items-center rounded-full bg-white px-4 shadow-[0_10px_30px_rgba(18,28,42,0.035)]">
            <Search className="mr-3 size-6 text-[#0053db]" />
            <input
              type="search"
              value={filters.jobTitle ?? ''}
              onChange={(event) => updateFilter('jobTitle', event.target.value)}
              placeholder="Search by name, role, or company..."
              className="h-full min-w-0 flex-1 bg-transparent text-base font-semibold text-[#121c2a] outline-none placeholder:text-[#b5bbc8]"
            />
            <button
              type="button"
              onClick={() => updateFilter('jobTitle', filters.jobTitle ?? '')}
              className="ml-2 h-10 rounded-lg bg-[#0053db] px-7 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(0,83,219,0.22)] transition hover:bg-[#003fa8]"
            >
              Search
            </button>
          </div>

          <label className="flex h-14 shrink-0 items-center gap-3 rounded-full bg-white px-4 shadow-[0_10px_30px_rgba(18,28,42,0.035)]">
            <ArrowUpDown className="size-5 text-[#0053db]" />
            <span className="text-sm font-extrabold text-[#434655]">Sort</span>
            <span className="relative">
              <select
                value={filters.sortBy}
                onChange={(event) =>
                  updateFilter(
                    'sortBy',
                    event.target.value as (typeof SORT_OPTIONS)[number]['value']
                  )
                }
                className="h-10 min-w-[180px] appearance-none rounded-lg bg-[#f8f9ff] px-3 pr-9 text-sm font-extrabold text-[#121c2a] ring-1 ring-[#eff4ff] transition outline-none ring-inset focus:ring-2 focus:ring-[#0053db]/30"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#0053db]" />
            </span>
          </label>
        </div>

        {/* <div className="mb-10 flex flex-wrap items-center gap-2 text-xs font-extrabold">
          <span className="mr-1 text-[#434655]">POPULAR:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => updateFilter('jobTitle', term)}
              className="text-[#1f5ca8] transition hover:text-[#004ac6]"
            >
              {term}
            </button>
          ))}
        </div> */}

        {isError ? (
          <div className="flex min-h-[360px] items-center justify-center rounded-lg bg-white p-12 text-center shadow-[0_16px_40px_rgba(18,28,42,0.04)]">
            <div>
              <p className="mb-2 text-xl font-extrabold text-[#121c2a]">Unable to load mentors</p>
              <p className="font-medium text-[#5f6472]">Please try again in a moment.</p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: MENTORS_PER_PAGE }).map((_, index) => (
              <div key={index} className="h-[390px] animate-pulse rounded-[18px] bg-white" />
            ))}
          </div>
        ) : currentMentors.length > 0 ? (
          <div
            className={`grid grid-cols-1 gap-6 transition-opacity md:grid-cols-2 xl:grid-cols-3 ${
              isFetching ? 'opacity-60' : 'opacity-100'
            }`}
          >
            {currentMentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                name={mentor.full_name}
                role={mentor.title}
                company={mentor.company ?? ''}
                tags={mentor.tags?.length ? mentor.tags : (mentor.industries ?? [])}
                rating={mentor.average_rating}
                reviews={mentor.total_reviews}
                description={
                  mentor.industries?.length
                    ? `Mentor in ${mentor.industries.slice(0, 2).join(' and ')} with ${mentor.total_sessions} sessions`
                    : `${mentor.title} with ${mentor.total_sessions} sessions`
                }
                price={Number(mentor.hourly_rate)}
                imageUrl={mentor.avatar_url}
                totalSessions={mentor.total_sessions}
                verified={mentor.is_verified}
                onClick={() => setSelectedMentorId(mentor.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[360px] items-center justify-center rounded-lg bg-white p-12 text-center shadow-[0_16px_40px_rgba(18,28,42,0.04)]">
            <div>
              <p className="mb-2 text-xl font-extrabold text-[#121c2a]">No mentors found</p>
            </div>
          </div>
        )}

        {!isLoading && !isError && totalPages > 1 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isFetching}
              className="flex size-11 items-center justify-center rounded-full bg-white text-[#434655] shadow-[0_10px_24px_rgba(18,28,42,0.05)] transition hover:bg-[#f7faff] disabled:cursor-not-allowed disabled:opacity-45"
              aria-label="Previous page"
            >
              <ChevronLeft className="size-5" />
            </button>

            {getPageNumbers().map((page, index) => (
              <button
                key={`${page}-${index}`}
                type="button"
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={page === '...' || isFetching}
                className={`flex size-11 items-center justify-center rounded-full text-sm font-extrabold transition ${
                  page === currentPage
                    ? 'bg-[#0053db] text-white shadow-[0_10px_22px_rgba(0,83,219,0.22)]'
                    : 'bg-white text-[#434655] shadow-[0_10px_24px_rgba(18,28,42,0.05)] hover:bg-[#f7faff]'
                } disabled:cursor-default disabled:opacity-60`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isFetching}
              className="flex size-11 items-center justify-center rounded-full bg-white text-[#434655] shadow-[0_10px_24px_rgba(18,28,42,0.05)] transition hover:bg-[#f7faff] disabled:cursor-not-allowed disabled:opacity-45"
              aria-label="Next page"
            >
              <ChevronRight className="size-5" />
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
