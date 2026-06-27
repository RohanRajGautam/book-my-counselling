import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { FilterState } from '@/features/filters/types/filter.types'
import { Mentor } from '@/features/mentors/types/mentors.types'
import { PaginatedResponse } from '@/lib/api/api.types'

import { getAcademicCounsellors } from '../api/academic-counsellor.api'

export function useAcademicCounsellors(filters: FilterState, page: number) {
  return useQuery<PaginatedResponse<Mentor>>({
    queryKey: ['academic-counsellors', filters, page],
    queryFn: () => getAcademicCounsellors(filters, page),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  })
}