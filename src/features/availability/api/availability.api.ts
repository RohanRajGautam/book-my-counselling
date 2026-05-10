import { PaginatedResponse } from '@/lib/api/api.types'
import apiClient from '@/lib/api/api-client'
import { AvailabilitySlotResponse } from '../types/availability.types'

// Fetches upcoming available slots for a mentor profile.
export async function getMentorAvailability(mentorId: string): Promise<AvailabilitySlotResponse[]> {
  const response = await apiClient.get<PaginatedResponse<AvailabilitySlotResponse>>(
    `/availability/mentor/${mentorId}`,
    {
      params: {
        only_available: true,
        page_size: 20,
      },
    }
  )

  return response.data.items || []
}
