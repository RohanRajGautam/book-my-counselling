import api from '@/lib/api/axios'
import type { BankInfo, QRData, PaymentStatus } from '../types/payment'

export async function fetchBanks(): Promise<BankInfo[]> {
  const response = await api.get<BankInfo[]>('/payments/banks')
  return response.data
}

export async function initiatePayment(
  bookingId: string,
  bankCode: string
): Promise<QRData> {
  const response = await api.post<QRData>('/payments/initiate', {
    booking_id: bookingId,
    bank_code: bankCode,
  })
  return response.data
}

export async function fetchPaymentStatus(transactionId: string): Promise<PaymentStatus> {
  const response = await api.get<PaymentStatus>(`/payments/status/${transactionId}`)
  return response.data
}
