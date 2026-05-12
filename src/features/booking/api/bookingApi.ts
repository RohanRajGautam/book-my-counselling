import apiClient from '@/lib/api/api-client'

export interface GuestBookingPayload {
  // Mentee contact
  full_name: string
  email: string
  phone: string
  // Booking target
  mentor_id: string
  slot_id: string
  package_id?: string
  // Intake
  goals: string
  current_school?: string
  guardian_phone?: string
  preparation_notes?: string
  mentee_timezone?: string
  topic?: string
}

export interface GuestBookingResult {
  booking_id: string
  agreed_price: string
  session_start: string
  session_end: string
  mentor_name: string
  package_title: string | null
  payment_status: string
}

export async function createGuestBooking(
  payload: GuestBookingPayload
): Promise<GuestBookingResult> {
  const response = await apiClient.post<GuestBookingResult>('/bookings/guest', payload)
  return response.data
}
