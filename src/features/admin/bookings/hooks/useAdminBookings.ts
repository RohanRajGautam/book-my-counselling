import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  adminCancelBooking,
  adminCreateBookingOnBehalf,
  searchAdminBookings,
} from '../api/bookings.api'
import {
  AdminBookingStatus,
  AdminCreateBookingRequest,
  AdminPaymentStatus,
} from '../../types/admin.types'

export interface UseAdminBookingsParams {
  q?: string
  status?: AdminBookingStatus
  paymentStatus?: AdminPaymentStatus
  page?: number
}

export const ADMIN_BOOKINGS_KEY = ['admin', 'bookings'] as const

export function useAdminBookings(params: UseAdminBookingsParams) {
  const { q, status, paymentStatus, page = 1 } = params
  return useQuery({
    queryKey: [
      ...ADMIN_BOOKINGS_KEY,
      q ?? '',
      status ?? 'all',
      paymentStatus ?? 'all',
      page,
    ],
    queryFn: () => searchAdminBookings({ q, status, paymentStatus, page }),
    placeholderData: keepPreviousData,
    staleTime: 15 * 1000,
  })
}

export function useAdminCancelBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminCancelBooking(id, reason),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ADMIN_BOOKINGS_KEY })
      void qc.invalidateQueries({ queryKey: ['admin', 'refunds'] })
      void qc.invalidateQueries({ queryKey: ['admin', 'analytics', 'stats'] })
      void qc.invalidateQueries({ queryKey: ['admin', 'analytics', 'revenue'] })
    },
  })
}

/**
 * Records an offline session through `POST /admin/bookings/on-behalf`.
 *
 * Invalidates the admin bookings list + analytics so the new row + the
 * updated totals show up everywhere. Does NOT toast — the modal shows its own
 * success detail panel and offers "Record another".
 */
export function useAdminCreateBookingOnBehalf() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminCreateBookingRequest) =>
      adminCreateBookingOnBehalf(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ADMIN_BOOKINGS_KEY })
      void qc.invalidateQueries({ queryKey: ['admin', 'analytics', 'stats'] })
      void qc.invalidateQueries({ queryKey: ['admin', 'analytics', 'revenue'] })
      void qc.invalidateQueries({ queryKey: ['admin', 'payouts'] })
    },
  })
}
