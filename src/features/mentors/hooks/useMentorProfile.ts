import { useQuery } from '@tanstack/react-query'

import { MentorResponse } from '../types/mentors.types'
import { getMentorBySlugOrId, type MentorLookupOptions } from '../api/mentors.api'

export function useMentorProfile(mentorSlugOrId: string | null, options?: MentorLookupOptions) {
  const enabled = !!mentorSlugOrId

  return useQuery<MentorResponse>({
    queryKey: ['mentor-profile', mentorSlugOrId, options],
    queryFn: () => getMentorBySlugOrId(mentorSlugOrId!, options),
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}
