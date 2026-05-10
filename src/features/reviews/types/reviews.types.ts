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
