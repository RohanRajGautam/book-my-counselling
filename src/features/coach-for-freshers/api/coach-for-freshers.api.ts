import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'
import { Mentor } from '@/features/mentors/types/mentors.types'
import { normalizeSearchMentor } from '@/features/mentors/utils/mentors.utils'

import type { CoachForFreshersVariety } from '../types/coach-for-freshers.types'
import type { SortBy } from '../types/filters.types'

export const COACH_FOR_FRESHERS_PER_PAGE = 12

function toBackendSort(sortBy: SortBy) {
  switch (sortBy) {
    case 'reviews':
      return { sort_by: 'reviews', sort_order: 'desc' as const }
    case 'price-low':
      return { sort_by: 'price', sort_order: 'asc' as const }
    case 'price-high':
      return { sort_by: 'price', sort_order: 'desc' as const }
    case 'newest':
      return { sort_by: 'created_at', sort_order: 'desc' as const }
    default:
      return { sort_by: 'rating', sort_order: 'desc' as const }
  }
}

export async function getCoachForFreshers(
  variety: CoachForFreshersVariety,
  filters: {
    jobTitle: string
    category: string | null
    availableThisWeek: boolean
    sortBy: SortBy
  },
  page = 1
): Promise<PaginatedResponse<Mentor>> {
  const requestedPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1

  const response = await apiClient.get<PaginatedResponse<Mentor>>('/search', {
    params: {
      tags: variety.tag,
      keyword: filters.jobTitle.trim() || undefined,
      professional_categories: filters.category || undefined,
      available_this_week: filters.availableThisWeek,
      instant_booking: false,
      evenings_weekends: false,
      ...toBackendSort(filters.sortBy),
      page: requestedPage,
      page_size: COACH_FOR_FRESHERS_PER_PAGE,
    },
  })

  return {
    ...response.data,
    items: response.data.items.map(normalizeSearchMentor),
  }
}
