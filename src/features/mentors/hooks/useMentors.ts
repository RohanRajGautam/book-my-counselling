import { FilterState } from '@/features/filters/types/filter.types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getMentors } from '../api/mentors.api'
import { Mentor } from '../types/mentors.types'
import { PaginatedResponse } from '@/lib/api/api.types'

export function useMentors(filters: FilterState, page: number) {
  const normalizedFilters = {
    jobTitle: filters.jobTitle?.trim() ?? '',
    industry: filters.industry,
    priceRange: filters.priceRange ?? null,
    availableThisWeek: Boolean(filters.availableThisWeek),
    instantBooking: Boolean(filters.instantBooking),
    eveningsWeekends: Boolean(filters.eveningsWeekends),
    sortBy: filters.sortBy,
  }

  const queryFilters: FilterState = {
    ...filters,
    jobTitle: normalizedFilters.jobTitle,
  }

  return useQuery<PaginatedResponse<Mentor>>({
    queryKey: ['mentors', normalizedFilters, page],
    queryFn: () => getMentors(queryFilters, page),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  })
}
