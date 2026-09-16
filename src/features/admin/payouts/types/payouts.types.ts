// All monetary fields are decimal strings on the wire — never parse to a
// JS `number` for math. See `/docs`/payouts.md "all money fields are
// decimal strings" callout.

export type PayoutCurrency = 'NPR'

export type PayoutStatus = 'pending' | 'paid' | 'cancelled'

export type PayoutPaymentMethod =
  | 'bank_transfer'
  | 'esewa'
  | 'khalti'
  | 'cash'
  | 'other'

// ── Owed summary ──────────────────────────────────────────────────────────

export interface OwedPerMentorSummary {
  mentor_id: string
  mentor_name: string
  mentor_email: string
  booking_count: number
  total_owed: string
  earliest_session: string | null
  latest_session: string | null
  currency: PayoutCurrency
}

export interface OwedResponse {
  per_mentor: OwedPerMentorSummary[]
  total_owed_all_mentors: string
  total_eligible_bookings: number
  currency: PayoutCurrency
}

// ── Eligible bookings (per-mentor preview) ────────────────────────────────

export interface OwedPerBookingItem {
  booking_id: string
  session_start: string
  mentor_id: string
  mentor_name: string
  mentee_id: string
  mentee_name: string
  original_price: string
  discount_amount: string
  mentor_earning: string
}

// ── Payouts ───────────────────────────────────────────────────────────────

export interface PayoutResponse {
  id: string
  mentor_id: string
  status: PayoutStatus
  currency: PayoutCurrency
  total_amount: string
  booking_count: number
  period_start: string | null
  period_end: string | null
  payment_method: PayoutPaymentMethod | null
  payment_reference: string | null
  paid_at: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface PayoutItemResponse {
  id: string
  booking_id: string
  mentor_earning_snapshot: string
  original_price_snapshot: string
  discount_amount_snapshot: string
  session_start: string
  mentee_id: string
  clawed_back_at: string | null
  clawback_refund_request_id: string | null
}

export interface PayoutDetailResponse extends PayoutResponse {
  items: PayoutItemResponse[]
  has_clawbacks: boolean
}

// ── Create payloads ───────────────────────────────────────────────────────

export interface PayoutCreateManual {
  mentor_id: string
  booking_ids: string[]
  notes?: string
}

export interface PayoutCreateWindow {
  mentor_id: string
  period_start: string
  period_end: string
  notes?: string
}

export type PayoutCreatePayload = PayoutCreateManual | PayoutCreateWindow

// ── Mark paid / cancel payloads ───────────────────────────────────────────

export interface PayoutMarkPaid {
  payment_method: PayoutPaymentMethod
  payment_reference: string
  notes?: string
}

export interface PayoutCancel {
  cancellation_reason: string
}