import { useMutation, useQueryClient } from '@tanstack/react-query'

import { rescheduleBooking } from '../api/reschedule.api'
import type { RescheduleRequest } from '../types'

interface RescheduleVars {
  bookingId: string
  payload: RescheduleRequest
}

/**
 * Mutation wrapper around `PATCH /api/v1/bookings/{id}/reschedule`.
 *
 * Invalidates every cache that lists bookings or that the backend
 * synchronously busts server-side, so refresh happens once and the next
 * render of any list/calendar hits fresh data:
 *
 *   - `['mentor', 'bookings']` — both mentor list views
 *   - `['admin', 'bookings']`  — admin list
 *   - `['mentor', 'stats']` and `['admin', 'analytics', 'stats']` — counts
 *     on the dashboards
 *   - `['mentor', 'availability']`, `['admin', 'mentor-availability']`,
 *     `['mentor-availability']`, `['mentor-bookable-units']` — the freed
 *     slot needs to reappear in pickers everywhere; the new booked slot
 *     needs to disappear
 *
 * Does NOT toast — the modal composes the success copy from caller context
 * (mentee first name, optional "by admin" footnote).
 */
export function useRescheduleBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ bookingId, payload }: RescheduleVars) =>
      rescheduleBooking(bookingId, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['mentor', 'bookings'] })
      void qc.invalidateQueries({ queryKey: ['admin', 'bookings'] })
      void qc.invalidateQueries({ queryKey: ['mentor', 'stats'] })
      void qc.invalidateQueries({ queryKey: ['admin', 'analytics', 'stats'] })
      void qc.invalidateQueries({ queryKey: ['mentor', 'availability'] })
      void qc.invalidateQueries({ queryKey: ['admin', 'mentor-availability'] })
      void qc.invalidateQueries({ queryKey: ['mentor-availability'] })
      void qc.invalidateQueries({ queryKey: ['mentor-bookable-units'] })
    },
  })
}
