import api from '@/lib/api/axios'
import type { CalendlyLinkResponse, CalendlyPrefillResponse } from '../types/calendly'

/**
 * Fetch a mentor's Calendly scheduling URL (public).
 * Returns null calendly_link if the mentor hasn't set one up.
 */
export async function getMentorCalendlyLink(
  mentorId: string
): Promise<CalendlyLinkResponse> {
  const response = await api.get<CalendlyLinkResponse>(
    `/calendly/mentors/${mentorId}/link`
  )
  return response.data
}

/**
 * Fetch prefill data for the Calendly embed widget (authenticated).
 * Called after a booking is created to get the data needed to open the widget.
 */
export async function getCalendlyPrefill(
  mentorId: string,
  bookingId: string
): Promise<CalendlyPrefillResponse> {
  const response = await api.get<CalendlyPrefillResponse>(
    `/calendly/mentors/${mentorId}/prefill`,
    { params: { booking_id: bookingId } }
  )
  return response.data
}
