import { useQuery } from '@tanstack/react-query'
import { getMentorById } from '../api/mentors.api'
import { MentorResponse } from '../types/mentors.types'

export function useMentor(mentorId: string | null) {
  const enabled = !!mentorId

  return useQuery<MentorResponse>({
    queryKey: ['mentor', mentorId],
    queryFn: () => getMentorById(mentorId!),
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}
