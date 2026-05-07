export interface NavLink {
  title: string
  href: string
}

export interface Service {
  title: string
  description: string
  icon: string
}

export interface HowItWorksStep {
  step: number
  title: string
  description: string
}

export interface Counsellor {
  id: string
  name: string
  title: string
  specialization: string[]
  experience: number
  image: string
  bio: string
  availability: string[]
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  image?: string
}

// export interface FilterState {
//   industry: string
//   jobTitle: string
//   priceRange: number
//   availableThisWeek: boolean
//   instantBooking: boolean
//   eveningsWeekends: boolean
//   sortBy: 'rating' | 'reviews' | 'price-low' | 'price-high'
// }
