import { PaginatedResponse } from '@/lib/api/api.types'
import { Mentor, MentorResponse } from '../types/mentors.types'
import { FilterState } from '@/features/filters/types/filter.types'
import apiClient from '@/lib/api/api-client'
import {
  getMentorNameSearchFromSlug,
  getMentorShortIdFromSlug,
  isMentorId,
  normalizeSearchMentor,
  mapSort,
} from '../utils/mentors.utils'

export const MENTORS_PER_PAGE = 12
const SEARCH_FETCH_PAGE_SIZE = 100

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

function getCounselorTypeSearchParams(
  filters: FilterState
): Pick<SearchParams, 'is_academic_counselor' | 'is_professional_counselor'> {
  return filters.counselingType === 'academic'
    ? { is_academic_counselor: true }
    : { is_professional_counselor: true }
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
    ...getCounselorTypeSearchParams(filters),
    ...getCategorySearchParams(filters),
    sort_by,
    sort_order,
    page,
    page_size: pageSize,
  }
}

function mentorMatchesCounselingType(mentor: Mentor, filters: FilterState) {
  return filters.counselingType === 'academic'
    ? mentor.is_academic_counselor
    : mentor.is_professional_counselor
}

async function getSearchPage(filters: FilterState, page: number, pageSize: number) {
  const response = await apiClient.get<PaginatedResponse<Mentor>>('/search', {
    params: getSearchParams(filters, page, pageSize),
  })

  return response.data
}

export async function getMentors(
  filters: FilterState,
  page = 1
): Promise<PaginatedResponse<Mentor>> {
  const requestedPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
  const matchingMentors: Mentor[] = []
  let backendPage = 1
  let backendTotalPages = 1

  do {
    const data = await getSearchPage(filters, backendPage, SEARCH_FETCH_PAGE_SIZE)

    backendTotalPages = data.total_pages
    matchingMentors.push(
      ...data.items.filter((mentor) => mentorMatchesCounselingType(mentor, filters))
    )
    backendPage += 1
  } while (backendPage <= backendTotalPages)

  const total = matchingMentors.length
  const totalPages = Math.ceil(total / MENTORS_PER_PAGE)
  const pageStart = (requestedPage - 1) * MENTORS_PER_PAGE
  const pageItems = matchingMentors.slice(pageStart, pageStart + MENTORS_PER_PAGE)

  return {
    items: pageItems.map(normalizeSearchMentor),
    total,
    page: requestedPage,
    page_size: MENTORS_PER_PAGE,
    total_pages: totalPages,
    has_next: requestedPage < totalPages,
    has_prev: requestedPage > 1 && totalPages > 0,
  }
}

export async function getMentorById(mentorId: string): Promise<MentorResponse> {
  const response = await apiClient.get<MentorResponse>(`/mentors/${mentorId}`)

  return response.data
}

export type MentorLookupOptions = {
  isAcademicCounselor?: boolean
  isProfessionalCounselor?: boolean
}

export async function resolveMentorId(
  slugOrId: string,
  options?: MentorLookupOptions
): Promise<string> {
  if (isMentorId(slugOrId)) return slugOrId

  const shortId = getMentorShortIdFromSlug(slugOrId)
  const keyword = getMentorNameSearchFromSlug(slugOrId)

  if (!shortId || shortId.length < 6) {
    throw new Error('Invalid mentor profile link')
  }

  const response = await apiClient.get<PaginatedResponse<Mentor>>('/search', {
    params: {
      keyword: keyword || undefined,
      is_academic_counselor: options?.isAcademicCounselor || undefined,
      is_professional_counselor: options?.isProfessionalCounselor || undefined,
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
    throw new Error('Mentor not found')
  }

  return matchedMentor.id
}

export async function getMentorBySlugOrId(
  slugOrId: string,
  options?: MentorLookupOptions
): Promise<MentorResponse> {
  const mentorId = await resolveMentorId(slugOrId, options)

  return getMentorById(mentorId)
}
