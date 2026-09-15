// Admin events API. All endpoints are admin-JWT gated; the auth interceptor
// on the shared axios client attaches the bearer header for us.

import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'

import {
  CompanyInput,
  EventBookingResponse,
  EventCreatePayload,
  EventResponse,
  EventSummaryResponse,
  EventUpdatePayload,
  GalleryImageInput,
  TestimonialInput,
  TimelineItemInput,
} from '../types/events.types'

export interface AdminEventListParams {
  page?: number
  pageSize?: number
  isCompleted?: boolean | null
}

export async function getAdminEvents(
  params: AdminEventListParams = {}
): Promise<PaginatedResponse<EventSummaryResponse>> {
  const res = await apiClient.get<PaginatedResponse<EventSummaryResponse>>('/events/admin', {
    params: {
      is_completed:
        params.isCompleted === undefined || params.isCompleted === null
          ? undefined
          : params.isCompleted
            ? 'true'
            : 'false',
      page: params.page ?? 1,
      page_size: params.pageSize ?? 20,
    },
  })
  return res.data
}

export async function getAdminEvent(eventId: string): Promise<EventResponse> {
  const res = await apiClient.get<EventResponse>(`/events/admin/${eventId}`)
  return res.data
}

export async function createAdminEvent(payload: EventCreatePayload): Promise<EventResponse> {
  const res = await apiClient.post<EventResponse>('/events/admin', payload)
  return res.data
}

export async function updateAdminEvent(
  eventId: string,
  payload: EventUpdatePayload
): Promise<EventResponse> {
  const res = await apiClient.patch<EventResponse>(`/events/admin/${eventId}`, payload)
  return res.data
}

export async function deleteAdminEvent(eventId: string): Promise<void> {
  await apiClient.delete(`/events/admin/${eventId}`)
}

export async function markEventComplete(eventId: string): Promise<EventResponse> {
  const res = await apiClient.post<EventResponse>(`/events/admin/${eventId}/complete`)
  return res.data
}

// ── Nested timeline-items ────────────────────────────────────────────────

export async function appendTimelineItem(
  eventId: string,
  payload: TimelineItemInput
): Promise<EventResponse['timeline_items'][number]> {
  const res = await apiClient.post<EventResponse['timeline_items'][number]>(
    `/events/admin/${eventId}/timeline-items`,
    payload
  )
  return res.data
}

export async function updateTimelineItem(
  eventId: string,
  itemId: string,
  payload: Partial<TimelineItemInput>
): Promise<EventResponse['timeline_items'][number]> {
  const res = await apiClient.patch<EventResponse['timeline_items'][number]>(
    `/events/admin/${eventId}/timeline-items/${itemId}`,
    payload
  )
  return res.data
}

export async function deleteTimelineItem(eventId: string, itemId: string): Promise<void> {
  await apiClient.delete(`/events/admin/${eventId}/timeline-items/${itemId}`)
}

// ── Nested gallery-images ────────────────────────────────────────────────

export async function appendGalleryImage(
  eventId: string,
  payload: GalleryImageInput
): Promise<EventResponse['gallery_images'][number]> {
  const res = await apiClient.post<EventResponse['gallery_images'][number]>(
    `/events/admin/${eventId}/gallery-images`,
    payload
  )
  return res.data
}

export async function updateGalleryImage(
  eventId: string,
  imageId: string,
  payload: Partial<GalleryImageInput>
): Promise<EventResponse['gallery_images'][number]> {
  const res = await apiClient.patch<EventResponse['gallery_images'][number]>(
    `/events/admin/${eventId}/gallery-images/${imageId}`,
    payload
  )
  return res.data
}

export async function deleteGalleryImage(eventId: string, imageId: string): Promise<void> {
  await apiClient.delete(`/events/admin/${eventId}/gallery-images/${imageId}`)
}

// ── Nested companies ─────────────────────────────────────────────────────

export async function appendCompany(
  eventId: string,
  payload: CompanyInput
): Promise<EventResponse['companies'][number]> {
  const res = await apiClient.post<EventResponse['companies'][number]>(
    `/events/admin/${eventId}/companies`,
    payload
  )
  return res.data
}

export async function updateCompany(
  eventId: string,
  companyId: string,
  payload: Partial<CompanyInput>
): Promise<EventResponse['companies'][number]> {
  const res = await apiClient.patch<EventResponse['companies'][number]>(
    `/events/admin/${eventId}/companies/${companyId}`,
    payload
  )
  return res.data
}

export async function deleteCompany(eventId: string, companyId: string): Promise<void> {
  await apiClient.delete(`/events/admin/${eventId}/companies/${companyId}`)
}

// ── Nested testimonials ──────────────────────────────────────────────────

export async function appendTestimonial(
  eventId: string,
  payload: TestimonialInput
): Promise<EventResponse['testimonials'][number]> {
  const res = await apiClient.post<EventResponse['testimonials'][number]>(
    `/events/admin/${eventId}/testimonials`,
    payload
  )
  return res.data
}

export async function updateTestimonial(
  eventId: string,
  testimonialId: string,
  payload: Partial<TestimonialInput>
): Promise<EventResponse['testimonials'][number]> {
  const res = await apiClient.patch<EventResponse['testimonials'][number]>(
    `/events/admin/${eventId}/testimonials/${testimonialId}`,
    payload
  )
  return res.data
}

export async function deleteTestimonial(eventId: string, testimonialId: string): Promise<void> {
  await apiClient.delete(`/events/admin/${eventId}/testimonials/${testimonialId}`)
}

// ── Per-event bookings inbox ─────────────────────────────────────────────

export async function getAdminEventBookings(
  eventId: string,
  params: { page?: number; pageSize?: number } = {}
): Promise<PaginatedResponse<EventBookingResponse>> {
  const res = await apiClient.get<PaginatedResponse<EventBookingResponse>>(
    `/events/admin/${eventId}/bookings`,
    {
      params: {
        page: params.page ?? 1,
        page_size: params.pageSize ?? 50,
      },
    }
  )
  return res.data
}
