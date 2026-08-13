import apiClient from '@/lib/api/api-client'

export interface FeaturedMentorTag {
  id: string
  name: string
  slug: string
}

export interface FeaturedMentor {
  id: string
  user: {
    id: string
    full_name: string
    avatar_url: string | null
    role: string
  }
  title: string
  company: string | null
  company_logo_url: string | null
  industries: string[]
  hourly_rate: string
  average_rating: number
  total_reviews: number
  total_sessions: number
  is_accepting_bookings: boolean
  is_verified: boolean
  booking_mode: 'instant' | 'approval_required'
  tags: FeaturedMentorTag[]
  subcategories: string[]
  is_professional_counselor: boolean
  is_academic_counselor: boolean
  mentor_share_pct: string
}

export interface FeaturedMentorsParams {
  limit?: number
}

export async function getFeaturedMentors(
  params: FeaturedMentorsParams = {}
): Promise<FeaturedMentor[]> {
  const res = await apiClient.get<FeaturedMentor[]>('/mentors/featured', {
    params: { limit: params.limit ?? 8 },
  })
  return res.data
}
