import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAdminMeetings,
  getAdminMissingMeetings,
  retryAdminMeeting,
} from '../api/meetings.api'
import { MeetingFilters } from '../types/meetings.types'

const KEYS = {
  admin: ['admin', 'meetings'] as const,
  adminMissing: ['admin', 'meetings', 'missing'] as const,
}

function filterSignature(filters: MeetingFilters): string {
  return JSON.stringify({
    has_link: filters.has_link,
    status: filters.status,
    date_from: filters.date_from,
    date_to: filters.date_to,
    q: filters.q,
    page: filters.page ?? 1,
    page_size: filters.page_size ?? 20,
  })
}

export function useAdminMeetings(filters: MeetingFilters = {}) {
  return useQuery({
    queryKey: [...KEYS.admin, filterSignature(filters)],
    queryFn: () => getAdminMeetings(filters),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  })
}

export function useAdminMissingMeetings(
  filters: Pick<MeetingFilters, 'page' | 'page_size'> = {}
) {
  return useQuery({
    queryKey: [
      ...KEYS.adminMissing,
      filters.page ?? 1,
      filters.page_size ?? 50,
    ],
    queryFn: () => getAdminMissingMeetings(filters),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  })
}

/**
 * Manual retry for a missing booking's meeting. Invalidates every admin
 * meetings query (the row leaves the missing queue on success) plus the
 * bookings list (in case the card is showing on `/admin/bookings`).
 */
export function useRetryAdminMeeting() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (bookingId: string) => retryAdminMeeting(bookingId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEYS.admin })
      void qc.invalidateQueries({ queryKey: KEYS.adminMissing })
      void qc.invalidateQueries({ queryKey: ['admin', 'bookings'] })
    },
  })
}