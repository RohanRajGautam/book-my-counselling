import { useMutation } from '@tanstack/react-query'

import { validatePromoCode } from '../api/promo-codes.api'
import type {
  PromoCodeValidationRequest,
  PromoCodeValidationResponse,
} from '../types/promo-codes.types'

/**
 * Side-effect-free preview of a promo discount. No global invalidation — the
 * caller (booking page) wires toasts and applies the result locally.
 */
export function useValidatePromoCode() {
  return useMutation<
    PromoCodeValidationResponse,
    unknown,
    PromoCodeValidationRequest
  >({
    mutationFn: (payload) => validatePromoCode(payload),
  })
}