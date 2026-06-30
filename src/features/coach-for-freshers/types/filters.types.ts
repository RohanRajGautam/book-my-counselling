import type { CoachForFreshersCategory } from './coach-for-freshers.types'

export type SortBy = 'rating' | 'reviews' | 'price-low' | 'price-high' | 'newest'

export interface CoachForFreshersFilters {
  jobTitle: string
  category: CoachForFreshersCategory | null
  availableThisWeek: boolean
  sortBy: SortBy
}
