import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMyMentorProfile, updateMyMentorProfile } from '../api/mentor-dashboard.api'
import { MentorProfileUpdate } from '../types/mentor-dashboard.types'

export const MENTOR_PROFILE_KEY = ['mentor', 'profile', 'me']

export function useMentorProfile() {
  return useQuery({
    queryKey: MENTOR_PROFILE_KEY,
    queryFn: getMyMentorProfile,
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateMentorProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: MentorProfileUpdate) => updateMyMentorProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENTOR_PROFILE_KEY })
    },
  })
}
