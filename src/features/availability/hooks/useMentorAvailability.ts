import { useQuery } from '@tanstack/react-query'
import { getMentorAvailability } from '../api/availability.api'

export function useMentorAvailability(mentorId: string | null) {
  const enabled = !!mentorId

  return useQuery({
    queryKey: ['mentor-availability', mentorId],
    queryFn: () => getMentorAvailability(mentorId!),
    enabled,
    staleTime: 2 * 60 * 1000,
  })
}
