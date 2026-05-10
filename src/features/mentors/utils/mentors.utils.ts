import { FilterState } from '@/features/filters/types/filter.types'
import { Mentor, MentorListResponse } from '../types/mentors.types'

export function mapSort(filters: FilterState): {
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

export function normalizeSearchMentor(mentor: Mentor): Mentor {
  return {
    ...mentor,
    hourly_rate: Number(mentor.hourly_rate),
    tags: mentor.tags ?? [],
    industries: mentor.industries ?? [],
  }
}

export function normalizeListMentor(mentor: MentorListResponse): Mentor {
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

export function shouldUseSearchEndpoint(filters: FilterState) {
  return Boolean(filters.availableThisWeek || filters.eveningsWeekends)
}
