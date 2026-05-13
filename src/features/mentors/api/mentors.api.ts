import { PaginatedResponse } from '@/lib/api/api.types'
import { Mentor, MentorResponse } from '../types/mentors.types'
import { FilterState } from '@/features/filters/types/filter.types'
import apiClient from '@/lib/api/api-client'
import { normalizeSearchMentor, mapSort } from '../utils/mentors.utils'

export const MENTORS_PER_PAGE = 9

export async function getMentors(
  filters: FilterState,
  page = 1
): Promise<PaginatedResponse<Mentor>> {
  const { sort_by, sort_order } = mapSort(filters)
  const response = await apiClient.get<PaginatedResponse<Mentor>>('/search', {
    params: {
      keyword: filters.jobTitle?.trim() || undefined,
      industry: filters.industries.length > 0 ? filters.industries : undefined,
      max_price: filters.priceRange,
      available_this_week: filters.availableThisWeek || undefined,
      instant_booking: filters.instantBooking || undefined,
      evenings_weekends: filters.eveningsWeekends || undefined,
      is_academic_counselor: filters.counselingType === 'academic' ? true : undefined,
      is_professional_counselor: filters.counselingType === 'professional' ? true : undefined,
      sort_by,
      sort_order,
      page,
      page_size: MENTORS_PER_PAGE,
    },
  })

  return {
    ...response.data,
    items: response.data.items.map(normalizeSearchMentor),
  }
}

export async function getMentorById(mentorId: string): Promise<MentorResponse> {
  const response = await apiClient.get<MentorResponse>(`/mentors/${mentorId}`)

  return response.data
}
