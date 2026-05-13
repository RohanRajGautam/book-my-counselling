export type CounselingType = 'academic' | 'professional'

export interface FilterState {
  jobTitle?: string
  industries: string[]
  academicCategory: string[]
  academicSubcategory: string[]
  academicSubcategoryParents: Record<string, string>
  professionalCategory: string[]
  professionalSubcategory: string[]
  professionalSubcategoryParents: Record<string, string>
  priceRange?: number
  availableThisWeek?: boolean
  availableToday?: boolean
  instantBooking?: boolean
  eveningsWeekends?: boolean
  experienceLevel?: string
  counselingType: CounselingType
  sortBy: 'rating' | 'reviews' | 'price-low' | 'price-high' | 'newest'
}
