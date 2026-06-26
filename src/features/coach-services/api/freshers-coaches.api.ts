import { PaginatedResponse } from '@/lib/api/api.types'
import apiClient from '@/lib/api/api-client'
import { Mentor } from '@/features/mentors/types/mentors.types'
import { normalizeSearchMentor } from '@/features/mentors/utils/mentors.utils'

export const FRESHERS_COACHES_PER_PAGE = 20

export type FreshersCoachSort = 'rating' | 'reviews' | 'price' | 'years_of_experience'

export type FreshersCoachFilters = {
  keyword?: string
  category?: string
  serviceTag?: string
  availableThisWeek?: boolean
  sortBy: FreshersCoachSort
  page: number
}

export async function getFreshersCoaches({
  keyword,
  category,
  serviceTag,
  availableThisWeek,
  sortBy,
  page,
}: FreshersCoachFilters): Promise<PaginatedResponse<Mentor>> {
  const response = await apiClient.get<PaginatedResponse<Mentor>>('/search', {
    params: {
      tags: serviceTag || 'coach-for-freshers',
      keyword: keyword?.trim() || undefined,
      professional_categories: category || undefined,
      available_this_week: Boolean(availableThisWeek),
      instant_booking: false,
      evenings_weekends: false,
      sort_by: sortBy,
      sort_order: sortBy === 'price' ? 'asc' : 'desc',
      page,
      page_size: FRESHERS_COACHES_PER_PAGE,
    },
  })

  return {
    ...response.data,
    items: response.data.items.map(normalizeSearchMentor),
  }
}
