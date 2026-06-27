import { useQuery } from '@tanstack/react-query'

import { MentorResponse } from '@/features/mentors/types/mentors.types'

import { getAcademicCounsellorBySlugOrId } from '../api/academic-counsellor.api'

export function useAcademicCounsellorProfile(mentorSlugOrId: string | null) {
  const enabled = !!mentorSlugOrId

  return useQuery<MentorResponse>({
    queryKey: ['academic-counsellor-profile', mentorSlugOrId],
    queryFn: () => getAcademicCounsellorBySlugOrId(mentorSlugOrId!),
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}