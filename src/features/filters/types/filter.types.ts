export interface FilterState {
  jobTitle?: string
  industry: string
  priceRange?: number
  availableThisWeek?: boolean
  instantBooking?: boolean
  eveningsWeekends?: boolean
  sortBy: 'rating' | 'reviews' | 'price-low' | 'price-high'
}
