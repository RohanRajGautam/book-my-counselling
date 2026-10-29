import { AcademicCounsellorProfile } from '@/features/academic-counsellor/components/AcademicCounsellorProfile'
import {
  parseAcademicCounsellorSearchParams,
  type AcademicCounsellorSearchParams,
} from '@/features/academic-counsellor/lib/url-state'
import {
  buildReturnPath,
  MENTOR_PROFILE_ORIGIN_ALL_MENTORS,
  MENTOR_PROFILE_ORIGIN_PARAM,
  readProfileOrigin,
} from '@/features/mentors/lib/profile-origin'

type AcademicCounsellorProfilePageProps = {
  params: Promise<{ mentorId: string }>
  searchParams: Promise<AcademicCounsellorSearchParams>
}

export default async function AcademicCounsellorProfilePage({
  params,
  searchParams,
}: AcademicCounsellorProfilePageProps) {
  const { mentorId } = await params
  const rawSearchParams = await searchParams
  const { filters, page } = parseAcademicCounsellorSearchParams(rawSearchParams)

  const origin = readProfileOrigin(rawSearchParams)
  const returnTo =
    origin === MENTOR_PROFILE_ORIGIN_ALL_MENTORS
      ? buildReturnPath('/mentors', rawSearchParams, [MENTOR_PROFILE_ORIGIN_PARAM])
      : undefined

  return (
    <AcademicCounsellorProfile
      mentorSlugOrId={mentorId}
      initialFilters={filters}
      initialPage={page}
      returnTo={returnTo}
    />
  )
}
