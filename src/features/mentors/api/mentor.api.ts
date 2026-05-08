import api from '@/lib/api/axios'

import { PaginatedResponse } from '@/lib/api/api.types'
import {
  Mentor,
  Industry,
  MentorListResponse,
  MentorResponse,
  ServicePackageResponse,
  AvailabilitySlotResponse,
  ReviewResponse,
} from '../types/mentor.types'
import { FilterState } from '@/features/filters/types/filter.types'

export const MENTORS_PER_PAGE = 6

function mapSort(filters: FilterState): {
  sort_by: 'rating' | 'reviews' | 'price'
  sort_order: 'asc' | 'desc'
} {
  if (filters.sortBy === 'reviews') {
    return { sort_by: 'reviews', sort_order: 'desc' }
  }

  if (filters.sortBy === 'price-low') {
    return { sort_by: 'price', sort_order: 'asc' }
  }

  if (filters.sortBy === 'price-high') {
    return { sort_by: 'price', sort_order: 'desc' }
  }

  return { sort_by: 'rating', sort_order: 'desc' }
}

function normalizeSearchMentor(mentor: Mentor): Mentor {
  return {
    ...mentor,
    hourly_rate: Number(mentor.hourly_rate),
    tags: mentor.tags ?? [],
    industries: mentor.industries ?? [],
  }
}

function normalizeListMentor(mentor: MentorListResponse): Mentor {
  return {
    id: mentor.id,
    user_id: mentor.user.id,
    full_name: mentor.user.full_name,
    title: mentor.title,
    company: mentor.company,
    industries: mentor.industries ?? [],
    hourly_rate: Number(mentor.hourly_rate),
    average_rating: mentor.average_rating,
    total_reviews: mentor.total_reviews,
    total_sessions: mentor.total_sessions,
    is_accepting_bookings: mentor.is_accepting_bookings,
    is_verified: mentor.is_verified,
    is_featured: false,
    booking_mode: mentor.booking_mode,
    requires_24h_approval: mentor.booking_mode === 'approval_required',
    tags: mentor.tags?.map((tag) => tag.name) ?? [],
    tag_ids: mentor.tags?.map((tag) => tag.id) ?? [],
    avatar_url: mentor.user.avatar_url,
    created_at: null,
  }
}

function shouldUseSearchEndpoint(filters: FilterState) {
  return Boolean(filters.availableThisWeek || filters.eveningsWeekends)
}

export async function getMentors(filters: FilterState, page = 1) {
  if (shouldUseSearchEndpoint(filters)) {
    const response = await api.get<PaginatedResponse<Mentor>>('/search', {
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
  const response = await api.get<PaginatedResponse<MentorListResponse>>('/mentors', {
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

export async function getIndustries() {
  const response = await api.get<Industry[]>('/catalog/industries')

  return response.data
}

export async function getMentorById(mentorId: string): Promise<MentorResponse> {
  const response = await api.get<MentorResponse>(`/mentors/${mentorId}`)

  return response.data
}

export async function getMentorPackages(mentorId: string): Promise<ServicePackageResponse[]> {
  const response = await api.get<ServicePackageResponse[]>(`/service-packages/mentor/${mentorId}`, {
    params: {
      only_active: true,
    },
  })

  return response.data
}

export async function getMentorAvailability(mentorId: string): Promise<AvailabilitySlotResponse[]> {
  const response = await api.get<PaginatedResponse<AvailabilitySlotResponse>>(
    `/availability/mentor/${mentorId}`,
    {
      params: {
        only_available: true,
        page_size: 20,
      },
    }
  )

  return response.data.items || []
}

// export async function getMentorReviews(mentorId: string): Promise<ReviewResponse[]> {
//   const response = await api.get<PaginatedResponse<ReviewResponse>>(`/reviews/mentor/${mentorId}`, {
//     params: {
//       page_size: 10,
//     },
//   })

//   return response.data.items || []
// }

export async function getMentorReviews(
  mentorId: string,
  page: number = 1,
  page_size: number = 1
): Promise<PaginatedResponse<ReviewResponse>> {
  const response = await api.get<PaginatedResponse<ReviewResponse>>(`/reviews/mentor/${mentorId}`, {
    params: {
      page,
      page_size,
    },
  })

  return response.data
}
