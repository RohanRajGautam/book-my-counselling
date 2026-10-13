import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { Mentor } from '@/features/mentors/types/mentors.types'
import { PaginatedResponse } from '@/lib/api/api.types'

import { getAllMentors } from '../api/all-mentors.api'
import type { AllMentorsFilters } from '../types/filters.types'

export function useAllMentors(filters: AllMentorsFilters, page: number) {
  return useQuery<PaginatedResponse<Mentor>>({
    queryKey: ['all-mentors', filters, page],
    queryFn: () => getAllMentors(filters, page),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  })
}
