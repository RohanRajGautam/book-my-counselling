import { useQuery } from '@tanstack/react-query'
import { getMentorAvailability } from '../api/availability.api'
import type { AvailabilitySlotResponse } from '../types/availability.types'

export function useMentorAvailability(mentorId: string | null) {
  return useQuery<AvailabilitySlotResponse[]>({
    queryKey: ['mentor-availability', mentorId],
    queryFn: () => getMentorAvailability(mentorId!),
    enabled: !!mentorId,
    staleTime: 2 * 60 * 1000, // 2 min — slots change frequently
  })
}
