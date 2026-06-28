import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'
import { Mentor } from '@/features/mentors/types/mentors.types'
import { normalizeSearchMentor } from '@/features/mentors/utils/mentors.utils'

import type {
  AcademicCounsellorCategory,
  AcademicCounsellorSubcategory,
} from '../types/academic-counsellor.types'
import type { AcademicFilters, SortBy } from '../types/filters.types'

export const ACADEMIC_COUNSELLORS_PER_PAGE = 12

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

export async function getAcademicCounsellors(
  filters: AcademicFilters,
  page = 1
): Promise<PaginatedResponse<Mentor>> {
  const requestedPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1

  const response = await apiClient.get<PaginatedResponse<Mentor>>('/search', {
    params: {
      keyword: filters.jobTitle.trim() || undefined,
      is_academic_counselor: true,
      available_this_week: filters.availableThisWeek || undefined,
      academic_categories:
        filters.academicCategory.length > 0 ? filters.academicCategory : undefined,
      academic_subcategories:
        filters.academicSubcategory.length > 0 ? filters.academicSubcategory : undefined,
      ...toBackendSort(filters.sortBy),
      page: requestedPage,
      page_size: ACADEMIC_COUNSELLORS_PER_PAGE,
    },
  })

  return {
    ...response.data,
    items: response.data.items.map(normalizeSearchMentor),
  }
}

export async function getAcademicCounsellorCategories(): Promise<AcademicCounsellorCategory[]> {
  const response = await apiClient.get<AcademicCounsellorCategory[]>('/catalog/categories', {
    params: { counselor_type: 'academic' },
  })

  return response.data
}

export async function getAcademicCounsellorSubcategories(
  categoryId: string
): Promise<AcademicCounsellorSubcategory[]> {
  const response = await apiClient.get<AcademicCounsellorSubcategory[]>(
    `/catalog/categories/${categoryId}/subcategories`
  )

  return response.data
}
