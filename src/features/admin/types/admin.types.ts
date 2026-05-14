export interface AdminMentorProfile {
  id: string
  user_id: string
  user: {
    id: string
    full_name: string
    avatar_url: string | null
    role: string
  }
  title: string
  company: string | null
  bio: string | null
  hourly_rate: string
  years_of_experience: number
  average_rating: number
  total_reviews: number
  total_sessions: number
  is_accepting_bookings: boolean
  is_featured: boolean
  is_verified: boolean
  booking_mode: string
  linkedin_url: string | null
  website_url: string | null
  is_professional_counselor: boolean
  is_academic_counselor: boolean
  is_rejected: boolean
  tags: { id: string; name: string; slug: string }[]
  created_at: string
}

export interface AdminStats {
  total_users: number
  total_mentors: number
  total_bookings: number
}
