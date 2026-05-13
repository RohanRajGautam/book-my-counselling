import { useQuery } from '@tanstack/react-query'

import { CounselingType } from '@/features/filters/types/filter.types'
import { getCategories, getSubcategories } from '../api/categories.api'
import { CategoryListItem, Subcategory } from '../types/categories.types'

export function useCounselingCategories(type: CounselingType) {
  return useQuery<CategoryListItem[]>({
    queryKey: ['categories', type],
    queryFn: () => getCategories(type),
    staleTime: 10 * 60 * 1000,
  })
}

export function useCategorySubcategories(categoryId?: string) {
  return useQuery<Subcategory[]>({
    queryKey: ['category-subcategories', categoryId],
    queryFn: () => getSubcategories(categoryId ?? ''),
    enabled: Boolean(categoryId),
    staleTime: 10 * 60 * 1000,
  })
}
