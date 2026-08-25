// ── Enums ─────────────────────────────────────────────────────────────────

/** Lifecycle state of a mentor match request (admin workflow). */
export type MentorMatchRequestStatus = 'pending' | 'contacted' | 'fulfilled' | 'closed'

export const MENTOR_MATCH_STATUSES: readonly MentorMatchRequestStatus[] = [
  'pending',
  'contacted',
  'fulfilled',
  'closed',
] as const

// ── Wire types ────────────────────────────────────────────────────────────

/**
 * Payload for the public `POST /mentor-match-requests` endpoint.
 * No auth required — requester is identified by name + email only.
 * Backend lowercases the email and trims every text field.
 */
export interface MentorMatchCreate {
  requester_name: string
  requester_email: string
  phone?: string | null
  preferred_expertise: string
  preferred_industry?: string | null
  current_role?: string | null
  goals: string
  preferred_session_format?: string | null
  timeline?: string | null
  additional_notes?: string | null
  preferred_at?: string | null
}

/** Payload for the admin `PATCH /mentor-match-requests/admin/{id}` endpoint. */
export interface MentorMatchUpdate {
  status?: MentorMatchRequestStatus
  admin_notes?: string | null
}

/** Identity block for the admin user who last touched a request. */
export interface MentorMatchAdminSummary {
  id: string
  full_name: string | null
  email: string | null
}

/** Response shape for any mentor-match-request endpoint. */
export interface MentorMatchResponse {
  id: string

  // Requester-entered
  requester_name: string
  requester_email: string
  phone: string | null
  preferred_expertise: string
  preferred_industry: string | null
  current_role: string | null
  goals: string
  preferred_session_format: string | null
  timeline: string | null
  additional_notes: string | null
  preferred_at: string | null

  // Lifecycle
  status: MentorMatchRequestStatus

  // Admin-only audit fields
  admin_notes: string | null
  decision_at: string | null
  decision_by_user_id: string | null
  decided_by: MentorMatchAdminSummary | null

  created_at: string
  updated_at: string
}

