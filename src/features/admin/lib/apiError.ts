import axios from 'axios'

/** The HTTP status of a failed request, or `null` if it wasn't an HTTP error. */
export function httpStatus(err: unknown): number | null {
  if (!axios.isAxiosError(err)) return null
  return err.response?.status ?? null
}

/** The FastAPI `{"detail": "..."}` string on a failed request, if any. */
export function errorDetail(err: unknown): string | null {
  if (!axios.isAxiosError(err)) return null
  const detail = err.response?.data?.detail
  return typeof detail === 'string' ? detail : null
}
