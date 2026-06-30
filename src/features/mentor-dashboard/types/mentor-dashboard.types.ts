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
  agreed_price: string
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

export interface MentorProfileCreate {
  title: string
  company?: string | null
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
}

export interface MentorProfileUpdate {
  title?: string
  company?: string | null
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
  coaching_services?: string[]
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
