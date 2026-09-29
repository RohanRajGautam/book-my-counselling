import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'
import {
  AdminBookingRow,
  AdminBookingStatus,
  AdminCreateBookingRequest,
  AdminMentorPickerOption,
  AdminPaymentStatus,
} from '../../types/admin.types'
import { AdminMentorProfile } from '../../types/admin.types'

export async function searchAdminBookings(params: {
  q?: string
  status?: AdminBookingStatus
  paymentStatus?: AdminPaymentStatus
  page?: number
  pageSize?: number
}): Promise<PaginatedResponse<AdminBookingRow>> {
  const res = await apiClient.get<PaginatedResponse<AdminBookingRow>>('/admin/bookings', {
    params: {
      q: params.q || undefined,
      status: params.status,
      payment_status: params.paymentStatus,
      page: params.page ?? 1,
      page_size: params.pageSize ?? 20,
    },
  })
  return res.data
}

export async function adminCancelBooking(
  bookingId: string,
  cancellationReason: string,
): Promise<AdminBookingRow> {
  const res = await apiClient.post<AdminBookingRow>(
    `/admin/bookings/${bookingId}/cancel`,
    { cancellation_reason: cancellationReason },
  )
  return res.data
}

/**
 * Records a mentor session that happened (or will happen) outside the normal
 * booking flow. Returns the same `AdminBookingRow` shape as the rest of the
 * admin bookings UI; backend auto-derives `status` from `session_start`
 * (past → COMPLETED, future → CONFIRMED).
 *
 * `AdminCreateBookingRequest` — see `admin.types.ts`.
 * Doc: `POST /api/v1/admin/bookings/on-behalf`.
 */
export async function adminCreateBookingOnBehalf(
  payload: AdminCreateBookingRequest,
): Promise<AdminBookingRow> {
  const res = await apiClient.post<AdminBookingRow>(
    '/admin/bookings/on-behalf',
    payload,
  )
  return res.data
}

/**
 * Project a paginated mentor list response down to what the record-session
 * mentor picker needs. Pulled from the existing `/admin/mentors` endpoint so
 * the admin sees the same approved-mentor pool they see on the mentor list
 * page — no new admin-only search endpoint required.
 */
export function projectMentorsForPicker(
  response: PaginatedResponse<AdminMentorProfile>,
): AdminMentorPickerOption[] {
  return response.items.map((m) => ({
    id: m.id,
    full_name: m.user.full_name,
    email: m.user.email,
    title: m.title,
    mentor_share_pct: m.mentor_share_pct,
    hourly_rate: m.hourly_rate ?? null,
  }))
}
