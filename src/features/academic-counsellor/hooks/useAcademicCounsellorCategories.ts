import { useQuery } from '@tanstack/react-query'

import {
  getAcademicCounsellorCategories,
  getAcademicCounsellorSubcategories,
} from '../api/academic-counsellor.api'

export function useAcademicCounsellorCategories() {
  return useQuery({
    queryKey: ['academic-counsellor-categories'],
    queryFn: getAcademicCounsellorCategories,
    staleTime: 10 * 60 * 1000,
  })
}

export function useAcademicCounsellorSubcategories(categoryId?: string) {
  return useQuery({
    queryKey: ['academic-counsellor-subcategories', categoryId],
    queryFn: () => getAcademicCounsellorSubcategories(categoryId ?? ''),
    enabled: Boolean(categoryId),
    staleTime: 10 * 60 * 1000,
  })
}