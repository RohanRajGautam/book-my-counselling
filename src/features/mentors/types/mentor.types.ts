export interface Industry {
  id: string
  name: string
  slug: string
  description?: string | null
}

export interface AvailabilitySlot {
  start: string
  end: string
}

export interface Mentor {
  id: string
  user_id: string
  full_name: string
  title: string
  company: string | null
  industries?: string[]
  hourly_rate: number
  average_rating: number
  total_reviews: number
  total_sessions: number
  is_accepting_bookings: boolean
  is_verified: boolean
  is_featured: boolean
  booking_mode: string
  requires_24h_approval?: boolean
  availability_slots?: AvailabilitySlot[]
  tags?: string[]
  tag_ids?: string[]
  avatar_url?: string | null
  created_at?: string | null
}

export interface MentorListResponse {
  id: string
  user: UserPublic
  title: string
  company: string | null
  industries: string[]
  hourly_rate: string
  average_rating: number
  total_reviews: number
  total_sessions: number
  is_accepting_bookings: boolean
  is_verified: boolean
  booking_mode: string
  tags: TagResponse[]
}

export interface UserPublic {
  id: string
  full_name: string
  avatar_url: string | null
  role: 'mentor' | 'mentee' | 'admin'
}

export interface TagResponse {
  id: string
  name: string
  slug: string
}

export interface IndustryResponse {
  id: string
  name: string
  slug: string
  description?: string | null
}

export interface MentorResponse {
  id: string
  user_id: string
  user: UserPublic
  title: string
  company: string | null
  bio: string | null
  industries: IndustryResponse[]
  years_of_experience: number
  hourly_rate: string
  average_rating: number
  total_reviews: number
  total_sessions: number
  is_accepting_bookings: boolean
  is_featured: boolean
  is_verified: boolean
  booking_mode: 'instant' | 'approval_required'
  requires_24h_approval: boolean
  linkedin_url: string | null
  website_url: string | null
  tags: TagResponse[]
  created_at: string
}

export interface ServicePackageResponse {
  id: string
  mentor_id: string
  title: string
  description: string | null
  duration_minutes: number
  price: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AvailabilitySlotResponse {
  id: string
  mentor_id: string
  start_time: string
  end_time: string
  is_booked: boolean
  is_recurring: boolean
  recurrence_rule: string | null
  created_at: string
}

export interface ReviewResponse {
  id: string
  mentor_id: string
  reviewer_id: string
  booking_id: string
  rating: number
  comment: string | null
  reviewer: UserPublic
  created_at: string
  updated_at: string
}
