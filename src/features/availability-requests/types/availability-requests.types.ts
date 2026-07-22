// ── Enums ─────────────────────────────────────────────────────────────────

/** Lifecycle state of an availability request. */
export type AvailabilityRequestStatus = 'pending' | 'confirmed' | 'rejected'

/** Allow-listed session durations for a request. */
export type AvailabilityRequestDuration = 30 | 60 | 90

export const ALLOWED_REQUEST_DURATIONS: readonly AvailabilityRequestDuration[] = [
  30, 60, 90,
] as const

// ── Wire types ────────────────────────────────────────────────────────────

/** Payload for the public create endpoint. Backend lowercases email + trims name/message. */
export interface AvailabilityRequestCreate {
  mentor_id: string
  requester_name: string
  requester_email: string
  duration_minutes: AvailabilityRequestDuration
  requested_start: string
  message?: string | null
}

/** Body for `POST /availability-requests/{id}/reject`. */
export interface AvailabilityRequestReject {
  reason?: string | null
}

export interface AvailabilityRequestMentorSummary {
  id: string
  user_id: string
  title: string | null
  full_name: string | null
  email: string | null
  avatar_url: string | null
}

/** Response from any request endpoint. */
export interface AvailabilityRequestResponse {
  id: string
  mentor_id: string
  mentor: AvailabilityRequestMentorSummary | null
  requester_name: string
  requester_email: string
  duration_minutes: AvailabilityRequestDuration
  requested_start: string
  requested_end: string
  message: string | null
  status: AvailabilityRequestStatus
  rejection_reason: string | null
  confirmed_at: string | null
  rejected_at: string | null
  created_slot_id: string | null
  created_at: string
  updated_at: string
}
