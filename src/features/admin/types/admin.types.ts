import type { UserResponse } from '@/features/auth/types/auth.types'
import type { ProfessionalCategoryWithSubs } from '@/features/mentor-dashboard/types/mentor-dashboard.types'
import type { MentorResponse } from '@/features/mentors/types/mentors.types'

// ── Mentors ────────────────────────────────────────────────────────────────

export type AdminMentorBookingMode = 'instant' | 'approval_required'

export interface AdminMentorProfile {
  id: string
  user_id: string
  /**
   * Mentor user summary. Matches the backend's admin-only `AdminMentorListUser`
   * schema — `email` is included so the admin list can show, copy, or link to
   * it directly. Public mentor endpoints still omit email.
   */
  user: {
    id: string
    full_name: string
    email: string
    avatar_url: string | null
    role: string
  }
  title: string
  company: string | null
  company_logo_url: string | null
  bio: string | null
  /** Lightweight industry refs the mentor specializes in. */
  industries: { id: string; name: string; slug: string }[]
  /** Subcategories within those industries — the specific topics the mentor covers. */
  subcategories: { id: string; name: string; slug: string }[]
  hourly_rate: string
  /** Numeric 0-100. Backend serializes Decimal as a JSON string. */
  mentor_share_pct: string
  years_of_experience: number
  average_rating: number
  total_reviews: number
  total_sessions: number
  is_accepting_bookings: boolean
  is_featured: boolean
  is_verified: boolean
  is_rejected: boolean
  booking_mode: AdminMentorBookingMode
  /** Whether instant-book requests still need 24h mentor review. */
  requires_24h_approval: boolean
  linkedin_url: string | null
  website_url: string | null
  calendly_link: string | null
  is_professional_counselor: boolean
  is_academic_counselor: boolean
  tags: { id: string; name: string; slug: string }[]
  created_at: string
}

export interface AdminUserProfileResponse {
  user: UserResponse
  profile: MentorResponse | null
}

export interface AdminUserUpdate {
  full_name?: string | null
  avatar_url?: string | null
}

export interface AdminMentorProfileUpdate {
  title?: string | null
  company?: string | null
  company_logo_url?: string | null
  bio?: string | null
  linkedin_url?: string | null
  website_url?: string | null
  calendly_link?: string | null
  years_of_experience?: number | null
  hourly_rate?: string | null
  /** Numeric 0-100. Sets the mentor's share of `original_price` per booking. Default 50. */
  mentor_share_pct?: number | null
  booking_mode?: AdminMentorBookingMode | null
  requires_24h_approval?: boolean | null
  is_accepting_bookings?: boolean | null
  is_featured?: boolean | null
  industry_ids?: string[] | null
  tag_ids?: string[] | null
  subcategory_ids?: string[] | null
  professional_categories?: ProfessionalCategoryWithSubs[] | null
  is_professional_counselor?: boolean | null
  is_academic_counselor?: boolean | null
  coaching_services?: string[] | null
}

export interface AdminUserProfileUpdate {
  user?: AdminUserUpdate
  mentor_profile?: AdminMentorProfileUpdate
}

export interface AdminStats {
  total_users: number
  total_mentors: number
  total_bookings: number
  // Pydantic serializes Decimal as a JSON string; coerce at the consumer.
  total_revenue: string
  /** Bookings created at or after today's UTC midnight. Includes cancelled,
   *  refunded, and pending-payment rows — every `Booking` row, regardless of
   *  status. */
  todays_bookings: number
  /** MentorProfile rows with `is_verified=true` AND `created_at` at or after
   *  today's UTC midnight. Bucketed by profile creation date, not approval
   *  time — there is no separate `approved_at` column. */
  todays_onboarded_mentors: number
  /** Bookings created during yesterday's UTC day (yesterday midnight
   *  inclusive, today midnight exclusive). Echoed alongside
   *  `todays_bookings` so the dashboard can render a delta without an extra
   *  request. */
  yesterdays_bookings: number
  /** Approved mentors (`is_verified=true`) created during yesterday's UTC
   *  day. Same delta-against-yesterday pattern as `yesterdays_bookings`. */
  yesterdays_onboarded_mentors: number
}

