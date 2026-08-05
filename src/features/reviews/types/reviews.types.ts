import { UserPublic } from '@/features/users/types/users.types'

// Review left by a mentee for a mentor after a booking.
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

// Booking summary returned by the public magic-link GET endpoint.
// Drives the review form before submission.
export interface ReviewInvitation {
  booking_id: string
  mentor_id: string
  mentor_name: string
  mentor_avatar_url: string | null
  mentor_title: string
  mentor_company_name: string | null
  mentor_company_logo_url: string | null
  topic: string | null
  session_start: string
  session_end: string
  mentee_timezone: string | null
  already_reviewed: boolean
  expires_at: string
}

// Body shape for the public magic-link POST endpoint.
export interface ReviewSubmitRequest {
  rating: number
  comment?: string | null
}
