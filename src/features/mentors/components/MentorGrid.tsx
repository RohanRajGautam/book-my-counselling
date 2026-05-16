'use client'
import { MentorCardWithPackages } from '@/features/mentors/components/MentorCardWithPackages'

import { useRouter } from 'next/navigation'
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'

import { MENTORS_PER_PAGE } from '@/features/mentors/api/mentors.api'
import { useMentors } from '@/features/mentors/hooks/useMentors'
import { useFilters } from '@/features/filters/context/FilterContext'

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top rated' },
  { value: 'reviews', label: 'Most reviewed' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
] as const

export function MentorGrid() {
  const router = useRouter()
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
      <section id="mentor-results" className="px-5 py-4 sm:px-6 sm:py-0 lg:px-8 xl:px-10">
        <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center">
          <div className="flex h-16 min-w-0 flex-1 items-center rounded-2xl bg-white px-4 shadow-[0_12px_30px_rgba(18,28,42,0.04)] ring-1 ring-[#eff4ff] ring-inset">
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
              className="ml-2 h-10 rounded-xl bg-[#0053db] px-7 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(0,83,219,0.22)] transition hover:bg-[#003fa8]"
            >
              Search
            </button>
          </div>

          <label className="flex h-14 shrink-0 items-center gap-3 rounded-2xl bg-white px-4 shadow-[0_12px_30px_rgba(18,28,42,0.04)] ring-1 ring-[#eff4ff] ring-inset">
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
                className="h-10 min-w-[180px] appearance-none rounded-xl bg-[#f8f9ff] px-3 pr-9 text-sm font-extrabold text-[#121c2a] ring-1 ring-[#eff4ff] transition outline-none ring-inset focus:ring-2 focus:ring-[#0053db]/30"
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
          <div className="flex min-h-[360px] items-center justify-center rounded-[24px] bg-white p-12 text-center shadow-[0_16px_40px_rgba(18,28,42,0.04)] ring-1 ring-[#eff4ff] ring-inset">
            <div>
              <p className="mb-2 text-xl font-extrabold text-[#121c2a]">Unable to load mentors</p>
              <p className="font-medium text-[#5f6472]">Please try again in a moment.</p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: MENTORS_PER_PAGE }).map((_, index) => (
              <div
                key={index}
                className="h-[390px] animate-pulse rounded-[20px] bg-white shadow-[0_16px_40px_rgba(18,28,42,0.04)]"
              />
            ))}
          </div>
        ) : currentMentors.length > 0 ? (
          <div
            className={`grid grid-cols-1 gap-6 transition-opacity md:grid-cols-2 xl:grid-cols-3 ${
              isFetching ? 'opacity-60' : 'opacity-100'
            }`}
          >
            {currentMentors.map((mentor) => (
              <MentorCardWithPackages
                key={mentor.id}
                mentorId={mentor.id}
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
                fallbackPrice={Number(mentor.hourly_rate)}
                imageUrl={mentor.avatar_url}
                verified={mentor.is_verified}
                onClick={() => router.push(`/explore-mentors/${mentor.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[360px] items-center justify-center rounded-[24px] bg-white p-12 text-center shadow-[0_16px_40px_rgba(18,28,42,0.04)] ring-1 ring-[#eff4ff] ring-inset">
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
    </>
  )
}
