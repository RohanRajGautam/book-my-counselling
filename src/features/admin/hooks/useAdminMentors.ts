import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAdminMentors,
  getAdminStats,
  verifyMentor,
  rejectMentor,
  featureMentor,
  reindexElasticsearch,
} from '../api/admin.api'

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: getAdminStats,
    staleTime: 30 * 1000,
  })
}

export function useAdminMentors(isVerified?: boolean, page = 1) {
  return useQuery({
    queryKey: ['admin', 'mentors', isVerified, page],
    queryFn: () => getAdminMentors(isVerified, page),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

export function useVerifyMentor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => verifyMentor(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'mentors'] })
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
    },
  })
}

export function useRejectMentor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => rejectMentor(id),
    onSuccess: () => {
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
