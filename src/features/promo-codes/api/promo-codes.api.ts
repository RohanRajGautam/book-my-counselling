import apiClient from '@/lib/api/api-client'
import type {
  PromoCodeValidationRequest,
  PromoCodeValidationResponse,
} from '../types/promo-codes.types'

/**
 * Preview the discount for a promo code before submitting a booking.
 * Public — no auth header required.
 */
export async function validatePromoCode(
  payload: PromoCodeValidationRequest,
): Promise<PromoCodeValidationResponse> {
  const res = await apiClient.post<PromoCodeValidationResponse>(
    '/promo-codes/validate',
    payload,
  )
  return res.data
}