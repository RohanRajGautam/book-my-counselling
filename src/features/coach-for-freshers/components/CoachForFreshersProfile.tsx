'use client'

import { useRouter } from 'next/navigation'

import { CoachForFreshersProfileModal } from './CoachForFreshersProfileModal'
import {
  CoachForFreshersFiltersProvider,
  useCoachForFreshersFilters,
} from '../context/CoachForFreshersFiltersContext'
import { buildCoachForFreshersSearchParams } from '../lib/url-state'
import type { CoachForFreshersFilters } from '../types/filters.types'

interface CoachForFreshersProfileProps {
  mentorSlugOrId: string
  initialFilters?: Partial<CoachForFreshersFilters>
  initialPage?: number
  returnTo?: string
}

function ProfileRouteModal({
  mentorSlugOrId,
  returnTo,
}: {
  mentorSlugOrId: string
  returnTo?: string
}) {
  const router = useRouter()
  const { filters, currentPage } = useCoachForFreshersFilters()

  const handleClose = () => {
    if (returnTo) {
      router.push(returnTo)
      return
    }

    const params = buildCoachForFreshersSearchParams(filters, currentPage)
    const queryString = params.toString()

    router.push(queryString ? `/coach-for-freshers?${queryString}` : '/coach-for-freshers')
  }

  return <CoachForFreshersProfileModal mentorId={mentorSlugOrId} onClose={handleClose} />
}

export function CoachForFreshersProfile({
  mentorSlugOrId,
  initialFilters,
  initialPage = 1,
  returnTo,
}: CoachForFreshersProfileProps) {
  return (
    <main className="min-h-screen bg-[#f8f9ff] pt-20">
      <CoachForFreshersFiltersProvider
        initialFilters={initialFilters}
        initialPage={initialPage}
        syncUrl={false}
      >
        <ProfileRouteModal mentorSlugOrId={mentorSlugOrId} returnTo={returnTo} />
      </CoachForFreshersFiltersProvider>
    </main>
  )
}
