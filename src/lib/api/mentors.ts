import { FilterState } from '@/types/filter.types'
import api from '@/lib/api/axios'
import {
  Industry,
  Mentor,
  AvailabilitySlotResponse,
  MentorResponse,
  ReviewResponse,
  ServicePackageResponse,
} from '@/types/mentors.types'
import { PaginatedResponse } from '@/types/api.types'

export const MENTORS_PER_PAGE = 6

export function sortMentors(mentors: Mentor[], sortBy: FilterState['sortBy']) {
  return [...mentors].sort((a, b) => {
    if (sortBy === 'reviews') {
      return b.total_reviews - a.total_reviews
    }

    if (sortBy === 'price-low') {
      return Number(a.hourly_rate) - Number(b.hourly_rate)
    }

    if (sortBy === 'price-high') {
      return Number(b.hourly_rate) - Number(a.hourly_rate)
    }

    return b.average_rating - a.average_rating
  })
}

export async function getMentors(filters: FilterState, page = 1) {
  const response = await api.get<PaginatedResponse<Mentor>>('/search', {
    params: {
      title: filters.jobTitle || undefined,
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
    items: sortMentors(response.data.items, filters.sortBy),
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
