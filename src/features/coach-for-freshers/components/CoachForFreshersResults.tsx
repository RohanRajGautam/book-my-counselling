'use client'

import { useRouter } from 'next/navigation'
import { AlertCircle, ChevronLeft, ChevronRight, SearchX } from 'lucide-react'

import { MentorCardSkeleton } from '@/components/ui/skeleton'
import { MentorCardWithPackages } from '@/features/mentors/components/MentorCardWithPackages'
import { getMentorProfileSlug } from '@/features/mentors/utils/mentors.utils'

import { COACH_FOR_FRESHERS_PER_PAGE } from '../api/coach-for-freshers.api'
import { useCoachForFreshersFilters } from '../context/CoachForFreshersFiltersContext'
import { useCoachForFreshers } from '../hooks/useCoachForFreshers'
import { buildCoachForFreshersSearchParams } from '../lib/url-state'
import {
  COACH_FOR_FRESHERS_GROUP_TAG,
  COACH_FOR_FRESHERS_TAG_LABELS,
  type CoachForFreshersVariety,
} from '../types/coach-for-freshers.types'

interface CoachForFreshersResultsProps {
  variety: CoachForFreshersVariety
}

export function CoachForFreshersResults({ variety }: CoachForFreshersResultsProps) {
  const router = useRouter()
  const { filters, currentPage, setCurrentPage } = useCoachForFreshersFilters()
  const { data, isLoading, isFetching, isError } = useCoachForFreshers(
    variety,
    filters,
    currentPage
  )

  const totalPages = data?.total_pages ?? 1
  const currentMentors = data?.items ?? []

  const getMentorHref = (mentor: (typeof currentMentors)[number]) => {
    const params = buildCoachForFreshersSearchParams(filters, currentPage)
    const queryString = params.toString()

    return `/coach-for-freshers/${getMentorProfileSlug(mentor)}${queryString ? `?${queryString}` : ''}`
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    document
      .getElementById('coach-for-freshers-results')
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

  if (isError) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-3xl bg-white p-12 text-center shadow-[0_16px_40px_rgba(18,28,42,0.04)] ring-1 ring-[var(--color-surface-container-high)] ring-inset">
        <div className="flex flex-col items-center">
          <AlertCircle className="mb-4 size-10 text-[var(--brand-blue)]" aria-hidden="true" />
          <p className="mb-2 font-[family-name:var(--font-headline)] text-xl font-extrabold text-[var(--foreground)]">
            Unable to load coaches
          </p>
          <p className="font-medium text-[var(--color-on-surface-variant)]">
            Please try again in a moment.
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: COACH_FOR_FRESHERS_PER_PAGE }).map((_, index) => (
          <MentorCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (currentMentors.length === 0) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-3xl bg-white p-12 text-center shadow-[0_16px_40px_rgba(18,28,42,0.04)] ring-1 ring-[var(--color-surface-container-high)] ring-inset">
        <div className="flex flex-col items-center">
          <SearchX className="mb-4 size-10 text-[var(--brand-blue)]" aria-hidden="true" />
          <p className="font-[family-name:var(--font-headline)] text-xl font-extrabold text-[var(--foreground)]">
            No coaches found
          </p>
          <p className="mt-2 font-medium text-[var(--color-on-surface-variant)]">
            Try a different category or search term.
          </p>
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
            tags={
              mentor.tags?.length
                ? mentor.tags
                    .filter((tag) => tag !== COACH_FOR_FRESHERS_GROUP_TAG)
                    .map((tag) => COACH_FOR_FRESHERS_TAG_LABELS[tag] ?? tag)
                : mentor.professional_categories?.length
                  ? mentor.professional_categories
                  : (mentor.industries ?? [])
            }
            description={`${mentor.title} with ${mentor.total_sessions} sessions`}
            fallbackPrice={Number(mentor.hourly_rate)}
            imageUrl={mentor.avatar_url}
            companyLogoUrl={mentor.company_logo_url ?? null}
            verified={mentor.is_verified}
            context="coach-for-freshers"
            onClick={() => router.push(getMentorHref(mentor))}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 mb-16 flex flex-wrap items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isFetching}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent disabled:hover:text-slate-300"
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" strokeWidth={2} />
          </button>

          {getPageNumbers().map((page, index) => (
            <button
              key={`${page}-${index}`}
              type="button"
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              disabled={page === '...' || isFetching}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/30 focus-visible:outline-none disabled:cursor-default disabled:opacity-60 ${
                page === currentPage
                  ? 'bg-[var(--brand-blue)] text-white'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isFetching}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent disabled:hover:text-slate-300"
            aria-label="Next page"
          >
            <ChevronRight className="size-4" strokeWidth={2} />
          </button>
        </div>
      )}
    </>
  )
}
