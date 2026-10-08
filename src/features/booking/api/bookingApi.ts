import apiClient from '@/lib/api/api-client'
import type { MeetingProvider } from '../types/payment'

export interface GuestBookingPayload {
  // Mentee contact
  full_name: string
  email: string
  phone: string
  // Booking target
  mentor_id: string
  slot_id?: string
  package_id?: string
  session_start?: string
  session_end?: string
  // Intake
  goals: string
  current_school?: string
  guardian_phone?: string
  preparation_notes?: string
  mentee_timezone?: string
  topic?: string
  // Optional promo code — upper-cased or lower-cased, both accepted.
  promo_code?: string
}

export interface GuestBookingResult {
  booking_id: string
  /** Net amount the mentee will pay to Fonepay (post-discount). */
  agreed_price: string
  /** Gross price before any promo discount. */
  original_price: string
  /** Promo discount applied. `0` when no code was used. */
  discount_amount: string
  /** The promo code applied, or `null` when none. */
  promo_code: string | null
  session_start: string
  session_end: string
  mentor_name: string
  package_title: string | null
  payment_status: string
  /** Auto-created Google Meet link. Null while in-flight. */
  meeting_link: string | null
  meeting_id: string | null
  meeting_provider: MeetingProvider
  meeting_error: string | null
  meeting_attempts: number
}

export async function createGuestBooking(
  payload: GuestBookingPayload
): Promise<GuestBookingResult> {
  const response = await apiClient.post<GuestBookingResult>('/bookings/guest', payload)
  return response.data
}

/**
 * Response shape for `GET /bookings/{id}` — the mentee's source-of-truth
 * booking detail. Today this exists to read `meeting_link` after a 100%-off
 * promo booking (no Fonepay WS push), and after a page refresh mid-flow.
 */
export interface BookingDetail {
  id: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  payment_status: 'unpaid' | 'paid' | 'refunded' | 'failed'
  meeting_link: string | null
  meeting_id: string | null
  meeting_provider: MeetingProvider
  meeting_error: string | null
  meeting_attempts: number
}

export async function getBookingDetail(bookingId: string): Promise<BookingDetail> {
  const response = await apiClient.get<BookingDetail>(`/bookings/${bookingId}`)
  return response.data
}
