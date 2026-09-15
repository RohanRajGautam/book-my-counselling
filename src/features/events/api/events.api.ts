// Public events API. All calls go through the shared axios client so they
// pick up the same baseURL + interceptor as everything else.

import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'

import {
  EventBookingCreate,
  EventBookingResponse,
  EventResponse,
  EventSummaryResponse,
} from '../types/events.types'

export interface PublicEventListParams {
  page?: number
  pageSize?: number
}

async function getEventList(
  path: string,
  params: PublicEventListParams
): Promise<PaginatedResponse<EventSummaryResponse>> {
  const res = await apiClient.get<PaginatedResponse<EventSummaryResponse>>(path, {
    params: {
      page: params.page ?? 1,
      page_size: params.pageSize ?? 12,
    },
  })
  return res.data
}

export function getUpcomingEvents(
  params: PublicEventListParams = {}
): Promise<PaginatedResponse<EventSummaryResponse>> {
  return getEventList('/events/upcoming', params)
}

export function getPastEvents(
  params: PublicEventListParams = {}
): Promise<PaginatedResponse<EventSummaryResponse>> {
  return getEventList('/events/past', params)
}

export async function getPublicEvent(eventId: string): Promise<EventResponse> {
  const res = await apiClient.get<EventResponse>(`/events/${eventId}`)
  return res.data
}

export async function createEventBooking(
  eventId: string,
  payload: EventBookingCreate
): Promise<EventBookingResponse> {
  const res = await apiClient.post<EventBookingResponse>(
    `/events/${eventId}/bookings`,
    payload
  )
  return res.data
}
