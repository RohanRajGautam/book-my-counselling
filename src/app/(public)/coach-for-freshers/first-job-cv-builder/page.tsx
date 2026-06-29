import { CoachForFreshersPageContent } from '@/features/coach-for-freshers/components/CoachForFreshersPageContent'
import {
  loadCoachForFreshersState,
  type CoachForFreshersSearchParams,
} from '@/features/coach-for-freshers/lib/url-state'
import { COACH_FOR_FRESHERS_VARIETIES } from '@/features/coach-for-freshers/types/coach-for-freshers.types'
import { parseCrossLink } from '@/features/search/lib/parse-cross-link'

type FirstJobCvBuilderPageProps = {
  searchParams: Promise<CoachForFreshersSearchParams>
}

export default async function FirstJobCvBuilderPage({ searchParams }: FirstJobCvBuilderPageProps) {
  const { filters, page } = await loadCoachForFreshersState(searchParams)
  const variety = COACH_FOR_FRESHERS_VARIETIES['first-job-cv-builder']
  const crossLink = parseCrossLink(await searchParams)

  return (
    <main className="min-h-screen bg-[#f8f9ff] pt-[73px]">
      <CoachForFreshersPageContent
        variety={variety}
        initialFilters={filters}
        initialPage={page}
        crossLink={crossLink ?? undefined}
      />
    </main>
  )
}
