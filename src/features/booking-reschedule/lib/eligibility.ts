/**
 * Eligibility for the "Reschedule" entry point.
 *
 * Two guards:
 *   1. The booking must be PENDING or CONFIRMED. COMPLETED and CANCELLED
 *      return 409 from the server — the UI mirrors that.
 *   2. The booking must have a `slot_id`. Legacy "event-style" bookings
 *      (the spec mentions "AI skills for SEE and +2") were never bound to a
 *      real availability window — moving them returns 422. The UI mirrors
 *      that.
 *
 * Mentee-side role gating happens at the API; we don't surface the action to
 * mentees in the UI today, so no role check here.
 */
export function isReschedulable(booking: {
  status: string
  slot_id: string | null
}): boolean {
  const statusOk = booking.status === 'pending' || booking.status === 'confirmed'
  const hasSlot = booking.slot_id !== null
  return statusOk && hasSlot
}

/**
 * Compute the optional "Rescheduled" pill visibility from `updated_at` vs
 * `created_at`. Pure UI signal — backend has no `was_rescheduled` flag.
 *
 * Show when:
 *   - The booking is still in PENDING or CONFIRMED (a long-lived COMPLETED
 *     or CANCELLED with a 1+ minute gap doesn't read as reschedule evidence
 *     anymore — it reads as lifecycle churn).
 *   - The gap between `updated_at` and `created_at` is at least one minute
 *     (filters out the normal "row was created and immediately touched"
 *     churn).
 */
export function wasLikelyRescheduled(
  booking: {
    status: string
    created_at: string
    updated_at: string
  },
  oneMinuteMs = 60_000,
): boolean {
  if (booking.status !== 'pending' && booking.status !== 'confirmed') return false
  const created = new Date(booking.created_at).getTime()
  const updated = new Date(booking.updated_at).getTime()
  if (Number.isNaN(created) || Number.isNaN(updated)) return false
  return updated - created >= oneMinuteMs
}