/**
 * Response from GET /admin/mentors/onboarding-stats.
 *
 * Two pre-zero-filled, oldest-first series of approved-mentor counts
 * (MentorProfile.is_verified=true, bucketed by MentorProfile.created_at):
 *
 *   - `weekly`  — 7 entries, last entry is today (UTC).
 *   - `monthly` — 12 entries, last entry is the current UTC month.
 *
 * Both series are contiguous and zero-filled server-side — every bucket in
 * the window appears in the array even when the count is 0. Render them
 * as-is; do not re-derive buckets client-side.
 */
export interface MentorOnboardingStats {
  weekly: Array<{ date: string; count: number }>
  monthly: Array<{ month: string; count: number }>
}

// ── Bookings ──────────────────────────────────────────────────────────────

export type AdminBookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type AdminPaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'failed'

export interface AdminBookingMentee {
  id: string
  full_name: string
  email: string
}

export interface AdminBookingMentor {
  id: string
  title: string | null
  full_name: string
  email: string | null
}

export interface AdminBookingRefundSummary {
  id: string
  status: 'requested' | 'approved' | 'rejected' | 'processed'
  amount: string
  requested_at: string
}

export interface AdminBookingRow {
  id: string
  status: AdminBookingStatus
  payment_status: AdminPaymentStatus
  topic: string | null
  /** Net price the mentee paid (post-discount). */
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
  created_at: string
  cancelled_at: string | null
  cancellation_reason: string | null
  mentee: AdminBookingMentee
  mentor: AdminBookingMentor
  refund: AdminBookingRefundSummary | null
}

// ── Record offline session ────────────────────────────────────────────────

/**
 * Request body for `POST /api/v1/admin/bookings/on-behalf`.
 *
 * Lets an admin write a booking record for a session that didn't go through
 * the normal mentee funnel (e.g. mentee paid offline, payment crashed, session
 * arranged out-of-band). The booking is indistinguishable from a normal one —
 * the mentor is paid their share, payout reports pick it up, and (for past
 * sessions) the mentee gets a review link.
 *
 * Note: `status` is NOT in this schema — it's auto-derived from `session_start`
 * on the backend (past → COMPLETED, future → CONFIRMED). The UI previews the
 * derived status below the date picker; this is the single most important
 * thing the form has to get right.
 */
export interface AdminCreateBookingRequest {
  mentor_id: string
  mentee_email: string
  mentee_full_name: string
  slot_id?: string | null
  package_id?: string | null
  session_start: string
  session_end: string
  topic?: string | null
  notes?: string | null
  goals: string
  current_school?: string | null
  guardian_phone?: string | null
  preparation_notes?: string | null
  mentee_timezone?: string | null
  /** Decimal as string, e.g. "100.00". Bounded 0–100000 server-side. */
  agreed_price: string
  promo_code?: string | null
}

/**
 * Lightweight mentor option used by the admin record-session mentor picker.
 * We pull from `/admin/mentors?q=...` and project to what the form needs:
 * `id` (MentorProfile id, used as `mentor_id`) plus the human label
 * (`full_name (email) — title`) and `mentor_share_pct` for the live earnings
 * preview.
 */
export interface AdminMentorPickerOption {
  id: string
  full_name: string
  email: string | null
  title: string | null
  /** Numeric 0–100, JSON string per the backend's Decimal convention. */
  mentor_share_pct: string
  /** Mentor's hourly_rate — used as the gross anchor for 100%-off promos in
   *  the live pricing preview. Numeric string per the Decimal convention. */
  hourly_rate: string | null
}

// ── Outside Sessions ──────────────────────────────────────────────────────

/**
 * Lifecycle of an outside-session row. The backend auto-derives this from
 * `session_start` at write time: past → COMPLETED, future → SCHEDULED. There
 * is no PENDING or CANCELLED — outside sessions are always either in the
 * books (scheduled) or already done (completed).
 *
 * Deliberately distinct from `AdminBookingStatus` (pending/confirmed/completed
 * /cancelled): outside sessions are a separate table and never appear in the
 * Bookings list, the revenue dashboard, or the payout queue.
 */
export type OutsideSessionStatus = 'scheduled' | 'completed'

/**
 * One row from `GET /admin/outside-sessions` (or `POST`/`PATCH` — same shape).
 * Field names mirror the backend's `OutsideSessionResponse` Pydantic model
 * verbatim so the API client can `response.data` directly without renaming.
 */
