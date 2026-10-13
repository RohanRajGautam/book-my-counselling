import type { CoachForFreshersCategory } from '@/features/coach-for-freshers/types/coach-for-freshers.types'

export type SortBy = 'rating' | 'reviews' | 'price-low' | 'price-high' | 'newest'

export type Vendor = 'academic' | 'coach-for-freshers'

export interface AllMentorsFilters {
  jobTitle: string
  vendor: Vendor | null
  academicCategory: string[]
  academicSubcategory: string[]
  academicSubcategoryParents: Record<string, string>
  cffCategory: CoachForFreshersCategory | null
  availableThisWeek: boolean
  sortBy: SortBy
}
