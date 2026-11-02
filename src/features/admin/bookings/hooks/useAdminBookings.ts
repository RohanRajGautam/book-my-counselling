import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PaginatedResponse } from '@/lib/api/api.types'
import {
  adminCancelBooking,
  adminCompleteBooking,
  adminCreateBookingOnBehalf,
  searchAdminBookings,
} from '../api/bookings.api'
import {
  AdminBookingRow,
  AdminBookingStatus,
  AdminCreateBookingRequest,
  AdminPaymentStatus,
} from '../../types/admin.types'
import {
  MENTOR_SESSION_SUMMARY_KEY,
  MENTOR_SESSIONS_KEY,
} from '../../mentor-sessions/lib/queryKeys'

export interface UseAdminBookingsParams {
  q?: string
  status?: AdminBookingStatus
  paymentStatus?: AdminPaymentStatus
  /** Narrow to one mentor (the `MentorProfile.id`). */
  mentorId?: string
  page?: number
}

export const ADMIN_BOOKINGS_KEY = ['admin', 'bookings'] as const

export function useAdminBookings(params: UseAdminBookingsParams) {
  const { q, status, paymentStatus, mentorId, page = 1 } = params
  return useQuery({
    queryKey: [
      ...ADMIN_BOOKINGS_KEY,
      q ?? '',
      status ?? 'all',
      paymentStatus ?? 'all',
      mentorId ?? '',
      page,
    ],
    queryFn: () => searchAdminBookings({ q, status, paymentStatus, mentorId, page }),
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
      void qc.invalidateQueries({ queryKey: MENTOR_SESSIONS_KEY })
      void qc.invalidateQueries({ queryKey: MENTOR_SESSION_SUMMARY_KEY })
      void qc.invalidateQueries({ queryKey: ['admin', 'refunds'] })
      void qc.invalidateQueries({ queryKey: ['admin', 'analytics', 'stats'] })
      void qc.invalidateQueries({ queryKey: ['admin', 'analytics', 'revenue'] })
    },
  })
}

/**
 * Marks a booking session as completed on the mentor's behalf.
 *
 * The returned row is swapped into every cached page of the admin bookings
 * list, so the UI updates in place — the list is deliberately NOT
 * invalidated, which would trigger a refetch.
 */
export function useAdminCompleteBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (bookingId: string) => adminCompleteBooking(bookingId),
    onSuccess: (updated, bookingId) => {
      replaceBookingInAdminCaches(qc, updated, bookingId)
      // The mentor's session count went up by one.
      void qc.invalidateQueries({ queryKey: ['admin', 'mentors'] })
      void qc.invalidateQueries({ queryKey: ['admin', 'analytics', 'stats'] })
      // The mentor's "still open" count dropped by one.
      void qc.invalidateQueries({ queryKey: MENTOR_SESSION_SUMMARY_KEY })
    },
  })
}

/**
 * Swaps a single booking row into every cached page of the admin bookings
 * list and every cached page of a mentor's own session list — the same
 * booking can sit in both. The lists are cached per filter set, so patch
 * every matching cache entry.
 */
function replaceBookingInAdminCaches(
  qc: ReturnType<typeof useQueryClient>,
  updated: AdminBookingRow,
  bookingId: string,
) {
  const queries = [
    ...qc.getQueriesData<PaginatedResponse<AdminBookingRow>>({
      queryKey: ADMIN_BOOKINGS_KEY,
    }),
    ...qc.getQueriesData<PaginatedResponse<AdminBookingRow>>({
      queryKey: MENTOR_SESSIONS_KEY,
    }),
  ]
  for (const [key, data] of queries) {
    if (!data) continue
    let changed = false
    const items = data.items.map((b) => {
      if (b.id !== bookingId) return b
      changed = true
      return updated
    })
    if (changed) qc.setQueryData(key, { ...data, items })
  }
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
