import { AcademicCounsellorProfile } from '@/features/academic-counsellor/components/AcademicCounsellorProfile'
import {
  loadAcademicCounsellorState,
  type AcademicCounsellorSearchParams,
} from '@/features/academic-counsellor/lib/url-state'

type AcademicCounsellorProfilePageProps = {
  params: Promise<{ mentorId: string }>
  searchParams: Promise<AcademicCounsellorSearchParams>
}

export default async function AcademicCounsellorProfilePage({
  params,
  searchParams,
}: AcademicCounsellorProfilePageProps) {
  const { mentorId } = await params
  const { filters, page } = await loadAcademicCounsellorState(searchParams)

  return (
    <AcademicCounsellorProfile
      mentorSlugOrId={mentorId}
      initialFilters={filters}
      initialPage={page}
    />
  )
}
