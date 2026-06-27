'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { MentorCardWithPackages } from '@/features/mentors/components/MentorCardWithPackages'
import { useFilters } from '@/features/filters/context/FilterContext'
import { getMentorProfileHref } from '@/features/mentors/utils/mentors.utils'

import { ACADEMIC_COUNSELLORS_PER_PAGE, getAcademicCounsellors } from '../api/academic-counsellor.api'
import { useAcademicCounsellors } from '../hooks/useAcademicCounsellors'
import { buildAcademicCounsellorSearchParams } from '../lib/filter-url-state'

export function AcademicCounsellorResults() {
  const router = useRouter()
  const { filters, currentPage, setCurrentPage } = useFilters()
  const { data, isLoading, isFetching, isError } = useAcademicCounsellors(filters, currentPage)

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
      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) pages.push(pageNumber)
      return pages
    }

    pages.push(1)
    if (currentPage > 3) pages.push('...')

    for (
      let pageNumber = Math.max(2, currentPage - 1);
      pageNumber <= Math.min(totalPages - 1, currentPage + 1);
      pageNumber += 1
    ) {
      pages.push(pageNumber)
    }

    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)

    return pages
  }

  const getMentorHref = (mentor: (typeof currentMentors)[number]) => {
    const params = buildAcademicCounsellorSearchParams(filters, currentPage)
    const queryString = params.toString()

    return `${getMentorProfileHref(mentor)}${queryString ? `?${queryString}` : ''}`
  }

  if (isError) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-[24px] bg-white p-12 text-center shadow-[0_16px_40px_rgba(18,28,42,0.04)] ring-1 ring-[#eff4ff] ring-inset">
        <div>
          <p className="mb-2 text-xl font-extrabold text-[#121c2a]">Unable to load mentors</p>
          <p className="font-medium text-[#5f6472]">Please try again in a moment.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: ACADEMIC_COUNSELLORS_PER_PAGE }).map((_, index) => (
          <div
            key={index}
            className="h-[390px] animate-pulse rounded-[20px] bg-white shadow-[0_16px_40px_rgba(18,28,42,0.04)]"
          />
        ))}
      </div>
    )
  }

  if (currentMentors.length === 0) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-[24px] bg-white p-12 text-center shadow-[0_16px_40px_rgba(18,28,42,0.04)] ring-1 ring-[#eff4ff] ring-inset">
        <div>
          <p className="text-xl font-extrabold text-[#121c2a]">No mentors found</p>
        </div>
      </div>
    )
  }

  return (
    <>
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
            onClick={() => router.push(getMentorHref(mentor))}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="my-12 flex flex-wrap items-center justify-center gap-3">
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
    </>
  )
}