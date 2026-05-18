import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminCancelBooking, searchAdminBookings } from '../api/admin.api'
import { AdminBookingStatus, AdminPaymentStatus } from '../types/admin.types'

interface UseAdminBookingsParams {
  q?: string
  status?: AdminBookingStatus
  paymentStatus?: AdminPaymentStatus
  page?: number
}

export function useAdminBookings(params: UseAdminBookingsParams) {
  const { q, status, paymentStatus, page = 1 } = params
  return useQuery({
    queryKey: ['admin', 'bookings', q ?? '', status ?? 'all', paymentStatus ?? 'all', page],
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
      qc.invalidateQueries({ queryKey: ['admin', 'bookings'] })
      qc.invalidateQueries({ queryKey: ['admin', 'refunds'] })
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
    },
  })
}
