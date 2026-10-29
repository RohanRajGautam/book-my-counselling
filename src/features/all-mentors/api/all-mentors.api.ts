import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'
import { Mentor } from '@/features/mentors/types/mentors.types'
import { normalizeSearchMentor } from '@/features/mentors/utils/mentors.utils'

import { COACH_FOR_FRESHERS_GROUP_TAG } from '@/features/coach-for-freshers/types/coach-for-freshers.types'
import { getAllMentorsScope } from '../lib/vendor-scope'
import type { AllMentorsFilters, SortBy } from '../types/filters.types'

export const ALL_MENTORS_PER_PAGE = 12

function toBackendSort(sortBy: SortBy) {
  switch (sortBy) {
    case 'newest':
      return { sort_by: 'created_at', sort_order: 'desc' as const }
    case 'reviews':
      return { sort_by: 'reviews', sort_order: 'desc' as const }
    case 'price-low':
      return { sort_by: 'price', sort_order: 'asc' as const }
    case 'price-high':
      return { sort_by: 'price', sort_order: 'desc' as const }
    default:
      return { sort_by: 'rating', sort_order: 'desc' as const }
  }
}

export async function getAllMentors(
  filters: AllMentorsFilters,
  page = 1
): Promise<PaginatedResponse<Mentor>> {
  const requestedPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1

  const params: Record<string, unknown> = {
    keyword: filters.jobTitle.trim() || undefined,
    available_this_week: filters.availableThisWeek || undefined,
    ...toBackendSort(filters.sortBy),
    page: requestedPage,
    page_size: ALL_MENTORS_PER_PAGE,
  }

  // Each vendor's effective scope = explicit tab OR a filter click on that
  // list. This lets users click "IT" (or "Bachelors") with no tab selected
  // and still see only the matching vendor's mentors — the sidebar stays in
  // the "both visible" state because `filters.vendor` is unchanged.
  const scope = getAllMentorsScope(filters)

  if (scope === 'academic') {
    params.is_academic_counselor = true
    if (filters.academicCategory.length > 0) params.academic_categories = filters.academicCategory
    if (filters.academicSubcategory.length > 0) {
      params.academic_subcategories = filters.academicSubcategory
    }
  }

  if (scope === 'coach-for-freshers') {
    params.tags = COACH_FOR_FRESHERS_GROUP_TAG
    if (filters.cffCategory) params.professional_categories = filters.cffCategory
  }

  const response = await apiClient.get<PaginatedResponse<Mentor>>('/search', { params })

  return {
    ...response.data,
    items: response.data.items.map(normalizeSearchMentor),
  }
}
