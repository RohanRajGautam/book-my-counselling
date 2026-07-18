import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'
import {
  AdminBookingRow,
  AdminBookingStatus,
  AdminPaymentStatus,
} from '../../types/admin.types'

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
