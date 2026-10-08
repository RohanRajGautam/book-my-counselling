import type { BookingStatus } from '@/features/mentor-dashboard/types/booking-status'
import type { AdminBookingStatus } from '@/features/admin/types/admin.types'

export type MeetingProvider = 'google_meet' | null

/**
 * Shape returned by `GET /mentors/me/meetings` and `GET /admin/meetings`.
 * Mentor rows add nothing extra; admin rows carry `mentee_email`/`mentee_name`.
 */
interface MeetingRowCore {
  id: string
  session_start: string
  session_end: string
  topic: string | null
  status: BookingStatus
  payment_status: 'paid' | 'pending' | 'unpaid'
  meeting_provider: MeetingProvider
  meeting_link: string | null
  meeting_error: string | null
  meeting_attempts: number
  meeting_created_at: string | null
  mentor_id: string
  mentee_id: string
}

export interface AdminMeetingRow extends MeetingRowCore {
  mentee_email: string
  mentee_name: string
  mentor_name: string
  mentee_phone?: string | null
}

/** Filters shared between the mentor + admin list views. */
export interface MeetingFilters {
  /** `'true' | 'false'` → `has_link=true|false`. Omit for all. */
  has_link?: boolean
  status?: BookingStatus | AdminBookingStatus
  /** ISO timestamp; backend strips tz-naive comparisons. */
  date_from?: string
  /** ISO timestamp; backend strips tz-naive comparisons. */
  date_to?: string
  /** Admin-only free-text search: mentee email/name, mentor name. */
  q?: string
  page?: number
  page_size?: number
}

/** Response of `POST /admin/meetings/{booking_id}/retry`. */
export interface AdminMeetingRetryResponse {
  booking_id: string
  meeting_link: string | null
  meeting_provider: MeetingProvider
  meeting_attempts: number
  meeting_error: string | null
  success: boolean
  message: string
}

/** True iff a row represents a paid, incomplete meeting — used for badge logic. */
export function isMeetingMissing(row: Pick<MeetingRowCore, 'meeting_link' | 'meeting_attempts' | 'meeting_error'>): boolean {
  if (row.meeting_link) return false
  if (row.meeting_error && row.meeting_error.length > 0) return true
  return row.meeting_attempts >= 5
}