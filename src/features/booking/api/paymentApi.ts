import apiClient from '@/lib/api/api-client'
import type { QRData, PaymentStatus } from '../types/payment'

export async function initiatePayment(bookingId: string): Promise<QRData> {
  const response = await apiClient.post<QRData>('/payments/initiate', {
    booking_id: bookingId,
  })
  return response.data
}

export async function fetchPaymentStatus(transactionId: string): Promise<PaymentStatus> {
  const response = await apiClient.get<PaymentStatus>(`/payments/status/${transactionId}`)
  return response.data
}
