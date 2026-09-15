// Public-facing event hooks. Lists use keepPreviousData for smooth pagination.

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createEventBooking,
  getPastEvents,
  getPublicEvent,
  getUpcomingEvents,
} from '../api/events.api'
import {
  EventBookingCreate,
  EventBookingResponse,
  EventResponse,
  EventSummaryResponse,
} from '../types/events.types'
import { PaginatedResponse } from '@/lib/api/api.types'

export const EVENTS_UPCOMING_KEY = ['events', 'upcoming'] as const
export const EVENTS_PAST_KEY = ['events', 'past'] as const
export const EVENT_DETAIL_KEY = ['events', 'detail'] as const

export function useUpcomingEvents(page = 1, pageSize = 12) {
  return useQuery<PaginatedResponse<EventSummaryResponse>>({
    queryKey: [...EVENTS_UPCOMING_KEY, page, pageSize],
    queryFn: () => getUpcomingEvents({ page, pageSize }),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

export function usePastEvents(page = 1, pageSize = 12) {
  return useQuery<PaginatedResponse<EventSummaryResponse>>({
    queryKey: [...EVENTS_PAST_KEY, page, pageSize],
    queryFn: () => getPastEvents({ page, pageSize }),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

export function usePublicEvent(eventId: string | undefined) {
  return useQuery<EventResponse>({
    queryKey: [...EVENT_DETAIL_KEY, eventId],
    queryFn: () => getPublicEvent(eventId as string),
    enabled: !!eventId,
    staleTime: 30 * 1000,
  })
}

export function useCreateEventBooking(eventId: string) {
  const qc = useQueryClient()
  return useMutation<EventBookingResponse, Error, EventBookingCreate>({
    mutationFn: (payload) => createEventBooking(eventId, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['events', 'admin', eventId, 'bookings'] })
    },
  })
}
