import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { Mentor } from '@/features/mentors/types/mentors.types'
import { PaginatedResponse } from '@/lib/api/api.types'

import { getAcademicCounsellors } from '../api/academic-counsellor.api'
import type { AcademicFilters } from '../types/filters.types'

export function useAcademicCounsellors(filters: AcademicFilters, page: number) {
  return useQuery<PaginatedResponse<Mentor>>({
    queryKey: ['academic-counsellors', filters, page],
    queryFn: () => getAcademicCounsellors(filters, page),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  })
}
