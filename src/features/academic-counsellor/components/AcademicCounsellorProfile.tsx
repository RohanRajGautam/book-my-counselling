'use client'

import { useRouter } from 'next/navigation'

import { FilterProvider, useFilters } from '@/features/filters/context/FilterContext'
import { type FilterState } from '@/features/filters/types/filter.types'

import { AcademicCounsellorProfileModal } from './AcademicCounsellorProfileModal'
import { buildAcademicCounsellorSearchParams } from '../lib/filter-url-state'

interface AcademicCounsellorProfileProps {
  mentorSlugOrId: string
  initialFilters?: Partial<FilterState>
  initialPage?: number
}

function ProfileRouteModal({ mentorSlugOrId }: { mentorSlugOrId: string }) {
  const router = useRouter()
  const { filters, currentPage } = useFilters()

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
    <main className="min-h-screen bg-[#f8f9ff] pt-[73px]">
      <FilterProvider
        initialFilters={initialFilters}
        initialPage={initialPage}
        syncUrl
        urlStateEncoder={buildAcademicCounsellorSearchParams}
      >
        <ProfileRouteModal mentorSlugOrId={mentorSlugOrId} />
      </FilterProvider>
    </main>
  )
}
