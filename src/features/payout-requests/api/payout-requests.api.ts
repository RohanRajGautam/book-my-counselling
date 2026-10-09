import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'
import type {
  PayoutRequestAcknowledge,
  PayoutRequestAdminRow,
  PayoutRequestCreate,
  PayoutRequestMentorRow,
  PayoutRequestStatus,
} from '../types/payout-requests.types'

// ── Mentor ─────────────────────────────────────────────────────────────────

export interface ListMyPayoutRequestsParams {
  page?: number
  pageSize?: number
}

/**
 * Submit a payout request. The mentor is resolved from the bearer token
 * server-side, so the body only carries the optional note.
 *
 * Returns the freshly created `PayoutRequestMentorRow` so the caller can
 * surface the `balance_snapshot` and the `eligible_booking_count` without
 * an extra GET round-trip.
 */
export async function createPayoutRequest(
  payload: PayoutRequestCreate = {}
): Promise<PayoutRequestMentorRow> {
  const res = await apiClient.post<PayoutRequestMentorRow>('/mentors/me/payout-request', payload)
  return res.data
}

export async function listMyPayoutRequests(
  params: ListMyPayoutRequestsParams = {}
): Promise<PaginatedResponse<PayoutRequestMentorRow>> {
  const res = await apiClient.get<PaginatedResponse<PayoutRequestMentorRow>>(
    '/mentors/me/payout-request',
    {
      params: {
        page: params.page ?? 1,
        page_size: params.pageSize ?? 20,
      },
    }
  )
  return res.data
}

// ── Admin ──────────────────────────────────────────────────────────────────

export interface ListAdminPayoutRequestsParams {
  status?: PayoutRequestStatus
  page?: number
  pageSize?: number
}

/**
 * List every payout request. Status is optional — omitting it returns all.
 * The backend orders open rows first, then acknowledged (newest of each).
 */
export async function listAdminPayoutRequests(
  params: ListAdminPayoutRequestsParams = {}
): Promise<PaginatedResponse<PayoutRequestAdminRow>> {
  const res = await apiClient.get<PaginatedResponse<PayoutRequestAdminRow>>(
    '/admin/payout-requests',
    {
      params: {
        status: params.status,
        page: params.page ?? 1,
        page_size: params.pageSize ?? 20,
      },
    }
  )
  return res.data
}

/**
 * Acknowledge a request — a read receipt, NOT a payout. Money does not
 * move; the admin still has to run `/admin/payouts/.../mark-paid` to
 * disburse funds. The response is the updated admin row.
 */
export async function acknowledgePayoutRequest(
  id: string,
  payload: PayoutRequestAcknowledge = {}
): Promise<PayoutRequestAdminRow> {
  const res = await apiClient.post<PayoutRequestAdminRow>(
    `/admin/payout-requests/${id}/acknowledge`,
    payload
  )
  return res.data
}
