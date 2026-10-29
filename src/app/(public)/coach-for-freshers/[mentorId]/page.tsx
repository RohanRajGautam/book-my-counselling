import { CoachForFreshersProfile } from '@/features/coach-for-freshers/components/CoachForFreshersProfile'
import {
  parseCoachForFreshersSearchParams,
  type CoachForFreshersSearchParams,
} from '@/features/coach-for-freshers/lib/url-state'
import {
  buildReturnPath,
  MENTOR_PROFILE_ORIGIN_ALL_MENTORS,
  MENTOR_PROFILE_ORIGIN_PARAM,
  readProfileOrigin,
} from '@/features/mentors/lib/profile-origin'

type CoachForFreshersProfilePageProps = {
  params: Promise<{ mentorId: string }>
  searchParams: Promise<CoachForFreshersSearchParams>
}

export default async function CoachForFreshersProfilePage({
  params,
  searchParams,
}: CoachForFreshersProfilePageProps) {
  const { mentorId } = await params
  const rawSearchParams = await searchParams
  const { filters, page } = parseCoachForFreshersSearchParams(rawSearchParams)

  const origin = readProfileOrigin(rawSearchParams)
  const returnTo =
    origin === MENTOR_PROFILE_ORIGIN_ALL_MENTORS
      ? buildReturnPath('/mentors', rawSearchParams, [MENTOR_PROFILE_ORIGIN_PARAM])
      : undefined

  return (
    <CoachForFreshersProfile
      mentorSlugOrId={mentorId}
      initialFilters={filters}
      initialPage={page}
      returnTo={returnTo}
    />
  )
}
