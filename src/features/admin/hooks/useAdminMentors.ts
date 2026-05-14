import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAdminMentors,
  getAdminStats,
  verifyMentor,
  rejectMentor,
  featureMentor,
  reindexElasticsearch,
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
