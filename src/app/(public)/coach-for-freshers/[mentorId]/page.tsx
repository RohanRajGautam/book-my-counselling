import { CoachForFreshersProfile } from '@/features/coach-for-freshers/components/CoachForFreshersProfile'
import {
  loadCoachForFreshersState,
  type CoachForFreshersSearchParams,
} from '@/features/coach-for-freshers/lib/url-state'

type CoachForFreshersProfilePageProps = {
  params: Promise<{ mentorId: string }>
  searchParams: Promise<CoachForFreshersSearchParams>
}

export default async function CoachForFreshersProfilePage({
  params,
  searchParams,
}: CoachForFreshersProfilePageProps) {
  const { mentorId } = await params
  const { filters, page } = await loadCoachForFreshersState(searchParams)

  return (
    <CoachForFreshersProfile
      mentorSlugOrId={mentorId}
      initialFilters={filters}
      initialPage={page}
    />
  )
}
