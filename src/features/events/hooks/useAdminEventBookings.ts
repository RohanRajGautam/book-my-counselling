// Admin booking inbox hooks — paginated list of bookings for a single event.

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getAdminEventBookings } from '../api/admin-events.api'
import { EventBookingResponse } from '../types/events.types'
import { PaginatedResponse } from '@/lib/api/api.types'

export const ADMIN_EVENT_BOOKINGS_KEY = ['admin', 'events', 'bookings'] as const

export function useAdminEventBookings(
  eventId: string | undefined,
  page = 1,
  pageSize = 50
) {
  return useQuery<PaginatedResponse<EventBookingResponse>>({
    queryKey: [...ADMIN_EVENT_BOOKINGS_KEY, eventId, page, pageSize],
    queryFn: () => getAdminEventBookings(eventId as string, { page, pageSize }),
    enabled: !!eventId,
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}
