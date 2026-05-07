import { useQuery } from '@tanstack/react-query'
import { getMentorById } from '@/lib/api/mentors'

export function useMentor(mentorId: string | null) {
  const enabled = !!mentorId

  return useQuery({
    queryKey: ['mentor', mentorId],
    queryFn: () => getMentorById(mentorId!),
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}
