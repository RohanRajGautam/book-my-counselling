import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import {
  getMyMentorProfile,
  createMentorProfile,
  updateMyMentorProfile,
  uploadMyCompanyLogo,
} from '../api/mentor-dashboard.api'
import { MentorResponse } from '@/features/mentors/types/mentors.types'
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

  const isProfileMissing = axios.isAxiosError(query.error) && query.error.response?.status === 404

  // 403 means the user is not a mentor (e.g. admin role) — profile doesn't apply
  const isWrongRole = axios.isAxiosError(query.error) && query.error.response?.status === 403

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

/**
 * Uploads a new company logo for the signed-in mentor via
 * `POST /api/v1/mentors/profile/logo`. Invalidates the mentor's own profile
 * cache, the auth/me cache (the logo isn't on the user, but other UI surfaces
 * read from there), and every public cache that surfaces a mentor's logo —
 * mirroring the backend's `mentor_detail:{id}` / `mentor_search:*` busting.
 * Does NOT toast — the caller decides copy.
 */
export function useUploadMyCompanyLogo() {
  const queryClient = useQueryClient()
  return useMutation<MentorResponse, Error, File>({
    mutationFn: (file) => uploadMyCompanyLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENTOR_PROFILE_KEY })
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      queryClient.invalidateQueries({ queryKey: ['mentors'] })
      queryClient.invalidateQueries({ queryKey: ['coach-for-freshers'] })
      queryClient.invalidateQueries({ queryKey: ['academic-counsellors'] })
      queryClient.invalidateQueries({ queryKey: ['mentor'] })
    },
  })
}
