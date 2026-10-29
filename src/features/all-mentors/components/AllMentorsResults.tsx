'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'

import { MentorCardSkeleton } from '@/components/ui/skeleton'
import { MentorCardWithPackages } from '@/features/mentors/components/MentorCardWithPackages'
import { RequestMentorEmptyState } from '@/features/mentor-match-requests/components/RequestMentorForm'
import {
  MENTOR_PROFILE_ORIGIN_ALL_MENTORS,
  MENTOR_PROFILE_ORIGIN_PARAM,
} from '@/features/mentors/lib/profile-origin'
import { getMentorProfileSlug } from '@/features/mentors/utils/mentors.utils'
import { COACH_FOR_FRESHERS_GROUP_TAG } from '@/features/coach-for-freshers/types/coach-for-freshers.types'

import { ALL_MENTORS_PER_PAGE } from '../api/all-mentors.api'
import { useAllMentorsFilters } from '../context/AllMentorsFiltersContext'
import { useAllMentors } from '../hooks/useAllMentors'
import { buildAllMentorsSearchParams } from '../lib/url-state'
import { getAllMentorsScope, type AllMentorsScope } from '../lib/vendor-scope'

function isCoachForFreshersMentor(mentor: { is_academic_counselor: boolean; tags?: string[] }) {
  if (mentor.is_academic_counselor) return false
  return Boolean(mentor.tags?.includes(COACH_FOR_FRESHERS_GROUP_TAG))
}

// A mentor can be both an academic counsellor and a coach for freshers, and
// the two profiles show different services. The active scope decides which
// one opens; without a scope, the mentor's own type wins and academic
// counsellors stay academic.
function getMentorProfileBase(
  mentor: { is_academic_counselor: boolean; tags?: string[] },
  scope: AllMentorsScope
) {
  if (scope === 'coach-for-freshers') return '/coach-for-freshers'
  if (scope === 'academic') return '/academic-counsellor'
  return isCoachForFreshersMentor(mentor) ? '/coach-for-freshers' : '/academic-counsellor'
}

export function AllMentorsResults() {
  const router = useRouter()
  const { filters, currentPage, setCurrentPage } = useAllMentorsFilters()
  const { data, isLoading, isFetching, isError } = useAllMentors(filters, currentPage)
  const scope = getAllMentorsScope(filters)

  const totalPages = data?.total_pages ?? 1
  const currentMentors = data?.items ?? []

  // The backend already sorts by rating when `sortBy === 'rating'`, but the
  // order returned isn't always reliable (paginated ordering can drift when
  // reviews land between requests). Re-sort on the client to guarantee the
  // displayed order matches the selected sort regardless of what came back.
  const displayMentors = useMemo(() => {
    if (filters.sortBy !== 'rating') return currentMentors
    return [...currentMentors].sort((a, b) => b.average_rating - a.average_rating)
  }, [currentMentors, filters.sortBy])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    document
      .getElementById('all-mentors-results')
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
    const params = buildAllMentorsSearchParams(filters, currentPage)
    // Marks where the profile was opened from, so closing the modal returns
    // to this listing instead of the academic / coach-for-freshers listing.
    params.set(MENTOR_PROFILE_ORIGIN_PARAM, MENTOR_PROFILE_ORIGIN_ALL_MENTORS)
    const queryString = params.toString()
    const base = `${getMentorProfileBase(mentor, scope)}/${getMentorProfileSlug(mentor)}`

    return `${base}${queryString ? `?${queryString}` : ''}`
  }

  if (isError) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-3xl bg-white p-12 text-center shadow-[0_16px_40px_rgba(18,28,42,0.04)] ring-1 ring-[var(--color-surface-container-high)] ring-inset">
        <div className="flex flex-col items-center">
          <AlertCircle className="mb-4 size-10 text-[var(--brand-blue)]" aria-hidden="true" />
          <p className="mb-2 font-[family-name:var(--font-headline)] text-xl font-extrabold text-[var(--foreground)]">
            Unable to load mentors
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
        {Array.from({ length: ALL_MENTORS_PER_PAGE }).map((_, index) => (
          <MentorCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (displayMentors.length === 0) {
    return <RequestMentorEmptyState context="mentor" />
  }

  return (
    <>
      <div
        className={`grid grid-cols-1 gap-6 transition-opacity md:grid-cols-2 xl:grid-cols-3 ${
          isFetching ? 'opacity-60' : 'opacity-100'
        }`}
      >
        {displayMentors.map((mentor) => {
          const isCoach = getMentorProfileBase(mentor, scope) === '/coach-for-freshers'
          return (
            <MentorCardWithPackages
              key={mentor.id}
              mentorId={mentor.id}
              name={mentor.full_name}
              role={mentor.title}
              company={mentor.company ?? ''}
              tags={mentor.tags?.length ? mentor.tags : (mentor.industries ?? [])}
              description={
                mentor.industries?.length
                  ? `Mentor in ${mentor.industries.slice(0, 2).join(' and ')} with ${mentor.total_completed_sessions ?? mentor.total_sessions} completed sessions`
                  : `${mentor.title} with ${mentor.total_completed_sessions ?? mentor.total_sessions} completed sessions`
              }
              fallbackPrice={Number(mentor.hourly_rate)}
              totalCompletedSessions={mentor.total_completed_sessions ?? mentor.total_sessions}
              averageRating={mentor.average_rating}
              totalReviews={mentor.total_reviews}
              imageUrl={mentor.avatar_url}
              companyLogoUrl={mentor.company_logo_url ?? null}
              verified={mentor.is_verified}
              context={isCoach ? 'coach-for-freshers' : 'academic'}
              onClick={() => router.push(getMentorHref(mentor))}
            />
          )
        })}
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
