import axios, { AxiosError } from 'axios'

/**
 * Translate FastAPI 4xx responses from `/promo-codes/validate` into a single
 * user-facing string. The backend uses standard error bodies; we map per the
 * table in the promo-code spec.
 */
export function promoCodeErrorMessage(err: unknown): string | null {
  if (!axios.isAxiosError(err)) return null

  const axiosErr = err as AxiosError<{ detail?: string | unknown[] }>
  const detail = axiosErr.response?.data?.detail
  const status = axiosErr.response?.status

  if (status === 404) {
    if (typeof detail === 'string' && /mentor/i.test(detail)) {
      return 'We could not find that mentor. Please refresh and try again.'
    }
    return 'Invalid promo code.'
  }

  if (status === 400 && typeof detail === 'string') {
    if (/is inactive/i.test(detail)) {
      return 'This code is no longer active.'
    }
    if (/expired on/i.test(detail)) {
      return 'This code has expired.'
    }
    if (/makes the booking free/i.test(detail)) {
      return "This code can't be combined with the current price. Contact support."
    }
    return detail
  }

  if (typeof detail === 'string') return detail
  return null
}