'use client'

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getAdminMentorMatchRequest,
  listAdminMentorMatchRequests,
  updateAdminMentorMatchRequest,
  type ListAdminMentorMatchRequestsParams,
} from '../api/mentor-match-requests.api'
import type {
  MentorMatchRequestStatus,
  MentorMatchResponse,
  MentorMatchUpdate,
} from '../types/mentor-match-requests.types'

// Stable query-key namespaces for cache invalidation.
export const ADMIN_MENTOR_MATCH_REQUESTS_KEY = [
  'admin',
  'mentor-match-requests',
] as const

const ADMIN_MENTOR_MATCH_REQUEST_KEY = [
  'admin',
  'mentor-match-request',
] as const

// ── Admin list ────────────────────────────────────────────────────────────

export function useAdminMentorMatchRequests(params: ListAdminMentorMatchRequestsParams) {
  const { status, page = 1, pageSize = 20 } = params
  return useQuery({
    queryKey: [...ADMIN_MENTOR_MATCH_REQUESTS_KEY, status ?? 'all', page, pageSize],
    queryFn: () => listAdminMentorMatchRequests({ status, page, pageSize }),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

// ── Admin detail ──────────────────────────────────────────────────────────

export function useAdminMentorMatchRequest(id: string | null) {
  return useQuery({
    queryKey: [...ADMIN_MENTOR_MATCH_REQUEST_KEY, id],
    queryFn: () => getAdminMentorMatchRequest(id as string),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  })
}

interface UpdateVars {
  id: string
  payload: MentorMatchUpdate
}

/**
 * PATCH a single request. Invalidates both the list and the detail cache so
 * the row's new status + audit fields show up everywhere.
 */
export function useUpdateAdminMentorMatchRequest() {
  const qc = useQueryClient()
  return useMutation<MentorMatchResponse, Error, UpdateVars>({
    mutationFn: ({ id, payload }) => updateAdminMentorMatchRequest(id, payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ADMIN_MENTOR_MATCH_REQUESTS_KEY })
      qc.invalidateQueries({ queryKey: ADMIN_MENTOR_MATCH_REQUEST_KEY })
      qc.setQueryData([...ADMIN_MENTOR_MATCH_REQUEST_KEY, data.id], data)
    },
  })
}

// ── Type re-exports for consumers ─────────────────────────────────────────

export type { MentorMatchRequestStatus }
