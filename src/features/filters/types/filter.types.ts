export interface FilterState {
  jobTitle?: string
  industries: string[]
  priceRange?: number
  availableThisWeek?: boolean
  availableToday?: boolean
  instantBooking?: boolean
  eveningsWeekends?: boolean
  experienceLevel?: string
  counselingType: 'academic' | 'professional'
  sortBy: 'rating' | 'reviews' | 'price-low' | 'price-high'
}
