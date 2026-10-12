import { PaginatedResponse } from '@/lib/api/api.types'
import apiClient from '@/lib/api/api-client'
import { MessageResponse } from '@/features/auth/types/auth.types'
import type {
  AvailabilitySlotResponse,
  BookableUnit,
  BulkSlotCreatePayload,
  BulkSlotCreateResponse,
  SingleSlotCreatePayload,
} from '../types/availability.types'

// Fetches upcoming available (unbooked) slots for a mentor profile — public.
// Legacy endpoint kept for the mentor-only settings view that wants the raw
// slot rows. The mentee booking flow uses `getMentorBookableUnits` instead.
export async function getMentorAvailability(
  mentorId: string,
  pageSize = 100
): Promise<AvailabilitySlotResponse[]> {
  const response = await apiClient.get<PaginatedResponse<AvailabilitySlotResponse>>(
    `/availability/mentor/${mentorId}`,
    { params: { only_available: true, page_size: pageSize } }
  )
  return response.data.items || []
}

// Fetches discrete, server-validated bookable units for a mentor + package.
// Each unit's `start_time`/`end_time` are bounded by `package.duration_minutes`
// and a unit is marked `is_booked` if any confirmed/completed booking on the
// mentor overlaps its window. The id (`<slot_id>:<start_iso>`) is deterministic.
export async function getMentorBookableUnits(
  mentorId: string,
  packageId: string,
  pageSize = 100
): Promise<BookableUnit[]> {
  const response = await apiClient.get<PaginatedResponse<BookableUnit>>(
    `/availability/mentor/${mentorId}/bookable-units`,
    { params: { package_id: packageId, only_available: true, page_size: pageSize } }
  )
  return response.data.items || []
}

// Fetches ALL future slots for the current authenticated mentor (including booked).
export async function getMyAvailabilitySlots(): Promise<AvailabilitySlotResponse[]> {
  const response = await apiClient.get<PaginatedResponse<AvailabilitySlotResponse>>(
    '/availability/me',
    { params: { only_available: false, page_size: 200 } }
  )
  return response.data.items || []
}

// Creates multiple slots in one request. Returns both the created slots and
// the list of conflicts (past slots or overlapping slots) so the mentor UI
// can surface what was dropped rather than silently skipping.
export async function createSlotsBulk(
  payload: BulkSlotCreatePayload
): Promise<BulkSlotCreateResponse> {
  const response = await apiClient.post<BulkSlotCreateResponse>('/availability/bulk', payload)
  return response.data
}

// Deletes a single slot.
export async function deleteSlot(slotId: string): Promise<void> {
  await apiClient.delete(`/availability/${slotId}`)
}

// Deletes multiple slots at once.
export async function deleteSlotsBulk(slotIds: string[]): Promise<void> {
  await apiClient.delete('/availability/bulk', { data: slotIds })
}

// ── Admin: manage any mentor's availability ─────────────────────────────
//
// Mirrors the mentor-side endpoints but takes a `mentor_id` (MentorProfile.id)
// from the URL instead of deriving it from the auth token. The admin's own
// user id is irrelevant — these endpoints can target any mentor.
//
// Response shapes and validation rules are identical to the mentor path
// (see `mentor-management/availability.md`):
// - single create raises 400 on past/overlap (programmer error)
// - bulk create silently reports past/overlap rows in `conflicts`
// - single delete raises 400 if the slot is booked
// - bulk delete silently skips booked and cross-tenant ids

export interface AdminAvailabilityListParams {
  from_time?: string
  only_available?: boolean
  page?: number
  page_size?: number
}

// `GET /admin/mentors/{mentor_id}/availability` — paginated slot list for a
// mentor chosen by the admin.
export async function adminListMentorAvailability(
  mentorId: string,
  params: AdminAvailabilityListParams = {}
): Promise<PaginatedResponse<AvailabilitySlotResponse>> {
  const response = await apiClient.get<PaginatedResponse<AvailabilitySlotResponse>>(
    `/admin/mentors/${mentorId}/availability`,
    {
      params: {
        from_time: params.from_time,
        only_available: params.only_available ?? true,
        page: params.page ?? 1,
        page_size: params.page_size ?? 100,
      },
    }
  )
  return response.data
}

// `POST /admin/mentors/{mentor_id}/availability` — single create. Raises 400
// if `start_time` is in the past or overlaps an existing slot.
export async function adminCreateSlot(
  mentorId: string,
  payload: SingleSlotCreatePayload
): Promise<AvailabilitySlotResponse> {
  const response = await apiClient.post<AvailabilitySlotResponse>(
    `/admin/mentors/${mentorId}/availability`,
    payload
  )
  return response.data
}

// `POST /admin/mentors/{mentor_id}/availability/bulk` — bulk create. Server
// reports past / overlap rows in `conflicts` rather than aborting the call.
export async function adminCreateSlotsBulk(
  mentorId: string,
  payload: BulkSlotCreatePayload
): Promise<BulkSlotCreateResponse> {
  const response = await apiClient.post<BulkSlotCreateResponse>(
    `/admin/mentors/${mentorId}/availability/bulk`,
    payload
  )
  return response.data
}

// `DELETE /admin/mentors/{mentor_id}/availability/{slot_id}` — raises 400 if
// the slot is booked, 404 if the slot belongs to a different mentor.
export async function adminDeleteSlot(mentorId: string, slotId: string): Promise<MessageResponse> {
  const response = await apiClient.delete<MessageResponse>(
    `/admin/mentors/${mentorId}/availability/${slotId}`
  )
  return response.data
}

// `DELETE /admin/mentors/{mentor_id}/availability/bulk?slot_ids=...` —
// silently skips booked and cross-tenant ids.
export async function adminDeleteSlotsBulk(
  mentorId: string,
  slotIds: string[]
): Promise<MessageResponse> {
  const response = await apiClient.delete<MessageResponse>(
    `/admin/mentors/${mentorId}/availability/bulk`,
    { params: { slot_ids: slotIds }, paramsSerializer: { indexes: null } }
  )
  return response.data
}
