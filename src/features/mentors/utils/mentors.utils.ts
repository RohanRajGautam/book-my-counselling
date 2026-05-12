import { FilterState } from '@/features/filters/types/filter.types'
import { Mentor } from '../types/mentors.types'

export function mapSort(filters: FilterState): {
  sort_by: 'rating' | 'reviews' | 'price' | 'created_at'
  sort_order: 'asc' | 'desc'
} {
  if (filters.sortBy === 'newest') {
    return { sort_by: 'created_at', sort_order: 'desc' }
  }

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
