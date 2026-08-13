import { CoachForFreshersPageContent } from '@/features/coach-for-freshers/components/CoachForFreshersPageContent'
import {
  loadCoachForFreshersState,
  type CoachForFreshersSearchParams,
} from '@/features/coach-for-freshers/lib/url-state'
import { COACH_FOR_FRESHERS_VARIETIES } from '@/features/coach-for-freshers/types/coach-for-freshers.types'
import { parseCrossLink } from '@/features/search/lib/parse-cross-link'

type CareerClarityRoadmapPageProps = {
  searchParams: Promise<CoachForFreshersSearchParams>
}

export default async function CareerClarityRoadmapPage({
  searchParams,
}: CareerClarityRoadmapPageProps) {
  const { filters, page } = await loadCoachForFreshersState(searchParams)
  const variety = COACH_FOR_FRESHERS_VARIETIES['career-clarity-roadmap']
  const crossLink = parseCrossLink(await searchParams)

  return (
    <main className="min-h-screen bg-[linear-gradient(to_right,#eff4ff_0%,#eff4ff_50%,#f8f9ff_50%,#f8f9ff_100%)] pt-15">
      <CoachForFreshersPageContent
        variety={variety}
        initialFilters={filters}
        initialPage={page}
        crossLink={crossLink ?? undefined}
      />
    </main>
  )
}
