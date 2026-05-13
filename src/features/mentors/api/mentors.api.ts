import { PaginatedResponse } from '@/lib/api/api.types'
import { Mentor, MentorResponse } from '../types/mentors.types'
import { FilterState } from '@/features/filters/types/filter.types'
import apiClient from '@/lib/api/api-client'
import { normalizeSearchMentor, mapSort } from '../utils/mentors.utils'

export const MENTORS_PER_PAGE = 9
const MULTI_FILTER_PAGE_SIZE = 100

type SearchParams = {
  keyword?: string
  industry?: string[]
  max_price?: number
  available_this_week?: boolean
  instant_booking?: boolean
  evenings_weekends?: boolean
  is_academic_counselor?: boolean
  is_professional_counselor?: boolean
  academic_category?: string
  academic_subcategory?: string
  professional_category?: string
  professional_subcategory?: string
  sort_by: 'rating' | 'reviews' | 'price' | 'created_at'
  sort_order: 'asc' | 'desc'
  page: number
  page_size: number
}

function getBaseSearchParams(filters: FilterState, page: number, pageSize: number): SearchParams {
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
    sort_by,
    sort_order,
    page,
    page_size: pageSize,
  }
}

function getCategorySearchVariants(filters: FilterState): Partial<SearchParams>[] {
  if (filters.counselingType === 'academic') {
    const narrowedCategories = new Set(Object.values(filters.academicSubcategoryParents))

    return [
      ...filters.academicCategory
        .filter((category) => !narrowedCategories.has(category))
        .map((category) => ({ academic_category: category })),
      ...filters.academicSubcategory.map((subcategory) => {
        const parentCategory = filters.academicSubcategoryParents[subcategory]

        return {
          academic_category: parentCategory,
          academic_subcategory: subcategory,
        }
      }),
    ]
  }

  const narrowedCategories = new Set(Object.values(filters.professionalSubcategoryParents))

  return [
    ...filters.professionalCategory
      .filter((category) => !narrowedCategories.has(category))
      .map((category) => ({ professional_category: category })),
    ...filters.professionalSubcategory.map((subcategory) => {
      const parentCategory = filters.professionalSubcategoryParents[subcategory]

      return {
        professional_category: parentCategory,
        professional_subcategory: subcategory,
      }
    }),
  ]
}

function getPaginatedItems<T>(items: T[], page: number, pageSize: number) {
  const offset = (page - 1) * pageSize

  return items.slice(offset, offset + pageSize)
}

function sortMentors(mentors: Mentor[], filters: FilterState) {
  return [...mentors].sort((firstMentor, secondMentor) => {
    if (filters.sortBy === 'price-low') {
      return Number(firstMentor.hourly_rate) - Number(secondMentor.hourly_rate)
    }

    if (filters.sortBy === 'price-high') {
      return Number(secondMentor.hourly_rate) - Number(firstMentor.hourly_rate)
    }

    if (filters.sortBy === 'reviews') {
      return secondMentor.total_reviews - firstMentor.total_reviews
    }

    if (filters.sortBy === 'newest') {
      return (
        new Date(secondMentor.created_at ?? 0).getTime() -
        new Date(firstMentor.created_at ?? 0).getTime()
      )
    }

    return secondMentor.average_rating - firstMentor.average_rating
  })
}

async function getSearchResults(params: SearchParams): Promise<Mentor[]> {
  const firstResponse = await apiClient.get<PaginatedResponse<Mentor>>('/search', {
    params,
  })

  if (firstResponse.data.total_pages <= 1) {
    return firstResponse.data.items
  }

  const remainingResponses = await Promise.all(
    Array.from({ length: firstResponse.data.total_pages - 1 }, (_, index) =>
      apiClient.get<PaginatedResponse<Mentor>>('/search', {
        params: {
          ...params,
          page: index + 2,
        },
      })
    )
  )

  return [
    ...firstResponse.data.items,
    ...remainingResponses.flatMap((response) => response.data.items),
  ]
}

export async function getMentors(
  filters: FilterState,
  page = 1
): Promise<PaginatedResponse<Mentor>> {
  const categorySearchVariants = getCategorySearchVariants(filters)

  if (categorySearchVariants.length > 1) {
    const results = await Promise.all(
      categorySearchVariants.map((variant) =>
        getSearchResults({
          ...getBaseSearchParams(filters, 1, MULTI_FILTER_PAGE_SIZE),
          ...variant,
        })
      )
    )

    const mentorsById = new Map<string, Mentor>()

    results.forEach((mentors) => {
      mentors.forEach((mentor) => {
        mentorsById.set(mentor.id, normalizeSearchMentor(mentor))
      })
    })

    const items = sortMentors(Array.from(mentorsById.values()), filters)
    const total = items.length
    const totalPages = Math.max(1, Math.ceil(total / MENTORS_PER_PAGE))

    return {
      items: getPaginatedItems(items, page, MENTORS_PER_PAGE),
      total,
      page,
      page_size: MENTORS_PER_PAGE,
      total_pages: totalPages,
      has_next: page < totalPages,
      has_prev: page > 1,
    }
  }

  const categoryParams = categorySearchVariants[0] ?? {}
  const response = await apiClient.get<PaginatedResponse<Mentor>>('/search', {
    params: {
      ...getBaseSearchParams(filters, page, MENTORS_PER_PAGE),
      ...categoryParams,
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
