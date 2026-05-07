import { useQuery } from '@tanstack/react-query'
import { getMentorPackages } from '@/lib/api/mentors'

export function useMentorPackages(mentorId: string | null) {
  const enabled = !!mentorId

  return useQuery({
    queryKey: ['mentor-packages', mentorId],
    queryFn: () => getMentorPackages(mentorId!),
    enabled,
    staleTime: 10 * 60 * 1000,
  })
}
