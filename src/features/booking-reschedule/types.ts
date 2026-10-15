// ── Reschedule request / response shapes ──────────────────────────────────

/**
 * Body for `PATCH /api/v1/bookings/{booking_id}/reschedule`.
 *
 * Exactly one of `new_slot_id` / `custom_session_start` must be provided.
 * Sending both or neither is a 422 server-side; `new_session_start` is
 * only valid alongside `new_slot_id` (sub-unit granularity inside a
 * parent slot).
 *
 *   new_slot_id           — UUID of an availability slot on THIS booking's
 *                           mentor's calendar. Backend rejects cross-mentor
 *                           slots (404). Mutually exclusive with
 *                           `custom_session_start`.
 *   new_session_start     — optional ISO-8601 datetime inside `new_slot`.
 *                           Omit (or send `null`) for the basic flow — the
 *                           booking lands at `new_slot.start_time`. Set to
 *                           a sub-unit start time sourced from
 *                           `GET /availability/mentor/{id}/bookable-units?package_id=...`
 *                           when the booking has a package and the caller
 *                           wants sub-unit granularity. Server validates
 *                           the value fits in the slot window and doesn't
 *                           overlap another confirmed booking.
 *   custom_session_start  — ISO-8601 datetime for a brand-new start time.
 *                           Backend will reuse an existing slot that fully
 *                           contains `[start, end)`, 409 on partial
 *                           overlap, or auto-create a new slot. Duration
 *                           is auto-derived from the booking's package
 *                           (if attached) or the booking's original
 *                           `session_end - session_start`. Mutually
 *                           exclusive with `new_slot_id` /
 *                           `new_session_start`.
 *   reason                — optional free-text, ≤ 2000 chars, included in
 *                           the mentee notification. Empty string
 *                           normalises to `null` server-side so the email
 *                           copy renders "no reason given" cleanly.
 */
export type RescheduleRequest =
  | {
      new_slot_id: string
      new_session_start?: string | null
      custom_session_start?: never
      reason?: string | null
    }
  | {
      new_slot_id?: never
      new_session_start?: never
      custom_session_start: string
      reason?: string | null
    }

/**
 * Server response from the reschedule PATCH. The full `BookingResponse`
 * shape comes back; the modal only reads the four fields below. Callers that
 * need richer fields (payment, meeting_link, mentee, etc.) should refetch
 * their bookings list, which the mutation invalidates.
 *
 * Status / payment / package / review token / meeting link are all preserved
 * server-side — only `slot_id` / `session_start` / `session_end` change.
 */
export interface RescheduleBookingResponse {
  id: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  slot_id: string | null
  session_start: string
  session_end: string
}

// ── UI-facing booking summary ─────────────────────────────────────────────

/**
 * Minimal booking fields the reschedule modal needs. Decouples the modal
 * from `MentorBooking` (mentor side) and `AdminBookingRow` (admin side) —
 * each call site projects its full booking down to this shape.
 *
 *   mentor_id      — MentorProfile.id, used to fetch the mentor's future
 *                    free availability slots. AdminBookingRow exposes this
 *                    as `booking.mentor.id`; MentorBooking exposes it as a
 *                    top-level string. Both work here.
 *   mentor_name    — for modal title ("Reschedule session with {name}")
 *                    and toast copy.
 *   mentee_first_name — used in the success toast:
 *                    "Session rescheduled — {mentee first name} has been
 *                    notified."
 */
export interface ReschedulableBooking {
  id: string
  /** Includes `'no_show'` for mentor-side bookings; the eligibility helper
   *  filters that out. `string` here keeps the type usable from both the
   *  mentor (`MentorBooking.status` includes no_show) and admin
   *  (`AdminBookingStatus` doesn't) call sites without an explicit cast. */
  status: string
  slot_id: string | null
  /** Drives which availability endpoint the modal queries for the slot
   *  picker:
   *    - non-null → `bookable-units?package_id=...` (sub-units);
   *    - null     → raw `availability` endpoint (basic flow, one row per
   *                 parent slot). Legacy "duration-only" bookings don't
   *                 support sub-unit selection. */
  package_id: string | null
  /** session_start at the time the modal opened — used to identify the
   *  currently-booked sub-unit so we can exclude it from the picker
   *  (otherwise the no-op sub-unit shows up as a "free" target). */
  session_start: string
  session_end: string
  mentor_id: string
  mentor_name: string
  mentee_first_name: string
}
