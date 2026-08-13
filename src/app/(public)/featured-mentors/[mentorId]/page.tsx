import { FeaturedMentorProfile } from '@/features/featured-mentors/components/FeaturedMentorProfile'

type FeaturedMentorProfilePageProps = {
  params: Promise<{ mentorId: string }>
}

export default async function FeaturedMentorProfilePage({
  params,
}: FeaturedMentorProfilePageProps) {
  const { mentorId } = await params

  return <FeaturedMentorProfile mentorSlugOrId={mentorId} />
}