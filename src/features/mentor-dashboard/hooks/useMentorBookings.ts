import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMyBookings, getMyEarnings, updateBookingStatus } from '../api/mentor-dashboard.api'
import { BookingStatus } from '../types/booking-status'
import { EarningsFilters } from '../types/mentor-dashboard.types'

export const BOOKINGS_KEY = (status?: BookingStatus, page?: number) =>
  ['mentor', 'bookings', status ?? 'all', page ?? 1] as const

export const EARNINGS_KEY = (filters: EarningsFilters = {}) =>
  ['mentor', 'earnings', filters] as const

export function useMentorBookings(status?: BookingStatus, page = 1, pageSize = 20) {
  return useQuery({
    queryKey: BOOKINGS_KEY(status, page),
    queryFn: () => getMyBookings(status, page, pageSize),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  })
}

export function useMentorEarnings(filters: EarningsFilters = {}) {
  return useQuery({
    queryKey: EARNINGS_KEY(filters),
    queryFn: () => getMyEarnings(filters),
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
      // Invalidate booking lists and the aggregated stats so confirmed→completed
      // and other transitions are reflected on the dashboard cards.
      queryClient.invalidateQueries({ queryKey: ['mentor', 'bookings'] })
      queryClient.invalidateQueries({ queryKey: ['mentor', 'stats'] })
    },
  })
}
