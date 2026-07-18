import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  featureMentor,
  getAdminMentors,
  getMentorsWithoutAvailability,
  reindexElasticsearch,
  rejectMentor,
  sendAvailabilityReminder,
  sendBulkAvailabilityReminder,
  verifyMentor,
} from '../api/mentors.api'
import { PaginatedResponse } from '@/lib/api/api.types'
import { AdminMentorProfile } from '../../types/admin.types'

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

export function useMentorsWithoutAvailability(params: {
  isVerified?: boolean
  page?: number
}) {
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

// ── Cache helper ─────────────────────────────────────────────────────────

function removeMentorFromAdminCaches(
  qc: ReturnType<typeof useQueryClient>,
  mentorId: string,
) {
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
