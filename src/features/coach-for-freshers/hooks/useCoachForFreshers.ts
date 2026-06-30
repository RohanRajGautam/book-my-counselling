import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { Mentor } from '@/features/mentors/types/mentors.types'
import { PaginatedResponse } from '@/lib/api/api.types'

import { getCoachForFreshers } from '../api/coach-for-freshers.api'
import type { CoachForFreshersVariety } from '../types/coach-for-freshers.types'
import type { CoachForFreshersFilters } from '../types/filters.types'

export function useCoachForFreshers(
  variety: CoachForFreshersVariety,
  filters: CoachForFreshersFilters,
  page: number
) {
  return useQuery<PaginatedResponse<Mentor>>({
    queryKey: ['coach-for-freshers', variety.slug, filters, page],
    queryFn: () => getCoachForFreshers(variety, filters, page),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  })
}
