import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'
import type {
  OwedPerBookingItem,
  OwedResponse,
  PayoutCancel,
  PayoutCreatePayload,
  PayoutDetailResponse,
  PayoutMarkPaid,
  PayoutResponse,
  PayoutStatus,
} from '../types/payouts.types'

// ── Owed ──────────────────────────────────────────────────────────────────

export async function getOwed(): Promise<OwedResponse> {
  const res = await apiClient.get<OwedResponse>('/admin/payouts/owed')
  return res.data
}

// ── Eligible bookings (per-mentor preview) ────────────────────────────────

export async function getEligibleBookings(params: {
  mentor_id: string
  period_start?: string
  period_end?: string
}): Promise<OwedPerBookingItem[]> {
  const res = await apiClient.get<OwedPerBookingItem[]>(
    '/admin/payouts/eligible-bookings',
    {
      params: {
        mentor_id: params.mentor_id,
        period_start: params.period_start,
        period_end: params.period_end,
      },
    },
  )
  return res.data
}

// ── Create ────────────────────────────────────────────────────────────────

export async function createPayout(
  payload: PayoutCreatePayload,
): Promise<PayoutDetailResponse> {
  const res = await apiClient.post<PayoutDetailResponse>('/admin/payouts', payload)
  return res.data
}

// ── List ──────────────────────────────────────────────────────────────────

export async function listPayouts(params: {
  page?: number
  page_size?: number
  mentor_id?: string
  status?: PayoutStatus
  start_date?: string
  end_date?: string
}): Promise<PaginatedResponse<PayoutResponse>> {
  const res = await apiClient.get<PaginatedResponse<PayoutResponse>>(
    '/admin/payouts',
    {
      params: {
        page: params.page ?? 1,
        page_size: params.page_size ?? 20,
        mentor_id: params.mentor_id,
        status: params.status,
        start_date: params.start_date,
        end_date: params.end_date,
      },
    },
  )
  return res.data
}

// ── Detail ───────────────────────────────────────────────────────────────

export async function getPayout(payoutId: string): Promise<PayoutDetailResponse> {
  const res = await apiClient.get<PayoutDetailResponse>(`/admin/payouts/${payoutId}`)
  return res.data
}

// ── Mark paid ─────────────────────────────────────────────────────────────

export async function markPayoutPaid(
  payoutId: string,
  payload: PayoutMarkPaid,
): Promise<PayoutDetailResponse> {
  const res = await apiClient.post<PayoutDetailResponse>(
    `/admin/payouts/${payoutId}/mark-paid`,
    payload,
  )
  return res.data
}

// ── Cancel ────────────────────────────────────────────────────────────────

export async function cancelPayout(
  payoutId: string,
  payload: PayoutCancel,
): Promise<PayoutDetailResponse> {
  const res = await apiClient.post<PayoutDetailResponse>(
    `/admin/payouts/${payoutId}/cancel`,
    payload,
  )
  return res.data
}