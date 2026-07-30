import { useSyncExternalStore } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  adminSetUserAvatar,
  createAdminMentor,
  featureMentor,
  getAdminMentors,
  getMentorsWithoutAvailability,
  reindexElasticsearch,
  rejectMentor,
  sendAvailabilityReminder,
  sendBulkAvailabilityReminder,
  updateAdminUserProfile,
  verifyMentor,
} from '../api/mentors.api'
import { PaginatedResponse } from '@/lib/api/api.types'
import { UserResponse } from '@/features/auth/types/auth.types'
import { AdminMentorCreateResponse } from '@/features/mentor-dashboard/types/mentor-dashboard.types'
import {
  AdminMentorProfile,
  AdminUserProfileResponse,
  AdminUserProfileUpdate,
} from '../../types/admin.types'

// ── Mentor list ───────────────────────────────────────────────────────────

export type AdminMentorFilter = {
  isVerified?: boolean
  isRejected?: boolean
}

export const ADMIN_MENTORS_KEY = ['admin', 'mentors'] as const

export function useAdminMentors(filter: AdminMentorFilter, page = 1) {
  return useQuery({
    queryKey: [...ADMIN_MENTORS_KEY, filter, page],
    queryFn: () => getAdminMentors({ ...filter, page }),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────

export function useVerifyMentor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => verifyMentor(id),
    onSuccess: (_data, id) => {
      removeMentorFromAdminCaches(qc, id)
      void qc.invalidateQueries({ queryKey: ADMIN_MENTORS_KEY })
      void qc.invalidateQueries({ queryKey: ['admin', 'analytics', 'stats'] })
    },
  })
}

export function useRejectMentor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => rejectMentor(id),
    onSuccess: (_data, id) => {
      removeMentorFromAdminCaches(qc, id)
      void qc.invalidateQueries({ queryKey: ADMIN_MENTORS_KEY })
      void qc.invalidateQueries({ queryKey: ['admin', 'analytics', 'stats'] })
    },
  })
}

export function useFeatureMentor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      featureMentor(id, featured),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ADMIN_MENTORS_KEY })
    },
  })
}

// ── Reminders ─────────────────────────────────────────────────────────────

export const ADMIN_REMINDERS_KEY = ['admin', 'reminders'] as const

export function useMentorsWithoutAvailability(params: { isVerified?: boolean; page?: number }) {
  return useQuery({
    queryKey: [...ADMIN_REMINDERS_KEY, params],
    queryFn: () => getMentorsWithoutAvailability(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

export function useSendReminder() {
  return useMutation({
    mutationFn: (mentorId: string) => sendAvailabilityReminder(mentorId),
    onSuccess: (data) => toast.success(data.message),
    onError: () => toast.error('Failed to send reminder.'),
  })
}

export function useSendBulkReminder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: { isVerified?: boolean }) => sendBulkAvailabilityReminder(params),
    onSuccess: (data) => {
      toast.success(data.message)
      void qc.invalidateQueries({ queryKey: ADMIN_REMINDERS_KEY })
    },
    onError: () => toast.error('Failed to send bulk reminders.'),
  })
}

// ── Maintenance ───────────────────────────────────────────────────────────

export function useReindexES() {
  return useMutation({ mutationFn: reindexElasticsearch })
}

// ── Create mentor ─────────────────────────────────────────────────────────

/**
 * Creates a mentor on behalf of someone. The caller composes a multipart
 * FormData with `metadata` (JSON) + optional `avatar` file and passes it in.
 * On success the admin sees the one-time `temp_password`; we also invalidate
 * the mentor list cache so the new mentor shows up in the pending tab.
 */
export function useCreateAdminMentor() {
  const qc = useQueryClient()
  return useMutation<AdminMentorCreateResponse, Error, FormData>({
    mutationFn: (formData) => createAdminMentor(formData),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ADMIN_MENTORS_KEY })
      void qc.invalidateQueries({ queryKey: ['admin', 'analytics', 'stats'] })
    },
  })
}

