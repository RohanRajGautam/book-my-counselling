import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getAdminMentors,
  getAdminStats,
  verifyMentor,
  rejectMentor,
  featureMentor,
  reindexElasticsearch,
  getMentorsWithoutAvailability,
  sendAvailabilityReminder,
  sendBulkAvailabilityReminder,
} from '../api/admin.api'
import { PaginatedResponse } from '@/lib/api/api.types'
import { AdminMentorProfile } from '../types/admin.types'

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: getAdminStats,
    staleTime: 30 * 1000,
  })
}

// Tab filter params — each tab maps to specific query params
export type AdminMentorFilter = {
  isVerified?: boolean
  isRejected?: boolean
}

export function useAdminMentors(filter: AdminMentorFilter, page = 1) {
  return useQuery({
    queryKey: ['admin', 'mentors', filter, page],
    queryFn: () => getAdminMentors(filter.isVerified, filter.isRejected, page),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

export function useVerifyMentor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => verifyMentor(id),
    onSuccess: (_data, id) => {
      // Remove from pending + rejected lists immediately
      _removeMentorFromAllCaches(qc, id)
      qc.invalidateQueries({ queryKey: ['admin', 'mentors'] })
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
    },
  })
}

export function useRejectMentor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => rejectMentor(id),
    onSuccess: (_data, id) => {
      _removeMentorFromAllCaches(qc, id)
      qc.invalidateQueries({ queryKey: ['admin', 'mentors'] })
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
    },
  })
}

export function useFeatureMentor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      featureMentor(id, featured),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'mentors'] }),
  })
}

export function useReindexES() {
  return useMutation({ mutationFn: reindexElasticsearch })
}

export function useMentorsWithoutAvailability(params: {
  isVerified?: boolean
  page?: number
}) {
  return useQuery({
    queryKey: ['admin', 'mentors', 'without-availability', params],
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
      void qc.invalidateQueries({ queryKey: ['admin', 'mentors', 'without-availability'] })
    },
    onError: () => toast.error('Failed to send bulk reminders.'),
  })
}

// ---------------------------------------------------------------------------
// Cache helper — removes a mentor row from every cached admin list
// ---------------------------------------------------------------------------

function _removeMentorFromAllCaches(
  qc: ReturnType<typeof useQueryClient>,
  mentorId: string,
) {
  const queries = qc.getQueriesData<PaginatedResponse<AdminMentorProfile>>({
    queryKey: ['admin', 'mentors'],
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
