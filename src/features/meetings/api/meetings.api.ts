import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'
import {
  AdminMeetingRow,
  AdminMeetingRetryResponse,
  MeetingFilters,
} from '../types/meetings.types'

function filterToParams(filters: MeetingFilters): Record<string, unknown> {
  return {
    has_link:
      filters.has_link === undefined ? undefined : filters.has_link ? 'true' : 'false',
    status: filters.status,
    date_from: filters.date_from,
    date_to: filters.date_to,
    q: filters.q || undefined,
    page: filters.page ?? 1,
    page_size: filters.page_size ?? 20,
  }
}

/** `GET /admin/meetings` — admin-wide list with extra mentee/mentor fields. */
export async function getAdminMeetings(
  filters: MeetingFilters = {}
): Promise<PaginatedResponse<AdminMeetingRow>> {
  const response = await apiClient.get<PaginatedResponse<AdminMeetingRow>>(
    '/admin/meetings',
    { params: filterToParams(filters) }
  )
  return response.data
}

/** `GET /admin/meetings/missing` — paid bookings with no link (recovery queue). */
export async function getAdminMissingMeetings(
  filters: Pick<MeetingFilters, 'page' | 'page_size'> = {}
): Promise<PaginatedResponse<AdminMeetingRow>> {
  const response = await apiClient.get<PaginatedResponse<AdminMeetingRow>>(
    '/admin/meetings/missing',
    {
      params: {
        page: filters.page ?? 1,
        page_size: filters.page_size ?? 50,
      },
    }
  )
  return response.data
}

/** `POST /admin/meetings/{booking_id}/retry` — idempotent re-attempt. */
export async function retryAdminMeeting(
  bookingId: string
): Promise<AdminMeetingRetryResponse> {
  const response = await apiClient.post<AdminMeetingRetryResponse>(
    `/admin/meetings/${bookingId}/retry`
  )
  return response.data
}