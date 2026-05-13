import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMyBookings, updateBookingStatus } from '../api/mentor-dashboard.api'
import { BookingStatus } from '../types/booking-status'

export const BOOKINGS_KEY = (status?: BookingStatus, page?: number) =>
  ['mentor', 'bookings', status ?? 'all', page ?? 1] as const

export function useMentorBookings(status?: BookingStatus, page = 1, pageSize = 20) {
  return useQuery({
    queryKey: BOOKINGS_KEY(status, page),
    queryFn: () => getMyBookings(status, page, pageSize),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  })
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      bookingId,
      status,
      cancellationReason,
    }: {
      bookingId: string
      status: BookingStatus
      cancellationReason?: string
    }) => updateBookingStatus(bookingId, status, cancellationReason),
    onSuccess: () => {
      // Invalidate all booking queries so lists refresh
      queryClient.invalidateQueries({ queryKey: ['mentor', 'bookings'] })
    },
  })
}
