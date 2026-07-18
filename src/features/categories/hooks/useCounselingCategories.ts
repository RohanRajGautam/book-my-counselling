import { useQueries, useQuery } from '@tanstack/react-query'

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

/**
 * Returns the Set of every academic subcategory UUID across all academic parent
 * categories. Used on the edit page to disambiguate academic from professional
 * subcategories in the flat `subcategories: Subcategory[]` response payload.
 *
 * `isLoading` stays true until every parent-category list AND each parallel
 * subcategory query has resolved — callers should gate on it before deciding
 * the bucketing is final.
 */
export function useAllAcademicSubcategoryIds(): { ids: Set<string>; isLoading: boolean } {
  const { data: categories = [], isLoading: categoriesLoading } = useCounselingCategories('academic')

  const queries = useQueries({
    queries: categoriesLoading
      ? []
      : categories.map((c) => ({
          queryKey: ['category-subcategories', c.id] as const,
          queryFn: () => getSubcategories(c.id),
          staleTime: 10 * 60 * 1000,
        })),
  })

  const subcategoriesLoading = queries.some((q) => q.isLoading)

  const ids = new Set<string>()
  queries.forEach((q) => {
    if (q.data) {
      q.data.forEach((s) => ids.add(s.id))
    }
  })
  return { ids, isLoading: categoriesLoading || subcategoriesLoading }
}

/**
 * Buckets a flat list of subcategory IDs into the professional `{category_id,
 * subcategory_ids}[]` shape. Loads all professional parent categories and their
 * subcategories in parallel, then groups input subcategory IDs under their parent.
 *
 * Parents whose subcategories don't include any of the input IDs are omitted from
 * the result — so the caller can use the returned array directly as the
 * `professional_categories` PUT payload.
 */
export function useProfessionalSubcategoryBuckets(
  subcategoryIds: string[]
): { buckets: { category_id: string; subcategory_ids: string[] }[]; isLoading: boolean } {
  const inputIds = new Set(subcategoryIds)
  const { data: categories = [], isLoading: categoriesLoading } = useCounselingCategories('professional')

  const queries = useQueries({
    queries: categoriesLoading
      ? []
      : categories.map((c) => ({
          queryKey: ['category-subcategories', c.id] as const,
          queryFn: () => getSubcategories(c.id),
          staleTime: 10 * 60 * 1000,
        })),
  })

  const subcategoriesLoading = queries.some((q) => q.isLoading)

  const buckets: { category_id: string; subcategory_ids: string[] }[] = []
  categories.forEach((category, idx) => {
    const subList = queries[idx]?.data
    if (!subList) return
    const matched = subList.filter((s) => inputIds.has(s.id)).map((s) => s.id)
    if (matched.length > 0) {
      buckets.push({ category_id: category.id, subcategory_ids: matched })
    }
  })
  return { buckets, isLoading: categoriesLoading || subcategoriesLoading }
}