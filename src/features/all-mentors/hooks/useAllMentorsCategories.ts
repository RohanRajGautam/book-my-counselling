import { useQuery } from '@tanstack/react-query'

import { getAcademicCounsellorCategories } from '@/features/academic-counsellor/api/academic-counsellor.api'
import { getAcademicCounsellorSubcategories } from '@/features/academic-counsellor/api/academic-counsellor.api'
import type {
  AcademicCounsellorCategory,
  AcademicCounsellorSubcategory,
} from '@/features/academic-counsellor/types/academic-counsellor.types'

export function useAllMentorsAcademicCategories() {
  return useQuery<AcademicCounsellorCategory[]>({
    queryKey: ['all-mentors-academic-categories'],
    queryFn: getAcademicCounsellorCategories,
    staleTime: 10 * 60 * 1000,
  })
}

export function useAllMentorsAcademicSubcategories(categoryId?: string) {
  return useQuery<AcademicCounsellorSubcategory[]>({
    queryKey: ['all-mentors-academic-subcategories', categoryId],
    queryFn: () => getAcademicCounsellorSubcategories(categoryId ?? ''),
    enabled: Boolean(categoryId),
    staleTime: 10 * 60 * 1000,
  })
}
