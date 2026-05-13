import api from '@/lib/api/api-client'
import { CounselingType } from '@/features/filters/types/filter.types'
import { CategoryListItem, Subcategory } from '../types/categories.types'

export async function getCategories(type: CounselingType): Promise<CategoryListItem[]> {
  const response = await api.get<CategoryListItem[]>('/catalog/categories', {
    params: {
      counselor_type: type,
    },
  })

  return response.data
}

export async function getSubcategories(categoryId: string): Promise<Subcategory[]> {
  const response = await api.get<Subcategory[]>(`/catalog/categories/${categoryId}/subcategories`)

  return response.data
}
