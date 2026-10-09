'use client'

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  acknowledgePayoutRequest,
  createPayoutRequest,
  listAdminPayoutRequests,
  listMyPayoutRequests,
  type ListAdminPayoutRequestsParams,
  type ListMyPayoutRequestsParams,
} from '../api/payout-requests.api'
import type {
  PayoutRequestAcknowledge,
  PayoutRequestAdminRow,
  PayoutRequestCreate,
  PayoutRequestMentorRow,
  PayoutRequestStatus,
} from '../types/payout-requests.types'

// ── Query keys ─────────────────────────────────────────────────────────────
//
// Centralised so mutations can invalidate the right entries without typos.
// `mentor/payout-requests` is mentor-side, `admin/payout-requests` is the
// admin queue. Both share the same status namespace.

export const MENTOR_PAYOUT_REQUESTS_KEY = ['mentor', 'payout-requests'] as const

export const ADMIN_PAYOUT_REQUESTS_KEY = ['admin', 'payout-requests'] as const

function adminPayoutRequestsListKey(args: {
  status: PayoutRequestStatus | undefined
  page: number
  pageSize: number
}) {
  return [
    ...ADMIN_PAYOUT_REQUESTS_KEY,
    'list',
    args.status ?? 'all',
    args.page,
    args.pageSize,
  ] as const
}

function mentorPayoutRequestsListKey(args: { page: number; pageSize: number }) {
  return [...MENTOR_PAYOUT_REQUESTS_KEY, 'list', args.page, args.pageSize] as const
}

// ── Mentor ─────────────────────────────────────────────────────────────────

/**
 * Submit a new payout request. On success we invalidate the mentor's
 * own list and the admin's queue (the new row should appear on both
 * sides without a manual refresh).
 *
 * `usePayoutRequestsByMentorId` isn't needed — the mentor is resolved
 * server-side from the bearer token, so we don't carry it client-side.
 */
export function useCreatePayoutRequest() {
  const qc = useQueryClient()
  return useMutation<PayoutRequestMentorRow, Error, PayoutRequestCreate | void>({
    mutationFn: (payload) => createPayoutRequest(payload ?? {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: MENTOR_PAYOUT_REQUESTS_KEY })
      qc.invalidateQueries({ queryKey: ADMIN_PAYOUT_REQUESTS_KEY })
    },
  })
}

export function useMyPayoutRequests(params: ListMyPayoutRequestsParams) {
  const { page = 1, pageSize = 20 } = params
  return useQuery({
    queryKey: mentorPayoutRequestsListKey({ page, pageSize }),
    queryFn: () => listMyPayoutRequests({ page, pageSize }),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

// ── Admin ──────────────────────────────────────────────────────────────────

export function useAdminPayoutRequests(params: ListAdminPayoutRequestsParams) {
  const { status, page = 1, pageSize = 20 } = params
  return useQuery({
    queryKey: adminPayoutRequestsListKey({ status, page, pageSize }),
    queryFn: () => listAdminPayoutRequests({ status, page, pageSize }),
    placeholderData: keepPreviousData,
    // Short stale time so the queue auto-refreshes when a mentor files a
    // request from another tab. The page also kicks off a manual
    // refetch on a 30s interval (see `AdminPayoutRequestsPage`).
    staleTime: 15 * 1000,
  })
}

interface AcknowledgeVars {
  id: string
  payload?: PayoutRequestAcknowledge
}

/**
 * Admin acknowledge (read receipt). Acknowledging a request does not move
 * money — the admin still has to run the existing `/admin/payouts` flow.
 * We only invalidate the payout-request caches here; payouts and
 * payout-requests are independent ledgers.
 */
export function useAcknowledgePayoutRequest() {
  const qc = useQueryClient()
  return useMutation<PayoutRequestAdminRow, Error, AcknowledgeVars>({
    mutationFn: ({ id, payload }) => acknowledgePayoutRequest(id, payload ?? {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_PAYOUT_REQUESTS_KEY })
      // Mentor needs to see the ack on their own list.
      qc.invalidateQueries({ queryKey: MENTOR_PAYOUT_REQUESTS_KEY })
    },
  })
}
