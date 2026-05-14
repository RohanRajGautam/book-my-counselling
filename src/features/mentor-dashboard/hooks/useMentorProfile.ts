import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import {
  getMyMentorProfile,
  createMentorProfile,
  updateMyMentorProfile,
} from '../api/mentor-dashboard.api'
import { MentorProfileCreate, MentorProfileUpdate } from '../types/mentor-dashboard.types'

export const MENTOR_PROFILE_KEY = ['mentor', 'profile', 'me']

export function useMentorProfile() {
  const query = useQuery({
    queryKey: MENTOR_PROFILE_KEY,
    queryFn: getMyMentorProfile,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        // Never retry on 404 (no profile yet) or 403 (wrong role — e.g. admin)
        if (status === 404 || status === 403) return false
      }
      return failureCount < 1
    },
  })

  const isProfileMissing =
    axios.isAxiosError(query.error) && query.error.response?.status === 404

  // 403 means the user is not a mentor (e.g. admin role) — profile doesn't apply
  const isWrongRole =
    axios.isAxiosError(query.error) && query.error.response?.status === 403

  return { ...query, isProfileMissing, isWrongRole }
}

export function useCreateMentorProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: MentorProfileCreate) => createMentorProfile(data),
    onSuccess: (profile) => {
      // Seed the cache so the dashboard loads immediately without a refetch
      queryClient.setQueryData(MENTOR_PROFILE_KEY, profile)
    },
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
