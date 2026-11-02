// HTTP layer for the mentor-scoped session endpoints.
//
// Two endpoints, both under `/admin/mentors/{mentor_id}`:
//   GET /admin/mentors/{id}/sessions            → paginated AdminBookingRow
//   GET /admin/mentors/{id}/sessions/summary    → MentorSessionSummary
//
// The sessions endpoint returns the same row shape as the global bookings
// list, so the bookings components render it unchanged.

import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'
import {
  AdminBookingRow,
  AdminBookingStatus,
  AdminPaymentStatus,
  MentorSessionSort,
  MentorSessionSummary,
} from '../../types/admin.types'

export interface AdminListMentorSessionsParams {
  status?: AdminBookingStatus
  paymentStatus?: AdminPaymentStatus
  /** ISO 8601 instant, inclusive. */
  dateFrom?: string
  /** ISO 8601 instant, inclusive. */
  dateTo?: string
  sort?: MentorSessionSort
  page?: number
  pageSize?: number
}

/**
 * `GET /admin/mentors/{mentor_id}/sessions` — one mentor's platform bookings.
 *
 * `date_from` / `date_to` filter on when the session starts (not on when the
 * booking was made), and both bounds are inclusive.
 */
export async function adminListMentorSessions(
  mentorId: string,
  params: AdminListMentorSessionsParams = {},
): Promise<PaginatedResponse<AdminBookingRow>> {
  const res = await apiClient.get<PaginatedResponse<AdminBookingRow>>(
    `/admin/mentors/${mentorId}/sessions`,
    {
      params: {
        status: params.status,
        payment_status: params.paymentStatus,
        date_from: params.dateFrom,
        date_to: params.dateTo,
        sort: params.sort,
        page: params.page ?? 1,
        page_size: params.pageSize ?? 20,
      },
    },
  )
  return res.data
}

/**
 * `GET /admin/mentors/{mentor_id}/sessions/summary` — grouped counts for one
 * mentor's sessions. Two cheap COUNT queries server-side; cheap enough to
 * refetch after every mutation that changes them.
 */
export async function adminGetMentorSessionSummary(
  mentorId: string,
): Promise<MentorSessionSummary> {
  const res = await apiClient.get<MentorSessionSummary>(
    `/admin/mentors/${mentorId}/sessions/summary`,
  )
  return res.data
}
