'use client'

import { useRouter } from 'next/navigation'

import { FilterProvider, useFilters } from '@/features/filters/context/FilterContext'
import { buildExploreMentorsSearchParams } from '@/features/filters/lib/filter-url-state'
import { MentorDiscovery } from '@/features/mentors/components/MentorDiscovery'
import { MentorProfileModal } from '@/features/mentors/components/MentorProfileModal'
import { type FilterState } from '@/features/filters/types/filter.types'

interface MentorProfilePageContentProps {
  mentorSlugOrId: string
  initialFilters?: Partial<FilterState>
  initialPage?: number
}

function MentorProfileRouteModal({ mentorSlugOrId }: { mentorSlugOrId: string }) {
  const router = useRouter()
  const { filters, currentPage } = useFilters()

  const handleClose = () => {
    const params = buildExploreMentorsSearchParams(filters, currentPage)
    const queryString = params.toString()

    router.push(queryString ? `/explore-mentors?${queryString}` : '/explore-mentors')
  }

  return <MentorProfileModal isOpen mentorId={mentorSlugOrId} onClose={handleClose} />
}

export function MentorProfilePageContent({
  mentorSlugOrId,
  initialFilters,
  initialPage,
}: MentorProfilePageContentProps) {
  return (
    <main className="min-h-screen bg-[#f8f9ff] pt-[73px]">
      <FilterProvider initialFilters={initialFilters} initialPage={initialPage} syncUrl>
        <MentorDiscovery />
        <MentorProfileRouteModal mentorSlugOrId={mentorSlugOrId} />
      </FilterProvider>
    </main>
  )
}
