import { PaginatedResponse } from '@/lib/api/api.types'
import { Mentor, MentorListResponse, MentorResponse } from '../types/mentors.types'
import { FilterState } from '@/features/filters/types/filter.types'
import apiClient from '@/lib/api/api-client'
import {
  shouldUseSearchEndpoint,
  normalizeSearchMentor,
  mapSort,
  normalizeListMentor,
} from '../utils/mentors.utils'

export const MENTORS_PER_PAGE = 6

export async function getMentors(
  filters: FilterState,
  page = 1
): Promise<PaginatedResponse<Mentor>> {
  if (shouldUseSearchEndpoint(filters)) {
    // Uses search when availability filters are applied.
    const response = await apiClient.get<PaginatedResponse<Mentor>>('/search', {
      params: {
        keyword: filters.jobTitle?.trim() || undefined,
        title: filters.jobTitle?.trim() || undefined,
        industry: filters.industry === 'All Industries' ? undefined : filters.industry,
        max_price: filters.priceRange,
        available_this_week: filters.availableThisWeek || undefined,
        instant_booking: filters.instantBooking || undefined,
        evenings_weekends: filters.eveningsWeekends || undefined,
        page,
        page_size: MENTORS_PER_PAGE,
      },
    })

    return {
      ...response.data,
      items: response.data.items.map(normalizeSearchMentor),
    }
  }

  const { sort_by, sort_order } = mapSort(filters)
  const response = await apiClient.get<PaginatedResponse<MentorListResponse>>('/mentors', {
    params: {
      keyword: filters.jobTitle?.trim() || undefined,
      industry: filters.industry === 'All Industries' ? undefined : filters.industry,
      max_price: filters.priceRange,
      is_instant_booking: filters.instantBooking || undefined,
      sort_by,
      sort_order,
      page,
      page_size: MENTORS_PER_PAGE,
    },
  })

  return {
    ...response.data,
    items: response.data.items.map(normalizeListMentor),
  }
}

export async function getMentorById(mentorId: string): Promise<MentorResponse> {
  const response = await apiClient.get<MentorResponse>(`/mentors/${mentorId}`)

  return response.data
}
