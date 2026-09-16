import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  cancelPayout,
  createPayout,
  getEligibleBookings,
  getOwed,
  getPayout,
  listPayouts,
  markPayoutPaid,
} from '../api/payouts.api'
import type {
  PayoutCancel,
  PayoutCreatePayload,
  PayoutDetailResponse,
  PayoutMarkPaid,
  PayoutStatus,
} from '../types/payouts.types'

// ── Query keys ────────────────────────────────────────────────────────────
//
// Centralised so every mutation invalidates the right entries without
// typos. Mirrors the `useAdminRefunds` / `useAdminMentors` convention.

export const ADMIN_PAYOUTS_KEY = ['admin', 'payouts'] as const

export const ADMIN_PAYOUTS_OWED_KEY = [...ADMIN_PAYOUTS_KEY, 'owed'] as const
export const ADMIN_PAYOUTS_ELIGIBLE_KEY = (mentorId: string) =>
  [...ADMIN_PAYOUTS_KEY, 'eligible', mentorId] as const

export function adminPayoutsHistoryKey(args: {
  page: number
  status: PayoutStatus | undefined
  start_date: string | undefined
  end_date: string | undefined
}) {
  return [
    ...ADMIN_PAYOUTS_KEY,
    'history',
    args.status ?? 'all',
    args.start_date ?? '',
    args.end_date ?? '',
    args.page,
  ] as const
}

export function adminPayoutDetailKey(id: string | undefined) {
  return [...ADMIN_PAYOUTS_KEY, 'detail', id ?? ''] as const
}

// ── Queries ───────────────────────────────────────────────────────────────

export function useOwed() {
  return useQuery({
    queryKey: ADMIN_PAYOUTS_OWED_KEY,
    queryFn: () => getOwed(),
    staleTime: 30 * 1000,
  })
}

export interface UseEligibleBookingsParams {
  mentor_id: string | null
  period_start?: string
  period_end?: string
  /** Disable until a mentor is picked. */
  enabled?: boolean
}

export function useEligibleBookings(params: UseEligibleBookingsParams) {
  const { mentor_id, period_start, period_end, enabled = true } = params
  return useQuery({
    queryKey: [...ADMIN_PAYOUTS_ELIGIBLE_KEY(mentor_id ?? ''), period_start ?? '', period_end ?? ''],
    queryFn: () => {
      if (!mentor_id) throw new Error('mentor_id is required')
      return getEligibleBookings({ mentor_id, period_start, period_end })
    },
    enabled: enabled && !!mentor_id,
    placeholderData: keepPreviousData,
    staleTime: 15 * 1000,
  })
}

export interface UsePayoutsListParams {
  page?: number
  page_size?: number
  status?: PayoutStatus
  start_date?: string
  end_date?: string
}

export function usePayoutsList(params: UsePayoutsListParams) {
  const { page = 1, page_size = 20, status, start_date, end_date } = params
  return useQuery({
    queryKey: adminPayoutsHistoryKey({ page, status, start_date, end_date }),
    queryFn: () => listPayouts({ page, page_size, status, start_date, end_date }),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

export function usePayoutDetail(payoutId: string | undefined) {
  return useQuery({
    queryKey: adminPayoutDetailKey(payoutId),
    queryFn: () => {
      if (!payoutId) throw new Error('payoutId is required')
      return getPayout(payoutId)
    },
    enabled: !!payoutId,
    staleTime: 15 * 1000,
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────
//
// Every payout mutation invalidates `/owed` + history, since both views
// share state (a new payout removes bookings from `owed`; a mark-paid or
// cancel transitions a payout between statuses).

function invalidatePayoutQueries(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: ADMIN_PAYOUTS_KEY })
}

export function useCreatePayout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PayoutCreatePayload) => createPayout(payload),
    onSuccess: (data: PayoutDetailResponse) => {
      invalidatePayoutQueries(qc)
      qc.setQueryData(adminPayoutDetailKey(data.id), data)
    },
  })
}

export function useMarkPayoutPaid() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PayoutMarkPaid }) =>
      markPayoutPaid(id, payload),
    onSuccess: (data: PayoutDetailResponse) => {
      invalidatePayoutQueries(qc)
      qc.setQueryData(adminPayoutDetailKey(data.id), data)
    },
  })
}

export function useCancelPayout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PayoutCancel }) =>
      cancelPayout(id, payload),
    onSuccess: (data: PayoutDetailResponse) => {
      invalidatePayoutQueries(qc)
      qc.setQueryData(adminPayoutDetailKey(data.id), data)
    },
  })
}