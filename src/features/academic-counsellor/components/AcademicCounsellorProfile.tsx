'use client'

import { useRouter } from 'next/navigation'

import { AcademicCounsellorProfileModal } from './AcademicCounsellorProfileModal'
import { AcademicFiltersProvider, useAcademicFilters } from '../context/AcademicFiltersContext'
import { buildAcademicCounsellorSearchParams } from '../lib/url-state'
import type { AcademicFilters } from '../types/filters.types'

interface AcademicCounsellorProfileProps {
  mentorSlugOrId: string
  initialFilters?: Partial<AcademicFilters>
  initialPage?: number
}

function ProfileRouteModal({ mentorSlugOrId }: { mentorSlugOrId: string }) {
  const router = useRouter()
  const { filters, currentPage } = useAcademicFilters()

  const handleClose = () => {
    const params = buildAcademicCounsellorSearchParams(filters, currentPage)
    const queryString = params.toString()

    router.push(queryString ? `/academic-counsellor?${queryString}` : '/academic-counsellor')
  }

  return <AcademicCounsellorProfileModal isOpen mentorId={mentorSlugOrId} onClose={handleClose} />
}

export function AcademicCounsellorProfile({
  mentorSlugOrId,
  initialFilters,
  initialPage = 1,
}: AcademicCounsellorProfileProps) {
  return (
    <main className="min-h-screen bg-[#f8f9ff] pt-20">
      <AcademicFiltersProvider initialFilters={initialFilters} initialPage={initialPage}>
        <ProfileRouteModal mentorSlugOrId={mentorSlugOrId} />
      </AcademicFiltersProvider>
    </main>
  )
}
