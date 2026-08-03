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
}

function ProfileRouteModal({ mentorSlugOrId }: { mentorSlugOrId: string }) {
  const router = useRouter()
  const { filters, currentPage } = useCoachForFreshersFilters()

  const handleClose = () => {
    const params = buildCoachForFreshersSearchParams(filters, currentPage)
    const queryString = params.toString()

    router.push(queryString ? `/coach-for-freshers?${queryString}` : '/coach-for-freshers')
  }

  return (
    <CoachForFreshersProfileModal mentorId={mentorSlugOrId} onClose={handleClose} />
  )
}

export function CoachForFreshersProfile({
  mentorSlugOrId,
  initialFilters,
  initialPage = 1,
}: CoachForFreshersProfileProps) {
  return (
    <main className="min-h-screen bg-[#f8f9ff] pt-[73px]">
      <CoachForFreshersFiltersProvider initialFilters={initialFilters} initialPage={initialPage}>
        <ProfileRouteModal mentorSlugOrId={mentorSlugOrId} />
      </CoachForFreshersFiltersProvider>
    </main>
  )
}