// ── Cache helper ─────────────────────────────────────────────────────────

function removeMentorFromAdminCaches(qc: ReturnType<typeof useQueryClient>, mentorId: string) {
  const queries = qc.getQueriesData<PaginatedResponse<AdminMentorProfile>>({
    queryKey: ADMIN_MENTORS_KEY,
  })
  for (const [key, data] of queries) {
    if (!data) continue
    const filtered = data.items.filter((m) => m.id !== mentorId)
    if (filtered.length !== data.items.length) {
      qc.setQueryData(key, {
        ...data,
        items: filtered,
        total: Math.max(0, data.total - 1),
      })
    }
  }
}

// ── Admin profile (read + update) ─────────────────────────────────────────

function findMentorInAdminListCache(
  qc: ReturnType<typeof useQueryClient>,
  userId: string
): AdminMentorProfile | undefined {
  const queries = qc.getQueriesData<PaginatedResponse<AdminMentorProfile>>({
    queryKey: ADMIN_MENTORS_KEY,
  })
  for (const [, data] of queries) {
    if (!data) continue
    const found = data.items.find((m) => m.user_id === userId)
    if (found) return found
  }
  return undefined
}

/**
 * Looks up a mentor by `user_id` from whatever pages of the admin mentor list
 * are currently cached. The backend doesn't expose `GET /admin/users/{id}` —
 * the Edit button always originates from a mentor card, so the data is in
 * cache from `useAdminMentors`. Subscribes to the query cache via
 * `useSyncExternalStore` so it re-reads whenever the cache mutates (e.g.
 * after `useUpdateAdminUserProfile` invalidates the list).
 *
 * Returns `undefined` for direct-URL access where the mentor isn't in cache;
 * the edit page renders a "go back to mentors list" fallback in that case.
 */
export function useMentorFromAdminListCache(userId: string): AdminMentorProfile | undefined {
  const qc = useQueryClient()
  return useSyncExternalStore(
    (onChange) => qc.getQueryCache().subscribe(onChange),
    () => findMentorInAdminListCache(qc, userId),
    () => undefined
  )
}

/**
 * Updates an admin-targeted user profile via
 * `PUT /admin/users/{userId}/profile`. On success, invalidates every
 * mentor-list cache (so changed names/titles/prices/tags show up across tabs)
 * and the admin analytics stats. Does NOT toast here so the caller can decide
 * how to phrase success messaging.
 */
export function useUpdateAdminUserProfile(userId: string) {
  const qc = useQueryClient()
  return useMutation<AdminUserProfileResponse, Error, AdminUserProfileUpdate>({
    mutationFn: (payload) => updateAdminUserProfile(userId, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ADMIN_MENTORS_KEY })
      void qc.invalidateQueries({ queryKey: ['admin', 'analytics', 'stats'] })
    },
  })
}

/**
 * Uploads a new avatar for an admin-targeted user via
 * `POST /admin/users/{userId}/avatar`. On success, invalidates every cache
 * that surfaces a mentor's avatar — the admin mentor list, public listings
 * (coach-for-freshers / academic-counsellors), the general mentor search, and
 * single-mentor detail. Mirrors the backend's `mentor_detail:{id}` /
 * `mentor_search:*` cache bust. Does NOT toast here — the caller decides copy.
 */
export function useAdminSetUserAvatar(userId: string) {
  const qc = useQueryClient()
  return useMutation<UserResponse, Error, File>({
    mutationFn: (file) => adminSetUserAvatar(userId, file),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ADMIN_MENTORS_KEY })
      void qc.invalidateQueries({ queryKey: ['coach-for-freshers'] })
      void qc.invalidateQueries({ queryKey: ['academic-counsellors'] })
      void qc.invalidateQueries({ queryKey: ['mentors'] })
      void qc.invalidateQueries({ queryKey: ['mentor'] })
    },
  })
}