export interface OutsideSessionRow {
  id: string
  status: OutsideSessionStatus
  session_start: string
  session_end: string
  /** What the mentee paid. Decimal as string per the backend convention. */
  cost: string
  /** Mentor's cut, snapshotted at write time. Can be negative (BYC absorbs a loss). */
  mentor_share: string
  /** Platform's cut. Can be negative when discount > platform share (BYC absorbs the loss). */
  platform_share: string
  promo_code: string | null
  /** Internal admin notes. Never surfaced to mentor or mentee in any email. */
  notes: string | null
  mentee_timezone: string | null
  created_at: string
  updated_at: string
  /** Set when status flips to 'completed' via the PATCH `/complete` endpoint. */
  completed_at: string | null
  /** Token for the post-session review email. Surfaced for the detail modal only. */
  review_token: string | null
  review_token_expires_at: string | null
  review_token_used_at: string | null
  mentor_id: string
  mentor_name: string
  mentor_email: string | null
  mentee_id: string
  mentee_name: string
  mentee_email: string
  created_by_admin_id: string
}

/**
 * Request body for `POST /admin/outside-sessions`. All money fields are
 * verbatim strings (Decimal); mentor_share and platform_share may be
 * negative (-100000…100000 server-side) — cost is bounded 0…100000.
 *
 * Distinct from `AdminCreateBookingRequest`: no `slot_id`, `package_id`,
 * `topic`, `goals`, `current_school`, `guardian_phone`, or `preparation_notes`,
 * since outside sessions don't go through the mentee funnel. The promo code
 * here is free text — the server does not validate it.
 */
export interface OutsideSessionCreate {
  mentor_id: string
  mentee_email: string
  mentee_full_name: string
  session_start: string
  session_end: string
  cost: string
  mentor_share: string
  platform_share: string
  promo_code?: string | null
  notes?: string | null
  mentee_timezone?: string | null
}

// ── Refunds ───────────────────────────────────────────────────────────────

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
  /** Net price the mentee paid. */
  agreed_price: string
  /** Gross price before any promo discount. Required so refunds can show "of original NPR X". */
  original_price: string
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

// ── Revenue ───────────────────────────────────────────────────────────────

export type RevenuePeriod = 'weekly' | 'monthly' | 'yearly' | 'custom'

/**
 * One bucket of revenue. Granularity of `period_start` depends on the
 * response's `period` field — see `AdminRevenue.period`.
 */
export interface RevenueBreakdownItem {
  /**
   * First day of the bucket, as `YYYY-MM-DD` (UTC calendar date).
   * - `weekly` / `custom` → a single calendar day
   * - `monthly`            → the first day of a calendar month (YYYY-MM-01)
   * - `yearly`             → Jan 1 of a calendar year (YYYY-01-01)
   */
  period_start: string
  // Pydantic serializes Decimal as a JSON string; coerce at the consumer.
  revenue: string
  booking_count: number
}

export interface AdminRevenue {
  /** Echoes back what was asked for (or `weekly` if no filter was passed). */
  period: RevenuePeriod
  /** Actual window start. Use for the coverage label. */
  start_date: string
  /** Actual window end. Use for the coverage label. */
  end_date: string
  /** NPR Decimal, sum over the window. Pydantic serializes as a JSON string; coerce at the consumer. */
  total_revenue: string
  total_paid_bookings: number
  /** Ascending by `period_start`. Empty buckets are OMITTED — fill client-side. */
  breakdown: RevenueBreakdownItem[]
}

/** Returned only when the request was `?period=all`. Each section is a full `AdminRevenue`. */
export interface AdminRevenueMulti {
  weekly: AdminRevenue
  monthly: AdminRevenue
  yearly: AdminRevenue
}

/** Response from `GET /admin/revenue`. Discriminate on shape (the bundle has `weekly` / `monthly` / `yearly` keys, the single-period response does not). */
export type AdminRevenueResponse = AdminRevenue | AdminRevenueMulti

/** A single preset (excludes `custom`, which is handled separately and excludes `all`, which is request-only). */
export type PresetRevenuePeriod = 'weekly' | 'monthly' | 'yearly'
