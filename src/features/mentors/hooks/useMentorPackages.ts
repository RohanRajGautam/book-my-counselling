import { useQuery } from '@tanstack/react-query'
import { getMentorPackages } from '../api/mentor.api'

export function useMentorPackages(mentorId: string | null) {
  const enabled = !!mentorId

  return useQuery({
    queryKey: ['mentor-packages', mentorId],
    queryFn: () => getMentorPackages(mentorId!),
    enabled,
    staleTime: 10 * 60 * 1000,
  })
}
