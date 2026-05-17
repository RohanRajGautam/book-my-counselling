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

export type RefundStatus = 'requested' | 'approved' | 'rejected' | 'processed'

export type RefundReason =
  | 'mentee_cancellation'
  | 'mentor_cancellation'
  | 'admin_cancellation'
  | 'slot_conflict'
  | 'other'

export interface RefundUserSummary {
  id: string
  full_name: string
  email: string
}

export interface RefundBookingSummary {
  id: string
  topic: string | null
  session_start: string
  session_end: string
  agreed_price: string
}

export interface RefundRequest {
  id: string
  booking_id: string
  payment_transaction_id: string | null
  amount: string
  status: RefundStatus
  reason: RefundReason
  reason_notes: string | null
  requested_by: RefundUserSummary | null
  requested_at: string
  decided_by: RefundUserSummary | null
  decided_at: string | null
  decision_notes: string | null
  processed_at: string | null
  fonepay_refund_reference: string | null
  booking: RefundBookingSummary | null
  created_at: string
  updated_at: string
}
