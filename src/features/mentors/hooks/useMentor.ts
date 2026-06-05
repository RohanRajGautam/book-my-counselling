import { useQuery } from '@tanstack/react-query'
import { getMentorBySlugOrId } from '../api/mentors.api'
import { MentorResponse } from '../types/mentors.types'

export function useMentor(mentorSlugOrId: string | null) {
  const enabled = !!mentorSlugOrId

  return useQuery<MentorResponse>({
    queryKey: ['mentor', mentorSlugOrId],
    queryFn: () => getMentorBySlugOrId(mentorSlugOrId!),
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}
