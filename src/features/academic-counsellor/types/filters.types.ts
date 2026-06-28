export type SortBy = 'rating' | 'reviews' | 'price-low' | 'price-high' | 'newest'

export interface AcademicFilters {
  jobTitle: string
  academicCategory: string[]
  academicSubcategory: string[]
  academicSubcategoryParents: Record<string, string>
  availableThisWeek: boolean
  sortBy: SortBy
}
