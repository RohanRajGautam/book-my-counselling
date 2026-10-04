import { PaginatedResponse } from '@/lib/api/api.types'
import apiClient from '@/lib/api/api-client'
import type {
  AvailabilitySlotResponse,
  BookableUnit,
  BulkSlotCreatePayload,
  BulkSlotCreateResponse,
} from '../types/availability.types'

// Fetches upcoming available (unbooked) slots for a mentor profile — public.
// Legacy endpoint kept for the mentor-only settings view that wants the raw
// slot rows. The mentee booking flow uses `getMentorBookableUnits` instead.
export async function getMentorAvailability(
  mentorId: string,
  pageSize = 100,
): Promise<AvailabilitySlotResponse[]> {
  const response = await apiClient.get<PaginatedResponse<AvailabilitySlotResponse>>(
    `/availability/mentor/${mentorId}`,
    { params: { only_available: true, page_size: pageSize } },
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
  pageSize = 100,
): Promise<BookableUnit[]> {
  const response = await apiClient.get<PaginatedResponse<BookableUnit>>(
    `/availability/mentor/${mentorId}/bookable-units`,
    { params: { package_id: packageId, only_available: true, page_size: pageSize } },
  )
  return response.data.items || []
}

// Fetches ALL future slots for the current authenticated mentor (including booked).
export async function getMyAvailabilitySlots(): Promise<AvailabilitySlotResponse[]> {
  const response = await apiClient.get<PaginatedResponse<AvailabilitySlotResponse>>(
    '/availability/me',
    { params: { only_available: false, page_size: 200 } },
  )
  return response.data.items || []
}

// Creates multiple slots in one request. Returns both the created slots and
// the list of conflicts (past slots or overlapping slots) so the mentor UI
// can surface what was dropped rather than silently skipping.
export async function createSlotsBulk(
  payload: BulkSlotCreatePayload,
): Promise<BulkSlotCreateResponse> {
  const response = await apiClient.post<BulkSlotCreateResponse>(
    '/availability/bulk',
    payload,
  )
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
