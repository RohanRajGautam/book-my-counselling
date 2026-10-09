// ── Enums ──────────────────────────────────────────────────────────────────

/**
 * Lifecycle state of a mentor's payout request.
 *
 * - `open`         — mentor has filed the request, no admin action yet
 * - `acknowledged` — admin has read-receipted; the row's `admin_note`,
 *                    `acknowledged_at`, and `acknowledged_by_admin_name`
 *                    are populated
 */
export type PayoutRequestStatus = 'open' | 'acknowledged'

/** Always `NPR` in v1. Hard-coded to a literal so future currencies fail loud. */
export type PayoutRequestCurrency = 'NPR'

// ── Wire types ────────────────────────────────────────────────────────────

/**
 * Body for `POST /mentors/me/payout-request`. The backend accepts an empty
 * object — `mentor_message` is purely an optional note the mentor may leave
 * for the admin.
 */
export interface PayoutRequestCreate {
  mentor_message?: string | null
}

/** Body for `POST /admin/payout-requests/{id}/acknowledge`. */
export interface PayoutRequestAcknowledge {
  admin_note?: string | null
}

/**
 * Mentor view of a payout request. The mentor is the only one who can see
 * their own row; the admin side sees additional identity fields
 * (`mentor_name`, `mentor_email`) which are intentionally omitted here.
 */
export interface PayoutRequestMentorRow {
  id: string
  mentor_id: string
  status: PayoutRequestStatus
  /** Decimal as string — never parse to a JS number for math. */
  balance_snapshot: string
  currency: PayoutRequestCurrency
  eligible_booking_count: number
  mentor_message: string | null
  admin_note: string | null
  created_at: string
  acknowledged_at: string | null
  acknowledged_by_user_id: string | null
  acknowledged_by_admin_name: string | null
}

/**
 * Admin view of a payout request. Adds `mentor_name` and `mentor_email`
 * (resolved server-side at request time) so the admin can identify and
 * contact the mentor without a follow-up `/mentors/{id}` lookup.
 */
export interface PayoutRequestAdminRow extends PayoutRequestMentorRow {
  mentor_name: string
  mentor_email: string
}
