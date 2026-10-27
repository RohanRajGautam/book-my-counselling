import { IndustryResponse } from '@/features/industries/types/industries.types'
import { AvailabilitySlot } from '@/features/availability/types/availability.types'
import { Subcategory } from '@/features/categories/types/categories.types'
import { TagResponse } from '@/features/tags/types/tags.types'
import { UserPublic } from '@/features/users/types/users.types'

export interface Mentor {
  id: string
  user_id: string
  full_name: string
  title: string
  company: string | null
  company_logo_url?: string | null
  industries?: string[]
  hourly_rate: number
  average_rating: number
  total_reviews: number
  total_sessions: number
  total_completed_sessions?: number
  is_accepting_bookings: boolean
  is_verified: boolean
  is_featured: boolean
  booking_mode: string
  requires_24h_approval?: boolean
  availability_slots?: AvailabilitySlot[]
  tags?: string[]
  tag_ids?: string[]
  professional_categories?: string[]
  professional_subcategories?: string[]
  academic_categories?: string[]
  academic_subcategories?: string[]
  avatar_url?: string | null
  created_at?: string | null
  is_professional_counselor: boolean
  is_academic_counselor: boolean
}

export interface MentorListResponse {
  id: string
  user: UserPublic
  title: string
  company: string | null
  company_logo_url: string | null
  industries: string[]
  hourly_rate: string
  average_rating: number
  total_reviews: number
  total_sessions: number
  total_completed_sessions?: number
  is_accepting_bookings: boolean
  is_verified: boolean
  booking_mode: string
  /** Numeric 0-100. Backend serializes Decimal as a JSON string. */
  mentor_share_pct: string
  tags: TagResponse[]
}

/**
 * The mentor's own user block — `UserPublic` plus the contact number they
 * set on their account.
 *
 * Only the self-only mentor endpoints return this. Public mentor responses
 * keep `UserPublic`, which has no phone: a mentor's number is not for
 * mentees, other mentors, or the public.
 */
export interface MentorSelfUser extends UserPublic {
  /** Contact number on the mentor's account. Null when never set. */
  phone: string | null
}

export interface MentorResponse {
  id: string
  user_id: string
  user: UserPublic
  title: string
  company: string | null
  company_logo_url: string | null
  bio: string | null
  industries: IndustryResponse[]
  years_of_experience: number
  hourly_rate: string
  average_rating: number
  total_reviews: number
  total_sessions: number
  total_completed_sessions?: number
  is_accepting_bookings: boolean
  is_featured: boolean
  is_verified: boolean
  booking_mode: 'instant' | 'approval_required'
  requires_24h_approval: boolean
  linkedin_url: string | null
  website_url: string | null
  calendly_link: string | null
  /** Numeric 0-100. Backend serializes Decimal as a JSON string. */
  mentor_share_pct: string
  tags: TagResponse[]
  subcategories: Subcategory[]
  created_at: string
  is_professional_counselor: boolean
  is_academic_counselor: boolean
}

/**
 * A mentor's own profile, with the contact number on the user block.
 *
 * Returned by the self-only endpoints (`POST /mentors/profile`,
 * `GET`/`PUT /mentors/profile/me`, `POST /mentors/profile/logo`) so the
 * profile form can pre-fill the number and confirm the save. Identical to
 * `MentorResponse` apart from `user.phone`.
 */
export interface MentorSelfResponse extends Omit<MentorResponse, 'user'> {
  user: MentorSelfUser
}
