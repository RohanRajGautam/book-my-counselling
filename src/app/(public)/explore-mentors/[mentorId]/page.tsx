import { MentorProfilePageContent } from '@/features/mentors/components/MentorProfilePageContent'
import {
  parseExploreMentorsSearchParams,
  type ExploreMentorsSearchParams,
} from '@/features/filters/lib/filter-url-state'

export default async function MentorProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ mentorId: string }>
  searchParams: Promise<ExploreMentorsSearchParams>
}) {
  const { mentorId } = await params
  const { filters, page } = parseExploreMentorsSearchParams(await searchParams)

  return (
    <MentorProfilePageContent
      mentorSlugOrId={mentorId}
      initialFilters={filters}
      initialPage={page}
    />
  )
}
