import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  FreshersCoachFilters,
  getFreshersCoaches,
} from '@/features/coach-services/api/freshers-coaches.api'

export function useFreshersCoaches(filters: FreshersCoachFilters) {
  return useQuery({
    queryKey: ['coach-services', 'freshers', filters],
    queryFn: () => getFreshersCoaches(filters),
    placeholderData: keepPreviousData,
  })
}
