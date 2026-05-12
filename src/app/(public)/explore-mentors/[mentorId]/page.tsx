import { MentorProfilePageContent } from '@/features/mentors/components/MentorProfilePageContent'

export default async function MentorProfilePage({
  params,
}: {
  params: Promise<{ mentorId: string }>
}) {
  const { mentorId } = await params

  return <MentorProfilePageContent mentorId={mentorId} />
}
