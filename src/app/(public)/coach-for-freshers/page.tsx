import { CoachForFreshersPageContent } from '@/features/coach-for-freshers/components/CoachForFreshersPageContent'
import {
  loadCoachForFreshersState,
  type CoachForFreshersSearchParams,
} from '@/features/coach-for-freshers/lib/url-state'
import { COACH_FOR_FRESHERS_ROOT_VARIETY } from '@/features/coach-for-freshers/types/coach-for-freshers.types'

type CoachForFreshersPageProps = {
  searchParams: Promise<CoachForFreshersSearchParams>
}

export default async function CoachForFreshersPage({ searchParams }: CoachForFreshersPageProps) {
  const { filters, page } = await loadCoachForFreshersState(searchParams)

  return (
    <main className="min-h-screen bg-[#eff4ff] pt-10">
      <CoachForFreshersPageContent
        variety={COACH_FOR_FRESHERS_ROOT_VARIETY}
        initialFilters={filters}
        initialPage={page}
      />
    </main>
  )
}
