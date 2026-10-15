import apiClient from '@/lib/api/api-client'
import type {
  RescheduleBookingResponse,
  RescheduleRequest,
} from '../types'

/**
 * PATCH /api/v1/bookings/{booking_id}/reschedule.
 *
 * The server-side role gate handles who is allowed to move which booking:
 *   - Mentor: only on bookings they own (their mentor_id matches the
 *             booking). Otherwise 403 "Not your booking".
 *   - Admin : any booking.
 *   - Mentee: 403 "Mentees cannot reschedule sessions" (callers should
 *             not surface this action to mentees today).
 *
 * Status / payment / package / review token / Google Meet link are all
 * preserved; only `slot_id`, `session_start`, `session_end` change.
 *
 * Side effects (handled by the backend):
 *   - Old slot: `is_booked = False`
 *   - New slot: `is_booked = True`
 *   - Role-aware reschedule emails (mentee + the *other* party)
 *   - Cache busts: `mentor_search:*`, `mentor_detail:{id}`
 *   - Schedules `sync_availability_flags(mentor_id)` for ES re-sync
 *
 * Re-PATCHing with the same slot returns 422 "New slot is the same as the
 * current slot." so this mutation is not safely idempotent — the modal
 * disables the submit button while a request is in flight.
 */
export async function rescheduleBooking(
  bookingId: string,
  payload: RescheduleRequest,
): Promise<RescheduleBookingResponse> {
  const response = await apiClient.patch<RescheduleBookingResponse>(
    `/bookings/${bookingId}/reschedule`,
    payload,
  )
  return response.data
}
