import { BookingStatus } from '@/features/mentor-dashboard/types/booking-status'

export interface MenteePublic {
  id: string
  full_name: string
  avatar_url: string | null
  role: string
}

export interface MentorBooking {
  id: string
  mentor_id: string
  mentee_id: string
  slot_id: string | null
  package_id: string | null
  status: BookingStatus
  topic: string | null
  notes: string | null
  goals: string
  current_school: string | null
  preparation_notes: string | null
  mentee_timezone: string | null
  /** Net price the mentee paid to Fonepay (post-discount). */
  agreed_price: string
  /** Gross price before any promo discount. */
  original_price: string
  /** Promo discount applied. `0` when no code was used. */
  discount_amount: string
  /** Mentor's cut, snapshotted at booking time. Computed off `original_price`. */
  mentor_earning: string
  /** Platform's cut; can be `0` or negative when a discount exceeds the platform share. */
  platform_earning: string
  /** Promo code applied, or `null` when none. */
  promo_code: string | null
  session_start: string
  session_end: string
  cancellation_reason: string | null
  payment_status: string
  created_at: string
  updated_at: string
  confirmed_at: string | null
  completed_at: string | null
  cancelled_at: string | null
  mentee: MenteePublic
  has_review: boolean
}

/**
 * Server-aggregated mentor dashboard stats. Returned by `GET /mentors/me/stats`.
 * Money fields are pre-formatted strings (e.g. "10.00") — render verbatim,
 * do not parseFloat and re-round.
 */
export interface MentorStatsResponse {
  /** SUM(mentor_earning) for paid, non-cancelled bookings. */
  total_earnings: string
  /** total_earnings narrowed to status = 'completed'. */
  completed_earnings: string
  /** total_earnings - completed_earnings (paid but not yet delivered). */
  pending_earnings: string
  /** Count of paid, non-cancelled bookings. */
  total_sessions: number
  /** Count of paid, status = 'completed' bookings. */
  completed_sessions: number
  /** Paid bookings with status in (pending, confirmed) and session_start > now(). */
  upcoming_sessions: number
  /** Distinct mentees over paid, non-cancelled bookings. */
  total_mentees: number
  /** This mentor's configured split, as a string like "50.00". */
  mentor_share_pct: string
}

export interface MentorProfileCreate {
  title: string
  company?: string | null
  company_logo_url?: string | null
  bio?: string | null
  industry_ids?: string[]
  years_of_experience?: number
  hourly_rate: number
  linkedin_url?: string | null
  website_url?: string | null
  calendly_link?: string | null
  tag_ids?: string[]
  booking_mode?: 'instant' | 'approval_required'
  is_professional_counselor?: boolean
  is_academic_counselor?: boolean
  requires_24h_approval?: boolean
  // Academic subcategory picker — required when is_academic_counselor = true.
  subcategory_ids?: string[]
  // Professional category picker — pairs each professional parent category with the
  // subcategories the mentor picks under it. Persisted via mentor_subcategories.
  professional_categories?: ProfessionalCategoryWithSubs[]
}

export interface ProfessionalCategoryWithSubs {
  category_id: string
  subcategory_ids: string[]
}

export interface MentorProfileUpdate {
  title?: string
  company?: string | null
  company_logo_url?: string | null
  bio?: string | null
  industry_ids?: string[]
  years_of_experience?: number
  hourly_rate?: number
  linkedin_url?: string | null
  website_url?: string | null
  calendly_link?: string | null
  tag_ids?: string[]
  is_accepting_bookings?: boolean
  booking_mode?: 'instant' | 'approval_required'
  requires_24h_approval?: boolean
  is_professional_counselor?: boolean
  is_academic_counselor?: boolean
  // Sending subcategory_ids replaces the mentor's existing set; omitting it leaves them untouched.
  subcategory_ids?: string[]
  // Sending professional_categories replaces the mentor's existing set; omitting it leaves them untouched.
  professional_categories?: ProfessionalCategoryWithSubs[]
}

export interface ServicePackage {
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

export interface ServicePackageCreate {
  title: string
  description?: string | null
  duration_minutes: number
  price: number
}

export interface ServicePackageUpdate {
  title?: string
  description?: string | null
  duration_minutes?: number
  price?: number
  is_active?: boolean
}

export interface AvailabilitySlotCreate {
  start_time: string
  end_time: string
  is_recurring?: boolean
  recurrence_rule?: string | null
}

export interface AvailabilitySlot {
  id: string
  mentor_id: string
  start_time: string
  end_time: string
  is_booked: boolean
  is_recurring: boolean
  recurrence_rule: string | null
  created_at: string
}

export interface CalendlyLinkUpdate {
  calendly_link: string | null
}

export interface CalendlyLinkResponse {
  mentor_id: string
  calendly_link: string | null
}

// ── Admin mentor creation ──────────────────────────────────────────────────

/**
 * Payload for `POST /admin/mentors` (sent as JSON in the multipart `metadata`
 * field). Creates a User + MentorProfile in one call.
 */
export interface AdminMentorCreate {
  user: {
    email: string
    full_name: string
    avatar_url?: string | null
  }
  title: string
  company?: string | null
  company_logo_url?: string | null
  bio?: string | null
  industry_ids?: string[]
  years_of_experience?: number
  hourly_rate: number
  linkedin_url?: string | null
  website_url?: string | null
  calendly_link?: string | null
  tag_ids?: string[]
  booking_mode?: 'instant' | 'approval_required'
  is_professional_counselor?: boolean
  is_academic_counselor?: boolean
  requires_24h_approval?: boolean
  subcategory_ids?: string[]
  professional_categories?: ProfessionalCategoryWithSubs[]
}

/** Returned from `POST /admin/mentors` on 201. `temp_password` is shown ONCE. */
export interface AdminMentorCreateResponse {
  user: { id: string; email: string; full_name: string; avatar_url: string | null }
  profile: import('@/features/mentors/types/mentors.types').MentorResponse
  temp_password: string
}
