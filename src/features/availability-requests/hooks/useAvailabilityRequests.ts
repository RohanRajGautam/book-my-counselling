'use client'

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  confirmAvailabilityRequest,
  createAvailabilityRequest,
  listAllAvailabilityRequests,
  listMyAvailabilityRequests,
  rejectAvailabilityRequest,
  type ListAvailabilityRequestsParams,
} from '../api/availability-requests.api'
import {
  AvailabilityRequestCreate,
  AvailabilityRequestReject,
  AvailabilityRequestResponse,
} from '../types/availability-requests.types'

// Stable query-key namespaces for cache invalidation.
export const MENTOR_AVAILABILITY_REQUESTS_KEY = [
  'mentor',
  'availability-requests',
] as const

export const ADMIN_AVAILABILITY_REQUESTS_KEY = [
  'admin',
  'availability-requests',
] as const

// ── Public ────────────────────────────────────────────────────────────────

export function useCreateAvailabilityRequest() {
  return useMutation({
    mutationFn: (payload: AvailabilityRequestCreate) =>
      createAvailabilityRequest(payload),
  })
}

// ── Mentor ────────────────────────────────────────────────────────────────

export function useMyAvailabilityRequests(params: ListAvailabilityRequestsParams) {
  const { status, page = 1, pageSize = 20 } = params
  return useQuery({
    queryKey: [...MENTOR_AVAILABILITY_REQUESTS_KEY, status ?? 'all', page, pageSize],
    queryFn: () => listMyAvailabilityRequests({ status, page, pageSize }),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

interface ConfirmVars {
  id: string
}

interface RejectVars {
  id: string
  payload?: AvailabilityRequestReject
}

interface ConfirmContext {
  previous: [readonly unknown[], unknown][] | undefined
}

function invalidateRequestLists(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: MENTOR_AVAILABILITY_REQUESTS_KEY })
  qc.invalidateQueries({ queryKey: ADMIN_AVAILABILITY_REQUESTS_KEY })
  // Confirm creates an AvailabilitySlot — refresh mentor/admin slot caches too.
  qc.invalidateQueries({ queryKey: ['my-availability'] })
  qc.invalidateQueries({ queryKey: ['mentor-availability'] })
}

export function useConfirmAvailabilityRequest() {
  const qc = useQueryClient()
  return useMutation<AvailabilityRequestResponse, Error, ConfirmVars, ConfirmContext>({
    mutationFn: ({ id }) => confirmAvailabilityRequest(id),
    onSuccess: () => invalidateRequestLists(qc),
  })
}

export function useRejectAvailabilityRequest() {
  const qc = useQueryClient()
  return useMutation<AvailabilityRequestResponse, Error, RejectVars, ConfirmContext>({
    mutationFn: ({ id, payload }) => rejectAvailabilityRequest(id, payload),
    onSuccess: () => invalidateRequestLists(qc),
  })
}

// ── Admin ─────────────────────────────────────────────────────────────────

export function useAllAvailabilityRequests(params: ListAvailabilityRequestsParams) {
  const { status, page = 1, pageSize = 20 } = params
  return useQuery({
    queryKey: [...ADMIN_AVAILABILITY_REQUESTS_KEY, status ?? 'all', page, pageSize],
    queryFn: () => listAllAvailabilityRequests({ status, page, pageSize }),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}
