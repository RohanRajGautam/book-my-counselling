import apiClient from '@/lib/api/api-client'
import type { QRData, PaymentStatus } from '../types/payment'

/**
 * Initiate a Fonepay Intent QR payment for a booking.
 * No bank selection needed — the QR works with all Fonepay-connected banks.
 */
export async function initiatePayment(bookingId: string): Promise<QRData> {
  const response = await apiClient.post<QRData>('/payments/initiate', {
    booking_id: bookingId,
  })
  return response.data
}

/**
 * Poll the backend for the current payment status of a transaction.
 */
export async function fetchPaymentStatus(transactionId: string): Promise<PaymentStatus> {
  const response = await apiClient.get<PaymentStatus>(`/payments/status/${transactionId}`)
  return response.data
}
