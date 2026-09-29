import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  adminCompleteOutsideSession,
  adminCreateOutsideSession,
  adminListOutsideSessions,
  AdminListOutsideSessionsParams,
} from '../api/outside-sessions.api'
import {
  OutsideSessionCreate,
  OutsideSessionStatus,
} from '../../types/admin.types'

export interface UseOutsideSessionsParams {
  q?: string
  status?: OutsideSessionStatus
  page?: number
}

export const OUTSIDE_SESSIONS_KEY = ['admin', 'outside-sessions'] as const

export function useOutsideSessions(params: UseOutsideSessionsParams) {
  const { q, status, page = 1 } = params
  return useQuery({
    queryKey: [...OUTSIDE_SESSIONS_KEY, q ?? '', status ?? 'all', page],
    queryFn: () =>
      adminListOutsideSessions({
        q: q?.trim() || undefined,
        status,
        page,
      } satisfies AdminListOutsideSessionsParams),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  })
}

/**
 * Records a new outside session. On success, invalidates the list + any
 * single-row views. Does NOT touch bookings / analytics — outside sessions
 * don't count toward revenue or the bookings dashboard per spec.
 */
export function useCreateOutsideSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: OutsideSessionCreate) =>
      adminCreateOutsideSession(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: OUTSIDE_SESSIONS_KEY })
    },
  })
}

/**
 * PATCHes a `scheduled` row to `completed`. Idempotent on the server side.
 * Invalidates the list + any single-row views.
 */
export function useCompleteOutsideSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: string) =>
      adminCompleteOutsideSession(sessionId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: OUTSIDE_SESSIONS_KEY })
    },
  })
}