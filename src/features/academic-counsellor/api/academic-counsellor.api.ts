import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'
import { FilterState } from '@/features/filters/types/filter.types'
import { Mentor, MentorResponse } from '@/features/mentors/types/mentors.types'
import {
  getMentorNameSearchFromSlug,
  getMentorShortIdFromSlug,
  isMentorId,
  mapSort,
  normalizeSearchMentor,
} from '@/features/mentors/utils/mentors.utils'

import type {
  AcademicCounsellorCategory,
  AcademicCounsellorSubcategory,
} from '../types/academic-counsellor.types'

export const ACADEMIC_COUNSELLORS_PER_PAGE = 12
const SEARCH_FETCH_PAGE_SIZE = 100

type SearchParams = {
  keyword?: string
  industry?: string[]
  max_price?: number
  available_this_week?: boolean
  instant_booking?: boolean
  evenings_weekends?: boolean
  is_academic_counselor: true
  academic_categories?: string[]
  academic_subcategories?: string[]
  sort_by: 'rating' | 'reviews' | 'price' | 'created_at'
  sort_order: 'asc' | 'desc'
  page: number
  page_size: number
}

function getSelectedValues(values: string[]) {
  return values.length > 0 ? values : undefined
}

function buildAcademicSearchParams(
  filters: FilterState,
  page: number,
  pageSize: number
): SearchParams {
  const { sort_by, sort_order } = mapSort(filters)

  return {
    keyword: filters.jobTitle?.trim() || undefined,
    industry: filters.industries.length > 0 ? filters.industries : undefined,
    max_price: filters.priceRange,
    available_this_week: filters.availableThisWeek || undefined,
    instant_booking: filters.instantBooking || undefined,
    evenings_weekends: filters.eveningsWeekends || undefined,
    is_academic_counselor: true,
    academic_categories: getSelectedValues(filters.academicCategory),
    academic_subcategories: getSelectedValues(filters.academicSubcategory),
    sort_by,
    sort_order,
    page,
    page_size: pageSize,
  }
}

async function fetchAcademicSearchPage(filters: FilterState, page: number, pageSize: number) {
  const response = await apiClient.get<PaginatedResponse<Mentor>>('/search', {
    params: buildAcademicSearchParams(filters, page, pageSize),
  })

  return response.data
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

export async function getAcademicCounsellors(
  filters: FilterState,
  page = 1
): Promise<PaginatedResponse<Mentor>> {
  const requestedPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
  const matchingMentors: Mentor[] = []
  let backendPage = 1
  let backendTotalPages = 1

  do {
    const data = await fetchAcademicSearchPage(filters, backendPage, SEARCH_FETCH_PAGE_SIZE)
    backendTotalPages = data.total_pages
    matchingMentors.push(
      ...data.items.filter((mentor) => mentor.is_academic_counselor).map(normalizeSearchMentor)
    )
    backendPage += 1
  } while (backendPage <= backendTotalPages)

  const total = matchingMentors.length
  const totalPages = Math.ceil(total / ACADEMIC_COUNSELLORS_PER_PAGE)
  const pageStart = (requestedPage - 1) * ACADEMIC_COUNSELLORS_PER_PAGE
  const pageItems = matchingMentors.slice(pageStart, pageStart + ACADEMIC_COUNSELLORS_PER_PAGE)

  return {
    items: pageItems,
    total,
    page: requestedPage,
    page_size: ACADEMIC_COUNSELLORS_PER_PAGE,
    total_pages: totalPages,
    has_next: requestedPage < totalPages,
    has_prev: requestedPage > 1 && totalPages > 0,
  }
}

export async function getAcademicCounsellorById(mentorId: string): Promise<MentorResponse> {
  const response = await apiClient.get<MentorResponse>(`/mentors/${mentorId}`)

  return response.data
}

export async function resolveAcademicCounsellorId(slugOrId: string): Promise<string> {
  if (isMentorId(slugOrId)) return slugOrId

  const shortId = getMentorShortIdFromSlug(slugOrId)
  const keyword = getMentorNameSearchFromSlug(slugOrId)

  if (!shortId || shortId.length < 6) {
    throw new Error('Invalid academic counsellor profile link')
  }

  const response = await apiClient.get<PaginatedResponse<Mentor>>('/search', {
    params: {
      keyword: keyword || undefined,
      is_academic_counselor: true,
      sort_by: 'rating',
      sort_order: 'desc',
      page: 1,
      page_size: 100,
    },
  })
  const matchedMentor = response.data.items
    .map(normalizeSearchMentor)
    .find((mentor) => mentor.id.replaceAll('-', '').toLowerCase().startsWith(shortId))

  if (!matchedMentor) {
    throw new Error('Academic counsellor not found')
  }

  return matchedMentor.id
}

export async function getAcademicCounsellorBySlugOrId(slugOrId: string): Promise<MentorResponse> {
  const mentorId = await resolveAcademicCounsellorId(slugOrId)

  return getAcademicCounsellorById(mentorId)
}
