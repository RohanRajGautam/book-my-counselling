import { CounselingType } from '@/features/filters/types/filter.types'

export interface CategoryListItem {
  id: string
  name: string
  slug: string
  counselor_type: CounselingType
}

export interface Subcategory {
  id: string
  name: string
  slug: string
}

export interface Category extends CategoryListItem {
  subcategories: Subcategory[]
}
