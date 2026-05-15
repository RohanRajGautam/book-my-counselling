import { PaginatedResponse } from '@/lib/api/api.types'
import apiClient from '@/lib/api/api-client'
import type {
  AvailabilitySlotResponse,
  BulkSlotCreatePayload,
} from '../types/availability.types'

// Fetches upcoming available (unbooked) slots for a mentor profile — public.
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

// Fetches ALL future slots for the current authenticated mentor (including booked).
export async function getMyAvailabilitySlots(): Promise<AvailabilitySlotResponse[]> {
  const response = await apiClient.get<PaginatedResponse<AvailabilitySlotResponse>>(
    '/availability/me',
    { params: { only_available: false, page_size: 200 } },
  )
  return response.data.items || []
}

// Creates multiple slots in one request.
export async function createSlotsBulk(
  payload: BulkSlotCreatePayload,
): Promise<AvailabilitySlotResponse[]> {
  const response = await apiClient.post<AvailabilitySlotResponse[]>(
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
