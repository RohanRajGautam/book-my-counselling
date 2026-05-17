import { PaginatedResponse } from '@/lib/api/api.types'
import { Mentor, MentorResponse } from '../types/mentors.types'
import { FilterState } from '@/features/filters/types/filter.types'
import apiClient from '@/lib/api/api-client'
import { normalizeSearchMentor, mapSort } from '../utils/mentors.utils'

export const MENTORS_PER_PAGE = 12

type SearchParams = {
  keyword?: string
  industry?: string[]
  max_price?: number
  available_this_week?: boolean
  instant_booking?: boolean
  evenings_weekends?: boolean
  is_academic_counselor?: boolean
  is_professional_counselor?: boolean
  academic_categories?: string[]
  academic_subcategories?: string[]
  professional_categories?: string[]
  professional_subcategories?: string[]
  sort_by: 'rating' | 'reviews' | 'price' | 'created_at'
  sort_order: 'asc' | 'desc'
  page: number
  page_size: number
}

function getSelectedValues(values: string[]) {
  return values.length > 0 ? values : undefined
}

function getCategorySearchParams(filters: FilterState): Partial<SearchParams> {
  if (filters.counselingType === 'academic') {
    return {
      academic_categories: getSelectedValues(filters.academicCategory),
      academic_subcategories: getSelectedValues(filters.academicSubcategory),
    }
  }

  return {
    professional_categories: getSelectedValues(filters.professionalCategory),
    professional_subcategories: getSelectedValues(filters.professionalSubcategory),
  }
}

function getSearchParams(filters: FilterState, page: number, pageSize: number): SearchParams {
  const { sort_by, sort_order } = mapSort(filters)

  return {
    keyword: filters.jobTitle?.trim() || undefined,
    industry: filters.industries.length > 0 ? filters.industries : undefined,
    max_price: filters.priceRange,
    available_this_week: filters.availableThisWeek || undefined,
    instant_booking: filters.instantBooking || undefined,
    evenings_weekends: filters.eveningsWeekends || undefined,
    is_academic_counselor: filters.counselingType === 'academic' ? true : undefined,
    is_professional_counselor: filters.counselingType === 'professional' ? true : undefined,
    ...getCategorySearchParams(filters),
    sort_by,
    sort_order,
    page,
    page_size: pageSize,
  }
}

export async function getMentors(
  filters: FilterState,
  page = 1
): Promise<PaginatedResponse<Mentor>> {
  const response = await apiClient.get<PaginatedResponse<Mentor>>('/search', {
    params: getSearchParams(filters, page, MENTORS_PER_PAGE),
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
